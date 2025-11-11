import mongoose from "mongoose";

const Schema = mongoose.Schema;

const baseFields = {
  city: { type: String, required: true },
  basePrice: { type: Number, required: true },
};

const handFields = {
  ...baseFields,
  country: { type: String, required: true },
  tariffZone: { type: Number, required: true },
  pricePerOneKg: { type: Number, required: true },
};

const pvzFields = {
  ...baseFields,
  region: { type: String, required: true },
  pricePerOneLessThree: { type: Number, required: true },
  pricePerOneLessSix: { type: Number, required: true },
  pricePerOneLessTwelve: { type: Number, required: true },
  pricePerOneLessFifteen: { type: Number, required: true },
};

const PriceToHandSchema = new Schema(handFields);
const PriceToPVZSchema = new Schema(pvzFields);

export const Price = mongoose.model("PriceToHand", PriceToHandSchema);
export const PriceToPVZ = mongoose.model("PriceToPVZ", PriceToPVZSchema);