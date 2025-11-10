import mongoose from "mongoose";

export interface IRecipient extends mongoose.Document {
    fullName: string;
    phoneNumber: string;
    city: string;
    address: string;
    createdAt: Date;
    updatedAt: Date;
}

const RecipientSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: [true, 'Recipient`s Name is required']
    },
    phoneNumber: {
        type: String,
        required: [true, 'Recipient phone number is required'],
    },
    city: {
        type: String,
        required: [true, 'Recipient city is required']
    },
    address: {
        type: String,
        required: [true, 'Recipient address is required']
    },
    type: {
        type: String,
        required: true,
        enum: ['sender', 'recipient']
    }
}, {
    timestamps: true
});

const Recipient = mongoose.model<IRecipient>('Recipient', RecipientSchema);
export default Recipient;