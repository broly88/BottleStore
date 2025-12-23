import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setFilters } from '../../redux/slices/productSlice';
import { CATEGORIES } from '../../utils/constants';
import Button from '../common/Button';

const ProductFilter = ({ currentFilters, onFilterChange }) => {
  const [localFilters, setLocalFilters] = useState({
    category: currentFilters.category || '',
    minPrice: currentFilters.minPrice || '',
    maxPrice: currentFilters.maxPrice || '',
    search: currentFilters.search || '',
    sortBy: currentFilters.sortBy || 'createdAt',
    sortOrder: currentFilters.sortOrder || 'DESC',
  });

  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLocalFilters({
      ...localFilters,
      [name]: value,
    });
  };

  const handleApplyFilters = () => {
    dispatch(setFilters(localFilters));
    if (onFilterChange) {
      onFilterChange(localFilters);
    }
  };

  const handleReset = () => {
    const resetFilters = {
      category: '',
      minPrice: '',
      maxPrice: '',
      search: '',
      sortBy: 'createdAt',
      sortOrder: 'DESC',
    };
    setLocalFilters(resetFilters);
    dispatch(setFilters(resetFilters));
    if (onFilterChange) {
      onFilterChange(resetFilters);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 sticky top-20">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Filters</h3>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Search
          </label>
          <input
            type="text"
            name="search"
            value={localFilters.search}
            onChange={handleChange}
            placeholder="Search products..."
            className="input"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category
          </label>
          <select
            name="category"
            value={localFilters.category}
            onChange={handleChange}
            className="input"
          >
            <option value="">All Categories</option>
            {CATEGORIES.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Price Range (ZAR)
          </label>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              name="minPrice"
              value={localFilters.minPrice}
              onChange={handleChange}
              placeholder="Min"
              className="input"
              min="0"
            />
            <input
              type="number"
              name="maxPrice"
              value={localFilters.maxPrice}
              onChange={handleChange}
              placeholder="Max"
              className="input"
              min="0"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sort By
          </label>
          <select
            name="sortBy"
            value={localFilters.sortBy}
            onChange={handleChange}
            className="input"
          >
            <option value="createdAt">Newest First</option>
            <option value="price">Price</option>
            <option value="name">Name</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Order
          </label>
          <select
            name="sortOrder"
            value={localFilters.sortOrder}
            onChange={handleChange}
            className="input"
          >
            <option value="ASC">Ascending</option>
            <option value="DESC">Descending</option>
          </select>
        </div>

        <div className="pt-4 space-y-2">
          <Button onClick={handleApplyFilters} fullWidth>
            Apply Filters
          </Button>
          <Button onClick={handleReset} variant="outline" fullWidth>
            Reset
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductFilter;
