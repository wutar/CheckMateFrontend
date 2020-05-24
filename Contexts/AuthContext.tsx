import React, { createContext, useState } from "react";
import * as firebase from "@react-native-firebase/app";

interface AuthContextProps {
  loggedIn: boolean;
  login: () => void;
  logout: () => void;
}

export const AuthContext = createContext({} as AuthContextProps);

export const AuthProvider = (props) => {
  const [loggedIn, setLoggedIn] = useState<boolean>(false);

  const login = () => {
    setLoggedIn(true);
  };

  const logout = () => setLoggedIn(false);
  return (
    <AuthContext.Provider value={{ loggedIn, login, logout }}>
      {props.children}
    </AuthContext.Provider>
  );
};
