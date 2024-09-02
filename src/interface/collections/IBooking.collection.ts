import { Document, Model, ObjectId } from "mongoose";
import { IAccommodationDocument } from "./IAccommodations.collection";

export interface IBookingDocument extends Document {
  _id: string;
  accommodation: ObjectId;
  user: ObjectId;
  checkInDate: Date;
  checkOutDate: Date;
  guests: number;
  paymentIntentId: string;
  totalPrice: number;
  status: 'Booked' | 'Completed' | 'Cancelled';
  bookedAt: Date;
  isCancelled: boolean;
  refundStatus:'Not Applicable'| 'Pending'| 'Completed',
  refundAmount:number,
  cancelledAt?: Date;
}

export interface IBookingCollection extends Model<IBookingDocument> { } 

export interface IPaymentIntent {
  amount: number;
  currency: string;
  client_secret?: string | null;
}

export interface IAccommodationWithBookingDetails {
  bookingId: string;
  accommodation: IAccommodationDocument;
  guests: number;
  totalPrice: number;
  status: string;
  checkInDate: Date;
  checkOutDate: Date;
  isCancelled: boolean;
  bookedAt: Date
}