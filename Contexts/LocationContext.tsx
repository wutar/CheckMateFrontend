import React, { createContext, useState, useEffect, useContext } from "react";
import * as firebase from "firebase";
import "firebase/firestore";
import { firebaseConfig } from "../firebaseConfig";
import { AuthContextProps, AuthContext } from "./AuthContext";
import * as geofirex from "geofirex";

import { GeoFireQuery, FirePoint } from "geofirex";
import { Observable } from "rxjs";
import Geolocation from "@react-native-community/geolocation";
import RNReactNativeLocationServicesSettings from "react-native-location-services-settings";

export interface LocationContextProps {
  exposeLocation(lat: number, long: number): void;
  getNearHotspots(lat: number, long: number): Promise<any>;
  currentLongitude: number;
  currentLatitude: number;
  hotspots: Array<Hotspot>;
  nearUsers: Array<User>;
}

interface Hotspot {
  hitMetaData: object;
  id: number;
  position: {
    geohash: string;
    geopoint: {
      longitude: number;
      latitude: number;
    };
  };
}

interface User {
  hitMetadata: {
    distance: number;
    bearing: number;
  };
  name: string;
  position: {
    geohash: string;
    geopoint: {
      longitude: number;
      latitude: number;
    };
  };
}

export const LocationContext = createContext({} as LocationContextProps);
export const LocationProvider = (props) => {
  const [currentLongitude, setCurrentLongitude] = useState(0);
  const [currentLatitude, setCurrentLatitude] = useState(0);
  const [locationEnabled, setLocationEnabled] = useState(false);
  const [hotspots, setHotspots] = useState<Array<Hotspot>>([]);
  const [nearUsers, setNearUsers] = useState<Array<User>>([]);

  const auth: AuthContextProps = useContext(AuthContext);
  if (firebase.apps.length === 0) {
    firebase.initializeApp(firebaseConfig);
    const firestore = firebase.firestore();
  }
  const geo = geofirex.init(firebase);

  const getNearHotspots = (lat: number, long: number): Promise<any> => {
    const hotspotsRef = firebase.firestore().collection("hotspots");
    const center = geo.point(currentLatitude, currentLongitude);
    const radius = 5; // query hotspots in a radius of 5 km
    const query = geo.query(hotspotsRef).within(center, radius, "position");
    const items = geofirex.get(query);
    return items;
  };

  const getLocation = (): void => {
    Geolocation.watchPosition(
      (position) => {
        setCurrentLongitude(position.coords.longitude);
        setCurrentLatitude(position.coords.latitude);
        exposeLocation(position.coords.latitude, position.coords.longitude);
      },
      (error) => {
        alert(error);
        getLocation();
      },
      {
        enableHighAccuracy: false,
        timeout: 1000 * 60 * 1, // 1 min (1000 ms * 60 sec * 1 minute = 60 000ms)
        maximumAge: 1000 * 60 * 15, // 15min
      }
    );
  };

  const getNearUsers = (
    lat: number,
    long: number,
    radius: number
  ): Promise<any> => {
    const users = firebase.firestore().collection("users");
    const center = geo.point(currentLatitude, currentLongitude);
    const query = geo.query(users).within(center, radius, "location");
    const items = geofirex.get(query);
    return items;
  };

  const exposeLocation = async (lat: number, long: number) => {
    const userDoc = (
      await firebase
        .firestore()
        .collection("users")
        .where("email", "==", auth.user!.email)
        .get()
    ).docs[0];
    userDoc.ref.update({ location: geo.point(lat, long) });
  };

  useEffect(() => {
    if (!locationEnabled) {
      RNReactNativeLocationServicesSettings.checkStatus("high_accuracy").then(
        (res) => {
          if (!res.enabled) {
            RNReactNativeLocationServicesSettings.askForEnabling((res) => {
              if (res) {
                setLocationEnabled(true);
              }
            });
          } else {
            setLocationEnabled(true);
          }
        }
      );
    } else {
      getLocation();
      if (currentLongitude !== 0 && currentLatitude !== 0) {
        getNearHotspots(currentLatitude, currentLongitude)
          .then((hotspotsFromQuery) => {
            setHotspots(hotspotsFromQuery);
          })
          .catch((error) => {
            alert(error);
          });
        exposeLocation(currentLatitude, currentLongitude);
        getNearUsers(currentLatitude, currentLongitude, 5)
          .then((usersFromQuery) => {
            setNearUsers(usersFromQuery);
          })
          .catch((error) => {
            alert(error);
          });
      }
    }
    return () => {};
  }, [currentLatitude, currentLongitude, locationEnabled]);

  return (
    <LocationContext.Provider
      value={{
        exposeLocation,
        getNearHotspots,
        currentLatitude,
        currentLongitude,
        hotspots,
        nearUsers,
      }}
    >
      {props.children}
    </LocationContext.Provider>
  );
};
