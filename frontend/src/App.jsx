import { Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import Login from "./pages/login";
import Register from "./pages/register";
import ForgotPassword from "./pages/forgot-password";
import Dashboard from "./pages/dashboard";
// import Tracking from "./pages/tracking";
// import SustainabilityGoals from "./pages/sustainability-goals";
// import CommunityChallenges from "./pages/community-challenges";
// import AIInsights from "./pages/ai-insights";
// import Analytics from "./pages/analytics";
// import Reports from "./pages/reports";
// import Rewards from "./pages/rewards";
// import Notifications from "./pages/notifications";
// import Profile from "./pages/profile";
// import Settings from "./pages/settings";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  );
}

export default App;
