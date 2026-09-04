import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function Register() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [name, setName] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [location, setLocation] = useState('')
  const [acceptTerms, setAcceptTerms] = useState(false)
  const emailPattern =
    /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/

  const passwordPattern =
    /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z][A-Za-z\d@$!%*?&]{8,}$/

  const API_URL = import.meta.env.VITE_API_URL;
  
  
  const handleSubmit = (event) => {
  event.preventDefault()

  setError('')

  if (!email.trim()) {
    setError('Please enter your email address.')
    return
  }

  if (!email.includes('@')) {
    setError('Please enter a valid email address.')
    return
  }

  if (!password.trim()) {
    setError('Please enter your password.')
    return
  }
  if (!acceptTerms) {
  setError('Please accept the Terms & Conditions.')
  return
}
  setIsLoading(true)
 
  setTimeout(() => {
    setIsLoading(false)
  }, 1500)
}

  return (
    <div className="h-screen overflow-hidden bg-[#f7fbf8] text-[#173f2a] font-[Arial] flex flex-col animate-[pageFadeIn_0.7s_ease]">

      <header className="w-full min-h-[90px] px-[7%] flex items-center justify-between bg-white border-b border-[#e5eee8] relative z-10 shrink-0">
        <a href="/" className="flex items-center no-underline text-inherit">
          <img
            src="/assets/Ecotrack1.png"
            alt="EcoTrack"
            className="w-[145px] h-auto block"
          />
        </a>

        <div className="flex items-center gap-[18px]">
          <a
            href="/"
            className="text-[#27834d] text-[15px] font-semibold no-underline hover:text-[#1e6e40]"
          >
            Login
          </a>

          <a
            href="/register"
            className="px-[22px] py-[11px] bg-[#27834d] text-white rounded-lg text-sm font-semibold no-underline transition duration-200 hover:bg-[#1e6e40] hover:-translate-y-px"
          >
            Register
          </a>
        </div>
      </header>

      <main
        className="flex-1 min-h-0 flex items-center justify-center px-5 py-[18px]"
        style={{
          background:
            'radial-gradient(circle at 15% 30%, rgba(78, 160, 105, 0.08), transparent 25%), radial-gradient(circle at 85% 70%, rgba(78, 160, 105, 0.07), transparent 25%), #f7fbf8',
        }}
      >
        <div className="w-full max-w-[460px] px-10 py-[27px] bg-white border border-[#e3eee6] rounded-[18px] shadow-[0_18px_45px_rgba(33,78,50,0.09)] animate-[slideUp_0.7s_ease-out]">

          <div className="text-center mb-[19px]">
            

            <h1 className="mb-[7px] text-[#173f2a] text-[30px] leading-[1.2] font-bold">
              Register for{' '}
              <span className="text-[#27834d]">
                EcoTrack
              </span>
            </h1>

            <p className="text-[#718277] text-sm leading-[1.5]">
              Start your journey toward a greener future.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-[13px]"
          >
            

          
            <div className="flex flex-col gap-[7px]">
              <label
                htmlFor="name"
                className="text-[#294a36] text-sm font-semibold"
              >
                Name
              </label>

              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                required
                className="w-full h-[45px] px-[15px] border border-[#d8e5dc] rounded-[9px] outline-none"
              />
            </div>

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
    name="email"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    placeholder="Enter your email"
    autoComplete="email"
    required
    className="w-full h-[45px] px-[15px] border border-[#d8e5dc] rounded-[9px] outline-none text-[#173f2a] bg-white placeholder:text-[#9aa99f] transition duration-200 focus:border-[#27834d] focus:shadow-[0_0_0_3px_rgba(39,131,77,0.1)]"
  />
</div>

            <div className="flex flex-col gap-[7px]">
              <label
                htmlFor="password"
                className="text-[#294a36] text-sm font-semibold"
              >
                Password
              </label>

              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  required
                  className="w-full h-[45px] px-[15px] pr-16 border border-[#d8e5dc] rounded-[9px] outline-none text-[#173f2a] bg-white placeholder:text-[#9aa99f] transition duration-200 focus:border-[#27834d] focus:shadow-[0_0_0_3px_rgba(39,131,77,0.1)]"
                />

                <button
  type="button"
  onClick={() => setShowPassword(!showPassword)}
  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#27834d] text-lg bg-transparent border-0 cursor-pointer"
>
  {showPassword ? <FaEyeSlash /> : <FaEye />}
</button>
              </div>

              <div className="flex flex-col gap-[7px]">
  <label
    htmlFor="confirmPassword"
    className="text-[#294a36] text-sm font-semibold"
  >
    Confirm Password
  </label>

  <div className="relative">
    <input
      type={showConfirmPassword ? 'text' : 'password'}
      id="confirmPassword"
      value={confirmPassword}
      onChange={(e) => setConfirmPassword(e.target.value)}
      placeholder="Confirm your password"
      required
      className="w-full h-[45px] px-[15px] pr-16 border border-[#d8e5dc] rounded-[9px] outline-none text-[#173f2a] bg-white"
    />

    <button
      type="button"
      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#27834d] text-lg bg-transparent border-0 cursor-pointer"
    >
      {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
    </button>
  </div>
</div>
              
            </div>

            <div className="flex flex-col gap-[7px]">
              <label
                htmlFor="location"
                className="text-[#294a36] text-sm font-semibold"
              >
                Location
              </label>

              <input
                type="text"
                id="location"
                name="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Enter your location"
                autoComplete="address-level2"
                required
                className="w-full h-[45px] px-[15px] border border-[#d8e5dc] rounded-[9px] outline-none text-[#173f2a] bg-white placeholder:text-[#9aa99f] transition duration-200 focus:border-[#27834d] focus:shadow-[0_0_0_3px_rgba(39,131,77,0.1)]"
              />
            </div>

            {error && (
              <div className="px-4 py-3 rounded-[9px] bg-[#fff1f1] border border-[#f2caca] text-[#c53b3b] text-[13px] text-center">
                {error}
              </div>
            )}
            <div className="flex items-start gap-3">
  <input
    type="checkbox"
    id="terms"
    checked={acceptTerms}
    onChange={(e) => setAcceptTerms(e.target.checked)}
    className="mt-1 h-4 w-4 accent-[#27834d] cursor-pointer"
  />

  <label
    htmlFor="terms"
    className="text-sm text-[#718277] leading-5"
  >
    I agree to the{" "}
      Terms & Conditions
    and{" "}
      Privacy Policy
  </label>
</div>
            <button
              type="submit"
              className="w-full h-[45px] mt-0.5 border-0 rounded-[9px] bg-[#27834d] text-white text-[15px] font-semibold cursor-pointer transition duration-200 hover:bg-[#1e6e40] hover:-translate-y-px"
            >
              {isLoading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <div className="flex items-center gap-[14px] my-[15px] text-[#9aa99f] text-xs font-semibold">
            <div className="flex-1 h-px bg-[#e1eae4]" />
          </div>

          

          <p className="mt-[14px] text-center text-[#718277] text-[13px]">
            Already have an account?{' '}
            <a
              href="/login"
              className="text-[#27834d] font-semibold no-underline hover:underline"
            >
              Log in
            </a>
          </p>

        </div>
      </main>

    </div>
  )
}

export default Register