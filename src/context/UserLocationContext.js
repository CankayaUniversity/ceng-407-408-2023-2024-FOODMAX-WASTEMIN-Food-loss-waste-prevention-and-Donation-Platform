// UserLocationContext.js
import React, { createContext, useState } from 'react';

export const UserLocationContext = createContext();

export const UserLocationProvider = ({ children }) => {
  const [location, setLocation] = useState(null); // Initialize with null

  // Code to fetch and update location asynchronously

  return (
    <UserLocationContext.Provider value={{ location }}>
      {children}
    </UserLocationContext.Provider>
  );
};
