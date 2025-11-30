// src/pages/ForceLogout.jsx
import React, { useEffect } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { Navigate } from "react-router-dom";

export default function ForceLogout() {

  useEffect(() => {
    localStorage.removeItem("isAdmin"); // Clear admin flag
    signOut(auth); // Firebase logout
  }, []);

  return <Navigate to="/login" replace />;
}
