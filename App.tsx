import React from "react";

import { AuthProvider } from "./Contexts/AuthContext";
import CheckMate from "./HOC/CheckMate";

export default function App() {
  return (
    <AuthProvider>
      <CheckMate />
    </AuthProvider>
  );
}
