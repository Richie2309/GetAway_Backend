import { IAccommodationCollection, IAccommodationDocument } from "../../interface/collections/IAccommodations.collection";
import { IBookingCollection } from "../../interface/collections/IBooking.collection";
import { IUserDocument, IUsersCollection } from "../../interface/collections/IUsers.collection";
import IAdminRepo from "../../interface/repositories/IAdminRepo";

export default class AdminRepo implements IAdminRepo {
  private _userCollection: IUsersCollection;
  private _accommodationCollection: IAccommodationCollection;
  private _bookingCollection: IBookingCollection

  constructor(userCollection: IUsersCollection, accommodationCollection: IAccommodationCollection, bookingCollection: IBookingCollection) {
    this._userCollection = userCollection;
    this._accommodationCollection = accommodationCollection;
    this._bookingCollection = bookingCollection
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

  async getTotalSales(): Promise<number> {
    const result = await this._bookingCollection.aggregate([
      { $match: { status: 'Completed' } },
      { $group: { _id: null, totalSales: { $sum: "$totalPrice" } } }
    ]);
    return result[0]?.totalSales || 0;
  }

  async getSalesByDay(): Promise<{ date: string, totalSales: number }[]> {
    const result = await this._bookingCollection.aggregate([
      { $match: { 
        status: 'Completed',
        bookedAt: { 
          $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          $lt: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1)
        }
      }},
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$bookedAt" } },
          totalSales: { $sum: "$totalPrice" }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    return result.map(item => ({
      date: item._id,
      totalSales: item.totalSales
    }));
  }

  async getSalesByWeek(): Promise<{ week: string, totalSales: number }[]> {
    const result = await this._bookingCollection.aggregate([
      { $match: { status: 'Completed' } },
      {
        $group: {
          _id: { $isoWeek: "$bookedAt" },
          totalSales: { $sum: "$totalPrice" }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    return result.map(item => ({
      week: `W${item._id}`,
      totalSales: item.totalSales
    }));
  }

  async getSalesByMonth(): Promise<{ month: string, totalSales: number }[]> {
    const result = await this._bookingCollection.aggregate([
      { $match: { status: 'Completed' } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m", date: "$bookedAt" } },
          totalSales: { $sum: "$totalPrice" }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    return result.map(item => ({
      month: item._id,
      totalSales: item.totalSales
    }));
  }
}
