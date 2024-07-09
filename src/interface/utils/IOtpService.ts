export default interface IOtpService {
    generateOTP(length?: number, characters?: string): string | never;
}