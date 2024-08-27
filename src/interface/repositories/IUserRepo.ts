import { IAccommodationDocument } from "../collections/IAccommodations.collection";
import { IAccommodationWithBookingDetails, IBookingDocument } from "../collections/IBooking.collection";
import { IConversationDocument } from "../collections/IConversation.collections";
import { IMessageDocument } from "../collections/IMessage.collections";
import { IOtpDocument } from "../collections/IOtp.collections";
import { IUserDocument } from "../collections/IUsers.collection"
import { IRegisterCredentials } from "../controllers/IUserController"

interface IUserRepo {
     getDataByEmail(email: string): Promise<IUserDocument | null | never>
     createUser(registerData: IRegisterCredentials): Promise<void>
     createOtp(email: string, otp: string): Promise<void>;
     getOtpByEmail(email: string | undefined): Promise<IOtpDocument | null | never>;
     makeUserVerified(email: string): Promise<void | never>;
     getUserInfo(userId: string): Promise<IUserDocument | null>
     saveGoogleAuth(name: string, email: string): Promise<void>
     resetPassword(email: string | undefined, newPassword: string): Promise<IUserDocument | null>;
     updateProfile(userId: string, updateData: any): Promise<IUserDocument | null>;
     updatePassword(userId: string, newPassword: string): Promise<IUserDocument | null>;
     updateIdentity(userId: string, images: string[]): Promise<IUserDocument | null>;
     updateBankAccount(userId: string, bankDetails: { accountNumber: string; ifscCode: string }): Promise<IUserDocument | null>;
     addHotel(hotelData: IAccommodationDocument): Promise<void | never>;
     getHotelbyId(hotelId: string): Promise<IAccommodationDocument | null>
     updateHotel(hotelData: IAccommodationDocument): Promise<void | never>;
     getAccommodationsByUserId(userId: string): Promise<IAccommodationDocument[]>;
     getAllHotels(searchQuery?: string, checkInDate?: Date, checkOutDate?: Date, guests?: number): Promise<IAccommodationDocument[]>;
     checkAvailability(accommodationId: string, checkInDate: Date, checkOutDate: Date): Promise<boolean>;
     createBooking(accommodationId: string, userId: string, checkIn: Date, checkOut: Date, guests: number, totalPrice: number,  paymentIntentId: string): Promise<IBookingDocument>
     getBookedHotels(userId: string): Promise<IAccommodationWithBookingDetails[]>;
     cancelBooking(bookingId: string): Promise<IBookingDocument>;
     getSchedule(hotelId: string): Promise<IBookingDocument[]>;
     getMessages(senderId: string, receiverId: string): Promise<IMessageDocument[]>
     sendMessage(senderId: string, receiverId: string, message: string): Promise<IMessageDocument>
     getMessagedUsers(hostId: string): Promise<IUserDocument[] | null>
}

export default IUserRepo