import "react-native-gesture-handler";

import React, { Fragment, useEffect } from "react";

import { AuthProvider } from "./Contexts/AuthContext";
import { LocationProvider } from "./Contexts/LocationContext";

import CheckMate from "./HOC/CheckMate";
import { decode, encode } from "base-64";
import { YellowBox } from "react-native";
import SplashScreen from "react-native-splash-screen";

if (!global.btoa) {
  global.btoa = encode;
}

if (!global.atob) {
  global.atob = decode;
}
YellowBox.ignoreWarnings(["Setting a timer"]);

export default function App() {
  useEffect(() => {
    SplashScreen.hide();
  }, []);
  return (
    <AuthProvider>
      <LocationProvider>
        <CheckMate />
      </LocationProvider>
    </AuthProvider>
  );
}
