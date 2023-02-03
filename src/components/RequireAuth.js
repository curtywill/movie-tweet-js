import { AuthContext } from "../Context";
import { Navigate } from "react-router-dom";
import { useContext } from "react";

export default function RequireAuth({ children }) {
  const { auth } = useContext(AuthContext);
  return auth ? children : <Navigate to="/" />;
}