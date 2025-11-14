import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const PickupCitySchema = new Schema({
    name: {
        type: String,
        required: [true, 'City name is required'],
        trim: true,
    },
    region: {
        type: String,
        required: false,
        trim: true,
    }
});

const PickupCity = mongoose.model('PickupCity', PickupCitySchema);
export default PickupCity;
