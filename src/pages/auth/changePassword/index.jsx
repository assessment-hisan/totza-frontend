import { useState } from 'react';
import axiosInstance from '../../../utils/axiosInstance';

const ChangePassword = () => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        
        if (newPassword !== confirmPassword) {
            setError("New password and confirmation do not match");
            return;
        }

        try {
            const response = await axiosInstance.post('/api/auth/change-password', {
                currentPassword,
                newPassword,
            });
            setMessage(response.data.message);
            setError('');
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (err) {
            setError(err.response?.data?.message || "Failed to change password");
        }
    };

    return (
        <div className="p-8 bg-gray-100 min-h-screen">
            <h2 className="text-2xl font-bold mb-4">Change Password</h2>
            {error && <p className="text-red-500 mb-2">{error}</p>}
            {message && <p className="text-green-500 mb-2">{message}</p>}
            <form onSubmit={handlePasswordChange} className="bg-white p-4 shadow rounded">
                <div className="mb-4">
                    <label className="block font-medium">Current Password</label>
                    <input
                        type="password"
                        className="w-full p-2 border rounded"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="Enter current password"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block font-medium">New Password</label>
                    <input
                        type="password"
                        className="w-full p-2 border rounded"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Enter new password"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block font-medium">Confirm New Password</label>
                    <input
                        type="password"
                        className="w-full p-2 border rounded"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm new password"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    Change Password
                </button>
            </form>
        </div>
    );
};

export default ChangePassword;
