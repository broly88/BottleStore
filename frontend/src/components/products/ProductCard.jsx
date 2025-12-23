import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { FiShoppingCart } from 'react-icons/fi';
import { addToCart } from '../../redux/slices/cartSlice';
import { formatCurrency } from '../../utils/formatters';
import Button from '../common/Button';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const handleAddToCart = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      return;
    }

    if (!user?.ageVerified) {
      toast.error('Age verification required to purchase alcohol');
      return;
    }

    if (!product.isInStock || product.stockQuantity === 0) {
      toast.error('Product is out of stock');
      return;
    }

    try {
      await dispatch(addToCart({ productId: product.id, quantity: 1 })).unwrap();
      toast.success(`${product.name} added to cart`);
    } catch (error) {
      toast.error(error || 'Failed to add to cart');
    }
  };

  const isOutOfStock = !product.stockQuantity || product.stockQuantity === 0;
  const isLowStock = product.stockQuantity <= product.lowStockThreshold && product.stockQuantity > 0;

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden group">
      <Link to={`/product/${product.slug}`} className="block">
        <div className="relative pb-[100%] overflow-hidden bg-gray-100">
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-6xl">
              🍷
            </div>
          )}

          {product.featured && (
            <span className="absolute top-2 left-2 bg-primary-600 text-white text-xs font-bold px-2 py-1 rounded">
              Featured
            </span>
          )}

          {isOutOfStock && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <span className="bg-red-600 text-white px-4 py-2 rounded-lg font-bold">
                Out of Stock
              </span>
            </div>
          )}

          {isLowStock && !isOutOfStock && (
            <span className="absolute top-2 right-2 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded">
              Low Stock
            </span>
          )}
        </div>

        <div className="p-4">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 group-hover:text-primary-600 transition-colors">
                {product.name}
              </h3>
              {product.brand && (
                <p className="text-sm text-gray-500 mt-1">{product.brand}</p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
            {product.volumeMl && (
              <span>{product.volumeMl}ml</span>
            )}
            {product.alcoholContent && (
              <span>{product.alcoholContent}% ABV</span>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-primary-600">
                {formatCurrency(product.price)}
              </p>
              <p className="text-xs text-gray-500">Incl. VAT</p>
            </div>
          </div>
        </div>
      </Link>

      <div className="px-4 pb-4">
        <Button
          onClick={handleAddToCart}
          fullWidth
          disabled={isOutOfStock}
          variant={isOutOfStock ? 'ghost' : 'primary'}
        >
          <FiShoppingCart className="mr-2" />
          {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
        </Button>
      </div>
    </div>
  );
};

export default ProductCard;
