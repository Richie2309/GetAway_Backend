import { Document, Model, ObjectId } from "mongoose";

export interface IBookingDocument extends Document {
  _id: string;
  accommodation: ObjectId;
  user: ObjectId;
  checkInDate: Date;
  checkOutDate: Date;
  guests: number;
  totalPrice: number;
  status: 'Booked' | 'Pending' | 'Cancelled';
  bookedAt: Date;
  isCancelled: boolean;
  cancelledAt?: Date;
}

export interface IBookingCollection extends Model<IBookingDocument> { } 

export interface IPaymentIntent {
  amount: number;
  currency: string;
  client_secret?: string | null;
}

