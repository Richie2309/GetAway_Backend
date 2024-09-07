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

            const token = await this._adminUseCase.adminLogin(email, password, adminEmail, adminPassword)
            res.cookie('adminToken', token, { httpOnly: true });
            res.status(StatusCodes.Success).json({ message: 'Login successful' });
        } catch (err) {
            res.status(StatusCodes.Unauthorized).json({ message: 'Invalid credentials' });
        }
    }

    async getUsers(req: Request, res: Response): Promise<void> {
        try {
            const users = await this._adminUseCase.getUsers();
            console.log('users in controller.', users);

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
        console.log('jjj');

        try {
            const hotelId = req.params.hotelId;
            const hotel = await this._adminUseCase.getHotelById(hotelId);
            console.log('hotel in controler', hotel);

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
}