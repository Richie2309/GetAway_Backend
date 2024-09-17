import { NextFunction, Request, response, Response } from "express";
import { ObjectId } from "mongoose";

interface IUserController {
    handleRegister(req: Request, res: Response, next: NextFunction): Promise<void | never>;
    handleOtpVerification(req: Request, res: Response, next: NextFunction): Promise<void | never>;
    handleOtpResend(req: Request, res: Response, next: NextFunction): Promise<void | never>;
    handleLogin(req: Request, res: Response, next: NextFunction): Promise<void | never>;
    handleLogout(req: Request, res: Response, next: NextFunction): Promise<void | never>;
    verifyTokenRequest(req: Request, res: Response, next: NextFunction): Promise<void | never>;
    getUserInfo(req: Request, res: Response): Promise<void>;
    googleAuth(req: Request, res: Response): Promise<void>
    handleCheckMail(req: Request, res: Response, next: NextFunction): Promise<void | never>;
    verifyForgotPasswordOtp(req: Request, res: Response): Promise<void>
    resetPassword(req: Request, res: Response): Promise<void>;
    updateProfile(req: Request, res: Response): Promise<void>;
    updatePassword(req: Request, res: Response): Promise<void>;
    updateIdentity(req: Request, res: Response): Promise<void>;
    updateBankAccount(req: Request, res: Response): Promise<void>;
    addHotel(req: Request, res: Response, next: NextFunction): Promise<void | never>;
    getAccommodationsByUserId(req: Request, res: Response, next: NextFunction): Promise<void | never>;
    getHotelById(req: Request, res: Response, next: NextFunction): Promise<void>;
    updateHotel(req: Request, res: Response, next: NextFunction): Promise<void | never>;
    getAllHotels(req: Request, res: Response, next: NextFunction): Promise<void | never>;
    checkAvailability(req: Request, res: Response, next: NextFunction): Promise<void>;
    createBooking(req: Request, res: Response, next: NextFunction): Promise<void>;
    createPaymentIntent(req: Request, res: Response, next: NextFunction): Promise<void>;
    cancelBooking(req: Request, res: Response, next: NextFunction): Promise<void>
    getBookedHotels(req: AuthUserReq, res: Response, next: NextFunction): Promise<void | never>;
    getSchedule(req: Request, res: Response, next: NextFunction): Promise<void>;
    getToken(req: AuthUserReq, res: Response, next: NextFunction): Promise<void>
    getMessages(req: Request, res: Response, next: NextFunction): Promise<void>;
    sendMessage(req: Request, res: Response, next: NextFunction): Promise<void>;
    getMessagedUsers(req: AuthUserReq, res: Response, next: NextFunction): Promise<void>
    getReviews(req: Request, res: Response, next: NextFunction): Promise<void>
    canUserReview(req: AuthUserReq, res: Response, next: NextFunction): Promise<void>
    addReview(req: AuthUserReq, res: Response, next: NextFunction): Promise<void>
    getTopThreeAccommodations(req: Request, res: Response, next: NextFunction): Promise<void>
    // handleRefreshToken(req: Request, res: Response, next: NextFunction): Promise<any>
}

export interface IRegisterCredentials {
    fullName: string,
    email: string,
    password: string
}

export interface ILoginCredentials {
    email: string;
    password: string;
}

export interface AuthUserReq extends Request {
    user?: string;
}


export interface googleAuthBody {
    fullName: string,
    email: string,
}


export default IUserController