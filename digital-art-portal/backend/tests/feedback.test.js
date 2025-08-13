const request = require('supertest');
const app = require('../server');

describe('Feedback Routes', () => {
  let token;
  let artworkId = 1;
  
  beforeAll(async () => {
    const loginResponse = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'curator',
        email: 'curator@test.com',
        password: 'password123',
        role: 'curator'
      });
    
    const curatorLogin = await request(app)
      .post('/api/auth/login')
      .send({ email: 'curator@test.com', password: 'password123' });
    token = curatorLogin.body.token;
  });

  test('POST /api/feedback should create feedback', async () => {
    const feedbackData = {
      artwork_id: artworkId,
      comment: 'Great artwork!',
      rating: 5
    };
    
    const response = await request(app)
      .post('/api/feedback')
      .set('Authorization', `Bearer ${token}`)
      .send(feedbackData);
    
    expect(response.status).toBe(201);
  });

  test('GET /api/feedback/artwork/:id should return feedback', async () => {
    const response = await request(app)
      .get(`/api/feedback/artwork/${artworkId}`)
      .set('Authorization', `Bearer ${token}`);
    
    expect(response.status).toBe(200);
  });
});