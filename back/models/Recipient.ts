import mongoose from "mongoose";

const RecipientSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: async (value: string) => {
                const recipient = await Recipient.findOne({ title: value });
                if (recipient) return false;
                return true;
            },
            message: "Recipient title is unique",
        }
    },
    description: String,
});

const Recipient = mongoose.model('Sender', RecipientSchema);
export default Recipient;