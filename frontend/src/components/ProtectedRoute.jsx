
import { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const userRoutes = [
  "/dashboard",
  "/profile",
  "/sustainability-goals",
  "/tracking",
  "/tracking/transportation",
  "/tracking/electricity",
  "/tracking/waste",
  "/community-challenges",
  "/notifications",
  "/settings",
];

const adminRoutes = [
  "/admin-dashboard",
  "/admin-profile",
  "/admin-user-management",
  "/admin-challenge-management",
  "/admin-reports",
  "/admin-settings",
];

function ProtectedRoute({ children }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const checkUser = async () => {
      setLoading(true);
      setAuthorized(false);

      try {
        const { data } = await axios.get(`${API_URL}/checkUser`, {
          withCredentials: true,
        });

        if (!isMounted) return;

        // Root route: redirect logged-in users to their dashboards.
        if (location.pathname === "/") {
          if (data.success && data.role === "user") {
            navigate("/dashboard", { replace: true });
            return;
          }

          if (data.success && data.role === "admin") {
            navigate("/admin-dashboard", { replace: true });
            return;
          }

          // Preserve the existing behavior for the root page.
          setAuthorized(true);
          return;
        }

        // All non-root protected routes require a valid session.
        if (!data.success) {
          navigate("/", { replace: true });
          return;
        }

        // User routes can only be opened by users.
        if (data.role === "user") {
          if (userRoutes.includes(location.pathname)) {
            setAuthorized(true);
            return;
          }

          navigate("/dashboard", { replace: true });
          return;
        }

        // Admin routes can only be opened by admins.
        if (data.role === "admin") {
          if (adminRoutes.includes(location.pathname)) {
            setAuthorized(true);
            return;
          }

          navigate("/admin-dashboard", { replace: true });
          return;
        }

        // Unknown role: return to the root route.
        navigate("/", { replace: true });
      } catch (error) {
        if (!isMounted) return;

        console.error("checkUser error:", error);

        // Preserve the current root-route fallback behavior.
        if (location.pathname === "/") {
          setAuthorized(true);
          return;
        }

        navigate("/", { replace: true });
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    checkUser();

    return () => {
      isMounted = false;
    };
  }, [location.pathname, navigate]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f7fbf8]">
        <p className="text-sm text-[#5c7064]">Checking access...</p>
      </div>
    );
  }

  return authorized ? (children || <Outlet />) : null;
}

export default ProtectedRoute;