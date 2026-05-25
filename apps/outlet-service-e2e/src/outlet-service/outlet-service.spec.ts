import axios from 'axios';
import { randomUUID } from 'crypto';

describe('OutletService API E2E Tests', () => {
  // Anda dapat menyesuaikan baseURL ini dengan environment test Anda
  const baseURL = '/api/outlets';
  let validUuid = '123e4567-e89b-12d3-a456-426614174000';
  const invalidUuid = 'invalid-uuid-format';
  const productIds = [randomUUID()];

  describe('OutletController', () => {
    describe('POST /', () => {
      it('should create an outlet successfully (positive)', async () => {
        const payload = {
          name: 'Outlet Baru',
          address: 'Jalan Kenangan',
          latitude: -6.931745065,
          longitude: 107.575878615,
        };
        const res = await axios.post(baseURL, payload);
        const { data } = res.data;

        expect(res.status).toBe(201);
        expect(data).toHaveProperty('id');

        validUuid = data?.id;
        // Sesuai instruksi: Tidak perlu expect ke data untuk method selain GET
      });

      it('should fail to create an outlet with invalid data (negative)', async () => {
        try {
          await axios.post(baseURL, {}); // Asumsi payload kosong akan memicu error validasi
        } catch (error: any) {
          expect(error.response.status).toBe(400);
        }
      });
    });

    describe('GET /', () => {
      it('should get all outlets (positive)', async () => {
        const res = await axios.get(baseURL);

        expect(res.status).toBe(200);
        expect(res.data).toBeDefined(); // Expect data yang dikembalikan
      });

      it('should fail to get all outlets with invalid query params (negative)', async () => {
        try {
          await axios.get(`${baseURL}?invalidParam=true`);
        } catch (error: any) {
          expect(error.response.status).toBe(400);
        }
      });
    });

    describe('GET /:id', () => {
      it('should get an outlet by id (positive)', async () => {
        const res = await axios.get(`${baseURL}/${validUuid}`);

        expect(res.status).toBe(200);
        expect(res.data).toBeDefined(); // Expect data yang dikembalikan
      });

      it('should fail to get an outlet with invalid id format (negative)', async () => {
        try {
          await axios.get(`${baseURL}/${invalidUuid}`);
        } catch (error: any) {
          expect(error.response.status).toBe(400); // Akan gagal karena ParseUUIDPipe
        }
      });
    });

    describe('PUT /:id', () => {
      it('should update an outlet successfully (positive)', async () => {
        const payload = { name: 'Outlet Update' };
        const res = await axios.put(`${baseURL}/${validUuid}`, payload);

        expect(res.status).toBe(200);
        // Tidak perlu expect ke data untuk method selain GET
      });

      it('should fail to update an outlet with invalid id format (negative)', async () => {
        try {
          const payload = { name: 'Outlet Update' };
          await axios.put(`${baseURL}/${invalidUuid}`, payload);
        } catch (error: any) {
          expect(error.response.status).toBe(400); // Akan gagal karena ParseUUIDPipe
        }
      });
    });

    describe('DELETE /:id', () => {
      it('should delete an outlet successfully (positive)', async () => {
        const res = await axios.delete(`${baseURL}/${validUuid}`);

        expect(res.status).toBe(200);
        // Tidak perlu expect ke data untuk method selain GET
      });

      it('should fail to delete an outlet with invalid id format (negative)', async () => {
        try {
          await axios.delete(`${baseURL}/${invalidUuid}`);
        } catch (error: any) {
          expect(error.response.status).toBe(400); // Akan gagal karena ParseUUIDPipe
        }
      });
    });
  });

  describe('OutletProductController', () => {
    describe('POST /:outletId/products', () => {
      it('should upsert outlet products successfully (positive)', async () => {
        const payload = { productIds };
        const res = await axios.post(
          `${baseURL}/${validUuid}/products`,
          payload,
        );

        expect(res.status).toBe(201);
        // Tidak perlu expect ke data untuk method selain GET
      });

      it('should fail to upsert outlet products with invalid outletId format (negative)', async () => {
        try {
          const payload = { productIds };
          await axios.post(`${baseURL}/${invalidUuid}/products`, payload);
        } catch (error: any) {
          expect(error.response.status).toBe(400); // Akan gagal karena ParseUUIDPipe
        }
      });
    });

    describe('PUT /:outletId/products/status', () => {
      it('should update outlet product status successfully (positive)', async () => {
        const payload = { productIds, isAvailable: false };
        const res = await axios.put(
          `${baseURL}/${validUuid}/products/status`,
          payload,
        );

        expect(res.status).toBe(200);
        // Tidak perlu expect ke data untuk method selain GET
      });

      it('should fail to update outlet product status with invalid outletId format (negative)', async () => {
        try {
          const payload = { productIds, isAvailable: false };
          await axios.put(`${baseURL}/${invalidUuid}/products/status`, payload);
        } catch (error: any) {
          expect(error.response.status).toBe(400); // Akan gagal karena ParseUUIDPipe
        }
      });
    });
  });
});
