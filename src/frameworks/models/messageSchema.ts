import mongoose, { Schema } from "mongoose";
import { IMessageCollection, IMessageDocument } from "../../interface/collections/IMessage.collections";

const messageSchema = new Schema({
  senderId: {
    type: Schema.Types.ObjectId,
    ref: 'Users'
  },
  receiverId: {
    type: Schema.Types.ObjectId,
    ref: 'Users'
  },
  message: {
    type: String,
    require: true
  }
}, { timestamps: true })

const Message: IMessageCollection = mongoose.model<IMessageDocument>('Message', messageSchema);

export default Message