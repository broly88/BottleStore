import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getFeaturedProducts } from '../redux/slices/productSlice';
import ProductCard from '../components/products/ProductCard';
import Loading from '../components/common/Loading';
import Button from '../components/common/Button';
import { CATEGORIES } from '../utils/constants';

const Home = () => {
  const dispatch = useDispatch();
  const { featuredProducts, isLoading } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(getFeaturedProducts());
  }, [dispatch]);

  return (
    <div>
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20">
        <div className="container-custom">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Premium Alcohol Delivery in South Africa
            </h1>
            <p className="text-xl mb-8 text-primary-100">
              Shop from our curated selection of wines, beers, and spirits.
              Delivered to your door with age verification.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/shop">
                <Button size="lg" variant="secondary">
                  Shop Now
                </Button>
              </Link>
              <Link to="/about">
                <Button size="lg" variant="outline" className="bg-white bg-opacity-10 text-white border-white hover:bg-opacity-20">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-gray-50">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Shop by Category
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {CATEGORIES.map((category) => (
              <Link
                key={category.value}
                to={`/shop?category=${category.value}`}
                className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-xl transition-shadow group"
              >
                <div className="text-4xl mb-3">
                  {category.value === 'wine' && '🍷'}
                  {category.value === 'beer' && '🍺'}
                  {category.value === 'spirits' && '🥃'}
                  {category.value === 'cider' && '🍎'}
                  {category.value === 'other' && '🍾'}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                  {category.label}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container-custom">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">
              Featured Products
            </h2>
            <Link to="/shop">
              <Button variant="outline">View All</Button>
            </Link>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loading size="lg" />
            </div>
          ) : featuredProducts && featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">No featured products available</p>
            </div>
          )}
        </div>
      </section>

      <section className="bg-primary-50 py-16">
        <div className="container-custom">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl mb-4">🚚</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Fast Delivery
              </h3>
              <p className="text-gray-600">
                Quick and reliable delivery across South Africa
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">🔒</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Secure Payment
              </h3>
              <p className="text-gray-600">
                Safe and encrypted transactions with Stripe
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">✅</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Age Verified
              </h3>
              <p className="text-gray-600">
                Responsible selling with mandatory age verification
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-16">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Shop?
          </h2>
          <p className="text-xl mb-8 text-gray-300">
            Browse our full collection of premium alcohol
          </p>
          <Link to="/shop">
            <Button size="lg" variant="secondary">
              Explore Products
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
