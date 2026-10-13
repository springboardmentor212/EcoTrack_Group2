import { Routes, Route } from "react-router-dom";

import Home from "./pages/home";
import Login from "./pages/login";
import Register from "./pages/register";
import ForgotPassword from "./pages/forgot-password";
import Dashboard from "./pages/dashboard";
import Tracking from "./pages/tracking";
import Transportation from "./pages/transportation";
import WasteManagement from "./pages/waste-management";
import Electricity from "./pages/electricity";
import Profile from "./pages/profile";
import SustainabilityGoals from "./pages/sustainability-goals";
import CommunityChallenges from "./pages/community-challenges";
import Notifications from "./pages/notifications";
import AdminProfile from "./pages/admin-profile";
import AdminUserManagement from "./pages/admin-user-management";
import AdminChallengeManagement from "./pages/admin-challenge-management";
import AdminLogin from "./pages/admin-login";
import AdminReports from "./pages/admin-reports";
import AdminDashboard from "./pages/admin-dashboard";
import Settings from "./pages/settings";
import AdminSettings from "./pages/admin-settings";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/admin-login" element={<AdminLogin />} />

      {/* Home */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />

      {/* User Pages */}
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      {/* Sustainability Goals */}
      <Route
        path="/sustainability-goals"
        element={
          <ProtectedRoute>
            <SustainabilityGoals />
          </ProtectedRoute>
        }
      />

      {/* Tracking */}
      <Route
        path="/tracking"
        element={
          <ProtectedRoute>
            <Tracking />
          </ProtectedRoute>
        }
      />

      <Route
        path="/tracking/transportation"
        element={
          <ProtectedRoute>
            <Transportation />
          </ProtectedRoute>
        }
      />

      <Route
        path="/tracking/electricity"
        element={
          <ProtectedRoute>
            <Electricity />
          </ProtectedRoute>
        }
      />

      <Route
        path="/tracking/waste"
        element={
          <ProtectedRoute>
            <WasteManagement />
          </ProtectedRoute>
        }
      />

      <Route
        path="/community-challenges"
        element={
          <ProtectedRoute>
            <CommunityChallenges />
          </ProtectedRoute>
        }
      />

      <Route
        path="/notifications"
        element={
          <ProtectedRoute>
            <Notifications />
          </ProtectedRoute>
        }
      />

      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        }
      />

      {/* admin page */}
      <Route
        path="/admin-dashboard"
        element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin-profile"
        element={
          <ProtectedRoute>
            <AdminProfile />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin-user-management"
        element={
          <ProtectedRoute>
            <AdminUserManagement />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin-challenge-management"
        element={
          <ProtectedRoute>
            <AdminChallengeManagement />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin-reports"
        element={
          <ProtectedRoute>
            <AdminReports />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin-settings"
        element={
          <ProtectedRoute>
            <AdminSettings />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
