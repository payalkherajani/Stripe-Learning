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

app.post('/pay', async (req, res) => {
    const { email, name, address } = req.body;
    console.log({ email, name, address })

    const paymentIntent = await stripe.paymentIntents.create({
        shipping: {
            name: name,
            address: {
                line1: '510 Townsend St',
                postal_code: '98140',
                city: 'San Francisco',
                state: 'CA',
                country: 'US',
            }
        },
        amount: 1 * 100,
        currency: 'usd',
        // Verify your integration in this guide by including this parameter
        metadata: { integration_check: 'accept_a_payment' },
        description: 'Software development services',
        receipt_email: email,
    });

    console.log({ paymentIntent })

    res.json({ 'client_secret': paymentIntent['client_secret'] })
})

app.post('/sub', async (req, res) => {
    try {
        const { email, payment_method, priceId } = req.body;

        const customer = await stripe.customers.create({
            name: 'TEST',
            address: {
                line1: '510 Townsend St',
                postal_code: '98140',
                city: 'San Francisco',
                state: 'CA',
                country: 'US',
            },
            payment_method: payment_method,
            email: email,
            invoice_settings: {
                default_payment_method: payment_method,
            },
        });

        const subscription = await stripe.subscriptions.create({
            customer: customer.id,
            items: [{ price: priceId }],
            payment_behavior: 'default_incomplete',
            expand: ['latest_invoice.payment_intent'],
        });

        res.send({
            subscriptionId: subscription.id,
            clientSecret: subscription.latest_invoice.payment_intent.client_secret,
        });
    } catch (error) {
        return res.status(400).send({ error: { message: error.message } });
    }
})

const PORT = process.env.PORT || 5000

app.listen(PORT, console.log(`Server running on port ${PORT}`))