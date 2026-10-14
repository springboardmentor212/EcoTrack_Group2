
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
import UserLayout from "./layouts/UserLayout";
import AdminLayout from "./layouts/AdminLayout";

function App() {
  return (
    <Routes>
      {/* Public pages */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/admin-login" element={<AdminLogin />} />

      {/* Root/home stays protected separately */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />

      {/* User pages */}
      <Route
        element={
          <ProtectedRoute>
            <UserLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/sustainability-goals" element={<SustainabilityGoals />} />
        <Route path="/tracking" element={<Tracking />} />
        <Route path="/tracking/transportation" element={<Transportation />} />
        <Route path="/tracking/electricity" element={<Electricity />} />
        <Route path="/tracking/waste" element={<WasteManagement />} />
        <Route path="/community-challenges" element={<CommunityChallenges />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/settings" element={<Settings />} />
      </Route>

      {/* Admin pages */}
      <Route
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/admin-profile" element={<AdminProfile />} />
        <Route path="/admin-user-management" element={<AdminUserManagement />} />
        <Route
          path="/admin-challenge-management"
          element={<AdminChallengeManagement />}
        />
        <Route path="/admin-reports" element={<AdminReports />} />
        <Route path="/admin-settings" element={<AdminSettings />} />
      </Route>
    </Routes>
  );
}

export default App;