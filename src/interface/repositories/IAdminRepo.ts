import { IAccommodationDocument } from "../collections/IAccommodations.collection";
import { IUserDocument } from "../collections/IUsers.collection";

interface IAdminRepo{
  getAllUsers(): Promise<IUserDocument[]>;
  toggleBlockUser(userId: string): Promise<IUserDocument>
  getAllHotels(): Promise<IAccommodationDocument[]>;
  getHotelById(hotelId: string): Promise<IAccommodationDocument | null>; 
  approveHotelById(hotelId: string): Promise<void>;
  rejectHotel(hotelId: string, reason: string): Promise<void>;
}

export default IAdminRepo