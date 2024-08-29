"use client";
import { useState } from "react";
import { useStripe, useElements, CardElement, Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useRouter } from "next/navigation";
import axios from "axios";

const PublishKey: any = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
const stripePromise = loadStripe("pk_test_51PsOVmL4IiDbdkzaBr4xPVLcvM8M3SxqD4jTwg5uABOYfYRMjqawQmbENHAwCMQ4Rc5OuXLCUZpGq3zWXLvszBjC00iEuOuRju");

const Transfer = () => {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState('');
  const [formData, setFormData]: any = useState({
    SubsEmail: "",
    CustomerName: "",
  });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess('');

    const cardElement = elements.getElement(CardElement);

    if (cardElement) {
      const { error, paymentMethod }: any = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
      });

      if (error) {
        setError(error.message);
        setLoading(false);
      } else {
        // Call the backend API to create a Stripe customer
        try {
          const response = await axios.post('/api/create-stripe-customer', {
            name: formData.CustomerName,
            email: formData.SubsEmail,
            paymentMethodId: paymentMethod.id,
          });

          // if (response.data.customer) {
          //   const response2 = await axios.post('/api/create-payment-customer', {
          //     name: formData.CustomerName,
          //     email: formData.SubsEmail,
          //     paymentMethodId: paymentMethod.id,
          //     customer : response.data.customer
          //   })
          // }
          console.log('Payment Method:', paymentMethod);
          console.log('Stripe Customer Created:', response.data.customer);
          // setSuccess('Payment successful! Please check your email for confirmation.');
        } catch (apiError: any) {
          setError(apiError.response?.data?.error || 'An unexpected error occurred');
        } finally {
          setLoading(false);
        }
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-2xl font-bold mb-4 text-center">Create Customer & Payment</h2>
      {success && <div className="bg-green-100 text-green-700 p-2 rounded mb-4">{success}</div>}
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700"
        >
          Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          onChange={(e) =>
            setFormData({ ...formData, CustomerName: e.target.value })
          }
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          required
        />
      </div>

      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700"
        >
          Email
        </label>
        <input
          type="email"
          id="email"
          onChange={(e) =>
            setFormData({ ...formData, SubsEmail: e.target.value })
          }
          name="email"
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          required
        />
      </div>

      <div>
        <label
          htmlFor="card"
          className="block text-sm font-medium text-gray-700"
        >
          Card Information
        </label>
        <CardElement
          id="card"
          className="mt-1 block w-full p-3 border border-gray-300 rounded-md"
        />
      </div>
      {error && <div className="text-red-500 text-sm">{error}</div>}
      <button
        type="submit"
        className={`w-full py-2 px-4 bg-blue-600 text-white rounded-md ${loading ? 'opacity-50' : ''}`}
        disabled={!stripe || loading}
      >
        {loading ? 'Processing...' : 'Create Customer'}
      </button>

    </form>
  );
};

const TransferPage = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-100">
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-4xl w-full md:flex">
      <div className="md:w-1/2 mx-auto p-4">
        <Elements stripe={stripePromise}>
          <Transfer />
        </Elements>
      </div>
    </div>
  </div>
);

export default TransferPage;