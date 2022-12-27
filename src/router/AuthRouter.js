import { useContext } from "react";
import React from "react";
import { useLocation, Navigate, Redirect } from "react-router-dom";

const accessToken = localStorage.getItem("accessToken");

let AuthContext = React.createContext(accessToken);

function useAuth() {
  return useContext(AuthContext);
}

function RequireAuth({ children }) {
  let auth = useAuth();
  let location = useLocation();
  // console.log('auth: ', auth);
  // console.log('useLocation: ', location);
  if (!auth) {
    // return <Navigate to="/" state={{ from: location }} replace />;
    return <Redirect to='/login' />;
  }

  return children;
}

export default RequireAuth;
