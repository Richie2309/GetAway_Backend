import mongoose, { Schema } from "mongoose";
import { IAccommodationCollection, IAccommodationDocument } from "../../interface/collections/IAccommodations.collection";

const accommodationSchema = new Schema({
  added_by: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Users'
  },
  title: {
    type: String,
    required: true,
    maxlength: 32
  },
  pincode: {
    type: String,
    required: false
  },
  town: {
    type: String,
    required: true
  },
  district: {
    type: String,
    required: true
  },
  state: {
    type: String,
    required: true
  },

  address: {
    type: String,
    required: true
  },
  latitude: {
    type: String,
    required: false,
  },
  longitude: {
    type: String,
    required: false,
  },
  photos: [{
    type: String,
    default: '',
  }],
  description: {
    type: String,
    required: true,
    maxlength: 400
  },
  maxGuests: {
    type: Number,
    required: true
  },
  bathrooms: {
    type: Number,
    required: true
  },
  bedrooms: {
    type: Number,
    required: true
  },
  beds: {
    type: Number,
    required: true
  },
  perks: {
    type: [String], 
    enum: ["Wifi", "AC", "TV", "Parking"],
    default: [] 
  },
  checkInTime: {
    type: String,
    required: true
  },
  checkOutTime: {
    type: String,
    required: true
  },
  price_per_night: {
    type: Number,
    required: true
  },
  isverified: {
    type: Boolean,
    required: true,
    default: false
  },
  rejectionReason: {
    type: String,
    required: false
  } 
}, {
  timestamps: true
});

accommodationSchema.index({ town: 'text', district: 'text', state: 'text' });

const Accommodations: IAccommodationCollection = mongoose.model<IAccommodationDocument>('Accommodations', accommodationSchema)
export default Accommodations