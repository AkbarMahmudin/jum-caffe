import axios from 'axios';

describe('OptionService API E2E Tests', () => {
  const baseURL = '/api/products/options';
  let optionId: string;
  const invalidUuid = 'invalid-uuid-format';

  describe('OptionController', () => {
    describe('POST /', () => {
      it('should fail to create an option with invalid data (negative)', async () => {
        try {
          await axios.post(baseURL, {}); // Asumsi payload kosong akan memicu error validasi
        } catch (error: any) {
          expect(error.response.status).toBe(400);
        }
      });

      it('should create an option with values successfully (positive)', async () => {
        const payload = { 
          name: 'Option Test',
          values: [
            { name: 'Small', additionalPrice: 0 },
            { name: 'Large', additionalPrice: 5000 }
          ]
        };
        const res = await axios.post(baseURL, payload);
        
        expect(res.status).toBe(201);
        
        // Simpan id hasil dari response untuk digunakan di test case berikutnya
        optionId = res.data.data.id;
      });
    });

    describe('GET /', () => {
      it('should fail to get all options with invalid query params (negative)', async () => {
        try {
          await axios.get(`${baseURL}?invalidParam=true`);
        } catch (error: any) {
          expect(error.response.status).toBe(400);
        }
      });

      it('should get all options (positive)', async () => {
        const res = await axios.get(baseURL);
        
        expect(res.status).toBe(200);
        expect(res.data).toBeDefined(); // Expect data yang dikembalikan untuk GET
      });
    });

    describe('GET /:id', () => {
      it('should fail to get an option with invalid id format (negative)', async () => {
        try {
          await axios.get(`${baseURL}/${invalidUuid}`);
        } catch (error: any) {
          expect(error.response.status).toBe(400);
        }
      });

      it('should get the previously created option by id (positive)', async () => {
        const res = await axios.get(`${baseURL}/${optionId}`);
        
        expect(res.status).toBe(200);
        expect(res.data).toBeDefined(); // Expect data yang dikembalikan untuk GET
      });
    });

    describe('PUT /:id', () => {
      it('should fail to update an option with invalid id format (negative)', async () => {
        try {
          const payload = { name: 'Option Update' };
          await axios.put(`${baseURL}/${invalidUuid}`, payload);
        } catch (error: any) {
          expect(error.response.status).toBe(400);
        }
      });

      it('should update the previously created option with new values successfully (positive)', async () => {
        const payload = { 
          name: 'Option Update',
          values: [
            { name: 'Medium', additionalPrice: 2000 },
            { name: 'Extra Large', additionalPrice: 7000 }
          ]
        };
        const res = await axios.put(`${baseURL}/${optionId}`, payload);
        
        expect(res.status).toBe(200);
        // Sesuai instruksi: Tidak perlu expect ke data untuk method selain GET
      });
    });

    describe('DELETE /:id', () => {
      it('should fail to delete an option with invalid id format (negative)', async () => {
        try {
          await axios.delete(`${baseURL}/${invalidUuid}`);
        } catch (error: any) {
          expect(error.response.status).toBe(400);
        }
      });

      it('should delete the previously created option successfully (positive)', async () => {
        const res = await axios.delete(`${baseURL}/${optionId}`);
        
        expect(res.status).toBe(200);
        // Sesuai instruksi: Tidak perlu expect ke data untuk method selain GET
      });
    });
  });
});
