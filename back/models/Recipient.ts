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
        required: [true, 'ФИО получателя обязательное поле']
    },
    phoneNumber: {
        type: String,
        required: [true, 'Телефон получателя обязательное поле'],
    },
    email: {
        type: String,
        required: [true, 'Email получателя обязательное поле']
    },
    address: {
        type: String,
        required: [true, 'Адрес получателя обязательное поле']
    }
}, {
    timestamps: true
});

const Recipient = mongoose.model<IRecipient>('Recipient', RecipientSchema);
export default Recipient;