// src/routes/PrivateAdminRoute.jsx
import RequireAdmin from "./RequireAdmin";

export default function PrivateAdminRoute({ children }) {
  return <RequireAdmin>{children}</RequireAdmin>;
}
