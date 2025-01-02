import {
  Body,
  Controller,
  Headers,
  HttpCode,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';
import { StripeService } from './stripe.service';

@Controller('stripe')
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  @Post('create-payment-intent')
  async createPaymentIntent(
    @Body() body: { amount: number; currency: string; description: string },
  ) {
    const { amount, currency, description } = body;
    return this.stripeService.createPaymentIntent(
      amount,
      currency,
      description,
    );
  }

  @Post('webhook')
  @HttpCode(200)
  async handleWebhook(
    @Req() request: FastifyRequest,
    @Headers('stripe-signature') signature: string,
    @Res() response: FastifyReply,
  ) {
    const payload = request.rawBody as Buffer;

    try {
      const event = await this.stripeService.handleWebhook(payload, signature);

      switch (event.type) {
        case 'payment_intent.succeeded':
          const paymentIntent = event.data.object;
          console.log('PaymentIntent was successful!', paymentIntent);
          break;
        case 'payment_intent.payment_failed':
          console.log('PaymentIntent failed', event.data.object);
          break;
        default:
          console.log(`Unhandled event type ${event.type}`);
      }

      response.send();
    } catch (error: any) {
      response.status(400).send(`Webhook Error: ${error.message}`);
    }
  }
}
