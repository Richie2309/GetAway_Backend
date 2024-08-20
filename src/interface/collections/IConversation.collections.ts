import { Document, Model, ObjectId } from "mongoose";
import { IMessageDocument } from "./IMessage.collections";

export interface IUnreadMessage {
  userId: string;
  count: number;
}

export interface IConversationDocument extends Document {
  _id: string;
  participants: ObjectId[];
  messages: ObjectId[] ;
  unreadMessages: IUnreadMessage[];
}

export interface IConversationCollection extends Model<IConversationDocument> { }