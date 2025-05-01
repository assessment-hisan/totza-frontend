import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../../utils/axiosInstance';
import { validateEmail } from '../../../utils/helper';
import PasswordInput from '../../../components/ui/input/PasswordInput';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
            navigate("/");
          }
        } catch (error) {
          console.error("Auth check failed:", error);
          localStorage.clear();
        }
      }
    };
    
    checkAuth();
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validate inputs
    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      setLoading(false);
      return;
    }

    if (!password) {
      setError("Please enter your password");
      setLoading(false);
      return;
    }

    setError("");

    try {
      const response = await axiosInstance.post("/api/auth/login", {
        email: email,
        password: password
      });

      if (response.data?.token) {
        localStorage.setItem("token", response.data.token);
        
        // Get user info after successful login
        try {
          const userResponse = await axiosInstance.get('api/auth/get-user');
          if (userResponse.data?.user) {
            setUserInfo(userResponse.data.user);
            navigate("/");
          }
        } catch (userError) {
          console.error("Failed to fetch user info:", userError);
          setError("Login successful but failed to load user data");
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

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 p-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-8 transition-all duration-300 hover:shadow-xl">
        <h4 className="text-3xl font-semibold text-center mb-6 text-gray-800">Welcome Back!</h4>
        <form onSubmit={handleLogin} className="space-y-5">
          <input
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-gray-50 border-[1.5px] border-gray-300 focus:border-primary p-3 rounded text-sm outline-none transition duration-150 focus:ring-2 focus:ring-blue-200"
            disabled={loading}
          />

          <PasswordInput
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            disabled={loading}
          />

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
                Processing...
              </>
            ) : (
              'Login'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
