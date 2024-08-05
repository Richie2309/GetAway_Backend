import mongoose, { Schema } from "mongoose";
import { IBookingCollection, IBookingDocument } from "../../interface/collections/IBooking.collection";

const bookingSchema = new Schema({
  accommodation: {
    type: Schema.Types.ObjectId,
    ref: 'Accommodations',
    required: true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'Users',
    required: true
  },
  checkInDate: {
    type: Date,
    required: true
  },
  checkOutDate: {
    type: Date,
    required: true
  },
  guests: {
    type: Number,
    required: true
  },
  totalPrice: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['Booked', 'Pending', 'Cancelled'],
    default: 'Pending'
  },
  bookedAt: {
    type: Date,
    default: Date.now
  },
  isCancelled: {
    type: Boolean,
    default: false
  },
  cancelledAt: {
    type: Date,
    required: false
  }
  // Add more fields if necessary, e.g., booking status, number of guests, etc.
}, {
  timestamps: true
});

const Bookings : IBookingCollection= mongoose.model<IBookingDocument>('Bookings',bookingSchema)
export default Bookings;
