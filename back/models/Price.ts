import mongoose from "mongoose";

const Schema = mongoose.Schema;

const PriceSchema = new Schema ({
  city:{ type: String, required: true },
  region:{ type: String, required: true },
  basePrice:{ type: Number, required: true },
  pricePerOneLessThree:{ type: Number, required: true },
  pricePerOneLessSix:{ type: Number, required: true },
  pricePerOneLessTwelve:{ type: Number, required: true },
  pricePerOneLessFifth:{ type: Number, required: true },
})

const Price = mongoose.model("Price", PriceSchema);
export default Price;