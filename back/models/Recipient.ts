import mongoose from "mongoose";

export interface IRecipient extends mongoose.Document {
    fullName: string;
    phoneNumber: string;
    email: string;
    address: string;
    createdAt: Date;
}

const RecipientSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: [true, 'Recipient full name is required']
    },
    phoneNumber: {
        type: String,
        required: [true, 'Recipient phone number is required'],
    },
    email: {
        type: String,
        required: [true, 'Recipient email is required']
    },
    address: {
        type: String,
        required: [true, 'Recipient address is required']
    }
}, {
    timestamps: true
});

const Recipient = mongoose.model<IRecipient>('Recipient', RecipientSchema);
export default Recipient;