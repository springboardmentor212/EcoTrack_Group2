import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [otp, setOtp] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const navigate = useNavigate()

  const emailPattern =
    /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/

  const passwordPattern =
    /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z][A-Za-z\d@$!%*?&]{8,}$/

  const API_URL = 'http://localhost:3000/user'

  const handleSubmit = async (event) => {
    event.preventDefault()

    setError('')

    if (!email.trim()) {
      setError('Please enter your email address.')
      return
    }

    if (!emailPattern.test(email)) {
      setError('Please enter a valid email address.')
      return
    }

    if (!password.trim()) {
      setError('Please enter your password.')
      return
    }

    if (!passwordPattern.test(password)) {
      setError(
        'Password must contain uppercase, lowercase, number, special character and follow the required format.'
      )
      return
    }

    try {
      setIsLoading(true)

      const response = await axios.post(
        `${API_URL}/login`,
        {
          email,
          password,
        },
        {
          withCredentials: true,
        }
      )

      const data = response.data

      if (data.success === 'true') {
        setSuccess(true)
        toast.success(data.message)

        setTimeout(() => {
          navigate('/')
        }, 1000)

        return
      }

      if (data.success === 'unverifed') {
        setSuccess('unverifed')
        toast.info(data.message)
        return
      }

      toast.error(data.message || 'Login failed.')
    } catch (err) {
      const message =
        err.response?.data?.message || 'Something went wrong. Please try again.'

      setError(message)
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyOtp = async (event) => {
    event.preventDefault()

    setError('')

    if (!otp.trim()) {
      setError('Please enter the OTP.')
      return
    }

    try {
      setIsLoading(true)

      const response = await axios.post(
        `${API_URL}/verifyEmail`,
        {
          email,
          code: otp,
        },
        {
          withCredentials: true,
        }
      )

      const data = response.data

      if (data.success === true) {
        setSuccess(true)
        toast.success(data.message)

        setTimeout(() => {
          navigate('/')
        }, 1000)

        return
      }

      toast.error(data.message || 'OTP verification failed.')
    } catch (err) {
      const message =
        err.response?.data?.message || 'OTP verification failed.'

      setError(message)
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="h-screen overflow-hidden bg-[#f7fbf8] text-[#173f2a] font-[Arial] flex flex-col animate-[pageFadeIn_0.7s_ease]">

      <header className="w-full min-h-[76px] px-[7%] flex items-center justify-between bg-white border-b border-[#e5eee8] relative z-10 shrink-0">
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

          {success === false && (
            <>
              <div className="text-center mb-[19px]">
                <p className="mb-2 text-[#27834d] text-xs font-bold tracking-[2px]">
                  WELCOME BACK
                </p>

                <h1 className="mb-[7px] text-[#173f2a] text-[30px] leading-[1.2] font-bold">
                  Login to{' '}
                  <span className="text-[#27834d]">
                    EcoTrack
                  </span>
                </h1>

                <p className="text-[#718277] text-sm leading-[1.5]">
                  Continue your journey toward a greener future.
                </p>
              </div>

              <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-[13px]"
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
                    name="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="Enter your email"
                    autoComplete="email"
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
                      className="w-full h-[45px] px-[15px] pr-16 border border-[#d8e5dc] rounded-[9px] outline-none text-[#173f2a] bg-white placeholder:text-[#9aa99f] transition duration-200 focus:border-[#27834d] focus:shadow-[0_0_0_3px_rgba(39,131,77,0.1)]"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#27834d] text-xs font-semibold bg-transparent border-0 cursor-pointer"
                    >
                      {showPassword ? 'Hide' : 'Show'}
                    </button>
                  </div>

                  <a
                    href="/forgot-password"
                    className="self-end mt-px text-[#27834d] text-xs font-semibold no-underline hover:underline"
                  >
                    Forgot password?
                  </a>
                </div>

                {error && (
                  <div className="px-4 py-3 rounded-[9px] bg-[#fff1f1] border border-[#f2caca] text-[#c53b3b] text-[13px] text-center">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-[45px] mt-0.5 border-0 rounded-[9px] bg-[#27834d] text-white text-[15px] font-semibold cursor-pointer transition duration-200 hover:bg-[#1e6e40] hover:-translate-y-px disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Logging in...' : 'Login'}
                </button>
              </form>

              <p className="mt-[14px] text-center text-[#718277] text-[13px]">
                Don't have an account?{' '}
                <a
                  href="/register"
                  className="text-[#27834d] font-semibold no-underline hover:underline"
                >
                  Create an account
                </a>
              </p>
            </>
          )}

          {success === 'unverifed' && (
            <>
              <div className="text-center mb-[22px]">
                <p className="mb-2 text-[#27834d] text-xs font-bold tracking-[2px]">
                  EMAIL VERIFICATION
                </p>

                <h1 className="mb-[7px] text-[#173f2a] text-[30px] leading-[1.2] font-bold">
                  Verify your email
                </h1>

                <p className="text-[#718277] text-sm leading-[1.5]">
                  Enter the OTP sent to your email address.
                </p>
              </div>

              <form
                onSubmit={handleVerifyOtp}
                className="flex flex-col gap-[13px]"
              >
                <div className="flex flex-col gap-[7px]">
                  <label
                    htmlFor="otp"
                    className="text-[#294a36] text-sm font-semibold"
                  >
                    OTP
                  </label>

                  <input
                    type="text"
                    id="otp"
                    value={otp}
                    onChange={(event) => setOtp(event.target.value)}
                    placeholder="Enter OTP"
                    className="w-full h-[45px] px-[15px] border border-[#d8e5dc] rounded-[9px] outline-none text-[#173f2a] bg-white placeholder:text-[#9aa99f] transition duration-200 focus:border-[#27834d] focus:shadow-[0_0_0_3px_rgba(39,131,77,0.1)]"
                  />
                </div>

                {error && (
                  <div className="px-4 py-3 rounded-[9px] bg-[#fff1f1] border border-[#f2caca] text-[#c53b3b] text-[13px] text-center">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-[45px] border-0 rounded-[9px] bg-[#27834d] text-white text-[15px] font-semibold cursor-pointer transition duration-200 hover:bg-[#1e6e40] hover:-translate-y-px disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Verifying...' : 'Verify OTP'}
                </button>
              </form>
            </>
          )}
        </div>
      </main>
    </div>
  )
}

export default Login