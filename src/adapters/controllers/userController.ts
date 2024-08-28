import { NextFunction, Request, Response } from "express";
import IUserController, { AuthUserReq, ILoginCredentials, IRegisterCredentials } from "../../interface/controllers/IUserController";
import { StatusCodes } from "../../enums/statusCode.enums";
import IUserUseCase from "../../interface/usecase/IUserUseCase";
import { Server as SocketIOServer } from 'socket.io';
class UserController implements IUserController {
    private userUseCase: IUserUseCase

    constructor(userUseCase: IUserUseCase, io: SocketIOServer) {
        this.userUseCase = userUseCase;
    }

    async handleRegister(req: Request, res: Response, next: NextFunction): Promise<void | never> {
        try {
            console.log('handleregister', req.body);

            const { fullName, email, password }: IRegisterCredentials = req.body;

            const registerData: IRegisterCredentials = { fullName, email, password }

            await this.userUseCase.registerUser(registerData);

            res.cookie('emailToBeVerified', registerData.email); // Set http only cookie for user email to verify the otp

            res.status(StatusCodes.Success).json({ message: 'User registered, OTP sent' });
        } catch (err: any) {
            console.log(err);
            next(err)
        }
    }

    async handleOtpVerification(req: Request, res: Response, next: NextFunction): Promise<void | never> {
        try {
            const emailToBeVerified: string | undefined = req.cookies.emailToBeVerified;
            const otp: string = req.body.otp;

            console.log('handleotpveri in controller', otp);

            const token: string = await this.userUseCase.verifyOtp(emailToBeVerified, otp);

            console.log('handleotpveri in controller', token);

            res.cookie('emailToBeVerified', '', { expires: new Date(Date.now()) }); // clearing http only cookie
            res.cookie('token', token, { httpOnly: true, expires: new Date(Date.now()) }); // clearing http only cookie

            res.status(StatusCodes.Success).json({
                message: "Successfuly account verified"
            });
        } catch (err: any) {
            next(err);
        }
    }

    async handleOtpResend(req: Request, res: Response, next: NextFunction): Promise<void | never> {
        try {
            const emailToBeVerified: string | undefined = req.cookies.emailToBeVerified;

            await this.userUseCase.resendOtp(emailToBeVerified);

            res.status(StatusCodes.Success).json({
                message: 'OTP Resend Successfull'
            });
        } catch (err: any) {
            next(err);
        }
    }

    async handleLogin(req: Request, res: Response, next: NextFunction): Promise<void | never> {
        try {
            const { email, password }: ILoginCredentials = req.body;
            const response = await this.userUseCase.authenticateUser(email, password);
            const token: string = response.token
            res.cookie('token', token, { httpOnly: true }); // Set http only cookie for token
            res.status(StatusCodes.Success).json({
                message: "Successfuly login",
                userData: response.userData
            });
        } catch (err: any) {
            next(err);
        }
    }

    async handleLogout(req: Request, res: Response, next: NextFunction): Promise<void | never> {
        try {
            res.cookie('token', '', { httpOnly: true, expires: new Date(0) }); // clearing token stroed http only cookie to logout.
            res.status(StatusCodes.Success).json({
                message: "User Logout sucessfull"
            });
        } catch (err: any) {
            next(err);
        }
    }

    async verifyTokenRequest(req: Request, res: Response, next: NextFunction): Promise<void | never> {
        try {
            const token: string | undefined = req.cookies.token;

            await this.userUseCase.verifyToken(token);

            res.status(StatusCodes.Success).json({
                message: 'User is authenticated'
            });
        } catch (err: any) {
            next(err);
        }
    }

    async getUserInfo(req: AuthUserReq, res: Response): Promise<void> {
        try {
            const userId = req.user

            if (!userId) {
                res.status(StatusCodes.Unauthorized).json({ error: "User ID is missing" });
                return;
            }

            const user = await this.userUseCase.getUserInfo(userId);

            if (!user) {
                res.status(StatusCodes.Unauthorized).json({ error: "User not found" })
                return
            }
            res.status(StatusCodes.Success).json({ user })
        } catch (err) {
            console.log(err);
            res.status(StatusCodes.InternalServer).json({ error: 'Internal server error' })
        }
    }

    async googleAuth(req: Request, res: Response): Promise<void> {
        try {
            const { name, email } = req.body;
            const token = await this.userUseCase.googleAuthUser(name, email);
            if (token) {
                res.cookie('token', token, { httpOnly: true })
                res.status(StatusCodes.Success).json({ token });
            } else {
                res.status(StatusCodes.Unauthorized).json({ message: 'Google authentication failed' });
            }
        } catch (err) {
            console.error('Error in googleAuth controller:', err);
            res.status(StatusCodes.InternalServer).json({ message: 'Internal Server Error' });
        }
    }

    async handleCheckMail(req: Request, res: Response, next: NextFunction): Promise<void | never> {
        const { email } = req.query
        if (!email || typeof email !== 'string') {
            res.status(400).json({ error: 'Invalid email' });
            return;
        }
        try {
            const exists = await this.userUseCase.checkMail(email);
            res.json({ exists });
        } catch (err) {
            console.error('Error checking email:', err);
            res.status(StatusCodes.InternalServer).json({ error: 'Internal server error' });
        }
    }

    async verifyForgotPasswordOtp(req: Request, res: Response): Promise<void> {
        const { email, otp } = req.body;
        try {
            const token = await this.userUseCase.verifyForgotPasswordOtp(email, otp)
            res.status(StatusCodes.Success).json({ message: 'OTP verified successfully.', token });
        } catch (err) {
            res.status(StatusCodes.InternalServer).json({ message: 'Internal Server Error' });
        }
    }

    async resetPassword(req: Request, res: Response): Promise<void> {
        try {
            const { token, email, password } = req.body;
            const updatedUser = await this.userUseCase.resetPassword(token, email, password);

            res.status(StatusCodes.Success).json({ user: updatedUser });
        } catch (err) {
            res.status(StatusCodes.InternalServer).json({ error: 'Internal server error' });
        }
    }

    async updateProfile(req: AuthUserReq, res: Response): Promise<void> {
        try {
            const userId = req.user;

            const updateData = req.body.profile;

            const updatedUser = await this.userUseCase.updateProfile(userId, updateData);

            res.status(StatusCodes.Success).json({ user: updatedUser });
        } catch (err) {
            res.status(StatusCodes.InternalServer).json({ error: 'Internal server error' });
        }
    }

    async updatePassword(req: AuthUserReq, res: Response): Promise<void> {
        try {
            const userId = req.user;

            const { newPassword } = req.body;
            const updatedUser = await this.userUseCase.updatePassword(userId, newPassword);

            res.status(StatusCodes.Success).json({ user: updatedUser });
        } catch (err) {
            res.status(StatusCodes.InternalServer).json({ error: 'Internal server error' });
        }
    }

    async updateIdentity(req: AuthUserReq, res: Response): Promise<void> {
        try {
            const userId = req.user;
            const { images } = req.body
            const updatedUser = await this.userUseCase.updateIdentity(userId, images)
            res.status(StatusCodes.Success).json({ user: updatedUser })
        } catch (err) {
            res.status(StatusCodes.InternalServer).json({ error: 'Internal server error' });
        }
    }

    async updateBankAccount(req: AuthUserReq, res: Response): Promise<void> {
        try {
            const userId = req.user;

            const { accountNumber, ifscCode } = req.body;

            const updatedUser = await this.userUseCase.updateBankAccount(userId, { accountNumber, ifscCode });

            res.status(StatusCodes.Success).json({ user: updatedUser });
        } catch (err) {
            res.status(StatusCodes.InternalServer).json({ error: 'Internal server error' });
        }
    }

    async addHotel(req: AuthUserReq, res: Response, next: NextFunction): Promise<void | never> {
        try {
            const userId = req.user
            const hotelData = req.body
            hotelData.added_by = userId
            const newHotel = await this.userUseCase.addHotel(hotelData)
            res.status(StatusCodes.Success).json({ hotel: newHotel })
        } catch (err) {
            next(err)
        }
    }

    async getAccommodationsByUserId(req: AuthUserReq, res: Response, next: NextFunction): Promise<void | never> {
        try {
            const userId = req.user!
            const accommodations = await this.userUseCase.getAccommodationsByUserId(userId)
            res.status(StatusCodes.Success).json(accommodations)
        } catch (err) {
            next(err)
        }
    }


    async getHotelById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const hotelId = req.params.hotelId;
            const hotel = await this.userUseCase.getHotelById(hotelId);
            if (hotel) {
                res.status(StatusCodes.Success).json({ hotel });
            } else {
                res.status(StatusCodes.NotFound).json({ message: 'Hotel not found' });
            }
        } catch (err) {
            next(err);
        }
    }

    async updateHotel(req: AuthUserReq, res: Response, next: NextFunction): Promise<void | never> {
        try {
            const hotelData = req.body
            await this.userUseCase.updateHotel(hotelData);
            res.status(StatusCodes.Success).json({ message: 'Hotel updated successfully' });
        } catch (err) {
            next(err)
        }
    }

    async getAllHotels(req: Request, res: Response, next: NextFunction): Promise<void | never> {
        try {
            const { destination, checkIn, checkOut, guests } = req.query;
            const allHotels = await this.userUseCase.getAllHotels(
                destination as string,
                checkIn ? new Date(checkIn as string) : undefined,
                checkOut ? new Date(checkOut as string) : undefined,
                guests ? parseInt(guests as string, 10) : undefined
            );
            res.status(StatusCodes.Success).json({ allHotels });
        } catch (err) {
            next(err);
        }
    }

    async checkAvailability(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { accommodationId, checkIn, checkOut } = req.query;
            const isAvailable = await this.userUseCase.checkAvailability(accommodationId as string, new Date(checkIn as string), new Date(checkOut as string));
            res.status(StatusCodes.Success).json({ isAvailable });
        } catch (err) {
            next(err);
        }
    }

    async createBooking(req: AuthUserReq, res: Response, next: NextFunction): Promise<void> {
        const { accommodationId, checkIn, checkOut, guests, totalPrice, paymentIntentId } = req.body;
        const userId = req.user
        try {
            if (!userId) {
                res.status(StatusCodes.Unauthorized).json({ error: 'User not authenticated' });
                return;
            }
            const booking = await this.userUseCase.createBooking(accommodationId, userId, new Date(checkIn), new Date(checkOut), guests, totalPrice, paymentIntentId);

            res.status(StatusCodes.Success).json({ booking });
        } catch (err) {
            next(err);
        }
    }

    async createPaymentIntent(req: Request, res: Response, next: NextFunction): Promise<void> {
        const { amount } = req.body;
        try {
            const paymentIntent = await this.userUseCase.createPaymentIntent(amount);
            res.status(StatusCodes.Success).json({ clientSecret: paymentIntent.client_secret, paymentIntentId: paymentIntent.id });
        } catch (err) {
            next(err);
        }
    }

    async cancelBooking(req: Request, res: Response, next: NextFunction): Promise<void> {
        const { bookingId } = req.params;
        try {
            const result = await this.userUseCase.cancelBooking(bookingId);
            console.log('result in controller',result);
            
            res.status(StatusCodes.Success).json(result);
        } catch (err) {
            next(err);
        }
    }

    async getBookedHotels(req: AuthUserReq, res: Response, next: NextFunction): Promise<void | never> {
        try {
            const userId = req.user!
            const accommodations = await this.userUseCase.getBookedHotels(userId)
            res.status(StatusCodes.Success).json(accommodations)
        } catch (err) {
            next(err)
        }
    }

    async getSchedule(req: AuthUserReq, res: Response, next: NextFunction): Promise<void> {
        try {
            const hotelId = req.params.hotelId
            const bookings = await this.userUseCase.getSchedule(hotelId);
            res.status(StatusCodes.Success).json(bookings);
        } catch (err) {
            next(err)
        }
    }

    async getToken(req: AuthUserReq, res: Response, next: NextFunction): Promise<void> {
        try {
            const userId = req.cookies.token
            res.status(StatusCodes.Success).json(userId)
        } catch (err) {
            next(err)
        }
    }

    async getMessages(req: AuthUserReq, res: Response, next: NextFunction): Promise<void> {
        try {
            const senderId = req.user!;
            const receiverId = req.params.receiverId;
            const messages = await this.userUseCase.getMessages(senderId, receiverId);
            res.status(StatusCodes.Success).json(messages);
        } catch (err) {
            next(err);
        }
    }

    async sendMessage(req: AuthUserReq, res: Response, next: NextFunction): Promise<void> {
        try {
            const senderId = req.user!
            const { receiverId, message, type } = req.body;
            const newMessage = await this.userUseCase.sendMessage(senderId, receiverId, message, type)
            res.status(StatusCodes.Success).json(newMessage)
        } catch (err) {
            next(err)
        }
    }

    async getMessagedUsers(req: AuthUserReq, res: Response, next: NextFunction): Promise<void> {
        try {
            const hostId = req.user!
            const users = await this.userUseCase.getMessagedUsers(hostId);
            res.status(StatusCodes.Success).json(users);
        } catch (err) {
            next(err)
        }
    }

}

export default UserController