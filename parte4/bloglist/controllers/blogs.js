const blogsRouter = require('express').Router();
const Blog = require('../models/blog.js');

blogsRouter.get('/', (request, response) => {
    Blog.find({}).then((blogs) => {
        response.json(blogs);
    })
});

blogsRouter.post('/', (request, response) => {
    const body = request.body;
    const blog = new Blog(body);

    blog.save().then((savedBlog) => {
        response.status(201).json(savedBlog);
    });
});

module.exports = blogsRouter;
