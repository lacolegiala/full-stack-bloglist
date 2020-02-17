const express = require('express')
const app = express()
const cors = require('cors')
const blogRouter = require('./controllers/blogs')
const mongoose = require('mongoose')

const password = process.env.blogPassword
console.log(process.env.blogPassword)

const mongoUrl = `mongodb+srv://@cluster0-zqlrn.mongodb.net/bloglist?retryWrites=true&w=majority`
mongoose.connect(mongoUrl, { user: 'sofia', pass: process.env.blogPassword, useNewUrlParser: true, useUnifiedTopology: true})
.then(() => { console.log('KAIKEN PITÄISI OLLA KUNNOSSA')},
  err => { console.log('ERROR RETURNED', err) }
)
.catch(err => {
  console.error(`App starting error: pw ${process.env.blogPassword}`, err.stack);
  process.exit(1);
})

console.log('APP USE TULOSSA')

app.use(cors())
app.use(express.json())

app.use('/api/blogs', blogRouter)


module.exports = app