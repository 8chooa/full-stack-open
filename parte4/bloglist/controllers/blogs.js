const blogsRouter = require('express').Router();
const Blog = require('../models/blog.js');

const User = require('../models/user.js');
const jwt = require('jsonwebtoken');

blogsRouter.get('/', async (request, response, next) => {
  try {
    const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 });
    response.json(blogs);
  } catch (error) {
    next(error);
  }
});

blogsRouter.post('/', async (request, response) => {
  const body = request.body;
  
  const userByToken = request.user;

  if (!userByToken) {
    return response.status(401).json({ error: 'token missing' });
  }

  if (!userByToken.id) { //si el token no incluye el id del usuario
    return response.status(401).json({ error: 'token invalid' });
  }

  const user = await User.findById(userByToken.id); 

  const newBlog = {
    ...body,
    user: user._id,
  };

  const blog = new Blog(newBlog);

  const savedBlog = await blog.save();
  user.blogs = user.blogs.concat(savedBlog._id);
  await user.save();
  response.status(201).json(savedBlog);
});

blogsRouter.delete('/:id', async (request, response) => {
  const id = request.params.id;

  const userByToken = request.user;

  if (!userByToken.id) {
    return response.status(401).json({ error: 'token invalid' });
  }

  const user = await User.findById(userByToken.id); //usuario de la db que coincide con el token

  const blogToDelete = await Blog.findById(id); //blog de la db
  if (blogToDelete.user.toString() === user._id.toString()) {
    await Blog.findByIdAndDelete(id);
    response.status(204).end();
  } else {
    response.status(403).end();
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
