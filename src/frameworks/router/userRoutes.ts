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
import authenticateJwt from '../middleware/authMiddleware';
import ICloudinaryService from '../../interface/utils/ICloudinaryService';
import CloudinaryService from '../utils/cloudinaryService';
import Accommodations from '../models/accommodationSchema';

const userRouter = express.Router();

const userRepo: IUserRepo = new UserRepo(Users, Otp,Accommodations)
const hashingService: IHashingService = new HashingService()
const emailService: IEmailService = new EmailService()
const otpService: IOtpService = new OtpService()
const jwtService: IJwtService = new JwtService()
const cloudinaryService: ICloudinaryService=new CloudinaryService()
const userUseCase: IUserUseCase = new UserUseCase(userRepo, hashingService, jwtService, emailService, otpService, cloudinaryService);
const userController: IUserController = new UserController(userUseCase);

userRouter.post('/register', userController.handleRegister.bind(userController));

userRouter.post('/otpVerify', userController.handleOtpVerification.bind(userController));

userRouter.post('/otpResend', userController.handleOtpResend.bind(userController));

userRouter.post('/login', userController.handleLogin.bind(userController));

userRouter.post('/logout', userController.handleLogout.bind(userController));

userRouter.get('/getUser', authenticateJwt, userController.getUserInfo.bind(userController));

userRouter.post('/googleAuth', userController.googleAuth.bind(userController))

userRouter.put('/updateProfile', authenticateJwt, userController.updateProfile.bind(userController))

userRouter.put('/updatePassword', authenticateJwt, userController.updatePassword.bind(userController))

userRouter.put('/updateIdentity', authenticateJwt, userController.updateIdentity.bind(userController))

userRouter.put('/updateBankAccount', authenticateJwt, userController.updateBankAccount.bind(userController))

userRouter.post('/addHotel', authenticateJwt, userController.addHotel.bind(userController))

userRouter.put('/updateHotel', authenticateJwt, userController.updateHotel.bind(userController))

export default userRouter;  