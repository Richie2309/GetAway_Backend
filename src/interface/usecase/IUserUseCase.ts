import { IRegisterCredentials } from "../controllers/IUserController";

interface IUserUseCase {
    authenticateUser(email: string, password: string): Promise<string | never>;
    registerUser(registerData: IRegisterCredentials): Promise<void>
    verifyOtp(email: string, otp: string): Promise<void>;
    resendOtp(email: string): Promise<void>;
    verifyToken(token: string | undefined): Promise<void | never>;
}

export default IUserUseCase