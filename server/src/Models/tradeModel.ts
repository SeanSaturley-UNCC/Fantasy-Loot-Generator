import mongoose, { Schema } from 'mongoose'
import { TradeData } from '../Types'

// Define schema
const tradeSchema = new Schema(
    {
        offeredItems: [{
            type: Schema.Types.ObjectId,
            ref: 'Loot',
            required: true
        }],
        requestedItems: [{
            type: Schema.Types.ObjectId,
            ref: 'Loot',
            required: true
        }],
        offeredByUser: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        requestedFromUser: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        status: {
            type: String,
            enum: ['Pending', 'Accepted', 'Declined'],
            default: 'Pending',
            required: true
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
)

// Create model
export const Trade = mongoose.model<TradeData>('Trade', tradeSchema)
