import mongoose, { Schema } from "mongoose";
import { IConversationCollection, IConversationDocument } from "../../interface/collections/IConversation.collections";

const conversationSchema = new Schema({
  participants: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Users'
    }
  ],
  messages: [{
    type: Schema.Types.ObjectId,
    ref: 'Message'
  }],
  unreadMessages: [{
    userId: Schema.Types.ObjectId,
    count: { type: Number, default: 0 }
  }]
}, { timestamps: true })

const Conversation: IConversationCollection = mongoose.model<IConversationDocument>('Conversation', conversationSchema);

export default Conversation