import { useState } from 'react';
import { getInitials } from '../utils/helper';
import { useNavigate } from 'react-router-dom';
import { FaWallet } from 'react-icons/fa';

const Navbar = ({ userInfo }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    setLoading(true);
    localStorage.clear();
    await new Promise((resolve) => setTimeout(resolve, 500));
    setLoading(false);
    window.location.reload();
  };

  const navigateToChangePassword = () => {
    navigate('/change-password');
  };

  const goToPersonalTransactions = () => {
    navigate('/personal-transactions');
  };

  return (
    <div className="w-full flex justify-between items-center bg-white p-4 shadow-md rounded">
      <div className="flex items-center gap-6">
        <h1 className="text-2xl font-semibold">Totza</h1>
      </div>
      <div className='flex  lg:gap-10'>
        {/* Personal Transactions Link */}
        <button
          onClick={goToPersonalTransactions}
          className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition"
        >
          <FaWallet className="text-lg" />
          <span>Personal Transactions</span>
        </button>

        {/* User Info & Dropdown */}
      {userInfo && (
        <div className="relative">
          <button
            className="flex items-center gap-2 text-gray-700 font-medium bg-gray-100 p-2 rounded-full hover:bg-gray-200 transition"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <div className="w-8 h-8 px-5 bg-blue-500 rounded-full flex items-center justify-center text-xl text-white font-bold">
              {getInitials(userInfo.fullName)}
            </div>
            <span className="text-sm uppercase">{userInfo.fullName}</span>
          </button>

          {dropdownOpen && (
            <div className="absolute z-30 right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg">
              <div className="p-3 border-b text-gray-600">
                <p>{userInfo.email}</p>
              </div>
              <div
                className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer"
                onClick={navigateToChangePassword}
              >
                Change Password
              </div>
              <button
                className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 flex justify-center items-center gap-2"
                onClick={handleLogout}
                disabled={loading}
              >
                {loading ? (
                  <svg
                    className="animate-spin h-5 w-5 text-gray-500"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 000 8v4a8 8 0 01-8-8z"
                    ></path>
                  </svg>
                ) : (
                  'Logout'
                )}
              </button>
            </div>
          )}
        </div>
      )}
      </div>
    </div>
  );
};

export default Navbar;
