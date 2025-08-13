const request = require('supertest');
const app = require('../server');

describe('Auth Routes', () => {
  test('POST /api/auth/register should create user', async () => {
    const userData = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
      role: 'artist'
    };
    
    const response = await request(app)
      .post('/api/auth/register')
      .send(userData);
    
    expect(response.status).toBe(201);
  });

  test('POST /api/auth/login should authenticate user', async () => {
    const loginData = {
      email: 'test@example.com',
      password: 'password123'
    };
    
    const response = await request(app)
      .post('/api/auth/login')
      .send(loginData);
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
  });

  test('POST /api/auth/register should fail with missing fields', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({});
    
    expect(response.status).toBe(400);
  });
});