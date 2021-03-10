const express = require('express');
const Stripe = require("stripe");
const cors = require('cors');

const app = express();
const stripe = new Stripe("#");
app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());
app.post('/api/checkout', async (req, res) => {
    try {
        const payment = await stripe.paymentIntents.create({
            amount: req.body.amount,
            currency: "USD",
            description: "Gaming handphones",
            payment_method: req.body.id,
            confirm: true
        });
        res.send({ message: "Succesfull payment." })
    } catch (error) {
        res.json({ message: error.raw.message });
    }
});
app.listen(3001);