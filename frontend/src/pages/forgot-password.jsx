import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'

function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const navigate = useNavigate()
  const handleSubmit = (event) => {
  event.preventDefault()

  if (email.trim()) {
    setMessage('Password reset instructions sent successfully.')

    setTimeout(() => {
      navigate('/reset-password')
    }, 1500)
  }
}

  return (
    <div className="h-screen overflow-hidden bg-[#f7fbf8] text-[#173f2a] font-[Arial] flex flex-col">

      <header className="w-full h-[76px] px-[7%] flex items-center justify-between bg-white border-b border-[#e5eee8] shrink-0">
        <Link to="/" className="flex items-center no-underline">
          <img
            src="/assets/Ecotrack1.png"
            alt="EcoTrack"
            className="w-[145px] h-auto block"
          />
        </Link>

        <div className="flex items-center gap-[18px]">
          <Link
            to="/login"
            className="text-[#27834d] text-[15px] font-semibold no-underline hover:text-[#1e6e40]"
          >
            Login
          </Link>

          <Link
            to="/register"
            className="px-[22px] py-[11px] bg-[#27834d] text-white rounded-lg text-sm font-semibold no-underline transition duration-200 hover:bg-[#1e6e40]"
          >
            Register
          </Link>
        </div>
      </header>

      <main
        className="flex-1 min-h-0 flex items-center justify-center px-5 py-[18px]"
        style={{
          background:
            'radial-gradient(circle at 15% 30%, rgba(78, 160, 105, 0.08), transparent 25%), radial-gradient(circle at 85% 70%, rgba(78, 160, 105, 0.07), transparent 25%), #f7fbf8',
        }}
      >
        <div className="w-full max-w-[460px] px-10 py-9 bg-white border border-[#e3eee6] rounded-[18px] shadow-[0_18px_45px_rgba(33,78,50,0.09)]">

          <div className="text-center mb-7">

            <p className="mb-2 text-[#27834d] text-xs font-bold tracking-[2px]">
              PASSWORD RECOVERY
            </p>

            <h1 className="mb-3 text-[#173f2a] text-[30px] leading-[1.2] font-bold">
              Forgot your <span className="text-[#27834d]">password?</span>
            </h1>

            <p className="text-[#718277] text-sm leading-[1.6]">
              Don't worry. Enter your email address and we'll help you reset your password.
            </p>

          </div>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-5"
          >

            <div className="flex flex-col gap-[7px]">

              <label
                htmlFor="email"
                className="text-[#294a36] text-sm font-semibold"
              >
                Email Address
              </label>

              <input
                type="email"
                id="email"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value)
                  setMessage('')
                }}
                placeholder="Enter your email"
                autoComplete="email"
                required
                className="w-full h-[45px] px-[15px] border border-[#d8e5dc] rounded-[9px] outline-none text-[#173f2a] bg-white placeholder:text-[#9aa99f] transition duration-200 focus:border-[#27834d] focus:shadow-[0_0_0_3px_rgba(39,131,77,0.1)]"
              />

            </div>

            {message && (
              <div className="px-4 py-3 rounded-[9px] bg-[#edf8f0] border border-[#cde8d4] text-[#27834d] text-[13px] text-center">
                {message}
              </div>
            )}

            <button
              type="submit"
              className="w-full h-[45px] border-0 rounded-[9px] bg-[#27834d] text-white text-[15px] font-semibold cursor-pointer transition duration-200 hover:bg-[#1e6e40] hover:-translate-y-px"
            >
              Send Reset Link
            </button>

          </form>

          <div className="mt-6 text-center">

            <Link
              to="/login"
              className="text-[#27834d] text-[13px] font-semibold no-underline hover:underline"
            >
              ← Back to Login
            </Link>

          </div>

        </div>
      </main>

    </div>
  )
}

export default ForgotPassword