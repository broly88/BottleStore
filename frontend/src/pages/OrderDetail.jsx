import React, { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { FiArrowLeft } from 'react-icons/fi';
import { getOrderById, cancelOrder } from '../redux/slices/orderSlice';
import Loading from '../components/common/Loading';
import Button from '../components/common/Button';
import { formatCurrency, formatDateTime } from '../utils/formatters';
import { ORDER_STATUS, PAYMENT_STATUS } from '../utils/constants';

const OrderDetail = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentOrder: order, isLoading } = useSelector((state) => state.orders);

  useEffect(() => {
    if (orderId) {
      dispatch(getOrderById(orderId));
    }
  }, [dispatch, orderId]);

  const handleCancelOrder = async () => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      try {
        await dispatch(cancelOrder(orderId)).unwrap();
        toast.success('Order cancelled successfully');
      } catch (error) {
        toast.error(error || 'Failed to cancel order');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading size="lg" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container-custom py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Order Not Found</h2>
        <Link to="/orders">
          <Button>Back to Orders</Button>
        </Link>
      </div>
    );
  }

  const canCancel = order.canBeCancelled !== undefined ? order.canBeCancelled :
                    ['pending', 'processing'].includes(order.status);

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container-custom">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-primary-600 mb-6 transition-colors"
          >
            <FiArrowLeft className="mr-2" />
            Back
          </button>

          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  Order #{order.orderNumber}
                </h1>
                <p className="text-gray-600">
                  Placed on {formatDateTime(order.createdAt)}
                </p>
              </div>

              <div className="mt-4 md:mt-0 flex flex-col items-start md:items-end space-y-2">
                <span className={`badge badge-${ORDER_STATUS[order.status]?.color || 'info'}`}>
                  {ORDER_STATUS[order.status]?.label || order.status}
                </span>
                <span className={`badge badge-${PAYMENT_STATUS[order.paymentStatus]?.color || 'info'}`}>
                  Payment: {PAYMENT_STATUS[order.paymentStatus]?.label || order.paymentStatus}
                </span>
              </div>
            </div>

            {canCancel && (
              <div className="mb-6">
                <Button
                  variant="danger"
                  onClick={handleCancelOrder}
                >
                  Cancel Order
                </Button>
              </div>
            )}

            <div className="border-t pt-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Items</h2>
              <div className="space-y-4">
                {order.items?.map((item) => (
                  <div key={item.id} className="flex items-center justify-between py-4 border-b last:border-b-0">
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-gray-900">
                        {item.productName}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Quantity: {item.quantity} × {formatCurrency(item.productPrice)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold text-gray-900">
                        {formatCurrency(item.subtotal)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Delivery Address</h2>
              <div className="text-gray-600">
                <p>{order.deliveryAddress.streetAddress}</p>
                {order.deliveryAddress.suburb && <p>{order.deliveryAddress.suburb}</p>}
                <p>{order.deliveryAddress.city}</p>
                <p>{order.deliveryAddress.province} {order.deliveryAddress.postalCode}</p>
              </div>

              {order.deliveryInstructions && (
                <div className="mt-4 pt-4 border-t">
                  <p className="text-sm font-medium text-gray-700 mb-1">Delivery Instructions:</p>
                  <p className="text-gray-600">{order.deliveryInstructions}</p>
                </div>
              )}
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>
              <div className="space-y-3">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>{formatCurrency(order.subtotal)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>VAT (15%)</span>
                  <span>{formatCurrency(order.vatAmount)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Delivery Fee</span>
                  <span>{formatCurrency(order.deliveryFee)}</span>
                </div>
                <div className="flex justify-between text-xl font-bold text-gray-900 pt-3 border-t">
                  <span>Total</span>
                  <span>{formatCurrency(order.totalAmount)}</span>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Payment Method:</span>
                  <span className="text-gray-900 font-medium capitalize">
                    {order.paymentMethod || 'Card'}
                  </span>
                </div>
                {order.stripePaymentIntentId && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Payment ID:</span>
                    <span className="text-gray-900 font-mono text-xs">
                      {order.stripePaymentIntentId.substring(0, 20)}...
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {order.notes && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Notes</h2>
              <p className="text-gray-600">{order.notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
