import { Document, Model,ObjectId } from "mongoose";

export interface IMessageDocument extends Document {
  _id: string;
  senderId: ObjectId;
  receiverId: ObjectId;
  message: string;
}

export interface IMessageCollection extends Model<IMessageDocument> { }