// A reference to Stripe.js
var stripe;

var orderData = {
    items: [{id: "photo-subscription"}],
    serviceId: "5debb66404395829c2b33b0b"
};

// Disable the button until we have Stripe set up on the page
document.querySelector("button").disabled = true;

fetch("/checkout/create-payment-intent", {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify(orderData)
})
    .then(function (result) {
        return result.json();
    })
    .then(function (data) {
        return setupElements(data);
    })
    .then(function ({stripe, card, clientSecret}) {
        document.querySelector("button").disabled = false;

        // Handle form submission.
        var form = document.getElementById("payment-form");
        form.addEventListener("submit", function (event) {
            event.preventDefault();
            // Initiate payment when the submit button is clicked
            pay(stripe, card, clientSecret);
        });
    });

// Set up Stripe.js and Elements to use in checkout form
var setupElements = function (data) {
    stripe = Stripe(data.publishableKey);
    var elements = stripe.elements();
    var style = {
        base: {
            color: "#32325d",
            fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
            fontSmoothing: "antialiased",
            fontSize: "16px",
            "::placeholder": {
                color: "#aab7c4"
            }
        },
        invalid: {
            color: "#fa755a",
            iconColor: "#fa755a"
        }
    };

    var card = elements.create("card", {style: style});
    card.mount("#card-element");
    const formatter = new Intl.NumberFormat(data.locale, {
        style: 'currency',
        currency: data.currency.toUpperCase(),
        minimumFractionDigits: 2
    })
    document.querySelector("#button-text").innerHTML += " " + formatter.format(data.amount / 100);

    return {
        stripe: stripe,
        card: card,
        clientSecret: data.clientSecret
    };
};

/*
 * Calls stripe.confirmCardPayment which creates a pop-up modal to
 * prompt the user to enter extra authentication details without leaving your page
 */
var pay = function (stripe, card, clientSecret) {
    changeLoadingState(true);

    // Initiate the payment.
    // If authentication is required, confirmCardPayment will automatically display a modal
    stripe
        .confirmCardPayment(clientSecret, {
            payment_method: {
                card: card
            }
        })
        .then(function (result) {
            if (result.error) {
                // Show error to your customer
                showError(result.error.message);
            } else {
                // The payment has been processed!
                orderComplete(clientSecret);
            }
        });
};

/* ------- Post-payment helpers ------- */

// /* Shows a success / error message when the payment is complete */
// // var orderComplete = (clientSecret) => {
// //     stripe.retrievePaymentIntent(clientSecret).then(function (result) {
// //         var paymentIntent = result.paymentIntent;
// //         var paymentIntentJson = JSON.stringify(paymentIntent, null, 2);
// //
// //         document.querySelector(".sr-payment-form").classList.add("hidden");
// //         // document.querySelector("pre").textContent = paymentIntentJson;
// //         document.querySelector("pre").textContent = paymentIntentJson;
// //
// //         document.querySelector(".sr-result").classList.remove("hidden");
// //         setTimeout(function () {
// //             document.querySelector(".sr-result").classList.add("expand");
// //         }, 200);
// //
// //         changeLoadingState(false);
// //     });
// // };

async function orderComplete(clientSecret) {
    try {
        let result = await stripe.retrievePaymentIntent(clientSecret);
        let paymentIntent = await result.paymentIntent;
        let paymentIntentJson = JSON.stringify(paymentIntent, null, 2);
        let _userAccountInfo = await fetch("/auth/getuserinfo");
        let user = await _userAccountInfo.json();

        let transaction = {
            "_stripeId": paymentIntent.id,
            "stripe_amount": paymentIntent.amount,
            "currency": paymentIntent.currency,
            "description": "Add here product description",
            "stripe_status": paymentIntent.status,
            "_userId": user.userAccountId,
            "_coachId": user.userAccountId, // change for actual coach's id
            "stripe_created": paymentIntent.created
        };
        let savedTransaction = await fetch("/checkout/register-transaction", {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(transaction)
        });
        await savedTransaction.json.parse();
        document.querySelector(".sr-payment-form").classList.add("hidden");
        if (savedTransaction.status === 200) {
            document.querySelector("pre").textContent = paymentIntentJson;
            // document.querySelector("pre").textContent = paymentIntentJson;

            document.querySelector(".sr-result").classList.remove("hidden");
            setTimeout(function () {
                document.querySelector(".sr-result").classList.add("expand");
            }, 200);

            changeLoadingState(false);
        }
    } catch (err) {
        console.log(err);
    }

};

var showError = function (errorMsgText) {
    changeLoadingState(false);
    var errorMsg = document.querySelector(".sr-field-error");
    errorMsg.textContent = errorMsgText;
    setTimeout(function () {
        errorMsg.textContent = "";
    }, 4000);
};

// Show a spinner on payment submission
var changeLoadingState = function (isLoading) {
    if (isLoading) {
        document.querySelector("button").disabled = true;
        document.querySelector("#spinner").classList.remove("hidden");
        document.querySelector("#button-text").classList.add("hidden");
    } else {
        document.querySelector("button").disabled = false;
        document.querySelector("#spinner").classList.add("hidden");
        document.querySelector("#button-text").classList.remove("hidden");
    }
};
