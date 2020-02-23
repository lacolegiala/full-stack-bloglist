const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
// const helper = require('./test_helper').default

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


beforeEach(async () => {
  await Blog.deleteMany({})
  console.log(initialBlogs, "AHAHHAHAHAHAHAH")

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
  
    // const response = await api.get('/api/blogs')
  
    // const titles = response.body.map(blog => blog.title)
  
    // expect(response.body.length).toBe(3)

    const blogsAtEnd = await blogsInDb()
    expect(blogsAtEnd.length).toBe(initialBlogs.length + 1)

    const titles = blogsAtEnd.map(blog => blog.title)

    expect(titles).toContain("OurBlog")
  })

})


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

afterAll(() => {
  mongoose.connection.close()
})