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
<<<<<<< HEAD
=======

import ProtectedRoute from "./components/ProtectedRoute";
>>>>>>> 2527304c88e770269d0904ecbd309dcd9e99b55e

function App() {
  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
<<<<<<< HEAD
      <Route path="/profile" element={<Profile />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/tracking" element={<Tracking />} />
      <Route path="/tracking/transportation" element={<Transportation />} />
      <Route path="/tracking/electricity" element={<Electricity />} />
      <Route path="/tracking/waste" element={<WasteManagement />} />
      <Route path="/sustainability-goals" element={<SustainabilityGoals />} />
=======

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
>>>>>>> 2527304c88e770269d0904ecbd309dcd9e99b55e
    </Routes>
  );
}

export default App;