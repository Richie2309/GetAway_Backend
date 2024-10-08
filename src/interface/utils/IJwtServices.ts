export interface IPayload {
    id: string,
    type: string
}

export default interface IJwtService {
    sign(payload: IPayload): string;
    verifyToken(token: string): IPayload;
    generateRefreshToken(payload: IPayload): string;   
    // verifyRefreshToken(token: string): IPayload; 
}