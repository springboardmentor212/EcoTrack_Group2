import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

function ResetPassword() {
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const navigate = useNavigate()

 const handleSubmit = (event) => {
  event.preventDefault()

  setError('')

  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/

  if (!passwordRegex.test(newPassword)) {
    setError(
      'Password must contain at least 8 characters, including uppercase, lowercase, number and special character.'
    )
    return
  }

  if (newPassword !== confirmPassword) {
    setError('Passwords do not match.')
    return
  }

  setSuccess(true)

  setTimeout(() => {
    navigate('/login')
  }, 2000)
}

  return (
    <div className="h-screen overflow-hidden bg-[#f7fbf8] text-[#173f2a] font-[Arial] flex flex-col">

      <header className="w-full h-[76px] px-[7%] flex items-center justify-between bg-white border-b border-[#e5eee8] shrink-0">
        <Link to="/login" className="flex items-center no-underline">
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
        <div className="w-full max-w-[460px] px-10 py-8 bg-white border border-[#e3eee6] rounded-[18px] shadow-[0_18px_45px_rgba(33,78,50,0.09)]">

          <div className="text-center mb-6">
            <p className="mb-2 text-[#27834d] text-xs font-bold tracking-[2px]">
              CREATE NEW PASSWORD
            </p>

            <h1 className="mb-2 text-[#173f2a] text-[30px] leading-[1.2] font-bold">
              Reset your <span className="text-[#27834d]">password</span>
            </h1>

            <p className="text-[#718277] text-sm leading-[1.5]">
              Create a new secure password for your EcoTrack account.
            </p>
          </div>

          {!success ? (
            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-4"
            >
              <div className="flex flex-col gap-[7px]">
                <label
                  htmlFor="newPassword"
                  className="text-[#294a36] text-sm font-semibold"
                >
                  New Password
                </label>

                <div className="relative">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    id="newPassword"
                    value={newPassword}
                    onChange={(event) => setNewPassword(event.target.value)}
                    placeholder="Enter new password"
                    required
                    className="w-full h-[45px] px-[15px] pr-14 border border-[#d8e5dc] rounded-[9px] outline-none text-[#173f2a] bg-white placeholder:text-[#9aa99f] focus:border-[#27834d] focus:shadow-[0_0_0_3px_rgba(39,131,77,0.1)]"
                  />

                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#27834d] text-xs font-semibold bg-transparent border-0 cursor-pointer"
                  >
                    {showNewPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-[7px]">
                <label
                  htmlFor="confirmPassword"
                  className="text-[#294a36] text-sm font-semibold"
                >
                  Confirm New Password
                </label>

                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    placeholder="Confirm new password"
                    required
                    className="w-full h-[45px] px-[15px] pr-14 border border-[#d8e5dc] rounded-[9px] outline-none text-[#173f2a] bg-white placeholder:text-[#9aa99f] focus:border-[#27834d] focus:shadow-[0_0_0_3px_rgba(39,131,77,0.1)]"
                  />

                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#27834d] text-xs font-semibold bg-transparent border-0 cursor-pointer"
                  >
                    {showConfirmPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>

              {error && (
                <div className="px-4 py-3 rounded-[9px] bg-[#fff1f1] border border-[#f2caca] text-[#c53b3b] text-[13px] text-center">
                  {error}
                </div>
              )}

              <p className="text-[#718277] text-xs leading-relaxed">
                Your password must contain at least 6 characters.
              </p>

              <button
                type="submit"
                className="w-full h-[45px] border-0 rounded-[9px] bg-[#27834d] text-white text-[15px] font-semibold cursor-pointer transition duration-200 hover:bg-[#1e6e40] hover:-translate-y-px"
              >
                Reset Password
              </button>
            </form>
          ) : (
            <div className="text-center">
              <div className="px-5 py-4 rounded-[9px] bg-[#edf8f0] border border-[#cde8d4] text-[#27834d] text-sm leading-relaxed">
                Your password has been reset successfully.
                <br />
                Redirecting you to the Login page...
              </div>
            </div>
          )}

          {!success && (
            <div className="mt-6 text-center">
              <Link
                to="/login"
                className="text-[#27834d] text-[13px] font-semibold no-underline hover:underline"
              >
                ← Back to Login
              </Link>
            </div>
          )}

        </div>
      </main>
    </div>
  )
}

export default ResetPassword