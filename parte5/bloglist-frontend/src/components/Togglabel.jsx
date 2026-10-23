import { useState } from 'react'

const Togglabel = (props) => {
  const [visible, setVisible] = useState(false)

  const hideButtonWhenVisible = { display: visible ? 'none' : '' }
  const showFormWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  return (
    <div>
      <div style={hideButtonWhenVisible}>
        <button onClick={toggleVisibility}>create new blog</button>
      </div>
      <div style={showFormWhenVisible}>
        {props.children}
        <button onClick={toggleVisibility}>cancel</button>
      </div>
    </div>
  )
}

export default Togglabel