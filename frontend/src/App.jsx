import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Register from "./pages/register";
import SustainabilityGoals from "./pages/SustainabilityGoals";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SustainabilityGoals />} />
        <Route path="/goals" element={<SustainabilityGoals />} />
        <Route path="/sustainability-goals" element={<SustainabilityGoals />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
