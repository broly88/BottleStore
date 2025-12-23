import React from 'react';
import { Link } from 'react-router-dom';
import { FiFacebook, FiTwitter, FiInstagram } from 'react-icons/fi';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <span className="text-2xl">🍷</span>
              <span className="text-xl font-bold text-white">LiquorShop</span>
            </div>
            <p className="text-sm mb-4">
              Premium alcohol delivery across South Africa. Shop wines, beers, and spirits with confidence.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-primary-500 transition-colors">
                <FiFacebook size={20} />
              </a>
              <a href="#" className="hover:text-primary-500 transition-colors">
                <FiTwitter size={20} />
              </a>
              <a href="#" className="hover:text-primary-500 transition-colors">
                <FiInstagram size={20} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Shop</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/shop?category=wine" className="hover:text-primary-500 transition-colors">
                  Wines
                </Link>
              </li>
              <li>
                <Link to="/shop?category=beer" className="hover:text-primary-500 transition-colors">
                  Beers
                </Link>
              </li>
              <li>
                <Link to="/shop?category=spirits" className="hover:text-primary-500 transition-colors">
                  Spirits
                </Link>
              </li>
              <li>
                <Link to="/shop?category=cider" className="hover:text-primary-500 transition-colors">
                  Ciders
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Information</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/about" className="hover:text-primary-500 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-primary-500 transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-primary-500 transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-primary-500 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/responsible-drinking" className="hover:text-primary-500 transition-colors">
                  Responsible Drinking
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Contact</h3>
            <ul className="space-y-2 text-sm">
              <li>📞 +27 123 456 789</li>
              <li>📧 info@liquorshop.co.za</li>
              <li>📍 Johannesburg, South Africa</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm">
            <p>© {currentYear} LiquorShop. All rights reserved.</p>
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4 mt-4 md:mt-0">
              <p>Liquor License: LC12345/2024</p>
              <p>VAT Number: 4123456789</p>
            </div>
          </div>
          <p className="text-xs text-center mt-4 text-gray-400">
            Please drink responsibly. Not for sale to persons under 18. Proof of age required.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
