/* eslint-disable indent */
const mongoose = require('mongoose')
const supertest = require('supertest')

const helper = require('./test_helper')
const Blog = require('../models/blog')

const bcrypt = require('bcrypt')
const User = require('../models/user')

const app = require('../app')
const api = supertest(app)




beforeEach(async () => {
  await Blog.deleteMany({})
  const blogObjects=helper.initialBlogs.
    map(blog => new Blog(blog))
  const promiseArray =blogObjects. map(blog => blog.save())
  await Promise.all(promiseArray)
})

describe('when there is initially some blogs saved', () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  }, 100000)


  test('there are three blogs', async () => {
    const response = await api.get('/api/blogs')

    expect(response.body).toHaveLength(helper.initialBlogs.length)
  }, 100000)

  test('the unique identifier property of the blog posts is named id', async () => {
    const response = await api.get('/api/blogs')
    response.body.map(blog => expect(blog.id).toBeDefined())
  }, 100000)
})

describe('addition of a new blog',  () => {
  test('a valid blog can be added', async () => {
      const token=await helper.token()
      const newBlog = {
      title: 'First class tests',
      author: 'Robert C. Martin',
      url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.html',
      likes: 10,
    }


    await api
      .post('/api/blogs')
      .send(newBlog)
      .set('Authorization', `bearer ${token}`)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)


    const titles=blogsAtEnd.map(b => b.title)
    expect(titles).toContain('First class tests')
  })


  test('blog without likes can be added', async () => {
    const newBlog = {
      title: 'First class tests',
      author: 'Robert C. Martin',
      url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.html',
    }

    const token=await helper.token()
    await api
      .post('/api/blogs')
      .set('Authorization', `bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    const titles = blogsAtEnd.map(b => b.title)

    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)
    expect(titles).toContain('First class tests')
  })

})
test('blog without title and url is not added', async () => {
    const newBlog = {
      author: 'Robert C. Martin'
    }
    const token=await helper.token()

    if(  newBlog.title===undefined || newBlog.url===undefined){
      await api
        .post('/api/blogs')
        .set('Authorization', `bearer ${token}`)
        .send(newBlog)
        .expect(400)
    }

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)

  })

describe('deletion of a blog', () => {
  test('succeeds with status code 204 if id is valid', async () => {

    //Adding blog to have user set
    const newBlog = {
      title: 'First class tests',
      author: 'Robert C. Martin',
      url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.html',
      likes: 10,
    }

    const token=await helper.token()

    await api
      .post('/api/blogs')
      .send(newBlog)
      .set('Authorization', `bearer ${token}`)
      .expect(201)

    //Deleting this blog
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[3]


    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `bearer ${token}`)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd).toHaveLength(blogsAtStart.length-1)

    const titles = blogsAtEnd.map(r => r.title)
    expect(titles).not.toContain(blogToDelete.title)
  })
})

describe('update of a blog', () => {
  test('succeeds with status code 200 if id is valid', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdate = blogsAtStart[0]

    const newBlog = {
      ...blogToUpdate,
      likes: 10
    }
    const token=await helper.token()

    await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .set('Authorization', `bearer ${token}`)
      .send(newBlog)
      .expect(200)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(
      helper.initialBlogs.length
    )
    expect(blogsAtEnd[0].likes).toBe(10)
  })
})



//User Tests

describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  })

  test('creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'salainen',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)


    expect(result.body.error).toContain('username must be unique')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toEqual(usersAtStart)
  })

test('creation fails with proper statuscode and message if username is missing', async () => {
  const usersAtStart = await helper.usersInDb()

  const newUser = {
    name: 'Superuser',
    password: 'salainen',
  }

  const result = await api
    .post('/api/users')
    .send(newUser)
    .expect(400)
    .expect('Content-Type', /application\/json/)


  expect(result.body.error).toContain('username is  required')

  const usersAtEnd = await helper.usersInDb()
  expect(usersAtEnd).toEqual(usersAtStart)
})

test('creation fails with proper statuscode and message if username is too short', async () => {
  const usersAtStart = await helper.usersInDb()

  const newUser = {
    username: 'ro',
    name: 'Superuser',
    password: 'salainen',
  }

  const result = await api
    .post('/api/users')
    .send(newUser)
    .expect(400)
    .expect('Content-Type', /application\/json/)


  expect(result.body.error).toContain('minimum allowed length (3)')

  const usersAtEnd = await helper.usersInDb()
  expect(usersAtEnd).toEqual(usersAtStart)
})

test('creation fails with proper statuscode and message if password is too short', async () => {
  const usersAtStart = await helper.usersInDb()

  const newUser = {
    username: 'root1',
    name: 'Superuser',
    password: 'sa',
  }

  const result = await api
    .post('/api/users')
    .send(newUser)
    .expect(400)
    .expect('Content-Type', /application\/json/)

  expect(result.body.error).toContain('minimum allowed length (3)')

  const usersAtEnd = await helper.usersInDb()
  expect(usersAtEnd).toEqual(usersAtStart)
})



})

//Login
test('user login', async () => {
  const usersAtStart = await helper.usersInDb()

  const newUser = {
    username: 'root',
    password: 'sekret'
  }

  const result = await api
    .post('/api/login')
    .send(newUser)
    .expect(200)
    .expect('Content-Type', /application\/json/)

    expect(result.body.token).toBeDefined()

  const usersAtEnd = await helper.usersInDb()
  expect(usersAtEnd).toEqual(usersAtStart)
})


afterAll(() => {
  mongoose.connection.close()
})

//npm test -- tests/blog_api.test.js




