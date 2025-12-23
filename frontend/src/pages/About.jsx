import React from 'react';

const About = () => {
  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="container-custom">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">About Us</h1>

          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Welcome to LiquorShop
            </h2>
            <p className="text-gray-600 mb-4 leading-relaxed">
              We are South Africa's premier online destination for premium wines, beers, and spirits.
              Our mission is to provide a convenient, secure, and responsible way to purchase alcohol online.
            </p>
            <p className="text-gray-600 mb-4 leading-relaxed">
              With years of experience in the industry, we've carefully curated a selection of the finest
              alcoholic beverages from local and international brands. Whether you're looking for a special
              occasion wine, craft beer, or premium spirits, we have something for everyone.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="text-4xl mb-4">🏆</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Premium Selection</h3>
              <p className="text-gray-600 text-sm">
                Carefully curated collection of top-quality products
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="text-4xl mb-4">🚚</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Fast Delivery</h3>
              <p className="text-gray-600 text-sm">
                Quick and reliable delivery across South Africa
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 text-center">
              <div className="text-4xl mb-4">✅</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Age Verified</h3>
              <p className="text-gray-600 text-sm">
                Responsible selling with mandatory age verification
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Our Commitment to Responsible Selling
            </h2>
            <p className="text-gray-600 mb-4 leading-relaxed">
              We take our responsibility seriously. All customers must be 18 years or older to
              purchase alcohol. We verify age during registration and at checkout. Our delivery
              partners are trained to verify age upon delivery.
            </p>
            <p className="text-gray-600 leading-relaxed">
              We comply with all South African liquor laws and regulations, including POPIA
              (Protection of Personal Information Act) and delivery restrictions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
