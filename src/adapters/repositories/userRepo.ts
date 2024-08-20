import { IAccommodationCollection, IAccommodationDocument } from "../../interface/collections/IAccommodations.collection";
import { IAccommodationWithBookingDetails, IBookingCollection, IBookingDocument } from "../../interface/collections/IBooking.collection";
import { IConversationCollection } from "../../interface/collections/IConversation.collections";
import { IMessageCollection, IMessageDocument } from "../../interface/collections/IMessage.collections";
import { IOtpCollection, IOtpDocument } from "../../interface/collections/IOtp.collections";
import { IUserDocument, IUsersCollection } from "../../interface/collections/IUsers.collection";
import { IRegisterCredentials } from "../../interface/controllers/IUserController";
import IUserRepo from "../../interface/repositories/IUserRepo";

export default class UserRepo implements IUserRepo {
    private userCollection: IUsersCollection
    private otpCollection: IOtpCollection
    private _accommodationCollection: IAccommodationCollection
    private _bookingCollection: IBookingCollection
    private _conversationCollection: IConversationCollection
    private _messageCollection: IMessageCollection

    constructor(userCollection: IUsersCollection, otpCollection: IOtpCollection, accommodationColletion: IAccommodationCollection, bookingCollection: IBookingCollection, conversationCollection: IConversationCollection, messageCollection: IMessageCollection) {
        this.userCollection = userCollection
        this.otpCollection = otpCollection
        this._accommodationCollection = accommodationColletion
        this._bookingCollection = bookingCollection
        this._conversationCollection = conversationCollection
        this._messageCollection = messageCollection
    }

    async getDataByEmail(email: string): Promise<IUserDocument | null> {
        try {
            const userData: IUserDocument | null = await this.userCollection.findOne({ email });
            return userData;
        } catch (err: any) {
            throw err;
        }
    }

    async createUser(registerData: IRegisterCredentials): Promise<void> {
        try {
            const newUser = new this.userCollection({
                fullName: registerData.fullName,
                email: registerData.email,
                password: registerData.password
            });
            await newUser.save();
        } catch (err: any) {
            throw err;
        }
    }

    async createOtp(email: string, otp: string): Promise<void | never> {
        try {
            await this.deleteOtpByEmail(email); // delete previous otp if exisits

            const newOtp: IOtpDocument = new this.otpCollection({
                email: email,
                otp: otp,
                expiresAt: new Date(Date.now() + 300000)
            });

            await newOtp.save();
        } catch (err: any) {
            throw err;
        }
    }

    async getOtpByEmail(email: string | undefined): Promise<IOtpDocument | null | never> {
        try {
            return await this.otpCollection.findOne({ email, expiresAt: { $gte: new Date() } }).sort({ expiresAt: -1 });
        } catch (err: any) {
            throw err;
        }
    }

    async makeUserVerified(email: string): Promise<void | never> {
        try {
            await this.deleteOtpByEmail(email); // delete the otp document of this email.
            await this.userCollection.updateOne({ email }, { $set: { otp_verification: true } });
        } catch (err: any) {
            throw err;
        }
    }

    private async deleteOtpByEmail(email: string): Promise<void | never> {
        try {
            await this.otpCollection.deleteMany({ email });
        } catch (err: any) {
            throw err;
        }
    }

    async getUserInfo(userId: string): Promise<IUserDocument | null> {
        return await this.userCollection.findById(userId)
    }

    async saveGoogleAuth(name: string, email: string): Promise<void> {
        try {
            const user = new this.userCollection({
                fullName: name,
                email: email,
                otp_verification: true
            })
            await user.save()
        } catch (err) {
            console.log(err, 'err in user repo google');
            throw err
        }
    }

    async resetPassword(email: string | undefined, newPassword: string): Promise<IUserDocument | null> {
        try {
            const updatedUser = await this.userCollection.findOneAndUpdate(
                { email },
                { $set: { password: newPassword } },
                { new: true, runValidators: true }
            );
            console.log('Password updated successfully');
            return updatedUser;
        } catch (error) {
            console.error('Error updating password in database:', error);
            throw error;
        }
    }


    async updateProfile(userId: string, updateData: Partial<IUserDocument>): Promise<IUserDocument | null> {
        console.log('update data in repo', updateData, 'and id is', userId);
        try {
            const updatedUser = await this.userCollection.findByIdAndUpdate(
                userId,
                { $set: updateData },
                { new: true, runValidators: true }
            );
            console.log('Updated user:', updatedUser);
            return updatedUser;
        } catch (error) {
            console.error('Error updating user in database:', error);
            throw error;
        }
    }

    async updatePassword(userId: string, newPassword: string): Promise<IUserDocument | null> {
        try {
            const updatedUser = await this.userCollection.findByIdAndUpdate(
                userId,
                { $set: { password: newPassword } },
                { new: true, runValidators: true }
            );
            console.log('Password updated successfully');
            return updatedUser;
        } catch (error) {
            console.error('Error updating password in database:', error);
            throw error;
        }
    }

    async updateIdentity(userId: string, images: string[]): Promise<IUserDocument | null> {
        try {

            const updatedUser = await this.userCollection.findByIdAndUpdate(
                userId,
                { $set: { id_proof: images } },
                { new: true, runValidators: true }
            )
            console.log('Identity updated successfully');
            return updatedUser;
        } catch (error) {
            console.error('Error updating identity in database:', error);
            throw error;
        }
    }

    async updateBankAccount(userId: string, bankDetails: { accountNumber: string, ifscCode: string }): Promise<IUserDocument | null> {
        try {
            const updatedUser = await this.userCollection.findByIdAndUpdate(
                userId,
                {
                    $set: {
                        bank_account_number: bankDetails.accountNumber,
                        ifsc_code: bankDetails.ifscCode
                    }
                },
                { new: true, runValidators: true }
            );
            return updatedUser;
        } catch (error) {
            console.error('Error updating bank account in database:', error);
            throw error;
        }
    }

    async addHotel(hotelData: IAccommodationDocument): Promise<void | never> {
        try {
            const newHotel = new this._accommodationCollection(hotelData);
            await newHotel.save();
            return
        } catch (err) {
            console.error('Error adding hotel to database:', err);
            throw err;
        }
    }

    async getAccommodationsByUserId(userId: string): Promise<IAccommodationDocument[]> {
        try {
            return await this._accommodationCollection.find({ added_by: userId });
        } catch (err) {
            console.error('Error getting hotel in database:', err);
            throw err;
        }
    }

    async getHotelbyId(hotelId: string): Promise<IAccommodationDocument | null> {
        try {
            return await this._accommodationCollection.findById(hotelId);
        } catch (err) {
            console.error('Error fetching hotel from database:', err);
            throw err;
        }
    }

    async updateHotel(hotelData: IAccommodationDocument): Promise<void | never> {
        try {
            console.log('hotel data in repo', hotelData);
            const { _id, ...updateData } = hotelData
            const updatedHotel = await this._accommodationCollection.findByIdAndUpdate(
                _id,
                { $set: updateData },
                { new: true, runValidators: true }
            );

            // await this._accommodationCollection.findByIdAndUpdate( _id, updateData, { new: true });
        } catch (err) {
            console.error('Error updating hotel in database:', err);
            throw err;
        }
    }

    async getAllHotels(searchQuery?: string, checkInDate?: Date, checkOutDate?: Date, guests?: number): Promise<IAccommodationDocument[]> {
        try {
            let query: any = {};

            if (searchQuery) {
                query.$or = [
                    { town: { $regex: searchQuery, $options: 'i' } },
                    { district: { $regex: searchQuery, $options: 'i' } },
                    { state: { $regex: searchQuery, $options: 'i' } }
                ];
            }

            if (guests) {
                query.maxGuests = { $gte: guests };
            }

            const bookedAccommodations = await this._bookingCollection.find({
                $or: [
                    { checkInDate: { $lt: checkOutDate, $gte: checkInDate } },
                    { checkOutDate: { $gt: checkInDate, $lte: checkOutDate } },
                    { checkInDate: { $lte: checkInDate }, checkOutDate: { $gte: checkOutDate } }
                ]
            }).distinct('accommodation');

            if (bookedAccommodations.length > 0) {
                query._id = { $nin: bookedAccommodations };
            }

            return await this._accommodationCollection.find(query);
        } catch (err) {
            console.error('Error getting hotels in database:', err);
            throw err;
        }
    }

    async checkAvailability(accommodationId: string, checkInDate: Date, checkOutDate: Date): Promise<boolean> {
        try {
            console.log("accomodationId  : ", accommodationId);
            console.log("checkInDate  : ", checkInDate);
            console.log("checkOutDate : ", checkOutDate);

            const bookings = await this._bookingCollection.find({
                accommodation: accommodationId,
                $or: [
                    { checkInDate: { $lte: checkOutDate, $gte: checkInDate } },
                    { checkOutDate: { $gte: checkInDate, $lte: checkOutDate } },
                    { checkInDate: { $lte: checkInDate }, checkOutDate: { $gte: checkOutDate } }
                ]
            });
            console.log("bookings : ", bookings);

            return bookings.length === 0;
        } catch (err) {
            console.error('Error checking availability in database:', err);
            throw err;
        }
    }

    async createBooking(accommodationId: string, userId: string, checkIn: Date, checkOut: Date, guests: number, totalPrice: number): Promise<IBookingDocument> {
        try {
            const newBooking = new this._bookingCollection({
                accommodation: accommodationId,
                user: userId,
                checkInDate: checkIn,
                checkOutDate: checkOut,
                guests,
                totalPrice,
                status: 'Booked',
            });

            return await newBooking.save();
        } catch (err) {
            throw err;
        }
    }

    async getBookedHotels(userId: string): Promise<IAccommodationWithBookingDetails[]> {
        try {
            const bookings = await this._bookingCollection.find({ user: userId })
                .populate<{ accommodation: IAccommodationDocument }>('accommodation')
                .exec();
            const accommodationsWithBookingDetails = bookings.map(booking => ({
                accommodation: booking.accommodation as IAccommodationDocument,
                guests: booking.guests,
                totalPrice: booking.totalPrice,
                status: booking.status,
                checkInDate: booking.checkInDate,
                checkOutDate: booking.checkOutDate,
            }));

            return accommodationsWithBookingDetails;
        } catch (err) {
            console.error('Error getting hotel in database:', err);
            throw err;
        }
    }

    async getSchedule(hotelId: string): Promise<IBookingDocument[]> {
        try {
            const bookings = await this._bookingCollection.find({ accommodation: hotelId }).populate('user', 'fullName');
            return bookings;
        } catch (err) {
            console.error('Error getting guest in database:', err);
            throw err;
        }
    }

    async getMessages(senderId: string, receiverId: string): Promise<IMessageDocument[]> {
        try {

            const conversation = await this._conversationCollection
                .findOne({
                    participants: { $all: [senderId, receiverId] }
                })
                .populate<{ messages: IMessageDocument[] }>({
                    path: 'messages',
                    model: this._messageCollection
                })
                .exec();

            if (!conversation) {
                return [];
            }

            const unreadEntry = conversation.unreadMessages.find(entry => entry.userId.toString() === senderId);
        if (unreadEntry) {
            unreadEntry.count = 0; // Reset unread count for the sender
            await conversation.save();
        }

             return conversation.messages.length > 0 && 'message' in conversation.messages[0]
            ? conversation.messages as IMessageDocument[]
            : [];
        } catch (err) {
            console.error('Error getting chat details', err);
            throw err;
        }
    }

    async sendMessage(senderId: string, receiverId: string, message: string): Promise<IMessageDocument> {
        try {
            let conversation = await this._conversationCollection.findOne({
                participants: { $all: [senderId, receiverId] }
            })

            if (!conversation) {
                conversation = await this._conversationCollection.create({
                    participants: [senderId, receiverId],
                    messages: [],
                    unreadMessages: []
                });
            }

            const newMessage = await this._messageCollection.create({
                senderId,
                receiverId,
                message
            });

            conversation.messages.push(newMessage.id);

            // Update unread message count for the receiver
            const unreadEntry = conversation.unreadMessages.find(entry => entry.userId.toString() === receiverId);
            if (unreadEntry) {
                unreadEntry.count += 1;
            } else {
                conversation.unreadMessages.push({ userId: receiverId, count: 1 });
            }

            await conversation.save();

            return newMessage;
        } catch (err) {
            console.error('Error getting chat details', err);
            throw err;
        }
    }

    async getMessagedUsers(hostId: string): Promise<IUserDocument[] | null> {
        try {
            // Find all conversations where the host is a participant
            const conversations = await this._conversationCollection.find({
                participants: hostId
            }).populate('participants', '_id fullName email')
            

            // Extract unique users who are not the host
            const uniqueUsers = new Map();
            conversations.forEach(convo => {
                convo.participants.forEach((participant: any) => {
                    if (participant._id.toString() !== hostId) {
                        const unreadEntry = convo.unreadMessages.find(entry => entry.userId.toString() === hostId.toString());
                        const unreadCount = unreadEntry ? unreadEntry.count : 0;

                        uniqueUsers.set(participant._id.toString(), {
                            userId: participant._id,
                            fullName: participant.fullName,
                            email: participant.email,
                            unreadMessagesCount: unreadCount
                        });
                    }
                });
            });

            // // Convert the Map values to an array
            return Array.from(uniqueUsers.values());
        } catch (err) {
            console.error('Error getting messaged users', err);
            throw err;
        }
    }
}