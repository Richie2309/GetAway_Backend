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
}

export default IUserRepo