import React, { useEffect, useState } from 'react';

const ItemTable = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetch('/api/items')
      .then((res) => res.json())
      .then(setItems);
  }, []);

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">Item Name</th>
            <th className="p-2 border">Rate</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item._id}>
              <td className="p-2 border">{item.name}</td>
              <td className="p-2 border">{item.rate}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ItemTable;
