import { NextFunction, Request, Response } from "express";
import IUserController, { AuthUserReq, ILoginCredentials, IRegisterCredentials } from "../../interface/controllers/IUserController";
import { StatusCodes } from "../../enums/statusCode.enums";
import IUserUseCase from "../../interface/usecase/IUserUseCase";
import mongoose from "mongoose";
import bcrypt from 'bcrypt'

class UserController implements IUserController {
    private userUseCase: IUserUseCase

    constructor(userUseCase: IUserUseCase) {
        this.userUseCase = userUseCase
    }

    async handleRegister(req: Request, res: Response, next: NextFunction): Promise<void | never> {
        try {
            console.log('handleregister', req.body);

            const { fullName, email, password }: IRegisterCredentials = req.body;
            const registerData: IRegisterCredentials = { fullName, email, password }

            await this.userUseCase.registerUser(registerData);

            res.cookie('emailToBeVerified', registerData.email); // Set http only cookie for user email to verify the otp

            res.status(StatusCodes.Success).json({ message: 'User registered, OTP sent' });
        } catch (err: any) {
            console.log(err);
            next(err)
        }
    }

    async handleOtpVerification(req: Request, res: Response, next: NextFunction): Promise<void | never> {
        try {
            const emailToBeVerified: string | undefined = req.cookies.emailToBeVerified;
            const otp: string = req.body.otp;

            console.log('handleotpveri in controller', otp);

            const token: string = await this.userUseCase.verifyOtp(emailToBeVerified, otp);

            console.log('handleotpveri in controller', token);

            res.cookie('emailToBeVerified', '', { expires: new Date(Date.now()) }); // clearing http only cookie
            res.cookie('token', token, { httpOnly: true, expires: new Date(Date.now()) }); // clearing http only cookie

            res.status(StatusCodes.Success).json({
                message: "Successfuly account verified"
            });
        } catch (err: any) {
            next(err);
        }
    }

    async handleOtpResend(req: Request, res: Response, next: NextFunction): Promise<void | never> {
        try {
            const emailToBeVerified: string | undefined = req.cookies.emailToBeVerified;

            await this.userUseCase.resendOtp(emailToBeVerified);

            res.status(StatusCodes.Success).json({
                message: 'OTP Resend Successfull'
            });
        } catch (err: any) {
            next(err);
        }
    }

    async handleLogin(req: Request, res: Response, next: NextFunction): Promise<void | never> {
        try {
            const { email, password }: ILoginCredentials = req.body;

            // usecase for authenticateing User
            const token: string = await this.userUseCase.authenticateUser(email, password); // return token if credentials and user is verified or error

            res.cookie('token', token, { httpOnly: true }); // Set http only cookie for token

            res.status(StatusCodes.Success).json({
                message: "Successfuly login"
            });
        } catch (err: any) {
            next(err);
        }
    }

    async handleLogout(req: Request, res: Response, next: NextFunction): Promise<void | never> {
        try {
            res.cookie('token', '', { httpOnly: true, expires: new Date(Date.now()) }); // clearing token stroed http only cookie to logout.

            res.status(StatusCodes.Success).json({
                message: "User Logout sucessfull"
            });
        } catch (err: any) {
            next(err);
        }
    }

    async verifyTokenRequest(req: Request, res: Response, next: NextFunction): Promise<void | never> {
        try {
            const token: string | undefined = req.cookies.token;

            await this.userUseCase.verifyToken(token);

            res.status(StatusCodes.Success).json({
                message: 'User is authenticated'
            });
        } catch (err: any) {
            next(err);
        }
    }

    async getUserInfo(req: any, res: Response): Promise<void> {
        try {
            const userId = req.user
            console.log('getuserinfo in controlelr', userId);

            // const userObjectId =mongoose.Types.ObjectId(userId);
            const user = await this.userUseCase.getUserInfo(userId);
            console.log('user i ncontr', user);

            if (!user) {
                res.status(StatusCodes.Unauthorized).json({ error: "User not found" })
                return
            }
            res.status(StatusCodes.Success).json({ user })
        } catch (err) {
            console.log(err);
            res.status(StatusCodes.InternalServer).json({ error: 'Internal server error' })
        }
    }
}

export default UserController