const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

const time = require('../time');
const sinon = require('sinon');
sinon.stub(time, 'setTimeout');

test('blogs are returned as json', async () => {
  console.log('TESTI')
  jest.setTimeout(13000)
  const response = await api
    .get('/api/blogs').expect(200)
    .expect('Content-Type', /application\/json/);

    const res = response.body;
    expect(res.length).toBe(8)
    
})

afterAll(() => {
  mongoose.connection.close()
})