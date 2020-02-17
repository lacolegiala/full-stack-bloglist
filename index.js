const http = require('http')
const app = require('./app')

const server = http.createServer(app)

// app.use(cors())
// app.use(express.json())

// app.use('/api/blogs', blogsRouter)



const PORT = 3003
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})