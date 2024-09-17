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
            res.cookie('token', '', { httpOnly: true });

            res.status(StatusCodes.Unauthorized).json({ error: 'Access denied' })
            return;
        }
        req.user = decoded.id;
        next();
    } catch (err) {
        return res.status(StatusCodes.Unauthorized).json({ message: 'Invalid token' })
    }
}
// import { NextFunction, Response } from 'express';
// import JwtService from '../utils/jwtService.utils';
// import { StatusCodes } from '../../enums/statusCode.enums';
// import { AuthUserReq } from '../../interface/controllers/IUserController';

// const jwtService = new JwtService();

// export default async function authenticateJwt(req: AuthUserReq, res: Response, next: NextFunction) {
//     const token = req.headers.authorization?.split(' ')[1]; // Get the token from the Authorization header

//     if (!token) {
//         console.log('Token access denied');
//         return res.status(StatusCodes.Unauthorized).json({ error: 'Access denied' });
//     }

//     try {
//         const decoded = jwtService.verifyToken(token); // Verifies access token
        
//         if (decoded.type !== 'User') {
//             // Clear the cookie in case of invalid token type
//             res.cookie('token', '', { httpOnly: true });
//             return res.status(StatusCodes.Unauthorized).json({ error: 'Access denied' });
//         }

//         req.user = decoded.id; // Attach user ID to the request object
//         next();
//     } catch (err) {
//         return res.status(StatusCodes.Unauthorized).json({ message: 'Invalid or expired token' });
//     }
// }
