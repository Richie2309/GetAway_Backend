import ITokenUseCase from "../interface/usecase/ITokenUseCase";
import IJwtService, { IPayload } from "../interface/utils/IJwtServices";

export default class TokenUseCase implements ITokenUseCase {
  private _jwtService: IJwtService
  constructor(jwtService: IJwtService) {
    this._jwtService = jwtService
  }

  async refreshAccessToken(refreshToken: string): Promise<string | never> {
    try {
      
      const decoded = this._jwtService.verifyToken(refreshToken);
      const payload: IPayload = { id: decoded.id, type: decoded.type };
      const newAccessToken: string = this._jwtService.sign(payload);  
      return newAccessToken;
    } catch (err) {
      throw new Error('Invalid refresh token');
    }
  }
}