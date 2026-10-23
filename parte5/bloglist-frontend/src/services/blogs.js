import axios from 'axios'
const baseURL = '/api/blogs'

let token

const setToken = (newToken) => {
  token = `Bearer ${newToken}`
}

const getAll = () => {
  const request = axios.get(baseURL)
  return request.then(response => response.data)
}

const create = (newBlog) => {
  const config = {
    headers: { Authorization: token }
  }

  const request = axios.post(baseURL, newBlog, config)
  return request.then(response => response.data)
}

const update = (id, blog) => {
  const request = axios.put(`${baseURL}/${id}`, blog)
  return request.then(response => response.data)
}

const deleteBlog = (id) => {
  const config = {
    headers: { Authorization: token }
  }

  const request = axios.delete(`${baseURL}/${id}`, config)
  return request.then(response => response.data)
}

export default { getAll, create, setToken, update, deleteBlog }