import express from 'express'

import UserController from '../../adapters/controllers/userController';
import IUserController from '../../interface/controllers/IUserController';

import UserUseCase from '../../usecase/userUseCase';
import IUserUseCase from '../../interface/usecase/IUserUseCase';

import UserRepo from '../../adapters/repositories/userRepo';
import IUserRepo from '../../interface/repositories/IUserRepo';

//Hashing services
import HashingService from '../utils/hashingService.utils';
import IHashingService from '../../interface/utils/IHashingService';

//Email Services
import EmailService from '../utils/emailService.utils';
import IEmailService from '../../interface/utils/IEmailService';

//Otp services
import OtpService from '../utils/otpService.utils';
import IOtpService from '../../interface/utils/IOtpService';

//Models
import Users from '../models/userSchema';
import Otp from '../models/otpSchema';
import IJwtService from '../../interface/utils/IJwtServices';
import JwtService from '../utils/jwtService.utils';

const userRouter = express.Router();

const userRepo: IUserRepo = new UserRepo(Users, Otp)
const hashingService: IHashingService = new HashingService()
const emailService: IEmailService=new EmailService()
const otpService:IOtpService=new OtpService()
const jwtService:IJwtService=new JwtService()
const userUseCase: IUserUseCase = new UserUseCase(userRepo, hashingService, jwtService,emailService,otpService);
const userController: IUserController = new UserController(userUseCase);


userRouter.post('/register', userController.handleRegister.bind(userController));

userRouter.post('/otpVerify', userController.handleOtpVerification.bind(userController));

userRouter.post('/otpResend', userController.handleOtpResend.bind(userController));

userRouter.post('/login', userController.handleLogin.bind(userController));

userRouter.post('/logout', userController.handleLogout.bind(userController));


export default userRouter;  