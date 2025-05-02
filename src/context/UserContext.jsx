// src/context/UserContext.js
import { createContext, useContext, useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosInstance';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState(null);
  const [userInfoLoading, setUserInfoLoading] = useState(true);

  // Check for user on initial load
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axiosInstance.get('api/auth/get-user');
        setUserInfo(res.data);
      } catch (err) {
        setUserInfo(null);
      } finally {
        setUserInfoLoading(false);
      }
    };

    fetchUser();
  }, []);

//   const login = async (userData) => {
//     const res = await axios.post('/api/auth/login', userData, {
//       withCredentials: true
//     });
//     setUser(res.data);
//   };

//   const logout = async () => {
//     await axios.post('/api/auth/logout', {}, {
//       withCredentials: true
//     });
//     setUser(null);
//   };

//   const register = async (userData) => {
//     const res = await axios.post('/api/auth/register', userData, {
//       withCredentials: true
//     });
//     setUser(res.data);
//   };

  return (
    <UserContext.Provider value={{ userInfo, userInfoLoading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
      throw new Error('useUser must be used within a UserProvider');
    }
    return context;
  };