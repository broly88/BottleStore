import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiDollarSign, FiShoppingBag, FiUsers, FiPackage, FiTrendingUp, FiTrendingDown } from 'react-icons/fi';
import AdminLayout from '../../components/admin/AdminLayout';
import Loading from '../../components/common/Loading';
import adminService from '../../services/adminService';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { ORDER_STATUS } from '../../utils/constants';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const data = await adminService.getDashboardStats();
      setStats(data);
    } catch (error) {
      toast.error('Failed to load dashboard statistics');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-screen">
          <Loading size="lg" />
        </div>
      </AdminLayout>
    );
  }

  if (!stats) {
    return (
      <AdminLayout>
        <div className="text-center py-12">
          <p className="text-gray-600">Unable to load dashboard statistics</p>
        </div>
      </AdminLayout>
    );
  }

  const statCards = [
    {
      title: 'Total Revenue',
      value: formatCurrency(stats.totalRevenue || 0),
      icon: FiDollarSign,
      color: 'bg-green-500',
      trend: stats.revenueTrend,
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders || 0,
      icon: FiShoppingBag,
      color: 'bg-blue-500',
      trend: stats.ordersTrend,
    },
    {
      title: 'Total Users',
      value: stats.totalUsers || 0,
      icon: FiUsers,
      color: 'bg-purple-500',
      trend: stats.usersTrend,
    },
    {
      title: 'Total Products',
      value: stats.totalProducts || 0,
      icon: FiPackage,
      color: 'bg-orange-500',
      trend: stats.productsTrend,
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            const TrendIcon = stat.trend >= 0 ? FiTrendingUp : FiTrendingDown;
            return (
              <div key={index} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    {stat.trend !== undefined && (
                      <div className={`flex items-center mt-2 text-sm ${stat.trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        <TrendIcon size={16} className="mr-1" />
                        <span>{Math.abs(stat.trend)}%</span>
                      </div>
                    )}
                  </div>
                  <div className={`${stat.color} p-3 rounded-lg`}>
                    <Icon className="text-white" size={24} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Recent Orders and Low Stock */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Orders */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
              <Link to="/admin/orders" className="text-sm text-primary-600 hover:text-primary-700">
                View All
              </Link>
            </div>
            <div className="space-y-3">
              {stats.recentOrders && stats.recentOrders.length > 0 ? (
                stats.recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between py-3 border-b last:border-b-0">
                    <div>
                      <p className="font-medium text-gray-900">#{order.orderNumber}</p>
                      <p className="text-sm text-gray-600">{formatDate(order.createdAt)}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">{formatCurrency(order.totalAmount)}</p>
                      <span className={`text-xs badge badge-${ORDER_STATUS[order.status]?.color || 'info'}`}>
                        {ORDER_STATUS[order.status]?.label || order.status}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">No recent orders</p>
              )}
            </div>
          </div>

          {/* Low Stock Products */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Low Stock Alert</h2>
              <Link to="/admin/products" className="text-sm text-primary-600 hover:text-primary-700">
                View All
              </Link>
            </div>
            <div className="space-y-3">
              {stats.lowStockProducts && stats.lowStockProducts.length > 0 ? (
                stats.lowStockProducts.map((product) => (
                  <div key={product.id} className="flex items-center justify-between py-3 border-b last:border-b-0">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{product.name}</p>
                      <p className="text-sm text-gray-600 capitalize">{product.category}</p>
                    </div>
                    <div className="text-right">
                      <span
                        className={`text-sm font-semibold ${
                          product.stockQuantity === 0
                            ? 'text-red-600'
                            : product.stockQuantity < 5
                            ? 'text-orange-600'
                            : 'text-yellow-600'
                        }`}
                      >
                        {product.stockQuantity === 0 ? 'Out of Stock' : `${product.stockQuantity} left`}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">All products in stock</p>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              to="/admin/products?action=create"
              className="flex items-center justify-center px-4 py-3 bg-primary-50 text-primary-600 rounded-lg hover:bg-primary-100 transition-colors"
            >
              <FiPackage className="mr-2" />
              Add New Product
            </Link>
            <Link
              to="/admin/orders"
              className="flex items-center justify-center px-4 py-3 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <FiShoppingBag className="mr-2" />
              Manage Orders
            </Link>
            <Link
              to="/admin/users"
              className="flex items-center justify-center px-4 py-3 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition-colors"
            >
              <FiUsers className="mr-2" />
              View Users
            </Link>
            <Link
              to="/admin/reports"
              className="flex items-center justify-center px-4 py-3 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors"
            >
              <FiTrendingUp className="mr-2" />
              View Reports
            </Link>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
