import React, { createContext, useState, useEffect, useContext } from "react";
import * as firebase from "@react-native-firebase/app";
import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import { AuthContextProps, AuthContext } from "./AuthContext";

export interface LocationContextProps {
  exposeLocation(long: number, lat: number): void;
}

export const LocationContext = createContext({} as LocationContextProps);

export const LocationProvider = (props) => {
  const auth: AuthContextProps = useContext(AuthContext);

  const exposeLocation = async (long: number, lat: number) => {
    const userDoc = (
      await firestore()
        .collection("users")
        .where("email", "==", auth.user!.email)
        .get()
    ).docs[0];
    userDoc.ref.update({ long: long, lat: lat });
  };

  useEffect(() => {}, []);

  return (
    <LocationContext.Provider value={{ exposeLocation }}>
      {props.children}
    </LocationContext.Provider>
  );
};
