const express = require('express')
const cors = require('cors')
const app = express()
const connectDB = require('./config/db')
const dotenv = require('dotenv')
dotenv.config()

app.use(cors())
connectDB()
app.use(express.json())

app.get('/', (req, res) => {
    res.send("Hello World")
})

const PORT = process.env.PORT || 5000

app.listen(PORT, console.log(`Server running on port ${PORT}`))