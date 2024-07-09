import { IUserDocument } from "../interface/collections/IUsers.collection";
import { IRegisterCredentials } from "../interface/controllers/IUserController";
import IUserRepo from "../interface/repositories/IUserRepo";
import IUserUseCase from "../interface/usecase/IUserUseCase";
import bcrypt from 'bcrypt';
import IHashingService from "../interface/utils/IHashingService";
import IOtpService from "../interface/utils/IOtpService";
import IEmailService from "../interface/utils/IEmailService";
import IJwtService, { IPayload } from "../interface/utils/IJwtServices";


export default class UserUseCase implements IUserUseCase {
    private userRepo: IUserRepo
    private hashingService: IHashingService
    private jwtService: IJwtService
    private otpService: IOtpService
    private emailService: IEmailService

    constructor(userRepo: IUserRepo, hashingService: IHashingService, jwtService: IJwtService, emailService: IEmailService, otpService: IOtpService) {
        this.userRepo = userRepo
        this.hashingService = hashingService
        this.jwtService=jwtService
        this.otpService = otpService
        this.emailService = emailService
    }

    async authenticateUser(email: string, password: string): Promise<string | never> {
        try {
            const userData: IUserDocument | null = await this.userRepo.getDataByEmail(email);

            if (!userData) {
                throw new Error('The provided email address is not found.');
            } else if (!await this.hashingService.compare(password, userData.password as string)) {
                throw new Error('The provided password is incorrect.');
            } else if (!userData.otp_verification) {
                await this.generateAndSendOTP(userData.email as string); // send otp via email.
                throw new Error('Account is not verified.');
            }
            const payload: IPayload = {
                id: userData._id,
                type: 'User'
            }
            const token: string = this.jwtService.sign(payload);

            return token;
        } catch (err: any) {
            throw err;
        }
    }

    async registerUser(registerData: IRegisterCredentials): Promise<void> {
        try {
            const user = await this.userRepo.getDataByEmail(registerData.email);
            if (user) {
                throw new Error('User already exists')
            }

            const hashedPassword: string = await this.hashingService.hash(registerData.password);
            registerData.password = hashedPassword;

            await this.userRepo.createUser(registerData)

            await this.generateAndSendOTP(registerData.email);
        } catch (err: any) {
            throw err
        }
    }


    private async generateAndSendOTP(email: string): Promise<void | never> {
        try {
            const otp: string = this.otpService.generateOTP();

            const to: string = email;
            const subject: string = 'OTP For Account Verification';
            const text: string = `You're OTP for account verification is ${otp}`;

            await this.emailService.sendEmail(to, subject, text); // sending email with the verification code (OTP)

            await this.userRepo.createOtp(email, otp); // saving otp in database
        } catch (err: any) {
            throw err;
        }
    }

    async verifyOtp(email: string, otp: string): Promise<void> {



    }


    async resendOtp(email: string): Promise<void>{

    }

    async verifyToken(token: string | undefined): Promise<void | never>{

    }
}