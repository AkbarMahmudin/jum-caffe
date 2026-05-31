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
