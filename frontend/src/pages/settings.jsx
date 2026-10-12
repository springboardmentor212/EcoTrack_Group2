import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const API_URL = import.meta.env.VITE_API_URL;

const notificationOptions = [
  {
    key: "goalSuggestion",
    label: "Goal Suggestions",
    description: "Get suggestions to help you reach your sustainability goals.",
  },
  {
    key: "challengeSuggestion",
    label: "Challenge Suggestions",
    description: "Discover challenges that match your interests.",
  },
  {
    key: "goalReminder",
    label: "Goal Reminders",
    description: "Receive reminders about your active goals.",
  },
  {
    key: "challengeReminder",
    label: "Challenge Reminders",
    description: "Stay updated on your community challenge deadlines.",
  },
  {
    key: "updates",
    label: "Updates",
    description: "Receive important EcoTrack updates.",
  },
];

const defaultPreferences = {
  goalSuggestion: true,
  challengeSuggestion: true,
  goalReminder: true,
  challengeReminder: true,
  updates: true,
};

function Toggle({ checked, onChange, disabled = false, label }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={onChange}
      disabled={disabled}
      className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-green-100 ${checked ? "bg-[#27834d]" : "bg-gray-300"} ${disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer hover:brightness-95"}`}
    >
      <span
        className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform duration-300 ease-in-out ${checked ? "translate-x-6" : "translate-x-1"}`}
      />
    </button>
  );
}

export default function Settings() {
  const navigate = useNavigate();
  const [preferences, setPreferences] = useState(defaultPreferences);
  const [savedPreferences, setSavedPreferences] = useState(defaultPreferences);
  const [savingPreferences, setSavingPreferences] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [showDeletePassword, setShowDeletePassword] = useState(false);
  const [deletingAccount, setDeletingAccount] = useState(false);
  const [requestingPasswordOtp, setRequestingPasswordOtp] = useState(false);

  useEffect(() => {
    const getNotification = async () => {
      try {
        const response = await axios.get(`${API_URL}/notification`, {
          withCredentials: true,
        });
        if (response.data?.success === true) {
          setPreferences(response.data.notificationPreference);
        } else {
          toast.error(
            response.data?.message || "Failed to get notification preferences.",
          );
        }
      } catch (error) {
        toast.error(
          error.response?.data?.message ||
            "Failed to get notification preferences.",
        );
      } finally {
        setSavingPreferences(false);
      }
    };
    getNotification();
  }, []);

  const togglePreference = (key) => {
    if (savingPreferences) return;
    setPreferences((current) => ({ ...current, [key]: !current[key] }));
  };

  const hasChanges = notificationOptions.some(
    ({ key }) => preferences[key] !== savedPreferences[key],
  );

  const handleSavePreferences = async () => {
    if (savingPreferences) return;
    const payload = {
      goalSuggestion: preferences.goalSuggestion,
      challengeSuggestion: preferences.challengeSuggestion,
      goalReminder: preferences.goalReminder,
      challengeReminder: preferences.challengeReminder,
      updates: preferences.updates,
    };
    if (!Object.values(payload).every((value) => typeof value === "boolean")) {
      toast.error("Please check all notification preferences.");
      return;
    }
    setSavingPreferences(true);
    try {
      const response = await axios.patch(`${API_URL}/notification`, payload, {
        withCredentials: true,
      });
      if (response.data?.success === true) {
        setPreferences({ ...payload });
        setSavedPreferences({ ...payload });
        toast.success(
          response.data.message || "Notification preferences saved.",
        );
      } else {
        toast.error(
          response.data?.message || "Failed to save notification preferences.",
        );
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to save notification preferences.",
      );
    } finally {
      setSavingPreferences(false);
    }
  };

  const handleChangePassword = async () => {
    if (requestingPasswordOtp) return;
    setRequestingPasswordOtp(true);
    try {
      const response = await axios.get(`${API_URL}/changePassword`, {
        withCredentials: true,
      });

      if (response.data?.success === true && response.data?.email) {
        toast.success(
          response.data.message || "OTP sent to your registered email.",
        );
        navigate("/forgot-password", {
          state: {
            passwordChange: true,
            email: response.data.email,
          },
        });
      } else {
        toast.error(
          response.data?.message || "Could not send the password-change OTP.",
        );
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Could not send the password-change OTP.",
      );
    } finally {
      setRequestingPasswordOtp(false);
    }
  };

  const handleLogout = async () => {
    try {
      const response = await axios.get(`${API_URL}/logout`, {
        withCredentials: true,
      });
      if (response.data?.success === true) {
        toast.success(response.data.message || "Logged out successfully.");
        navigate("/login", { replace: true });
      } else {
        toast.error(response.data?.message || "Could not log out.");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Logout failed.");
    }
  };

  const passwordPattern =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  const handleDeleteAccount = async (event) => {
    event.preventDefault();
    if (!deletePassword) {
      toast.error("Enter your password to delete your account.");
      return;
    }
    if (!passwordPattern.test(deletePassword)) {
      toast.error(
        "Password must be at least 8 characters and include uppercase, lowercase, a number, and a special character.",
      );
      return;
    }
    setDeletingAccount(true);
    try {
      const response = await axios.delete(`${API_URL}/`, {
        data: { password: deletePassword },
        withCredentials: true,
      });
      if (response.data?.success === true) {
        toast.success(response.data.message || "Account deleted successfully.");
        setShowDeleteModal(false);
        setDeletePassword("");
        navigate("/login", { replace: true });
      } else {
        toast.error(response.data?.message || "Could not delete account.");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Account deletion failed.");
    } finally {
      setDeletingAccount(false);
    }
  };

  return (
    <main className="min-h-screen overflow-hidden bg-[#f5f8f5] px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <header className="mb-8 animate-[settingsFadeDown_.55s_ease-out_both]">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.22em] text-[#27834d]">
            EcoTrack · Personalize
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-[#173f2a] sm:text-4xl">
            Settings
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#718277] sm:text-base">
            Manage your account security and choose how EcoTrack keeps you
            informed.
          </p>
        </header>

        <div className="space-y-6">
          {/* Account */}
          <section
            className="rounded-2xl border border-[#e1ebe4] bg-white p-5 shadow-[0_10px_30px_rgba(33,78,50,0.05)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_35px_rgba(33,78,50,0.09)] animate-[settingsFadeUp_.6s_ease-out_.08s_both] sm:p-6"
            style={{ animationDelay: "80ms" }}
          >
            <div className="mb-6 flex items-start gap-4">
              <div
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#eaf5ed] text-xl text-[#27834d]"
                aria-hidden="true"
              >
                👤
              </div>
              <div>
                <h2 className="text-xl font-semibold text-[#173f2a]">
                  Account
                </h2>
                <p className="mt-1 text-sm leading-5 text-[#718277]">
                  Manage your account information and security.
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex flex-col justify-between gap-4 rounded-xl border border-[#e1ebe4] p-4 transition-colors duration-300 hover:border-[#b8d9c2] hover:bg-[#fbfdfb] sm:flex-row sm:items-center">
                <div>
                  <h3 className="font-semibold text-[#294a36]">
                    Account Information
                  </h3>
                  <p className="mt-1 text-sm text-[#718277]">
                    View your profile and account details.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => navigate("/profile")}
                  className="rounded-lg border border-[#cbd9ce] px-4 py-2.5 text-sm font-semibold text-[#294a36] transition-all duration-200 hover:border-[#27834d] hover:bg-[#eaf5ed] focus:outline-none focus:ring-4 focus:ring-green-100"
                >
                  View Profile
                </button>
              </div>
              <button
                type="button"
                onClick={handleChangePassword}
                disabled={requestingPasswordOtp}
                className="group flex w-full items-center justify-between gap-4 rounded-xl border border-[#e1ebe4] p-4 text-left transition-all duration-300 hover:-translate-y-0.5 hover:border-[#a8d2b5] hover:bg-[#fbfdfb] hover:shadow-sm focus:outline-none focus:ring-4 focus:ring-green-100 disabled:cursor-wait disabled:opacity-70"
              >
                <div>
                  <h3 className="font-semibold text-[#294a36]">
                    Change Password
                  </h3>
                  <p className="mt-1 text-sm leading-5 text-[#718277]">
                    {requestingPasswordOtp
                      ? "Sending an OTP to your registered email..."
                      : "Verify your registered email with an OTP to set a new password."}
                  </p>
                </div>
                <span
                  className="text-xl text-[#27834d] transition-transform duration-200 group-hover:translate-x-1"
                  aria-hidden="true"
                >
                  {requestingPasswordOtp ? "…" : "→"}
                </span>
              </button>
              <div className="flex flex-wrap gap-3 border-t border-[#e8efe9] pt-5">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="rounded-lg border border-[#cbd9ce] px-5 py-2.5 text-sm font-semibold text-[#294a36] transition-all duration-200 hover:border-[#27834d] hover:bg-[#f4faf5] focus:outline-none focus:ring-4 focus:ring-green-100"
                >
                  Logout
                </button>
                <button
                  type="button"
                  onClick={() => setShowDeleteModal(true)}
                  className="rounded-lg border border-red-200 px-5 py-2.5 text-sm font-semibold text-red-600 transition-all duration-200 hover:border-red-300 hover:bg-red-50 focus:outline-none focus:ring-4 focus:ring-red-100"
                >
                  Delete Account
                </button>
              </div>
            </div>
          </section>

          {/* Notifications */}
          <section
            className="rounded-2xl border border-[#e1ebe4] bg-white p-5 shadow-[0_10px_30px_rgba(33,78,50,0.05)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_35px_rgba(33,78,50,0.09)] animate-[settingsFadeUp_.6s_ease-out_.16s_both] sm:p-6"
            style={{ animationDelay: "160ms" }}
          >
            <div className="mb-6 flex items-start gap-4">
              <div
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#eaf5ed] text-xl text-[#27834d]"
                aria-hidden="true"
              >
                🔔
              </div>
              <div>
                <h2 className="text-xl font-semibold text-[#173f2a]">
                  Notifications
                </h2>
                <p className="mt-1 text-sm leading-5 text-[#718277]">
                  Turn each notification type on or off independently.
                </p>
              </div>
            </div>
            <>
              <div className="divide-y divide-[#e8efe9] rounded-xl border border-[#e1ebe4]">
                {notificationOptions.map((option, index) => (
                  <div
                    key={option.key}
                    className="flex items-center justify-between gap-4 p-4 transition-colors duration-200 hover:bg-[#fbfdfb] sm:px-5"
                    style={{
                      animation: `settingsFadeUp .45s ease-out ${index * 70}ms both`,
                    }}
                  >
                    <div className="min-w-0">
                      <h3 className="font-semibold text-[#294a36]">
                        {option.label}
                      </h3>
                      <p className="mt-1 text-sm leading-5 text-[#718277]">
                        {option.description}
                      </p>
                    </div>
                    <Toggle
                      label={option.label}
                      checked={preferences[option.key]}
                      disabled={savingPreferences}
                      onChange={() => togglePreference(option.key)}
                    />
                  </div>
                ))}
              </div>
              <div className="mt-5 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p
                  className="text-xs leading-5 text-[#8a998f]"
                  aria-live="polite"
                >
                  {hasChanges
                    ? "You have unsaved changes."
                    : "Your preferences are up to date."}
                </p>
                <div className="flex flex-col-reverse gap-3 sm:flex-row">
                  <button
                    type="button"
                    onClick={() => setPreferences({ ...savedPreferences })}
                    disabled={!hasChanges || savingPreferences}
                    className="rounded-lg border border-[#cbd9ce] px-4 py-2.5 text-sm font-semibold text-[#294a36] transition-all duration-200 hover:bg-[#f4faf5] disabled:cursor-not-allowed disabled:opacity-45"
                  >
                    Reset Changes
                  </button>
                  <button
                    type="button"
                    onClick={handleSavePreferences}
                    disabled={!hasChanges || savingPreferences}
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#27834d] px-5 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#1e6e40] hover:shadow-md focus:outline-none focus:ring-4 focus:ring-green-100 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none"
                  >
                    {savingPreferences && (
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                    )}
                    {savingPreferences ? "Saving..." : "Save Preferences"}
                  </button>
                </div>
              </div>
            </>
          </section>
        </div>
        <p className="mt-6 pb-4 text-center text-xs text-[#8a998f] animate-[settingsFadeUp_.7s_ease-out_.3s_both]">
          Small choices add up to a more sustainable future.
        </p>
      </div>

      {showDeleteModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#102719]/55 px-4 py-6 backdrop-blur-sm animate-[settingsOverlayIn_.2s_ease-out_both]"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !deletingAccount) {
              setShowDeleteModal(false);
              setDeletePassword("");
            }
          }}
        >
          <form
            onSubmit={handleDeleteAccount}
            className="w-full max-w-md animate-[settingsModalIn_.3s_cubic-bezier(.2,.8,.2,1)_both] rounded-2xl border border-red-100 bg-white p-6 shadow-2xl sm:p-7"
          >
            <div className="mb-5 flex items-start gap-3">
              <div
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-red-50 text-xl font-bold text-red-600"
                aria-hidden="true"
              >
                !
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Delete Account
                </h2>
                <p className="mt-1 text-sm leading-5 text-gray-500">
                  This action cannot be undone. Confirm your password to
                  continue.
                </p>
              </div>
            </div>
            <label
              htmlFor="delete-account-password"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="delete-account-password"
                type={showDeletePassword ? "text" : "password"}
                autoComplete="current-password"
                value={deletePassword}
                onChange={(event) => setDeletePassword(event.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 pr-20 outline-none transition focus:border-[#27834d] focus:ring-4 focus:ring-green-100"
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowDeletePassword((current) => !current)}
                className="absolute inset-y-0 right-3 text-xs font-semibold text-[#27834d]"
              >
                {showDeletePassword ? "Hide" : "Show"}
              </button>
            </div>
            <p className="mt-2 text-xs leading-5 text-gray-500">
              Use at least 8 characters with uppercase, lowercase, a number, and
              a special character.
            </p>
            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                disabled={deletingAccount}
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeletePassword("");
                }}
                className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={deletingAccount}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {deletingAccount && (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                )}
                {deletingAccount ? "Deleting..." : "Confirm Delete"}
              </button>
            </div>
          </form>
        </div>
      )}

      <style>{`
        @keyframes settingsFadeDown { from { opacity: 0; transform: translateY(-12px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes settingsFadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes settingsOverlayIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes settingsModalIn { from { opacity: 0; transform: translateY(12px) scale(.98); } to { opacity: 1; transform: translateY(0) scale(1); } }
        @media (prefers-reduced-motion: reduce) { *, *::before, *::after { animation-duration: .01ms !important; animation-iteration-count: 1 !important; transition-duration: .01ms !important; scroll-behavior: auto !important; } }
      `}</style>
    </main>
  );
}
