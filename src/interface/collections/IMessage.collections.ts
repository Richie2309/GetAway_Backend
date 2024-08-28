import { Document, Model, ObjectId } from "mongoose";

export interface IMessageDocument extends Document {
  _id: string;
  senderId: ObjectId;
  receiverId: ObjectId;
  message: string;
  type: 'text' | 'image' | 'video' | 'audio' | 'file';
}

export interface IMessageCollection extends Model<IMessageDocument> { }