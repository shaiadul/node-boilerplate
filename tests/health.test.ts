import request from 'supertest';
import app from '../src/app';

describe('GET /health', () => {
  it('should return 200 OK and check healthy properties', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('success', true);
    expect(res.body.message).toBe('Server is healthy');
    expect(res.body.data).toHaveProperty('uptime');
  });
});
