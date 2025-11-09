import mongoose from "mongoose";
import Sender, { ISender } from "./Sender";
import Recipient, { IRecipient } from "./Recipient";

const Schema = mongoose.Schema;

export interface IParcel extends mongoose.Document {
    trackingNumber: string;
    partnerTrackingNumber?: string;
    sender: mongoose.Types.ObjectId | ISender;
    recipient: mongoose.Types.ObjectId | IRecipient;
    originCity: string;
    destinationCity: string;
    status: 'created' | 'in_transit' | 'delivered';
    isPaid: boolean;
    partnerStickerReceived: boolean;
    weight: number;
    declaredValue: number;
    senderFullName?: string;
    recipientFullName?: string;
    recipientPhoneNumber?: string;
    createdAt: Date;
}

const ParcelSchema = new Schema({
    trackingNumber: {
        type: String,
        required: [true, 'Tracking number is required'],
        unique: true
    },
    partnerTrackingNumber: {
        type: String,
        default: null
    },
    sender: {
        type: Schema.Types.ObjectId,
        ref: "Sender",
        required: true,
        validate: {
            validator: async (value: string) => {
                const sender = await Sender.findById(value);
                return !!sender;
            },
            message: "Sender not found",
        },
    },
    recipient: {
        type: Schema.Types.ObjectId,
        ref: "Recipient",
        required: true,
        validate: {
            validator: async (value: string) => {
                const recipient = await Recipient.findById(value);
                return !!recipient;
            },
            message: "Recipient not found",
        },
    },
    originCity: {
        type: String,
        required: [true, 'Origin city is required']
    },
    destinationCity: {
        type: String,
        required: [true, 'Destination city is required']
    },
    status: {
        type: String,
        enum: ['created', 'in_transit', 'delivered', 'cancelled'],
        default: 'created'
    },
    isPaid: {
        type: Boolean,
        default: false
    },
    partnerStickerReceived: {
        type: Boolean,
        default: false
    },
    weight: {
        type: Number,
        required: [true, 'Weight is required'],
        min: [0.1, 'Weight must be greater than 0']
    },
    declaredValue: {
        type: Number,
        default: 0,
        min: [0, 'Declared value cannot be negative']
    }
}, {
    timestamps: true
});

ParcelSchema.virtual('senderFullName').get(function(this: IParcel) {
    const sender = this.sender as ISender;
    return sender.fullName;
});

ParcelSchema.virtual('recipientFullName').get(function(this: IParcel) {
    const recipient = this.recipient as IRecipient;
    return recipient.fullName;
});

ParcelSchema.virtual('recipientPhoneNumber').get(function(this: IParcel) {
    const recipient = this.recipient as IRecipient;
    return recipient.phoneNumber;
});

ParcelSchema.set('toJSON', { virtuals: true });

const Parcel = mongoose.model<IParcel>('Parcel', ParcelSchema);
export default Parcel;