const mongoose = require('mongoose')
const { Schema } = mongoose

const schema = new Schema({
    userId: { type: String, required: true },
    active: { type: Boolean, required: true },
    token: { type: String, required: true}
}, {
    timestamps: true,
    versionKey: false
})

const Session = mongoose.model('Session', schema)

module.exports = { Session }
