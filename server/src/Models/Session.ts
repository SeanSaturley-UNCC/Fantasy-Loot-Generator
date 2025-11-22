import mongoose, { Document, Schema } from 'mongoose'

// Interface for Session document
export interface SessionDocument extends Document {
    userId: string
    active: boolean
    token: string
    createdAt: Date
    updatedAt: Date
}

const schema = new Schema<SessionDocument>({
    userId: { type: String, required: true },
    active: { type: Boolean, required: true },
    token: { type: String, required: true}
}, {
    timestamps: true,
    versionKey: false
})

const Session = mongoose.model<SessionDocument>('Session', schema)

export { Session }
