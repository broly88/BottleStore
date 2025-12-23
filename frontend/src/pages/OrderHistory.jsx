import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getUserOrders } from '../redux/slices/orderSlice';
import Loading from '../components/common/Loading';
import { formatCurrency, formatDate } from '../utils/formatters';
import { ORDER_STATUS, PAYMENT_STATUS } from '../utils/constants';

const OrderHistory = () => {
  const dispatch = useDispatch();
  const { orders, isLoading } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(getUserOrders());
  }, [dispatch]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading size="lg" />
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container-custom">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Order History</h1>

          {orders && orders.length > 0 ? (
            <div className="space-y-4">
              {orders.map((order) => (
                <Link
                  key={order.id}
                  to={`/orders/${order.id}`}
                  className="block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        Order #{order.orderNumber}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Placed on {formatDate(order.createdAt)}
                      </p>
                    </div>
                    <div className="mt-4 md:mt-0 flex items-center space-x-3">
                      <span className={`badge badge-${ORDER_STATUS[order.status]?.color || 'info'}`}>
                        {ORDER_STATUS[order.status]?.label || order.status}
                      </span>
                      <span className={`badge badge-${PAYMENT_STATUS[order.paymentStatus]?.color || 'info'}`}>
                        {PAYMENT_STATUS[order.paymentStatus]?.label || order.paymentStatus}
                      </span>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                      <div className="text-sm text-gray-600 mb-2 md:mb-0">
                        {order.items?.length || 0} item(s)
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-primary-600">
                          {formatCurrency(order.totalAmount)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {order.items && order.items.length > 0 && (
                    <div className="mt-4 space-y-2">
                      {order.items.slice(0, 2).map((item) => (
                        <div key={item.id} className="text-sm text-gray-600">
                          {item.productName} × {item.quantity}
                        </div>
                      ))}
                      {order.items.length > 2 && (
                        <div className="text-sm text-gray-500">
                          + {order.items.length - 2} more item(s)
                        </div>
                      )}
                    </div>
                  )}
                </Link>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <div className="text-6xl mb-4">📦</div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                No Orders Yet
              </h2>
              <p className="text-gray-600 mb-6">
                You haven't placed any orders. Start shopping to see your orders here.
              </p>
              <Link
                to="/shop"
                className="inline-block bg-primary-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors"
              >
                Start Shopping
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderHistory;
