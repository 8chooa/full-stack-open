import { useState } from 'react'

const BlogForm = ({ createBlog }) => {
  const [blogData, setBlogData] = useState({
    title: '',
    author: '',
    url: '',
  })

  const handleSubmitBlog = (event) => {
    event.preventDefault()
    createBlog(blogData)
    setBlogData({
      title: '',
      author: '',
      url: '',
    })
  }

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={handleSubmitBlog}>
        <div>
          <label>
            title
            <input type="text" value={blogData.title} onChange={(event) => setBlogData({ ...blogData, title: event.target.value })} required/>
          </label>
        </div>
        <div>
          <label>
            author
            <input type="text" value={blogData.author} onChange={(event) => setBlogData({ ...blogData, author: event.target.value })}/>
          </label>
        </div>
        <div>
          <label>
            url
            <input type="text" value={blogData.url} onChange={(event) => setBlogData({ ...blogData, url: event.target.value })} required/>
          </label>
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default BlogForm