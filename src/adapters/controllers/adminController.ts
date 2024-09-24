import { Request, Response } from "express";
import IAdminController from "../../interface/controllers/IAdminController";
import IAdminUseCase from "../../interface/usecase/IAdminUseCase";
import { StatusCodes } from "../../enums/statusCode.enums";

export default class AdminController implements IAdminController {
    private _adminUseCase: IAdminUseCase;

    constructor(adminUseCase: IAdminUseCase) {
        this._adminUseCase = adminUseCase;
    }

    async adminLogin(req: Request, res: Response): Promise<void> {
        try {
            const { email, password } = req.body

            const adminEmail: string = process.env.ADMIN_EMAIL as string
            const adminPassword: string = process.env.ADMIN_PASSWORD as string

            const { accessToken, refreshToken } = await this._adminUseCase.adminLogin(email, password, adminEmail, adminPassword)
            res.cookie('token', accessToken, { httpOnly: true, maxAge: 15 * 60 * 60 });
            res.cookie('refreshToken', refreshToken, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 60 });
            res.status(StatusCodes.Success).json({ message: 'Login successful' });
        } catch (err) {
            res.status(StatusCodes.Unauthorized).json({ message: 'Invalid credentials' });
        }
    }

    async adminLogout(req: Request, res: Response): Promise<void> {
        res.clearCookie('token', { httpOnly: true });
        res.clearCookie('refreshToken', { httpOnly: true });
        res.status(StatusCodes.Success).json({ message: 'Logged out successfully' });
    }

    async checkAuth(req: Request, res: Response): Promise<void> {
        const { token } = req.cookies;
        if (!token) {
            res.status(StatusCodes.Unauthorized).json({ error: 'No token provided' });
            return;
        }
        const isAuthenticated = await this._adminUseCase.checkAuth(token);
        if (isAuthenticated) {
            res.status(StatusCodes.Success).json({ message: 'Authenticated', type: 'Admin' });
        } else {
            res.status(StatusCodes.Unauthorized).json({ error: 'Invalid or expired token' });
        }
        // try {
        //     const decoded = this.jwtService.verifyToken(token)

        //     if (decoded.type !== 'Admin') {
        //         res.clearCookie('token', { httpOnly: true });
        //         res.clearCookie('refreshToken', { httpOnly: true })

        //         res.status(StatusCodes.Unauthorized).json({ error: 'Access denied' })
        //         return;
        //     }
        //     next();
        // } catch (error) {
        //     return res.status(StatusCodes.Unauthorized).json({ message: 'Invalid token' });
        // }




        // try {
        //     const { token } = req.cookies;
        //     if (!token) {
        //         res.status(StatusCodes.Unauthorized).json({ error: 'No token provided' });
        //         return;
        //     }

        //     // Verify the JWT token via the use case
        //     const isAuthenticated = await this._adminUseCase.checkAuth(token);

        //     if (isAuthenticated) {
        //         res.status(StatusCodes.Success).json({ message: 'Authenticated', type: 'Admin' });
        //     } else {
        //         res.status(StatusCodes.Unauthorized).json({ error: 'Invalid or expired token' });
        //     }
        // } catch (error) {
        //     res.status(StatusCodes.InternalServer).json({ error: 'Internal server error' });
        // }
    }

    async getUsers(req: Request, res: Response): Promise<void> {
        try {
            const users = await this._adminUseCase.getUsers();

            res.status(StatusCodes.Success).json(users);
        } catch (err) {
            res.status(StatusCodes.Unauthorized).json({ message: 'Unauthorized' });
        }
    }

    async toggleBlockUser(req: Request, res: Response): Promise<void> {
        try {
            const { userId } = req.params;
            const user = await this._adminUseCase.toggleBlockUser(userId);
            res.status(StatusCodes.Success).json(user);
        } catch (err) {
            res.status(StatusCodes.Unauthorized).json({ message: 'Unauthorized' });
        }
    }

    async getHotels(req: Request, res: Response): Promise<void> {
        try {
            const hotels = await this._adminUseCase.getHotels();
            res.status(StatusCodes.Success).json(hotels);
        } catch (err) {
            res.status(StatusCodes.Unauthorized).json({ message: 'Unauthorized' });
        }
    }

    async getHotelById(req: Request, res: Response): Promise<void> {
        try {
            const hotelId = req.params.hotelId;
            const hotel = await this._adminUseCase.getHotelById(hotelId);
            res.status(StatusCodes.Success).json(hotel);
        } catch (err) {
            res.status(StatusCodes.Unauthorized).json({ message: 'Unauthorized' });
        }
    }

    async getHotelDetailsById(req: Request, res: Response): Promise<void> {
        try {
            const hotelId = req.params.hotelId;
            const hotel=await this._adminUseCase.getHotelDetailsById(hotelId)
            res.status(StatusCodes.Success).json(hotel);
        } catch (err) {
            res.status(StatusCodes.Unauthorized).json({ message: 'Unauthorized' });
        }
    }

    async approveHotel(req: Request, res: Response): Promise<void> {
        const { hotelId } = req.params;

        try {
            await this._adminUseCase.approveHotel(hotelId);
            res.status(StatusCodes.Success).json({ message: 'Hotel approved successfully' });
        } catch (err) {
            res.status(StatusCodes.Unauthorized).json({ message: 'Unauthorized' });
        }
    }

    async rejectHotel(req: Request, res: Response): Promise<void> {
        try {
            const { hotelId, reason } = req.body;
            await this._adminUseCase.rejectHotel(hotelId, reason);
            res.status(StatusCodes.Success).json({ message: 'Hotel rejected successfully' });
        } catch (err) {
            res.status(StatusCodes.InternalServer).json({ message: 'Error rejecting hotel', err });
        }
    }

    async getDailySales(req: Request, res: Response) {
        try {
            const data = await this._adminUseCase.executeDaily();
            res.json(data);
        } catch (error) {
            res.status(StatusCodes.Unauthorized).json({ message: 'Unauthorized' });
        }
    } 

    async getWeeklySales(req: Request, res: Response) {
        try {
            const data = await this._adminUseCase.executeWeekly();
            res.json(data);
        } catch (error) {
            res.status(StatusCodes.Unauthorized).json({ message: 'Unauthorized' });
        }
    }

    async getMonthlySales(req: Request, res: Response) {
        try {
            const data = await this._adminUseCase.executeMonthly();
            res.json(data);
        } catch (error) {
            res.status(StatusCodes.Unauthorized).json({ message: 'Unauthorized' });
        }
    }

    async getDashboardStats(req: Request, res: Response): Promise<void> {
        try {
            const stats = await this._adminUseCase.dashBoardDeatail();
            res.json(stats);
        } catch (error) {
            res.status(StatusCodes.Unauthorized).json({ message: 'Error fetching dashboard stats' });
        }
    }
}