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
import AdminProfile from "./pages/admin-profile";
import AdminChallengeManagement from "./pages/admin-challenge-management";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* Home */}
      <Route
        path="/"
        element={
          // <ProtectedRoute>
          <Home />
          // </ProtectedRoute>
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
      {/* Admin Pages */}

      <Route
        path="/admin-profile"
        element={
          <ProtectedRoute>
            <AdminProfile />
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
    </Routes>
  );
}

export default App;
