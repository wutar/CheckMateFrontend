import React from "react";

import { AuthProvider } from "./Contexts/AuthContext";
import { LocationProvider } from "./Contexts/LocationContext";

import CheckMate from "./HOC/CheckMate";
import { decode, encode } from "base-64";

if (!global.btoa) {
  global.btoa = encode;
}

if (!global.atob) {
  global.atob = decode;
}
console.ignoredYellowBox = ["Setting a timer"];

export default function App() {
  return (
    <AuthProvider>
      <LocationProvider>
        <CheckMate />
      </LocationProvider>
    </AuthProvider>
  );
}
