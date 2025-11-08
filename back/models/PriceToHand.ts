import mongoose from "mongoose";

const Schema = mongoose.Schema;

const PriceSchema = new Schema ({
  city:{ type: String, required: true },
  country:{ type: String, required: true },
  tariffZone:{ type: Number, required: true },
  basePrice:{ type: Number, required: true },
  pricePerOneKg:{ type: Number, required: true },
})

const PriceToHand = mongoose.model("PriceToHand", PriceSchema);
export default PriceToHand;