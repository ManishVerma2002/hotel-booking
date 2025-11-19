import React, { useState } from "react";
import axios from "axios";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

const CheckoutForm = ({ total }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

 const handleSubmit = async (event) => {
  event.preventDefault();
  setLoading(true);

  if (!stripe || !elements) {
    alert("Stripe is not ready");
    setLoading(false);
    return;
  }

  try {
    // Step 1: Create Payment Intent on backend
    const response = await fetch("http://localhost:3000/api/booking/create-payment-intent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: total,
        currency: "inr",
        description: "Dream Vacation Booking",
        customerName: "Manish Kumar",
        customerAddress: {
          line1: "123 Example Street",
          city: "Delhi",
          state: "DL",
          postalCode: "110001",
          country: "IN",
        },
      }),
    });

    const data = await response.json();
    const clientSecret = data.clientSecret;

    if (!clientSecret) {
      alert("Failed to create payment intent");
      setLoading(false);
      return;
    }

    // Step 2: Confirm payment with the returned clientSecret
    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
        billing_details: { name: "Manish Kumar" },
      },
    });

    if (error) {
      console.error("Payment Error:", error);
      alert("Payment Failed: " + error.message);
    } else if (paymentIntent.status === "succeeded") {
      alert("Payment Successful!");
    }
  } catch (error) {
    console.error("Error in payment flow:", error);
    alert("Something went wrong");
  } finally {
    setLoading(false);
  }
};


  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 border rounded-lg shadow">
      <CardElement className="border p-4 rounded-lg mb-4" />
      <button
        type="submit"
        disabled={!stripe || loading}
        className={`w-full bg-blue-500 text-white px-6 py-3 rounded-lg ${
          loading ? "opacity-60" : ""
        }`}
      >
        {loading ? "Processing..." : `Pay $${total}`}
      </button>
    </form>
  );
};

export default CheckoutForm;
