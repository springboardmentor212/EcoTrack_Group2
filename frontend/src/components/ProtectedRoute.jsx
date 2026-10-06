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
          if (location.pathname === "/") {
            setAuthorized(true);
          } else {
            navigate("/", { replace: true });
          }

          return;
        }

        // Normal user
        if (data.role === "user") {
          // Home → Dashboard
          if (location.pathname === "/") {
            navigate("/dashboard", { replace: true });
            return;
          }

          // All other user pages are allowed
          setAuthorized(true);
          return;
        }

        // Admin
        if (data.role === "admin") {
          const adminRoutes = [
            "/admin-dashboard",
            "/admin-challenge-management",
        ];

        if (adminRoutes.includes(location.pathname)) {
          setAuthorized(true);
          return;
        }

        navigate("/admin-dashboard", { replace: true });
        return;
      }

        // Unknown role
        navigate("/", { replace: true });
      } catch (error) {
        console.error("checkUser error:", error);

        if (location.pathname === "/") {
          setAuthorized(true);
        } else {
          navigate("/", { replace: true });
        }
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