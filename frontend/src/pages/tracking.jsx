import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FiChevronDown } from "react-icons/fi";
import {
  FaCar,
  FaBolt,
  FaTrashAlt
} from "react-icons/fa";
import earth from "../assets/earth.svg";
import transportationImage from "../assets/transportation.png";
import electricityImage from "../assets/electricity.png";
import wasteImage from "../assets/waste.svg";

const API_URL = import.meta.env.VITE_API_URL;

const navItems = [
    ["Dashboard", "/dashboard"],
    ["Carbon Tracking System", "/tracking"],
    ["Sustainability Goals", "/sustainability-goals"],
    ["Community Challenges", "/community-challenges"],
    ["AI Insights", "/ai-insights"],
    ["Analytics", "/analytics"],
    ["Reports", "/reports"],
    ["Rewards", "/rewards"],
    ["Notifications", "/notifications"],
    ["Profile", "/profile"],
];

function Tracking() {
    const navigate = useNavigate();
    const [profileOpen, setProfileOpen] = useState(false);

    const trackingCards = [
  {
    title: "Transportation",
    description:
      "Log your travel details and commute for a cleaner tomorrow.",
    button: "Track Transportation",
    icon: <FaCar className="text-4xl text-[#27834d]" />,
    route: "/tracking/transportation",
    image: transportationImage,
  },
  {
    title: "Electricity",
    description:
      "Monitor your energy usage and reduce your footprint.",
    button: "Track Electricity",
    icon: <FaBolt className="text-4xl text-[#27834d]" />,
    route: "/tracking/electricity",
    image: electricityImage,

  },
  {
    title: "Waste Management",
    description:
      "Track your waste and support a circular economy.",
    button: "Track Waste",
    icon: <FaTrashAlt className="text-4xl text-[#27834d]" />,
    route: "/tracking/waste",
    image: wasteImage,
  },
];

    useEffect(() => {
        const handleDocumentClick = (event) => {
            if (!event.target.closest(".profile-wrapper")) setProfileOpen(false);
        };

        document.addEventListener("click", handleDocumentClick);
        return () => document.removeEventListener("click", handleDocumentClick);
    }, []);

    const handleLogout = async () => {
    try {
        const { data } = await axios.get(`${API_URL}/logout`, {
            withCredentials: true,
        });

        if (data.success) {
            navigate("/");
        } else {
            console.log(data.message);
        }
    } catch (error) {
        console.error(
            "Logout error:",
            error.response?.data?.message || error.message
        );
    }
};

    return (
        <>
            <style>{`
                @keyframes pageFadeIn { from { opacity: 0; } to { opacity: 1; } }
                @keyframes sidebarReveal { from { opacity: 0; transform: translateX(-18px); } to { opacity: 1; transform: translateX(0); } }
                @keyframes topbarReveal { from { opacity: 0; transform: translateY(-12px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes heroFadeUp { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes cardFadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes progressReveal { from { opacity: 0; transform: scale(.88); } to { opacity: 1; transform: scale(1); } }
                @keyframes barGrow { from { transform: scaleY(0); transform-origin: bottom; } to { transform: scaleY(1); transform-origin: bottom; } }
            `}</style>

            <div className="h-screen overflow-hidden bg-[#f7fbf8] text-[#173f2a] animate-[pageFadeIn_.7s_ease_both] lg:flex">
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
                                    className={`rounded-lg px-3.5 py-3 text-sm font-medium transition-all duration-200 hover:translate-x-[3px] hover:bg-[#f1f8f3] hover:text-[#27834d] ${label === "Carbon Tracking System" ? "bg-[#eaf5ed] font-semibold text-[#27834d]" : "text-[#5c7064]"}`}
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
                        <div className="text-lg font-semibold text-[#173f2a]">Carbon Tracking System</div>

                        {/* Profile */}
                        <div className="profile-wrapper relative">
                            <button
                                type="button"
                                onClick={(event) => {
                                    event.stopPropagation();
                                    setProfileOpen(!profileOpen);
                                }}
                                className="flex items-center gap-2.5 rounded-lg border-0 bg-transparent px-1 py-1.5 text-left"
                            >
                                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#eaf5ed] text-sm font-semibold text-[#27834d]">E</div>

                                <div className="profile-info flex min-w-0 flex-col max-md:hidden">
                                    <strong className="text-xs font-semibold text-[#294a36]">Eco User</strong>
                                    <span className="text-[10px] text-[#8a998f]">Member</span>
                                </div>

                                <FiChevronDown
                                    className={`text-[#718277] transition-transform duration-200 ${profileOpen ? "rotate-180" : ""}`}
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
                    </header>

                    <main className="h-[calc(100vh-76px)] overflow-hidden px-[4%] py-4">

  {/* Hero */}
  <section className="mb-8 rounded-3xl border border-[#e2ece5] bg-[#eef7f0] px-8 py-5">
    <div className="flex items-center justify-between">
      <div>

        <h1 className="text-3xl font-bold text-[#173f2a]">
          Choose a Tracking Type
        </h1>

        <p className="mt-4 max-w-xl text-base text-[#5c7064]">
          Select a category below to log your activities and help build a more sustainable future.
        </p>
      </div>

      <div className="h-32 w-48 shrink-0">
        <img
          src={earth}
          alt="earth"
          className="h-full w-full object-contain"
        />
      </div>
    </div>
  </section>

  <section className="grid gap-6 md:grid-cols-3">
  {trackingCards.map((card) => (
    <div
      key={card.title}
      className="
rounded-3xl
border border-[#e2ece5]
bg-white
p-8
transition-all
duration-300
hover:-translate-y-2
hover:shadow-[0_20px_40px_rgba(23,63,42,0.12)]
"
    >
        <div className="mb-6 flex h-38 items-center justify-center rounded-2xl bg-[#eef7f0] p-4">
          <img src={card.image} alt={`${card.title} illustration`} className="h-full w-full object-contain" />
    </div>

      <h3 className="mb-6 text-2xl font-bold">
        {card.title}
      </h3>

      <p className="mb-8 text-sm text-[#5c7064]">
        {card.description}
      </p>

      <button
      onClick={() => navigate(card.route)}
  className="
    flex
    w-full
    items-center
    justify-center
    gap-2
    rounded-xl
    border
    border-[#5c9d7a]
    bg-white
    py-3
    font-medium
    text-[#1f6a3d]
    transition-all
    duration-300
    hover:bg-[#27834d]
    hover:text-white
  "
>
        {card.button}
      </button>
    </div>
  ))}
</section>
</main>
                </div>
            </div>
        </>
    );
}

export default Tracking;