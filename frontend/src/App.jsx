import { Routes, Route } from 'react-router-dom'
import Login from './pages/login'
import Register from './pages/register'
import ForgotPassword from './pages/forgot-password'
import ResetPassword from './pages/reset-password'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
    </Routes>
  )
}

export default App