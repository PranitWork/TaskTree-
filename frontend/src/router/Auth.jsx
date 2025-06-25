import { Navigate } from "react-router-dom";

export const Auth = ({ children }) => {
  let user = null;
  try {
    user = JSON.parse(localStorage.getItem("users"));
  } catch (e) {
    user = null;
  }
  return user ? children : <Navigate to="/login" />;
};

export const UnAuth = ({ children }) => {
  let user = null;
  try {
    user = JSON.parse(localStorage.getItem("users"));
  } catch (e) {
    user = null;
  }
  return !user ? children : <Navigate to="/" />;
};
