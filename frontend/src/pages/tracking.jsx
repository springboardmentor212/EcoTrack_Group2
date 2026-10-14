import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FiChevronDown } from "react-icons/fi";
import { FaCar, FaBolt, FaTrashAlt } from "react-icons/fa";
import earth from "../assets/earth.svg";
import transportationImage from "../assets/transportation.png";
import electricityImage from "../assets/electricity.png";
import wasteImage from "../assets/waste.svg";

const API_URL = import.meta.env.VITE_API_URL;
const PROFILE_URL = import.meta.env.VITE_PROFILE_URL;

const navItems = [
  ["Dashboard", "/dashboard"],
  ["Carbon Tracking System", "/tracking"],
  ["Sustainability Goals", "/sustainability-goals"],
  ["Community Challenges", "/community-challenges"],
  ["Analytics / Reports", "/analytics"],
  ["Notifications", "/notifications"],
  ["Profile", "/profile"],
];

function Tracking() {
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    location: "",
    profilePhoto: "",
  });

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
      description: "Monitor your energy usage and reduce your footprint.",
      button: "Track Electricity",
      icon: <FaBolt className="text-4xl text-[#27834d]" />,
      route: "/tracking/electricity",
      image: electricityImage,
    },
    {
      title: "Waste Management",
      description: "Track your waste and support a circular economy.",
      button: "Track Waste",
      icon: <FaTrashAlt className="text-4xl text-[#27834d]" />,
      route: "/tracking/waste",
      image: wasteImage,
    },
  ];

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
          error.response?.data?.message || error.message,
        );
      }
    };

    fetchProfile();
  }, []);

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
        error.response?.data?.message || error.message,
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

      <div className="h-screen overflow-hidden bg-[#f7fbf8] text-[#173f2a] animate-[pageFadeIn_.7s_ease_both]">
        <div className="mb-3 animate-[heroFadeUp_.55s_ease_.2s_both]">
          <main className="h-[calc(100vh-76px)] overflow-hidden">
            {/* Hero */}
            <section className="mb-8 rounded-3xl border border-[#e2ece5] bg-[#eef7f0] px-8 py-5">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-[#173f2a]">
                    Choose a Tracking Type
                  </h1>

                  <p className="mt-4 max-w-xl text-base text-[#5c7064]">
                    Select a category below to log your activities and help
                    build a more sustainable future.
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
                    <img
                      src={card.image}
                      alt={`${card.title} illustration`}
                      className="h-full w-full object-contain"
                    />
                  </div>

                  <h3 className="mb-6 text-2xl font-bold">{card.title}</h3>

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
