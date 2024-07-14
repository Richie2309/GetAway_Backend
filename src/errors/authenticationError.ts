import IAuthenticationErrorDetails from "../interface/errors/IAuthenticationError"

export default class AuthenticationError extends Error {
    public details: IAuthenticationErrorDetails;
    constructor(details: IAuthenticationErrorDetails) {
        super(details.message)
        this.details = details
    }
}