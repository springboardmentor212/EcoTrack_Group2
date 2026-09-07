import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useEffect } from "react";

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
  const namePattern = /^(?=.{3,}$)[A-Za-z]+(?: [A-Za-z]+)?$/;

  const emailPattern = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

  const passwordPattern =
    /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z][A-Za-z\d@$!%*?&]{7,}$/;

  const API_URL = import.meta.env.VITE_API_URL;
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  useEffect(() => {
    if (step === "otp") {
      const timer = setTimeout(() => {
        setOtpExpired(true);
      }, 300000); // 300 seconds

      return () => clearTimeout(timer);
    }
  }, [step, setOtpExpired]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log("API_URL =", API_URL);

    setError("");

    if (!namePattern.test(name)) {
      setError("Name must be at least 3 characters and contain only letters.");
      return;
    }

    if (!email.trim() || !emailPattern.test(email)) {
      setError("Enter a valid email address.");
      return;
    }

    if (!password.trim() || !passwordPattern.test(password)) {
      setError(
        "Password must contain uppercase, lowercase, number and special character.",
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
        setTimeout(() => {
          toast.success("OTP sent successfully");
          setStep("otp");
          setIsLoading(false);
        }, 1000); //this is for temprorary purpose, remove it when backend is ready
      } else {
        setError(response.data.message || "Registration failed");
      }
    } catch (error) {
      const message = error.response?.data?.message || "Something went wrong";
      setError(message);
      toast.error(message);
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();

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

      if (data.success) {
        toast.success("Email verified successfully");
        setIsLoading(false);
        setTimeout(() => {
          navigate("/");
        }, 1500);
      } else {
        setOtpExpired(true);
        setIsLoading(false);
        toast.error(data.message);
        setOtpError(data.message || "Invalid or expired OTP");
      }
    } catch (error) {
      setOtpExpired(true);
      setIsLoading(false);
      toast.error(error.response?.data?.message || "Invalid or expired OTP");
    }
  };

  const handleResendOtp = async () => {
    try {
      setIsLoading(true);
      const response = await axios.post(`${API_URL}/resendOtp`, {
        email,
      });

      if (response.data.success) {
        setOtpExpired(false);
        setIsLoading(false);
        toast.success(response.data.message || "OTP sent again");
      } else {
        setIsLoading(false);
        setOtpExpired(true);
        setOtpError(response.data.message || "Failed to resend OTP");
        toast.error(error.response?.data?.message || "Failed to resend OTP");
      }
    } catch (error) {
      setIsLoading(false);
      setOtpExpired(true);
      toast.error(error.response?.data?.message || "Failed to resend OTP");
    }
  };

  return (
    <div className="min-h-screen overflow-y-auto bg-[#f7fbf8] text-[#173f2a] font-[Arial] flex flex-col animate-[pageFadeIn_0.7s_ease]">
      <header className="w-full min-h-[96px] px-[8%] flex items-center justify-between bg-white border-b border-[#e5eee8] relative z-10 shrink-0 shadow-sm">
        <a href="/" className="flex items-center no-underline text-inherit">
          <img
            src="/assets/Ecotrack1.png"
            alt="EcoTrack"
            className="w-[170px] h-auto block transition-transform hover:scale-105"
          />
        </a>

        <div className="flex items-center gap-5">
          <a
            href="/"
            className="text-[#27834d] text-base font-semibold no-underline hover:text-[#1e6e40] px-4 py-2 rounded-lg hover:bg-[#f0f7f2] transition duration-200"
          >
            Login
          </a>

          <a
            href="/register"
            className="px-7 py-3 bg-[#27834d] text-white rounded-xl text-base font-semibold no-underline shadow-md transition duration-200 hover:bg-[#1e6e40] hover:-translate-y-0.5 hover:shadow-lg"
          >
            Register
          </a>
        </div>
      </header>

      <main
        className="flex-1 flex items-center justify-center px-6 py-10"
        style={{
          background:
            "radial-gradient(circle at 15% 30%, rgba(78, 160, 105, 0.08), transparent 25%), radial-gradient(circle at 85% 70%, rgba(78, 160, 105, 0.07), transparent 25%), #f7fbf8",
        }}
      >
        <div
          className={`w-full max-w-[540px] px-10 ${step === "otp" ? "py-6" : "py-10"} bg-white border border-[#e3eee6] rounded-[24px] shadow-[0_20px_50px_rgba(33,78,50,0.11)] animate-[slideUp_0.7s_ease-out]`}
        >
          <div className="text-center mb-7">
            <h1 className="mb-2 text-[#173f2a] text-[34px] leading-[1.2] font-bold">
              {step === "otp" ? (
                "Email Verification"
              ) : (
                <>
                  Register for <span className="text-[#27834d]">EcoTrack</span>
                </>
              )}
            </h1>

            <p className="text-[#65786c] text-base leading-relaxed">
              {step === "otp"
                ? `Enter the OTP sent to ${email}`
                : "Start your journey toward a greener future."}
            </p>
          </div>

          {step === "otp" ? (
            <form onSubmit={handleVerifyOtp} className="flex flex-col gap-5">
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter OTP"
                className="w-full h-[50px] px-4 border border-[#d2e2d7] rounded-[12px]"
              />
              {!otpExpired ? (
                <button
                  type="submit"
                  className="w-full h-[52px] bg-[#27834d] text-white rounded-[12px]"
                >
                  {isLoading ? "Verifying..." : "Verify OTP"}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleResendOtp}
                  className="text-[#27834d] font-semibold"
                >
                  {isLoading ? "Please wait..." : "Resend OTP"}
                </button>
              )}
              ;
              <p className="m-0 text-center text-[#65786c] text-[15px]">
                Already have an account?{" "}
                <a
                  href="/login"
                  className="text-[#27834d] font-semibold no-underline hover:underline ml-1"
                >
                  Log in
                </a>
              </p>
            </form>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-[18px]">
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="name"
                  className="text-[#294a36] text-[15px] font-semibold"
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
                  className="w-full h-[50px] px-4 border border-[#d2e2d7] rounded-[12px] outline-none text-base text-[#173f2a] bg-white placeholder:text-[#9aa99f] transition duration-200 focus:border-[#27834d] focus:shadow-[0_0_0_4px_rgba(39,131,77,0.12)]"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label
                  htmlFor="email"
                  className="text-[#294a36] text-[15px] font-semibold"
                >
                  Email Address
                </label>

                <input
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  autoComplete="email"
                  required
                  className="w-full h-[50px] px-4 border border-[#d2e2d7] rounded-[12px] outline-none text-base text-[#173f2a] bg-white placeholder:text-[#9aa99f] transition duration-200 focus:border-[#27834d] focus:shadow-[0_0_0_4px_rgba(39,131,77,0.12)]"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label
                  htmlFor="password"
                  className="text-[#294a36] text-[15px] font-semibold"
                >
                  Password
                </label>

                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    required
                    className="w-full h-[50px] px-4 pr-12 border border-[#d2e2d7] rounded-[12px] outline-none text-base text-[#173f2a] bg-white placeholder:text-[#9aa99f] transition duration-200 focus:border-[#27834d] focus:shadow-[0_0_0_4px_rgba(39,131,77,0.12)]"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#27834d] text-xl bg-transparent border-0 cursor-pointer p-1 hover:text-[#1e6e40] transition-colors"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label
                  htmlFor="location"
                  className="text-[#294a36] text-[15px] font-semibold"
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
                  className="w-full h-[50px] px-4 border border-[#d2e2d7] rounded-[12px] outline-none text-base text-[#173f2a] bg-white placeholder:text-[#9aa99f] transition duration-200 focus:border-[#27834d] focus:shadow-[0_0_0_4px_rgba(39,131,77,0.12)]"
                />
              </div>

              {error && (
                <div className="px-4 py-3 rounded-[12px] bg-[#fff1f1] border border-[#f2caca] text-[#c53b3b] text-sm text-center font-medium">
                  {error}
                </div>
              )}

              <div className="flex items-center gap-3 pt-1">
                <input
                  type="checkbox"
                  id="terms"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  className="h-5 w-5 accent-[#27834d] cursor-pointer rounded border-gray-300"
                />

                <label
                  htmlFor="terms"
                  className="text-[15px] text-[#55695c] leading-snug cursor-pointer select-none"
                >
                  I agree to the Terms & Conditions and Privacy Policy
                </label>
              </div>

              <button
                type="submit"
                className="w-full h-[52px] mt-2 border-0 rounded-[12px] bg-[#27834d] text-white text-[16px] font-semibold cursor-pointer shadow-md transition duration-200 hover:bg-[#1e6e40] hover:-translate-y-0.5 hover:shadow-lg"
              >
                {isLoading ? "Creating account..." : "Create Account"}
              </button>
            </form>
          )}

          {step !== "otp" && (
            <div className="flex items-center gap-[14px] my-5 text-[#9aa99f] text-xs font-semibold">
              <div className="flex-1 h-px bg-[#e1eae4]" />
            </div>
          )}

          {step !== "otp" && (
            <p className="text-center text-[#65786c] text-[15px]">
              Already have an account?{" "}
              <a
                href="/login"
                className="text-[#27834d] font-semibold no-underline hover:underline ml-1"
              >
                Log in
              </a>
            </p>
          )}
        </div>
      </main>
    </div>
  );
}

export default Register;
