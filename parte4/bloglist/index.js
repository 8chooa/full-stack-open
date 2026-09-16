const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number,
});

const Blog = mongoose.model('Blog', blogSchema);

const mongoUrl = 'mongodb+srv://luisfexd14_db_user:azmdg2wfhPH3g6jF@cluster0.wsncqlm.mongodb.net/bloglist?appName=Cluster0';
mongoose.connect(mongoUrl);

app.use(cors());
app.use(express.json());

app.get('/api/blogs', (request, response) => {
  Blog.find({}).then(blogs => {
    response.json(blogs);
  })
});

app.post('/api/blogs', (request, response) => {
  const body = request.body;

  const blog = new Blog(body);
  blog.save().then(result => {
    response.status(201).json(result);
  })
});

const PORT = 3003;
app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});