import { useState, useEffect,useRef } from 'react'
import Blog from './components/Blog'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'


import Notification from './components/Notification'

import blogService from './services/blogs'
import loginService from './services/login'



const App = () => {
  const blogFormRef = useRef()


  const [blogs, setBlogs] = useState([])
  const [notification, setNotification] = useState(null)
  const [user, setUser] = useState(null)




  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs.sort(function (a, b) {
        return b.likes - a.likes}) )
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

  const handleLogin = async (userInfo) => {
    try {
      const user = await loginService.login(userInfo)
      window.localStorage.setItem(
        'loggedBlogUser', JSON.stringify(user)
      )

      blogService.setToken(user.token)
      setUser(user)

    } catch (exception) {
      setNotification({ message: 'wrong password or username', type:'alert' })
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    }
  }

  const addBlog = async (newBlog) => {
    blogFormRef.current.toggleVisibility()

    try {
      await blogService.create(
        newBlog
      )
      await blogService.getAll().then(blogs =>
        setBlogs( blogs.sort(function (a, b) {
          return b.likes - a.likes})))
      setNotification({ message: `New blog : ${newBlog.title} by ${newBlog.author}`, type:'info' })
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    }catch (exception) {
      setNotification({ message: 'Fill all form add try reconnexion', type:'alert' })
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    }

  }

  const updateBlog = async (id,newBlog) => {

    try {
      await blogService.update(id,newBlog )
      await blogService.getAll().then(blogs =>
        setBlogs( blogs.sort(function (a, b) {
          return b.likes - a.likes})))
      setNotification({ message: `Blog : ${newBlog.title} is updated`, type:'info' })
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    }catch (exception) {
      setNotification({ message: 'Creator need to be connected', type:'alert' })
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    }

  }


  const deleteBlog = async (blog) => {
    if(window.confirm(`Remove blog ${blog.title} by ${blog.author}`)){

      try {
        await blogService.remove(blog.id)
        const b=await blogService.getAll()
        setBlogs(b)
        setNotification({ message: `Blog : ${blog.title} is remove`, type:'info' })
        setTimeout(() => {
          setNotification(null)
        }, 5000)
      }catch (exception) {
        setNotification({ message: 'Creator need to be connected', type:'alert' })
        setTimeout(() => {
          setNotification(null)
        }, 5000)
      }
    }

  }


  const blogForm = () => (
    <Togglable buttonLabel='New Blog' ref={blogFormRef}>
      <BlogForm addBlog={addBlog} />
    </Togglable>
  )





  return (
    <div>
      <Notification notification={notification}/>

      {user === null ?
        <LoginForm handleLogin={handleLogin}/> :
        <>
          <p>{user.name} logged-in <button onClick={handleLogout}>Logout</button></p>
          {blogForm()}
        </>

      }
      <h2>Blogs</h2>
      { blogs.map(blog =>
        <div key={blog.id}>
          <Blog blog={blog} updateBlog={updateBlog} deleteBlog={deleteBlog} user={user}>
            <div>
              {blog.url}
            </div>
          </Blog>
        </div>

      )}
    </div>
  )

}
export default App
