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


    async adminLogin(email: string, password: string, adminEmail: string, adminPassword: string): Promise<string> {
        try {
            if (email === adminEmail && password === adminPassword) {
                const payload: IPayload = {
                    id: adminEmail,
                    type: 'Admin'
                };
                return this._jwtService.sign(payload);
            } else {
                throw new Error('Invalid credentials');
            }

        } catch (err) {
            throw new Error('Invalid credentials');
        }
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


}