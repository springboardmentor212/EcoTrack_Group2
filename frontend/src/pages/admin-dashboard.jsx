import { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import {
  FiUsers,
  FiUserCheck,
  FiUserX,
  FiAward,
  FiCheckCircle,
} from "react-icons/fi";
import { toast } from "react-toastify";

const Admin_Api = import.meta.env.VITE_ADMIN_API;
const API_URL = import.meta.env.VITE_API_URL;

const adminNavItems = [
  ["Dashboard", "/admin-dashboard"],
  ["User Management", "/admin-user-management"],
  ["Challenge Management", "/admin-challenge-management"],
  ["Reports", "/admin-reports"],
  ["Profile", "/admin-profile"],
];

const initialStats = [
  { title: "Total Users", value: 0, unit: "users", icon: FiUsers },
  { title: "Active Users", value: 0, unit: "users", icon: FiUserCheck },
  { title: "Blocked Users", value: 0, unit: "users", icon: FiUserX },
  {
    title: "Active Challenges",
    value: 0,
    unit: "challenges",
    icon: FiAward,
  },
  {
    title: "Completed Challenges",
    value: 0,
    unit: "completed",
    icon: FiCheckCircle,
  },
];

function AdminDashboard() {
  const navigate = useNavigate();

  const [adminProfile, setAdminProfile] = useState({
    name: "",
    email: "",
    profilePhoto: "",
  });

  const [profileOpen, setProfileOpen] = useState(false);
  const [stats, setStats] = useState(initialStats);
  const [dashboardLoading, setDashboardLoading] = useState(true);
  const [dashboardError, setDashboardError] = useState(false);

  // Load dashboard statistics
  useEffect(() => {
    let isMounted = true;

    const loadDashboard = async () => {
      setDashboardLoading(true);
      setDashboardError(false);

      try {
        const { data } = await axios.get(`${Admin_Api}/`, {
          withCredentials: true,
        });

        if (!data.success) {
          throw new Error(data.message || "Unable to load admin dashboard.");
        }

        const dashboardData = data.dashboardData;

        if (!dashboardData) {
          throw new Error("Dashboard data is missing.");
        }

        if (isMounted) {
          setStats((previousStats) =>
            previousStats.map((stat) => {
              const values = {
                "Total Users": dashboardData.totalUser,
                "Active Users": dashboardData.activeUser,
                "Blocked Users": dashboardData.blockedUser,
                "Active Challenges": dashboardData.activeChallenge,
                "Completed Challenges": dashboardData.completedChallenge,
              };

              return {
                ...stat,
                value: values[stat.title] ?? 0,
              };
            }),
          );
        }
      } catch (error) {
        if (isMounted) {
          setDashboardError(true);

          toast.error(
            error.response?.data?.message ||
              error.message ||
              "Unable to load dashboard data.",
          );
        }
      } finally {
        if (isMounted) {
          setDashboardLoading(false);
        }
      }
    };

    loadDashboard();

    return () => {
      isMounted = false;
    };
  }, []);

  // Load the actual admin profile
  useEffect(() => {
    let isMounted = true;

    const loadAdminProfile = async () => {
      try {
        const { data } = await axios.get(`${Admin_Api}/profile`, {
          withCredentials: true,
        });

        if (data.success && isMounted) {
          setAdminProfile({
            name: data.profile?.name || "",
            email: data.profile?.email || "",
            profilePhoto: data.profile?.profilePhoto || "",
          });
        }
      } catch (error) {
        console.error("Unable to load admin profile:", error);
      }
    };

    loadAdminProfile();

    return () => {
      isMounted = false;
    };
  }, []);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleDocumentClick = (event) => {
      if (!event.target.closest(".profile-wrapper")) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("click", handleDocumentClick);

    return () => {
      document.removeEventListener("click", handleDocumentClick);
    };
  }, []);

  // Existing logout API
  const handleLogout = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/logout`, {
        withCredentials: true,
      });

      if (data.success) {
        setProfileOpen(false);
        toast.success(data.message || "Logout successfully");
        navigate("/");
      } else {
        toast.info(data.message || "Already you are logged out");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Unable to logout. Please try again.",
      );
    }
  };

  const handleStatClick = (title) => {
    if (
      title === "Total Users" ||
      title === "Active Users" ||
      title === "Blocked Users"
    ) {
      navigate("/admin-user-management");
      return;
    }

    if (title === "Active Challenges" || title === "Completed Challenges") {
      navigate("/admin-challenge-management");
    }
  };

  const adminInitial = adminProfile.name.trim().charAt(0).toUpperCase() || "A";

  return (
    <>
      <style>{`
        @keyframes pageFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes sidebarReveal {
          from { opacity: 0; transform: translateX(-18px); }
          to { opacity: 1; transform: translateX(0); }
        }

        @keyframes topbarReveal {
          from { opacity: 0; transform: translateY(-12px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes heroFadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes cardFadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes iconReveal {
          from { opacity: 0; transform: scale(.8); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>

      <div className="min-h-screen animate-[pageFadeIn_.7s_ease_both] bg-[#f7fbf8] text-[#173f2a] lg:flex">
        {/* Sidebar */}
        <aside className="fixed inset-y-0 left-0 z-40 flex w-[250px] shrink-0 flex-col overflow-y-auto border-r border-[#e2ece5] bg-white px-[18px] py-5 animate-[sidebarReveal_.6s_ease_.05s_both] max-lg:w-[220px] max-md:w-[190px] max-sm:relative max-sm:w-full max-sm:border-b max-sm:border-r-0 max-sm:py-5">
          <Link
            to="/admin-dashboard"
            className="flex shrink-0 items-center border-b border-[#e2ece5] px-3 pb-4"
          >
            <img
              src="/assets/Ecotrack1.png"
              alt="EcoTrack"
              className="block h-auto w-[160px] max-w-full transition-transform duration-200 hover:scale-[1.02] max-md:w-[150px] max-sm:w-[180px]"
            />
          </Link>

          <nav className="min-h-0 flex-1 py-2 pr-1">
            <div className="mb-3 px-3 pt-2">
              <p className="text-[10px] font-bold tracking-[.16em] text-[#27834d]">
                ADMIN PORTAL
              </p>
            </div>

            <div className="flex flex-col gap-1">
              {adminNavItems.map(([label, href]) => (
                <Link
                  key={label}
                  to={href}
                  className={`rounded-lg px-3.5 py-3 text-sm font-medium transition-all duration-200 hover:translate-x-[3px] hover:bg-[#f1f8f3] hover:text-[#27834d] ${
                    label === "Dashboard"
                      ? "bg-[#eaf5ed] font-semibold text-[#27834d]"
                      : "text-[#5c7064]"
                  }`}
                >
                  {label}
                </Link>
              ))}
            </div>
          </nav>

          <div className="shrink-0 pt-1">
            <div className="mx-2 my-2 h-px bg-[#e2ece5]" />

            <button
              type="button"
              onClick={handleLogout}
              className="w-full rounded-lg border-0 bg-transparent px-3.5 py-2 text-left text-sm text-[#65766c] transition-all duration-200 hover:translate-x-[3px] hover:bg-[#fdf2f2] hover:text-[#b34b4b]"
            >
              Logout
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <div className="w-full lg:ml-[250px] lg:w-[calc(100%-250px)] max-lg:ml-[220px] max-lg:w-[calc(100%-220px)] max-md:ml-[190px] max-md:w-[calc(100%-190px)] max-sm:ml-0 max-sm:w-full">
          {/* Topbar */}
          <header className="sticky top-0 z-30 flex h-[76px] items-center justify-between border-b border-[#e2ece5] bg-white px-[4%] animate-[topbarReveal_.6s_ease_.12s_both]">
            <div>
              <p className="text-[10px] font-bold tracking-[.15em] text-[#27834d]">
                ADMIN PORTAL
              </p>

              <div className="mt-0.5 text-lg font-semibold text-[#173f2a]">
                Dashboard
              </div>
            </div>

            {/* Dynamic Admin Profile + Dropdown */}
            <div className="profile-wrapper relative">
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  setProfileOpen((open) => !open);
                }}
                aria-expanded={profileOpen}
                aria-haspopup="true"
                aria-label="Open admin profile menu"
                className="flex items-center gap-2.5 rounded-lg border-0 bg-transparent px-1 py-1.5 text-left transition hover:bg-[#f7fbf8]"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#eaf5ed] text-sm font-semibold text-[#27834d]">
                  {adminProfile.profilePhoto ? (
                    <img
                      src={adminProfile.profilePhoto}
                      alt="Admin profile"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    adminInitial
                  )}
                </div>

                <div className="profile-info flex min-w-0 flex-col max-md:hidden">
                  <strong className="max-w-[180px] truncate text-xs font-semibold text-[#294a36]">
                    {adminProfile.name || "Admin"}
                  </strong>

                  <span className="max-w-[180px] truncate text-[10px] text-[#8a998f]">
                    {adminProfile.email || "Administrator"}
                  </span>
                </div>

                <span
                  className={`text-[#718277] transition-transform duration-200 ${
                    profileOpen ? "rotate-180" : ""
                  }`}
                >
                  ▾
                </span>
              </button>

              {profileOpen && (
                <div className="absolute right-0 top-[47px] z-50 w-[230px] overflow-hidden rounded-xl border border-[#e1ebe4] bg-white p-1.5 shadow-[0_12px_30px_rgba(23,63,42,0.12)]">
                  {/* Profile summary */}
                  <div className="flex items-center gap-3 border-b border-[#e1ebe4] px-3 py-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#eaf5ed] text-sm font-semibold text-[#27834d]">
                      {adminProfile.profilePhoto ? (
                        <img
                          src={adminProfile.profilePhoto}
                          alt="Admin profile"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        adminInitial
                      )}
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-[#294a36]">
                        {adminProfile.name || "Admin"}
                      </p>
                      <p className="truncate text-xs text-[#8a998f]">
                        {adminProfile.email || "Administrator"}
                      </p>
                    </div>
                  </div>

                  {/* Profile link */}
                  <Link
                    to="/admin-profile"
                    onClick={() => setProfileOpen(false)}
                    className="mt-1 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-[#53685b] transition hover:bg-[#f1f8f3] hover:text-[#27834d]"
                  >
                    <span aria-hidden="true">👤</span>
                    <span>Profile</span>
                  </Link>

                  {/* Setting page */}
                  <Link
                    to="/admin-settings"
                    className="mt-1 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-[#53685b] transition hover:bg-[#f1f8f3] hover:text-[#27834d]"
                  >
                    <span aria-hidden="true">⚙️</span>
                    <span>Settings</span>
                  </Link>

                  {/* Logout */}
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm text-[#b34b4b] transition hover:bg-[#fdf2f2]"
                  >
                    <span aria-hidden="true">↪</span>
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          </header>

          {/* Dashboard */}
          <main className="px-[4%] pb-12 pt-8 sm:pt-10">
            <section className="mb-8 animate-[heroFadeUp_.55s_ease_.2s_both]">
              <p className="mb-2 text-[11px] font-bold tracking-[.16em] text-[#27834d]">
                ECOTRACK ADMINISTRATION
              </p>

              <h1 className="text-[32px] font-semibold leading-tight text-[#173f2a] max-sm:text-[28px]">
                Admin <span className="text-[#27834d]">Dashboard</span>
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-[#718277]">
                Manage users, challenges, and platform reports from one place.
              </p>
            </section>

            <section>
              {dashboardError && (
                <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                  <span>Dashboard statistics could not be loaded.</span>

                  <button
                    type="button"
                    onClick={() => window.location.reload()}
                    className="font-semibold underline"
                  >
                    Retry
                  </button>
                </div>
              )}

              <div className="grid gap-[18px] sm:grid-cols-2 xl:grid-cols-3">
                {stats.map((stat, index) => {
                  const Icon = stat.icon;

                  return (
                    <button
                      key={stat.title}
                      type="button"
                      onClick={() => handleStatClick(stat.title)}
                      className="group w-full rounded-[15px] border border-[#e1ebe4] bg-white p-[22px] text-left shadow-[0_10px_30px_rgba(33,78,50,0.05)] transition-all duration-300 hover:-translate-y-1 hover:border-[#d4e4da] hover:shadow-[0_16px_35px_rgba(33,78,50,0.09)] animate-[cardFadeUp_.6s_ease_both]"
                      style={{
                        animationDelay: `${0.28 + index * 0.08}s`,
                      }}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="mb-2 text-[13px] text-[#718277]">
                            {stat.title}
                          </p>

                          <h2 className="text-[30px] font-semibold leading-none text-[#173f2a]">
                            {dashboardLoading ? "..." : stat.value}
                          </h2>

                          <p className="mt-2 text-[11px] text-[#8a998f]">
                            {stat.unit}
                          </p>
                        </div>

                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#eaf5ed] text-[#27834d] transition-all duration-300 group-hover:scale-105 group-hover:bg-[#dff1e4] animate-[iconReveal_.5s_ease_both]">
                          <Icon size={20} />
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>
          </main>
        </div>
      </div>
    </>
  );
}

export default AdminDashboard;
