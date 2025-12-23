import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { FiShoppingCart, FiMinus, FiPlus, FiArrowLeft } from 'react-icons/fi';
import { getProductBySlug, clearCurrentProduct } from '../redux/slices/productSlice';
import { addToCart } from '../redux/slices/cartSlice';
import { formatCurrency } from '../utils/formatters';
import Button from '../components/common/Button';
import Loading from '../components/common/Loading';

const ProductDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { currentProduct: product, isLoading } = useSelector((state) => state.products);
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    dispatch(getProductBySlug(slug));

    return () => {
      dispatch(clearCurrentProduct());
    };
  }, [dispatch, slug]);

  const handleQuantityChange = (delta) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1 && newQuantity <= (product?.stockQuantity || 1)) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      navigate('/login');
      return;
    }

    if (!user?.ageVerified) {
      toast.error('Age verification required to purchase alcohol');
      return;
    }

    setAddingToCart(true);
    try {
      await dispatch(addToCart({ productId: product.id, quantity })).unwrap();
      toast.success(`${quantity} x ${product.name} added to cart`);
      setQuantity(1);
    } catch (error) {
      toast.error(error || 'Failed to add to cart');
    } finally {
      setAddingToCart(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loading size="lg" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container-custom py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h2>
        <Link to="/shop">
          <Button>Back to Shop</Button>
        </Link>
      </div>
    );
  }

  const isOutOfStock = !product.stockQuantity || product.stockQuantity === 0;
  const isLowStock = product.stockQuantity <= product.lowStockThreshold && product.stockQuantity > 0;

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container-custom">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-primary-600 mb-6 transition-colors"
        >
          <FiArrowLeft className="mr-2" />
          Back
        </button>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="grid md:grid-cols-2 gap-8 p-8">
            <div>
              <div className="relative pb-[100%] rounded-lg overflow-hidden bg-gray-100">
                {product.imageUrl ? (
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-9xl">
                    🍷
                  </div>
                )}

                {product.featured && (
                  <span className="absolute top-4 left-4 bg-primary-600 text-white text-sm font-bold px-3 py-1 rounded">
                    Featured
                  </span>
                )}
              </div>
            </div>

            <div>
              <div className="mb-6">
                {product.brand && (
                  <p className="text-primary-600 font-medium mb-2">{product.brand}</p>
                )}
                <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>

                <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
                  <span className="badge badge-info capitalize">{product.category}</span>
                  {product.volumeMl && <span>{product.volumeMl}ml</span>}
                  {product.alcoholContent && <span>{product.alcoholContent}% ABV</span>}
                </div>

                {isOutOfStock && (
                  <div className="badge badge-error mb-4">Out of Stock</div>
                )}
                {isLowStock && !isOutOfStock && (
                  <div className="badge badge-warning mb-4">
                    Only {product.stockQuantity} left in stock
                  </div>
                )}
              </div>

              {product.description && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                  <p className="text-gray-600 leading-relaxed">{product.description}</p>
                </div>
              )}

              <div className="border-t border-gray-200 pt-6 mb-6">
                <div className="flex items-baseline mb-2">
                  <p className="text-4xl font-bold text-primary-600">
                    {formatCurrency(product.price)}
                  </p>
                  <p className="ml-2 text-sm text-gray-500">Incl. VAT</p>
                </div>
                <p className="text-sm text-gray-500">
                  VAT: {formatCurrency(product.price * 0.15)}
                </p>
              </div>

              {!isOutOfStock && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Quantity
                    </label>
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={() => handleQuantityChange(-1)}
                        disabled={quantity <= 1}
                        className="p-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <FiMinus />
                      </button>
                      <span className="text-xl font-semibold w-12 text-center">{quantity}</span>
                      <button
                        onClick={() => handleQuantityChange(1)}
                        disabled={quantity >= product.stockQuantity}
                        className="p-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <FiPlus />
                      </button>
                    </div>
                  </div>

                  <Button
                    onClick={handleAddToCart}
                    size="lg"
                    fullWidth
                    loading={addingToCart}
                    disabled={addingToCart}
                  >
                    <FiShoppingCart className="mr-2" />
                    Add to Cart - {formatCurrency(product.price * quantity)}
                  </Button>
                </div>
              )}

              <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <p className="text-sm text-yellow-800">
                  ⚠️ You must be 18+ to purchase alcohol. Age verification required at checkout.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
