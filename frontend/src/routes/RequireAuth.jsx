// src/routes/RequireAuth.jsx
import { Navigate } from "react-router-dom";
import { auth } from "../firebaseConfig";
import { useEffect, useState } from "react";

export default function RequireAuth({ children }) {
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    const unsub = auth.onAuthStateChanged((u) => setUser(u));
    return () => unsub();
  }, []);

  if (user === undefined) return <div>Loading...</div>;

  if (!user) return <Navigate to="/login" replace />;

  return children;
}
