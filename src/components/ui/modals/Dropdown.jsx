import React from 'react';

const Dropdown = ({ label, name, options, value, onChange, placeholder = 'Select an option' }) => {
  return (
    <div className="w-full mb-4">
      {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">{placeholder}</option>
        {options?.map((option, index) => (
          <option key={index} value={option.value || option._id}>
            {option.label || option.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Dropdown;
