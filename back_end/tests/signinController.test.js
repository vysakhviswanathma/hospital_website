/* eslint-disable consistent-return */
const supertest = require('supertest');
const app = require('../server');

// Link to your server file
const request = supertest(app);
const { mongoose } = require('../database');

afterAll(() => {
  // Disconnect the MongoDb
  mongoose.disconnect();
});


describe('Login', () => {
  // Test will pass if a User already signup
  it('succeeds with correct credentials', async () => {
    const response = await request.post('/user/signin')
      .send({
        email: 'murshidpc@gmail.com', password: '123456',
      })
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/x-www-form-urlencoded');

    expect(response.body.status).toBeTruthy();
    expect(response.body.message).toBeDefined();
  });

  it('fails with invalid credentials', async () => {
    const response = await request.post('/user/signin')
      .send({
        email: 'murshid@gmail.com', password: '123456',
      })
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/x-www-form-urlencoded');

    expect(response.body.status).toBeFalsy();
    expect(response.body.message).toBeDefined();
  });

  it('fails with missing credentials', async () => {
    const response = await request.post('/user/signin')
      .send({
        email: 'murshid@gmail.com',
      })
      .set('Accept', 'application/json')
      .set('Content-Type', 'application/x-www-form-urlencoded');

    expect(response.body.status).toBeFalsy();
    expect(response.body.message).toBeDefined();
  });
});
