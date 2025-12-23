import React, { useEffect, useState } from 'react';
import { FiDownload, FiTrendingUp, FiDollarSign, FiShoppingBag, FiPackage } from 'react-icons/fi';
import AdminLayout from '../../components/admin/AdminLayout';
import Loading from '../../components/common/Loading';
import Button from '../../components/common/Button';
import adminService from '../../services/adminService';
import { formatCurrency, formatDate } from '../../utils/formatters';
import toast from 'react-hot-toast';

const Reports = () => {
  const [salesReport, setSalesReport] = useState(null);
  const [inventoryReport, setInventoryReport] = useState([]);
  const [isLoadingSales, setIsLoadingSales] = useState(true);
  const [isLoadingInventory, setIsLoadingInventory] = useState(true);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    fetchSalesReport();
  }, [dateRange]);

  useEffect(() => {
    fetchInventoryReport();
  }, []);

  const fetchSalesReport = async () => {
    try {
      setIsLoadingSales(true);
      const data = await adminService.getSalesReport(dateRange);
      setSalesReport(data);
    } catch (error) {
      toast.error('Failed to load sales report');
    } finally {
      setIsLoadingSales(false);
    }
  };

  const fetchInventoryReport = async () => {
    try {
      setIsLoadingInventory(true);
      const data = await adminService.getInventoryReport();
      setInventoryReport(data.products || data);
    } catch (error) {
      toast.error('Failed to load inventory report');
    } finally {
      setIsLoadingInventory(false);
    }
  };

  const handleDateChange = (e) => {
    setDateRange({
      ...dateRange,
      [e.target.name]: e.target.value,
    });
  };

  const handleExportSales = () => {
    if (!salesReport) return;

    const csvContent = [
      ['Sales Report', '', ''],
      ['Period', `${formatDate(dateRange.startDate)} to ${formatDate(dateRange.endDate)}`, ''],
      ['', '', ''],
      ['Metric', 'Value', ''],
      ['Total Revenue', formatCurrency(salesReport.totalRevenue || 0), ''],
      ['Total Orders', salesReport.totalOrders || 0, ''],
      ['Average Order Value', formatCurrency(salesReport.averageOrderValue || 0), ''],
      ['', '', ''],
      ['Top Products', 'Units Sold', 'Revenue'],
      ...(salesReport.topProducts || []).map((p) => [
        p.name,
        p.unitsSold,
        formatCurrency(p.revenue),
      ]),
    ]
      .map((row) => row.join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sales-report-${dateRange.startDate}-to-${dateRange.endDate}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('Sales report exported');
  };

  const handleExportInventory = () => {
    if (!inventoryReport.length) return;

    const csvContent = [
      ['Inventory Report', '', '', ''],
      ['Generated', new Date().toLocaleString(), '', ''],
      ['', '', '', ''],
      ['Product', 'Category', 'Stock', 'Value'],
      ...inventoryReport.map((p) => [
        p.name,
        p.category,
        p.stockQuantity,
        formatCurrency(p.price * p.stockQuantity),
      ]),
    ]
      .map((row) => row.join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `inventory-report-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('Inventory report exported');
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Reports & Analytics</h2>
          <p className="text-gray-600 mt-1">View sales and inventory insights</p>
        </div>

        {/* Sales Report */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 md:mb-0">Sales Report</h3>
            <div className="flex flex-col md:flex-row gap-3">
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-600">From:</label>
                <input
                  type="date"
                  name="startDate"
                  value={dateRange.startDate}
                  onChange={handleDateChange}
                  className="input text-sm"
                />
              </div>
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-600">To:</label>
                <input
                  type="date"
                  name="endDate"
                  value={dateRange.endDate}
                  onChange={handleDateChange}
                  className="input text-sm"
                />
              </div>
              <Button onClick={handleExportSales} variant="outline" size="sm">
                <FiDownload className="mr-2" />
                Export CSV
              </Button>
            </div>
          </div>

          {isLoadingSales ? (
            <div className="flex justify-center py-12">
              <Loading size="lg" />
            </div>
          ) : salesReport ? (
            <div className="space-y-6">
              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-green-600 mb-1">Total Revenue</p>
                      <p className="text-2xl font-bold text-green-900">
                        {formatCurrency(salesReport.totalRevenue || 0)}
                      </p>
                    </div>
                    <div className="bg-green-500 p-3 rounded-lg">
                      <FiDollarSign className="text-white" size={24} />
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-blue-600 mb-1">Total Orders</p>
                      <p className="text-2xl font-bold text-blue-900">
                        {salesReport.totalOrders || 0}
                      </p>
                    </div>
                    <div className="bg-blue-500 p-3 rounded-lg">
                      <FiShoppingBag className="text-white" size={24} />
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-purple-600 mb-1">Avg Order Value</p>
                      <p className="text-2xl font-bold text-purple-900">
                        {formatCurrency(salesReport.averageOrderValue || 0)}
                      </p>
                    </div>
                    <div className="bg-purple-500 p-3 rounded-lg">
                      <FiTrendingUp className="text-white" size={24} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Top Products */}
              <div>
                <h4 className="text-md font-semibold text-gray-900 mb-3">Top Selling Products</h4>
                {salesReport.topProducts && salesReport.topProducts.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Rank
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Product
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Category
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Units Sold
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Revenue
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {salesReport.topProducts.map((product, index) => (
                          <tr key={product.id || index}>
                            <td className="px-4 py-3 text-sm font-bold text-gray-900">
                              #{index + 1}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-900">{product.name}</td>
                            <td className="px-4 py-3 text-sm text-gray-600 capitalize">
                              {product.category?.replace('_', ' ')}
                            </td>
                            <td className="px-4 py-3 text-sm font-medium text-gray-900">
                              {product.unitsSold}
                            </td>
                            <td className="px-4 py-3 text-sm font-semibold text-green-600">
                              {formatCurrency(product.revenue)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">No sales data available</p>
                )}
              </div>

              {/* Sales by Category */}
              {salesReport.salesByCategory && salesReport.salesByCategory.length > 0 && (
                <div>
                  <h4 className="text-md font-semibold text-gray-900 mb-3">Sales by Category</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {salesReport.salesByCategory.map((cat) => (
                      <div key={cat.category} className="bg-gray-50 rounded-lg p-4">
                        <p className="text-sm text-gray-600 capitalize mb-1">
                          {cat.category.replace('_', ' ')}
                        </p>
                        <p className="text-xl font-bold text-gray-900">
                          {formatCurrency(cat.revenue)}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">{cat.orders} orders</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No sales data available</p>
          )}
        </div>

        {/* Inventory Report */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Inventory Report</h3>
            <Button onClick={handleExportInventory} variant="outline" size="sm">
              <FiDownload className="mr-2" />
              Export CSV
            </Button>
          </div>

          {isLoadingInventory ? (
            <div className="flex justify-center py-12">
              <Loading size="lg" />
            </div>
          ) : inventoryReport.length > 0 ? (
            <div className="space-y-6">
              {/* Inventory Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-orange-600 mb-1">Total Products</p>
                      <p className="text-2xl font-bold text-orange-900">
                        {inventoryReport.length}
                      </p>
                    </div>
                    <div className="bg-orange-500 p-3 rounded-lg">
                      <FiPackage className="text-white" size={24} />
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-red-600 mb-1">Low Stock Items</p>
                      <p className="text-2xl font-bold text-red-900">
                        {inventoryReport.filter((p) => p.stockQuantity < 10).length}
                      </p>
                    </div>
                    <div className="bg-red-500 p-3 rounded-lg">
                      <FiPackage className="text-white" size={24} />
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Total Inventory Value</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {formatCurrency(
                          inventoryReport.reduce(
                            (sum, p) => sum + p.price * p.stockQuantity,
                            0
                          )
                        )}
                      </p>
                    </div>
                    <div className="bg-gray-500 p-3 rounded-lg">
                      <FiDollarSign className="text-white" size={24} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Inventory Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Product
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Category
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Price
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Stock
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Value
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {inventoryReport.map((product) => (
                      <tr key={product.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">
                          {product.name}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600 capitalize">
                          {product.category.replace('_', ' ')}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {formatCurrency(product.price)}
                        </td>
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">
                          {product.stockQuantity}
                        </td>
                        <td className="px-4 py-3 text-sm font-semibold text-gray-900">
                          {formatCurrency(product.price * product.stockQuantity)}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <span
                            className={`badge ${
                              product.stockQuantity === 0
                                ? 'badge-error'
                                : product.stockQuantity < 10
                                ? 'badge-warning'
                                : 'badge-success'
                            }`}
                          >
                            {product.stockQuantity === 0
                              ? 'Out of Stock'
                              : product.stockQuantity < 10
                              ? 'Low Stock'
                              : 'In Stock'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No inventory data available</p>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default Reports;
