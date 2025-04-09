import React from 'react';

const FilterBar = ({
  filters,
  setFilters,
  accountOptions = [],
  vendorOptions = [],
}) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="flex flex-wrap gap-4 items-center p-4 bg-white rounded-xl shadow-md">
      <select
        name="type"
        value={filters.type}
        onChange={handleChange}
        className="border p-2 rounded-md"
      >
        <option value="">All Types</option>
        <option value="credit">Credit</option>
        <option value="debit">Debit</option>
      </select>

      <select
        name="account"
        value={filters.account}
        onChange={handleChange}
        className="border p-2 rounded-md"
      >
        <option value="">All Accounts</option>
        {accountOptions.map((acc) => (
          <option key={acc._id} value={acc._id}>{acc.name}</option>
        ))}
      </select>

      <select
        name="vendor"
        value={filters.vendor}
        onChange={handleChange}
        className="border p-2 rounded-md"
      >
        <option value="">All Vendors</option>
        {vendorOptions.map((vendor) => (
          <option key={vendor._id} value={vendor._id}>{vendor.name}</option>
        ))}
      </select>

      <input
        type="month"
        name="month"
        value={filters.month}
        onChange={handleChange}
        className="border p-2 rounded-md"
      />
    </div>
  );
};

export default FilterBar;
