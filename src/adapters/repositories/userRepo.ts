import { IAccommodationCollection, IAccommodationDocument } from "../../interface/collections/IAccommodations.collection";
import { IOtpCollection, IOtpDocument } from "../../interface/collections/IOtp.collections";
import { IUserDocument, IUsersCollection } from "../../interface/collections/IUsers.collection";
import { IRegisterCredentials } from "../../interface/controllers/IUserController";
import IUserRepo from "../../interface/repositories/IUserRepo";

export default class UserRepo implements IUserRepo {
    private userCollection: IUsersCollection
    private otpCollection: IOtpCollection
    private _accommodationCollection: IAccommodationCollection

    constructor(userCollection: IUsersCollection, otpCollection: IOtpCollection, accommodationColletion: IAccommodationCollection) {
        this.userCollection = userCollection
        this.otpCollection = otpCollection
        this._accommodationCollection = accommodationColletion
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

    async saveGoogleAuth(name: string, email: string): Promise<void> {
        try {
            const user = new this.userCollection({
                fullName: name,
                email: email,
                otp_verification: true
            })
            await user.save()
        } catch (err) {
            console.log(err, 'err in user repo google');
            throw err
        }
    }

    async updateProfile(userId: string, updateData: Partial<IUserDocument>): Promise<IUserDocument | null> {
        console.log('update data in repo', updateData, 'and id is', userId);
        try {
            const updatedUser = await this.userCollection.findByIdAndUpdate(
                userId,
                { $set: updateData },
                { new: true, runValidators: true }
            );
            console.log('Updated user:', updatedUser);
            return updatedUser;
        } catch (error) {
            console.error('Error updating user in database:', error);
            throw error;
        }
    }

    async updatePassword(userId: string, newPassword: string): Promise<IUserDocument | null> {
        console.log('newoass', newPassword);

        try {
            const updatedUser = await this.userCollection.findByIdAndUpdate(
                userId,
                { $set: { password: newPassword } },
                { new: true, runValidators: true }
            );
            console.log('Password updated successfully');
            return updatedUser;
        } catch (error) {
            console.error('Error updating password in database:', error);
            throw error;
        }
    }

    async updateIdentity(userId: string, images: string[]): Promise<IUserDocument | null> {
        try {

            const updatedUser = await this.userCollection.findByIdAndUpdate(
                userId,
                { $set: { id_proof: images } },
                { new: true, runValidators: true }
            )
            console.log('Identity updated successfully');
            return updatedUser;
        } catch (error) {
            console.error('Error updating identity in database:', error);
            throw error;
        }
    }

    async updateBankAccount(userId: string, bankDetails: { accountNumber: string, ifscCode: string }): Promise<IUserDocument | null> {
        try {
            const updatedUser = await this.userCollection.findByIdAndUpdate(
                userId,
                {
                    $set: {
                        bank_account_number: bankDetails.accountNumber,
                        ifsc_code: bankDetails.ifscCode
                    }
                },
                { new: true, runValidators: true }
            );
            return updatedUser;
        } catch (error) {
            console.error('Error updating bank account in database:', error);
            throw error;
        }
    }

    async addHotel(hotelData: IAccommodationDocument): Promise<void | never> {
        try {
            const newHotel = new this._accommodationCollection(hotelData);
            await newHotel.save();
            return
        } catch (err) {
            console.error('Error adding hotel to database:', err);
            throw err;
        }
    }

    async updateHotel(hotelId: string, hotelData: IAccommodationDocument): Promise<void | never> {
        
        try {
            console.log('htel data in repo',hotelData);
            
            const updatedHotel = await this._accommodationCollection.findByIdAndUpdate(
                hotelId,
                { $set: hotelData },
                { new: true, runValidators: true }
            );
            console.log('Updated hotel:', updatedHotel);
            return;
        } catch (err) {
            console.error('Error updating hotel in database:', err);
            throw err;
        }
    }

    async getHotelbyId(hotelId: string): Promise<IAccommodationDocument | null> {
        try {
            return await this._accommodationCollection.findById(hotelId).exec();
        } catch (err) {
            console.error('Error fetching hotel from database:', err);
            throw err;
        }
    } 

}