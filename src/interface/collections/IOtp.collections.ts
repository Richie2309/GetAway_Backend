import { Document, Model, ObjectId } from "mongoose";

export interface IOtpDocument extends Document {
    _id: ObjectId;
    otp: String;
    email: String;
    expiresAt: Date;
}

export interface IOtpCollection extends Model<IOtpDocument> { }