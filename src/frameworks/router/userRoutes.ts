import express from 'express'

//Controller
import UserController from '../../adapters/controllers/userController';
import IUserController from '../../interface/controllers/IUserController';

//UseCase
import UserUseCase from '../../usecase/userUseCase';
import IUserUseCase from '../../interface/usecase/IUserUseCase';

//UseRepo
import UserRepo from '../../adapters/repositories/userRepo';
import IUserRepo from '../../interface/repositories/IUserRepo';

//Jwt Services
import JwtService from '../utils/jwtService.utils';
import IJwtService from '../../interface/utils/IJwtServices';

//Hashing services
import HashingService from '../utils/hashingService.utils';
import IHashingService from '../../interface/utils/IHashingService';

//Email Services
import EmailService from '../utils/emailService.utils';
import IEmailService from '../../interface/utils/IEmailService';

//Otp services
import OtpService from '../utils/otpService.utils';
import IOtpService from '../../interface/utils/IOtpService';

//Cloudinary services
import CloudinaryService from '../utils/cloudinaryService';
import ICloudinaryService from '../../interface/utils/ICloudinaryService';

//Stripe services
import { StripeService } from '../utils/stripeService.utils';
import { IStripeService } from '../../interface/utils/IStripeService';

import authenticateJwt from '../middleware/authMiddleware';

//Models
import Users from '../models/userSchema';
import Otp from '../models/otpSchema';
import Accommodations from '../models/accommodationSchema';
import Bookings from '../models/bookingSchema';
import Message from '../models/messageSchema';
import Conversation from '../models/conversationSchema';
import Review from '../models/reviewSchema';
import { io } from '../../server';

const userRouter = express.Router();

const userRepo: IUserRepo = new UserRepo(Users, Otp, Accommodations, Bookings, Conversation, Message, Review)
const hashingService: IHashingService = new HashingService()
const emailService: IEmailService = new EmailService()
const otpService: IOtpService = new OtpService()
const jwtService: IJwtService = new JwtService()
const cloudinaryService: ICloudinaryService = new CloudinaryService()
const stripeService: IStripeService = new StripeService()
const userUseCase: IUserUseCase = new UserUseCase(userRepo, hashingService, jwtService, emailService, otpService, cloudinaryService, stripeService);
const userController: IUserController = new UserController(userUseCase, io);

userRouter.post('/register', userController.handleRegister.bind(userController));

userRouter.post('/otpVerify', userController.handleOtpVerification.bind(userController));

userRouter.post('/otpResend', userController.handleOtpResend.bind(userController));

userRouter.post('/login', userController.handleLogin.bind(userController));

userRouter.post('/logout', userController.handleLogout.bind(userController));

userRouter.get('/getUser', authenticateJwt, userController.getUserInfo.bind(userController));

userRouter.post('/googleAuth', userController.googleAuth.bind(userController))

userRouter.get('/checkMail', userController.handleCheckMail.bind(userController))

userRouter.post('/verifyForgotPasswordOtp', userController.verifyForgotPasswordOtp.bind(userController))

userRouter.patch('/resetPassword', userController.resetPassword.bind(userController))

userRouter.put('/updateProfile', authenticateJwt, userController.updateProfile.bind(userController))

userRouter.put('/updatePassword', authenticateJwt, userController.updatePassword.bind(userController))

userRouter.put('/updateIdentity', authenticateJwt, userController.updateIdentity.bind(userController))

userRouter.put('/updateBankAccount', authenticateJwt, userController.updateBankAccount.bind(userController))

userRouter.post('/addHotel', authenticateJwt, userController.addHotel.bind(userController))

userRouter.get('/getMyHotels', authenticateJwt, userController.getAccommodationsByUserId.bind(userController))

userRouter.get('/getHotel/:hotelId', userController.getHotelById.bind(userController));

userRouter.put('/updateHotel', authenticateJwt, userController.updateHotel.bind(userController))

userRouter.get('/getAllHotels', userController.getAllHotels.bind(userController))

userRouter.get('/checkAvailability', userController.checkAvailability.bind(userController))

userRouter.post('/createPaymentIntent', authenticateJwt, userController.createPaymentIntent.bind(userController));

userRouter.post('/createBooking', authenticateJwt, userController.createBooking.bind(userController))

userRouter.post('/cancelBooking/:bookingId', authenticateJwt, userController.cancelBooking.bind(userController))

userRouter.get('/getBookedHotels', authenticateJwt, userController.getBookedHotels.bind(userController))

userRouter.get('/getSchedule/:hotelId', authenticateJwt, userController.getSchedule.bind(userController))

userRouter.get('/getToken/', authenticateJwt, userController.getToken.bind(userController))

userRouter.get('/getMessage/:receiverId', authenticateJwt, userController.getMessages.bind(userController))

userRouter.post('/sendMessage', authenticateJwt, userController.sendMessage.bind(userController))

userRouter.get('/getMessagedUsers', authenticateJwt, userController.getMessagedUsers.bind(userController))

userRouter.get('/getReviews/:accommodationId', userController.getReviews.bind(userController))

userRouter.get('/checkIfUserCanReview/:accommodationId', authenticateJwt, userController.canUserReview.bind(userController))

userRouter.post('/addReview/:accommodationId', authenticateJwt, userController.addReview.bind(userController))

export default userRouter; 