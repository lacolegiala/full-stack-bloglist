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


module.exports = {
  initialBlogs, nonExistingId, blogsInDb: blogsInDb, usersInDb: usersInDb
}