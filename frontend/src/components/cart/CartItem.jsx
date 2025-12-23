import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { FiTrash2, FiMinus, FiPlus } from 'react-icons/fi';
import { updateCartItem, removeFromCart } from '../../redux/slices/cartSlice';
import { formatCurrency } from '../../utils/formatters';

const CartItem = ({ item }) => {
  const dispatch = useDispatch();

  const handleUpdateQuantity = async (newQuantity) => {
    if (newQuantity < 1) return;

    if (newQuantity > item.product.stockQuantity) {
      toast.error(`Only ${item.product.stockQuantity} available`);
      return;
    }

    try {
      await dispatch(updateCartItem({ itemId: item.id, quantity: newQuantity })).unwrap();
    } catch (error) {
      toast.error(error || 'Failed to update quantity');
    }
  };

  const handleRemove = async () => {
    try {
      await dispatch(removeFromCart(item.id)).unwrap();
      toast.success('Item removed from cart');
    } catch (error) {
      toast.error(error || 'Failed to remove item');
    }
  };

  return (
    <div className="flex items-center space-x-4 py-4 border-b last:border-b-0">
      <Link to={`/product/${item.product.slug}`} className="flex-shrink-0">
        <div className="w-24 h-24 rounded-lg overflow-hidden bg-gray-100">
          {item.product.imageUrl ? (
            <img
              src={item.product.imageUrl}
              alt={item.product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-3xl">
              🍷
            </div>
          )}
        </div>
      </Link>

      <div className="flex-1 min-w-0">
        <Link
          to={`/product/${item.product.slug}`}
          className="text-lg font-semibold text-gray-900 hover:text-primary-600 transition-colors block truncate"
        >
          {item.product.name}
        </Link>
        {item.product.brand && (
          <p className="text-sm text-gray-500">{item.product.brand}</p>
        )}
        <p className="text-sm text-gray-600 mt-1">
          {formatCurrency(item.product.price)} each
        </p>
      </div>

      <div className="flex items-center space-x-3">
        <button
          onClick={() => handleUpdateQuantity(item.quantity - 1)}
          disabled={item.quantity <= 1}
          className="p-1 border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FiMinus size={16} />
        </button>
        <span className="text-lg font-semibold w-8 text-center">{item.quantity}</span>
        <button
          onClick={() => handleUpdateQuantity(item.quantity + 1)}
          disabled={item.quantity >= item.product.stockQuantity}
          className="p-1 border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FiPlus size={16} />
        </button>
      </div>

      <div className="text-right">
        <p className="text-lg font-bold text-gray-900">
          {formatCurrency(item.product.price * item.quantity)}
        </p>
      </div>

      <button
        onClick={handleRemove}
        className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
        title="Remove item"
      >
        <FiTrash2 size={20} />
      </button>
    </div>
  );
};

export default CartItem;
