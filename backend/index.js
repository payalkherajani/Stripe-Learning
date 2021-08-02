const express = require('express')
const cors = require('cors')
const { v4: uuidv4 } = require('uuid');
const app = express()
const connectDB = require('./config/db')
const dotenv = require('dotenv')
dotenv.config()
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

app.use(cors())
connectDB()
app.use(express.json())

app.get('/', (req, res) => {
    res.send("Hello World")
})

app.post('/payment', (req, res) => {
    const { product, token } = req.body;
    console.log("PRODUCT", product);
    const idempontencyKey = uuidv4()
    return stripe.customers.create({
        email: token.email,
        source: token.id
    }).then(customer => {
        stripe.charges.create({
            amount: product.price * 100,
            currency: 'usd',
            customer: customer.id,
            receipt_email: token.email,
            description: product.name
        }, { idempontencyKey })
    }).then((result) => res.status(200).json(result)).catch((err) => console.log(err))
})

const PORT = process.env.PORT || 5000

app.listen(PORT, console.log(`Server running on port ${PORT}`))