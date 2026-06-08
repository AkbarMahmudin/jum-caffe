import { SnapTransactionParameters } from 'midtrans-client';

export interface MidtransTransactionResponse {
  transaction_time?: string;
  transaction_status: string;
  transaction_id: string;
  status_code?: number;
  signature_key: string;
  payment_type: string;
  order_id: string;
  gross_amount: number;
  fraud_status?: string;
  expiry_time?: string;
}

export interface MidtransTransactionParameters
  extends SnapTransactionParameters {
  customer_details?: {
    first_name?: string;
    last_name?: string;
    email?: string;
  };
  item_details?: {
    id: string;
    price: number;
    quantity: number;
    name: string;
    brand?: string;
    category?: string;
    merchant_name?: string;
    tenor?: string;
    code_plan?: string;
    mid?: string;
    url?: string;
  }[];
}
