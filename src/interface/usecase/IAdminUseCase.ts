import { IAccommodationDocument } from "../collections/IAccommodations.collection"
import { IUserDocument } from "../collections/IUsers.collection"

interface IAdminUseCase{
    adminLogin(email:string,password:string,adminEmail:string,adminPassword:string):Promise<string>
    getUsers():Promise<IUserDocument[]>
    toggleBlockUser(userId: string): Promise<IUserDocument>
    getHotels():Promise<IAccommodationDocument[]>
    getHotelById(hotelId: string): Promise<IAccommodationDocument | null>;
    approveHotel(hotelId: string): Promise<void>
    rejectHotel(hotelId: string, reason: string): Promise<void>;
    executeDaily(): Promise<{ date: string, totalSales: number }[]>;
    executeWeekly(): Promise<{ week: string, totalSales: number }[]>;
    executeMonthly(): Promise<{ month: string, totalSales: number }[]>;
}

export default IAdminUseCase