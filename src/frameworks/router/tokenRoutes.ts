import express from 'express'
import IJwtService from '../../interface/utils/IJwtServices';
import JwtService from '../utils/jwtService.utils';
import ITokenUseCase from '../../interface/usecase/ITokenUseCase';
import TokenUseCase from '../../usecase/tokenUseCase';
import ITokenController from '../../interface/controllers/ITokenController';
import TokenController from '../../adapters/controllers/tokenController';


const tokenRoutes = express.Router();
const jwtService: IJwtService = new JwtService()
const tokenUseCase: ITokenUseCase = new TokenUseCase(jwtService);
const tokenController: ITokenController = new TokenController(tokenUseCase);

tokenRoutes.post('/', tokenController.handleRefreshToken.bind(tokenController))

export default tokenRoutes;   