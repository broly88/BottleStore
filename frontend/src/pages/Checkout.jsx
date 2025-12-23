import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import toast from 'react-hot-toast';
import { FiLock } from 'react-icons/fi';
import { getCart, clearCart } from '../redux/slices/cartSlice';
import paymentService from '../services/paymentService';
import Button from '../components/common/Button';
import { formatCurrency } from '../utils/formatters';
import { PROVINCES, VAT_RATE } from '../utils/constants';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      fontSize: '16px',
      color: '#424770',
      '::placeholder': {
        color: '#aab7c4',
      },
    },
    invalid: {
      color: '#9e2146',
    },
  },
};

const CheckoutForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const stripe = useStripe();
  const elements = useElements();

  const { items, total } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);

  const [loading, setLoading] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState({
    streetAddress: '',
    suburb: '',
    city: '',
    province: 'Gauteng',
    postalCode: '',
  });
  const [deliveryInstructions, setDeliveryInstructions] = useState('');
  const [deliveryFee] = useState(50); // Fixed delivery fee
  const [ageConfirmed, setAgeConfirmed] = useState(false);

  const vatAmount = total * VAT_RATE;
  const grandTotal = total + deliveryFee;

  const handleAddressChange = (e) => {
    setDeliveryAddress({
      ...deliveryAddress,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    if (!ageConfirmed) {
      toast.error('Please confirm you are 18 or older');
      return;
    }

    if (!user?.ageVerified) {
      toast.error('Age verification required');
      return;
    }

    setLoading(true);

    try {
      const { clientSecret, orderId } = await paymentService.createPaymentIntent({
        deliveryAddress,
        deliveryInstructions,
        deliveryFee,
      });

      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      if (error) {
        toast.error(error.message);
      } else if (paymentIntent.status === 'succeeded') {
        toast.success('Payment successful!');
        dispatch(clearCart());
        navigate(`/order-confirmation/${orderId}`);
      }
    } catch (error) {
      toast.error(error.message || 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  if (!items || items.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Delivery Address</h2>

        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Street Address *
            </label>
            <input
              type="text"
              name="streetAddress"
              value={deliveryAddress.streetAddress}
              onChange={handleAddressChange}
              required
              className="input"
              placeholder="123 Main Street"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Suburb
              </label>
              <input
                type="text"
                name="suburb"
                value={deliveryAddress.suburb}
                onChange={handleAddressChange}
                className="input"
                placeholder="Sandton"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                City *
              </label>
              <input
                type="text"
                name="city"
                value={deliveryAddress.city}
                onChange={handleAddressChange}
                required
                className="input"
                placeholder="Johannesburg"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Province *
              </label>
              <select
                name="province"
                value={deliveryAddress.province}
                onChange={handleAddressChange}
                required
                className="input"
              >
                {PROVINCES.map((province) => (
                  <option key={province} value={province}>
                    {province}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Postal Code *
              </label>
              <input
                type="text"
                name="postalCode"
                value={deliveryAddress.postalCode}
                onChange={handleAddressChange}
                required
                pattern="[0-9]{4}"
                className="input"
                placeholder="2196"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Delivery Instructions (Optional)
            </label>
            <textarea
              value={deliveryInstructions}
              onChange={(e) => setDeliveryInstructions(e.target.value)}
              rows="3"
              className="input"
              placeholder="Leave at gate, ring doorbell, etc."
            ></textarea>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Payment Information</h2>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Card Details
          </label>
          <div className="border border-gray-300 rounded-lg p-4 bg-white">
            <CardElement options={CARD_ELEMENT_OPTIONS} />
          </div>
        </div>

        <div className="flex items-center text-sm text-gray-600">
          <FiLock className="mr-2" />
          <span>Your payment information is secure and encrypted</span>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>

        <div className="space-y-2 mb-4">
          {items.map((item) => (
            <div key={item.id} className="flex justify-between text-sm">
              <span className="text-gray-600">
                {item.product.name} × {item.quantity}
              </span>
              <span className="text-gray-900">
                {formatCurrency(item.product.price * item.quantity)}
              </span>
            </div>
          ))}
        </div>

        <div className="border-t pt-4 space-y-2">
          <div className="flex justify-between text-gray-600">
            <span>Subtotal (incl. VAT)</span>
            <span>{formatCurrency(total)}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Delivery Fee</span>
            <span>{formatCurrency(deliveryFee)}</span>
          </div>
          <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t">
            <span>Total</span>
            <span>{formatCurrency(grandTotal)}</span>
          </div>
        </div>
      </div>

      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
        <div className="flex items-start">
          <input
            id="ageConfirm"
            type="checkbox"
            checked={ageConfirmed}
            onChange={(e) => setAgeConfirmed(e.target.checked)}
            className="mt-1 h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
          />
          <label htmlFor="ageConfirm" className="ml-3 text-sm text-yellow-800">
            I confirm that I am <strong>18 years or older</strong> and understand that age verification
            is required upon delivery.
          </label>
        </div>
      </div>

      <Button
        type="submit"
        size="lg"
        fullWidth
        loading={loading}
        disabled={!stripe || loading || !ageConfirmed}
      >
        <FiLock className="mr-2" />
        Pay {formatCurrency(grandTotal)}
      </Button>
    </form>
  );
};

const Checkout = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getCart());
  }, [dispatch]);

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container-custom">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

          <Elements stripe={stripePromise}>
            <CheckoutForm />
          </Elements>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
