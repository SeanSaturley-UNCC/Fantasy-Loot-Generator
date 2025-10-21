<<<<<<< HEAD
const mongoose = require('mongoose')
=======
import mongoose from 'mongoose'
>>>>>>> b8fc497 (adding model and controller for sessions)
const { Schema } = mongoose

const schema = new Schema({
    userId: { type: String, required: true },
    active: { type: Boolean, required: true },
<<<<<<< HEAD
    token: { type: String, required: true }
=======
    token: { type: String, required: true}
>>>>>>> b8fc497 (adding model and controller for sessions)
}, {
    timestamps: true,
    versionKey: false
})
<<<<<<< HEAD

const Session = mongoose.model('Session', schema)

module.exports = { Session }
=======
export const Session = mongoose.model('Session', schema)
>>>>>>> b8fc497 (adding model and controller for sessions)
