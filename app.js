const express = require('express')
const app = express()
const cors = require('cors')
const blogRouter = require('./controllers/blogs')
const mongoose = require('mongoose')

// logger.info('connecting to', config.MONGODB_URI)

// mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => {
//     logger.info('connected to MongoDB')
//   })
//   .catch((error) => {
//     logger.error('error connection to MongoDB:', error.message)
//   })

const password = process.env.blogPassword

const mongoUrl = `mongodb+srv://sofia:${password}@cluster0-zqlrn.mongodb.net/bloglist?retryWrites=true&w=majority`
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true})


app.use(cors())
app.use(express.json())

app.use('/api/blogs', blogRouter)


module.exports = app