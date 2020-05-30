import React from "react";

import { AuthProvider } from "./Contexts/AuthContext";
import { LocationProvider } from "./Contexts/LocationContext";

import CheckMate from "./HOC/CheckMate";

export default function App() {
  return (
    <AuthProvider>
      <LocationProvider>
        <CheckMate />
      </LocationProvider>
    </AuthProvider>
  );
}
