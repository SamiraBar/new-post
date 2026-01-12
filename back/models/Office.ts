import mongoose, { Schema } from 'mongoose';

interface OfficeTypes {
  name: string;
  address: string;
  mapUrl: string;
  isActive: boolean,
  city: string,
  label: string,
  phone: string,
  worktime: string,
  createdAt: Date,
}

const OfficeSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  mapUrl: {
    type: String,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },

  city: {
    type: String,
    required: true,
    lowercase: true
  },
  label: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  worktime: {
    type: String,
  }
  ,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Office = mongoose.model<OfficeTypes>('Office', OfficeSchema);
export default Office;