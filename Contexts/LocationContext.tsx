import React, { createContext, useState, useEffect, useContext } from "react";
import * as firebase from "firebase";
import "firebase/firestore";
import { firebaseConfig } from "../firebaseConfig";
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
  if (firebase.apps.length === 0) {
    firebase.initializeApp(firebaseConfig);
    const firestore = firebase.firestore();
  }

  const getNearHotspots = (lat: number, long: number): Array<FirePoint> => {
    const geo = geofirex.init(firebase);

    const center = geo.point(lat, long);
    alert(center);
    const radius = 15; //query hotspots in a radius of 15 km
    return [geo.point(0, 0)];
  };

  const exposeLocation = async (lat: number, long: number) => {
    /* const userDoc = (
      await firestore()
        .collection("users")
        .where("email", "==", auth.user!.email)
        .get()
    ).docs[0];
    userDoc.ref.update({ location: geo.point(lat, long) });*/
  };

  useEffect(() => {}, []);

  return (
    <LocationContext.Provider value={{ exposeLocation, getNearHotspots }}>
      {props.children}
    </LocationContext.Provider>
  );
};
