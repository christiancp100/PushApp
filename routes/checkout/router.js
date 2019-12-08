/** @module root/router */
'use strict';

require('../../models/UserAccount.js');
require('../../models/Service.js');
require("dotenv").config({path: "../.env"});
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Service = mongoose.model('Service');
const Transaction = mongoose.model('Transaction');

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

const getServiceData = async (request) => {
    try {
        let serviceFound = await Service.findById(request.serviceId);
        return serviceFound;
    } catch (err) {
        console.log(err);
    }
};

function getClientCurrency() {
    return {locale: "en-CH", currency: "chf"};
}

router.post("/create-payment-intent", async (req, res) => {
    let request = getRequest(req);
    let service = await getServiceData(request);
    let amount = await service.fee * 100;
    let locale = getClientCurrency().locale;
    let currency = getClientCurrency().currency;

    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
        amount: amount,
        currency: currency
    });

    // Send publishable key and PaymentIntent details to server
    res.send({
        publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
        clientSecret: paymentIntent.client_secret,
        amount: amount,
        locale: locale,
        currency: currency,
        description: "custom desc",
        statement_descriptor: "PushApp " + service.duration + "-month coaching membership",
        receipt_email: "erickgarro@gmail.com"
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

router.post("/register-transaction", async (req, res) => {
        try {
            if (req.get('Content-Type') === "application/json" && req.accepts("application/json") === "application/json" && req.body !== undefined) {
                console.log('Creating new users...');
                let transaction = new Transaction({
                    _stripeId: req.body.id,
                    stripe_amount: req.body.amount,
                    currency: req.body.currency,
                    description: req.body.description,
                    stripe_status: req.body.status,
                    _userId: req.body._userId,
                    _coachId: req.body._coachId,
                    stripe_created: req.body.created
                });
                let savedTransaction = await transaction.save();

                if (req.accepts("text/html")) {
                    res = setResponse('json', 200, res);
                    // res.render('register_forms/register-credentials.dust', {accID : (savedUserAccount._id).toString()});
                } else if (req.accepts("application/json")) {
                    res = setResponse('json', 200, res);
                }
                res.end();
            } else {
                res = setResponse('json', 400, res, {Error: "Only application/json 'Accept' and 'Content-Type' is allowed."});
                res.end();
            }
        } catch
            (err) {
            console.log(err);
            res.status(500).end();
        }
    }
);

function getRequest(req) {
    let request;
    if (Object.keys(req.body).length > 0) {
        request = req.body;
    } else if (Object.keys(req.query).length > 0) {
        request = req.query;
    } else if (Object.keys(req.params).length > 0) {
        request = req.params;
    }
    return request;
}

module.exports = router;
