import { IAccommodationDocument } from "../interface/collections/IAccommodations.collection";
import { IUserDocument, IUsersCollection } from "../interface/collections/IUsers.collection";
import IAdminRepo from "../interface/repositories/IAdminRepo";
import IAdminUseCase from "../interface/usecase/IAdminUseCase";
import IJwtService, { IPayload } from "../interface/utils/IJwtServices";

export default class AdminUseCase implements IAdminUseCase {
    private _adminRepo: IAdminRepo;
    private _jwtService: IJwtService;

    constructor(adminRepo: IAdminRepo, jwtService: IJwtService) {
        this._adminRepo = adminRepo;
        this._jwtService = jwtService;
    }


    async adminLogin(email: string, password: string, adminEmail: string, adminPassword: string): Promise<{ accessToken: string, refreshToken: string }> {

        try {
            if (email === adminEmail && password === adminPassword) {
                const payload: IPayload = { id: adminEmail, type: 'Admin' };
                const accessToken = this._jwtService.sign(payload);
                const refreshToken = this._jwtService.generateRefreshToken(payload);
                return { accessToken, refreshToken };
            } else {
                throw new Error('Invalid credentials');
            }

        } catch (err) {
            throw new Error('Invalid credentials');
        }
    }

    async checkAuth(token: string): Promise<boolean> {
        const decoded = this._jwtService.verifyToken(token)
        if (decoded.type !== 'Admin') {
            return false
        }
        return true
        // try {
        //     const decodedToken = this._jwtService.verifyToken(token);
        //     return decodedToken?.type === 'Admin'; 
        // } catch (error) {
        //     return false;
        // }
    }

    async getUsers(): Promise<IUserDocument[]> {
        try {
            return await this._adminRepo.getAllUsers();
        } catch (err) {
            throw err;
        }
    }

    async toggleBlockUser(userId: string): Promise<IUserDocument> {
        try {
            return await this._adminRepo.toggleBlockUser(userId);
        } catch (err) {
            throw err;
        }
    }

    async getHotels(): Promise<IAccommodationDocument[]> {
        try {
            return await this._adminRepo.getAllHotels();
        } catch (err) {
            throw err;
        }
    }
    async getHotelById(hotelId: string): Promise<IAccommodationDocument | null> {
        try {
            return await this._adminRepo.getHotelById(hotelId);
        } catch (err) {
            throw err;
        }
    }

    async getHotelDetailsById(hotelId: string): Promise<IAccommodationDocument | null> {
        try {
            const accommodation = await this._adminRepo.getHotelDetailsById(hotelId);
            if (!accommodation) {
                throw new Error('Accommodation not found');
            }
            return accommodation;
        } catch (err) {
            throw err
        }
    }

    async approveHotel(hotelId: string): Promise<void> {
        try {
            await this._adminRepo.approveHotelById(hotelId);
        } catch (err) {
            throw err
        }
    }

    async rejectHotel(hotelId: string, reason: string): Promise<void> {
        await this._adminRepo.rejectHotel(hotelId, reason);
    }

    async executeDaily(): Promise<{ date: string; totalSales: number; }[]> {
        try {
            return await this._adminRepo.getSalesByDay()
        } catch (err) {
            throw err
        }
    }

    async executeWeekly(): Promise<{ week: string; totalSales: number; }[]> {
        try {
            return await this._adminRepo.getSalesByWeek();
        } catch (err) {
            throw err
        }
    }

    async executeMonthly(): Promise<{ month: string; totalSales: number; }[]> {
        try {
            return await this._adminRepo.getSalesByMonth()
        } catch (err) {
            throw err
        }
    }

    async dashBoardDeatail(): Promise<{ totalUsers: number; totalAccommodations: number; totalProfit: number; }> {
        try {
            const totalUsers = await this._adminRepo.getTotalUsers();
            const totalAccommodations = await this._adminRepo.getTotalAccommodations();
            const totalProfit = await this._adminRepo.getTotalProfit();
            return { totalUsers, totalAccommodations, totalProfit };
        } catch (err) {
            throw err
        }
    }

}