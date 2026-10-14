
import { useEffect, useState } from "react";
import axios from "axios";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const API_URL = import.meta.env.VITE_API_URL;
const ADMIN_API = import.meta.env.VITE_ADMIN_API;
const formatPersonName = (name = "") => {
  return name
    .trim()
    .toLowerCase()
    .replace(/\b\p{L}/gu, (char) => char.toUpperCase());
};
const adminNavItems = [
  ["Dashboard", "/admin-dashboard"],
  ["User Management", "/admin-user-management"],
  ["Challenge Management", "/admin-challenge-management"],
  ["Reports", "/admin-reports"],
  ["Profile", "/admin-profile"],
  ["Settings", "/admin-settings"],
];

const adminPageTitles = Object.fromEntries(
  adminNavItems.map(([label, path]) => [path, label]),
);

function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  const [adminProfile, setAdminProfile] = useState({
    name: "",
    email: "",
    profilePhoto: "",
  });
  const [profileOpen, setProfileOpen] = useState(false);

  useEffect(() => {
    let mounted = true;

    const loadAdminProfile = async () => {
      try {
        const { data } = await axios.get(`${ADMIN_API}/profile`, {
          withCredentials: true,
        });

        if (mounted && data.success) {
          setAdminProfile({
            name: formatPersonName(data.profile?.name || ""),
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
      mounted = false;
    };
  }, []);

  useEffect(() => {
    const closeMenu = (event) => {
      if (!event.target.closest(".admin-profile-menu")) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("click", closeMenu);
    return () => document.removeEventListener("click", closeMenu);
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

  const adminInitial = adminProfile.name.trim().charAt(0).toUpperCase() || "A";

  return (
    <div className="min-h-screen bg-[#f7fbf8] text-[#173f2a] lg:flex">
      <aside className="fixed inset-y-0 left-0 z-40 flex w-[250px] flex-col overflow-y-auto border-r border-[#e2ece5] bg-white px-[18px] py-5 max-lg:w-[220px] max-md:w-[190px] max-sm:relative max-sm:w-full max-sm:border-b max-sm:border-r-0">
        <Link
          to="/admin-dashboard"
          className="flex items-center border-b border-[#e2ece5] px-3 pb-4"
        >
          <img
            src="/assets/Ecotrack1.png"
            alt="EcoTrack"
            className="h-auto w-[160px] max-w-full"
          />
        </Link>

        <nav className="flex-1 py-4">
          <p className="mb-3 px-3 text-[10px] font-bold tracking-[.16em] text-[#27834d]">
            ADMIN PORTAL
          </p>
          <div className="flex flex-col gap-1">
            {adminNavItems.map(([label, href]) => {
              const active = location.pathname === href;

              return (
                <Link
                  key={href}
                  to={href}
                  aria-current={active ? "page" : undefined}
                  className={`rounded-lg px-3.5 py-3 text-sm transition hover:bg-[#f1f8f3] hover:text-[#27834d] ${
                    active
                      ? "bg-[#eaf5ed] font-semibold text-[#27834d]"
                      : "text-[#5c7064]"
                  }`}
                >
                  {label}
                </Link>
              );
            })}
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
          <div>
            <p className="text-[10px] font-bold tracking-[.15em] text-[#27834d]">
              ADMIN PORTAL
            </p>
            <h1 className="mt-0.5 text-lg font-semibold">
              {adminPageTitles[location.pathname] || "Admin"}
            </h1>
          </div>

          <div className="admin-profile-menu relative">
            <button
              type="button"
              aria-expanded={profileOpen}
              onClick={(event) => {
                event.stopPropagation();
                setProfileOpen((open) => !open);
              }}
              className="flex items-center gap-2 rounded-lg px-1 py-1.5 text-left hover:bg-[#f7fbf8]"
            >
              <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-[#eaf5ed] text-sm font-semibold text-[#27834d]">
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
              <div className="hidden min-w-0 flex-col md:flex">
                <span className="max-w-[150px] truncate text-xs font-semibold">
                  {adminProfile.name || "Admin"}
                </span>
                <span className="max-w-[150px] truncate text-[10px] text-[#8a998f]">
                  {adminProfile.email || "Administrator"}
                </span>
              </div>
              <span aria-hidden="true">▾</span>
            </button>

            {profileOpen && (
              <div className="absolute right-0 top-12 z-50 w-[190px] rounded-xl border border-[#e1ebe4] bg-white p-1.5 shadow-lg">
                <Link
                  to="/admin-profile"
                  onClick={() => setProfileOpen(false)}
                  className="block rounded-lg px-3 py-2.5 text-xs hover:bg-[#f1f8f3]"
                >
                  Profile
                </Link>
                <Link
                  to="/admin-settings"
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
        </header>

        <main className="px-[4%] pb-12 pt-8 sm:pt-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;