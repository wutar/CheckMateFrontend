import React, { createContext, useState, useEffect } from "react";
import * as firebase from "@react-native-firebase/app";
import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";

export interface AuthContextProps {
  user: FirebaseAuthTypes.User | null;
  register: (password: string, email: string, username: string) => void;
  login: (password: string, email: string) => void;
  logout: () => void;
  error: string;
}

export const AuthContext = createContext({} as AuthContextProps);

export const AuthProvider = (props) => {
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const [error, setError] = useState<string>("");

  const register = (password: string, email: string, username: string) => {
    auth()
      .createUserWithEmailAndPassword(email, password)
      .then(async (data) => {
        await data.user.updateProfile({
          displayName: username,
        });
        firestore()
          .collection("users")
          .add({ email: email.toLowerCase(), name: username });
      })
      .catch((error) => {
        switch (error.code) {
          case "auth/email-already-exists":
            setError(
              "The provided email is already in use by an existing user."
            );
            break;
          case "auth/invalid-email":
            setError(
              "The provided value for the email user property is invalid."
            );
            break;
          case "auth/invalid-password":
            setError(
              "The provided password is invalid. It must at least six characters long."
            );
            break;
          default:
            setError("Could not register.");
            break;
        }
        setError(error.message);
      });
  };

  const login = (password: string, email: string) => {
    auth()
      .signInWithEmailAndPassword(email, password)
      .catch((error) => {
        setError("Invalid credentials!");
      });
  };

  const logout = () => {
    auth().signOut();
  };

  useEffect(() => {
    auth().onAuthStateChanged((userState) => {
      setUser(userState);
    });
  }, []);

  return (
    <AuthContext.Provider value={{ user, register, login, logout, error }}>
      {props.children}
    </AuthContext.Provider>
  );
};
