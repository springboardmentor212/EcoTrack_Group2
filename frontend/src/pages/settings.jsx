import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const sustainabilityOptions = [
  "Small Daily Changes",
  "Weekly Challenges",
  "Reduce Emissions",
  "Reduce Wastes",
  "Sustainable Waste Disposal",
  "Sustainable Travel",
  "Sustainable Efficient Electricity",
  "Carbon Footprints"
];

const environmentalInterests = [
  "Transportation",
  "Electricity",
  "Waste Management",
  "Build Sustainable Habits"
];

const personalGoalOptions = [
  "Short term goals",
  "Long term goals",
  "Measurable progress",
  "Habit-based goals",
  "Emission reduction goals",
  "Resource-saving goals"
];

const notificationOptions = [
  "Reminders",
  "Goals",
  "Challenges",
  "Leaderboards",
  "Reports",
  "Rewards",
  "Updates"
];

function Toggle({ checked, onChange, disabled = false }) {
  return (
    <button
      type="button"
      onClick={onChange}
      disabled={disabled}
      className={`relative h-6 w-11 rounded-full transition-all duration-300 ${
        checked ? "bg-green-600" : "bg-gray-300"
      } ${
        disabled
          ? "cursor-not-allowed opacity-60"
          : "cursor-pointer hover:scale-105"
      }`}
    >
      <span
        className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition-all duration-300 ${
          checked ? "left-6" : "left-1"
        }`}
      />
    </button>
  );
}

function Settings() {
  const navigate = useNavigate();

  const [isVisible, setIsVisible] = useState(false);

  const [sustainability, setSustainability] = useState([]);
  const [interests, setInterests] = useState([]);
  const [personalGoals, setPersonalGoals] = useState([]);

  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  const [notifications, setNotifications] = useState({
    Reminders: false,
    Goals: false,
    Challenges: false,
    Leaderboards: false,
    Reports: false,
    Rewards: false,
    Updates: false
  });

  const [aiRecommendations, setAiRecommendations] = useState(false);
  const [profileVisibility, setProfileVisibility] = useState(false);

  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const [newEmail, setNewEmail] = useState("");
  const [emailOtp, setEmailOtp] = useState("");
  const [emailStep, setEmailStep] = useState("email");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const toggleSelection = (value, setter) => {
    setter((current) =>
      current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value]
    );
  };

  const toggleNotification = (value) => {
    if (!notificationsEnabled) {
      return;
    }

    setNotifications((current) => ({
      ...current,
      [value]: !current[value]
    }));
  };

  const handleNotificationsToggle = () => {
    const nextValue = !notificationsEnabled;

    setNotificationsEnabled(nextValue);

    if (!nextValue) {
      setNotifications({
        Reminders: false,
        Goals: false,
        Challenges: false,
        Leaderboards: false,
        Reports: false,
        Rewards: false,
        Updates: false
      });
    }
  };

  const closeEmailModal = () => {
    setShowEmailModal(false);
    setNewEmail("");
    setEmailOtp("");
    setEmailStep("email");
  };

  const handleEmailContinue = () => {
    if (!newEmail.trim()) {
      return;
    }

    setEmailStep("otp");
  };

  const handleEmailVerify = () => {
    if (!emailOtp.trim()) {
      return;
    }

    closeEmailModal();
  };

  const closePasswordModal = () => {
    setShowPasswordModal(false);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const handlePasswordChange = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      return;
    }

    if (newPassword !== confirmPassword) {
      return;
    }

    closePasswordModal();
  };

  const handleLogout = () => {
    navigate("/");
  };

  const handleDeleteAccount = () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone."
    );

    if (confirmed) {
      console.log("Delete account");
    }
  };

  return (
    <div
      className={`min-h-screen bg-gray-50 px-4 py-6 transition-all duration-700 md:px-8 ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
      }`}
    >
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 transition-all duration-700">
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="mt-2 text-sm text-gray-500">
            Manage your Account
          </p>
        </div>

        <div className="space-y-6">
          <section className="rounded-2xl bg-white p-6 shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-md">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Account
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Manage your account information and security.
              </p>
            </div>

            <div className="space-y-4">
              <div className="rounded-xl border border-gray-200 p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-green-300 hover:shadow-sm">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h3 className="font-medium text-gray-900">
                      Account Information
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      View your account details.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => navigate("/profile")}
                    className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-all duration-300 hover:-translate-y-0.5 hover:bg-gray-50 active:scale-95"
                  >
                    View Profile
                  </button>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <button
                  type="button"
                  onClick={() => setShowEmailModal(true)}
                  className="rounded-xl border border-gray-200 p-4 text-left transition-all duration-300 hover:-translate-y-1 hover:border-green-500 hover:bg-green-50 hover:shadow-sm active:scale-[0.99]"
                >
                  <h3 className="font-medium text-gray-900">
                    Change Email
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Change your email and verify the new address.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setShowPasswordModal(true)}
                  className="rounded-xl border border-gray-200 p-4 text-left transition-all duration-300 hover:-translate-y-1 hover:border-green-500 hover:bg-green-50 hover:shadow-sm active:scale-[0.99]"
                >
                  <h3 className="font-medium text-gray-900">
                    Change Password
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Update your account password securely.
                  </p>
                </button>
              </div>

              <div className="border-t border-gray-200 pt-5">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 transition-all duration-300 hover:-translate-y-0.5 hover:bg-gray-50 active:scale-95"
                >
                  Logout
                </button>

                <button
                  type="button"
                  onClick={handleDeleteAccount}
                  className="ml-3 rounded-lg border border-red-200 px-5 py-2.5 text-sm font-medium text-red-600 transition-all duration-300 hover:-translate-y-0.5 hover:bg-red-50 active:scale-95"
                >
                  Delete Account
                </button>
              </div>
            </div>
          </section>

          <section
            className="rounded-2xl bg-white p-6 shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-md"
            style={{ transitionDelay: "100ms" }}
          >
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Notifications
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Control which notifications you receive.
                </p>
              </div>

              <Toggle
                checked={notificationsEnabled}
                onChange={handleNotificationsToggle}
              />
            </div>

            <div
              className={`rounded-xl border border-gray-200 transition-all duration-300 ${
                !notificationsEnabled ? "opacity-50" : ""
              }`}
            >
              {notificationOptions.map((option) => (
                <div
                  key={option}
                  className="flex items-center justify-between gap-4 border-b border-gray-100 px-4 py-4 last:border-b-0 transition-all duration-300 hover:bg-gray-50"
                >
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {option}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Receive {option.toLowerCase()} notifications.
                    </p>
                  </div>

                  <Toggle
                    checked={notificationsEnabled && notifications[option]}
                    disabled={!notificationsEnabled}
                    onChange={() => toggleNotification(option)}
                  />
                </div>
              ))}
            </div>
          </section>

          <section
            className="rounded-2xl bg-white p-6 shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-md"
            style={{ transitionDelay: "150ms" }}
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  AI Recommendations
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Allow EcoTrack to provide personalized recommendations.
                </p>
              </div>

              <Toggle
                checked={aiRecommendations}
                onChange={() => setAiRecommendations(!aiRecommendations)}
              />
            </div>
          </section>

          <section
            className="rounded-2xl bg-white p-6 shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-md"
            style={{ transitionDelay: "200ms" }}
          >
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Privacy
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Control how your profile is visible to other users.
              </p>
            </div>

            <div className="flex items-center justify-between gap-4 rounded-xl border border-gray-200 p-4 transition-all duration-300 hover:border-gray-300 hover:shadow-sm">
              <div>
                <h3 className="font-medium text-gray-900">
                  Profile Visibility
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Allow your profile to be visible to other users.
                </p>
              </div>

              <Toggle
                checked={profileVisibility}
                onChange={() => setProfileVisibility(!profileVisibility)}
              />
            </div>
          </section>

          <section
            className="rounded-2xl bg-white p-6 shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-md"
            style={{ transitionDelay: "250ms" }}
          >
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Sustainability Preferences
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Select the sustainability activities and outcomes you prefer.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {sustainabilityOptions.map((option) => {
                const selected = sustainability.includes(option);

                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() =>
                      toggleSelection(option, setSustainability)
                    }
                    className={`rounded-xl border p-4 text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-sm active:scale-[0.99] ${
                      selected
                        ? "border-green-600 bg-green-50 shadow-sm"
                        : "border-gray-200 bg-white hover:border-green-400"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span
                        className={`font-medium transition-colors duration-300 ${
                          selected ? "text-green-700" : "text-gray-800"
                        }`}
                      >
                        {option}
                      </span>

                      <span
                        className={`flex h-5 w-5 items-center justify-center rounded-full border transition-all duration-300 ${
                          selected
                            ? "scale-110 border-green-600 bg-green-600 text-white"
                            : "border-gray-300"
                        }`}
                      >
                        <span
                          className={`transition-all duration-300 ${
                            selected
                              ? "scale-100 opacity-100"
                              : "scale-50 opacity-0"
                          }`}
                        >
                          ✓
                        </span>
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          <section
            className="rounded-2xl bg-white p-6 shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-md"
            style={{ transitionDelay: "300ms" }}
          >
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Environmental Interests
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Choose the environmental areas you are interested in.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {environmentalInterests.map((option) => {
                const selected = interests.includes(option);

                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => toggleSelection(option, setInterests)}
                    className={`rounded-xl border p-4 text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-sm active:scale-[0.99] ${
                      selected
                        ? "border-green-600 bg-green-50 shadow-sm"
                        : "border-gray-200 bg-white hover:border-green-400"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span
                        className={`font-medium transition-colors duration-300 ${
                          selected ? "text-green-700" : "text-gray-800"
                        }`}
                      >
                        {option}
                      </span>

                      <span
                        className={`flex h-5 w-5 items-center justify-center rounded-full border transition-all duration-300 ${
                          selected
                            ? "scale-110 border-green-600 bg-green-600 text-white"
                            : "border-gray-300"
                        }`}
                      >
                        <span
                          className={`transition-all duration-300 ${
                            selected
                              ? "scale-100 opacity-100"
                              : "scale-50 opacity-0"
                          }`}
                        >
                          ✓
                        </span>
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          <section
            className="rounded-2xl bg-white p-6 shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-md"
            style={{ transitionDelay: "350ms" }}
          >
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Personal Goals Preferences
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Choose the type of goals you would like EcoTrack to suggest.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {personalGoalOptions.map((option) => {
                const selected = personalGoals.includes(option);

                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() =>
                      toggleSelection(option, setPersonalGoals)
                    }
                    className={`rounded-xl border p-4 text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-sm active:scale-[0.99] ${
                      selected
                        ? "border-green-600 bg-green-50 shadow-sm"
                        : "border-gray-200 bg-white hover:border-green-400"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span
                        className={`font-medium transition-colors duration-300 ${
                          selected ? "text-green-700" : "text-gray-800"
                        }`}
                      >
                        {option}
                      </span>

                      <span
                        className={`flex h-5 w-5 items-center justify-center rounded-full border transition-all duration-300 ${
                          selected
                            ? "scale-110 border-green-600 bg-green-600 text-white"
                            : "border-gray-300"
                        }`}
                      >
                        <span
                          className={`transition-all duration-300 ${
                            selected
                              ? "scale-100 opacity-100"
                              : "scale-50 opacity-0"
                          }`}
                        >
                          ✓
                        </span>
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>
        </div>
      </div>

      {showEmailModal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 px-4 pt-24 md:pt-28">
          <div className="w-full max-w-md animate-[settingsModal_0.25s_ease-out] rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Change Email
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  {emailStep === "email"
                    ? "Enter your new email address."
                    : "Enter the verification code sent to your new email."}
                </p>
              </div>

              <button
                type="button"
                onClick={closeEmailModal}
                className="rounded-full px-2 text-2xl text-gray-400 transition-all duration-200 hover:rotate-90 hover:bg-gray-100 hover:text-gray-700"
              >
                ×
              </button>
            </div>

            {emailStep === "email" ? (
              <>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  New Email
                </label>

                <input
                  type="email"
                  value={newEmail}
                  onChange={(event) => setNewEmail(event.target.value)}
                  placeholder="Enter new email"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition-all duration-300 focus:border-green-500 focus:ring-2 focus:ring-green-100"
                />

                <button
                  type="button"
                  onClick={handleEmailContinue}
                  className="mt-5 w-full rounded-lg bg-green-600 px-4 py-3 font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-green-700 hover:shadow-md active:scale-95"
                >
                  Send Verification Code
                </button>
              </>
            ) : (
              <>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Verification Code
                </label>

                <input
                  type="text"
                  value={emailOtp}
                  onChange={(event) => setEmailOtp(event.target.value)}
                  placeholder="Enter verification code"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition-all duration-300 focus:border-green-500 focus:ring-2 focus:ring-green-100"
                />

                <button
                  type="button"
                  onClick={handleEmailVerify}
                  className="mt-5 w-full rounded-lg bg-green-600 px-4 py-3 font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-green-700 hover:shadow-md active:scale-95"
                >
                  Verify & Change Email
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 px-4 pt-24 md:pt-28">
          <div className="w-full max-w-md animate-[settingsModal_0.25s_ease-out] rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Change Password
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Enter your current and new password.
                </p>
              </div>

              <button
                type="button"
                onClick={closePasswordModal}
                className="rounded-full px-2 text-2xl text-gray-400 transition-all duration-200 hover:rotate-90 hover:bg-gray-100 hover:text-gray-700"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Current Password
                </label>

                <input
                  type="password"
                  value={currentPassword}
                  onChange={(event) =>
                    setCurrentPassword(event.target.value)
                  }
                  placeholder="Enter current password"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition-all duration-300 focus:border-green-500 focus:ring-2 focus:ring-green-100"
                />
              </div>

              <button
                type="button"
                onClick={() => {
                  closePasswordModal();
                  navigate("/forgot-password");
                }}
                className="text-sm font-medium text-green-600 transition-colors duration-200 hover:text-green-700"
              >
                Forgot Password?
              </button>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  New Password
                </label>

                <input
                  type="password"
                  value={newPassword}
                  onChange={(event) => setNewPassword(event.target.value)}
                  placeholder="Enter new password"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition-all duration-300 focus:border-green-500 focus:ring-2 focus:ring-green-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Confirm New Password
                </label>

                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(event) =>
                    setConfirmPassword(event.target.value)
                  }
                  placeholder="Confirm new password"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition-all duration-300 focus:border-green-500 focus:ring-2 focus:ring-green-100"
                />
              </div>

              {newPassword &&
                confirmPassword &&
                newPassword !== confirmPassword && (
                  <p className="animate-pulse text-sm text-red-500">
                    Passwords do not match.
                  </p>
                )}

              <button
                type="button"
                onClick={handlePasswordChange}
                className="w-full rounded-lg bg-green-600 px-4 py-3 font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-green-700 hover:shadow-md active:scale-95"
              >
                Change Password
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes settingsModal {
          from {
            opacity: 0;
            transform: scale(0.96) translateY(8px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

export default Settings;