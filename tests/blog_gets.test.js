const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)
const Blog = require('../models/blog')

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
  },
]

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
  
    const response = await api.get('/api/blogs')
  
    const titles = response.body.map(blog => blog.title)
  
    expect(response.body.length).toBe(3)
    expect(titles).toContain("OurBlog")
  })

})

afterAll(() => {
  mongoose.connection.close()
})