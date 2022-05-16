/* eslint-disable indent */
import { useState }  from 'react'

const Blog = (props) => {
  const [visible, setVisible] = useState(false)


  const [buttonText, setButtonText] = useState('View')
  let showDelete2=false


  if(props.user!==null){
    if(props.blog.user.username===props.user.username){
      showDelete2=true
    }else{
      showDelete2=false
    }

  }else{
    showDelete2=false

  }
  const showDelete = { display: showDelete2 ? '' : 'none' }







  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
    buttonText === 'View'?setButtonText('Hide'):setButtonText('View')
  }

  const addLike = () => {
    props.updateBlog(props.blog.id,{
      'user' :props.blog.user.id,
      'likes': props.blog.likes+1,
      'author': props.blog.author,
      'title': props.blog.title,
      'url': props.blog.url
    })
  }



  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }
  return (

    <>
      <div style={blogStyle}>
      <span className='title_author'>

          {props.blog.title} by {props.blog.author}<button onClick={toggleVisibility} >{buttonText}</button>
        </span>

        <div style={showWhenVisible} className='details'>
          <table>
            <tbody>
              <tr>
                <td >Url:</td>
                <td >
                  {props.blog.url}
                </td>
              </tr>

              <tr>
                <td>Likes:</td>
                <td className='.likes'>
                  {props.blog.likes}
                  <button onClick={addLike} id='like'>like</button>
                </td>

              </tr>

              <tr>
                <td>User : </td>
                <td>
                  {props.blog.user.name}
                </td>
              </tr>
            </tbody>
          </table>
          <button style={showDelete} onClick={() => props.deleteBlog(props.blog)}>Delete</button>
        </div>

      </div></>
  )


}

export default Blog