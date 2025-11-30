// src/routes/PrivateRoute.jsx
import RequireAuth from "./RequireAuth";
export default function PrivateRoute({ children }) {
  return <RequireAuth>{children}</RequireAuth>;
}
