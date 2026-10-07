import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState("forgot");
  const [otpExpired, setOtpExpired] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

const isAdminReset =
  new URLSearchParams(location.search).get("from") === "admin";

  const emailPattern = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

  const passwordPattern =
    /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z][A-Za-z\d@$!%*?&]{7,}$/;

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (step === "otp") {
      const timer = setTimeout(() => {
        setOtpExpired(true);
      }, 300000); // 300 seconds

      return () => clearTimeout(timer);
    }
  }, [step, setOtpExpired]);

  const handleSendOtp = async (event) => {
    event.preventDefault();

    setError("");

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    if (!emailPattern.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    try {
      setIsLoading(true);

      const response = await axios.post(
        `${API_URL}/resendOtp`,
        {
          email,
        },
        {
          withCredentials: true,
        },
      );

      const data = response.data;

      if (data.success === true) {
        setOtp("");
        toast.success(data.message);
        setStep("otp");
        return;
      }

      toast.error(data.message || "Failed to send OTP.");
    } catch (err) {
      const message =
        err.response?.data?.message || "Failed to send OTP. Please try again.";

      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (event) => {
    event.preventDefault();

    setError("");

    if (!otp.trim()) {
      setError("Please enter the OTP.");
      return;
    }

    try {
      setIsLoading(true);

      const response = await axios.post(
        `${API_URL}/verifyEmailForResetPassword`,
        {
          email,
          code: otp,
        },
        {
          withCredentials: true,
        },
      );

      const data = response.data;

      if (data.success === true) {
        toast.success(data.message);
        setStep("reset");
        return;
      }

      setOtpExpired(true);
      toast.error(data.message || "OTP verification failed.");
    } catch (err) {
      const message = err.response?.data?.message || "OTP verification failed.";
      setOtpExpired(true);
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setError("");

    try {
      setIsLoading(true);

      const response = await axios.post(
        `${API_URL}/resendOtp`,
        {
          email,
        },
        {
          withCredentials: true,
        },
      );

      const data = response.data;

      if (data.success === true) {
        setOtp("");
        setOtpExpired(false);
        toast.success(data.message);
        return;
      }

      setOtpExpired(true);
      toast.error(data.message || "Failed to resend OTP.");
    } catch (err) {
      const message =
        err.response?.data?.message ||
        "Failed to resend OTP. Please try again.";

      setOtpExpired(true);
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (event) => {
    event.preventDefault();

    setError("");

    if (!newPassword.trim() || !confirmPassword.trim()) {
      setError("Please fill in all password fields.");
      return;
    }

    if (!passwordPattern.test(newPassword)) {
      setError(
        "Password must contain at least 8 characters, including uppercase, lowercase, number and special character.",
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setIsLoading(true);

      const response = await axios.patch(
        `${API_URL}/resetPassword`,
        {
          email,
          password: newPassword,
          confirmPassword,
        },
        {
          withCredentials: true,
        },
      );

      const data = response.data;

      if (data.success === true) {
        toast.success(data.message);

        setTimeout(() => {
          navigate(isAdminReset ? "/admin-login" : "/login");
        }, 1500);

        return;
      }

      toast.error(data.message || "Password reset failed.");
    } catch (err) {
      const message =
        err.response?.data?.message ||
        "Password reset failed. Please try again.";

      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen overflow-hidden bg-[#f7fbf8] text-[#173f2a] font-[Arial] flex flex-col animate-[pageFadeIn_0.7s_ease]">
      <main
        className="flex-1 min-h-0 flex items-center justify-center px-5 py-[18px]"
        style={{
          background:
            "radial-gradient(circle at 15% 30%, rgba(78, 160, 105, 0.08), transparent 25%), radial-gradient(circle at 85% 70%, rgba(78, 160, 105, 0.07), transparent 25%), #f7fbf8",
        }}
      >
        <div className="w-full max-w-[460px] px-10 py-8 bg-white border border-[#e3eee6] rounded-[18px] shadow-[0_18px_45px_rgba(33,78,50,0.09)] animate-[slideUp_0.7s_ease-out]">
          {step === "forgot" && (
            <>
              <div className="text-center mb-7">
                <p className="mb-2 text-[#27834d] text-xs font-bold tracking-[2px]">
                  PASSWORD RECOVERY
                </p>

                <h1 className="mb-3 text-[#173f2a] text-[30px] leading-[1.2] font-bold">
                  Forgot your <span className="text-[#27834d]">password?</span>
                </h1>

                <p className="text-[#718277] text-sm leading-[1.6]">
                  Enter the your email address so we send otp on you email to
                  verify your email.
                </p>
              </div>

              <form onSubmit={handleSendOtp} className="flex flex-col gap-5">
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
                      setEmail(event.target.value);
                      setError("");
                    }}
                    placeholder="Enter your email"
                    autoComplete="email"
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
                  {isLoading ? "Sending OTP..." : "Send OTP"}
                </button>
              </form>
            </>
          )}

          {step === "otp" && (
            <>
              <div className="text-center mb-7">
                <p className="mb-2 text-[#27834d] text-xs font-bold tracking-[2px]">
                  OTP VERIFICATION
                </p>

                <h1 className="mb-3 text-[#173f2a] text-[30px] leading-[1.2] font-bold">
                  Verify your <span className="text-[#27834d]">email</span>
                </h1>

                <p className="text-[#718277] text-sm leading-[1.6]">
                  Enter the OTP sent to your {email}.
                </p>
              </div>

              <form onSubmit={handleVerifyOtp} className="flex flex-col gap-5">
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
                    onChange={(event) => {
                      setOtp(event.target.value);
                      setError("");
                    }}
                    placeholder="Enter OTP"
                    className="w-full h-[45px] px-[15px] border border-[#d8e5dc] rounded-[9px] outline-none text-[#173f2a] bg-white placeholder:text-[#9aa99f] transition duration-200 focus:border-[#27834d] focus:shadow-[0_0_0_3px_rgba(39,131,77,0.1)]"
                  />
                </div>

                {error && (
                  <div className="px-4 py-3 rounded-[9px] bg-[#fff1f1] border border-[#f2caca] text-[#c53b3b] text-[13px] text-center">
                    {error}
                  </div>
                )}

                {!otpExpired ? (
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-[45px] border-0 rounded-[9px] bg-[#27834d] text-white text-[15px] font-semibold cursor-pointer transition duration-200 hover:bg-[#1e6e40] hover:-translate-y-px disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isLoading ? "Verifying..." : "Verify OTP"}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={isLoading}
                    className="text-[#27834d] text-[13px] font-semibold bg-transparent border-0 cursor-pointer hover:underline disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isLoading ? "Please wait..." : "Resend OTP"}
                  </button>
                )}
              </form>
            </>
          )}

          {step === "reset" && (
            <>
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

              <form
                onSubmit={handleResetPassword}
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
                      type={showNewPassword ? "text" : "password"}
                      id="newPassword"
                      value={newPassword}
                      onChange={(event) => {
                        setNewPassword(event.target.value);
                        setError("");
                      }}
                      placeholder="Enter new password"
                      className="w-full h-[45px] px-[15px] pr-14 border border-[#d8e5dc] rounded-[9px] outline-none text-[#173f2a] bg-white placeholder:text-[#9aa99f] focus:border-[#27834d] focus:shadow-[0_0_0_3px_rgba(39,131,77,0.1)]"
                    />

                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#27834d] text-xs font-semibold bg-transparent border-0 cursor-pointer"
                    >
                      {showNewPassword ? "Hide" : "Show"}
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
                      type={showConfirmPassword ? "text" : "password"}
                      id="confirmPassword"
                      value={confirmPassword}
                      onChange={(event) => {
                        setConfirmPassword(event.target.value);
                        setError("");
                      }}
                      placeholder="Confirm new password"
                      className="w-full h-[45px] px-[15px] pr-14 border border-[#d8e5dc] rounded-[9px] outline-none text-[#173f2a] bg-white placeholder:text-[#9aa99f] focus:border-[#27834d] focus:shadow-[0_0_0_3px_rgba(39,131,77,0.1)]"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#27834d] text-xs font-semibold bg-transparent border-0 cursor-pointer"
                    >
                      {showConfirmPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="px-4 py-3 rounded-[9px] bg-[#fff1f1] border border-[#f2caca] text-[#c53b3b] text-[13px] text-center">
                    {error}
                  </div>
                )}

                <p className="text-[#718277] text-xs leading-relaxed">
                  Your password must contain at least 8 characters, including
                  uppercase, lowercase, number and special character.
                </p>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-[45px] border-0 rounded-[9px] bg-[#27834d] text-white text-[15px] font-semibold cursor-pointer transition duration-200 hover:bg-[#1e6e40] hover:-translate-y-px disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Resetting Password..." : "Reset Password"}
                </button>
              </form>
            </>
          )}

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
  );
}

export default ForgotPassword;
