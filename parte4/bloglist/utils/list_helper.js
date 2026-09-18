const _ = require('lodash');
const dummy = (array) => {
  return 1;
}

const totalLikes = (blogs) => {
  const sumLikesBlogs = (sum, blog) => {
    return sum + blog.likes
  }
  return blogs.reduce(sumLikesBlogs, 0);
}

const favoriteBlog = (blogs) => {
  return blogs.reduce((moreLikes, blog) => {
    if (blog.likes > moreLikes.likes) {
      return blog;
    }
    return moreLikes;
  });
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) return null; 
  const autorConts = _.countBy(blogs, 'author');
  const array = Object.entries(autorConts);
  const [ author, blogsCant ] = _.maxBy(array, (([, cant]) => cant)); //devuelve un array (aquel cuya cant sea mayor) y desestructuramos de una vez
  return {
    author,
    blogsCant,
  }
}

const mostLikes = (blogs) => {
  const autorGroup = _.groupBy(blogs, 'author');
  const arrayAutorGroup = Object.entries(autorGroup);
  const sumLikes = arrayAutorGroup.map((autorBlogs) => {
    const totalLikes = _.sumBy(autorBlogs[1], 'likes');
    return {
      author: autorBlogs[0],
      likes: totalLikes,
    };
  })
  const moreLikes = _.maxBy(sumLikes, (({ autor, likes}) => likes));

  return moreLikes;
};

module.exports = { dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes };