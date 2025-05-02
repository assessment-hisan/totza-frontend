import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../../../utils/axiosInstance';
import { validateEmail } from '../../../utils/helper';
import PasswordInput from '../../../components/ui/input/PasswordInput';
import { FiLogIn } from 'react-icons/fi';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();

  // Check if user is already logged in
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const response = await axiosInstance.get('api/auth/get-user');
          if (response.data?.user) {
            setUserInfo(response.data.user);
          }
        } catch (error) {
          console.error("Auth check failed:", error);
          localStorage.clear();
        }
      }
    };
    
    checkAuth();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordChange = (fieldName) => (e) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: e.target.value
    }));
  };
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validate inputs
    if (!validateEmail(formData.email)) {
      setError("Please enter a valid email address.");
      setLoading(false);
      return;
    }

    if (!formData.password) {
      setError("Please enter your password");
      setLoading(false);
      return;
    }

    setError("");

    try {
      const response = await axiosInstance.post("/api/auth/login", {
        email: formData.email,
        password: formData.password
      });

      if (response.data?.token) {
        localStorage.setItem("token", response.data.token);
        
        // Get user info after successful login
        const userResponse = await axiosInstance.get('api/auth/get-user');
        if (userResponse.data?.user) {
          setUserInfo(userResponse.data.user);
          navigate("/");
        }
      }
    } catch (error) {
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError("An unexpected error occurred. Please try again");
      }
    } finally {
      setLoading(false);
    }
  };

  // If user info exists, redirect to home
  if (userInfo) {
    navigate("/");
    return null;
  }

  if (userInfo) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 p-4">
        <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-8 transition-all duration-300 hover:shadow-xl">
          <h4 className="text-2xl font-semibold text-center mb-6 text-gray-800">
            You're Already Logged In
          </h4>
          <div className="text-center mb-6">
            <p className="text-gray-600 mb-4">
              You're currently logged in as <span className="font-semibold">{userInfo.name || userInfo.email}</span>
            </p>
            <button
              onClick={() => navigate("/")}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded transition duration-150"
            >
              Go to Dashboard
            </button>
          </div>
          <div className="text-center mt-4">
            <button
              onClick={() => {
                localStorage.removeItem("token");
                setUserInfo(null);
              }}
              className="text-blue-600 hover:underline font-medium"
            >
              Log Out and Register New Account
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md">
        <div className="p-8">
          <div className="flex justify-center mb-6">
            <FiLogIn className="h-10 w-10 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">Welcome Back</h2>
          <p className="text-sm text-gray-500 text-center mb-6">Sign in to your account</p>
          
          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg">
                {error}
              </div>
            )}
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your@email.com"
                className="w-full bg-gray-50 border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-200 p-3 rounded-lg text-sm outline-none transition duration-150"
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <PasswordInput
              value={formData.password}
              onChange={handlePasswordChange('password')}
              placeholder="At least 8 characters"
              disabled={loading}
            />
            </div>

            
            <button
              type="submit"
              disabled={loading}
              className={`w-full ${
                loading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
              } text-white font-medium py-3 rounded-lg transition duration-150 flex items-center justify-center`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>
        </div>

        <div className="bg-gray-50 px-6 py-4 border-t border-gray-100">
          <p className="text-sm text-gray-600 text-center">
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-600 hover:text-blue-700 font-medium">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;