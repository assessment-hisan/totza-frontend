import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../../../utils/axiosInstance';
import { validateEmail, validatePassword } from "../../../utils/helper";
import PasswordInput from '../../../components/ui/input/PasswordInput';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const navigate = useNavigate();
  
  // Check if user is already logged in
  useEffect(() => {
    const checkAuth = async () => {
      setCheckingAuth(true);
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const response = await axiosInstance.get('api/auth/get-user');
          if (response.data?.user) {
            setUserInfo(response.data.user);
            // We'll handle the redirect in the render function
          }
        } catch (error) {
          console.error("Auth check failed:", error);
          localStorage.clear();
        }
      }
      setCheckingAuth(false);
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

  // Special handler for password fields to match how the PasswordInput component works
  const handlePasswordChange = (fieldName) => (e) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validate inputs
    if (!formData.name.trim()) {
      setError("Please enter your name");
      setLoading(false);
      return;
    }

    if (!validateEmail(formData.email)) {
      setError("Please enter a valid email address");
      setLoading(false);
      return;
    }

    if (!validatePassword(formData.password)) {
      setError("Password must be at least 8 characters long");
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const response = await axiosInstance.post("api/auth/register", {
        name: formData.name,
        email: formData.email,
        password: formData.password
      });

      if (response.data?.token) {
        localStorage.setItem("token", response.data.token);
        navigate("/");
      }
    } catch (error) {
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError("Registration failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // If checking auth status, show loading
  if (checkingAuth) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 p-4">
        <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-8 text-center">
          <svg className="animate-spin mx-auto h-10 w-10 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="mt-4 text-gray-600">Checking authentication status...</p>
        </div>
      </div>
    );
  }
  
  // If user is already logged in, show message with redirect option
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
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 p-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-8 transition-all duration-300 hover:shadow-xl">
        <h4 className="text-3xl font-semibold text-center mb-6 text-gray-800">Create Account</h4>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="John Doe"
              className="w-full bg-gray-50 border-[1.5px] border-gray-300 focus:border-primary p-3 rounded text-sm outline-none transition duration-150 focus:ring-2 focus:ring-blue-200"
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your@email.com"
              className="w-full bg-gray-50 border-[1.5px] border-gray-300 focus:border-primary p-3 rounded text-sm outline-none transition duration-150 focus:ring-2 focus:ring-blue-200"
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

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </label>
            <PasswordInput
              value={formData.confirmPassword}
              onChange={handlePasswordChange('confirmPassword')}
              placeholder="Re-enter your password"
              disabled={loading}
            />
          </div>

          {error && (
            <p className="text-red-500 text-xs text-center mb-3 animate-fade-in">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full ${
              loading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
            } text-white font-medium py-3 rounded transition duration-150 flex items-center justify-center`}
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating account...
              </>
            ) : (
              'Register'
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 hover:underline font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;