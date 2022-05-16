import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import Blog from '../components/Blog'



describe('Blog list tests', () => {
  let container
  const updateBlog = jest.fn()

  beforeEach(() => {
    const blog = {
      title: 'First class tests',
      author: 'Robert C. Martin',
      url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
      likes:0,
      user:  {
        username: 'root',
        name: 'Superuser',
        password: 'salainen',
      }
    }
    container = render(<Blog blog={blog} user={null} updateBlog={updateBlog} />).container
  })

  test('the blog\'s title and author are rendered', () => {
    const title_author = container.querySelector('.title_author')
    expect(title_author).toHaveTextContent('First class tests by Robert C. Martin')
  })


  test('at start the blog\'s url and likes are not displayed', () => {
    const url = container.querySelector('.details')
    expect(url).toHaveStyle('display: none')
  })

  test('after clicking the button, url and likes are displayed', async () => {
    const user = userEvent.setup()
    const button = screen.getByText('View')
    await user.click(button)

    const div = container.querySelector('.details')
    expect(div).not.toHaveStyle('display: none')
  })

  test('if the like button is clicked twice, the update props is called twice', async () => {


    const user = userEvent.setup()
    const likeButton = screen.getByText('like')
    await user.click(likeButton)
    await user.click(likeButton)

    expect(updateBlog.mock.calls).toHaveLength(2)
  })
})



