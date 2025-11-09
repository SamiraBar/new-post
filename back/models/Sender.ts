import mongoose from "mongoose";

export interface ISender extends mongoose.Document {
    fullName: string;
    phoneNumber: string;
    email: string;
    description: string;
    createdAt: Date;
}

const SenderSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: [true, 'Sender full name is required']
    },
    phoneNumber: {
        type: String,
        required: [true, 'Sender phone number is required'],
    },
    email: {
        type: String,
        required: [true, 'Sender email is required']
    },
    description: {
        type: String,
        required: [true, 'Package contents description is required']
    }
}, {
    timestamps: true
});

const Sender = mongoose.model<ISender>('Sender', SenderSchema);
export default Sender;