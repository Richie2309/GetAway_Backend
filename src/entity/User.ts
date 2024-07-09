import { ObjectId } from "mongodb";

export default interface IUser {
  _id: ObjectId;
  email: string;
  password: string;
  fullName: string;
  phone?: string;
  booked_hotels?: string[];
  id_proof?: string[];
  ifsc_code?: string;
  bank_account_number?: string;
}
