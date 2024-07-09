import { NextFunction, Request, Response } from "express";
import IUserController, { IOtpCredentials, IRegisterCredentials } from "../../interface/controllers/IUserController";
import { StatusCodes } from "../../enums/statusCode.enums";
import IUserUseCase from "../../interface/usecase/IUserUseCase";
import bcrypt from 'bcrypt'

class UserController implements IUserController {
    private userUseCase: IUserUseCase

    constructor(userUseCase: IUserUseCase) {
        this.userUseCase = userUseCase
    }

    async handleRegister(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { fullName, email, password }: IRegisterCredentials = req.body;
            const registerData: IRegisterCredentials = { fullName, email, password }

            await this.userUseCase.registerUser(registerData);

            res.status(StatusCodes.Success).json({ message: 'User registered, OTP sent' });
        } catch (err: any) {
            console.log(err);
        }
    }

    async handleOtpVerification(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {

        } catch (err: any) {
            next(err);
        }
    }

    async handleOtpResend(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {

        } catch (err: any) {
            next(err);
        }
    }

    handleLogin(req: Request, res: Response, next: NextFunction): void {
        try {

        } catch (err) {

        }
    }

    handleLogout(req: Request, res: Response, next: NextFunction): void {
        try {

        } catch (err) {

        }
    }



}

export default UserController