import { useEffect, useState } from "react";
import axios from "axios";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { FiBell, FiChevronDown } from "react-icons/fi";
import { toast } from "react-toastify";

const API_URL = import.meta.env.VITE_API_URL;
const PROFILE_URL = import.meta.env.VITE_PROFILE_URL;
const NOTIFICATION_API = import.meta.env.VITE_NOTIFICATION_API;

const formatPersonName = (value) => {
  if (!value) return "";

  return String(value)
    .trim()
    .toLowerCase()
    .replace(
      /(^|[\s'-])([a-z])/g,
      (_, separator, letter) => separator + letter.toUpperCase(),
    );
};

const navItems = [
  ["Dashboard", "/dashboard"],
  ["Carbon Tracking System", "/tracking"],
  ["Sustainability Goals", "/sustainability-goals"],
  ["Community Challenges", "/community-challenges"],
  ["Notifications", "/notifications"],
  ["Profile", "/profile"],
  ["Settings", "/settings"],
];

const pageTitles = {
  "/": "Home",
  "/dashboard": "Dashboard",
  "/profile": "Profile",
  "/tracking": "Carbon Tracking System",
  "/tracking/transportation": "Transportation Tracking",
  "/tracking/electricity": "Electricity Tracking",
  "/tracking/waste": "Waste Management",
  "/sustainability-goals": "Sustainability Goals",
  "/community-challenges": "Community Challenges",
  "/notifications": "Notifications",
  "/settings": "Settings",
};

function UserLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    location: "",
    profilePhoto: "",
  });
  const [notifications, setNotifications] = useState([]);
  const [notificationsLoading, setNotificationsLoading] = useState(true);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  useEffect(() => {
    let mounted = true;

    const loadProfile = async () => {
      try {
        const { data } = await axios.get(`${PROFILE_URL}/`, {
          withCredentials: true,
        });

        if (mounted && data.success) {
          const p = data.profile || {};
          const fullName =
            [p.firstName || p.first_name, p.lastName || p.last_name]
              .filter(Boolean)
              .join(" ") ||
            p.name ||
            p.fullName ||
            "";

          setProfile({
            name: formatPersonName(fullName),
            email: p.email || "",
            location: p.location || "",
            profilePhoto: p.profilePhoto || "",
          });
        }
      } catch (error) {
        console.error("Profile fetch error:", error);
      }
    };

    loadProfile();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    let mounted = true;

    const loadNotifications = async () => {
      try {
        const { data } = await axios.get(
          `${NOTIFICATION_API}/?selected=all&status=all`,
          { withCredentials: true },
        );

        if (mounted && data.success) {
          setNotifications(
            Array.isArray(data.notificationData) ? data.notificationData : [],
          );
        }
      } catch (error) {
        console.error("Notifications fetch error:", error);
      } finally {
        if (mounted) setNotificationsLoading(false);
      }
    };

    loadNotifications();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    const closeMenus = (event) => {
      if (!event.target.closest(".user-profile-menu")) setProfileOpen(false);
      if (!event.target.closest(".user-notification-menu")) {
        setNotificationOpen(false);
      }
    };

    document.addEventListener("click", closeMenus);
    return () => document.removeEventListener("click", closeMenus);
  }, []);

  const handleLogout = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/logout`, {
        withCredentials: true,
      });

      if (data.success) {
        toast.success(data.message || "Logout successfully");
        navigate("/", { replace: true });
      } else {
        toast.info(data.message || "Already you are logged out");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Unable to logout. Please try again.",
      );
    }
  };

  const isActive = (href) => {
    if (href === "/tracking") return location.pathname.startsWith("/tracking");
    return location.pathname === href;
  };

  const unreadCount = notifications.filter((item) => !item.isRead).length;

  return (
    <div className="min-h-screen bg-[#f7fbf8] text-[#173f2a] lg:flex">
      <aside className="fixed inset-y-0 left-0 z-40 flex w-[250px] flex-col overflow-y-auto border-r border-[#e2ece5] bg-white px-[18px] py-5 max-lg:w-[220px] max-md:w-[190px] max-sm:relative max-sm:w-full max-sm:border-b max-sm:border-r-0">
        <Link
          to="/dashboard"
          className="flex shrink-0 items-center border-b border-[#e2ece5] px-3 pb-4"
        >
          <img
            src="/assets/Ecotrack1.png"
            alt="EcoTrack"
            className="h-auto w-[160px] max-w-full"
          />
        </Link>

        <nav className="flex-1 py-4">
          <div className="flex flex-col gap-1">
            {navItems.map(([label, href]) => (
              <Link
                key={href}
                to={href}
                aria-current={isActive(href) ? "page" : undefined}
                className={`rounded-lg px-3.5 py-3 text-sm transition hover:bg-[#f1f8f3] hover:text-[#27834d] ${
                  isActive(href)
                    ? "bg-[#eaf5ed] font-semibold text-[#27834d]"
                    : "text-[#5c7064]"
                }`}
              >
                {label}
              </Link>
            ))}
          </div>
        </nav>

        <div className="border-t border-[#e2ece5] pt-3">
          <button
            type="button"
            onClick={handleLogout}
            className="w-full rounded-lg px-3.5 py-2 text-left text-sm text-[#65766c] hover:bg-[#fdf2f2] hover:text-[#b34b4b]"
          >
            Logout
          </button>
        </div>
      </aside>

      <div className="w-full lg:ml-[250px] lg:w-[calc(100%-250px)] max-lg:ml-[220px] max-lg:w-[calc(100%-220px)] max-md:ml-[190px] max-md:w-[calc(100%-190px)] max-sm:ml-0 max-sm:w-full">
        <header className="sticky top-0 z-30 flex min-h-[76px] items-center justify-between gap-4 border-b border-[#e2ece5] bg-white px-[4%] py-3">
          <h1 className="text-lg font-semibold text-[#173f2a]">
            {pageTitles[location.pathname] || "EcoTrack"}
          </h1>

          <div className="flex items-center gap-3">
            <div className="user-notification-menu relative">
              <button
                type="button"
                aria-label="Notifications"
                aria-expanded={notificationOpen}
                onClick={(event) => {
                  event.stopPropagation();
                  setNotificationOpen((open) => !open);
                  setProfileOpen(false);
                }}
                className="relative flex h-10 w-10 items-center justify-center rounded-lg hover:bg-[#f1f8f3]"
              >
                <FiBell size={19} />
                {unreadCount > 0 && (
                  <span className="absolute right-0 top-0 flex h-[17px] min-w-[17px] items-center justify-center rounded-full bg-[#27834d] px-1 text-[10px] font-bold text-white">
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </span>
                )}
              </button>

              {notificationOpen && (
                <div className="absolute right-0 top-12 z-50 w-[300px] overflow-hidden rounded-xl border border-[#e1ebe4] bg-white shadow-lg">
                  <p className="border-b border-[#edf2ee] px-4 py-3 text-sm font-semibold">
                    Recent Notifications
                  </p>
                  <div className="max-h-[280px] overflow-y-auto">
                    {notificationsLoading ? (
                      <p className="p-4 text-sm text-[#8a998f]">Loading...</p>
                    ) : notifications.length === 0 ? (
                      <p className="p-4 text-sm text-[#8a998f]">
                        No notifications
                      </p>
                    ) : (
                      notifications.slice(0, 5).map((item, index) => (
                        <button
                          type="button"
                          key={item.id || item._id || index}
                          onClick={() => {
                            setNotificationOpen(false);
                            navigate("/notifications");
                          }}
                          className="block w-full border-b border-[#edf2ee] px-4 py-3 text-left hover:bg-[#f6faf7]"
                        >
                          <span className="block text-xs font-semibold">
                            {item.title}
                          </span>
                          <span className="mt-1 block text-xs text-[#718277]">
                            {item.message}
                          </span>
                        </button>
                      ))
                    )}
                  </div>
                  <Link
                    to="/notifications"
                    onClick={() => setNotificationOpen(false)}
                    className="block p-3 text-center text-xs font-semibold text-[#27834d]"
                  >
                    See All Notifications
                  </Link>
                </div>
              )}
            </div>

            <div className="user-profile-menu relative">
              <button
                type="button"
                aria-expanded={profileOpen}
                onClick={(event) => {
                  event.stopPropagation();
                  setProfileOpen((open) => !open);
                  setNotificationOpen(false);
                }}
                className="flex items-center gap-2 rounded-lg px-1 py-1.5 text-left hover:bg-[#f7fbf8]"
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
                <div className="hidden min-w-0 flex-col md:flex">
                  <span className="max-w-[150px] truncate text-xs font-semibold">
                    {profile.name || "Eco User"}
                  </span>
                  <span className="max-w-[150px] truncate text-[10px] text-[#8a998f]">
                    {profile.email || "Member"}
                  </span>
                </div>
                <FiChevronDown size={15} />
              </button>

              {profileOpen && (
                <div className="absolute right-0 top-12 z-50 w-[180px] rounded-xl border border-[#e1ebe4] bg-white p-1.5 shadow-lg">
                  <Link
                    to="/profile"
                    onClick={() => setProfileOpen(false)}
                    className="block rounded-lg px-3 py-2.5 text-xs hover:bg-[#f1f8f3]"
                  >
                    My Profile
                  </Link>
                  <Link
                    to="/settings"
                    onClick={() => setProfileOpen(false)}
                    className="block rounded-lg px-3 py-2.5 text-xs hover:bg-[#f1f8f3]"
                  >
                    Settings
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full rounded-lg px-3 py-2.5 text-left text-xs text-[#b34b4b] hover:bg-[#fdf2f2]"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="px-[4%] pb-12 pt-8 sm:pt-10">
          <Outlet context={{ profile }} />
        </main>
      </div>
    </div>
  );
}

export default UserLayout;
