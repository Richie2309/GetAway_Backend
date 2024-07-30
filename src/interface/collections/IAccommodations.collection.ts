import { Document, Model, ObjectId } from "mongoose";

export interface IAccommodationDocument extends Document {
  added_by: ObjectId;
  _id: string;
  title: string;
  pincode: number;
  town: string;
  district: string;
  state: string;
  address: string;
  photos: string[];
  description: string;
  maxGuests: number;
  bathrooms: number;
  bedrooms: number;
  beds: number;
  perks: boolean;
  checkInTime: string;
  checkOutTime: string;
  price_per_night: number;
}

export interface IAccommodationCollection extends Model<IAccommodationDocument> { }