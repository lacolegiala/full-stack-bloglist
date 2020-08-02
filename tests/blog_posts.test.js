const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const bcrypt = require('bcryptjs')

const api = supertest(app)
const Blog = require('../models/blog')
const User = require('../models/user')
const { request } = require('../app')


beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
})


describe('post blogs', () => {
    
    test('a valid blog can be added ', async () => {
    await User.deleteMany({})
    const saltRounds = 10
    const passwordHash = await bcrypt.hash('sekret', saltRounds)
    const user = new User({ username: 'root', name: 'nakke03', passwordHash })
    await user.save()

    const userData = {
      username: 'root',
      password: 'sekret'
    }

    let thisToken = null

    await api
      .post('/api/login')
      .send(userData)
      .expect(200)
      .expect(response => {
        thisToken = response.body.token
      })
      

    const newBlog = {
      title: "OurBlog",
      author: "Us",
      url: "ourblog.com",
      likes: 45
    }

    await api
      .post('/api/blogs')
      .set('Authorization', 'bearer ' + thisToken)
      .send(newBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/)
  
    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

    const titles = blogsAtEnd.map(blog => blog.title)

    expect(titles).toContain("OurBlog")
  })

})


describe('when there is initially one user at db', () => {
  beforeEach(async () => {
    await User.deleteMany({})
    const user = new User({ username: 'root', password: 'sekret' })
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
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd.length).toBe(usersAtStart.length + 1)

    const usernames = usersAtEnd.map(user => user.username)
    expect(usernames).toContain(newUser.username)
  })
})

afterAll(() => {
  mongoose.connection.close()
})