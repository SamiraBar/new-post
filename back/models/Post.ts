import mongoose from "mongoose";
import Sender from "./Sender";
import Recipient from "./Recipient";

const Schema = mongoose.Schema;

const PostSchema = new Schema({
    sender: {
        type: Schema.Types.ObjectId,
        ref: "Sender",
        required: true,
        validate:  {
            validator: async (value: string) => {
                const sender = await Sender.findById(value);
                return  !!sender;
            },
            message: "Sender not found",
        },
    },
    recipient: {
        type: Schema.Types.ObjectId,
        ref: "Recipient",
        required: true,
        validate:  {
            validator: async (value: string) => {
                const recipient = await Recipient.findById(value);
                return  !!recipient;
            },
            message: "Recipient not found",
        },
    },
    title: {
        type: String,
        required: [true, 'Заголовок обязательное поле'],
    },
    price: {
        type: Number,
        required: [true, 'Стоимость обязательное поле'],
        validate: [
            {
                validator: async (value: string) => {
                    return !isNaN(+value);
                },
                message: "Price must be number",
            },
        ]
    },
    description: {
        type: String,
        default: null,
    },
    image: {
        type: String,
        default: null,
    },
    seller: {
        type: Schema.Types.ObjectId,
        ref: "User",
    }
});


const Post = mongoose.model('Post', PostSchema);
export default Post;