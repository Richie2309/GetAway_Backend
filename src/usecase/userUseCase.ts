import { IUserDocument } from "../interface/collections/IUsers.collection";
import { IRegisterCredentials } from "../interface/controllers/IUserController";
import IUserRepo from "../interface/repositories/IUserRepo";
import IUserUseCase from "../interface/usecase/IUserUseCase";
import IHashingService from "../interface/utils/IHashingService";
import IOtpService from "../interface/utils/IOtpService";
import IEmailService from "../interface/utils/IEmailService";
import IJwtService, { IPayload } from "../interface/utils/IJwtServices";
import authenticationError from "../errors/authenticationError"
import { StatusCodes } from "../enums/statusCode.enums";
import { IOtpDocument } from "../interface/collections/IOtp.collections";
import jwtTokenError from "../errors/jwtError"

export default class UserUseCase implements IUserUseCase {
    private userRepo: IUserRepo
    private hashingService: IHashingService
    private jwtService: IJwtService
    private otpService: IOtpService
    private emailService: IEmailService

    constructor(userRepo: IUserRepo, hashingService: IHashingService, jwtService: IJwtService, emailService: IEmailService, otpService: IOtpService) {
        this.userRepo = userRepo
        this.hashingService = hashingService
        this.jwtService = jwtService
        this.otpService = otpService
        this.emailService = emailService
    }

    //REGISTER
    async registerUser(registerData: IRegisterCredentials): Promise<void> {
        try {
            const user: IUserDocument | null = await this.userRepo.getDataByEmail(registerData.email);
            if (user) {
                console.log('user already exist');
                throw new authenticationError({ message: 'The email address you entered is already registered.', statusCode: StatusCodes.BadRequest, errorField: 'email' });
            }

            const hashedPassword: string = await this.hashingService.hash(registerData.password);
            registerData.password = hashedPassword;

            await this.userRepo.createUser(registerData)

            await this.generateAndSendOTP(registerData.email);
        } catch (err: any) {
            throw err
        }
    }

    //LOGIN
    async authenticateUser(email: string, password: string): Promise<string | never> {
        try { 
            const userData: IUserDocument | null = await this.userRepo.getDataByEmail(email);
            console.log('userdata in userusecase authenticate user', userData);

            if (!userData) {
                throw new authenticationError({ message: 'The provided email address is not found.', statusCode: StatusCodes.Unauthorized, errorField: 'email' });
            } else if (!await this.hashingService.compare(password, userData.password as string)) {
                throw new authenticationError({ message: 'The provided password is incorrect.', statusCode: StatusCodes.Unauthorized, errorField: 'password' })
            } else if (!userData.otp_verification) {
                await this.generateAndSendOTP(userData.email as string); // send otp via email.
                throw new authenticationError({ message: 'Account is not verified.', statusCode: StatusCodes.Unauthorized, errorField: "otp", notOtpVerifiedError: userData.email as string });
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


    private async generateAndSendOTP(email: string): Promise<void | never> {
        try {
            const otp: string = this.otpService.generateOTP();

            const to: string = email;
            const subject: string = 'OTP For Account Verification';
            const text: string = `You're OTP for account verification is ${otp}`;

            await this.emailService.sendEmail(to, subject, text); // sending email with the verification code (OTP)

            const sotp = await this.userRepo.createOtp(email, otp); // saving otp in database
            console.log('otp is:', otp);

        } catch (err: any) {
            throw err;
        }
    }

    async verifyOtp(email: string | undefined, otp: string): Promise<string | never> {
        try {
            const otpData: IOtpDocument | null = await this.userRepo.getOtpByEmail(email);
            console.log('verifyotp in usecase', otpData);


            if (!email) {
                throw new authenticationError({ message: 'Email is not provided.', statusCode: StatusCodes.NotFound, errorField: 'email' })
            } else if (!otpData) {
                throw new authenticationError({ message: 'OTP expired. Resend again.', statusCode: StatusCodes.BadRequest, errorField: 'otp' });
            } else if (otpData.otp !== otp) {
                throw new authenticationError({ message: 'The OTP you entered is incorrect.', statusCode: StatusCodes.BadRequest, errorField: 'otp' });
            }

            await this.userRepo.makeUserVerified(email)
            const userData: IUserDocument | null = await this.userRepo.getDataByEmail(email)

            const payload: IPayload = {
                id: userData?.id,
                type: 'User'
            }

            const authToken: string = this.jwtService.sign(payload)
            return authToken

        } catch (err) {
            throw err;
        }

    }


    async resendOtp(email: string): Promise<void | never> {
        try {
            if (!email) {
                throw new authenticationError({ message: 'Email is not provided.', statusCode: StatusCodes.NotFound, errorField: 'email' });
            }

            await this.generateAndSendOTP(email); // send otp via email.
        } catch (err: any) {
            throw err;
        }
    }

    async verifyToken(token: string | undefined): Promise<void | never> {
        try {
            if (!token) {
                throw new jwtTokenError({ statusCode: StatusCodes.Unauthorized, message: 'User not authenticated' })
            }

            const decoded: IPayload = this.jwtService.verifyToken(token);

            if (decoded.type !== 'User') {
                throw new jwtTokenError({ statusCode: StatusCodes.BadRequest, message: 'Invaild Token' });
            }
        } catch (err: any) {
            throw err;
        }
    }

    async getUserInfo(userId: string): Promise<IUserDocument | null> {
        return await this.userRepo.getUserInfo(userId);
    }
}