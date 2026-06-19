const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// POST /payments/create-payment-intent  { amount } -> amount in the property's currency unit (e.g. BDT/USD)
const createPaymentIntent = async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).send({ message: 'A valid amount is required' });
    }

    // Stripe expects the smallest currency unit (cents)
    const amountInCents = Math.round(amount * 100);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: 'usd',
      payment_method_types: ['card'],
    });

    res.send({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.status(500).send({ message: 'Payment intent creation failed', error: error.message });
  }
};

module.exports = { createPaymentIntent };
