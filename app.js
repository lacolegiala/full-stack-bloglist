const express = require('express')
const app = express()
const cors = require('cors')
require('express-async-errors')
const blogRouter = require('./controllers/blogs')
const userRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const mongoose = require('mongoose')
const config = require('./utils/config')
const logger = require('./utils/logger')
const middleware = require('./utils/middleware')


mongoose.connect(config.MONGODB_URI, {
	user: 'sofia',
	pass: process.env.blogPassword,
	useNewUrlParser: true,
	useUnifiedTopology: true
})
	.then(() => {
		logger.info('KAIKEN PITÄISI OLLA KUNNOSSA')
	},
	err => { logger.error('ERROR RETURNED', err) }
	)
	.catch(err => {
		logger.error(`App starting error`, err.stack)
		process.exit(1)
	})

app.use(cors())
app.use(express.static('build'))
app.use(express.json())
app.use(middleware.requestLogger)

app.use('/api/blogs', blogRouter)
app.use('/api/users', userRouter)
app.use('/api/login', loginRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)


module.exports = app