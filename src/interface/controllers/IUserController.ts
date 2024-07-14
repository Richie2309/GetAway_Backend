import { NextFunction, Request, Response } from "express";
import { ObjectId } from "mongoose";

interface IUserController {
    handleRegister(req: Request, res: Response, next: NextFunction): Promise<void | never>;
    handleOtpVerification(req: Request, res: Response, next: NextFunction): Promise<void | never>;
    handleOtpResend(req: Request, res: Response, next: NextFunction): Promise<void | never>;
    handleLogin(req: Request, res: Response, next: NextFunction): Promise<void | never>;
    handleLogout(req: Request, res: Response, next: NextFunction): Promise<void | never>;
    verifyTokenRequest(req: Request, res: Response, next: NextFunction): Promise<void | never>;
    getUserInfo(req: Request, res: Response): Promise<void>;}

export interface IRegisterCredentials {
    fullName: string,
    email: string,
    password: string
}

export interface ILoginCredentials{
    email:string;
    password:string;
}

export interface AuthUserReq extends Request {
    user?: string;
} 

export default IUserController