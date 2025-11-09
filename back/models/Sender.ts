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
        required: [true, 'ФИО отправителя обязательное поле']
    },
    phoneNumber: {
        type: String,
        required: [true, 'Телефон отправителя обязательное поле'],
    },
    city: {
        type: String,
        required: [true, 'Город отправителя обязательное поле']
    },
    address: {
        type: String,
        required: [true, 'Адрес отправителя обязательное поле']
    }
}, {
    timestamps: true
});

const Sender = mongoose.model<ISender>('Sender', SenderSchema);
export default Sender;