import React, { createContext, useState, useEffect, useContext } from "react";
import * as fb from "@react-native-firebase/app";
import firebase from "firebase/app";
import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import { AuthContextProps, AuthContext } from "./AuthContext";
import * as geofirex from "geofirex";
import { GeoFireQuery, FirePoint } from "geofirex";
export interface LocationContextProps {
  exposeLocation(lat: number, long: number): void;
  getNearHotspots(lat: number, long: number): Array<FirePoint>;
}

export const LocationContext = createContext({} as LocationContextProps);

export const LocationProvider = (props) => {
  const auth: AuthContextProps = useContext(AuthContext);

  const geo = geofirex.init(firebase);
  const getNearHotspots = (lat: number, long: number): Array<FirePoint> => {
    const hotspots = firestore().collection("hotspots");
    const center = geo.point(lat, long);
    const radius = 15; //query hotspots in a radius of 15 km
    const query = geo.query(hotspots).within(center, radius, "position");
    return [];
  };

  const exposeLocation = async (lat: number, long: number) => {
    const userDoc = (
      await firestore()
        .collection("users")
        .where("email", "==", auth.user!.email)
        .get()
    ).docs[0];
    userDoc.ref.update({ location: geo.point(lat, long) });
  };

  useEffect(() => {}, []);

  return (
    <LocationContext.Provider value={{ exposeLocation, getNearHotspots }}>
      {props.children}
    </LocationContext.Provider>
  );
};
