import { ILocalStorage } from '@jum-caffe/common';
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

    const { data } = await firstValueFrom(
      this.http.post(paymentUrl, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    );

    return data?.data;
  }
}
