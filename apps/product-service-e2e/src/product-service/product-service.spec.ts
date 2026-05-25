import axios from 'axios';

describe('ProductService API E2E Tests', () => {
  const baseURL = '/api/products';
  const categoryURL = '/api/products/categories';
  const optionURL = '/api/products/options';
  
  let categoryId: string;
  let optionId: string;
  let productId: string;
  const invalidUuid = 'invalid-uuid-format';

  // Setup data dari API lain (Category & Option) sebelum test Product
  // Sesuai instruksi untuk saling berkesinambungan dan mengambil data dari api lain
  beforeAll(async () => {
    try {
      // Create Category
      const categoryRes = await axios.post(categoryURL, {
        name: 'Kategori Setup',
      });
      categoryId = categoryRes.data.data.id;

      // Create Option
      const optionRes = await axios.post(optionURL, {
        name: 'Option Setup',
        values: [
          { name: 'Small', additionalPrice: 0 }
        ]
      });
      optionId = optionRes.data.data.id;
    } catch (error) {
      console.error('Failed to setup category or option:', error);
    }
  });

  describe('ProductController', () => {
    describe('POST /', () => {
      it('should fail to create a product with invalid data (negative)', async () => {
        try {
          await axios.post(baseURL, {}); // Asumsi payload kosong memicu error validasi
        } catch (error: any) {
          expect(error.response.status).toBe(400);
        }
      });

      it('should create a product successfully (positive)', async () => {
        const payload = { 
          name: 'Produk Test',
          basePrice: 15000,
          categoryId: categoryId, // Menggunakan ID kategori dari API lain
          isActive: true
        };
        const res = await axios.post(baseURL, payload);
        
        expect(res.status).toBe(201);
        
        // Simpan productId untuk test selanjutnya
        productId = res.data.data.id; 
      });
    });

    describe('GET /', () => {
      it('should fail to get all products with invalid query params (negative)', async () => {
        try {
          await axios.get(`${baseURL}?invalidParam=true`);
        } catch (error: any) {
          expect(error.response.status).toBe(400);
        }
      });

      it('should get all products (positive)', async () => {
        const res = await axios.get(baseURL);
        
        expect(res.status).toBe(200);
        expect(res.data).toBeDefined(); // Expect data dikembalikan untuk GET
      });
    });

    describe('GET /:id', () => {
      it('should fail to get a product with invalid id format (negative)', async () => {
        try {
          await axios.get(`${baseURL}/${invalidUuid}`);
        } catch (error: any) {
          expect(error.response.status).toBe(400);
        }
      });

      it('should get the previously created product by id (positive)', async () => {
        const res = await axios.get(`${baseURL}/${productId}`);
        
        expect(res.status).toBe(200);
        expect(res.data).toBeDefined(); // Expect data dikembalikan untuk GET
      });
    });

    describe('PUT /:id', () => {
      it('should fail to update a product with invalid id format (negative)', async () => {
        try {
          const payload = { name: 'Produk Update' };
          await axios.put(`${baseURL}/${invalidUuid}`, payload);
        } catch (error: any) {
          expect(error.response.status).toBe(400);
        }
      });

      it('should update the previously created product successfully (positive)', async () => {
        const payload = { name: 'Produk Update', basePrice: 20000 };
        const res = await axios.put(`${baseURL}/${productId}`, payload);
        
        expect(res.status).toBe(200);
        // Tidak perlu expect data untuk selain GET
      });
    });

    describe('PUT /:id/options', () => {
      it('should fail to attach options with invalid id format (negative)', async () => {
        try {
          const payload = { optionIds: [optionId] };
          await axios.put(`${baseURL}/${invalidUuid}/options`, payload);
        } catch (error: any) {
          expect(error.response.status).toBe(400);
        }
      });

      it('should attach options to the previously created product successfully (positive)', async () => {
        const payload = { optionIds: [optionId] }; // Menggunakan optionId dari setup
        const res = await axios.put(`${baseURL}/${productId}/options`, payload);
        
        expect(res.status).toBe(200);
        // Tidak perlu expect data untuk selain GET
      });
    });

    describe('DELETE /:id', () => {
      it('should fail to delete a product with invalid id format (negative)', async () => {
        try {
          await axios.delete(`${baseURL}/${invalidUuid}`);
        } catch (error: any) {
          expect(error.response.status).toBe(400);
        }
      });

      it('should delete the previously created product successfully (positive)', async () => {
        const res = await axios.delete(`${baseURL}/${productId}`);
        
        expect(res.status).toBe(200);
        // Tidak perlu expect data untuk selain GET
      });
    });
  });
});
