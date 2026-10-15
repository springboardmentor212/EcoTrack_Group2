import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function Register() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [step, setStep] = useState("register");
  const [otpExpired, setOtpExpired] = useState(false);
  const [otp, setOtp] = useState("");

  const namePattern = /^(?=.{3,}$)[A-Za-z]+(?: [A-Za-z]+)?$/;

  const emailPattern = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

  const passwordPattern =
    /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z][A-Za-z\d@$!%*?&]{7,}$/;

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (step === "otp") {
      const timer = setTimeout(() => {
        setOtpExpired(true);
      }, 300000);

      return () => clearTimeout(timer);
    }
  }, [step]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    if (!namePattern.test(name)) {
      setError(
        "Name must be at least 3 characters and only one space between words.",
      );
      return;
    }

    if (!email.trim() || !emailPattern.test(email)) {
      setError("Enter a valid email address.");
      return;
    }

    if (!password.trim() || !passwordPattern.test(password)) {
      setError(
        "Please enter atleast 8 character using uppercase, lowercase, number and special character.",
      );
      return;
    }

    if (!location.trim()) {
      setError("Please enter your location.");
      return;
    }

    if (!acceptTerms) {
      setError("Please accept the Terms & Conditions.");
      return;
    }

    try {
      setIsLoading(true);

      const response = await axios.post(
        `${API_URL}/register`,
        {
          name,
          email,
          password,
          location,
        },
        {
          withCredentials: true,
        },
      );

      if (response.data.success) {
        toast.success(response.data.message || "OTP sent successfully");
        setStep("otp");
        setOtp("");
        setOtpExpired(false);
        return;
      }

      setError(response.data.message || "Registration failed");
      toast.error(response.data.message || "Registration failed");
    } catch (err) {
      const message =
        err.response?.data?.message ||
        "Something went wrong. Please try again.";

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
        `${API_URL}/verifyEmail`,
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
        toast.success(data.message || "Email verified successfully");

        setTimeout(() => {
          navigate("/dashboard");
        }, 1500);

        return;
      }

      setOtpExpired(true);
      toast.error(data.message || "Invalid or expired OTP");
    } catch (err) {
      const message = err.response?.data?.message || "Invalid or expired OTP";

      setError(message);
      setOtpExpired(true);
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
        setOtpExpired(false);
        setOtp("");
        toast.success(data.message || "OTP sent again");
        return;
      }

      setOtpExpired(true);
      toast.error(data.message || "Failed to resend OTP");
    } catch (err) {
      const message =
        err.response?.data?.message ||
        "Failed to resend OTP. Please try again.";

      setError(message);
      setOtpExpired(true);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen overflow-hidden bg-[#f7fbf8] text-[#173f2a] font-[Arial] flex flex-col animate-[pageFadeIn_0.7s_ease]">
      <main
        className="flex-1 min-h-0 flex items-center justify-center px-5 py-4"
        style={{
          background:
            "radial-gradient(circle at 15% 30%, rgba(78, 160, 105, 0.08), transparent 25%), radial-gradient(circle at 85% 70%, rgba(78, 160, 105, 0.07), transparent 25%), #f7fbf8",
        }}
      >
        <div
          className={`w-full max-w-[460px] px-8 ${
            step === "otp" ? "py-6" : "py-5"
          } bg-white border border-[#e3eee6] rounded-[20px] shadow-[0_18px_45px_rgba(33,78,50,0.09)] animate-[slideUp_0.7s_ease-out]`}
        >
          <div className="text-center mb-5">
            {step === "otp" && (
              <p className="mb-2 text-[#27834d] text-xs font-bold tracking-[2px]">
                EMAIL VERIFICATION
              </p>
            )}

            <h1 className="mb-2 text-[#173f2a] text-[30px] leading-[1.2] font-bold">
              {step === "otp" ? (
                <>
                  Verify your <span className="text-[#27834d]">email</span>
                </>
              ) : (
                <>
                  Register for <span className="text-[#27834d]">EcoTrack</span>
                </>
              )}
            </h1>

            <p className="text-[#65786c] text-sm leading-[1.5]">
              {step === "otp"
                ? `Enter the OTP sent to ${email}.`
                : "Start your journey toward a greener future."}
            </p>
          </div>

          {step === "otp" ? (
            <form onSubmit={handleVerifyOtp} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
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
                  className="w-full h-[44px] px-4 border border-[#d2e2d7] rounded-[10px] outline-none text-sm text-[#173f2a] bg-white placeholder:text-[#9aa99f] transition duration-200 focus:border-[#27834d] focus:shadow-[0_0_0_3px_rgba(39,131,77,0.12)]"
                />
              </div>

              {error && (
                <div className="px-4 py-2 rounded-[10px] bg-[#fff1f1] border border-[#f2caca] text-[#c53b3b] text-[13px] text-center">
                  {error}
                </div>
              )}

              {!otpExpired ? (
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-[46px] border-0 rounded-[10px] bg-[#27834d] text-white text-[15px] font-semibold cursor-pointer transition duration-200 hover:bg-[#1e6e40] disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Verifying..." : "Verify OTP"}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={isLoading}
                  className="text-[#27834d] text-sm font-semibold bg-transparent border-0 cursor-pointer hover:underline disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Please wait..." : "Resend OTP"}
                </button>
              )}

              <p className="mt-1 text-center text-[#65786c] text-[13px]">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="text-[#27834d] font-semibold no-underline hover:underline"
                >
                  Log in
                </Link>
              </p>
            </form>
          ) : (
            <>
              <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <div className="flex flex-col gap-[6px]">
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
                    onChange={(event) => {
                      setName(event.target.value);
                      setError("");
                    }}
                    placeholder="Enter your full name"
                    className="w-full h-[44px] px-4 border border-[#d2e2d7] rounded-[10px] outline-none text-sm text-[#173f2a] bg-white placeholder:text-[#9aa99f] transition duration-200 focus:border-[#27834d] focus:shadow-[0_0_0_3px_rgba(39,131,77,0.12)]"
                  />
                </div>

                <div className="flex flex-col gap-[6px]">
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
                    placeholder="Enter your email address"
                    autoComplete="email"
                    className="w-full h-[44px] px-4 border border-[#d2e2d7] rounded-[10px] outline-none text-sm text-[#173f2a] bg-white placeholder:text-[#9aa99f] transition duration-200 focus:border-[#27834d] focus:shadow-[0_0_0_3px_rgba(39,131,77,0.12)]"
                  />
                </div>

                <div className="flex flex-col gap-[6px]">
                  <label
                    htmlFor="password"
                    className="text-[#294a36] text-sm font-semibold"
                  >
                    Password
                  </label>

                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      value={password}
                      onChange={(event) => {
                        setPassword(event.target.value);
                        setError("");
                      }}
                      placeholder="Enter your password"
                      autoComplete="new-password"
                      className="w-full h-[44px] px-4 pr-12 border border-[#d2e2d7] rounded-[10px] outline-none text-sm text-[#173f2a] bg-white placeholder:text-[#9aa99f] transition duration-200 focus:border-[#27834d] focus:shadow-[0_0_0_3px_rgba(39,131,77,0.12)]"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#27834d] text-base bg-transparent border-0 cursor-pointer hover:text-[#1e6e40]"
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>

                <div className="flex flex-col gap-[6px]">
                  <label
                    htmlFor="location"
                    className="text-[#294a36] text-sm font-semibold"
                  >
                    Location
                  </label>

                  <input
                    type="text"
                    id="location"
                    value={location}
                    onChange={(event) => {
                      setLocation(event.target.value);
                      setError("");
                    }}
                    placeholder="Enter your location"
                    className="w-full h-[44px] px-4 border border-[#d2e2d7] rounded-[10px] outline-none text-sm text-[#173f2a] bg-white placeholder:text-[#9aa99f] transition duration-200 focus:border-[#27834d] focus:shadow-[0_0_0_3px_rgba(39,131,77,0.12)]"
                  />
                </div>

                {error && (
                  <div className="px-4 py-2 rounded-[10px] bg-[#fff1f1] border border-[#f2caca] text-[#c53b3b] text-[13px] text-center">
                    {error}
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={acceptTerms}
                    onChange={(event) => {
                      setAcceptTerms(event.target.checked);
                      setError("");
                    }}
                    className="h-4 w-4 accent-[#27834d] cursor-pointer"
                  />

                  <label
                    htmlFor="terms"
                    className="text-[13px] text-[#55695c] leading-snug cursor-pointer"
                  >
                    I agree to the Terms & Conditions and Privacy Policy
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-[46px] mt-1 border-0 rounded-[10px] bg-[#27834d] text-white text-[15px] font-semibold cursor-pointer transition duration-200 hover:bg-[#1e6e40] disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Creating account..." : "Create Account"}
                </button>
              </form>

              <div className="flex items-center gap-3 my-4">
                <div className="flex-1 h-px bg-[#e1eae4]" />
              </div>

              <p className="text-center text-[#65786c] text-[13px]">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="text-[#27834d] font-semibold no-underline hover:underline"
                >
                  Log in
                </Link>
              </p>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

export default Register;
