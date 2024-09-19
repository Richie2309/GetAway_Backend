import { NextFunction, Request, Response } from "express";
import ITokenController from "../../interface/controllers/ITokenController";
import ITokenUseCase from "../../interface/usecase/ITokenUseCase";
import { StatusCodes } from "../../enums/statusCode.enums";

export default class TokenController implements ITokenController {
    private _tokenUseCase: ITokenUseCase;

    constructor(tokenUseCase: ITokenUseCase) {
        this._tokenUseCase = tokenUseCase;
    }

        async handleRefreshToken(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { refreshToken } = req.cookies;
            const newAccessToken = await this._tokenUseCase.refreshAccessToken(refreshToken);

            res.cookie('token', newAccessToken, { httpOnly: true });
    
            // Send new access token to frontend
            res.status(StatusCodes.Success).json({ message: 'Access token created' });
        } catch (err) {
            next(err); // Pass the error to the global error handler
        }
    }

}