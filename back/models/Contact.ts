import mongoose from "mongoose";

export interface IContact extends mongoose.Document {
  fullName: string;
  phoneNumber: string;
  email: string;
  address: string;
  description?: string;
  inn_passport?: string;
  type: "sender" | "recipient";
  createdAt: Date;
}

const ContactSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Full name is required"],
    },
    phoneNumber: {
      type: String,
      required: [true, "Phone number is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
    },
    description: {
      type: String,
      required: true,
    },
    inn_passport: {
      type: String,
      required: function (this: IContact) {
        return this.type === "sender";
      },
      validate: {
        validator: function (this: IContact, value: string) {
          if (this.type === "recipient") {
            return true;
          }

          if (this.type === "sender") {
            if (!value || value.trim().length === 0) {
              return false;
            }

            return /^(\d{10}|\d{12}|\d{14})$/.test(value.trim());
          }
          return true;
        },
        message: "INN must be 10 or 12 or 14 digits for sender",
      },
    },
    type: {
      type: String,
      enum: ["sender", "recipient"],
      required: [true, "Contact type is required"],
    },
  },
  {
    timestamps: true,
  }
);

const Contact = mongoose.model<IContact>("Contact", ContactSchema);
export default Contact;
