import mongoose, { Schema } from "mongoose";
import { IReviewCollection, IReviewDocument } from "../../interface/collections/IReview.collections";

const reviewSchema = new Schema({
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
  // booking: {
  //   type: Schema.Types.ObjectId,
  //   ref: 'Bookings',
  //   required: true
  // },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: true,
    maxlength: 500
  }
}, {
  timestamps: true
});

const Review: IReviewCollection = mongoose.model<IReviewDocument>('Review', reviewSchema);
export default Review;