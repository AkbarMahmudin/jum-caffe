import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class PaymentClient {
  constructor(
    private readonly config: ConfigService,
    private readonly http: HttpService,
  ) {}

  async createPayment(payload: { orderId: string; amount: number }) {
    const paymentUrl = this.config.get('PAYMENT_SERVICE_URL');
    const { data } = await firstValueFrom(this.http.post(paymentUrl, payload));

    return data?.data;
  }
}
