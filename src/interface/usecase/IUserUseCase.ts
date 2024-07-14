import { ObjectId } from "mongoose";
import { IUserDocument } from "../collections/IUsers.collection";
import { IRegisterCredentials } from "../controllers/IUserController";

interface IUserUseCase {
    authenticateUser(email: string, password: string): Promise<string | never>;
    registerUser(registerData: IRegisterCredentials): Promise<void>
    verifyOtp(email: string | undefined, otp: string): Promise<string | never>;
    resendOtp(email: string | undefined): Promise<void | never>;
    verifyToken(token: string | undefined): Promise<void | never>;
    getUserInfo(userId: string): Promise<IUserDocument | null>
}

export default IUserUseCase