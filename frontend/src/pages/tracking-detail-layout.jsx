import { useEffect, useState } from "react";
import { FiArrowLeft, FiBell, FiChevronDown } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";

const navItems = [
    ["Dashboard", "/dashboard"],
    ["Tracking System", "/tracking"],
    ["Sustainability Goals", "/sustainability-goals"],
    ["Community Challenges", "/community-challenges"],
    ["AI Insights", "/ai-insights"],
    ["Analytics", "/analytics"],
    ["Reports", "/reports"],
    ["Rewards", "/rewards"],
    ["Notifications", "/notifications"],
    ["Profile", "/profile"],
];

export default function TrackingDetailLayout({ title, subtitle, breadcrumbLabel }) {
    const navigate = useNavigate();
    const [profileOpen, setProfileOpen] = useState(false);
    const [notificationOpen, setNotificationOpen] = useState(false);
    const [notifications] = useState([]);
    const unreadNotifications = notifications.filter((notification) => !notification.read);

    useEffect(() => {
        const handleDocumentClick = (event) => {
            if (!event.target.closest(".profile-wrapper")) setProfileOpen(false);
            if (!event.target.closest(".notification-wrapper")) setNotificationOpen(false);
        };

        document.addEventListener("click", handleDocumentClick);
        return () => document.removeEventListener("click", handleDocumentClick);
    }, []);

    const handleLogout = () => {
        window.location.href = "/";
    };

    return (
        <div className="min-h-screen bg-[#f7fbf8] text-[#173f2a] animate-[pageFadeIn_.7s_ease_both] lg:flex">
            <aside className="fixed inset-y-0 left-0 z-40 flex w-[250px] shrink-0 flex-col overflow-hidden border-r border-[#e2ece5] bg-white px-[18px] py-5 animate-[sidebarReveal_.6s_ease_.05s_both] max-lg:w-[220px] max-md:w-[190px] max-sm:relative max-sm:w-full max-sm:border-b max-sm:border-r-0 max-sm:py-5">
                <Link to="/" className="flex shrink-0 items-center border-b border-[#e2ece5] px-3 pb-4">
                    <img src="/assets/Ecotrack1.png" alt="EcoTrack" className="block h-auto w-[160px] max-w-full transition-transform duration-200 hover:scale-[1.02] max-md:w-[150px] max-sm:w-[180px]" />
                </Link>

                <nav className="min-h-0 flex-1 overflow-hidden py-2 pr-1">
                    <div className="flex flex-col gap-1">
                        {navItems.map(([label, href]) => (
                            <Link
                                key={label}
                                to={href}
                                className={`rounded-lg px-3.5 py-3 text-sm font-medium transition-all duration-200 hover:translate-x-[3px] hover:bg-[#f1f8f3] hover:text-[#27834d] ${label === "Tracking System" ? "bg-[#eaf5ed] font-semibold text-[#27834d]" : "text-[#5c7064]"}`}
                            >
                                {label}
                            </Link>
                        ))}
                    </div>
                </nav>

                <div className="shrink-0 pt-1">
                    <div className="mx-2 my-2 h-px bg-[#e2ece5]" />
                    <button type="button" onClick={handleLogout} className="w-full rounded-lg border-0 bg-transparent px-3.5 py-2 text-left text-sm text-[#65766c] transition-all duration-200 hover:translate-x-[3px] hover:bg-[#fdf2f2] hover:text-[#b34b4b]">
                        Logout
                    </button>
                </div>
            </aside>

            <div className="w-full lg:ml-[250px] lg:w-[calc(100%-250px)] max-lg:ml-[220px] max-lg:w-[calc(100%-220px)] max-md:ml-[190px] max-md:w-[calc(100%-190px)] max-sm:ml-0 max-sm:w-full">
                <header className="sticky top-0 z-30 flex h-[76px] items-center justify-between border-b border-[#e2ece5] bg-white px-[4%] animate-[topbarReveal_.6s_ease_.12s_both]">
                    <div className="text-lg font-semibold text-[#173f2a]">Tracking System</div>
                    <div className="flex items-center gap-3.5">
                        <div className="notification-wrapper relative">
                            <button type="button" aria-label="Notifications" onClick={(event) => { event.stopPropagation(); setNotificationOpen(!notificationOpen); setProfileOpen(false); }} className="relative flex h-[38px] w-[38px] items-center justify-center rounded-[9px] border-0 bg-transparent text-[#53685b] transition-all duration-200 hover:bg-[#f1f8f3] hover:text-[#27834d] active:scale-95">
                                <FiBell size={19} />
                                {unreadNotifications.length > 0 && <span className="absolute right-0 top-0 flex h-[17px] min-w-[17px] items-center justify-center rounded-full bg-[#27834d] px-1 text-[10px] font-bold text-white">{unreadNotifications.length > 99 ? "99+" : unreadNotifications.length}</span>}
                            </button>
                            {notificationOpen && <div className="absolute right-0 top-[47px] z-50 w-[310px] overflow-hidden rounded-xl border border-[#e1ebe4] bg-white shadow-[0_12px_30px_rgba(23,63,42,0.12)]"><div className="border-b border-[#edf2ee] px-4 py-3 text-sm font-semibold text-[#294a36]">Recent Notifications</div><div className="px-4 py-7 text-center text-xs text-[#8a998f]">No notifications</div></div>}
                        </div>

                        <div className="profile-wrapper relative">
                            <button type="button" onClick={(event) => { event.stopPropagation(); setProfileOpen(!profileOpen); setNotificationOpen(false); }} className="flex items-center gap-2.5 rounded-lg border-0 bg-transparent px-1 py-1.5 text-left">
                                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#eaf5ed] text-sm font-semibold text-[#27834d]">E</div>
                                <div className="profile-info flex min-w-0 flex-col max-md:hidden"><strong className="text-xs font-semibold text-[#294a36]">Eco User</strong><span className="text-[10px] text-[#8a998f]">Member</span></div>
                                <FiChevronDown className={`text-[#718277] transition-transform duration-200 ${profileOpen ? "rotate-180" : ""}`} size={15} />
                            </button>
                            {profileOpen && <div className="absolute right-0 top-[47px] z-50 w-[180px] overflow-hidden rounded-xl border border-[#e1ebe4] bg-white p-1.5 shadow-[0_12px_30px_rgba(23,63,42,0.12)]"><Link to="/profile" className="block rounded-lg px-3 py-2.5 text-xs text-[#53685b] hover:bg-[#f1f8f3] hover:text-[#27834d]">My Profile</Link><Link to="/settings" className="block rounded-lg px-3 py-2.5 text-xs text-[#53685b] hover:bg-[#f1f8f3] hover:text-[#27834d]">Settings</Link><div className="my-1 h-px bg-[#edf2ee]" /><button type="button" onClick={handleLogout} className="w-full rounded-lg px-3 py-2.5 text-left text-xs text-[#53685b] hover:bg-[#fdf2f2] hover:text-[#b34b4b]">Logout</button></div>}
                        </div>
                    </div>
                </header>

                <main className="px-[4%] pb-12 pt-8 sm:pt-10">
                    <button type="button" onClick={() => navigate("/tracking")} className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#b9d9c3] bg-[#eef7f0] px-4 py-2 text-sm font-semibold text-[#27834d] transition-all hover:-translate-x-0.5 hover:bg-[#dff0e3] hover:text-[#173f2a]">
                        <FiArrowLeft size={16} />
                        Back to Tracking
                    </button>

                    <section className="mb-8">
                        <h1 className="text-[32px] font-bold leading-tight text-[#173f2a] sm:text-[36px]">{title}</h1>
                        <p className="mt-3 max-w-2xl text-base leading-7 text-[#5c7064] sm:text-lg">{subtitle}</p>
                    </section>

                    <section className="min-h-[280px] rounded-3xl border border-[#d7eadf] bg-white p-8 shadow-[0_10px_30px_rgba(33,78,50,0.05)] sm:p-10">
                        <p className="text-base text-[#718277]">Tracking form will be implemented here.</p>
                    </section>
                </main>
            </div>
        </div>
    );
}
