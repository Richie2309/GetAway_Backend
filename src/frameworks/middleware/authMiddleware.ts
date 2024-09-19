import { NextFunction, Response } from 'express'
import JwtService from '../utils/jwtService.utils'
import { StatusCodes } from '../../enums/statusCode.enums'
import { AuthUserReq } from '../../interface/controllers/IUserController'

const jwtService = new JwtService()

export default async function authenticateJwt(req: AuthUserReq, res: Response, next: NextFunction) {
    const { token } = req.cookies;
    if (!token) {
        res.status(StatusCodes.Unauthorized).json({ error: 'Access denied' })
        return;
    }
    try {
        const decoded = jwtService.verifyToken(token)
        
        if (decoded.type !== 'User') {
            res.clearCookie('token', { httpOnly: true });
            res.clearCookie('refreshToken',{ httpOnly: true })

            res.status(StatusCodes.Unauthorized).json({ error: 'Access denied' })
            return;
        }
        req.user = decoded.id;
        next();
    } catch (err) {
        return res.status(StatusCodes.Unauthorized).json({ message: 'Invalid token' })
    }
}