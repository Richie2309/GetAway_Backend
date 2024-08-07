import Stripe from 'stripe';

export interface IStripeService {
  createPaymentIntentService(amount: number): Promise<Stripe.PaymentIntent>;
}