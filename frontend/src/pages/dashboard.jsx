import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { FiBell, FiChevronDown } from "react-icons/fi";
import { toast } from "react-toastify";

const API_URL = import.meta.env.VITE_API_URL;
const CARBON_ACTIVITY = import.meta.env.VITE_CARBON_ACTIVITY;
const GOALS_URL = import.meta.env.VITE_GOAL_API;
const PROFILE_URL = import.meta.env.VITE_PROFILE_URL;
const CHALLENGE_URL = import.meta.env.VITE_CHALLENGE_API;

const trackerPeriods = {
  All: [
    "This Month (Day-wise)",
    "This Month (weekly)",
    "Last 3 Months",
    "This Year",
  ],
  Transportation: [
    "This Month (Day-wise)",
    "This Month (weekly)",
    "Last 3 Months",
    "This Year",
  ],
  Electricity: ["This Month", "Last 3 Months", "This Year"],
  "Waste Management": [
    "This Month (Day-wise)",
    "This Month (weekly)",
    "Last 3 Months",
    "This Year",
  ],
};

const trackers = ["All", "Transportation", "Electricity", "Waste Management"];

const overviewData = {
  All: [
    { title: "Total Carbon Emissions", value: 0, unit: "kg CO₂e" },
    { title: "Transportation Carbon Emissions", value: 0, unit: "kg CO₂e" },
    { title: "Electricity Carbon Emissions", value: 0, unit: "kg CO₂e" },
    { title: "Waste Management Carbon Emissions", value: 0, unit: "kg CO₂e" },
  ],
  Transportation: [
    { title: "Carbon Emissions", value: 0, unit: "kg CO₂e" },
    { title: "Total Distance Travelled", value: 0, unit: "km" },
    { title: "Most Used Transport Mode", value: "—", unit: "" },
    { title: "Most Used Fuel Type", value: "—", unit: "" },
  ],
  Electricity: [
    { title: "Carbon Emissions", value: 0, unit: "kg CO₂e" },
    { title: "Total Consumption", value: 0, unit: "kWh" },
    { title: "No. of Entries", value: 0, unit: "entries" },
  ],
  "Waste Management": [
    { title: "Carbon Emissions", value: 0, unit: "kg CO₂e" },
    { title: "Carbon Saved", value: 0, unit: "kg CO₂e" },
    { title: "Total Waste Generated", value: 0, unit: "kg" },
    { title: "Most Tracked Waste Type", value: "—", unit: "" },
    { title: "Most Used Disposal/Handling Method", value: "—", unit: "" },
  ],
};

const navItems = [
  ["Dashboard", "/dashboard"],
  ["Carbon Tracking System", "/tracking"],
  ["Sustainability Goals", "/sustainability-goals"],
  ["Community Challenges", "/community-challenges"],
  ["Analytics / Reports", "/analytics"],
  ["Notifications", "/notifications"],
  ["Profile", "/profile"],
];

const trackerApiTypes = {
  All: "carbon",
  Transportation: "transportation",
  Electricity: "electricity",
  "Waste Management": "waste",
};

const getApiDuration = (tracker, period) => {
  if (tracker === "Electricity") {
    if (period === "This Month") return "month";
    if (period === "Last 3 Months") return "3months";
    return "year";
  }

  if (period === "This Month (Day-wise)") return "day";
  if (period === "This Month (weekly)") return "week";
  if (period === "Last 3 Months") return "3months";

  return "year";
};

const formatCardNumber = (value) => {
  if (value === null || value === undefined || value === "") {
    return "0.00";
  }

  const number = Number(value);

  if (!Number.isFinite(number)) {
    return value;
  }

  return number.toFixed(2);
};

const formatCardText = (value) => {
  if (value === null || value === undefined || value === "") {
    return "—";
  }

  if (value === "—") {
    return "—";
  }

  return String(value)
    .trim()
    .toLowerCase()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
};

const createStatsFromSummary = (tracker, summary) => {
  if (tracker === "All") {
    return [
      {
        title: "Total Carbon Emissions",
        value: formatCardNumber(summary?.emission ?? 0),
        unit: "kg CO₂e",
      },
      {
        title: "Transportation Carbon Emissions",
        value: formatCardNumber(summary?.transportationEmission ?? 0),
        unit: "kg CO₂e",
      },
      {
        title: "Electricity Carbon Emissions",
        value: formatCardNumber(summary?.electricityEmission ?? 0),
        unit: "kg CO₂e",
      },
      {
        title: "Waste Management Carbon Emissions",
        value: formatCardNumber(summary?.wasteEmission ?? 0),
        unit: "kg CO₂e",
      },
    ];
  }

  if (tracker === "Transportation") {
    return [
      {
        title: "Carbon Emissions",
        value: formatCardNumber(summary?.emission ?? 0),
        unit: "kg CO₂e",
      },
      {
        title: "Total Distance Travelled",
        value: formatCardNumber(summary?.distance ?? 0),
        unit: "km",
      },
      {
        title: "Most Used Transport Mode",
        value: formatCardText(summary?.mostUsedTransportMode?.mode),
        unit: "",
      },
      {
        title: "Most Used Fuel Type",
        value: formatCardText(summary?.mostUsedFuelType?.fuel),
        unit: "",
      },
    ];
  }

  if (tracker === "Electricity") {
    return [
      {
        title: "Carbon Emissions",
        value: formatCardNumber(summary?.emission ?? 0),
        unit: "kg CO₂e",
      },
      {
        title: "Total Consumption",
        value: formatCardNumber(summary?.consumption ?? 0),
        unit: "kWh",
      },
      {
        title: "No. of Entries",
        value: Number.isFinite(Number(summary?.entries))
          ? Number(summary.entries)
          : 0,
        unit: "entries",
      },
    ];
  }

  return [
    {
      title: "Carbon Emissions",
      value: formatCardNumber(summary?.emission ?? 0),
      unit: "kg CO₂e",
    },
    {
      title: "Carbon Saved",
      value: formatCardNumber(summary?.carbonSave ?? 0),
      unit: "kg CO₂e",
    },
    {
      title: "Total Waste Generated",
      value: formatCardNumber(summary?.wasteAmount ?? 0),
      unit: "kg",
    },
    {
      title: "Most Tracked Waste Type",
      value: formatCardText(summary?.mostUsedWasteType?.type),
      unit: "",
    },
    {
      title: "Most Used Disposal/Handling Method",
      value: formatCardText(summary?.mostUsedDisposalMethod?.method),
      unit: "",
    },
  ];
};

const formatChallengeLabel = (value) => {
  if (!value) return "—";

  return String(value)
    .trim()
    .split(/\s+/)
    .map(
      (word) =>
        word.charAt(0).toUpperCase() +
        word.slice(1).toLowerCase()
    )
    .join(" ");
};

const formatChallengeCategory = (category) => {
  const categoryMap = {
    transportation: "Transportation",
    electricity: "Electricity",
    "waste management": "Waste Management",
    "carbon emission": "Carbon Emission",
    "carbon save": "Carbon Save",
  };

  return categoryMap[category] || formatChallengeLabel(category);
};

const getDurationData = (duration, durationSummary) => {
  if (!durationSummary) return [];

  if (duration === "day") {
    return durationSummary.dailyData || [];
  }

  if (duration === "week") {
    return durationSummary.weeklyData || [];
  }

  return durationSummary.monthlyData || [];
};

function Dashboard() {
  const navigate = useNavigate();

  const [selectedPeriod, setSelectedPeriod] = useState(
    "This Month (Day-wise)",
  );
  const [selectedTracker, setSelectedTracker] = useState("All");
  const [periodOpen, setPeriodOpen] = useState(false);
  const [trackerOpen, setTrackerOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [profile, setProfile] = useState({
  name: "",
  email: "",
  location: "",
  profilePhoto: "",
});
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notifications] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);

  const [dashboardStats, setDashboardStats] = useState(overviewData);
  const [chartData, setChartData] = useState([]);
  const [dashboardLoading, setDashboardLoading] = useState(true);
  const [noActivity, setNoActivity] = useState(false);
  const [goals, setGoals] = useState([]);
  const [goalsLoading, setGoalsLoading] = useState(true);
  const [challenges, setChallenges] = useState([]);
  const [challengesLoading, setChallengesLoading] = useState(true);

  useEffect(() => {
    const handleDocumentClick = (event) => {
      if (!event.target.closest(".period-dropdown")) setPeriodOpen(false);
      if (!event.target.closest(".tracking-dropdown")) setTrackerOpen(false);
      if (!event.target.closest(".profile-wrapper")) setProfileOpen(false);
      if (!event.target.closest(".notification-wrapper")) {
        setNotificationOpen(false);
      }
    };

    document.addEventListener("click", handleDocumentClick);

    return () => document.removeEventListener("click", handleDocumentClick);
  }, []);

  useEffect(() => {
    setRefreshKey((value) => value + 1);
  }, [selectedTracker, selectedPeriod]);

  useEffect(() => {
    const availablePeriods = trackerPeriods[selectedTracker];

    if (!availablePeriods.includes(selectedPeriod)) {
      setSelectedPeriod(
        selectedTracker === "Electricity"
          ? "This Month"
          : "This Month (Day-wise)",
      );
    } else if (
      selectedTracker !== "Electricity" &&
      selectedPeriod === "This Month"
    ) {
      setSelectedPeriod("This Month (Day-wise)");
    }
  }, [selectedTracker]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setDashboardLoading(true);
        setNoActivity(false);

        const type = trackerApiTypes[selectedTracker];
        const duration = getApiDuration(selectedTracker, selectedPeriod);

        const { data } = await axios.get(
          `${CARBON_ACTIVITY}/summary?type=${type}&duration=${duration}`,
          {
            withCredentials: true,
          },
        );

        const { success, message, result } = data;

        if (!success) {
          setDashboardStats((current) => ({
            ...current,
            [selectedTracker]: overviewData[selectedTracker],
          }));
          setChartData([]);
          setNoActivity(true);
          toast.info(message || "No activity found for this duration.");
          return;
        }

        const stats = createStatsFromSummary(
          selectedTracker,
          result?.typeSummary,
        );

        const durationData = getDurationData(
          duration,
          result?.durationSummary,
        );

        setDashboardStats((current) => ({
          ...current,
          [selectedTracker]: stats,
        }));

        setChartData(durationData);
        setNoActivity(false);
      } catch (error) {
        setDashboardStats((current) => ({
          ...current,
          [selectedTracker]: overviewData[selectedTracker],
        }));
        setChartData([]);
        setNoActivity(false);

        toast.error(
          error.response?.data?.message || "Unable to load dashboard data.",
        );
      } finally {
        setDashboardLoading(false);
      }
    };

    fetchDashboardData();
  }, [selectedTracker, selectedPeriod]);

  useEffect(() => {
  const fetchProfile = async () => {
    try {
      const { data } = await axios.get(`${PROFILE_URL}/`, {
        withCredentials: true,
      });

      if (data.success) {
        const profileData = data.profile || {};

        setProfile({
          name: profileData.name || "",
          email: profileData.email || "",
          location: profileData.location || "",
          profilePhoto: profileData.profilePhoto || "",
        });
      }
    } catch (error) {
      console.error(
        "Profile fetch error:",
        error.response?.data?.message || error.message
      );
    }
  };

  fetchProfile();
}, []);

  useEffect(() => {
    const fetchGoals = async () => {
      try {
        setGoalsLoading(true);

        const { data } = await axios.get(`${GOALS_URL}/`, {
          withCredentials: true,
        });

        const { success, message, result } = data;

        if (success) {
          const activeGoals = Array.isArray(result?.activeGoal)
            ? result.activeGoal
            : [];

          const completeGoals = Array.isArray(result?.completeGoal)
            ? result.completeGoal
            : [];

          const otherGoals = Array.isArray(result?.otherGoal)
            ? result.otherGoal
            : [];

          setGoals([...activeGoals, ...completeGoals, ...otherGoals]);
        } else {
          setGoals([]);
          toast.error(message || "Unable to load goals.");
        }
      } catch (error) {
        setGoals([]);
        toast.error(error.response?.data?.message || "Unable to load goals.");
      } finally {
        setGoalsLoading(false);
      }
    };

    fetchGoals();
  }, []);

  useEffect(() => {
  const fetchChallenges = async () => {
    try {
      setChallengesLoading(true);

      const { data } = await axios.get(`${CHALLENGE_URL}/`, {
        withCredentials: true,
      });

      if (data.success === "user") {
        setChallenges(
          Array.isArray(data.userChallengesData)
            ? data.userChallengesData
            : []
        );
      } else {
        setChallenges([]);
      }
    } catch (error) {
      console.error(
        "Challenges fetch error:",
        error.response?.data?.message || error.message
      );

      setChallenges([]);
    } finally {
      setChallengesLoading(false);
    }
  };

  fetchChallenges();
}, []);

  const activeGoals = goals.filter((goal) => goal.status === "active");

  const completedGoals = goals.filter(
    (goal) =>
      goal.status === "complete" ||
      goal.status === "completed" ||
      goal.status === "achieve" ||
      goal.status === "achieved",
  );

  const otherGoals = goals.filter(
    (goal) =>
      goal.status !== "active" &&
      goal.status !== "complete" &&
      goal.status !== "completed" &&
      goal.status !== "achieve" &&
      goal.status !== "achieved",
  );

  const stats =
    dashboardStats[selectedTracker] || overviewData[selectedTracker];

  const overviewTitle =
    selectedTracker === "All"
      ? "Tracking Overview"
      : `${selectedTracker} Overview`;

  const unreadNotifications = notifications.filter(
    (notification) => !notification.read,
  );

  const periods = trackerPeriods[selectedTracker];

  const getChartData = () => {
    const duration = getApiDuration(selectedTracker, selectedPeriod);

    if (duration === "day") {
      return {
        title: "Daily Carbon Activity Overview",
        labels: chartData.map((item) => item.label),
        values: chartData.map((item) => item.totalEmission ?? 0),
        goalTitle: "Monthly Goal",
      };
    }

    if (duration === "week") {
      return {
        title: "Weekly Carbon Activity Overview",
        labels: chartData.map((item) => item.label),
        values: chartData.map((item) => item.totalEmission ?? 0),
        goalTitle: "Monthly Goal",
      };
    }

    if (duration === "3months") {
      return {
        title: "3-Month Carbon Activity Overview",
        labels: chartData.map((item) => item.label),
        values: chartData.map((item) => item.totalEmission ?? 0),
        goalTitle: "3-Month Goal Overview",
      };
    }

    if (selectedTracker === "Electricity" && duration === "month") {
      return {
        title: "Monthly Carbon Activity Overview",
        labels: chartData.map((item) => item.label),
        values: chartData.map((item) => item.totalEmission ?? 0),
        goalTitle: "Monthly Goal",
      };
    }

    return {
      title: "Yearly Carbon Activity Overview",
      labels: chartData.map((item) => item.label),
      values: chartData.map((item) => item.totalEmission ?? 0),
      goalTitle: "Yearly Goal",
    };
  };

  const selectedChart = useMemo(
    () => getChartData(),
    [chartData, selectedTracker, selectedPeriod],
  );

  const goalTitle = selectedChart.goalTitle;

  const chartScale = useMemo(() => {
    const maximum = Math.max(...selectedChart.values, 0);

    if (maximum <= 0) {
      return {
        maximum: 10,
        ticks: [10, 8, 6, 4, 2, 0],
      };
    }

    const magnitude = 10 ** Math.floor(Math.log10(maximum));
    const normalized = maximum / magnitude;

    let step;

    if (normalized <= 1) {
      step = magnitude / 5;
    } else if (normalized <= 2) {
      step = magnitude / 2;
    } else if (normalized <= 5) {
      step = magnitude;
    } else {
      step = magnitude * 2;
    }

    const maximumWithPadding =
      Math.ceil((maximum * 1.15) / step) * step;

    const tickStep = maximumWithPadding / 5;

    const ticks = Array.from(
      { length: 6 },
      (_, index) =>
        Math.round(
          (maximumWithPadding - index * tickStep) * 100,
        ) / 100,
    );

    return {
      maximum: maximumWithPadding,
      ticks,
    };
  }, [selectedChart.values]);

  const getStatRoute = (tracker, title) => {
    if (tracker === "All" && title === "Total Carbon Emissions") {
      return "/analytics";
    }

    if (tracker === "All" && title === "Transportation Carbon Emissions") {
      return "/tracking?type=transportation";
    }

    if (tracker === "All" && title === "Electricity Carbon Emissions") {
      return "/tracking?type=electricity";
    }

    if (tracker === "All" && title === "Waste Management Carbon Emissions") {
      return "/tracking?type=waste";
    }

    if (tracker === "Transportation") {
      return "/tracking?type=transportation";
    }

    if (tracker === "Electricity") {
      return "/tracking?type=electricity";
    }

    if (tracker === "Waste Management") {
      return "/tracking?type=waste";
    }

    return null;
  };

  const handleStatClick = (tracker, title) => {
    const route = getStatRoute(tracker, title);

    if (route) navigate(route);
  };

  const handleLogout = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/logout`, {
        withCredentials: true,
      });

      if (data.success) {
        toast.success(data.message || "Logout successfully");
        navigate("/");
      } else {
        toast.info(data.message || "Already you are logged out");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Unable to logout. Please try again.",
      );
    }
  };

  return (
    <>
      <style>{`
        @keyframes pageFadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes sidebarReveal {
          from {
            opacity: 0;
            transform: translateX(-18px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes topbarReveal {
          from {
            opacity: 0;
            transform: translateY(-12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes heroFadeUp {
          from {
            opacity: 0;
            transform: translateY(18px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes cardFadeUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes progressReveal {
          from {
            opacity: 0;
            transform: scale(.88);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes barGrow {
          from {
            transform: scaleY(0);
            transform-origin: bottom;
          }
          to {
            transform: scaleY(1);
            transform-origin: bottom;
          }
        }
      `}</style>

      <div className="min-h-screen bg-[#f7fbf8] text-[#173f2a] animate-[pageFadeIn_.7s_ease_both] lg:flex">
        <aside className="fixed inset-y-0 left-0 z-40 flex w-[250px] shrink-0 flex-col overflow-hidden border-r border-[#e2ece5] bg-white px-[18px] py-5 animate-[sidebarReveal_.6s_ease_.05s_both] max-lg:w-[220px] max-md:w-[190px] max-sm:relative max-sm:w-full max-sm:border-b max-sm:border-r-0 max-sm:py-5">
          <Link
            to="/"
            className="flex shrink-0 items-center border-b border-[#e2ece5] px-3 pb-4"
          >
            <img
              src="/assets/Ecotrack1.png"
              alt="EcoTrack"
              className="block h-auto w-[160px] max-w-full transition-transform duration-200 hover:scale-[1.02] max-md:w-[150px] max-sm:w-[180px]"
            />
          </Link>

          <nav className="min-h-0 flex-1 overflow-hidden py-2 pr-1">
            <div className="flex flex-col gap-1">
              {navItems.map(([label, href]) => (
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

        <div className="w-full lg:ml-[250px] lg:w-[calc(100%-250px)] max-lg:ml-[220px] max-lg:w-[calc(100%-220px)] max-md:ml-[190px] max-md:w-[calc(100%-190px)] max-sm:ml-0 max-sm:w-full">
          <header className="sticky top-0 z-30 flex h-[76px] items-center justify-between border-b border-[#e2ece5] bg-white px-[4%] animate-[topbarReveal_.6s_ease_.12s_both]">
            <div className="text-lg font-semibold text-[#173f2a]">
              Dashboard
            </div>

            <div className="flex items-center gap-3.5">
              <div className="notification-wrapper relative">
                <button
                  type="button"
                  aria-label="Notifications"
                  onClick={(event) => {
                    event.stopPropagation();
                    setNotificationOpen(!notificationOpen);
                    setProfileOpen(false);
                  }}
                  className="relative flex h-[38px] w-[38px] items-center justify-center rounded-[9px] border-0 bg-transparent text-[#53685b] transition-all duration-200 hover:bg-[#f1f8f3] hover:text-[#27834d] active:scale-95"
                >
                  <FiBell size={19} />

                  {unreadNotifications.length > 0 && (
                    <span className="absolute right-0 top-0 flex h-[17px] min-w-[17px] items-center justify-center rounded-full bg-[#27834d] px-1 text-[10px] font-bold text-white">
                      {unreadNotifications.length > 99
                        ? "99+"
                        : unreadNotifications.length}
                    </span>
                  )}
                </button>

                {notificationOpen && (
                  <div className="absolute right-0 top-[47px] z-50 w-[310px] overflow-hidden rounded-xl border border-[#e1ebe4] bg-white shadow-[0_12px_30px_rgba(23,63,42,0.12)]">
                    <div className="border-b border-[#edf2ee] px-4 py-3 text-sm font-semibold text-[#294a36]">
                      Recent Notifications
                    </div>

                    <div className="max-h-[280px] overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="px-4 py-7 text-center text-xs text-[#8a998f]">
                          No notifications
                        </div>
                      ) : (
                        notifications.slice(0, 5).map((notification) => (
                          <div
                            key={notification.id}
                            className={`border-b border-[#f0f4f1] px-4 py-3 text-xs text-[#53685b] ${
                              !notification.read
                                ? "bg-[#f3f9f4] font-semibold"
                                : ""
                            }`}
                          >
                            {notification.message}
                          </div>
                        ))
                      )}
                    </div>

                    <div className="border-t border-[#edf2ee] px-4 py-3 text-center">
                      <Link
                        to="/notifications"
                        className="text-xs font-semibold text-[#27834d] hover:underline"
                      >
                        See All Notifications
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              <div className="profile-wrapper relative">
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    setProfileOpen(!profileOpen);
                    setNotificationOpen(false);
                  }}
                  className="flex items-center gap-2.5 rounded-lg border-0 bg-transparent px-1 py-1.5 text-left"
                >
                  <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-[#eaf5ed] text-sm font-semibold text-[#27834d]">
                    {profile.profilePhoto ? (
                      <img
                        src={profile.profilePhoto}
                        alt="Profile"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      (profile.name || "E").charAt(0).toUpperCase()
                    )}
                  </div>

                  <div className="profile-info flex min-w-0 flex-col max-md:hidden">
                    <strong className="truncate text-xs font-semibold text-[#294a36]">
                      {profile.name || "Eco User"}
                    </strong>

                    <span className="truncate text-[10px] text-[#8a998f]">
                      {profile.location || profile.email || "Member"}
                    </span>
                  </div>

                  <FiChevronDown
                    className={`text-[#718277] transition-transform duration-200 ${
                      profileOpen ? "rotate-180" : ""
                    }`}
                    size={15}
                  />
                </button>

                {profileOpen && (
                  <div className="absolute right-0 top-[47px] z-50 w-[180px] overflow-hidden rounded-xl border border-[#e1ebe4] bg-white p-1.5 shadow-[0_12px_30px_rgba(23,63,42,0.12)]">
                    <Link
                      to="/profile"
                      className="block rounded-lg px-3 py-2.5 text-xs text-[#53685b] hover:bg-[#f1f8f3] hover:text-[#27834d]"
                    >
                      My Profile
                    </Link>

                    <Link
                      to="/settings"
                      className="block rounded-lg px-3 py-2.5 text-xs text-[#53685b] hover:bg-[#f1f8f3] hover:text-[#27834d]"
                    >
                      Settings
                    </Link>

                    <div className="my-1 h-px bg-[#edf2ee]" />

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full rounded-lg px-3 py-2.5 text-left text-xs text-[#53685b] hover:bg-[#fdf2f2] hover:text-[#b34b4b]"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </header>

          <main className="px-[4%] pb-12 pt-8 sm:pt-10">
            <section className="mb-8 animate-[heroFadeUp_.55s_ease_.2s_both]">
              <p className="mb-2 text-[11px] font-bold tracking-[.16em] text-[#27834d]">
                YOUR SUSTAINABILITY JOURNEY
              </p>

              <h1 className="text-[32px] font-semibold leading-tight text-[#173f2a] max-sm:text-[28px]">
                Welcome back, <span className="text-[#27834d]">Eco User!</span>
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-[#718277]">
                Track your impact, improve your habits, and build a greener
                future.
              </p>
            </section>

            <section className="mb-8">
              <div className="mb-2 flex items-end justify-between gap-5 max-sm:flex-col max-sm:items-start">
                <div>
                  <p className="mb-1 text-[11px] font-bold tracking-[.15em] text-[#27834d]">
                    OVERVIEW
                  </p>

                  <h2 className="text-[21px] font-semibold text-[#173f2a]">
                    {overviewTitle}
                  </h2>
                </div>

                <div className="flex items-center gap-2.5 max-sm:w-full max-sm:flex-col max-sm:items-stretch">
                  <div className="period-dropdown relative">
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        setPeriodOpen(!periodOpen);
                        setTrackerOpen(false);
                      }}
                      className="flex min-w-[175px] items-center justify-between gap-4 rounded-lg border border-[#d8e5dc] bg-white px-3.5 py-2.5 text-xs text-[#365443] shadow-sm transition-all hover:border-[#b9d3c1] hover:shadow-md active:scale-[.98] max-sm:w-full"
                    >
                      <span>{selectedPeriod}</span>

                      <FiChevronDown
                        className={`transition-transform duration-200 ${
                          periodOpen ? "rotate-180" : ""
                        }`}
                        size={13}
                      />
                    </button>

                    {periodOpen && (
                      <div className="absolute right-0 top-[calc(100%+7px)] z-30 w-[200px] rounded-xl border border-[#e1ebe4] bg-white p-1.5 shadow-[0_12px_30px_rgba(23,63,42,0.12)] max-sm:w-full">
                        {periods.map((period) => (
                          <button
                            key={period}
                            type="button"
                            onClick={() => {
                              setSelectedPeriod(period);
                              setPeriodOpen(false);
                            }}
                            className="w-full rounded-lg px-3 py-2.5 text-left text-xs text-[#53685b] hover:bg-[#f1f8f3] hover:text-[#27834d]"
                          >
                            {period}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="tracking-dropdown relative">
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        setTrackerOpen(!trackerOpen);
                        setPeriodOpen(false);
                      }}
                      className="flex min-w-[155px] items-center justify-between gap-4 rounded-lg border border-[#d8e5dc] bg-white px-3.5 py-2.5 text-xs text-[#365443] shadow-sm transition-all hover:border-[#b9d3c1] hover:shadow-md active:scale-[.98] max-sm:w-full"
                    >
                      <span>{selectedTracker}</span>

                      <FiChevronDown
                        className={`transition-transform duration-200 ${
                          trackerOpen ? "rotate-180" : ""
                        }`}
                        size={13}
                      />
                    </button>

                    {trackerOpen && (
                      <div className="absolute right-0 top-[calc(100%+7px)] z-30 w-[180px] rounded-xl border border-[#e1ebe4] bg-white p-1.5 shadow-[0_12px_30px_rgba(23,63,42,0.12)] max-sm:w-full">
                        {trackers.map((tracker) => (
                          <button
                            key={tracker}
                            type="button"
                            onClick={() => {
                              setSelectedTracker(tracker);
                              setTrackerOpen(false);
                            }}
                            className="w-full rounded-lg px-3 py-2.5 text-left text-xs text-[#53685b] hover:bg-[#f1f8f3] hover:text-[#27834d]"
                          >
                            {tracker}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div
                key={`stats-${refreshKey}`}
                className={`grid gap-[18px] ${
                  selectedTracker === "Electricity"
                    ? "grid-cols-3 max-xl:grid-cols-3 max-md:grid-cols-1"
                    : selectedTracker === "Waste Management"
                      ? "grid-cols-5 max-2xl:grid-cols-3 max-xl:grid-cols-2 max-sm:grid-cols-1"
                      : "grid-cols-4 max-xl:grid-cols-2 max-sm:grid-cols-1"
                }`}
              >
                {stats.map((stat, index) => (
                  <button
                    key={stat.title}
                    type="button"
                    onClick={() =>
                      handleStatClick(selectedTracker, stat.title)
                    }
                    disabled={dashboardLoading}
                    className="group w-full rounded-[15px] border border-[#e1ebe4] bg-white p-[21px] text-left shadow-[0_10px_30px_rgba(33,78,50,0.05)] transition-all duration-300 hover:-translate-y-1 hover:border-[#d4e4da] hover:shadow-[0_16px_35px_rgba(33,78,50,0.09)] animate-[cardFadeUp_.6s_ease_both] disabled:cursor-wait disabled:opacity-70"
                    style={{
                      animationDelay: `${0.28 + index * 0.08}s`,
                    }}
                  >
                    <div className="mb-[18px] flex items-center justify-between">
                      <span className="text-[11px] font-bold text-[#718277]">
                        {stat.value === "—" ? "—" : ""}
                      </span>
                    </div>

                    <p className="mb-1.5 text-[13px] text-[#718277]">
                      {stat.title}
                    </p>

                    <h3 className="text-[27px] font-semibold text-[#173f2a]">
                      {dashboardLoading
                        ? "..."
                        : noActivity
                          ? "—"
                          : stat.value}{" "}
                      {!noActivity && !dashboardLoading && stat.unit && (
                        <span className="text-xs font-medium text-[#8a998f]">
                          {stat.unit}
                        </span>
                      )}
                    </h3>
                  </button>
                ))}
              </div>
            </section>

            <section key={`dynamic-${refreshKey}`} className="mb-[22px]">
              <button
                type="button"
                onClick={() => navigate("/analytics")}
                className="scroll-reveal w-full rounded-[15px] border border-[#e1ebe4] bg-white p-[25px] text-left shadow-[0_10px_30px_rgba(33,78,50,0.05)] animate-[cardFadeUp_.65s_ease_.58s_both] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_35px_rgba(33,78,50,0.08)]"
              >
                <div className="flex items-center justify-between gap-5">
                  <div>
                    <p className="mb-1 text-[11px] font-bold tracking-[.15em] text-[#27834d]">
                      ACTIVITY
                    </p>

                    <h2 className="text-[21px] font-semibold text-[#173f2a]">
                      {selectedChart.title}
                    </h2>
                  </div>

                  <img
                    src="/assets/overview.jpg"
                    alt="Overview"
                    className="h-[52px] w-[52px] rounded-xl object-contain"
                  />
                </div>

                {dashboardLoading ? (
                  <div className="mt-8 flex h-[340px] items-center justify-center">
                    <div className="text-sm text-[#8a998f] animate-pulse">
                      Loading activity data...
                    </div>
                  </div>
                ) : noActivity ? (
                  <div className="mt-8 flex h-[340px] items-center justify-center rounded-xl bg-[#f8faf9]">
                    <div className="px-6 text-center">
                      <p className="text-sm font-semibold text-[#294a36]">
                        No activity found for this duration.
                      </p>

                      <p className="mt-2 text-xs leading-5 text-[#8a998f]">
                        Start tracking activities to see your carbon activity
                        here.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="mt-8 flex h-[340px] gap-4">
                    <div className="flex flex-col justify-between py-1 text-[10px] text-[#8a998f]">
                      {chartScale.ticks.map((tick, index) => (
                        <span key={index}>
                          {Number.isInteger(tick)
                            ? tick
                            : tick.toFixed(1)}
                        </span>
                      ))}
                    </div>

                    <div className="relative flex-1 border-b border-[#dfe9e2]">
                      {[20, 40, 60, 80, 100].map((top) => (
                        <div
                          key={top}
                          className="absolute left-0 right-0 border-t border-dashed border-[#edf2ee]"
                          style={{ top: `${top}%` }}
                        />
                      ))}

                      <div className="absolute inset-x-0 bottom-0 flex h-[92%] items-end justify-around gap-3 overflow-hidden px-2">
                        {selectedChart.values.map((value, index) => {
                          const percentage =
                            chartScale.maximum > 0
                              ? Math.min(
                                  (value / chartScale.maximum) * 100,
                                  100,
                                )
                              : 0;

                          return (
                            <div
                              key={`${selectedChart.labels[index]}-${index}`}
                              className="flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-2"
                            >
                              <div
                                className="w-full max-w-[46px] origin-bottom rounded-t-md bg-[#27834d] animate-[barGrow_.7s_ease_both]"
                                style={{
                                  height: `${percentage}%`,
                                  animationDelay: `${
                                    0.7 + index * 0.05
                                  }s`,
                                }}
                              />

                              <span className="truncate text-[10px] text-[#8a998f]">
                                {selectedChart.labels[index]}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </button>

              <section className="mt-[22px] scroll-reveal rounded-[15px] border border-[#e1ebe4] bg-white p-[25px] shadow-[0_10px_30px_rgba(33,78,50,0.05)] animate-[cardFadeUp_.65s_ease_.66s_both]">
                <div className="flex items-center justify-between gap-5 max-sm:flex-col max-sm:items-start">
                  <div>
                    <p className="mb-1 text-[11px] font-bold tracking-[.15em] text-[#27834d]">
                      SUSTAINABILITY GOALS
                    </p>

                    <h2 className="text-[21px] font-semibold text-[#173f2a]">
                      Your Goals
                    </h2>
                  </div>

                  <button
                    type="button"
                    onClick={() => navigate("/sustainability-goals")}
                    className="h-[40px] rounded-lg border border-[#cfe0d4] bg-white px-4 text-[12px] font-semibold text-[#27834d] transition-all hover:-translate-y-0.5 hover:border-[#bcd5c4] hover:bg-[#f0f8f2] hover:shadow-md active:scale-[.98]"
                  >
                    View All Goals
                  </button>
                </div>

                {goalsLoading ? (
                  <div className="mt-6 flex min-h-[170px] items-center justify-center rounded-xl bg-[#f8faf9]">
                    <span className="text-sm text-[#8a998f] animate-pulse">
                      Loading goals...
                    </span>
                  </div>
                ) : goals.length === 0 ? (
                  <div className="mt-6 flex min-h-[170px] items-center justify-center rounded-xl bg-[#f8faf9]">
                    <div className="px-6 text-center">
                      <p className="text-sm font-semibold text-[#294a36]">
                        No sustainability goals yet
                      </p>

                      <p className="mt-2 text-xs leading-5 text-[#8a998f]">
                        Create a goal to start tracking your sustainability
                        progress.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {activeGoals.slice(0, 3).map((goal, index) => {
                      const isCompleted =
                        goal.status === "complete" ||
                        goal.status === "completed" ||
                        goal.status === "achieve" ||
                        goal.status === "achieved";

                      return (
                        <button
                          key={
                            goal._id ||
                            goal.id ||
                            `${goal.title}-${index}`
                          }
                          type="button"
                          onClick={() =>
                            navigate("/sustainability-goals")
                          }
                          className="rounded-xl border border-[#e1ebe4] bg-[#fbfdfb] p-5 text-left transition-all duration-300 hover:-translate-y-1 hover:border-[#d1e3d7] hover:bg-white hover:shadow-[0_12px_28px_rgba(33,78,50,0.07)]"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <p className="text-[10px] font-bold tracking-[.12em] text-[#27834d]">
                                {goal.category || "SUSTAINABILITY"}
                              </p>

                              <h3 className="mt-1.5 text-sm font-semibold leading-5 text-[#294a36]">
                                {goal.title || "Sustainability Goal"}
                              </h3>
                            </div>

                            <span
                              className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold ${
                                isCompleted
                                  ? "bg-[#eaf5ed] text-[#27834d]"
                                  : "bg-[#f3f8f4] text-[#53685b]"
                              }`}
                            >
                              {isCompleted
                                ? "Completed"
                                : goal.status === "active"
                                  ? "Active"
                                  : "Previous"}
                            </span>
                          </div>

                          <div className="mt-5 grid grid-cols-2 gap-3">
                            <div>
                              <p className="text-[10px] text-[#8a998f]">
                                Target
                              </p>

                              <p className="mt-1 text-sm font-semibold text-[#173f2a]">
                                {goal.target ?? "—"} {goal.unit || ""}
                              </p>
                            </div>

                            <div>
                              <p className="text-[10px] text-[#8a998f]">
                                Period
                              </p>

                              <p className="mt-1 text-sm font-semibold text-[#173f2a]">
                                {goal.period || "—"}
                              </p>
                            </div>
                          </div>

                          <div className="mt-4 border-t border-[#edf2ee] pt-3">
                            <p className="text-[10px] text-[#8a998f]">
                              End date
                            </p>

                            <p className="mt-1 text-xs font-medium text-[#53685b]">
                              {goal.endDate
                                ? goal.endDate.split("T")[0].split("-").reverse().join("/")
                                : "—"}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
            
            </section>

            <section
  className="mt-[22px] scroll-reveal rounded-[15px] border border-[#e1ebe4] bg-white p-[25px] shadow-[0_10px_30px_rgba(33,78,50,0.05)] animate-[cardFadeUp_.65s_ease_.72s_both]"
>
  <div className="flex items-center justify-between gap-5 max-sm:flex-col max-sm:items-start">
    <div>
      <p className="mb-1 text-[11px] font-bold tracking-[.15em] text-[#27834d]">
        COMMUNITY CHALLENGES
      </p>

      <h2 className="text-[21px] font-semibold text-[#173f2a]">
        Your Challenges
      </h2>
    </div>

    <button
      type="button"
      onClick={() => navigate("/community-challenges")}
      className="h-[40px] rounded-lg border border-[#cfe0d4] bg-white px-4 text-[12px] font-semibold text-[#27834d] transition-all hover:-translate-y-0.5 hover:border-[#bcd5c4] hover:bg-[#f0f8f2] hover:shadow-md active:scale-[.98]"
    >
      View All Challenges
    </button>
  </div>

  {challengesLoading ? (
    <div className="mt-6 flex min-h-[170px] items-center justify-center rounded-xl bg-[#f8faf9]">
      <span className="animate-pulse text-sm text-[#8a998f]">
        Loading challenges...
      </span>
    </div>
  ) : challenges.length === 0 ? (
    <div className="mt-6 flex min-h-[170px] items-center justify-center rounded-xl bg-[#f8faf9]">
      <div className="px-6 text-center">
        <p className="text-sm font-semibold text-[#294a36]">
          No challenges joined yet
        </p>

        <p className="mt-2 text-xs leading-5 text-[#8a998f]">
          Explore community challenges and join one to start participating.
        </p>
      </div>
    </div>
  ) : (
    <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {challenges.slice(0, 3).map((challenge, index) => (
        <button
          key={
            challenge._id ||
            challenge.id ||
            `${challenge.title}-${index}`
          }
          type="button"
          onClick={() => navigate("/community-challenges")}
          className="rounded-xl border border-[#e1ebe4] bg-[#fbfdfb] p-5 text-left transition-all duration-300 hover:-translate-y-1 hover:border-[#d1e3d7] hover:bg-white hover:shadow-[0_12px_28px_rgba(33,78,50,0.07)]"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[10px] font-bold tracking-[.12em] text-[#27834d]">
                {formatChallengeCategory(challenge.category)}
              </p>

              <h3 className="mt-1.5 text-sm font-semibold leading-5 text-[#294a36]">
                {challenge.title || "Challenge"}
              </h3>

              <p className="mt-1 text-[11px] text-[#8a998f]">
                {formatChallengeLabel(challenge.challengeType)}
              </p>
            </div>

            <span className="shrink-0 rounded-full bg-[#eaf5ed] px-2.5 py-1 text-[10px] font-semibold text-[#27834d]">
              {formatChallengeLabel(challenge.status)}
            </span>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <div>
              <p className="text-[10px] text-[#8a998f]">
                Target
              </p>

              <p className="mt-1 text-sm font-semibold text-[#173f2a]">
                {challenge.target ?? "—"}{" "}
                {challenge.unit || ""}
              </p>
            </div>

            <div>
              <p className="text-[10px] text-[#8a998f]">
                Period
              </p>

              <p className="mt-1 text-sm font-semibold text-[#173f2a]">
                {formatChallengeLabel(challenge.period)}
              </p>
            </div>
          </div>

          <div className="mt-4 border-t border-[#edf2ee] pt-3">
            <p className="text-[10px] text-[#8a998f]">
              Start Date
            </p>

            <p className="mt-1 text-xs font-medium text-[#53685b]">
              {challenge.startDate
                ? String(challenge.startDate)
                    .slice(0, 10)
                    .split("-")
                    .reverse()
                    .join("/")
                : "—"}
            </p>
          </div>
        </button>
      ))}
    </div>
  )}
              </section>
            </section>
          </main>
        </div>
      </div>
    </>
  );
}

export default Dashboard;