import Stripe from 'stripe';
import { IStripeService } from '../../interface/utils/IStripeService';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export class StripeService implements IStripeService {
  async createPaymentIntentService(amount: number): Promise<Stripe.PaymentIntent> {
    console.log('amount in stripser',amount);
    
    try {
      return await stripe.paymentIntents.create({
        amount: Math.round(amount * 100),
        currency: 'inr',
      });
    } catch (err) {
      throw err;
    }
  }
}