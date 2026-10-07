import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

function ProtectedRoute({ children }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/checkUser`, {
          withCredentials: true,
        });

        console.log("checkUser response:", data);
        console.log("Current path:", location.pathname);

        // User is not logged in
        if (!data.success) {
          navigate("/", { replace: true });
          return;
        }

        // Normal user
        if (data.role === "user") {
          const userRoutes = [
            "/",
            "/profile",
            "/dashboard",
            "/sustainability-goals",
            "/tracking",
            "/tracking/transportation",
            "/tracking/electricity",
            "/tracking/waste",
            "/community-challenges",
          ];

          if (userRoutes.includes(location.pathname)) {
            if (location.pathname === "/") {
              navigate("/dashboard", { replace: true });
              return;
            }

            setAuthorized(true);
            return;
          }

          // User trying to access admin page
          navigate("/dashboard", { replace: true });
          return;
        }

        // Admin
        if (data.role === "admin") {
          const adminRoutes = [
            "/admin-dashboard",
            "/admin-user-management",
            "/admin-challenge-management",
            "/admin-profile,"
          ];

          if (adminRoutes.includes(location.pathname)) {
            setAuthorized(true);
            return;
          }

          // Admin trying to access user page
          navigate("/admin-dashboard", { replace: true });
          return;
        }

        // Unknown role
        navigate("/", { replace: true });
      } catch (error) {
        console.error("checkUser error:", error);
        navigate("/", { replace: true });
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, [location.pathname, navigate]);

  if (loading) {
    return null;
  }

  return authorized ? children : null;
}

export default ProtectedRoute;