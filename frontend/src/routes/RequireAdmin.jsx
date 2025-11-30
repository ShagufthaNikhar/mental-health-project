// src/routes/RequireAdmin.jsx
import { Navigate } from "react-router-dom";
import { auth } from "../firebaseConfig";
import { useEffect, useState } from "react";

export default function RequireAdmin({ children }) {
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    const unsub = auth.onAuthStateChanged((u) => setUser(u));
    return () => unsub();
  }, []);

  if (user === undefined) return <div>Loading...</div>;

  // ⭐ Admin validation (change email if needed)
  const isAdmin = user?.email === "admin@gmail.com";

  if (!isAdmin) return <Navigate to="/admin-login" replace />;

  return children;
}
