const blogsRouter = require('express').Router()
const middleware = require('../utils/middleware')
const Blog = require('../models/blog')


blogsRouter.get('/', async (request, response) => {
  const  blogs= await Blog.find({}).populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

blogsRouter.post('/', middleware.userExtractor, async(request, response) => {
  const body=request.body
  const user = request.user


  const blog = new Blog({
    title:body.title,
    author: body.author,
    url : body.url,
    likes: body.likes===undefined?0:body.likes,
    user:user._id
  })

  const savedBlog = await blog.save()

  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.status(201).json(savedBlog)
})



blogsRouter.delete('/:id', middleware.userExtractor, async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  const user = request.user
  console.log('1',user.id)
  console.log('2',blog.user)

  if(user.id.toString()===blog.user.toString()){
    await Blog.findByIdAndRemove(request.params.id)
    response.status(204).end()
  }else{
    response.status(404).json({ error: 'user not authorized' })
  }
})

blogsRouter.put('/:id', async (request, response) => {
  const blog = request.body
  if(!request.token) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }
  const updatedBlog = await Blog
    .findByIdAndUpdate(
      request.params.id,
      blog,
      { new: true, runValidators: true, context: 'query' }
    )

  response.status(200).json(updatedBlog)
})

module.exports = blogsRouter