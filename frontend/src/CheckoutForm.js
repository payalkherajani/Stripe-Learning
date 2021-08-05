import React, { useState, useEffect } from "react";
import {
    CardElement,
    useStripe,
    useElements
} from "@stripe/react-stripe-js";
import axios from 'axios'

export default function CheckoutForm() {

    const [succeeded, setSucceeded] = useState(false);
    const [error, setError] = useState(null);
    const [processing, setProcessing] = useState('');
    const [disabled, setDisabled] = useState(true);
    const [clientSecret, setClientSecret] = useState('');

    const [userData, setUserData] = useState({
        name: '',
        email: '',
        address: ''
    })

    const stripe = useStripe();
    const elements = useElements();

    const { name, email, address } = userData

    const cardStyle = {
        style: {
            base: {
                color: "#32325d",
                fontFamily: 'Arial, sans-serif',
                fontSmoothing: "antialiased",
                fontSize: "16px",
                "::placeholder": {
                    color: "#32325d"
                }
            },
            invalid: {
                color: "#fa755a",
                iconColor: "#fa755a"
            }
        }
    };

    const handleChange = async (event) => {
        // Listen for changes in the CardElement
        // and display any errors as the customer types their card details
        setDisabled(event.empty);
        setError(event.error ? event.error.message : "");
    };

    const handleSubmit = async ev => {
        ev.preventDefault();
        setProcessing(true);

        const res = await axios.post('http://localhost:5000/pay', { email: userData.email, name: userData.name, address: userData.address });
        const clientSecret = res.data['client_secret'];

        const payload = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
                card: elements.getElement(CardElement)
            }
        });

        if (payload.error) {
            setError(`Payment failed ${payload.error.message}`);
            setProcessing(false);
        } else {
            setError(null);
            setProcessing(false);
            setSucceeded(true);
        }
    };

    const formDataHandler = (e) => {
        const { name, value } = e.target;
        setUserData({ ...userData, [name]: value })
    }
    const handleSubmitSubscription = async (e) => {
        e.preventDefault()
        setProcessing(true);

        const result = await stripe.createPaymentMethod({
            type: 'card',
            card: elements.getElement(CardElement),
            billing_details: {
                email: email,
            },
        });
        console.log({ result })
        if (result.error) {
            console.log(result.error.message);
        } else {
            const res = await axios.post('http://localhost:5000/sub', { 'payment_method': result.paymentMethod.id, 'email': email, priceId: 'price_1JKHN5SHyZP6jAxs9IkqOUBe', name }); //Currently it is of Premium plan! This is for basic plan id 'price_1JKHLgSHyZP6jAxsO1odGaqk'
            if (res.status === 200) {
                const response = await stripe.confirmCardPayment(res.data.clientSecret)
                console.log({ response })
            } else {
                console.log("No action is required something failed")
            }
        }
    }
    return (
        <form id="payment-form" onSubmit={handleSubmit}>
            <input type="email" value={email} onChange={formDataHandler} placeholder="Email" required name="email" />
            <input type="text" value={name} onChange={formDataHandler} placeholder="Name" required name="name" />
            <input type="text" value={address} onChange={formDataHandler} placeholder="Address" required name="address" />
            <CardElement id="card-element" options={cardStyle} onChange={handleChange} />
            <button onClick={handleSubmitSubscription}>
                Subscription
            </button>
        </form>
    );
}


{/* <button
                disabled={processing || disabled || succeeded}
                id="submit"
            >
                <span id="button-text">
                    {processing ? (
                        <div className="spinner" id="spinner"></div>
                    ) : (
                        "Pay now"
                    )}
                </span>
            </button> */}
{/* Show any error that happens when processing the payment */ }
// {error && (
//     <div className="card-error" role="alert">
//         {error}
//     </div>
// )}
{/* Show a success message upon completion */ }
            // <p className={succeeded ? "result-message" : "result-message hidden"}>
            //     Payment succeeded, see the result in your
            //     <a
            //         href={`https://dashboard.stripe.com/test/payments`}
            //     >
            //         {" "}
            //         Stripe dashboard.
            //     </a> Refresh the page to pay again.
            // </p>