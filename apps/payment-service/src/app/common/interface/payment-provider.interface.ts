export interface PaymentProviderResponse {
  id?: string;
  token?: string;
  redirectUrl: string;
}

export interface PaymentProviderInterface {
  createTransaction(
    orderId: string,
    amount: number,
  ): PaymentProviderResponse | Promise<PaymentProviderResponse>;
  verifyWebhook(payload: any): boolean | Promise<boolean>;
  generateOrderId?(orderId: string, attempt: number): string;
}
