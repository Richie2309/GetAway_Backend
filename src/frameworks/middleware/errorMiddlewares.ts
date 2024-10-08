import { NextFunction, Request, Response } from "express";
import AuthenticationError from "../../errors/authenticationError";
import JwtError from "../../errors/jwtError";
import jwt from 'jsonwebtoken'
import { StatusCodes } from "../../enums/statusCode.enums";

export default function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
    if (err instanceof AuthenticationError) {
        if (err.details.notOtpVerifiedError) {
            res.cookie('emailToBeVerified', err.details.notOtpVerifiedError) // Set http only cookie for user email to verify the otp
        }
        res.status(err.details.statusCode!).json({ message: err.message, errorField: err.details.errorField })
    }
    else if (err instanceof jwt.TokenExpiredError) {
        res.cookie('token', '', { httpOnly: true, expires: new Date(Date.now()) }) // clearing http only cookie
        res.status(401).json({ message: 'Token expired' })
    }
    else if (err instanceof JwtError) {
        res.cookie('token', '', { httpOnly: true, expires: new Date(Date.now()) }); // clearing http only cookie

        res.status(err.details.statusCode).json({ message: err.message });
    }
    else {
        // console.error(err); // Log entire error object
        res.status(StatusCodes.InternalServer).json({ error: 'Internal Server Error.' });
    }
}