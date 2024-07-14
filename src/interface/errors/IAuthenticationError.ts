export default interface IAuthenticationErrorDetails {
    statusCode?: number;
    message: string;
    errorField?: string;
    notOtpVerifiedError?: string | undefined;
}
