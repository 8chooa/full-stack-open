import { useState } from 'react'

const Blog = ({ blog, increaseLikes, deleteBlog, currentUserId }) => {
  const [viewDetails, setViewDetails] = useState(false)

  const showView = { display: viewDetails ? '' : 'none' }
  const toggleView = () => {
    setViewDetails(!viewDetails)
  }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  return (
    <div style={blogStyle}>
      <div>
        {blog.title} {viewDetails ? '' : blog.author}
        <button onClick={toggleView}>{viewDetails ? 'hide' : 'view'}</button>
      </div>
      <div style={showView}>
        {blog.url} <br/>
        {blog.likes} <button onClick={() => increaseLikes(blog.id)}>like</button> <br/>
        {blog.author} <br/>
        {currentUserId !== blog.user.id ? null : (
          <button onClick={() => deleteBlog(blog.id)}>remove</button>
        )}
      </div>

    </div>
  )
}

export default Blog