const { test, describe, beforeEach, after } = require('node:test');
const assert = require('node:assert');
const app = require('../app');
const supertest = require('supertest');
const helper = require('./test_helper');
const Blog = require('../models/blog');
const mongoose = require('mongoose');
const { title } = require('node:process');

const api = supertest(app);

beforeEach(async () => {
  await Blog.deleteMany({});
  for(let blog of helper.initialBlogs) {
    let blogObject = new Blog(blog);
    await blogObject.save();
  }
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
    }

    await api
      .post('/api/blogs')
      .send(newBlog);

    const blogsAtEnd = await helper.blogsInDb();

    /*const response = await api.get('/api/blogs'); //cambiar por el método blogsInDb() del modulo helper
    assert.strictEqual(response.body.length, helper.initialBlogs.length + 1); */
    assert.strictEqual(blogsAtEnd.length, blogsAtStart.length + 1);
  });

  test('si falta la prop likes, tendrá el valor 0 por defecto', async () => {
    const blogWithoutLikes = {
      title: 'Alan x el Mundo',
      author: 'Alan',
      url: 'https://urlDePrueba.com',
    }

    const response = await api
      .post('/api/blogs')
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
      .send(blogMissingData)
      .expect(400);

    const blogs = await helper.blogsInDb();

    assert(blogs.length, helper.initialBlogs.length);
  });

  test('al borrar un recurso la api responde con status code 204', async () => {
    const blogsAtStart = await helper.blogsInDb();
    const blogToDelete = blogsAtStart[0]
    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
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
});

after(async () => {
  await mongoose.connection.close();
})