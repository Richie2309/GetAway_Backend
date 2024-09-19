import { IUserDocument } from "../interface/collections/IUsers.collection";
import { IRegisterCredentials } from "../interface/controllers/IUserController";
import IUserRepo from "../interface/repositories/IUserRepo";
import IUserUseCase, { loginRes } from "../interface/usecase/IUserUseCase";
import IHashingService from "../interface/utils/IHashingService";
import IOtpService from "../interface/utils/IOtpService";
import IEmailService from "../interface/utils/IEmailService";
import IJwtService, { IPayload } from "../interface/utils/IJwtServices";
import authenticationError from "../errors/authenticationError"
import { StatusCodes } from "../enums/statusCode.enums";
import { IOtpDocument } from "../interface/collections/IOtp.collections";
import jwtTokenError from "../errors/jwtError"
import ICloudinaryService from "../interface/utils/ICloudinaryService";
import { IStripeService } from "../interface/utils/IStripeService";
import { IAccommodationDocument } from "../interface/collections/IAccommodations.collection";
import { IAccommodationWithBookingDetails, IBookingDocument, IPaymentIntent } from "../interface/collections/IBooking.collection";
import Stripe from "stripe";
import { IMessageDocument } from "../interface/collections/IMessage.collections";
import { io } from "../server";
import { getRecieverId } from "../frameworks/config/socketHandlers";
import { IReviewDocument } from "../interface/collections/IReview.collections";

export default class UserUseCase implements IUserUseCase {
    private userRepo: IUserRepo
    private hashingService: IHashingService
    private jwtService: IJwtService
    private otpService: IOtpService
    private emailService: IEmailService
    private _cloudinaryService: ICloudinaryService
    private _stripeService: IStripeService

    constructor(userRepo: IUserRepo, hashingService: IHashingService, jwtService: IJwtService, emailService: IEmailService, otpService: IOtpService, cloudinaryService: ICloudinaryService, stripeService: IStripeService) {
        this.userRepo = userRepo
        this.hashingService = hashingService
        this.jwtService = jwtService
        this.otpService = otpService
        this.emailService = emailService
        this._cloudinaryService = cloudinaryService
        this._stripeService = stripeService
    }

    //REGISTER
    async registerUser(registerData: IRegisterCredentials): Promise<void> {
        try {
            const user: IUserDocument | null = await this.userRepo.getDataByEmail(registerData.email);
            if (user) {
                console.log('user already exist');
                throw new authenticationError({ message: 'The email address you entered is already registered.', statusCode: StatusCodes.BadRequest, errorField: 'email' });
            }

            const hashedPassword: string = await this.hashingService.hash(registerData.password);
            registerData.password = hashedPassword;

            await this.userRepo.createUser(registerData)

            await this.generateAndSendOTP(registerData.email);
        } catch (err: any) {
            throw err
        }
    }

    //LOGIN
    async authenticateUser(email: string, password: string): Promise<loginRes | never> {
        try {
            const userData: IUserDocument | null = await this.userRepo.getDataByEmail(email);

            if (!userData) {
                throw new authenticationError({ message: 'The provided email address is not found.', statusCode: StatusCodes.Unauthorized, errorField: 'email' });
            } else if (!await this.hashingService.compare(password, userData.password as string)) {
                throw new authenticationError({ message: 'The provided password is incorrect.', statusCode: StatusCodes.Unauthorized, errorField: 'password' })
            } else if (!userData.otp_verification) {
                await this.generateAndSendOTP(userData.email as string); // send otp via email.
                throw new authenticationError({ message: 'Account is not verified.', statusCode: StatusCodes.Unauthorized, errorField: "otp", notOtpVerifiedError: userData.email as string });
            }

            const payload: IPayload = {
                id: userData._id,
                type: 'User'
            }
            const token: string = this.jwtService.sign(payload);
            const refreshToken: string = this.jwtService.generateRefreshToken(payload);

            return {
                token, 
                refreshToken,
                userData
            }
        } catch (err: any) {
            throw err;
        }
    }

    // async refreshAccessToken(refreshToken: string): Promise<string | never> {
    //     try {
    //         const decoded = this.jwtService.verifyRefreshToken(refreshToken);
    //         const payload: IPayload = { id: decoded.id, type: 'User' };
    //         const newAccessToken: string = this.jwtService.sign(payload);  // Generate new access token
    //         return newAccessToken;
    //     } catch (err) {
    //         throw new Error('Invalid refresh token');
    //     }
    // }

    private async generateAndSendOTP(email: string): Promise<void | never> {
        try {
            const otp: string = this.otpService.generateOTP();

            const to: string = email;
            const subject: string = 'OTP For Account Verification';
            const text: string = `You're OTP for account verification is ${otp}`;

            await this.emailService.sendEmail(to, subject, text); // sending email with the verification code (OTP)

            const sotp = await this.userRepo.createOtp(email, otp); // saving otp in database
            console.log('otp is:', otp);

        } catch (err: any) {
            throw err;
        }
    }

    async verifyOtp(email: string | undefined, otp: string): Promise<string | never> {
        try {
            const otpData: IOtpDocument | null = await this.userRepo.getOtpByEmail(email);
            console.log('verifyotp in usecase', otpData);

            if (!email) {
                throw new authenticationError({ message: 'Email is not provided.', statusCode: StatusCodes.NotFound, errorField: 'email' })
            } else if (!otpData) {
                throw new authenticationError({ message: 'OTP expired. Resend again.', statusCode: StatusCodes.BadRequest, errorField: 'otp' });
            } else if (otpData.otp !== otp) {
                throw new authenticationError({ message: 'The OTP you entered is incorrect.', statusCode: StatusCodes.BadRequest, errorField: 'otp' });
            }

            await this.userRepo.makeUserVerified(email)
            const userData: IUserDocument | null = await this.userRepo.getDataByEmail(email)

            const payload: IPayload = {
                id: userData?.id,
                type: 'User'
            }

            const authToken: string = this.jwtService.sign(payload)
            return authToken

        } catch (err) {
            throw err;
        }

    }

    async resendOtp(email: string): Promise<void | never> {
        try {
            if (!email) {
                throw new authenticationError({ message: 'Email is not provided.', statusCode: StatusCodes.NotFound, errorField: 'email' });
            }

            await this.generateAndSendOTP(email); // send otp via email.
        } catch (err: any) {
            throw err;
        }
    }

    async verifyToken(token: string | undefined): Promise<void | never> {
        try {
            if (!token) {
                throw new jwtTokenError({ statusCode: StatusCodes.Unauthorized, message: 'User not authenticated' })
            }

            const decoded: IPayload = this.jwtService.verifyToken(token);

            if (decoded.type !== 'User') {
                throw new jwtTokenError({ statusCode: StatusCodes.BadRequest, message: 'Invaild Token' });
            }
        } catch (err: any) {
            throw err;
        }
    }

    async getUserInfo(userId: string): Promise<IUserDocument | null> {
        return await this.userRepo.getUserInfo(userId);
    }

    async googleAuthUser(name: string, email: string): Promise<string | null> {
        try {
            let userData: IUserDocument | null = await this.userRepo.getDataByEmail(email);
            console.log('user usecase google auth', userData);

            if (!userData) {
                console.log(name, email, 'usecase google');

                await this.userRepo.saveGoogleAuth(name, email);
                console.log('no user data in google use case');

            }

            if (userData) {
                const payload: IPayload = {
                    id: userData._id,
                    type: 'User'
                };

                const token = this.jwtService.sign(payload);

                return token;
            } else {
                return null; // Return null if user data is not available
            }
        } catch (err) {
            console.error(err);
            return null; // Return null if there's an error
        }
    }

    async checkMail(email: string): Promise<boolean> {
        const user: IUserDocument | null = await this.userRepo.getDataByEmail(email)
        if (user) {
            await this.resendOtp(email);
            return true;
        }
        return false;
    }

    async verifyForgotPasswordOtp(email: string, otp: string): Promise<string> {
        const otpData: IOtpDocument | null = await this.userRepo.getOtpByEmail(email);
        if (!email) {
            throw new authenticationError({ message: 'Email is not provided.', statusCode: StatusCodes.NotFound, errorField: 'email' })
        } else if (!otpData) {
            throw new authenticationError({ message: 'OTP expired. Resend again.', statusCode: StatusCodes.BadRequest, errorField: 'otp' });
        } else if (otpData.otp !== otp) {
            throw new authenticationError({ message: 'The OTP you entered is incorrect.', statusCode: StatusCodes.BadRequest, errorField: 'otp' });
        }
        const token = this.jwtService.sign({ id: email, type: 'reset-password' });
        return token;
        // return true;
    }

    async resetPassword(token: string, email: string | undefined, newPassword: string): Promise<IUserDocument | null> {
        const decoded = this.jwtService.verifyToken(token);

        if (decoded.type !== 'reset-password') {
            throw new Error('Invalid token type');
        }
        const hashedPassword: string = await this.hashingService.hash(newPassword);
        return await this.userRepo.resetPassword(email, hashedPassword);
    }

    async updateProfile(userId: string | undefined, updateData: any): Promise<IUserDocument | null> {
        console.log('updated data in usecase', updateData);

        if (!userId) throw new Error("User ID is required");
        return await this.userRepo.updateProfile(userId, updateData);
    }

    async updatePassword(userId: string | undefined, newPassword: string): Promise<IUserDocument | null> {
        if (!userId) throw new Error("User ID is required");
        const hashedPassword: string = await this.hashingService.hash(newPassword);
        return await this.userRepo.updatePassword(userId, hashedPassword);
    }

    async updateIdentity(userId: string | undefined, images: string[]): Promise<IUserDocument | null> {
        if (!userId) {
            throw new Error('User ID is required');
        }
        try {
            const uploadImages = await Promise.all(
                images.map((image) => this._cloudinaryService.uploadImage(image))
            )
            images = uploadImages
            return await this.userRepo.updateIdentity(userId, images);
        } catch (error) {
            console.error('Error updating identity:', error);
            throw error;
        }
    }

    async updateBankAccount(userId: string | undefined, bankDetails: { accountNumber: string; ifscCode: string }): Promise<IUserDocument | null> {
        if (!userId) throw new Error("User ID is required");
        return await this.userRepo.updateBankAccount(userId, bankDetails);
    }

    async addHotel(hotelData: IAccommodationDocument): Promise<void | never> {
        try {
            const uploadedImages = await Promise.all(
                hotelData.photos.map((image) => this._cloudinaryService.uploadImage(image))
            );

            hotelData.photos = uploadedImages;

            return await this.userRepo.addHotel(hotelData);
        } catch (err) {
            console.error('Error uploading images or adding hotel:', err);
            throw err;
        }
    }

    async getAccommodationsByUserId(userId: string): Promise<IAccommodationDocument[]> {
        try {
            if (!userId) throw new Error("User ID is required");
            return this.userRepo.getAccommodationsByUserId(userId)
        } catch (err) {
            console.error('Error getting hotel:', err);
            throw err;
        }
    }

    async getHotelById(hotelId: string): Promise<IAccommodationDocument | null> {
        try {
            if (!hotelId) throw new Error('Hotel ID is required');
            return await this.userRepo.getHotelbyId(hotelId);
        } catch (err) {
            console.log('Error in use case while getting hotel by ID:', err);
            throw err;
        }
    }


    async updateHotel(hotelData: IAccommodationDocument): Promise<void | never> {
        try {
            await this.userRepo.updateHotel(hotelData)
        } catch (err) {
            throw err
        }
    }

    async getAllHotels(searchQuery?: string, checkInDate?: Date, checkOutDate?: Date, guests?: number): Promise<IAccommodationDocument[]> {
        try {
            return await this.userRepo.getAllHotels(searchQuery, checkInDate, checkOutDate, guests);
        } catch (err) {
            throw err;
        }
    }

    async checkAvailability(accommodationId: string, checkInDate: Date, checkOutDate: Date): Promise<boolean> {
        try {
            return await this.userRepo.checkAvailability(accommodationId, checkInDate, checkOutDate);
        } catch (err) {
            throw err;
        }
    }

    async createBooking(accommodationId: string, userId: string, checkIn: Date, checkOut: Date, guests: number, totalPrice: number, paymentIntentId: string): Promise<IBookingDocument> {
        try {
            return await this.userRepo.createBooking(accommodationId, userId, checkIn, checkOut, guests, totalPrice, paymentIntentId);
        } catch (err) {
            throw err;
        }
    }

    async createPaymentIntent(amount: number): Promise<Stripe.PaymentIntent> {
        try {
            return await this._stripeService.createPaymentIntentService(amount)
        } catch (err) {
            throw err;
        }
    }

    async cancelBooking(bookingId: string,cancellationReason: string): Promise<IBookingDocument> {
        try {
            const booking = await this.userRepo.cancelBooking(bookingId,cancellationReason);
            if (!booking) {
                console.log(`Booking not found: ${bookingId}`);
                throw new Error('Booking not found');
            }
            try {
                await this._stripeService.createRefund(booking.paymentIntentId, booking.totalPrice);
            } catch (refundError) {
                console.error('Error processing refund:', refundError);
                // Update booking status to reflect failed refund
                booking.status = 'Cancelled';
                await booking.save();
                throw new Error('Refund failed, but booking has been cancelled');
            }
            return booking;
        } catch (err) {
            throw err
        }
    }

    async getBookedHotels(userId: string): Promise<IAccommodationWithBookingDetails[]> {
        try {
            if (!userId) throw new Error("User ID is required");
            return this.userRepo.getBookedHotels(userId)
        } catch (err) {
            console.error('Error getting hotel:', err);
            throw err;
        }
    }


    async getSchedule(hotelId: string): Promise<IBookingDocument[]> {
        try {
            if (!hotelId) throw new Error("Hotel ID is required");
            return this.userRepo.getSchedule(hotelId)
        } catch (err) {
            console.error('Error getting guest details:', err);
            throw err;
        }
    }

    async getMessages(senderId: string, receiverId: string): Promise<IMessageDocument[]> {
        try {
            if (!senderId) throw new Error("senderId ID is required");
            if (!receiverId) throw new Error("receiverId ID is required");
            return await this.userRepo.getMessages(senderId, receiverId);
        } catch (err) {
            console.error('Error getting chat details', err);
            throw err;
        }
    }

    async sendMessage(senderId: string, receiverId: string, message: string, type: string): Promise<IMessageDocument> {
        try {
            console.log(message, type);

            if (!senderId) throw new Error("senderId ID is required");
            if (!receiverId) throw new Error("receiverId ID is required");

            let mediaUrl = message
            if (type !== 'text') {
                const resourceType = type === 'video' ? 'video' : 'image';
                mediaUrl = await this._cloudinaryService.uploadData(message, resourceType)
            }

            const newMessage = await this.userRepo.sendMessage(senderId, receiverId, mediaUrl, type);
            const checkId = getRecieverId(receiverId)

            if (checkId) {
                io.to(receiverId).emit('newMessage', newMessage)
            }
            return newMessage;
        } catch (err) {
            console.error('Error getting chat details', err);
            throw err;
        }
    }

    async getMessagedUsers(hostId: string): Promise<IUserDocument[] | null> {
        try {
            if (!hostId) throw new Error("hostId ID is required");
            return await this.userRepo.getMessagedUsers(hostId)
        } catch (err) {
            console.error('Error getting messages users', err);
            throw err;
        }
    }

    async getReviews(accommodationId: string): Promise<IReviewDocument[]> {
        try {
            return await this.userRepo.getReviews(accommodationId)
        } catch (err) {
            throw err
        }
    }

    async canUserReview(userId: string, accommodationId: string): Promise<boolean> {
        try {
            const completedBooking = await this.userRepo.canUserReview(userId, accommodationId)
            return !!completedBooking
        } catch (err) {
            console.error('Error getting details', err);
            throw err;
        }
    }

    async addReview(reviewData: IReviewDocument): Promise<IReviewDocument> {
        try {
            const res = this.userRepo.addReview(reviewData);
            return res

        } catch (err) {
            console.error('Error getting details', err);
            throw err;
        }
    }

    async getTopThreeAccommodations(): Promise<IAccommodationDocument[] | void> {
        try {
            const topAccommodations = await this.userRepo.getTopThreeAccommodations();
            return topAccommodations;
        } catch (err) {
            throw err;
        }
    }
}