import mongoose, { Document, Schema } from 'mongoose'
import bcrypt from 'bcrypt'

// Interface for User document
export interface UserDocument extends Document {
    username: string
    inventory: mongoose.Types.ObjectId[]
    password: string
    createdAt: Date
    updatedAt: Date
    comparePassword(candidatePassword: string): Promise<boolean>
}

// schema definition
const userSchema = new Schema<UserDocument>(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        inventory: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Loot',
            }
        ],
        password: {
            type: String,
            required: true,
            select: false // * when calling User.find(...) it will automatically hide the password (for security)
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
)

// instance method to compare passwords
userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
    return await bcrypt.compare(candidatePassword.toString(), this.password.toString())
}

const User = mongoose.model<UserDocument>('User', userSchema)

export default User
