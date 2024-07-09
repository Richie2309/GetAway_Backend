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
        required: true
    },
    fullName: {
        type: String,
        required: true
    },
    phone: {
        type: String,
    },
    booked_hotels: [{
        type: Schema.Types.ObjectId,
        ref: 'Bookings'
    }],
    id_proof: {
        type: String,
        enum: ['passport', 'drivers license', 'id']
    },
    ifsc_code: {
        type: String,
    },
    bank_account_number: {
        type: String,
    },
    otp_verification: {
        type: Boolean,
        required: true,
        default: false
    }
});

const Users: IUsersCollection = mongoose.model<IUserDocument>('Users', userSchema)
export default Users