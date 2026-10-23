import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import LoginForm from './components/LoginForm'
import blogService from './services/blogs'
import loginService from './services/login'
import BlogForm from './components/BlogForm'
import Togglabel from './components/Togglabel'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  const [notification, setNotification] = useState({
    message: '',
    type: '',
    styles: {},
  })

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
  }, [])

  useEffect(() => {
    const userStorage = localStorage.getItem('loggedUser')
    if (userStorage) {
      const user = JSON.parse(userStorage)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleSubmit = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password })
      localStorage.setItem('loggedUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch {
      setNotification({
        message: 'username or password wrong',
        type: 'error',
        styles: { background: '#f09f9f', padding: '5px', border: '2px solid red', borderColor: 'red', color: 'red' }
      })
      setTimeout(() => {
        setNotification({ message: '', type: '', styles: {} })
      }, 3000)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('loggedUser')
    setUser(null)
  }

  const handleSubmitBlog = (blogData) => {
    blogService
      .create(blogData)
      .then((returnedBlog) => {
        setBlogs(blogs.concat(returnedBlog))
        setNotification({
          message: `a new blog ${returnedBlog.title} by ${returnedBlog.author} added`,
          type: 'success',
          styles: { background: '#73ca8c', padding: '5px', border: '1px solid green', color: 'green' }
        })
        setTimeout(() => {
          setNotification({ message: '', type: '', styles: {} })
        }, 3000)
      }).catch((err) => {
        console.log(err)
        setNotification({
          message: 'error in to add a blog',
          type: 'error',
          styles: { background: '#f09f9f', padding: '5px', border: '2px solid red', borderColor: 'red', color: 'red' }
        })
        setTimeout(() => {
          setNotification({ message: '', type: '', styles: {} })
        }, 3000)
      })
  }

  const blogForm = () => (
    <Togglabel>
      <BlogForm createBlog={handleSubmitBlog}/>
    </Togglabel>
  )

  const increaseLikes = (id) => {
    const blogToUpdate = blogs.find(blog => blog.id === id)
    const bodyBlog = {
      title: blogToUpdate.title,
      author: blogToUpdate.author,
      url: blogToUpdate.url,
      likes: blogToUpdate.likes + 1,
      user: blogToUpdate.user.id,
    }
    blogService
      .update(id, bodyBlog)
      .then((updatedBlog) => {
        setBlogs(blogs.map(blog => blog.id !== id ? blog : updatedBlog))
      })
  }

  const sortedBlogs = Array.isArray(blogs) ? [...blogs].sort((a,b) => b.likes - a.likes) : []

  const deleteBlog = (id) => {
    const blogToDelete = blogs.find(blog => blog.id === id)
    if (window.confirm(`Remove ${blogToDelete.title} by ${blogToDelete.author}`)) {
      blogService
        .deleteBlog(id)
        .then(() => {
          setBlogs(blogs.filter(blog => blog.id !== id ))
          setNotification({ message: `blog ${blogToDelete.title} removed!`, type: 'success', styles: { background: '#73ca8c', padding: '5px', border: '1px solid green', color: 'green' } })
          setTimeout(() => setNotification({ message: '', type: '', styles: {} }), 3000)
        })
        .catch((err) => {
          console.log(err)
          setNotification({ message: `error can't remove blog: ${err.response.data.error}`, type: 'error', styles: { background: '#f09f9f', padding: '5px', border: '2px solid red', borderColor: 'red', color: 'red' } })
          setTimeout(() => setNotification(''), 3000)
        })
    }
  }

  return (
    <div>
      {!user && (
        <LoginForm username={username} setUsername={setUsername} password={password} setPassword={setPassword} handleSubmit={handleSubmit} notification={notification}/>
      )}

      {user && (
        <div>
          <h2>blogs</h2>
          {notification.message === '' ? null : (
            <div style={notification.styles}>{notification.message}</div>
          )}
          <div style={{ marginBottom: '10px' }}>
            {user.name} logged in {' '}
            <button onClick={handleLogout}>logout</button>
          </div>
          {blogForm()}
          {sortedBlogs.map(blog =>
            <Blog key={blog.id} blog={blog} increaseLikes={increaseLikes} deleteBlog={deleteBlog} currentUserId={user.id} />
          )}
        </div>
      )}
    </div>
  )
}

export default App