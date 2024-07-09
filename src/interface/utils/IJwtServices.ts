import { ObjectId } from "mongoose";

export interface IPayload {
    id: ObjectId,
    type: string
}

export default interface IJwtService {
    sign(payload: IPayload): string | never;
    verifyToken(token: string): IPayload | never;
}