import { IAccommodationDocument } from "../collections/IAccommodations.collection";
import { IOtpDocument } from "../collections/IOtp.collections";
import { IUserDocument } from "../collections/IUsers.collection"
import { IRegisterCredentials } from "../controllers/IUserController"

interface IUserRepo {
     getDataByEmail(email: string): Promise<IUserDocument | null | never>
     createUser(registerData: IRegisterCredentials): Promise<void>
     createOtp(email: string, otp: string): Promise<void>;
     getOtpByEmail(email: string | undefined): Promise<IOtpDocument | null | never>;
     makeUserVerified(email: string): Promise<void | never>;
     getUserInfo(userId: string): Promise<IUserDocument | null>
     saveGoogleAuth(name: string, email: string): Promise<void>
     updateProfile(userId: string, updateData: any): Promise<IUserDocument | null>;
     updatePassword(userId: string, newPassword: string): Promise<IUserDocument | null>;
     updateIdentity(userId: string, images: string[]): Promise<IUserDocument | null>;
     updateBankAccount(userId: string, bankDetails: { accountNumber: string; ifscCode: string }): Promise<IUserDocument | null>;
     addHotel(hotelData: IAccommodationDocument): Promise<void | never>;
     getHotelbyId(hotelId: string): Promise<IAccommodationDocument | null>
     updateHotel(hotelId: string, hotelData: IAccommodationDocument): Promise<void | never>;
}

export default IUserRepo