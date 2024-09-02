import { Document, Model, ObjectId } from "mongoose";

export interface IReviewDocument extends Document {
  accommodation: ObjectId;
  user: ObjectId;
  rating: number;
  comment: string;
}

export interface IReviewCollection extends Model<IReviewDocument> { }