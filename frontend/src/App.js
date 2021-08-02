import logo from './logo.svg';
import './App.css';
import React, { useState } from 'react'
import StripeCheckout from 'react-stripe-checkout'

function App() {
  console.log(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY)
  const [product, setProduct] = useState({
    name: 'Basic Plan',
    price: 1
  })

  const makePayment = (token) => {
    const body = {
      token,
      product
    }
    const headers = {
      'Content-Type': 'application/json'
    }

    return fetch(`http://localhost:5000/payment`, {
      method: 'POST',
      headers,
      body: JSON.stringify(body)
    }).then((res) => console.log({ res })).catch((err) => console.log(err))
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Learning stripe
        </p>
        <StripeCheckout
          stripeKey={process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY}
          token={makePayment}
          name={`Buy Plan at $ ${product.price}`}
          amount={product.price * 100}
        />
      </header>
    </div>
  );
}

export default App;
