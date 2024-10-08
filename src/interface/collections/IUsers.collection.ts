import { Document, Model, ObjectId } from "mongoose";

export interface IUserDocument extends Document {
    _id: string;
    email: String;
    password: String;
    fullName: String;
    phone?: String;
    booked_hotels?: ObjectId[];
    id_proof?: String;
    ifsc_code?: String;
    bank_account_number?: String;
    otp_verification: Boolean;
    profile_verify: Boolean;
    is_blocked: Boolean;
}

export interface IUsersCollection extends Model<IUserDocument> { }


