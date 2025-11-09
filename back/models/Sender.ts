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
        required: [true, 'ФИО отправителя обязательное поле']
    },
    phoneNumber: {
        type: String,
        required: [true, 'Телефон отправителя обязательное поле'],
    },
    email: {
        type: String,
        required: [true, 'Email отправителя обязательное поле']
    },
    description: {
        type: String,
        required: [true, 'Опишите содержимое посылки']
    }
}, {
    timestamps: true
});

const Sender = mongoose.model<ISender>('Sender', SenderSchema);
export default Sender;