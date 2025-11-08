import mongoose from "mongoose";

const Schema = mongoose.Schema;

const PriceSchema = new Schema ({
  city:{ type: String, required: true },
  region:{ type: String, required: true },
  basePrice:{ type: Number, required: true },
  pricePerOneLessThree:{ type: Number, required: true },
  pricePerOneLessSix:{ type: Number, required: true },
  pricePerOneLessTwelve:{ type: Number, required: true },
  pricePerOneLessFifteen:{ type: Number, required: true },
})

const PriceToPVZ = mongoose.model("PriceToPVZ", PriceSchema);
export default PriceToPVZ;