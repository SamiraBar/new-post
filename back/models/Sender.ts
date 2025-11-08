import mongoose from "mongoose";

const SenderSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: async (value: string) => {
                const sender = await Sender.findOne({ title: value });
                if (sender) return false;
                return true;
            },
            message: "Sender title is unique",
        }
    },
    description: String,
});

const Sender = mongoose.model('Sender', SenderSchema);
export default Sender;