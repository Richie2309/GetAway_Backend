import Stripe from 'stripe';
import { IStripeService } from '../../interface/utils/IStripeService';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export class StripeService implements IStripeService {
  async createPaymentIntentService(amount: number): Promise<Stripe.PaymentIntent> {
    try {
      return await stripe.paymentIntents.create({
        amount: Math.round(amount * 100),
        currency: 'inr',
      });
    } catch (err) {
      throw err;
    }
  }

  async createRefund(paymentIntentId: string, amount: number): Promise<Stripe.Refund> {
    if (!paymentIntentId || !amount || amount <= 0) {
      throw new Error('Invalid payment intent ID or refund amount');
    }
    try {
      await stripe.paymentIntents.retrieve(paymentIntentId);
      const refund = await stripe.refunds.create({
        payment_intent: paymentIntentId,
        amount: Math.round(amount * 100),
      });
      return refund;
    } catch (err) {
      console.log('Error in createRefund:', err);
      throw err;
    }
  }
}