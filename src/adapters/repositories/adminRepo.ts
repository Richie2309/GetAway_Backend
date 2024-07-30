import { IAccommodationCollection, IAccommodationDocument } from "../../interface/collections/IAccommodations.collection";
import { IUserDocument, IUsersCollection } from "../../interface/collections/IUsers.collection";
import IAdminRepo from "../../interface/repositories/IAdminRepo";

export default class AdminRepo implements IAdminRepo {
  private _userCollection: IUsersCollection;
  private _accommodationCollection: IAccommodationCollection;

  constructor(userCollection: IUsersCollection, accommodationCollection: IAccommodationCollection) {
    this._userCollection = userCollection;
    this._accommodationCollection = accommodationCollection;
  }

  async getAllUsers(): Promise<IUserDocument[]> {
    try {
      return await this._userCollection.find();
    } catch (err) {
      throw err;
    }
  }

  async toggleBlockUser(userId: string): Promise<IUserDocument> {
    try {
      const user = await this._userCollection.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }
      user.is_blocked = !user.is_blocked;
      await user.save();
      return user;
    } catch (err) {
      throw err;
    }
  }

  async getAllHotels(): Promise<IAccommodationDocument[]> {
    try {
      return await this._accommodationCollection.find();
    } catch (err) {
      throw err;
    }
  }

  async getHotelById(hotelId: string): Promise<IAccommodationDocument | null> {
    return this._accommodationCollection.findById(hotelId)
      .populate('added_by', 'fullName email phone id_proof ifsc_code bank_account_number') // Populate user details
      .exec();
  }

  async approveHotelById(hotelId: string): Promise<void> {
    await this._accommodationCollection.findByIdAndUpdate(hotelId, { $set: { isverified: true } });
  }

  async rejectHotel(hotelId: string, reason: string): Promise<void> {
    await this._accommodationCollection.findByIdAndUpdate(hotelId, {
      isverified: false,
      rejectionReason: reason
    });
  }
}
