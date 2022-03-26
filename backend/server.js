// Backend web framework -- Express
const express = require('express')
// Allows to have environment variables -- dotenv
const dotenv = require('dotenv').config()
const port = process.env.port || 5000
const { errorHandler } = require('./middleware/errorMiddleware')

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use('/api/goals', require('./routes/goalRoutes')
)

app.use(errorHandler)



app.listen(port, () => console.log(`Server started on port ${port}`))