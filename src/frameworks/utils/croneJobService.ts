import cron from 'node-cron';
import { IBookingCollection } from '../../interface/collections/IBooking.collection';
import ICronJob from '../../interface/utils/ICronJobService';

export default class cronJobService implements ICronJob {
  _bookingCollection: IBookingCollection;
  schedule: string;
  task: () => void;

  constructor(bookingCollection: IBookingCollection, schedule: string, task: () => void) {
    this._bookingCollection = bookingCollection
    this.schedule = schedule;
    this.task = task;
  }
 
    async updateBookingStatus(): Promise<void> {
    try {
      const now = new Date();
      await this._bookingCollection.updateMany(
        {
          checkOutDate: { $lt: now },
          status: 'Booked'
        },
        { $set: { status: 'Completed' } }
      );
    } catch (err) {
      console.error('Error updating booking status:', err);
    }
  }
  
  start(): void {
    cron.schedule('0 0 * * *', async () => {
      await this.updateBookingStatus();
    });
  }
}
