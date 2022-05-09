const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (request, response) => {
  const  users= await User.find({}).populate('blogs', { title: 1, author: 1,url:1,likes:1 })
  response.json(users)
})

usersRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body

  const existingUser = await User.findOne({ username })
  if (existingUser) {
    return response.status(400).json({
      error: 'username must be unique'
    })
  }
  if (password === undefined) {
    return response.status(400).json({ error: 'password is missing' })
  }
  if (password.length < 3) {
    return response.status(400).json({ error: `password (${password}) is shorter than the minimum allowed length (3).` })
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    name,
    passwordHash
  })

  const savedUser = await user.save()

  response.status(201).json(savedUser)
})

usersRouter.put('/:id', async (request, response) => {
  const blog = request.body
  /*const user = new User({
    username,
    name,
    passwordHash
  })*/
/**
 {
       "title": "React patterns1220",
    "author": "Michael Chan",
    "url": "https://reactpatterns.com/",
    "userId":"627798745202df8e2a063a30"

}
 */

  const updatedBlog = await User
    .findByIdAndUpdate(
      request.params.id,
      blog,
      { new: true, runValidators: true, context: 'query' }
    )

  response.status(200).json(updatedBlog)
})


module.exports = usersRouter