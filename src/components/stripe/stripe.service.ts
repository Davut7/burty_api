import { BadRequestException, Injectable } from '@nestjs/common';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2024-12-18.acacia',
    });
  }

  async createPaymentIntent(
    amount: number,
    currency: string,
    description: string,
  ) {
    try {
      return await this.stripe.paymentIntents.create({
        amount,
        currency,
        payment_method_types: ['card'],
        description,
      });
    } catch (error: any) {
      throw new BadRequestException(`Stripe error: ${error.message}`);
    }
  }

  async handleWebhook(payload: Buffer, sig: string) {
    try {
      return this.stripe.webhooks.constructEvent(
        payload,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET,
      );
    } catch (error: any) {
      throw new BadRequestException(`Webhook Error: ${error.message}`);
    }
  }
}
