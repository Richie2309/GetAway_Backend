import { IOtpCollection, IOtpDocument } from "../../interface/collections/IOtp.collections";
import { IUserDocument, IUsersCollection } from "../../interface/collections/IUsers.collection";
import { IRegisterCredentials } from "../../interface/controllers/IUserController";
import IUserRepo from "../../interface/repositories/IUserRepo";

export default class UserRepo implements IUserRepo {
    private userCollection: IUsersCollection
    private otpCollection: IOtpCollection

    constructor(userCollection: IUsersCollection, otpCollection: IOtpCollection) {
        this.userCollection = userCollection
        this.otpCollection = otpCollection
    }

    async getDataByEmail(email: string): Promise<IUserDocument | null> {
        try {
            const userData: IUserDocument | null = await this.userCollection.findOne({ email });
            return userData;
        } catch (err: any) {
            throw err;
        }
    }

    async createUser(registerData: IRegisterCredentials): Promise<void> {
        try {
            const newUser = new this.userCollection({
                fullName: registerData.fullName,
                email: registerData.email,
                password: registerData.password
            });
            await newUser.save();
        } catch (err: any) {
            throw err;
        }
    }

    async createOtp(email: string, otp: string): Promise<void | never> {
        try {
            await this.deleteOtpByEmail(email); // delete previous otp if exisits

            const newOtp: IOtpDocument = new this.otpCollection({
                email: email,
                otp: otp,
                expiresAt: new Date(Date.now() + 90000)
            });

            await newOtp.save();
        } catch (err: any) {
            throw err;
        }
    }

    async getOtpByEmail(email: string | undefined): Promise<IOtpDocument | null | never> {
        try {
            return await this.otpCollection.findOne({ email, expiresAt: { $gte: new Date() } }).sort({ expiresAt: -1 });
        } catch (err: any) {
            throw err;
        }
    }

    async makeUserVerified(email: string): Promise<void | never> {
        try {
            await this.deleteOtpByEmail(email); // delete the otp document of this email.
            await this.userCollection.updateOne({ email }, { $set: { otp_verification: true } });
        } catch (err: any) {
            throw err;
        }
    }

    private async deleteOtpByEmail(email: string): Promise<void | never> {
        try {
            await this.otpCollection.deleteMany({ email });
        } catch (err: any) {
            throw err;
        }
    }

    async getUserInfo(userId: string): Promise<IUserDocument | null> {
        return await this.userCollection.findById(userId)
    }

}