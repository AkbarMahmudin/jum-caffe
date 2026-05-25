import axios from 'axios';

describe('CategoryService API E2E Tests', () => {
  const baseURL = '/api/products/categories';
  let categoryId: string;
  const invalidUuid = 'invalid-uuid-format';

  describe('CategoryController', () => {
    describe('POST /', () => {
      it('should fail to create a category with invalid data (negative)', async () => {
        try {
          await axios.post(baseURL, {}); // Asumsi payload kosong akan memicu error validasi
        } catch (error: any) {
          expect(error.response.status).toBe(400);
        }
      });

      it('should create a category successfully (positive)', async () => {
        const payload = { name: 'Kategori Test' };
        const res = await axios.post(baseURL, payload);
        
        expect(res.status).toBe(201);
        
        // Simpan id hasil dari response untuk digunakan di test case berikutnya
        categoryId = res.data.data.id;
      });
    });

    describe('GET /', () => {
      it('should fail to get all categories with invalid query params (negative)', async () => {
        try {
          await axios.get(`${baseURL}?invalidParam=true`);
        } catch (error: any) {
          expect(error.response.status).toBe(400);
        }
      });

      it('should get all categories (positive)', async () => {
        const res = await axios.get(baseURL);
        
        expect(res.status).toBe(200);
        expect(res.data).toBeDefined(); // Expect data yang dikembalikan untuk GET
      });
    });

    describe('GET /:id', () => {
      it('should fail to get a category with invalid id format (negative)', async () => {
        try {
          await axios.get(`${baseURL}/${invalidUuid}`);
        } catch (error: any) {
          expect(error.response.status).toBe(400);
        }
      });

      it('should get the previously created category by id (positive)', async () => {
        const res = await axios.get(`${baseURL}/${categoryId}`);
        
        expect(res.status).toBe(200);
        expect(res.data).toBeDefined(); // Expect data yang dikembalikan untuk GET
      });
    });

    describe('PUT /:id', () => {
      it('should fail to update a category with invalid id format (negative)', async () => {
        try {
          const payload = { name: 'Kategori Update' };
          await axios.put(`${baseURL}/${invalidUuid}`, payload);
        } catch (error: any) {
          expect(error.response.status).toBe(400);
        }
      });

      it('should update the previously created category successfully (positive)', async () => {
        const payload = { name: 'Kategori Update' };
        const res = await axios.put(`${baseURL}/${categoryId}`, payload);
        
        expect(res.status).toBe(200);
        // Sesuai instruksi: Tidak perlu expect ke data untuk method selain GET
      });
    });

    describe('DELETE /:id', () => {
      it('should fail to delete a category with invalid id format (negative)', async () => {
        try {
          await axios.delete(`${baseURL}/${invalidUuid}`);
        } catch (error: any) {
          expect(error.response.status).toBe(400);
        }
      });

      it('should delete the previously created category successfully (positive)', async () => {
        const res = await axios.delete(`${baseURL}/${categoryId}`);
        
        expect(res.status).toBe(200);
        // Sesuai instruksi: Tidak perlu expect ke data untuk method selain GET
      });
    });
  });
});
