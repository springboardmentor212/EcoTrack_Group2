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

        // =========================
        // HOME PAGE
        // =========================
        if (location.pathname === "/") {
          // User logged in
          if (data.success && data.role === "user") {
            navigate("/dashboard", { replace: true });
            return;
          }

          // Admin logged in
          if (data.success && data.role === "admin") {
            navigate("/admin-dashboard", { replace: true });
            return;
          }

          // User is NOT logged in
          setAuthorized(true);
          return;
        }

        // =========================
        // USER NOT LOGGED IN
        // =========================
        if (!data.success) {
          navigate("/", { replace: true });
          return;
        }

        // =========================
        // NORMAL USER
        // =========================
        if (data.role === "user") {
          const userRoutes = [
            "/profile",
            "/dashboard",
            "/sustainability-goals",
            "/tracking",
            "/tracking/transportation",
            "/tracking/electricity",
            "/tracking/waste",
            "/community-challenges",
            "/notifications",
            "/settings",
          ];

          if (userRoutes.includes(location.pathname)) {
            setAuthorized(true);
            return;
          }

          // User trying to access admin/unknown page
          navigate("/dashboard", { replace: true });
          return;
        }

        // =========================
        // ADMIN
        // =========================
        if (data.role === "admin") {
          const adminRoutes = [
            "/admin-dashboard",
            "/admin-user-management",
            "/admin-challenge-management",
            "/admin-profile",
            "/admin-reports",
            "/admin-settings",
          ];

          if (adminRoutes.includes(location.pathname)) {
            setAuthorized(true);
            return;
          }

          // Admin trying to access user/unknown page
          navigate("/admin-dashboard", { replace: true });
          return;
        }

        // Unknown role
        navigate("/", { replace: true });
      } catch (error) {
        console.error("checkUser error:", error);

        // Agar checkUser fail ho jaye aur Home hai,
        // to Home ko display kar do
        if (location.pathname === "/") {
          setAuthorized(true);
          return;
        }

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
