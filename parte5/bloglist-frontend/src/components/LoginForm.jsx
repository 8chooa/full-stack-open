const LoginForm = ({ username, setUsername, password, setPassword, handleSubmit, notification }) => {
  return (
    <div>
      <h2>log in to application</h2>
      {notification.message !== '' && ( <div style={notification.styles}>{notification.message}</div> )}
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            username
            <input type="text" value={username} onChange={(event) => setUsername(event.target.value)} />
          </label>
        </div>
        <div>
          <label>
            password
            <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
          </label>
        </div>
        <button type="submit">login</button>
      </form>
    </div>
  )
}

export default LoginForm