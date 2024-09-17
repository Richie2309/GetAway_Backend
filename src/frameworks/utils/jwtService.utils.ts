import jwt from 'jsonwebtoken';
import IJwtService, { IPayload } from '../../interface/utils/IJwtServices';

export default class JwtService implements IJwtService {
    sign(payload: IPayload): string | never {
        try {
            const token: string = jwt.sign(payload, process.env.JWT_SECRET_KEY!, {  expiresIn: '40m' }); 
            return token;
        } catch (err) {
            throw err;
        }
    }

    verifyToken(token: string): IPayload | never {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY!);
            return decoded as IPayload;
        } catch (err) {
            throw err;
        }
    }

    // generateRefreshToken(payload: IPayload): string | never {
    //     try {
    //         const refreshToken: string = jwt.sign(payload, process.env.JWT_SECRET_KEY!, { expiresIn: '7d' }); 
    //         return refreshToken;
    //     } catch (err) {
    //         throw err;
    //     }
    // }

    // verifyRefreshToken(token: string): IPayload | never {
    //     try {
    //         const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY!);
    //         return decoded as IPayload;
    //     } catch (err) {
    //         throw err;
    //     }
    // }
}