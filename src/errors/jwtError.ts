import IJwtErrorDetails from "../interface/errors/IJwtErrors";

export default class JwtError extends Error {
    public details: IJwtErrorDetails;
    constructor(details: IJwtErrorDetails) {
        super(details.message);
        this.details = details;
    }
}