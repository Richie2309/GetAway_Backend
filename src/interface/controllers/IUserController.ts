import { NextFunction, Request, Response } from "express";

interface IUserController {
    handleRegister(req: Request, res: Response, next: NextFunction): void;
    handleOtpVerification(req: Request, res: Response, next: NextFunction): void;
    handleOtpResend(req: Request, res: Response, next: NextFunction): void;
    handleLogin(req: Request, res: Response, next: NextFunction): void;
    handleLogout(req: Request, res: Response, next: NextFunction): void;
}

export interface IRegisterCredentials {
    fullName: string,
    email: string,
    password: string
}

export interface IOtpCredentials {
    email: string;
    otp: string;
}

export interface ILoginCredentials{
    email:string;
    password:string;
}

export default IUserController