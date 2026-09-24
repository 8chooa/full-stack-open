const blogsRouter = require('express').Router();
const Blog = require('../models/blog.js');

blogsRouter.get('/', async (request, response, next) => {
  try {
    const blogs = await Blog.find({});
    response.json(blogs);
  } catch (error) {
    next(error);
  }
});

blogsRouter.post('/', async (request, response, next) => {
    const body = request.body;
    const blog = new Blog(body);

    try {
      const savedBlog = await blog.save();
      response.status(201).json(savedBlog);
    } catch (error) {
      next(error);
    }
});

blogsRouter.delete('/:id', async (request, response, next) => {
  const id = request.params.id;
  try {
    await Blog.findByIdAndDelete(id);
    response.status(204).end();
  } catch (error) {
    next(error);
  }
});

blogsRouter.put('/:id', async (request, response, next) => {
  const newBlog = {
    title: request.body.title,
    author: request.body.author,
    url: request.body.url,
    likes: request.body.likes,
  };

  try {
    const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, newBlog, { returnDocument: 'after' });
    response.json(updatedBlog);
  } catch (error) {
    next(error);
  }
})

module.exports = blogsRouter;
