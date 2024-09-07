import { IAccommodationDocument } from "../collections/IAccommodations.collection";
import { IUserDocument } from "../collections/IUsers.collection";

interface IAdminRepo {
  getAllUsers(): Promise<IUserDocument[]>;
  toggleBlockUser(userId: string): Promise<IUserDocument>
  getAllHotels(): Promise<IAccommodationDocument[]>;
  getHotelById(hotelId: string): Promise<IAccommodationDocument | null>;
  approveHotelById(hotelId: string): Promise<void>;
  rejectHotel(hotelId: string, reason: string): Promise<void>;
  getTotalSales(): Promise<number>;
  getSalesByDay(): Promise<{ date: string, totalSales: number }[]>;
  getSalesByWeek(): Promise<{ week: string, totalSales: number }[]>;
  getSalesByMonth(): Promise<{ month: string, totalSales: number }[]>;
}

export default IAdminRepo