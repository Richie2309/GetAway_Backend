import express from 'express'
import ITokenController from '../../interface/controllers/ItokenController';
import TokenController from '../../adapters/controllers/tokenController';
import TokenUseCase from '../../usecase/tokenUseCase';
import ITokenUseCase from '../../interface/usecase/ITokenUseCase';
import JwtService from '../utils/jwtService.utils';
import IJwtService from '../../interface/utils/IJwtServices';

const tokenRoutes = express.Router();
const jwtService: IJwtService = new JwtService()
const tokenUseCase: ITokenUseCase = new TokenUseCase(jwtService);
const tokenController: ITokenController = new TokenController(tokenUseCase);

tokenRoutes.post('/', tokenController.handleRefreshToken.bind(tokenController))

export default tokenRoutes;  