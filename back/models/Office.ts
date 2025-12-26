import mongoose, { Schema } from 'mongoose';

interface OfficeTypes {
  name: string;
  address: string;
  mapUrl: string;
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
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
  }
});

const Office = mongoose.model<OfficeTypes>('Office', OfficeSchema);
export default Office;