import mongoose, { Schema } from "mongoose";
import { IUserDocument, IUsersCollection } from "../../interface/collections/IUsers.collection";

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
    },
    fullName: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        default: ''
    },
    booked_hotels: [{
        type: Schema.Types.ObjectId,
        ref: 'Bookings'
    }],
    id_proof: [{
        type: String,
        default: '',
    }],
    ifsc_code: {
        type: String,
        default: ''
    },
    bank_account_number: {
        type: String,
        default: ''
    },
    otp_verification: {
        type: Boolean,
        required: true,
        default: false
    },
    profile_verify:{
        type:Boolean,
        default:false
    },
    is_blocked:{
        type:Boolean,
        default:false
    }
});

const Users: IUsersCollection = mongoose.model<IUserDocument>('Users', userSchema)
export default Users