const { test, beforeEach, after, describe } = require('node:test');
const assert = require('node:assert')
const mongoose = require('mongoose');
const User = require('../models/user');
const app = require('../app');
const supertest = require('supertest');
const bcrypt = require('bcrypt');

const api = supertest(app);

beforeEach(async () => {
  await User.deleteMany({});
  const user = new User({
    username: 'luis8',
    name: 'luis',
    passwordHash: await bcrypt.hash('password123', 10)
  });
  await user.save();
})

describe('como responde la api ante falta de datos de usuarios', () => {
  test('si falta username responde con status code 400', async () => {
    const usersAtStart = await User.find({});

    const userWithoutUsername = {
      name: 'luka',
      password: '123',
    };

    await api
      .post('/api/users')
      .send(userWithoutUsername)
      .expect(400)
    
    const usersAtEnd = await User.find({});
    assert.strictEqual(usersAtStart.length, usersAtEnd.length);
    const names = usersAtEnd.map(user => user.name);
    assert(!(names.includes(userWithoutUsername.name)))
  });

  test.only('si falta password responde con status code 400 y un mensaje de error', async () => {
    const usersAtStart = await User.find({});
    
    const userWithoutPassword = {
      username: 'pollito2',
      name: 'pollo'
    };

    const response = await api
      .post('/api/users')
      .send(userWithoutPassword)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    const usersAtEnd = await User.find({});

    assert.strictEqual(usersAtStart.length, usersAtEnd.length);
    
    assert(response.body.error.includes('password format error'));
  })
});

after(async () => {
  await mongoose.connection.close();
})