import mongoose from "mongoose";

export interface IContact extends mongoose.Document {
    fullName: string;
    phoneNumber: string;
    email: string;
    address: string;
    description?: string;
    type: 'sender' | 'recipient';
    createdAt: Date;
}

const ContactSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: [true, 'Full name is required']
    },
    phoneNumber: {
        type: String,
        required: [true, 'Phone number is required'],
    },
    email: {
        type: String,
        required: [true, 'Email is required']
    },
    address: {
        type: String,
        required: [true, 'Address is required']
    },
    description: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['sender', 'recipient'],
        required: [true, 'Contact type is required']
    }
}, {
    timestamps: true
});

const Contact = mongoose.model<IContact>('Contact', ContactSchema);
export default Contact;