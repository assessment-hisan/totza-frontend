import React, { useState } from 'react';
import axiosInstance from '../../../utils/axiosInstance';
import { add } from 'date-fns';

const AccountForm = ({ onSuccess }) => {
  const [name, setName] = useState('');
   
  const addAccount = async(data) => {
    try {
      const res = await axiosInstance.post('account', data)
      console.log(res)
    } catch (error) {
      console.log(error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    addAccount({name})
    onSuccess?.();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4">
      <div>
        <label className="block font-medium">Account Name</label>
        <input
          className="w-full p-2 border rounded"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

 
      <button
        type="submit"
        className="w-full bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
      >
        Save
      </button>
    </form>
  );
};

export default AccountForm;
