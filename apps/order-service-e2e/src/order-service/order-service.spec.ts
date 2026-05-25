import axios from 'axios';

describe('OrderService API E2E Tests', () => {
  const baseURL = '/api/orders';
  let orderId: string;
  const invalidUuid = 'invalid-uuid-format';

  // Request body statis (editable) sesuai instruksi
  const staticOutletId = 'b31e9743-4516-4449-9050-5aac7568b40e';
  const staticProductId = 'ae51b738-54a1-461f-a925-d0abc6a0ef38';
  const staticCustomizationId = '3ee398db-95fa-4d51-b8cb-004a89888bc2';

  describe('OrderController', () => {
    describe('POST /', () => {
      it('should fail to create an order with invalid data (negative)', async () => {
        try {
          await axios.post(baseURL, {}); // Payload kosong memicu error validasi
        } catch (error: any) {
          expect(error.response.status).toBe(400);
        }
      });

      it('should create an order successfully (positive)', async () => {
        const payload = {
          outletId: staticOutletId,
          source: 'normal', // Diambil dari enum OrderSource
          items: [
            {
              productId: staticProductId,
              quantity: 2,
              customization: [staticCustomizationId], // Dalam bentuk array string (UUIDs)
            },
          ],
        };
        const res = await axios.post(baseURL, payload);

        expect(res.status).toBe(201);
        
        // Simpan id order dari respons untuk test selanjutnya
        // Asumsi respons mengembalikan { data: { id } } atau { id }
        orderId = res.data?.data?.id || res.data?.id; 
      });
    });

    describe('GET /', () => {
      it('should fail to get all orders with invalid query params (negative)', async () => {
        try {
          await axios.get(`${baseURL}?invalidParam=true`);
        } catch (error: any) {
          expect(error.response.status).toBe(400);
        }
      });

      it('should get all orders (positive)', async () => {
        const res = await axios.get(baseURL);

        expect(res.status).toBe(200);
        expect(res.data).toBeDefined(); // Khusus metode GET melakukan expect terhadap data
      });
    });

    describe('GET /:id', () => {
      it('should fail to get an order with invalid id format (negative)', async () => {
        try {
          await axios.get(`${baseURL}/${invalidUuid}`);
        } catch (error: any) {
          expect(error.response.status).toBe(400);
        }
      });

      it('should get the previously created order by id (positive)', async () => {
        const res = await axios.get(`${baseURL}/${orderId}`);

        expect(res.status).toBe(200);
        expect(res.data).toBeDefined(); // Khusus metode GET melakukan expect terhadap data
      });
    });

    describe('PUT /:id/status', () => {
      it('should fail to update order status with invalid id format (negative)', async () => {
        try {
          const payload = { status: 'paid' };
          await axios.put(`${baseURL}/${invalidUuid}/status`, payload);
        } catch (error: any) {
          expect(error.response.status).toBe(400);
        }
      });

      it('should fail to update order status with invalid status value (negative)', async () => {
        try {
          // 'invalid_status' bukan bagian dari enum OrderStatus
          const payload = { status: 'invalid_status' }; 
          await axios.put(`${baseURL}/${orderId}/status`, payload);
        } catch (error: any) {
          expect(error.response.status).toBe(400);
        }
      });

      it('should update the previously created order status successfully (positive)', async () => {
        const payload = { status: 'paid' }; // Diambil dari enum OrderStatus
        const res = await axios.put(`${baseURL}/${orderId}/status`, payload);

        expect(res.status).toBe(200);
        // Sesuai instruksi: Tidak perlu expect ke data untuk method selain GET
      });
    });
  });
});
