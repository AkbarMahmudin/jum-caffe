import { generateSignatureService, ILocalStorage } from '@jum-caffe/common';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClsService } from 'nestjs-cls';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class PaymentClient {
  constructor(
    private readonly config: ConfigService,
    private readonly http: HttpService,
    private readonly cls: ClsService<ILocalStorage>,
  ) {}

  async createPayment(payload: { orderId: string; amount: number }) {
    const paymentUrl = this.config.get('PAYMENT_SERVICE_URL');
    const token = this.cls.get('token');
    const timestamp = Date.now().toString();

    const signature = generateSignatureService(
      'POST',
      '/api/payments',
      timestamp,
      payload,
      this.config.getOrThrow('PAYMENT_SERVICE_SECRET'),
    );

    const { data } = await firstValueFrom(
      this.http.post(paymentUrl, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          'X-Service-Id': this.config.get('SERVICE_ID'),
          'X-Timestamp': timestamp,
          'X-Signature': signature,
        },
      }),
    );

    return data?.data;
  }
}
