import { useState } from "react";
import { 
  FaBolt, 
  FaTrashAlt, 
  FaCar, 
  FaWater, 
  FaLeaf, 
  FaPlus, 
  FaEllipsisV, 
  FaCalendarAlt, 
  FaBullseye, 
  FaCheckCircle, 
  FaTimes, 
  FaBell, 
  FaChevronDown,
  FaTachometerAlt,
  FaChartLine,
  FaAward,
  FaUser,
  FaSignOutAlt,
  FaSlidersH,
  FaInfoCircle
} from "react-icons/fa";

export default function SustainabilityGoals() {
  // Goals State with default sample data matching the reference designs
  const [goals, setGoals] = useState([
    {
      id: 1,
      name: "Reduce Electricity Usage",
      category: "Electricity",
      description: "Minimize your energy consumption and switch to energy-efficient appliances.",
      current: 210,
      target: 300,
      unit: "kWh",
      startDate: "2025-09-01",
      endDate: "2025-09-30",
      dueDateFormatted: "30 Sep 2025",
      isCompleted: false,
    },
    {
      id: 2,
      name: "Reduce Waste Generation",
      category: "Waste Management",
      description: "Reduce, recycle and dispose of waste responsibly to minimize landfill impact.",
      current: 4,
      target: 10,
      unit: "kg",
      startDate: "2025-09-01",
      endDate: "2025-10-15",
      dueDateFormatted: "15 Oct 2025",
      isCompleted: false,
    },
    {
      id: 3,
      name: "Reduce Transportation Emissions",
      category: "Transportation",
      description: "Use public transport, carpool or cycle more often to reduce your carbon footprint.",
      current: 5,
      target: 10,
      unit: "trips",
      startDate: "2025-09-01",
      endDate: "2025-10-20",
      dueDateFormatted: "20 Oct 2025",
      isCompleted: false,
    }
  ]);

  // Active Filter Tab: 'all' | 'active' | 'completed'
  const [activeTab, setActiveTab] = useState("all");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProgressModalOpen, setIsProgressModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [progressInput, setProgressInput] = useState("");
  const [activeDropdown, setActiveDropdown] = useState(null);

  // New Goal Form State
  const [newGoal, setNewGoal] = useState({
    name: "",
    category: "Electricity",
    description: "",
    target: "",
    unit: "kWh",
    startDate: new Date().toISOString().split("T")[0],
    endDate: "",
  });

  // Handle Category Change in Modal & auto update default units
  const handleCategoryChange = (e) => {
    const category = e.target.value;
    let unit = "kWh";
    let defaultDesc = "";

    if (category === "Electricity") {
      unit = "kWh";
      defaultDesc = "Minimize your energy consumption and switch to energy-efficient appliances.";
    } else if (category === "Waste Management") {
      unit = "kg";
      defaultDesc = "Reduce, recycle and dispose of waste responsibly to minimize landfill impact.";
    } else if (category === "Transportation") {
      unit = "trips";
      defaultDesc = "Use public transport, carpool or cycle more often to reduce your carbon footprint.";
    } else if (category === "Water Conservation") {
      unit = "Liters";
      defaultDesc = "Monitor household water usage and fix leaks to conserve precious water resources.";
    } else {
      unit = "units";
      defaultDesc = "Track your custom sustainable habits daily.";
    }

    setNewGoal((prev) => ({
      ...prev,
      category,
      unit,
      description: prev.description || defaultDesc,
    }));
  };

  // Create Goal Form Submission
  const handleCreateGoal = (e) => {
    e.preventDefault();
    if (!newGoal.name || !newGoal.target || !newGoal.endDate) return;

    const formattedEndDate = new Date(newGoal.endDate).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

    const created = {
      id: Date.now(),
      name: newGoal.name,
      category: newGoal.category,
      description: newGoal.description || "Track your sustainability target regularly.",
      current: 0,
      target: Number(newGoal.target),
      unit: newGoal.unit,
      startDate: newGoal.startDate,
      endDate: newGoal.endDate,
      dueDateFormatted: formattedEndDate,
      isCompleted: false,
    };

    setGoals((prev) => [created, ...prev]);
    setIsModalOpen(false);
    setNewGoal({
      name: "",
      category: "Electricity",
      description: "",
      target: "",
      unit: "kWh",
      startDate: new Date().toISOString().split("T")[0],
      endDate: "",
    });
  };

  // Add Progress to Goal
  const handleAddProgress = () => {
    if (!selectedGoal || !progressInput) return;
    const addVal = Number(progressInput);

    setGoals((prev) =>
      prev.map((g) => {
        if (g.id === selectedGoal.id) {
          const updatedCurrent = Math.min(g.target, g.current + addVal);
          const isNowCompleted = updatedCurrent >= g.target;
          return {
            ...g,
            current: updatedCurrent,
            isCompleted: isNowCompleted,
          };
        }
        return g;
      })
    );

    setIsProgressModalOpen(false);
    setProgressInput("");
    setSelectedGoal(null);
  };

  // Toggle Goal Completed State directly
  const handleToggleComplete = (id) => {
    setGoals((prev) =>
      prev.map((g) => {
        if (g.id === id) {
          const nextCompletedState = !g.isCompleted;
          return {
            ...g,
            isCompleted: nextCompletedState,
            current: nextCompletedState ? g.target : Math.floor(g.target * 0.5),
          };
        }
        return g;
      })
    );
    setActiveDropdown(null);
  };

  // Delete Goal
  const handleDeleteGoal = (id) => {
    setGoals((prev) => prev.filter((g) => g.id !== id));
    setActiveDropdown(null);
  };

  // Helper for Category Icons
  const getCategoryIcon = (category) => {
    switch (category) {
      case "Electricity":
        return <FaBolt className="text-[#27834d] text-xl" />;
      case "Waste Management":
        return <FaTrashAlt className="text-[#27834d] text-lg" />;
      case "Transportation":
        return <FaCar className="text-[#27834d] text-xl" />;
      case "Water Conservation":
        return <FaWater className="text-[#27834d] text-xl" />;
      default:
        return <FaLeaf className="text-[#27834d] text-xl" />;
    }
  };

  // Filtered Goals based on tab
  const filteredGoals = goals.filter((g) => {
    if (activeTab === "active") return !g.isCompleted;
    if (activeTab === "completed") return g.isCompleted;
    return true;
  });

  const activeGoalsCount = goals.filter((g) => !g.isCompleted).length;
  const completedGoalsCount = goals.filter((g) => g.isCompleted).length;

  // Overall Goal Progress Calculation
  const totalPercentageSum = goals.reduce((acc, g) => {
    const pct = g.target > 0 ? (g.current / g.target) * 100 : 0;
    return acc + Math.min(100, pct);
  }, 0);

  const overallPercentage = goals.length > 0 ? Math.round(totalPercentageSum / goals.length) : 0;

  // Category Breakdown for Goal Progress Overview
  const categoryStats = goals.reduce((acc, g) => {
    if (!acc[g.category]) {
      acc[g.category] = { current: 0, target: 0, count: 0 };
    }
    acc[g.category].current += g.current;
    acc[g.category].target += g.target;
    acc[g.category].count += 1;
    return acc;
  }, {});

  return (
    <div className="flex min-h-screen bg-[#f7fbf8] text-[#173f2a] font-sans antialiased">
      {/* LEFT SIDEBAR NAVIGATION */}
      <aside className="w-64 bg-white border-r border-[#e5eee8] flex flex-col justify-between shrink-0 hidden md:flex">
        <div>
          {/* Logo Brand Header */}
          <div className="h-20 px-6 flex items-center border-b border-[#f0f7f2]">
            <a href="/" className="flex items-center gap-2 text-[#27834d] font-bold text-2xl no-underline">
              <span className="w-10 h-10 rounded-xl bg-[#e8f5ed] flex items-center justify-center text-[#27834d] shadow-xs">
                <FaLeaf className="text-xl" />
              </span>
              <span className="tracking-tight text-[#173f2a]">ECOTRACK</span>
            </a>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5 text-sm font-semibold">
            <a
              href="/dashboard"
              className="flex items-center gap-3 px-4 py-3 text-gray-600 rounded-xl hover:bg-[#f0f7f2] hover:text-[#27834d] transition duration-200 no-underline"
            >
              <FaTachometerAlt className="text-lg opacity-80" />
              <span>Dashboard</span>
            </a>

            <a
              href="/tracking"
              className="flex items-center gap-3 px-4 py-3 text-gray-600 rounded-xl hover:bg-[#f0f7f2] hover:text-[#27834d] transition duration-200 no-underline"
            >
              <FaChartLine className="text-lg opacity-80" />
              <span>Tracking System</span>
            </a>

            <a
              href="/goals"
              className="flex items-center gap-3 px-4 py-3 bg-[#e8f5ed] text-[#27834d] font-bold rounded-xl shadow-xs no-underline"
            >
              <FaBullseye className="text-lg" />
              <span>Sustainability Goals</span>
            </a>

            <a
              href="/challenges"
              className="flex items-center gap-3 px-4 py-3 text-gray-600 rounded-xl hover:bg-[#f0f7f2] hover:text-[#27834d] transition duration-200 no-underline"
            >
              <FaAward className="text-lg opacity-80" />
              <span>Community Challenges</span>
            </a>

            <a
              href="/insights"
              className="flex items-center gap-3 px-4 py-3 text-gray-600 rounded-xl hover:bg-[#f0f7f2] hover:text-[#27834d] transition duration-200 no-underline"
            >
              <FaLeaf className="text-lg opacity-80" />
              <span>AI Insights</span>
            </a>

            <a
              href="/analytics"
              className="flex items-center gap-3 px-4 py-3 text-gray-600 rounded-xl hover:bg-[#f0f7f2] hover:text-[#27834d] transition duration-200 no-underline"
            >
              <FaSlidersH className="text-lg opacity-80" />
              <span>Analytics</span>
            </a>

            <a
              href="/profile"
              className="flex items-center gap-3 px-4 py-3 text-gray-600 rounded-xl hover:bg-[#f0f7f2] hover:text-[#27834d] transition duration-200 no-underline"
            >
              <FaUser className="text-lg opacity-80" />
              <span>Profile</span>
            </a>
          </nav>
        </div>

        {/* Sidebar Footer Logout */}
        <div className="p-4 border-t border-[#f0f7f2]">
          <a
            href="/login"
            className="flex items-center gap-3 px-4 py-3 text-gray-600 font-semibold rounded-xl hover:bg-red-50 hover:text-red-600 transition duration-200 no-underline"
          >
            <FaSignOutAlt className="text-lg" />
            <span>Logout</span>
          </a>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* TOP NAVBAR */}
        <header className="h-20 bg-white border-b border-[#e5eee8] px-6 lg:px-10 flex items-center justify-between shadow-xs relative z-10">
          <div>
            <h1 className="text-2xl font-bold text-[#173f2a] tracking-tight">Sustainability Goals</h1>
            <p className="text-xs text-gray-500 font-medium">Set goals. Track progress. Build better habits.</p>
          </div>

          <div className="flex items-center gap-4">
            {/* Quick Toggle Demo Buttons */}
            <button
              onClick={() => setGoals([])}
              className="hidden xl:block text-xs text-gray-500 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg font-medium transition cursor-pointer"
              title="Test empty state screen"
            >
              Simulate Empty State
            </button>

            {/* Notification Bell Icon */}
            <button className="w-10 h-10 rounded-full bg-[#f0f7f2] flex items-center justify-center text-[#27834d] hover:bg-[#e1f0e6] transition relative cursor-pointer">
              <FaBell className="text-base" />
              <span className="w-2 h-2 rounded-full bg-emerald-500 absolute top-2.5 right-2.5"></span>
            </button>

            {/* Profile Avatar Badge */}
            <div className="flex items-center gap-3 pl-2 border-l border-gray-200">
              <div className="w-10 h-10 rounded-full bg-[#27834d] text-white font-bold flex items-center justify-center text-sm shadow-xs">
                E
              </div>
              <div className="hidden sm:block text-left">
                <div className="text-xs font-bold text-[#173f2a]">Eco User</div>
                <div className="text-[10px] text-gray-500 font-semibold uppercase tracking-wider">Member</div>
              </div>
              <FaChevronDown className="text-xs text-gray-400" />
            </div>
          </div>
        </header>

        {/* MAIN BODY WORKSPACE */}
        <main className="flex-1 p-6 lg:p-10 overflow-y-auto max-w-7xl w-full mx-auto space-y-8">
          
          {/* HEADER BAR: SECTION TITLE & CREATE NEW GOAL BUTTON */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-[#173f2a]">Your Sustainability Goals</h2>
              <p className="text-xs text-gray-500 font-medium mt-0.5">
                {goals.length > 0
                  ? `Showing ${filteredGoals.length} of ${goals.length} total sustainability goals.`
                  : "Start creating targets to reduce your environmental impact."}
              </p>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              {/* Filter Tabs */}
              {goals.length > 0 && (
                <div className="bg-white border border-[#e5eee8] rounded-xl p-1 flex items-center shadow-2xs">
                  <button
                    onClick={() => setActiveTab("all")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                      activeTab === "all"
                        ? "bg-[#27834d] text-white shadow-2xs"
                        : "text-gray-600 hover:text-[#27834d]"
                    }`}
                  >
                    All ({goals.length})
                  </button>
                  <button
                    onClick={() => setActiveTab("active")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                      activeTab === "active"
                        ? "bg-[#27834d] text-white shadow-2xs"
                        : "text-gray-600 hover:text-[#27834d]"
                    }`}
                  >
                    Active ({activeGoalsCount})
                  </button>
                  <button
                    onClick={() => setActiveTab("completed")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                      activeTab === "completed"
                        ? "bg-[#27834d] text-white shadow-2xs"
                        : "text-gray-600 hover:text-[#27834d]"
                    }`}
                  >
                    Completed ({completedGoalsCount})
                  </button>
                </div>
              )}

              {/* Create New Goal Button */}
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#27834d] text-white rounded-xl font-semibold text-sm shadow-sm hover:bg-[#1e6e40] hover:shadow-md transition duration-200 cursor-pointer"
              >
                <FaPlus className="text-xs" />
                <span>Create New Goal</span>
              </button>
            </div>
          </div>

          {/* MAIN GOALS LIST / CARDS SECTION */}
          {goals.length === 0 ? (
            /* 1. INITIAL PAGE - NEW USER (NO GOALS YET EMPTY STATE) */
            <div className="bg-white border border-[#e5eee8] rounded-3xl p-12 lg:p-16 text-center shadow-xs flex flex-col items-center justify-center my-6">
              <div className="w-24 h-24 rounded-full bg-[#e8f5ed] flex items-center justify-center text-[#27834d] mb-6 shadow-xs relative">
                <FaBullseye className="text-5xl" />
                <span className="w-3 h-3 bg-emerald-400 rounded-full absolute top-2 right-2 animate-ping"></span>
              </div>
              <h3 className="text-2xl font-bold text-[#173f2a] mb-2">No goals created yet</h3>
              <p className="text-gray-500 max-w-md text-sm leading-relaxed mb-8">
                Create your first sustainability goal and start tracking your progress toward a cleaner, greener planet.
              </p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#27834d] text-white font-semibold rounded-xl text-base shadow-md hover:bg-[#1e6e40] hover:shadow-lg transition duration-200 cursor-pointer"
              >
                <FaPlus className="text-sm" />
                <span>Create New Goal</span>
              </button>
            </div>
          ) : filteredGoals.length === 0 ? (
            /* Filter empty result view */
            <div className="bg-white border border-[#e5eee8] rounded-2xl p-10 text-center text-gray-500">
              No goals found in the "{activeTab}" filter.
            </div>
          ) : (
            /* GOAL CARDS LIST */
            <div className="space-y-4">
              {filteredGoals.map((goal) => {
                const percentage = Math.min(
                  100,
                  Math.round(goal.target > 0 ? (goal.current / goal.target) * 100 : 0)
                );
                const strokeDashoffset = 100 - percentage;

                return (
                  <div
                    key={goal.id}
                    className={`bg-white border rounded-2xl p-6 transition duration-200 hover:shadow-md relative ${
                      goal.isCompleted ? "border-emerald-200 bg-[#fbfdfb]" : "border-[#e5eee8]"
                    }`}
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                      
                      {/* Left: Icon & Info */}
                      <div className="flex items-start gap-4 flex-1">
                        <div className="w-12 h-12 rounded-2xl bg-[#e8f5ed] flex items-center justify-center shrink-0 shadow-2xs mt-0.5">
                          {getCategoryIcon(goal.category)}
                        </div>

                        <div className="space-y-1.5 flex-1">
                          <div className="flex flex-wrap items-center gap-2.5">
                            <h3 className="text-lg font-bold text-[#173f2a] tracking-tight">{goal.name}</h3>
                            
                            <span className="px-3 py-0.5 rounded-full text-xs font-semibold bg-[#e8f5ed] text-[#27834d]">
                              {goal.category}
                            </span>

                            {goal.isCompleted && (
                              <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-bold bg-emerald-600 text-white shadow-2xs">
                                <FaCheckCircle className="text-xs" />
                                Goal Completed
                              </span>
                            )}
                          </div>

                          <p className="text-xs text-gray-500 max-w-2xl leading-relaxed">{goal.description}</p>
                        </div>
                      </div>

                      {/* Right: Circular Gauge */}
                      <div className="flex items-center gap-4 shrink-0 justify-between md:justify-end">
                        <div className="relative w-16 h-16 flex items-center justify-center">
                          <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
                            <path
                              className="text-gray-100"
                              strokeWidth="3.5"
                              stroke="currentColor"
                              fill="none"
                              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            />
                            <path
                              className={goal.isCompleted ? "text-emerald-600" : "text-[#27834d]"}
                              strokeDasharray="100, 100"
                              strokeDashoffset={strokeDashoffset}
                              strokeLinecap="round"
                              strokeWidth="3.5"
                              stroke="currentColor"
                              fill="none"
                              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            />
                          </svg>
                          <span className="absolute text-xs font-extrabold text-[#173f2a]">{percentage}%</span>
                        </div>
                      </div>
                    </div>

                    {/* Progress Numeric Bar */}
                    <div className="mt-5 space-y-2">
                      <div className="flex justify-between items-center text-xs font-semibold">
                        <span className="text-[#173f2a]">
                          <strong className="text-sm font-extrabold">{goal.current}</strong> / {goal.target} {goal.unit}
                        </span>
                        <span className="text-gray-400">Target: {goal.target} {goal.unit}</span>
                      </div>

                      <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-500 rounded-full ${
                            goal.isCompleted ? "bg-emerald-600" : "bg-[#27834d]"
                          }`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Card Footer Options */}
                    <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center gap-2">
                        <FaCalendarAlt className="text-gray-400" />
                        <span>Due: {goal.dueDateFormatted}</span>
                      </div>

                      <div className="flex items-center gap-3 relative">
                        <button
                          onClick={() => {
                            setSelectedGoal(goal);
                            setIsDetailModalOpen(true);
                          }}
                          className="px-4 py-1.5 border border-[#e5eee8] rounded-xl text-xs font-semibold text-[#27834d] bg-white hover:bg-[#f0f7f2] transition duration-200 cursor-pointer"
                        >
                          View Details
                        </button>

                        {/* Dropdown Options Trigger */}
                        <button
                          onClick={() => setActiveDropdown(activeDropdown === goal.id ? null : goal.id)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition cursor-pointer"
                        >
                          <FaEllipsisV />
                        </button>

                        {/* Dropdown Menu Popup */}
                        {activeDropdown === goal.id && (
                          <div className="absolute right-0 bottom-10 w-48 bg-white border border-[#e5eee8] rounded-xl shadow-lg z-20 py-1.5 text-xs font-medium">
                            <button
                              onClick={() => {
                                setSelectedGoal(goal);
                                setIsProgressModalOpen(true);
                                setActiveDropdown(null);
                              }}
                              className="w-full text-left px-4 py-2 hover:bg-[#f0f7f2] text-[#27834d] flex items-center gap-2 cursor-pointer"
                            >
                              <FaPlus className="text-xs" /> Log Progress
                            </button>

                            <button
                              onClick={() => handleToggleComplete(goal.id)}
                              className="w-full text-left px-4 py-2 hover:bg-[#f0f7f2] text-gray-700 flex items-center gap-2 cursor-pointer"
                            >
                              <FaCheckCircle className="text-xs text-emerald-600" />
                              {goal.isCompleted ? "Mark Incomplete" : "Mark Completed"}
                            </button>

                            <button
                              onClick={() => handleDeleteGoal(goal.id)}
                              className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-600 flex items-center gap-2 border-t border-gray-100 cursor-pointer"
                            >
                              <FaTrashAlt className="text-xs" /> Delete Goal
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* GOAL PROGRESS OVERVIEW ANALYTICS SECTION */}
          <div className="bg-white border border-[#e5eee8] rounded-3xl p-6 lg:p-8 shadow-xs space-y-6">
            <div>
              <h3 className="text-lg font-bold text-[#173f2a]">Goal Progress Overview</h3>
              <p className="text-xs text-gray-500 font-medium">Track your overall progress across all active and completed goals.</p>
            </div>

            {goals.length === 0 ? (
              <div className="py-8 text-center text-gray-400 text-xs flex flex-col items-center">
                <FaInfoCircle className="text-2xl mb-2 opacity-50" />
                <span>No progress to show yet. Your progress will appear here once you create your first goal.</span>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                {/* Left Column: Overall Circular Meter */}
                <div className="flex flex-col items-center justify-center p-6 border border-[#e5eee8] rounded-2xl bg-[#fbfdfb]">
                  <div className="relative w-32 h-32 flex items-center justify-center">
                    <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
                      <path
                        className="text-gray-200"
                        strokeWidth="3.5"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <path
                        className="text-[#27834d]"
                        strokeDasharray="100, 100"
                        strokeDashoffset={100 - overallPercentage}
                        strokeLinecap="round"
                        strokeWidth="3.5"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                    </svg>
                    <span className="absolute text-2xl font-black text-[#173f2a]">{overallPercentage}%</span>
                  </div>

                  <div className="text-center mt-3">
                    <div className="text-xs font-bold text-[#173f2a]">Overall Goal Progress</div>
                    <div className="text-[11px] text-gray-500 font-medium">
                      {overallPercentage === 100
                        ? "All goals completed! 🎉"
                        : overallPercentage > 50
                        ? "Great progress! Keep it up"
                        : "Keep going! You're on your way"}
                    </div>
                  </div>
                </div>

                {/* Right Column: Category Breakdown Progress Bars */}
                <div className="md:col-span-2 space-y-4">
                  {Object.keys(categoryStats).map((catKey) => {
                    const stat = categoryStats[catKey];
                    const catPct = Math.min(100, Math.round(stat.target > 0 ? (stat.current / stat.target) * 100 : 0));

                    return (
                      <div key={catKey} className="space-y-1.5">
                        <div className="flex justify-between items-center text-xs font-semibold">
                          <span className="flex items-center gap-2 text-[#173f2a]">
                            {getCategoryIcon(catKey)}
                            <span>{catKey}</span>
                          </span>
                          <span className="text-gray-600 font-bold">{catPct}%</span>
                        </div>

                        <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#27834d] rounded-full transition-all duration-500"
                            style={{ width: `${catPct}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* 2. CREATE NEW GOAL MODAL OVERLAY */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-[#e5eee8] rounded-3xl max-w-lg w-full p-8 shadow-2xl space-y-6 relative">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <h3 className="text-xl font-bold text-[#173f2a]">Create New Goal</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition cursor-pointer"
              >
                <FaTimes />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleCreateGoal} className="space-y-4 text-xs font-semibold">
              {/* Goal Name */}
              <div className="space-y-1">
                <label className="text-gray-700">Goal Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Reduce electricity usage"
                  value={newGoal.name}
                  onChange={(e) => setNewGoal({ ...newGoal, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#27834d]"
                />
              </div>

              {/* Tracking Category */}
              <div className="space-y-1">
                <label className="text-gray-700">Tracking Category *</label>
                <select
                  value={newGoal.category}
                  onChange={handleCategoryChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:border-[#27834d]"
                >
                  <option value="Electricity">⚡ Electricity</option>
                  <option value="Transportation">🚗 Transportation</option>
                  <option value="Waste Management">🗑️ Waste Management</option>
                  <option value="Water Conservation">💧 Water Conservation</option>
                  <option value="General Eco Target">🌱 General Eco Target</option>
                </select>
              </div>

              {/* Target & Unit */}
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2 space-y-1">
                  <label className="text-gray-700">Target *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="300"
                    value={newGoal.target}
                    onChange={(e) => setNewGoal({ ...newGoal, target: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#27834d]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-gray-700">Unit</label>
                  <input
                    type="text"
                    readOnly
                    value={newGoal.unit}
                    className="w-full px-4 py-3 rounded-xl border border-gray-100 bg-gray-50 text-sm text-gray-600 font-bold"
                  />
                </div>
              </div>

              {/* Start Date & End Date */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-gray-700">Start Date *</label>
                  <input
                    type="date"
                    required
                    value={newGoal.startDate}
                    onChange={(e) => setNewGoal({ ...newGoal, startDate: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#27834d]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-gray-700">End Date *</label>
                  <input
                    type="date"
                    required
                    value={newGoal.endDate}
                    onChange={(e) => setNewGoal({ ...newGoal, endDate: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#27834d]"
                  />
                </div>
              </div>

              {/* Modal Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-2.5 border border-gray-300 rounded-xl text-gray-700 font-semibold hover:bg-gray-50 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#27834d] text-white rounded-xl font-semibold shadow-md hover:bg-[#1e6e40] transition cursor-pointer"
                >
                  Create Goal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* QUICK ADD PROGRESS MODAL */}
      {isProgressModalOpen && selectedGoal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-[#e5eee8] rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-5 relative">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="text-lg font-bold text-[#173f2a]">Log Progress for {selectedGoal.name}</h3>
              <button onClick={() => setIsProgressModalOpen(false)}>
                <FaTimes className="text-gray-400" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <p className="text-gray-600">
                Current progress: <strong>{selectedGoal.current}</strong> / {selectedGoal.target} {selectedGoal.unit}
              </p>
              <input
                type="number"
                min="1"
                placeholder={`Enter value to add (e.g. 50 ${selectedGoal.unit})`}
                value={progressInput}
                onChange={(e) => setProgressInput(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-[#27834d]"
              />
            </div>

            <div className="flex justify-end gap-3 pt-3">
              <button
                onClick={() => setIsProgressModalOpen(false)}
                className="px-4 py-2 border rounded-xl text-gray-600 text-xs font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleAddProgress}
                className="px-5 py-2 bg-[#27834d] text-white rounded-xl text-xs font-semibold shadow-sm hover:bg-[#1e6e40] cursor-pointer"
              >
                Save Progress
              </button>
            </div>
          </div>
        </div>
      )}

      {/* GOAL DETAILS MODAL */}
      {isDetailModalOpen && selectedGoal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-[#e5eee8] rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-6">
            <div className="flex justify-between items-start border-b pb-4">
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#e8f5ed] text-[#27834d]">
                  {selectedGoal.category}
                </span>
                <h3 className="text-xl font-bold text-[#173f2a] mt-1">{selectedGoal.name}</h3>
              </div>
              <button onClick={() => setIsDetailModalOpen(false)}>
                <FaTimes className="text-gray-400 text-lg" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="bg-[#fbfdfb] p-4 rounded-xl border border-emerald-100">
                <div className="font-semibold text-gray-500 mb-1">Description</div>
                <p className="text-gray-800 leading-relaxed text-sm">{selectedGoal.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-gray-50 rounded-xl">
                  <div className="text-gray-500 font-semibold">Start Date</div>
                  <div className="text-sm font-bold text-[#173f2a]">{selectedGoal.startDate}</div>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl">
                  <div className="text-gray-500 font-semibold">Target Due Date</div>
                  <div className="text-sm font-bold text-[#173f2a]">{selectedGoal.dueDateFormatted}</div>
                </div>
              </div>

              <div className="p-4 border rounded-xl space-y-2">
                <div className="flex justify-between font-bold text-sm">
                  <span>Completion Status</span>
                  <span className="text-[#27834d]">
                    {Math.round((selectedGoal.current / selectedGoal.target) * 100)}%
                  </span>
                </div>
                <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#27834d] rounded-full"
                    style={{
                      width: `${Math.min(100, Math.round((selectedGoal.current / selectedGoal.target) * 100))}%`,
                    }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="px-6 py-2 bg-[#27834d] text-white rounded-xl font-semibold text-xs shadow-sm hover:bg-[#1e6e40] cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
