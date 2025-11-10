import mongoose from "mongoose";

export interface ISender extends mongoose.Document {
    fullName: string;
    phoneNumber: string;
    city: string;
    address: string;
    createdAt: Date;
    updatedAt: Date;
}

const SenderSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: [true, 'Sender Name is required']
    },
    phoneNumber: {
        type: String,
        required: [true, 'Sender phone number is required'],
    },
    city: {
        type: String,
        required: [true, 'Sender city is required']
    },
    address: {
        type: String,
        required: [true, 'Sender address is required']
    }
}, {
    timestamps: true
});

const Sender = mongoose.model<ISender>('Sender', SenderSchema);
export default Sender;