import React, { createContext, useState, useEffect, useContext } from "react";
import * as firebase from "firebase";
import "firebase/firestore";
import { firebaseConfig } from "../firebaseConfig";
import { AuthContextProps, AuthContext } from "./AuthContext";
import * as geofirex from "geofirex";

import { GeoFireQuery, FirePoint } from "geofirex";
import { Observable } from "rxjs";
export interface LocationContextProps {
  exposeLocation(lat: number, long: number): void;
  getNearHotspots(lat: number, long: number): Promise<any>;
}

export const LocationContext = createContext({} as LocationContextProps);
export const LocationProvider = (props) => {
  const auth: AuthContextProps = useContext(AuthContext);
  if (firebase.apps.length === 0) {
    firebase.initializeApp(firebaseConfig);
    const firestore = firebase.firestore();
  }

  const getNearHotspots = (lat: number, long: number): Promise<any> => {
    const hotspots = firebase.firestore().collection("hotspots");
    const geo = geofirex.init(firebase);
    const center = geo.point(lat, long);
    const radius = 5; // query hotspots in a radius of 5 km
    const query = geo.query(hotspots).within(center, radius, "position");
    const items = geofirex.get(query);
    return items;
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
