import { Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import Login from "./pages/login";
import Register from "./pages/register";
import ForgotPassword from "./pages/forgot-password";
import Dashboard from "./pages/dashboard";
import Tracking from "./pages/tracking";
import Transportation from "./pages/Transportation";
import Electricity from "./pages/Electricity";
import WasteManagement from "./pages/WasteManagement";

function App() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/tracking" element={<Tracking />} />
            <Route path="/tracking/transportation" element={<Transportation />} />
            <Route path="/tracking/electricity" element={<Electricity />} />
            <Route path="/tracking/waste" element={<WasteManagement />} />

        </Routes>
    );
}

export default App;