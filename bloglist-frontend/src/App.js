import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'

import blogService from './services/blogs'
import loginService from './services/login'



const App = () => {
  const [blogs, setBlogs] = useState([])
  const [title, setTitle] = useState('')
  const [author,setAuthor] = useState('')
  const [url, setUrl] = useState('')



  const [notification, setNotification] = useState(null)
  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogUser')
    setUser(null)

  }

  const handleLogin = async (event) => {
    event.preventDefault()
    
    try {
      const user = await loginService.login({
        username, password,
      })
      window.localStorage.setItem(
        'loggedBlogUser', JSON.stringify(user)
      ) 

      blogService.setToken(user.token)

      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setNotification({ message: 'wrong password or username', type:'alert' })
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    }
  }

  const addBlog = async (event) => {
    event.preventDefault()
    try {
      const newBlog = await blogService.create({
        'title':title,
        'author':author,
        'url':url
      }) 
      setBlogs(blogs.concat(newBlog))
      setNotification({ message: `New blog : ${title} by ${author}`, type:'info' })
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    }catch (exception) {
      setNotification({ message: 'error', type:'alert' })
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    }

  }
  

    const loginForm = () => (
      <><div>
        Log into  application
      </div><form onSubmit={handleLogin}>
          <div>
            username
            <input
              type="text"
              value={username}
              name="Username"
              onChange={({ target }) => setUsername(target.value)} />
          </div>
          <div>
            password
            <input
              type="password"
              value={password}
              name="Password"
              onChange={({ target }) => setPassword(target.value)} />
          </div>
          <button type="submit">login</button>
        </form></>      
    )
  
    const blogForm = () => (
      <>
        <p>{user.name} logged-in <button onClick={handleLogout}>Logout1</button></p>

      
      <form onSubmit={addBlog}>
          <table>
            <tbody>
              <tr>
                <td>Title:</td>
                <td>  <input
                  type="text"
                  value={title}
                  name="Title"
                  onChange={({ target }) => setTitle(target.value)} />
                </td>
              </tr>

              <tr>
                <td>Author:</td>
                <td>  <input
                  type="text"
                  value={author}
                  name="Author"
                  onChange={({ target }) => setAuthor(target.value)} />
                </td>
              </tr>

              <tr>
                <td>Url: </td>
                <td>  <input
                  type="text"
                  value={url}
                  name="Url"
                  onChange={({ target }) => setUrl(target.value)} />
                </td>
              </tr>



            </tbody>
          </table>
          <button type="submit">Create</button>
        </form></>  
    )

  return (
    
    <div>
    <Notification notification={notification}/>

     {user === null ?
      loginForm() :
      blogForm()
      }
      <h2>blogs</h2>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )

  }
export default App
