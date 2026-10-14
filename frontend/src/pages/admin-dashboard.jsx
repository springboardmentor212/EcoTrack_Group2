import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  FiUsers,
  FiUserCheck,
  FiUserX,
  FiAward,
  FiCheckCircle,
} from "react-icons/fi";
import { toast } from "react-toastify";

const Admin_Api = import.meta.env.VITE_ADMIN_API;
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
        const { data } = await axios.get(`${ Admin_Api}/`, {
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

          {/* Dashboard */}
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
    </>
  );
}

export default AdminDashboard;
