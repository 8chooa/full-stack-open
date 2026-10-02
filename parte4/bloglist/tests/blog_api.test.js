const { test, describe, beforeEach, after } = require('node:test');
const assert = require('node:assert');
const app = require('../app');
const supertest = require('supertest');
const helper = require('./test_helper');
const Blog = require('../models/blog');
const mongoose = require('mongoose');

const User = require('../models/user');
const bcrypt = require('bcrypt');

const api = supertest(app);

let token; //variable para almacenar el token desde la funcion beforeEach

beforeEach(async () => {

  //para los usuarios
  await User.deleteMany({});
  const user = new User({
    username: "billyJoel",
    name: "billy",
    passwordHash: await bcrypt.hash('password123', 10)
  });
  await user.save();


  await Blog.deleteMany({});
  for(let blog of helper.initialBlogs) {
    let blogObject = new Blog({ ...blog, user: user._id });
    await blogObject.save();
  }

  //para iniciar sesion
  const userToAuth = {
    username: "billyJoel",
    password: "password123",
  };

  const result = await api
    .post('/api/login')
    .send(userToAuth)
    
  token = result.body.token;
});

describe('la api responde correctamente', () => {
  test('devuelve la cantidad correcta de publicaciones', async () => {
    const response = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/);
    
    assert.strictEqual(response.body.length, helper.initialBlogs.length);

  });

  test('el identificador del recurso se llama id', async () => {
    const response = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const propsObjects = response.body.map(obj => Object.keys(obj));
    assert(propsObjects.every((array) => array.some((prop) => prop === 'id')));
  })

  test('se crea correctamente un nuevo blog', async () => {
    const blogsAtStart = await helper.blogsInDb();

    const newBlog = {
      title: 'Alan x el Mundo',
      author: 'Alan',
      url: 'https://urlDePrueba.com',
      likes: 400
    };

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const blogsAtEnd = await helper.blogsInDb();

    assert.strictEqual(blogsAtEnd.length, blogsAtStart.length + 1);

    const titles = blogsAtEnd.map(blog => blog.title);
    assert(titles.includes('Alan x el Mundo'));
  });

  test('si falta la prop likes, tendrá el valor 0 por defecto', async () => {
    const blogWithoutLikes = {
      title: 'Alan x el Mundo',
      author: 'Alan',
      url: 'https://urlDePrueba.com',
    }

    const response = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(blogWithoutLikes)
      .expect(201)
      .expect('Content-Type', /application\/json/);
    
    assert.strictEqual(response.body.likes, 0);
  });

  test('la api responde con status code 400 si falta title o url', async () => {
    const blogMissingData = {
      author: 'Luis Ochoa',
      likes: 1
    };

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(blogMissingData)
      .expect(400);

    const blogs = await helper.blogsInDb();

    assert(blogs.length, helper.initialBlogs.length);
  });

  test('al borrar un blog la api responde con status code 204', async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToDelete = blogsAtStart[0]
    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204);
    
    const blogsAtEnd = await helper.blogsInDb();
    assert(blogsAtEnd.length, blogsAtStart.length - 1);
  })

  test('actualizar un blog', async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToUpdate = blogsAtStart[0];
    const newData = {
      likes: 3
    };

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(newData)
      .expect(200)
      .expect('Content-Type', /application\/json/);
    
    const blogsAtEnd = await helper.blogsInDb();
    const updatedBlog = blogsAtEnd.find(blog => blog.id === blogToUpdate.id);
    assert.strictEqual(updatedBlog.likes, 3);
  });

  test('no se puede agregar un blog sin token', async () => {
    const blogsAtStart = await helper.blogsInDb();

    const blogWithoutUser = {
      title: 'Alan x el Mundo',
      author: 'Alan',
      url: 'https://urlDePrueba.com',
      likes: 400
    };

    await api
      .post('/api/blogs')
      .expect(401)
      .expect('Content-Type', /application\/json/);
    
    const blogsAtEnd = await helper.blogsInDb();
    assert.strictEqual(blogsAtStart.length, blogsAtEnd.length);
  })
});

after(async () => {
  await mongoose.connection.close();
})