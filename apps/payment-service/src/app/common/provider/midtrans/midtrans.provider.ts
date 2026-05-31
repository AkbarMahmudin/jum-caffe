import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as midtransClient from 'midtrans-client';
import { PaymentProviderInterface } from '../../interface/payment-provider.interface';
import { createHash } from 'crypto';

@Injectable()
export class MidtransProvider implements PaymentProviderInterface {
  private readonly snap: midtransClient.Snap = new midtransClient.Snap({
    isProduction:
      this.config.getOrThrow<string>('MIDTRANS_IS_PRODUCTION') === 'true',
    serverKey: this.config.getOrThrow<string>('MIDTRANS_SERVER_KEY'),
    clientKey: this.config.getOrThrow<string>('MIDTRANS_CLIENT_KEY'),
  });

  constructor(private readonly config: ConfigService) {}

  async createTransaction(orderId: string, amount: number) {
    const parameter: midtransClient.SnapTransactionParameters = {
      transaction_details: {
        order_id: orderId,
        gross_amount: amount,
      },
      // Optional: Add customer_details, item_details, etc.
    };

    const { token, redirect_url: redirectUrl } =
      await this.snap.createTransaction(parameter);

    return {
      token,
      redirectUrl,
    };
  }

  verifyWebhook(payload: any) {
    const signatureKey = payload.signature_key;

    const rawSignature =
      payload.order_id +
      payload.status_code +
      payload.gross_amount +
      this.config.getOrThrow('MIDTRANS_SERVER_KEY');

    const expectedSignature = createHash('sha512')
      .update(rawSignature)
      .digest('hex');

    return signatureKey === expectedSignature;
  }

  generateOrderId(orderId: string, attempt: number): string {
    const shortId = orderId.replace(/-/g, '').substring(0, 8).toUpperCase();

    return `COF-${shortId}-P${attempt}`;
  }
}
