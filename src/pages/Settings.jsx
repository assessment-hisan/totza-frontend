import React from 'react';

const Settings = () => {
  return (
    <div className="p-6 space-y-6 max-w-2xl">
      <h2 className="text-2xl font-bold mb-4">Settings</h2>

      <div className="bg-white shadow p-4 rounded space-y-4">
        <div>
          <label className="block font-medium">Username</label>
          <input
            type="text"
            className="border w-full px-3 py-2 rounded"
            placeholder="Enter your name"
          />
        </div>

        <div>
          <label className="block font-medium">Email</label>
          <input
            type="email"
            className="border w-full px-3 py-2 rounded"
            placeholder="Email"
          />
        </div>

        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default Settings;
