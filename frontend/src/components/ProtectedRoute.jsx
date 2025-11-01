import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, roleRequired }) {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    return <Navigate to="/signin" />;
  }

  if (roleRequired && user.role !== roleRequired) {
    return <Navigate to="/signin" />;
  }

  return children;
}
