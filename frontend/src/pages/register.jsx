 import { useState } from "react";
 
function Register() {
   const [formData, setFormData] = useState({
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
  terms: false,
});

const [errors, setErrors] = useState({});
 
  return (
    <div className="min-h-screen bg-white">

      {/* Navbar */}
      <header className="flex items-center justify-between px-8 py-5 border-b">
        <div className="text-2xl font-bold text-green-700">
          EcoTrack
        </div>

        <div className="flex items-center gap-4">
          <button className="text-gray-700 hover:text-green-700">
            Login
          </button>

          <button className="rounded-lg bg-green-700 px-5 py-2 text-white hover:bg-green-800">
            Register
          </button>
        </div>
      </header>


      {/* Registration Section */}
      <main className="flex min-h-[calc(100vh-81px)] items-center justify-center px-4 py-10">

        <div className="w-full max-w-md">

          {/* Heading */}
          <div className="mb-8 text-center">

            <p className="mb-2 text-sm font-semibold tracking-widest text-green-700">
              GET STARTED
            </p>

            <h1 className="text-3xl font-bold text-gray-900">
              Create your{" "}
              <span className="text-green-700">
                EcoTrack
              </span>{" "}
              account
            </h1>

            <p className="mt-3 text-gray-500">
              Start tracking your impact and build a greener future.
            </p>

          </div>


          {/* Registration Form */}
        <form
  className="space-y-5"
  onSubmit={(e) => {
    e.preventDefault();
    console.log(formData);
  }}
>

            {/* Full Name */}
            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Full Name
              </label>

              <input 
  type="text" 
  id="name" 
  name="name" 
  placeholder="Enter your full name"
  value={formData.name}
  onChange={(e) =>
    setFormData({
      ...formData,
      name: e.target.value,
    })
  }
  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100" 
/>
            </div>


            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Email Address
              </label>

              <input 
  type="email" 
  id="email" 
  name="email" 
  placeholder="Enter your email"
  value={formData.email}
  onChange={(e) =>
    setFormData({
      ...formData,
      email: e.target.value,
    })
  }
  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100" 
/>
            </div>


            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Password
              </label>

              <input 
  type="password" 
  id="password" 
  name="password" 
  placeholder="Create a password"
  value={formData.password}
  onChange={(e) =>
    setFormData({
      ...formData,
      password: e.target.value,
    })
  }
  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100" 
/>
            </div>


            {/* Confirm Password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Confirm Password
              </label>

              <input 
  type="password" 
  id="confirmPassword" 
  name="confirmPassword" 
  placeholder="Confirm your password"
  value={formData.confirmPassword}
  onChange={(e) =>
    setFormData({
      ...formData,
      confirmPassword: e.target.value,
    })
  }
  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100" 
/>
            </div>


            {/* Terms */}
            <div className="flex items-start gap-3 text-sm text-gray-600">

              <input 
  type="checkbox" 
  id="terms" 
  name="terms"
  checked={formData.terms}
  onChange={(e) =>
    setFormData({
      ...formData,
      terms: e.target.checked,
    })
  }
  className="mt-1 h-4 w-4 accent-green-700" 
/>

              <label htmlFor="terms">
                I agree to the{" "}
                <a href="#" className="text-green-700 hover:underline">
                  Terms & Conditions
                </a>{" "}
                and{" "}
                <a href="#" className="text-green-700 hover:underline">
                  Privacy Policy
                </a>
              </label>

            </div>


            {/* Create Account */}
            <button
              type="submit"
              className="w-full rounded-lg bg-green-700 py-3 font-semibold text-white transition hover:bg-green-800"
            >
              Create Account
            </button>

          </form>


          {/* Divider */}
          <div className="my-6 flex items-center gap-4">

            <div className="h-px flex-1 bg-gray-200"></div>

            <span className="text-sm text-gray-400">
              OR
            </span>

            <div className="h-px flex-1 bg-gray-200"></div>

          </div>


          {/* Google */}
          <button
            type="button"
            className="flex w-full items-center justify-center gap-3 rounded-lg border border-gray-300 py-3 font-medium text-gray-700 transition hover:bg-gray-50"
          >
            Continue with Google
          </button>


          {/* Login */}
          <p className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <a href="#" className="font-semibold text-green-700 hover:underline">
              Login
            </a>
          </p>

        </div>

      </main>

    </div>
  );
}

export default Register;