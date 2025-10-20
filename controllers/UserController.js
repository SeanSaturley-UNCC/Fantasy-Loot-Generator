const { handleError, hashPassword } = require('../utils')
const User = require('../models/User')
const { createSession, findSession } = require('./SessionController')
const Session = require('../models/Session')

//* get one user by id
exports.getOneUser = async (req, res) => {
  try {
    const { id } = req.params
    const oneUser = await User.findOne({
      _id: id,
      deletedAt: {
        $exists: false
      }
    })
    if (!oneUser) {
      throw new Error('User not found')
    }
    res.status(200).json(oneUser)
  } catch (err) {
    handleError(err, res)
  }
}

//* login user
exports.loginUser = async (req, res) => {
  try {
    const { data } = req.body
    const foundUser = await User.findOne({
      $or: [
        { username: data.username },
        { 'email': data.username }
      ]
    }).select(['+password'])

    if (!foundUser) {
      throw new Error('User not found')
    }
    const check = await User.passwordCheck(data.password, foundUser.password)
    if (!check) {
      throw new Error('Invalid Username or Password')
    }

    await createSession(res, foundUser._id)

    const userWithoutPassword = await User.findOne({
      _id: foundUser._id
    })
    res.status(200).json(userWithoutPassword)
  } catch (err) {
    handleError(err, res)
  }
}

exports.logoutUser = async (req, res) => {
  try {
    const { userId } = req.params
    const userExists = await User.exists({
      _id: userId,
      deletedAt: {
        $exists: false
      }
    })
    if (!userExists) {
      throw new Error('User not found')
    }
    await Session.deleteOne({
      userId: userId
    })
    res.status(200).end()
  } catch (err) {
    handleError(err, res)
  }
}

exports.checkSession = async (req, res) => {
  try {
    const existingSession = await findSession(req)
    if (!existingSession) {
      res.status(400).json({ message: 'Session not found' })
      return
    }
    const loggedInUser = await User.findOne({
      _id: existingSession.userId
    })
    res.status(200).json(loggedInUser)
  } catch (err) {
    handleError(err, res)
  }
}

//* create user
exports.createUser = async (req, res) => {
  try {
    const { body } = req
    const nameInUse = await User.nameInUse('', body.username)

    if (nameInUse) {
      return res.status(400).json({ success: false, message: 'A user with that username already exists' })
    }

    const createdUser = await User.create({
      username: body.username,
      email: body.email,
      password: body.password
    })
    res.status(200).json(createdUser)
  } catch (err) {
    handleError(err, res)
  }
}

exports.setupUser = async (req, res) => {
  try {
    const { body } = req
    const { id } = req.params

    const user = await User.findOne({ _id: id })
    if (!user) {
      throw new Error('User not found')
    }
    if (user.activeAt) {
      throw new Error('User already activated')
    }

    const hashedPassword = await hashPassword(body.password)

    await User.updateOne(
      { _id: id },
      {
        $set: {
          ...body,
          activeAt: new Date(),
          password: hashedPassword
        }
      }
    )

    const newUser = await User.findOne({ _id: id })
    res.status(200).json(newUser)
  } catch (err) {
    handleError(err, res)
  }
}

// exports.updateUser = async (req, res) => {
//   try {
//     const { body } = req
//     const { id } = req.params
//     const userExists = await User.findOne({
//       _id: id,
//       deletedAt: { $exists: false }
//     })
//     if (!userExists) {
//       throw new Error('User not found')
//     }

//     const nameAlreadyUsed = await User.nameInUse(body.id, body.username)
//     if (nameAlreadyUsed && nameAlreadyUsed._id.toString() !== id) {
//       throw new Error('Username already in use')
//     }

//     await User.updateOne(
//       { _id: id },
//       { $set: body }
//     )

//     const updatedUser = await User.findOne({ _id: id })
//     res.status(200).json(updatedUser)
//   } catch (err) {
//     handleError(err, res)
//   }
// }

// exports.updateUserPassword = async (req, res) => {
//   try {
//     const { body } = req
//     const { id } = req.params
//     const userExists = await User.findOne({
//       _id: id,
//       deletedAt: { $exists: false }
//     }).select('+password')
//     if (!userExists) {
//       throw new Error('User not found')
//     }

//     const allowed = await User.passwordCheck(body.oldPassword, userExists.password)
//     if (!allowed) {
//       throw new Error('Incorrect password')
//     }
//     if (body.newPassword.length < 8) {
//       throw new Error('Password must be longer than 8 characters')
//     }

//     const hashed = await hashPassword(body.newPassword)

//     await User.updateOne(
//       { _id: id },
//       { $set: { password: hashed } }
//     )

//     res.status(200).json({ success: true })
//   } catch (err) {
//     handleError(err, res)
//   }
// }

//* get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .sort({ 'createdAt': -1 })

    res.status(200).json(users.reverse())
  } catch (err) {
    handleError(err, res)
  }
}
