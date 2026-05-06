import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = (email, password) => {
    // Mock login
    setUser({ email, name: email.split('@')[0] });
  };

  const logout = () => {
    setUser(null);
  };

  const register = (email, password, name) => {
    // Mock register
    setUser({ email, name });
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
