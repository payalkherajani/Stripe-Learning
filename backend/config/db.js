require('dotenv').config()
const mongoose = require('mongoose')

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            useUnifiedTopology: true,
            useCreateIndex: true,
            useNewUrlParser: true,
            useFindAndModify: false,
        })
        console.log(`MongoDB connected ${conn.connection.host}`)
    } catch (err) {
        console.log(`Error ${error.message}`)
        process.exit(1)
    }
}

module.exports = connectDB