import { useState } from 'react'
import 'bootswatch/dist/lux/bootstrap.min.css';
import './App.css';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import handphones from './assets/handphones.jpg';
import axios from 'axios';

const stripePromise = loadStripe("#");
const CheckoutForm = () => {

  const stripe = useStripe();
  const elements = useElements();
  const [loading, setloading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: elements.getElement(CardElement)
    });

    setloading(true);

    if (!error) {
      const { id } = paymentMethod;
      const { data } = await axios.post('http://localhost:3001/api/checkout', {
        id,
        amount: 10000
      });
      console.log(data);
      elements.getElement(CardElement).clear();
    }

    setloading(false);
  }

  return (
    <div className="card bg-white text-center">
      <img src={handphones} alt="HandPhones" width="50" className="card-img-top img-fluid" />
      <h3>Price: 100$</h3>
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <CardElement className="form-control" />
          <hr />

          <button className="btn btn-block" disabled={!stripe}>
            {
              (loading) ?
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden"></span>
                </div>
                :
                "buy"
            }
          </button>
        </form>
      </div>
    </div>
  );
}

function App() {
  return (
    <>
      <Elements stripe={stripePromise}>
        <div className="container p-4">
          <div className="row">
            <div className="col-md-4 offset-md-4">
              <CheckoutForm />
            </div>
          </div>
        </div>
      </Elements>
    </>
  );
}

export default App;
