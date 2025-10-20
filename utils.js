const bcrypt = require('bcrypt')
const Session = require('./models/Session')
const User = require('./models/User')

exports.handleError = async (err, res) => {
    console.log(err)
    const error = {
        errCode: err.statusCode ? err.statusCode : 500,
        message: err.message
    }

    res.status(error.errCode).json({ message: error.message })
}

exports.hashPassword = async (oldValue) => {
    const saltRounds = 10
    const salt = await bcrypt.genSalt(saltRounds)
    const newValue = await bcrypt.hash(oldValue, salt)

    return newValue
}

exports.authenticate = async (req, res, next) => {
    try {
        // if (!checkAPI(req)) {
        //     return res.status(401).end()
        // }

        const userCookie = req.signedCookies.User
        const sessionExists = await Session.Session.findOne({
            token: userCookie,
            active: true
        })
        if (sessionExists) {
            const currentUser = await User.findOne({
                _id: sessionExists.userId
            }).lean()
            if (currentUser) {
                res.locals.user = currentUser
            }
            return next()
        }
        res.status(403).json({ message: 'This action is not allowed' })
    } catch (err) {
        console.log('err ==> ', err)
        res.status(403).json({ message: 'Failed to Authenticate.' })
    }
}
