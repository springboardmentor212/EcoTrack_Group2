import { Routes, Route } from 'react-router-dom'
import Home from './pages/home'
import Login from './pages/login'
import ForgotPassword from './pages/forgot-password'
import ResetPassword from './pages/reset-password'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
    </Routes>
  )
}

export default App