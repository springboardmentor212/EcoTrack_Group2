import { FiArrowLeft } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

export default function TrackingDetailLayout({
  title,
  subtitle,
  breadcrumbLabel,
  children,
}) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#f7fbf8] text-[#173f2a] animate-[pageFadeIn_.7s_ease_both] lg:flex">
      <div className="w-full">
        <header className="sticky top-0 z-30 flex h-[76px] items-center border-b border-[#e2ece5] bg-white px-[4%] animate-[topbarReveal_.6s_ease_.12s_both]">
          <div className="text-lg font-semibold text-[#173f2a]">
            Carbon Tracking System
          </div>
        </header>

        <main className="px-[4%] pb-12 pt-8 sm:pt-10">
          <button
            type="button"
            onClick={() => navigate("/tracking")}
            className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#b9d9c3] bg-[#eef7f0] px-4 py-2 text-sm font-semibold text-[#27834d] transition-all hover:-translate-x-0.5 hover:bg-[#dff0e3] hover:text-[#173f2a]"
          >
            <FiArrowLeft size={16} />
            Back to Tracking
          </button>

          <section className="mb-8">
            <h1 className="text-[32px] font-bold leading-tight text-[#173f2a] sm:text-[36px]">
              {title}
            </h1>

            <p className="mt-3 max-w-2xl text-base leading-7 text-[#5c7064] sm:text-lg">
              {subtitle}
            </p>
          </section>

          <section className="rounded-3xl border border-[#d7eadf] bg-white p-8 shadow-[0_10px_30px_rgba(33,78,50,0.05)] sm:p-10">
            {children}
          </section>
        </main>
      </div>
    </div>
  );
}