import mongoose from 'mongoose';

export interface IPriceToPvz extends mongoose.Document {
    city: string;
    distributionCenter: string;
    basePrice: number;
    region: string;
    pricePerOneLessThree: number;
    pricePerOneLessSix: number;
    pricePerOneLessTwelve: number;
    pricePerOneLessFifteen: number;
}

const PriceToPvzSchema = new mongoose.Schema({
    city: { type: String, required: true },
    distributionCenter: { type: String, required: true },
    basePrice: { type: Number, required: true },
    region: { type: String, required: true },
    pricePerOneLessThree: { type: Number, required: true },
    pricePerOneLessSix: { type: Number, required: true },
    pricePerOneLessTwelve: { type: Number, required: true },
    pricePerOneLessFifteen: { type: Number, required: true },
});

const PriceToPvz = mongoose.model<IPriceToPvz>('PriceToPvz', PriceToPvzSchema, 'pricetopvzs');
export default PriceToPvz;