import React, { useState } from 'react';

const ItemForm = ({ onSuccess }) => {
  const [name, setName] = useState('');
  const [rate, setRate] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    await fetch('/api/items', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, rate }),
    });

    onSuccess?.();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block font-medium">Item Name</label>
        <input
          className="w-full p-2 border rounded"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div>
        <label className="block font-medium">Rate</label>
        <input
          type="number"
          className="w-full p-2 border rounded"
          value={rate}
          onChange={(e) => setRate(e.target.value)}
          required
        />
      </div>

      <button
        type="submit"
        className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
      >
        Save
      </button>
    </form>
  );
};

export default ItemForm;
