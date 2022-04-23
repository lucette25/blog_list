require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const Blog = require('./models/blog')


app.use(express.json())
//app.use(express.static('build'))


morgan.token('postData', (request) => {
  if (request.method === 'POST')
    return  JSON.stringify(request.body)
})
app.use(
  morgan(
    ':method :url :status :res[content-length] - :response-time ms :postData'
  )
)

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})



  app.get('/api/blogs', (request, response) => {
    Blog
      .find({})
      .then(blogs => {
        response.json(blogs)
      })
  })
  
  app.post('/api/blogs', (request, response) => {
    const blog = new Blog(request.body)
  
    blog
      .save()
      .then(result => {
        response.status(201).json(result)
      })
  })
  
  const PORT = process.env.PORT
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })