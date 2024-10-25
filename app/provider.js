"use client";
import { useUser } from '@clerk/nextjs';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { UserDetailContext } from './_context/UserDetailContext';

function Provider({ children }) {
  const { user, isLoaded } = useUser(); // isLoaded indicates if the user data is ready
  const [userDetail,setUserDetail]=useState([]);

  useEffect(() => {
    if (isLoaded && user) { // Check if user data is loaded and user exists
      verifyUser();
      console.log(user);
    }
  }, [isLoaded, user]); // Add isLoaded and user to dependency array

  const verifyUser = async () => {
    try {
      const response = await axios.post('/api/verify-user', {
        user: user,
      });
      setUserDetail(response.data.result);
      console.log('User verification response:', response.data);
    } catch (error) {
      console.error('Error verifying user:', error.response?.data || error.message);
    }
  };

  return (
    <UserDetailContext.Provider value={{userDetail,setUserDetail}}>
      <div>
        {children}
      </div>
    </UserDetailContext.Provider>
  )
}

export default Provider;
