import { NextFunction, Request, Response } from "express";
import IUserController, { AuthUserReq, ILoginCredentials, IRegisterCredentials } from "../../interface/controllers/IUserController";
import { StatusCodes } from "../../enums/statusCode.enums";
import IUserUseCase from "../../interface/usecase/IUserUseCase";

class UserController implements IUserController {
    private userUseCase: IUserUseCase

    constructor(userUseCase: IUserUseCase) {
        this.userUseCase = userUseCase
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

            // usecase for authenticateing User
            const token: string = await this.userUseCase.authenticateUser(email, password); // return token if credentials and user is verified or error

            res.cookie('token', token, { httpOnly: true }); // Set http only cookie for token

            res.status(StatusCodes.Success).json({
                message: "Successfuly login"
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
            console.log('name:', name, 'email:', email, 'this is from controler google');

            const token = await this.userUseCase.googleAuthUser(name, email);
            console.log('google auth in controller', email,);

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

    async updateProfile(req: AuthUserReq, res: Response): Promise<void> {
        try {
            const userId = req.user;
            console.log('userid', userId);

            const updateData = req.body.profile;
            console.log('updataed data in controller', updateData);

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
        console.log('in controllerfdsfas', req.body);
        try {
            const userId = req.user;
            const { images } = req.body


            console.log("length", images.length);

            const updatedUser = await this.userUseCase.updateIdentity(userId, images)
            console.log("contr", updatedUser);

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
            // console.log(hotelData);
            hotelData.added_by = userId
            const newHotel = await this.userUseCase.addHotel(hotelData)
            res.status(StatusCodes.Success).json({ hotel: newHotel })
        } catch (err) {
            next(err)
        }
    }

    async getHotelById(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const hotelId = req.params.hotelId;

            const hotel = await this.userUseCase.getHotelById(hotelId);

            res.status(StatusCodes.Success).json({ hotel });
        } catch (err) {
            console.error('Error in getHotel controller:', err);
            res.status(StatusCodes.InternalServer).json({ error: 'Internal server error' });
        }
    }

    async updateHotel(req: Request, res: Response, next: NextFunction): Promise<void | never> {
        try {
            const hotelId = req.params.id
            const updateData = req.body
            const updatedHotel = await this.userUseCase.updateHotel(hotelId, updateData)
            res.status(StatusCodes.Success).json({ hotel: updatedHotel })
        } catch (err) {
            next(err)
        }
    }
}

export default UserController