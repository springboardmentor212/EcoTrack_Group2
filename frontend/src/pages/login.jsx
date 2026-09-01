import { useState } from 'react'
import { Link } from 'react-router-dom'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
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
        <div className="w-full max-w-[460px] px-10 py-[27px] bg-white border border-[#e3eee6] rounded-[18px] shadow-[0_18px_45px_rgba(33,78,50,0.09)]">

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

              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter your password"
                autoComplete="current-password"
                required
                className="w-full h-[45px] px-[15px] border border-[#d8e5dc] rounded-[9px] outline-none text-[#173f2a] bg-white placeholder:text-[#9aa99f] transition duration-200 focus:border-[#27834d] focus:shadow-[0_0_0_3px_rgba(39,131,77,0.1)]"
              />

              <a
                href="/forgot-password"
                className="self-end mt-px text-[#27834d] text-xs font-semibold no-underline hover:underline"
              >
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              className="w-full h-[45px] mt-0.5 border-0 rounded-[9px] bg-[#27834d] text-white text-[15px] font-semibold cursor-pointer transition duration-200 hover:bg-[#1e6e40] hover:-translate-y-px"
            >
              Login
            </button>
          </form>

          <div className="flex items-center gap-[14px] my-[15px] text-[#9aa99f] text-xs font-semibold">
            <div className="flex-1 h-px bg-[#e1eae4]" />

            <span>OR</span>

            <div className="flex-1 h-px bg-[#e1eae4]" />
          </div>

          <button
            type="button"
            className="w-full h-[45px] flex items-center justify-center gap-[11px] border border-[#d8e5dc] rounded-[9px] bg-white text-[#294a36] text-sm font-semibold cursor-pointer transition duration-200 hover:bg-[#f7fbf8] hover:border-[#b9cfbf]"
          >
            <span className="w-5 h-5 flex items-center justify-center shrink-0">
              <svg
                className="w-5 h-5 block"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill="#4285F4"
                  d="M21.35 12.27c0-.71-.06-1.4-.18-2.05H12v3.88h5.24a4.48 4.48 0 0 1-1.94 2.94v2.45h3.14c1.84-1.69 2.91-4.18 2.91-7.22z"
                />

                <path
                  fill="#34A853"
                  d="M12 21.75c2.63 0 4.84-.87 6.45-2.36l-3.14-2.45c-.87.58-1.98.92-3.31.92-2.54 0-4.69-1.72-5.46-4.03H3.3v2.53A9.75 9.75 0 0 0 12 21.75z"
                />

                <path
                  fill="#FBBC05"
                  d="M6.54 13.83A5.86 5.86 0 0 1 6.23 12c0-.64.11-1.26.31-1.83V7.64H3.3A9.75 9.75 0 0 0 2.25 12c0 1.57.38 3.06 1.05 4.36l3.24-2.53z"
                />

                <path
                  fill="#EA4335"
                  d="M12 6.14c1.43 0 2.71.49 3.72 1.45l2.79-2.79C16.83 3.17 14.63 2.25 12 2.25A9.75 9.75 0 0 0 3.3 7.64l3.24 2.53C7.31 7.86 9.46 6.14 12 6.14z"
                />
              </svg>
            </span>

            <span>
              Continue with Google
            </span>
          </button>

          <p className="mt-[14px] text-center text-[#718277] text-[13px]">
            Don't have an account?{' '}
            <a
              href="/register"
              className="text-[#27834d] font-semibold no-underline hover:underline"
            >
              Create an account
            </a>
          </p>

        </div>
      </main>

    </div>
  )
}

export default Login