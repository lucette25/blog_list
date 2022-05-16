import { useState } from 'react'

const LoginForm = ({ handleLogin }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit =  (event) => {
    event.preventDefault()
    handleLogin({
      username,password
    })
    setUsername('')
    setPassword('')
  }
  return(
    <><h2>
        Log into  application
    </h2>
    <form onSubmit={handleSubmit}>
      <div>
            username
        <input
          id='username'

          type="text"
          name="Username"
          onChange={({ target }) =>  setUsername(target.value)} />
      </div>
      <div>
            password
        <input
          id='password'

          type="password"
          name="Password"
          onChange={({ target }) =>  setPassword(target.value)} />
      </div>
      <button id="login-button" type="submit">login</button>
    </form></>
  )
}

export default LoginForm