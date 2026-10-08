import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const Admin_Api = import.meta.env.VITE_ADMIN_API;
  const emailPattern = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

  const passwordPattern =
    /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z][A-Za-z\d@$!%*?&]{7,}$/;

  const handleSubmit = async (event) => {
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

    if (!password.trim()) {
      setError("Please enter your password.");
      return;
    }

    if (!passwordPattern.test(password)) {
      setError(
        "Please enter atleast 8 character using uppercase, lowercase, number and special character.",
      );
      return;
    }

    try {
      setIsLoading(true);

      const response = await axios.post(
        `${Admin_Api}/login`,
        {
          email,
          password,
        },
        {
          withCredentials: true,
        },
      );

      const data = response.data;
      console.log(data);

      if (data.success === "true" || data.success === true) {
        toast.success(data.message || "Admin login successfully");

        setTimeout(() => {
          navigate("/admin-dashboard");
        }, 1500);

        return;
      }

      toast.error(data.message || "Admin login failed.");
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

  return (
    <div className="h-screen overflow-hidden bg-[#f7fbf8] text-[#173f2a] font-[Arial] flex flex-col animate-[pageFadeIn_0.7s_ease]">
      <main
        className="flex-1 min-h-0 flex items-center justify-center px-5 py-[18px]"
        style={{
          background:
            "radial-gradient(circle at 15% 30%, rgba(78, 160, 105, 0.08), transparent 25%), radial-gradient(circle at 85% 70%, rgba(78, 160, 105, 0.07), transparent 25%), #f7fbf8",
        }}
      >
        <div className="w-full max-w-[460px] px-10 py-[30px] bg-white border border-[#e3eee6] rounded-[18px] shadow-[0_18px_45px_rgba(33,78,50,0.09)] animate-[slideUp_0.7s_ease-out]">
          {/* Header */}
          <div className="text-center mb-[24px]">
            <p className="mb-2 text-[#27834d] text-xs font-bold tracking-[2px]">
              ADMIN PORTAL
            </p>

            <h1 className="mb-[7px] text-[#173f2a] text-[30px] leading-[1.2] font-bold">
              Admin <span className="text-[#27834d]">Login</span>
            </h1>

            <p className="text-[#718277] text-sm leading-[1.5]">
              Sign in to manage your EcoTrack platform.
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-[15px]">
            {/* Email */}
            <div className="flex flex-col gap-[7px]">
              <label
                htmlFor="admin-email"
                className="text-[#294a36] text-sm font-semibold"
              >
                Email Address
              </label>

              <input
                type="email"
                id="admin-email"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  setError("");
                }}
                placeholder="Enter admin email"
                autoComplete="email"
                className="w-full h-[45px] px-[15px] border border-[#d8e5dc] rounded-[9px] outline-none text-[#173f2a] bg-white placeholder:text-[#9aa99f] transition duration-200 focus:border-[#27834d] focus:shadow-[0_0_0_3px_rgba(39,131,77,0.1)]"
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-[7px]">
              <label
                htmlFor="admin-password"
                className="text-[#294a36] text-sm font-semibold"
              >
                Password
              </label>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="admin-password"
                  value={password}
                  onChange={(event) => {
                    setPassword(event.target.value);
                    setError("");
                  }}
                  placeholder="Enter admin password"
                  autoComplete="new-password"
                  className="w-full h-[45px] px-[15px] pr-16 border border-[#d8e5dc] rounded-[9px] outline-none text-[#173f2a] bg-white placeholder:text-[#9aa99f] transition duration-200 focus:border-[#27834d] focus:shadow-[0_0_0_3px_rgba(39,131,77,0.1)] [&::-ms-reveal]:hidden [&::-ms-clear]:hidden"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#27834d] text-xs font-semibold bg-transparent border-0 cursor-pointer"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {/* Forgot Password */}
            <div className="text-right -mt-[5px]">
              <Link
                to="/forgot-password?from=admin"
                className="text-[#27834d] text-[13px] font-semibold no-underline hover:underline"
              >
                Forgot Password?
              </Link>
            </div>

            {/* Error */}
            {error && (
              <div className="px-4 py-3 rounded-[9px] bg-[#fff1f1] border border-[#f2caca] text-[#c53b3b] text-[13px] text-center">
                {error}
              </div>
            )}

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-[45px] mt-0.5 border-0 rounded-[9px] bg-[#27834d] text-white text-[15px] font-semibold cursor-pointer transition duration-200 hover:bg-[#1e6e40] hover:-translate-y-px disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? "Logging in..." : "Admin Login"}
            </button>
          </form>

          {/* Footer */}
          <p className="mt-[17px] text-center text-[#718277] text-[13px]">
            EcoTrack Administration
          </p>
        </div>
      </main>
    </div>
  );
}

export default AdminLogin;
