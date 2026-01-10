import mongoose from "mongoose";

export interface ISocialMedia extends mongoose.Document {
  name: string;
  url: string;
  icon: string; // Путь: "uploads/social/instagram.png"
  order: number;
}

const SocialMediaSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      unique: true, // ✅ Валидация дублей на уровне БД
    },
    url: {
      type: String,
      required: [true, "URL is required"],
      trim: true,
      validate: {
        validator: function (value: string) {
          return /^https?:\/\/.+/.test(value);
        },
        message: "URL must start with http:// or https://",
      },
    },
    icon: {
      type: String,
      required: [true, "Icon is required"],
      trim: true,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

const SocialMedia = mongoose.model<ISocialMedia>(
  "SocialMedia",
  SocialMediaSchema,
);
export default SocialMedia;
