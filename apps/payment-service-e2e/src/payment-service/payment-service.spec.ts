import axios from 'axios';
import { createHash, randomUUID } from 'crypto';

describe('PaymentService API E2E Tests', () => {
  const baseURL = '/api/payments';
  const invalidUuid = 'invalid-uuid-format';
  const amount = 10000;

  let paymentId: string;
  let providerOrderId: string;

  // Request body statis (editable) sesuai instruksi
  const staticOrderId = randomUUID();
  const webhookPayload = {
    transaction_time: '2020-01-09 18:27:19',
    transaction_status: 'capture',
    transaction_id: '57d5293c-e65f-4a29-95e4-5959c3fa335b',
    status_message: 'midtrans payment notification',
    status_code: '200',
    signature_key:
      '16d6f84b2fb0468e2a9cf99a8ac4e5d803d42180347aaa70cb2a7abb13b5c6130458ca9c71956a962c0827637cd3bc7d40b21a8ae9fab12c7c3efe351b18d00a',
    payment_type: 'credit_card',
    order_id: 'Postman-1578568851',
    merchant_id: 'G141532850',
    masked_card: '48111111-1114',
    gross_amount: amount.toString(),
    fraud_status: 'accept',
    eci: '05',
    currency: 'IDR',
    channel_response_message: 'Approved',
    channel_response_code: '00',
    card_type: 'credit',
    bank: 'bni',
    approval_code: '1578569243927',
  };

  describe('PaymentController', () => {
    describe('POST /', () => {
      it('should fail to create a payment with invalid data (negative)', async () => {
        try {
          await axios.post(baseURL, {}); // Payload kosong memicu error validasi
        } catch (error: any) {
          expect(error.response.status).toBe(400);
        }
      });

      it('should create a payment successfully (positive)', async () => {
        const payload = {
          orderId: staticOrderId,
          amount,
        };
        const res = await axios.post(baseURL, payload);

        expect(res.status).toBe(201);

        // Simpan id order dari respons untuk test selanjutnya
        // Asumsi respons mengembalikan { data: { id } } atau { id }
        paymentId = res.data?.data?.id || res.data?.id;
        providerOrderId = res.data?.data?.orderId || res.data?.orderId;
      });
    });

    describe('GET /', () => {
      it('should fail to get all payments with invalid query params (negative)', async () => {
        try {
          await axios.get(`${baseURL}?invalidParam=true`);
        } catch (error: any) {
          expect(error.response.status).toBe(400);
        }
      });

      it('should get all payments (positive)', async () => {
        const res = await axios.get(baseURL);

        expect(res.status).toBe(200);
        expect(res.data).toBeDefined(); // Khusus metode GET melakukan expect terhadap data
      });
    });

    describe('GET /:id', () => {
      it('should fail to get a payment with invalid id format (negative)', async () => {
        try {
          await axios.get(`${baseURL}/${invalidUuid}`);
        } catch (error: any) {
          expect(error.response.status).toBe(400);
        }
      });

      it('should get the previously created payment by id (positive)', async () => {
        const res = await axios.get(`${baseURL}/${paymentId}`);

        expect(res.status).toBe(200);
        expect(res.data).toBeDefined(); // Khusus metode GET melakukan expect terhadap data
      });
    });

    describe('POST /webhook', () => {
      it('should fail to send webhook with invalid id format (negative)', async () => {
        try {
          await axios.post(`${baseURL}/webhook`, {});
        } catch (error: any) {
          expect(error.response.status).toBeGreaterThanOrEqual(400);
        }
      });

      it('should send webhook for the previously created payment with invalid signature key (negative)', async () => {
        try {
          await axios.post(`${baseURL}/webhook`, webhookPayload);
        } catch (error: any) {
          expect(error.response.status).toBeGreaterThanOrEqual(400);
        }
      });

      it('should send webhook for the previously created payment (positive)', async () => {
        const rawSignature =
          providerOrderId +
          webhookPayload.status_code +
          webhookPayload.gross_amount +
          process.env.MIDTRANS_SERVER_KEY;

        const res = await axios.post(`${baseURL}/webhook`, {
          ...webhookPayload,
          signature_key: createHash('sha512')
            .update(rawSignature)
            .digest('hex'),
          order_id: providerOrderId, // Pastikan order_id sesuai dengan yang dibuat di test sebelumnya
        });

        expect(res.status).toBe(201);
        expect(res.data).toBeDefined(); // Khusus metode POST melakukan expect terhadap data
      });
    });

    describe('GET /order/:id', () => {
      it('should fail to get a payments by order id with invalid id format (negative)', async () => {
        try {
          await axios.get(`${baseURL}/order/${invalidUuid}`);
        } catch (error: any) {
          expect(error.response.status).toBe(400);
        }
      });

      it('should get the payments by order id (positive)', async () => {
        const res = await axios.get(`${baseURL}/order/${staticOrderId}`);

        expect(res.status).toBe(200);
        expect(res.data).toBeDefined(); // Khusus metode GET melakukan expect terhadap data
      });
    });

    describe('POST /order/:id/retry', () => {
      const cancelledOrderId = randomUUID();

      beforeAll(async () => {
        // create payment dengan status cancelled, expired, atau failed untuk memastikan test retry berhasil
        const res = await axios.post(baseURL, {
          orderId: cancelledOrderId,
          amount,
        });

        const orderId = res.data?.data?.orderId || res.data?.orderId;

        const rawSignature =
          orderId +
          webhookPayload.status_code +
          webhookPayload.gross_amount +
          process.env.MIDTRANS_SERVER_KEY;

        // webhook cancelled
        await axios.post(`${baseURL}/webhook`, {
          ...webhookPayload,
          order_id: orderId, // Pastikan order_id sesuai dengan yang dibuat di test sebelumnya
          status_code: '200',
          transaction_status: 'cancel',
          signature_key: createHash('sha512')
            .update(rawSignature)
            .digest('hex'),
        });
      });

      it('should fail to recreate a payment with invalid data (negative)', async () => {
        try {
          await axios.post(`${baseURL}/order/${invalidUuid}/retry`); // Payload kosong memicu error validasi
        } catch (error: any) {
          expect(error.response.status).toBeGreaterThanOrEqual(400);
        }
      });

      it('should fail to recreate a payment when invalid status (negative)', async () => {
        try {
          await axios.post(`${baseURL}/order/${staticOrderId}/retry`); // Payload kosong memicu error validasi
        } catch (error: any) {
          expect(error.response.status).toBe(422);
        }
      });

      it('should create a payment successfully (positive)', async () => {
        // const payload = {
        //   orderId: staticOrderId,
        //   amount,
        // };
        const res = await axios.post(
          `${baseURL}/order/${cancelledOrderId}/retry`,
        );

        expect(res.status).toBe(201);
      });
    });
  });
});
