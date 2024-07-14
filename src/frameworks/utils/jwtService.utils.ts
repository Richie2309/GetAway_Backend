import jwt from 'jsonwebtoken';
import IJwtService, { IPayload } from '../../interface/utils/IJwtServices';

export default class JwtService implements IJwtService {
    sign(payload: IPayload): string | never {
        try {
            const token: string = jwt.sign(payload, process.env.JWT_SECRET_KEY!, { expiresIn: 86400 }); // token expiresIn
            return token;
        } catch (err: any) {
            throw err;
        }
    }

    verifyToken(token: string): IPayload | never {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY!);
            console.log("decoded : ",decoded);
            return decoded as IPayload;
        } catch (err: any) {
            throw err;
        }
    }
}