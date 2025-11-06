import React, { useState, useEffect } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useBook } from "../context/Booking";
import { useAuth } from "../context/UserContext";

const Payment = () => {
  const stripe = useStripe();
  const elements = useElements();
  const location = useLocation();
  const navigate = useNavigate();
  const [book, setBook] = useBook();
  const [auth] = useAuth();

  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState(0);
  const [products, setProducts] = useState([]);
  const [customerName, setCustomerName] = useState("");
  const [customerAddress, setCustomerAddress] = useState({
    line1: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
  });

  // Fetch products and calculate total amount
  useEffect(() => {
    if (location?.state?.products && location.state.products.length > 0) {
      setProducts(location.state.products);
      const total = location.state.products.reduce((sum, p) => sum + p.price, 0);
      setAmount(total);
    } else {
      toast.error("No products found for payment. Redirecting...");
      navigate("/cart");
    }
  }, [location, navigate]);

  // Convert country name to ISO code if needed
  const handleCountryCodeConversion = (country) => {
    const countryMapping = { India: "IN" };
    return countryMapping[country] || country;
  };

  const handlePayment = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      toast.error("Stripe not ready. Please try again.");
      return;
    }

    if (
      !customerName ||
      !customerAddress.line1 ||
      !customerAddress.city ||
      !customerAddress.country
    ) {
      toast.error("Please fill out all required fields.");
      return;
    }

    const convertedCountry = handleCountryCodeConversion(customerAddress.country);
    setLoading(true);

    try {
      // Create payment intent
      const { data } = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/booking/create-payment-intent`,
        {
          amount: amount * 100, // convert to cents
          currency: "usd",
          description: `Payment for ${products.length} product(s)`,
          customerName,
          customerAddress: { ...customerAddress, country: convertedCountry },
        }
      );

      const clientSecret = data.clientSecret;

      // Confirm payment with Stripe
      const { paymentIntent, error } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: customerName,
            address: {
              line1: customerAddress.line1,
              city: customerAddress.city,
              state: customerAddress.state,
              postal_code: customerAddress.postalCode,
              country: convertedCountry,
            },
          },
        },
      });

      if (error) {
        toast.error(`Payment failed: ${error.message}`);
        setLoading(false);
        return;
      }

      if (paymentIntent.status === "succeeded") {
        // Create booking for each product
        for (const product of products) {
          const bookingData = {
            token: auth?.user?.token,
            postId: product.postId,
            bookingDate: new Date(),
            transactionId: paymentIntent.id,
          };

          await axios.post(
            `${import.meta.env.VITE_BASE_URL}/api/booking/create-booking`,
            bookingData
          );

          // Update availability
          await axios.patch(
            `${import.meta.env.VITE_BASE_URL}/api/booking/update-availability`,
            { postId: product.postId, isAvailable: false }
          );
        }

        // Save to context and localStorage
        const updatedBooking = [
          ...book,
          ...products.map((p) => ({
            title: p.title,
            amount: p.price,
            customerName,
            postId: p.postId,
          })),
        ];

        setBook(updatedBooking);
        localStorage.setItem("booking", JSON.stringify(updatedBooking));

        toast.success("Payment and booking successful!");
        navigate("/user/your-order");
      }
    } catch (err) {
      console.error("Payment Error:", err);
      toast.error("Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6">Payment</h1>

      {/* Products Summary */}
      <div className="bg-gray-100 p-4 rounded-md mb-6 shadow-md">
        <h2 className="text-xl font-medium text-gray-800 mb-2">Products Summary</h2>
        {products.map((p, i) => (
          <div key={i} className="flex justify-between text-gray-700 mb-1">
            <span>{p.title}</span>
            <span>${p.price}</span>
          </div>
        ))}
        <hr className="my-3 border-gray-300" />
        <div className="flex justify-between font-bold text-lg text-gray-900">
          <span>Total:</span>
          <span>
            {amount.toLocaleString("en-US", { style: "currency", currency: "USD" })}
          </span>
        </div>
      </div>

      {/* Payment Form */}
      <form onSubmit={handlePayment} className="space-y-4">
        <div className="flex flex-col">
          <label className="text-gray-700 mb-2">Full Name *</label>
          <input
            type="text"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            className="p-3 border rounded-md"
            placeholder={auth.user?.name || "Enter full name"}
            required
          />
        </div>

        <div className="flex flex-col">
          <label className="text-gray-700 mb-2">Address Line 1 *</label>
          <input
            type="text"
            value={customerAddress.line1}
            onChange={(e) =>
              setCustomerAddress({ ...customerAddress, line1: e.target.value })
            }
            className="p-3 border rounded-md"
            placeholder="Enter address"
            required
          />
        </div>

        <div className="flex flex-col">
          <label className="text-gray-700 mb-2">City *</label>
          <input
            type="text"
            value={customerAddress.city}
            onChange={(e) =>
              setCustomerAddress({ ...customerAddress, city: e.target.value })
            }
            className="p-3 border rounded-md"
            required
          />
        </div>

        <div className="flex flex-col">
          <label className="text-gray-700 mb-2">State</label>
          <input
            type="text"
            value={customerAddress.state}
            onChange={(e) =>
              setCustomerAddress({ ...customerAddress, state: e.target.value })
            }
            className="p-3 border rounded-md"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-gray-700 mb-2">Postal Code</label>
          <input
            type="text"
            value={customerAddress.postalCode}
            onChange={(e) =>
              setCustomerAddress({ ...customerAddress, postalCode: e.target.value })
            }
            className="p-3 border rounded-md"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-gray-700 mb-2">Country *</label>
          <input
            type="text"
            value={customerAddress.country}
            onChange={(e) =>
              setCustomerAddress({ ...customerAddress, country: e.target.value })
            }
            className="p-3 border rounded-md"
            placeholder="Enter country"
            required
          />
        </div>

        <div className="flex flex-col">
          <label className="text-gray-700 mb-2">Card Details *</label>
          <CardElement className="p-3 border rounded-md" />
        </div>

        <button
          type="submit"
          disabled={!stripe || loading}
          className={`w-full px-6 py-3 text-white rounded-lg ${
            loading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          {loading ? "Processing..." : "Pay Now"}
        </button>
      </form>
    </div>
  );
};

export default Payment;
