import crypto from 'crypto'
import IOtpService from '../../interface/utils/IOtpService';

export default class OtpService implements IOtpService {
    generateOTP(length: number = 6, characters: string = '0123456789'): string | never {
        try {
            const buffer = crypto.randomBytes(Math.ceil(length / 2));
            let OTP: string = '';
            for(let i = 0;i < length; i++) {
                const randomIndex = Math.floor(crypto.randomBytes(1)[0] * characters.length / 256);
                OTP += characters[randomIndex];
            }
            return OTP;
        } catch (err: any) {
            throw err;
        }
    }
}