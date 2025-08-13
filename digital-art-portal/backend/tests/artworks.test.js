const request = require('supertest');
const app = require('../server');

describe('Artwork Routes', () => {
  let token;
  
  beforeAll(async () => {
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@example.com', password: 'password123' });
    token = loginResponse.body.token;
  });

  test('GET /api/artworks should return artworks', async () => {
    const response = await request(app)
      .get('/api/artworks')
      .set('Authorization', `Bearer ${token}`);
    
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  test('POST /api/artworks should create artwork', async () => {
    const artworkData = {
      title: 'Test Art',
      description: 'Test Description',
      image_url: 'https://example.com/image.jpg',
      tags: 'test,art'
    };
    
    const response = await request(app)
      .post('/api/artworks')
      .set('Authorization', `Bearer ${token}`)
      .send(artworkData);
    
    expect(response.status).toBe(201);
  });

  test('GET /api/artworks should fail without auth', async () => {
    const response = await request(app)
      .get('/api/artworks');
    
    expect(response.status).toBe(401);
  });
});