// ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import api from "../api";
import { REFRESH_TOKEN, ACCESS_TOKEN } from "../constants";
import { useState, useEffect } from "react";

function ProtectedRoute({ children }) {
  const [isAuthorized, setIsAuthorized] = useState(null);

  useEffect(() => {
    let isMounted = true; // to prevent state update on unmounted component

    const authenticate = async () => {
      const token = localStorage.getItem(ACCESS_TOKEN);
      if (!token) {
        if (isMounted) setIsAuthorized(false);
        return;
      }

      try {
        const decoded = jwtDecode(token);
        const now = Date.now() / 1000;

        if (decoded.exp < now) {
          // Access token expired, try refreshing
          await refreshToken(isMounted);
        } else {
          if (isMounted) setIsAuthorized(true);
        }
      } catch (err) {
        console.error("Invalid access token:", err);
        if (isMounted) setIsAuthorized(false);
      }
    };

    const refreshToken = async (isMountedFlag) => {
      const refreshToken = localStorage.getItem(REFRESH_TOKEN);
      if (!refreshToken) {
        if (isMountedFlag) setIsAuthorized(false);
        return;
      }

      try {
        const res = await api.post("/api/token/refresh/", { refresh: refreshToken });
        if (res.status === 200) {
          localStorage.setItem(ACCESS_TOKEN, res.data.access);
          if (isMountedFlag) setIsAuthorized(true);
        } else {
          if (isMountedFlag) setIsAuthorized(false);
        }
      } catch (error) {
        console.error("Refresh token failed:", error);
        if (isMountedFlag) setIsAuthorized(false);
      }
    };

    authenticate();

    return () => {
      isMounted = false;
    };
  }, []);

  if (isAuthorized === null) {
    return <div>Loading...</div>;
  }

  return isAuthorized ? children : <Navigate to="/login" replace />;
}

export default ProtectedRoute;
