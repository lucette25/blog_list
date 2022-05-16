import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import BlogForm from '../components/BlogForm'

test('<BlogForm /> updates parent state and calls onSubmit', async () => {
  const addBlog = jest.fn()
  const user = userEvent.setup()

  render(<BlogForm addBlog={addBlog} />)
  const sendButton = screen.getByText('Create')

  const title = screen.getByPlaceholderText('write here blog title')
  await user.type(title, 'testing a form...' )

  const author = screen.getByPlaceholderText('write here blog author')
  await user.type(author, 'author' )

  const url = screen.getByPlaceholderText('write here blog url')
  await user.type(url, 'url' )
  await user.click(sendButton)



  expect(addBlog.mock.calls).toHaveLength(1)
  expect(addBlog.mock.calls[0][0].title).toBe('testing a form...' )
  expect(addBlog.mock.calls[0][0].author).toBe('author' )

  /*const inputs = screen.getAllByRole('textbox')
  await user.type(inputs[0], 'testing a form...' )

  await user.type(inputs[1], 'author' )
  await user.type(inputs[2], 'url' )*/

})