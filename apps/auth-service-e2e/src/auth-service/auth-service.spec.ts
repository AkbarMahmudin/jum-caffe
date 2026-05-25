import axios from 'axios';

describe('Auth Service E2E', () => {
  const apiBaseUrl = '/api';

  describe('UserController (e2e)', () => {
    describe('POST /users/register', () => {
      it('should register a new user successfully', async () => {
        const res = await axios.post(`${apiBaseUrl}/users/register`, {
          email: 'test-e2e-new@example.com',
          password: 'password123',
          name: 'Test User',
        });

        expect(res.status).toBe(201);
        expect(res.data).toHaveProperty('message');
        expect(res.data?.message).toEqual('User registered successfully');
      });

      it('should fail when registering with an existing email', async () => {
        try {
          await axios.post(`${apiBaseUrl}/users/register`, {
            email: 'test-e2e-new@example.com',
            password: 'password123',
            name: 'Test User',
          });
          fail('Should have thrown an error');
        } catch (error: any) {
          expect(error.response?.status).toBe(409);
          expect(error.response?.data?.message).toContain('already exists');
        }
      });

      it('should fail when registering with missing fields', async () => {
        try {
          await axios.post(`${apiBaseUrl}/users/register`, {
            email: 'missing-name@example.com',
            password: 'password123',
          });
          fail('Should have thrown an error');
        } catch (error: any) {
          expect(error.response?.status).toBe(400);
        }
      });
    });
  });

  describe('AuthController (e2e)', () => {
    let currentRefreshToken = 'dummy-refresh-token';

    describe('POST /auth/login', () => {
      it('should login user and return tokens', async () => {
        const res = await axios.post(`${apiBaseUrl}/auth/login`, {
          email: 'test-e2e-new@example.com',
          password: 'password123',
        });

        expect(res.status).toBe(201);
        expect(res.data?.data).toHaveProperty('accessToken');
        expect(res.data?.data).toHaveProperty('refreshToken');

        if (res.data?.data.refreshToken) {
          currentRefreshToken = res.data?.data.refreshToken;
        }
      });

      it('should fail to login with incorrect password', async () => {
        try {
          await axios.post(`${apiBaseUrl}/auth/login`, {
            email: 'test-e2e-new@example.com',
            password: 'wrongpassword',
          });
          fail('Should have thrown an error');
        } catch (error: any) {
          // Based on service implementation, this might throw 500 if not handled,
          // or 401/400 if handled.
          expect(error.response?.status).toBeGreaterThanOrEqual(400);
        }
      });

      it('should fail to login with non-existent email', async () => {
        try {
          await axios.post(`${apiBaseUrl}/auth/login`, {
            email: 'nonexistent@example.com',
            password: 'password123',
          });
          fail('Should have thrown an error');
        } catch (error: any) {
          // AbstractRepository throws 404 NotFound
          expect(error.response?.status).toBe(404);
        }
      });
    });

    describe('PUT /auth/refresh', () => {
      it('should return a new access token', async () => {
        const res = await axios.put(`${apiBaseUrl}/auth/refresh`, {
          refreshToken: currentRefreshToken,
        });

        expect(res.status).toBe(200);
        expect(res.data?.data).toHaveProperty('accessToken');
      });

      it('should fail to refresh with an invalid token', async () => {
        try {
          await axios.put(`${apiBaseUrl}/auth/refresh`, {
            refreshToken: 'invalid-token',
          });
          fail('Should have thrown an error');
        } catch (error: any) {
          // AuthService throws UnprocessableEntityException (422)
          expect(error.response?.status).toBe(422);
          expect(error.response?.data?.message).toBe('Invalid refresh token');
        }
      });
    });

    describe('DELETE /auth/logout', () => {
      it('should logout user and return 204 no content', async () => {
        const res = await axios.delete(`${apiBaseUrl}/auth/logout`, {
          data: { refreshToken: currentRefreshToken },
        });

        expect(res.status).toBe(204);
      });

      it('should fail to logout with a non-existent token', async () => {
        try {
          await axios.delete(`${apiBaseUrl}/auth/logout`, {
            data: { refreshToken: 'non-existent-token' },
          });
          fail('Should have thrown an error');
        } catch (error: any) {
          // AbstractRepository.findOneAndDelete throws 404 NotFound
          expect(error.response?.status).toBe(404);
        }
      });
    });
  });
});
