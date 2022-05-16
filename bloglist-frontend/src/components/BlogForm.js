import { useState } from 'react'

const BlogForm = ({ addBlog }) => {
  const [title, setTitle] = useState('')
  const [author,setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const createBlog =  (event) => {
    event.preventDefault()
    addBlog({
      'title':title,
      'author':author,
      'url':url
    })
    setTitle('')
    setAuthor('')
    setUrl('')


  }


  return(
    <>
      <h2>Create a new Blog</h2>


      <form onSubmit={createBlog}>
        <table>
          <tbody>
            <tr>
              <td>Title:</td>
              <td>  <input
                type="text"
                value={title}
                id='title'
                name="Title"
                placeholder='write here blog title'

                onChange={({ target }) =>  setTitle(target.value)} />
              </td>
            </tr>

            <tr>
              <td>Author:</td>
              <td>  <input
                type="text"
                value={author}
                placeholder='write here blog author'
                id='author'
                name="Author"
                onChange={({ target }) =>  setAuthor(target.value)} />
              </td>
            </tr>

            <tr>
              <td>Url: </td>
              <td>  <input
                type="text"
                value={url}
                placeholder='write here blog url'
                id='url'
                name="Url"
                onChange={({ target }) =>  setUrl(target.value)} />
              </td>
            </tr>
          </tbody>
        </table>
        <button type="submit" id='create-button'>Create</button>
      </form></>
  )
}



export default BlogForm