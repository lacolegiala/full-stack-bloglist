const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
// const helper = require('./test_helper').default

const api = supertest(app)
const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
  {
    title: "MyBlog",
    author: "Me",
    url: "myblog.com",
    likes: 123
  },
  {
    title: "YourBlog",
    author: "You",
    url: "yourblog.com",
    likes: 128
  }
]

const nonExistingId = async () => {
  const blog = new Blog({ title: 'willremovethissoon' })
  await blog.save()
  await blog.remove()

  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(user => user.toJSON())
}


beforeEach(async () => {
  await Blog.deleteMany({})

  let blogObject = new Blog(initialBlogs[0])
  await blogObject.save()

  blogObject = new Blog(initialBlogs[1])
  await blogObject.save()
})

describe('get blog data', () => {
  test('app returns the correct number of json blogs', async () => {
    const response = await api
      .get('/api/blogs').expect(200)
      .expect('Content-Type', /application\/json/);
    const res = response.body;
    expect(res.length).toBe(initialBlogs.length)
  })

  test('a specific blog can be viewed', async () => {
    const blogsAtStart = await blogsInDb()
  
    const blogToView = blogsAtStart[0]
  
    const resultBlog = await api
      .get(`/api/blogs/${blogToView.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)
  
    expect(resultBlog.body).toEqual(blogToView)
  })
  
})

describe('post blogs', () => {
  test('a valid blog can be added ', async () => {
    const newBlog = {
      title: "OurBlog",
      author: "Us",
      url: "ourblog.com",
      likes: 45
    }
  
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)
  

    const blogsAtEnd = await blogsInDb()
    expect(blogsAtEnd.length).toBe(initialBlogs.length + 1)

    const titles = blogsAtEnd.map(blog => blog.title)

    expect(titles).toContain("OurBlog")
  })

})

describe('delete blogs', () => {
  test('a blog can be deleted', async () => {
    const blogsAtStart = await blogsInDb()
    const blogToDelete = blogsAtStart[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .expect(204)

    const blogsAtEnd = await blogsInDb()

    expect(blogsAtEnd.length).toBe(
      initialBlogs.length - 1
    )

    const titles = blogsAtEnd.map(blog => blog.title)

    expect(titles).not.toContain(blogToDelete.title)
  })
})

describe('when there is initially one user at db', () => {
  beforeEach(async () => {
    await User.deleteMany({})
    const user = new User({ username: 'root', password: 'sekret' })
    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await usersInDb()

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

    const usersAtEnd = await usersInDb()
    expect(usersAtEnd.length).toBe(usersAtStart.length + 1)

    const usernames = usersAtEnd.map(user => user.username)
    expect(usernames).toContain(newUser.username)
  })
})

afterAll(() => {
  mongoose.connection.close()
})