import { IUserDocument } from "../collections/IUsers.collection";
import { googleAuthBody, IRegisterCredentials } from "../controllers/IUserController";
import { IAccommodationDocument } from "../collections/IAccommodations.collection";
import { IBookingDocument, IPaymentIntent } from "../collections/IBooking.collection";
import Stripe from "stripe";

interface IUserUseCase {
    authenticateUser(email: string, password: string): Promise<loginRes | never>;
    registerUser(registerData: IRegisterCredentials): Promise<void>
    verifyOtp(email: string | undefined, otp: string): Promise<string | never>;
    resendOtp(email: string | undefined): Promise<void | never>;
    verifyToken(token: string | undefined): Promise<void | never>;
    getUserInfo(userId: string): Promise<IUserDocument | null>
    googleAuthUser(name: string, email: string): Promise<string | null>
    checkMail(email: string): Promise<boolean>;
    verifyForgotPasswordOtp(email: string, otp: string): Promise<boolean>
    resetPassword(email: string | undefined, newPassword: string): Promise<IUserDocument | null>;
    updateProfile(userId: string | undefined, updateData: any): Promise<IUserDocument | null>;
    updatePassword(userId: string | undefined, newPassword: string): Promise<IUserDocument | null>;
    updateIdentity(userId: string | undefined, images: string[]): Promise<IUserDocument | null>;
    updateBankAccount(userId: string | undefined, bankDetails: { accountNumber: string; ifscCode: string }): Promise<IUserDocument | null>;
    addHotel(hotelData: IAccommodationDocument): Promise<void | never>;
    getAccommodationsByUserId(userId: string): Promise<IAccommodationDocument[]>;
    getHotelById(hotelId: string): Promise<IAccommodationDocument | null>;
    updateHotel(hotelData: IAccommodationDocument): Promise<void | never>;
    getAllHotels(searchQuery?: string, checkInDate?: Date, checkOutDate?: Date, guests?: number): Promise<IAccommodationDocument[]>;
    checkAvailability(accommodationId: string, checkInDate: Date, checkOutDate: Date): Promise<boolean>;
    createBooking(accommodationId: string, userId: string, checkIn: Date, checkOut: Date, guests: number, totalPrice: number): Promise<IBookingDocument>;
    createPaymentIntent(amount: number): Promise<Stripe.PaymentIntent>;
}

export default IUserUseCase

export interface loginRes {
    token: string,
    userData: IUserDocument
}