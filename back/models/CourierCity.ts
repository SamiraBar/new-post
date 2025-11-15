import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const CourierCitySchema = new Schema({
    nameCity: {
        type: String,
        required: [true, 'City name is required'],
        trim: true,
    },
    country: {
        type: String,
        required: false,
        trim: true,
    }
});

const CourierCity = mongoose.model('CourierCity', CourierCitySchema);
export default CourierCity;
