import React from 'react'
import PasswordInput from '../../../components/ui/input/PasswordInput'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import axiosInstance from '../../../utils/axiosInstance'
import { validateEmail } from '../../../utils/helper'

const  Login =  () => {

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState(null)

   const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.")
      return
    }

    if(!password) {
      setError("please enter the password")
      return;
    }

    setError("")
    
    //login api call
    try {
      const response = await axiosInstance.post("/api/auth/login", {
        email: email,
        password:password
      })

      //Handle seccesfull login response
      if (response.data) {
          
          localStorage.setItem("token", response.data.token)
          navigate("/")
      }
    } catch (error) {
     
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message)
      }else {
        setError("An unexpected error occured. Please try again")
      }
    }

  }
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-300">
      <div className="w-96 bg-white shadow-lg rounded-lg p-8">
        <h4 className="text-3xl font-semibold text-center mb-6 text-gray-800">Welcome Back!</h4>
        <form onSubmit={handleLogin} className="space-y-5">
          <input
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-gray-50 border-[1.5px] border-gray-300 focus:border-primary p-3 rounded text-sm outline-none transition duration-150"
          />

          <PasswordInput
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />

          {error && (
            <p className="text-red-500 text-xs text-center mb-3">{error}</p>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded transition duration-150"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login

