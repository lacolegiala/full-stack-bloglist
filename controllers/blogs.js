const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const config = require('../utils/config')

const jwt = require('jsonwebtoken')

const getTokenFrom = request => {
	const authorization = request.get('authorization')
	if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
		return authorization.substring(7)
	}
	return null
}

blogRouter.get('/', async (request, response) => {
	const blogs = await Blog
		.find({}).populate('user')
	response.json(blogs.map(blog => blog.toJSON()))
})



blogRouter.post('/', async (request, response) => {
	const body = request.body

	const token = getTokenFrom(request)
  

	const decodedToken = jwt.verify(token, config.SECRET)
	if (!token || !decodedToken.id) {
		return response.status(401).json({ error: 'token missing or invalid' })
  }
  
  
	const user = await User.findById(decodedToken.id)

	const blog = new Blog({
		title: body.title,
		author: body.author,
		url: body.url,
		likes: body.likes,
		user: user._id
	})

	const savedBlog = await blog.save()
	user.blogs = user.blogs.concat(savedBlog._id)
	await user.save()

	response.json(savedBlog.toJSON())
})

blogRouter.get('/:id', async (request, response) => {
	const blog = await Blog.findById(request.params.id)
	if (blog) {
		response.json(blog.toJSON())
	} else {
		response.status(404).end()
	}
})

blogRouter.delete('/:id', async (request, response) => {
	await Blog.findByIdAndRemove(request.params.id)
	response.status(204).end()
})

blogRouter.put('/:id', async (request, response) => {
	const body = request.body
	if (body.title === undefined || body.author === undefined || body.likes === undefined) {
		return response.status(400).json('Data missing')
	}


	const blog = {
		title: body.title,
		author: body.author,
		likes: body.likes,
		url: body.url
	}

	const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true }).populate('user')
	response.json(updatedBlog)
	
})

module.exports = blogRouter
