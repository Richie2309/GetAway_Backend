import { IUserDocument } from "../collections/IUsers.collection"
import { IRegisterCredentials } from "../controllers/IUserController"

interface IUserRepo {
     getDataByEmail(email: string): Promise<IUserDocument | null>
     createUser(registerData: IRegisterCredentials): Promise<void>
     createOtp(email: string, otp: string): Promise<void>;
}

export default IUserRepo