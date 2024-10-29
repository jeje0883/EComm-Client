// import React, { useState, createContext } from 'react';

// // Create UserContext
// const UserContext = createContext();

// // Create UserProvider component
// export const UserProvider = ({ children }) => {
//   const [user, setUser] = useState({
//     id: null,
//     isAdmin: null,
//   });

//   const unsetUser = () => {
//     setUser({
//       id: null,
//       isAdmin: null,
//     });
//     localStorage.clear(); // Clear the token from localStorage
//   };

//   // Provide the context values (user, setUser, unsetUser) to the entire app
//   return (
//     <UserContext.Provider value={{ user, setUser, unsetUser }}>
//       {children}
//     </UserContext.Provider>
//   );
// };

// export default UserContext;


// UserContext.js
import React, { useState, useEffect, createContext } from 'react';

// Create UserContext
const UserContext = createContext();

// Create UserProvider component
export const UserProvider = ({ children }) => {
  // Initialize user state from localStorage
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : { id: null, isAdmin: null };
  });

  // Update localStorage whenever the user state changes
  useEffect(() => {
    if (user.id !== null) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  // Function to log out and clear user state
  const unsetUser = () => {
    setUser({
      id: null,
      isAdmin: null,
    });
    localStorage.removeItem('user'); // Clear only the user information
    localStorage.removeItem('token'); // Clear the token if stored separately
  };

  // Provide the context values (user, setUser, unsetUser) to the entire app
  return (
    <UserContext.Provider value={{ user, setUser, unsetUser }}>
      {children}
    </UserContext.Provider>
  );
};

// Export UserContext for use in other components
export { UserContext };
export default UserContext;
