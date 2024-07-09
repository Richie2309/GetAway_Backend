import mongoose, { Schema } from "mongoose";
import { IOtpCollection, IOtpDocument } from "../../interface/collections/IOtp.collections";

const otpSchema = new Schema({
    otp: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true
    },
    expiresAt: {
        type: Date,
        require: true
    }
})

const Otp: IOtpCollection = mongoose.model<IOtpDocument>('Otp', otpSchema);

export default Otp