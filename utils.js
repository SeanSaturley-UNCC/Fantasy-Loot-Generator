const bcrypt = require('bcrypt')

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
