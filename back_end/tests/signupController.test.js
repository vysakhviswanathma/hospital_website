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

describe('Create User', () => {
  // Test will pass if we create a User
  it('Should create a User', async () => {
    const response = await request.post('/user/signup')
      .send({
        firstName: 'Test', lastName: 'User', email: 'test1@test.com', password: '123456',
      })
      .set('Accept', 'application/json');

    expect(response.body.status).toBeTruthy();
    expect(response.body.message).toBeDefined();
  });

  // Test will pass if we get response status as false,
  // on providing invalid input
  it('Should fail on invalid input', async () => {
    const response = await request.post('/user/signup')
      .send({ user: 'This is an invalid input' })
      .set('Accept', 'application/json');

    expect(response.body.status).toBeFalsy();
    expect(response.body.message).toBeDefined();
  });

  // Test will pass if we get response status as false,
  // on providing no input
  it('Should fail on no input', async () => {
    const response = await request.post('/user/signup')
      .set('Accept', 'application/json');

    expect(response.body.status).toBeFalsy();
    expect(response.body.message).toBeDefined();
  });
});
