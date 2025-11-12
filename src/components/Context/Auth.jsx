import React, { useEffect, useState, createContext } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authenticated, setAuthenticated] = useState(false);
  const [username, setUsername] = useState("User");
  const [email, setEmail] = useState("");

  // Load data from localStorage on mount
  useEffect(() => {
    try {
      const savedAuth = localStorage.getItem("authenticated");
      const savedUser = localStorage.getItem("username");
      const savedEmail = localStorage.getItem("email");

      if (savedAuth && JSON.parse(savedAuth) === true) {
        setAuthenticated(true);
      }

      if (savedUser) setUsername(savedUser);
      if (savedEmail) setEmail(savedEmail);
    } catch (error) {
      console.error("Failed to load user data:", error);
    }
  }, []);

  // Save changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("authenticated", JSON.stringify(authenticated));
      localStorage.setItem("username", username);
      localStorage.setItem("email", email);
    } catch (error) {
      console.error("Failed to save user data:", error);
    }
  }, [authenticated, username, email]);

  return (
    <AuthContext.Provider
      value={{
        authenticated,
        setAuthenticated,
        username,
        setUsername,
        email,
        setEmail,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
