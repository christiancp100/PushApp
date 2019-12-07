/** @module root/router */
'use strict';

require("dotenv").config({path: "../.env"});
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

router.use(
    express.json({
        // We need the raw body to verify webhook signatures.
        // Let's compute it only when hitting the Stripe webhook endpoint.
        verify: function (req, res, buf) {
            if (req.originalUrl.startsWith("/webhook")) {
                req.rawBody = buf.toString();
            }
        }
    })
);

const calculateOrderAmount = items => {
    // Replace this constant with a calculation of the order's amount
    // Calculate the order total on the client to prevent
    // people from directly manipulating the amount on the server
    return 14000;
};

router.post("/create-payment-intent", async (req, res) => {
    const {items, currency} = req.body;
    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
        amount: calculateOrderAmount(items),
        currency: currency
    });

    // Send publishable key and PaymentIntent details to server
    res.send({
        publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
        clientSecret: paymentIntent.client_secret
    });
});

// Expose a endpoint as a webhook handler for asynchronous events.
// Configure your webhook in the stripe developer dashboard
// https://dashboard.stripe.com/test/webhooks
router.post("/webhook", async (req, res) => {
    let data, eventType;

    // Check if webhook signing is configured.
    if (process.env.STRIPE_WEBHOOK_SECRET) {
        // Retrieve the event by verifying the signature using the raw body and secret.
        let event;
        let signature = req.headers["stripe-signature"];
        try {
            event = stripe.webhooks.constructEvent(
                req.rawBody,
                signature,
                process.env.STRIPE_WEBHOOK_SECRET
            );
        } catch (err) {
            console.log(`⚠️  Webhook signature verification failed.`);
            return res.sendStatus(400);
        }
        data = event.data;
        eventType = event.type;
    } else {
        // Webhook signing is recommended, but if the secret is not configured in `config.js`,
        // we can retrieve the event data directly from the request body.
        data = req.body.data;
        eventType = req.body.type;
    }

    if (eventType === "payment_intent.succeeded") {
        // Funds have been captured
        // Fulfill any orders, e-mail receipts, etc
        // To cancel the checkout after capture you will need to issue a Refund (https://stripe.com/docs/api/refunds)
        console.log("💰 Payment captured!");
    } else if (eventType === "payment_intent.payment_failed") {
        console.log("❌ Payment failed.");
    }
    res.sendStatus(200);
});

module.exports = router;
