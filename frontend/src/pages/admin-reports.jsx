import { useCallback, useEffect, useRef, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  Title,
} from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  FiBarChart2,
  FiUsers,
  FiActivity,
  FiCheckCircle,
  FiRefreshCw,
  FiEye,
  FiDownload,
  FiX,
  FiAlertCircle,
} from "react-icons/fi";
import { toast } from "react-toastify";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  Title,
);

const Admin_Api = import.meta.env.VITE_ADMIN_API;

const colors = {
  green: "#27834d",
  darkGreen: "#173f2a",
  lightGreen: "#eaf5ed",
  muted: "#718277",
  border: "#e1ebe4",
};

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "bottom",
      labels: {
        usePointStyle: true,
        padding: 18,
        color: colors.muted,
      },
    },
  },
  scales: {
    x: {
      grid: { display: false },
      ticks: { color: colors.muted },
    },
    y: {
      beginAtZero: true,
      ticks: {
        precision: 0,
        color: colors.muted,
      },
      grid: { color: "#edf2ee" },
    },
  },
};

const doughnutOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "bottom",
      labels: {
        usePointStyle: true,
        padding: 18,
        color: colors.muted,
      },
    },
  },
};

function formatDate(value) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatLabel(value) {
  if (value == null || value === "") return "—";

  return String(value)
    .trim()
    .replace(/\s+/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function formatPDFText(value) {
  if (value == null || value === "") return "—";

  return String(value)
    .replace(/CO₂e/gi, "CO2")
    .replace(/kg\s*CO₂e/gi, "kgCO2")
    .replace(/\u00A0/g, " ")
    .replace(/[ \t]+/g, " ")
    .trim();
}

function StatCard({ title, value, icon: Icon, description }) {
  return (
    <div className="transform rounded-2xl border border-[#e1ebe4] bg-white p-5 shadow-[0_8px_25px_rgba(33,78,50,0.04)] transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-lg motion-reduce:transform-none motion-reduce:transition-none">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm text-[#718277]">{title}</p>
          <p className="mt-3 break-words text-3xl font-bold text-[#173f2a]">
            {value}
          </p>
          <p className="mt-2 text-xs text-[#8a998f]">{description}</p>
        </div>

        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#eaf5ed] text-[#27834d]">
          <Icon size={21} />
        </div>
      </div>
    </div>
  );
}

function SectionHeading({ eyebrow, title, description }) {
  return (
    <div className="mb-5">
      <p className="text-[11px] font-bold uppercase tracking-[.14em] text-[#27834d]">
        {eyebrow}
      </p>
      <h2 className="mt-1 text-xl font-bold text-[#173f2a]">{title}</h2>
      <p className="mt-1 text-sm leading-6 text-[#718277]">{description}</p>
    </div>
  );
}

function EmptyState({ message }) {
  return (
    <div className="flex min-h-40 flex-col items-center justify-center px-5 py-8 text-center">
      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#eaf5ed] text-[#27834d]">
        <FiBarChart2 size={21} />
      </div>
      <p className="text-sm font-semibold text-[#294a36]">
        Nothing to display yet
      </p>
      <p className="mt-1 max-w-md text-sm leading-6 text-[#718277]">
        {message}
      </p>
    </div>
  );
}

function ChartPanel({ title, subtitle, children }) {
  return (
    <section className="min-w-0 rounded-2xl border border-[#e1ebe4] bg-white p-5 shadow-[0_8px_25px_rgba(33,78,50,0.04)] sm:p-6">
      <h3 className="text-base font-bold text-[#294a36]">{title}</h3>
      <p className="mt-1 text-xs leading-5 text-[#8a998f]">{subtitle}</p>
      <div className="mt-5 h-[280px] min-w-0">{children}</div>
    </section>
  );
}

const reportAnimationStyles = `
  @keyframes reportFadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .report-fade-in {
    animation: reportFadeIn 350ms ease-out both;
  }

  @media (prefers-reduced-motion: reduce) {
    .report-fade-in {
      animation: none;
    }
  }
`;

const pageLoadingStyles = `
  @keyframes adminPageEnter {
    from {
      opacity: 0;
      transform: translateY(12px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .admin-reports-page {
    animation: adminPageEnter 500ms ease-out both;
  }

  @media (prefers-reduced-motion: reduce) {
    .admin-reports-page {
      animation: none;
    }
  }
`;

function AdminReports() {
  const [activeSection, setActiveSection] = useState("users");
  const [userReport, setUserReport] = useState(null);
  const [challenges, setChallenges] = useState([]);

  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingChallenges, setLoadingChallenges] = useState(true);
  const [usersError, setUsersError] = useState("");
  const [challengesError, setChallengesError] = useState("");

  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState("");
  const [downloading, setDownloading] = useState(false);
  const [previewType, setPreviewType] = useState(null);

  const [downloadingReport, setDownloadingReport] = useState(false);

  const userChartRef = useRef(null);
  const challengeChartRef = useRef(null);
  const detailDoughnutRef = useRef(null);
  const detailBarRef = useRef(null);

  const request = useCallback(async (url) => {
    if (!Admin_Api) {
      throw new Error(
        "Unable to load reports right now. Please try again later.",
      );
    }

    const response = await fetch(url, {
      method: "GET",
      credentials: "include",
      headers: {
        Accept: "application/json",
      },
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok || data.success === false) {
      const error = new Error(data.message || "Unable to load report data.");
      error.status = response.status;
      throw error;
    }

    return data;
  }, []);

  const loadUserReport = useCallback(async () => {
    setLoadingUsers(true);
    setUsersError("");

    try {
      const data = await request(`${Admin_Api}/report/user`);

      if (!data.userData) {
        throw new Error("Unable to load user reports. Please try again later.");
      }

      setUserReport(data.userData);
    } catch (error) {
      setUsersError(
        "User reports are temporarily unavailable. Please try again later.",
        error,
      );
    } finally {
      setLoadingUsers(false);
    }
  }, [request]);

  const loadChallengeReports = useCallback(async () => {
    setLoadingChallenges(true);
    setChallengesError("");

    try {
      const data = await request(`${Admin_Api}/report/challenge`);
      setChallenges(Array.isArray(data.challenges) ? data.challenges : []);
    } catch (error) {
      // The API returns 400 when there are no current-month challenges.
      if (
        error.message === "No completed challenges found for the current month."
      ) {
        setChallenges([]);
        setChallengesError("");
      } else {
        setChallengesError(
          "Challenge reports are temporarily unavailable. Please try again later.",
        );
      }
    } finally {
      setLoadingChallenges(false);
    }
  }, [request]);

  const refreshReports = useCallback(async () => {
    await Promise.all([loadUserReport(), loadChallengeReports()]);
  }, [loadUserReport, loadChallengeReports]);

  useEffect(() => {
    refreshReports();
  }, [refreshReports]);

  const openChallengeReport = async (challenge) => {
    const challengeId = challenge?.id || challenge?._id;

    if (!challengeId) {
      toast.error("Unable to open this challenge report.");
      return;
    }

    setSelectedChallenge(null);
    setDetailError("");
    setDetailLoading(true);

    try {
      const data = await request(
        `${Admin_Api}/report/challenge/${encodeURIComponent(challengeId)}`,
      );

      if (!data.challengeData) {
        throw new Error(
          "Unable to load this challenge report. Please try again.",
        );
      }

      setSelectedChallenge(data.challengeData);
    } catch (error) {
      setDetailError("Unable to load this challenge report.");
      toast.error("Unable to load this challenge report.");
    } finally {
      setDetailLoading(false);
    }
  };

  const closeChallengeReport = () => {
    setSelectedChallenge(null);
    setDetailError("");
  };

  const addChartToPDF = (doc, chartRef, title, y) => {
    const chart = chartRef.current;

    if (!chart) {
      return y;
    }

    const image = chart.toBase64Image("image/png", 1);

    if (!image) {
      return y;
    }

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 14;
    const imageWidth = pageWidth - margin * 2;
    const imageHeight = 75;

    if (y + 10 + imageHeight > pageHeight - margin) {
      doc.addPage();
      y = 20;
    }

    doc.setFontSize(13);
    doc.setTextColor(23, 63, 42);
    doc.text(title, margin, y);

    doc.addImage(image, "PNG", margin, y + 5, imageWidth, imageHeight);

    return y + imageHeight + 15;
  };

  const downloadChallengePDF = () => {
    if (!selectedChallenge || downloading) return;

    setDownloading(true);

    try {
      const challenge = selectedChallenge;

      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();

      doc.setFontSize(20);
      doc.setTextColor(23, 63, 42);
      doc.text("EcoTrack - Challenge Report", 14, 20);

      doc.setFontSize(11);
      doc.setTextColor(80, 100, 86);
      doc.text(String(challenge.title || "Untitled Challenge"), 14, 30);

      doc.setFontSize(9);
      doc.text(`Generated: ${formatDate(new Date())}`, 14, 38);

      autoTable(doc, {
        startY: 46,
        head: [["Challenge Information", "Details"]],
        body: [
          ["Title", challenge.title || "—"],
          ["Category", formatLabel(challenge.category)],
          ["Challenge Type", formatLabel(challenge.challengeType)],
          [
            "Target",
            `${challenge.target ?? "—"} ${
              ["kgco2", "kgco2e"].includes(
                String(challenge.unit || "").toLowerCase(),
              )
                ? "kgCO2"
                : challenge.unit || ""
            }`.trim(),
          ],
          ["Period", formatLabel(challenge.period)],
          ["Direction", formatLabel(challenge.direction)],
          ["Start Date", formatDate(challenge.startDate)],
          ["End Date", formatDate(challenge.endDate)],
          ["Status", formatLabel(challenge.status)],
          ["Created At", formatDate(challenge.createdAt)],
          ["Updated At", formatDate(challenge.updatedAt)],
          ["Objective", formatPDFText(challenge.description?.objective)],
          [
            "Instructions",
            formatPDFText(
              Array.isArray(challenge.description?.instructions)
                ? challenge.description.instructions.join("\n")
                : challenge.description?.instructions,
            ),
          ],
          [
            "Completion Criteria",
            formatPDFText(challenge.description?.completionCriteria),
          ],
        ],
        styles: {
          font: "helvetica",
          fontStyle: "normal",
          fontSize: 9,
          cellPadding: 3,
          overflow: "linebreak",
          charSpace: 0,
          halign: "left",
          valign: "top",
        },
        headStyles: { fillColor: [39, 131, 77] },
        columnStyles: { 0: { cellWidth: 42 }, 1: { cellWidth: "auto" } },
        margin: { left: 14, right: 14 },
      });

      const counts = [
        ["Joined", challenge.totalJoinedUsers],
        ["Completed", challenge.completedUsers],
        ["Failed", challenge.failedUsers],
        ["Cancelled", challenge.cancelledUsers],
      ];

      autoTable(doc, {
        startY: doc.lastAutoTable.finalY + 8,
        head: [["Participation Status", "Users"]],
        body: counts.map(([label, value]) => [label, value ?? 0]),
        styles: { fontSize: 10, cellPadding: 3 },
        headStyles: { fillColor: [39, 131, 77] },
        margin: { left: 14, right: 14 },
      });

      let chartY = doc.lastAutoTable.finalY + 12;

      if (chartY + 90 > doc.internal.pageSize.getHeight() - 14) {
        doc.addPage();
        chartY = 20;
      }

      chartY = addChartToPDF(
        doc,
        detailDoughnutRef,
        "Participation Status",
        chartY,
      );

      chartY = addChartToPDF(doc, detailBarRef, "Status Comparison", chartY);

      const fileTitle = String(challenge.title || "challenge")
        .replace(/[^a-z0-9-_ ]/gi, "")
        .trim()
        .replace(/\s+/g, "-");

      doc.save(`EcoTrack-${fileTitle || "challenge"}-report.pdf`);
      toast.success("Challenge report PDF downloaded.");
    } catch (error) {
      toast.error(error.message || "Unable to generate PDF.");
    } finally {
      setDownloading(false);
    }
  };

  const downloadUserPDF = () => {
    if (!userReport || downloadingReport) return;

    setDownloadingReport(true);

    try {
      const doc = new jsPDF();
      const chartImage = userChartRef.current?.toBase64Image();

      doc.setFontSize(20);
      doc.setTextColor(23, 63, 42);
      doc.text("EcoTrack - User Report", 14, 20);

      doc.setFontSize(10);
      doc.setTextColor(90, 110, 96);
      doc.text(`Generated: ${formatDate(new Date())}`, 14, 29);

      autoTable(doc, {
        startY: 38,
        head: [["Metric", "Users"]],
        body: [
          ["Total Users", userReport.totalUsers ?? 0],
          ["Active Users", userReport.activeUsers ?? 0],
          ["Blocked Users", userReport.blockedUsers ?? 0],
        ],
        headStyles: { fillColor: [39, 131, 77] },
        styles: { fontSize: 11, cellPadding: 4 },
        margin: { left: 14, right: 14 },
      });

      if (chartImage) {
        addChartToPDF(
          doc,
          { current: { toBase64Image: () => chartImage } },
          "User Account Overview",
          doc.lastAutoTable.finalY + 12,
        );
      }

      doc.save("EcoTrack-User-Report.pdf");
      toast.success("User report PDF downloaded.");
    } catch (error) {
      toast.error("Unable to generate the user report PDF.");
    } finally {
      setDownloadingReport(false);
    }
  };

  const downloadChallengeSummaryPDF = () => {
    if (!challenges.length || downloadingReport) return;

    setDownloadingReport(true);

    try {
      const doc = new jsPDF();
      const chartImage = challengeChartRef.current?.toBase64Image();
      const totalJoined = challenges.reduce(
        (sum, item) => sum + (Number(item.totalJoinedUsers) || 0),
        0,
      );
      const totalCompleted = challenges.reduce(
        (sum, item) => sum + (Number(item.completedUsers) || 0),
        0,
      );

      doc.setFontSize(20);
      doc.setTextColor(23, 63, 42);
      doc.text("EcoTrack - Challenge Summary", 14, 20);

      doc.setFontSize(10);
      doc.setTextColor(90, 110, 96);
      doc.text(`Generated: ${formatDate(new Date())}`, 14, 29);

      autoTable(doc, {
        startY: 37,
        head: [["Summary Metric", "Count"]],
        body: [
          ["Challenges", challenges.length],
          ["Total Joined", totalJoined],
          ["Total Completed", totalCompleted],
        ],
        headStyles: { fillColor: [39, 131, 77] },
        styles: { fontSize: 10, cellPadding: 3 },
        margin: { left: 14, right: 14 },
      });

      let y = chartImage
        ? addChartToPDF(
            doc,
            { current: { toBase64Image: () => chartImage } },
            "Joined vs Completed",
            doc.lastAutoTable.finalY + 10,
          )
        : doc.lastAutoTable.finalY + 10;

      if (y + 30 > doc.internal.pageSize.getHeight() - 14) {
        doc.addPage();
        y = 20;
      }

      autoTable(doc, {
        startY: y,
        head: [["Challenge", "Joined", "Completed"]],
        body: challenges.map((item) => [
          item.title || "Untitled Challenge",
          item.totalJoinedUsers ?? 0,
          item.completedUsers ?? 0,
        ]),
        headStyles: { fillColor: [39, 131, 77] },
        styles: { fontSize: 9, cellPadding: 3, overflow: "linebreak" },
        columnStyles: { 0: { cellWidth: "auto" } },
        margin: { left: 14, right: 14 },
      });

      doc.save("EcoTrack-Challenge-Summary.pdf");
      toast.success("Challenge summary PDF downloaded.");
    } catch (error) {
      toast.error("Unable to generate the challenge summary PDF.");
    } finally {
      setDownloadingReport(false);
    }
  };

  const openReportPreview = (type) => {
    if (type === "users" && !userReport) return;
    if (type === "challenges" && !challenges.length) return;

    setPreviewType(type);
  };

  const userChartData = userReport
    ? {
        labels: ["Total Users", "Active Users", "Blocked Users"],
        datasets: [
          {
            label: "Users",
            data: [
              userReport.totalUsers ?? 0,
              userReport.activeUsers ?? 0,
              userReport.blockedUsers ?? 0,
            ],
            backgroundColor: ["#27834d", "#8cc99c", "#df8585"],
            borderRadius: 8,
            maxBarThickness: 62,
          },
        ],
      }
    : null;

  const challengeChartData = {
    labels: challenges.map((challenge) => challenge.title || "Untitled"),
    datasets: [
      {
        label: "Joined",
        data: challenges.map((challenge) => challenge.totalJoinedUsers ?? 0),
        backgroundColor: "#27834d",
        borderRadius: 5,
      },
      {
        label: "Completed",
        data: challenges.map((challenge) => challenge.completedUsers ?? 0),
        backgroundColor: "#9acda7",
        borderRadius: 5,
      },
    ],
  };

  const challengeCounts = selectedChallenge
    ? [
        {
          label: "Joined",
          value: selectedChallenge.totalJoinedUsers,
          color: "#27834d",
        },
        {
          label: "Completed",
          value: selectedChallenge.completedUsers,
          color: "#80bd90",
        },
        {
          label: "Failed",
          value: selectedChallenge.failedUsers,
          color: "#d77979",
        },
        {
          label: "Cancelled",
          value: selectedChallenge.cancelledUsers,
          color: "#e7b45f",
        },
      ]
    : [];

  const detailChartData = {
    labels: challengeCounts.map((item) => item.label),
    datasets: [
      {
        data: challengeCounts.map((item) => item.value ?? 0),
        backgroundColor: challengeCounts.map((item) => item.color),
        borderWidth: 0,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-[#f7fbf8] px-[4%] py-7 text-[#173f2a] sm:py-8 admin-reports-page">
      <style>{pageLoadingStyles}</style>
      <style>{reportAnimationStyles}</style>
      <div className="mx-auto w-full max-w-[1500px]">
        {/* Page heading */}
        <section className="mb-8 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[.14em] text-[#27834d]">
              Administration
            </p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-[28px]">
              Reports & Analytics
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#718277]">
              Review user statistics and monthly challenge performance.
            </p>
          </div>

          <button
            type="button"
            onClick={refreshReports}
            disabled={loadingUsers || loadingChallenges}
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-[#dce8df] bg-white px-4 py-2 text-sm font-semibold text-[#27834d] transition hover:bg-[#f1f8f3] disabled:opacity-60"
          >
            <FiRefreshCw
              className={
                loadingUsers || loadingChallenges ? "animate-spin" : ""
              }
            />
            Refresh
          </button>
        </section>

        {/* Report Selection Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <button
            type="button"
            onClick={() => setActiveSection("users")}
            className={`group rounded-xl border p-5 text-center transform transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-lg active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600 focus-visible:ring-offset-2 ${
              activeSection === "users"
                ? "border-green-600 bg-green-50 shadow-sm"
                : "border-gray-200 bg-white hover:border-green-400"
            }`}
          >
            <div className="mb-2 flex justify-center">
              <FiUsers size={24} />
            </div>
            <h2 className="text-xl font-semibold">User Report</h2>
            <p className="mt-2 text-sm text-gray-500">
              Total, Active, Blocked Users
            </p>
          </button>

          <button
            type="button"
            onClick={() => setActiveSection("challenges")}
            className={`group rounded-xl border p-5 text-center transform transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-lg active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-600 focus-visible:ring-offset-2 ${
              activeSection === "challenges"
                ? "border-green-600 bg-green-50 shadow-sm"
                : "border-gray-200 bg-white hover:border-green-400"
            }`}
          >
            <div className="flex justify-center mb-2">
              <FiBarChart2 size={24} />
            </div>
            <h2 className="text-xl font-semibold">Challenge Reports</h2>
            <p className="mt-2 text-sm text-gray-500">
              Monthly Challenge Overview
            </p>
          </button>
        </div>

        {/* User reports */}
        {activeSection === "users" && (
          <section className="report-fade-in mb-10">
            <SectionHeading
              eyebrow="Overview"
              title="User Reports"
              description="Overall user statistics."
            />

            {!loadingUsers && !usersError && userReport && (
              <div className="mb-5 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => openReportPreview("users")}
                  className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-[#dce8df] bg-white px-4 py-2 text-sm font-semibold text-[#27834d] hover:bg-[#f1f8f3]"
                >
                  <FiEye size={16} />
                  Preview Report
                </button>

                <button
                  type="button"
                  onClick={downloadUserPDF}
                  disabled={downloadingReport}
                  className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-[#27834d] px-4 py-2 text-sm font-semibold text-white hover:bg-[#206c3f] disabled:opacity-60"
                >
                  <FiDownload size={16} />
                  {downloadingReport ? "Preparing PDF..." : "Download PDF"}
                </button>
              </div>
            )}

            {loadingUsers ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {[1, 2, 3].map((item) => (
                  <div
                    key={item}
                    className="animate-pulse rounded-2xl border border-[#e1ebe4] bg-white p-5"
                  >
                    <div className="h-4 w-28 rounded bg-[#eaf5ed]" />
                    <div className="mt-5 h-9 w-20 rounded bg-[#eaf5ed]" />
                    <div className="mt-3 h-3 w-36 max-w-full rounded bg-[#f0f4f1]" />
                  </div>
                ))}
              </div>
            ) : usersError ? (
              <div className="space-y-4">
                <div className="rounded-2xl border border-red-200 bg-white p-6">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                    <div className="flex min-w-0 flex-1 items-start gap-3 text-sm text-red-700">
                      <FiAlertCircle className="mt-0.5 shrink-0" size={18} />

                      <div>
                        <p className="font-semibold">
                          Unable to load user reports
                        </p>
                        <p className="mt-1">{usersError}</p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={loadUserReport}
                      disabled={loadingUsers}
                      className="inline-flex min-h-10 shrink-0 items-center justify-center gap-2 rounded-lg bg-[#27834d] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#206c3f] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <FiRefreshCw
                        className={loadingUsers ? "animate-spin" : ""}
                      />
                      {loadingUsers ? "Retrying..." : "Try Again"}
                    </button>
                  </div>
                </div>
              </div>
            ) : userReport ? (
              <>
                <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  <StatCard
                    title="Total Users"
                    value={userReport.totalUsers ?? 0}
                    icon={FiUsers}
                    description="All registered users"
                  />
                  <StatCard
                    title="Active Users"
                    value={userReport.activeUsers ?? 0}
                    icon={FiActivity}
                    description="Users who are not blocked"
                  />
                  <StatCard
                    title="Blocked Users"
                    value={userReport.blockedUsers ?? 0}
                    icon={FiAlertCircle}
                    description="Accounts currently blocked"
                  />
                </div>

                <ChartPanel
                  title="User Account Overview"
                  subtitle="Comparison of total, active and blocked user counts."
                >
                  <Bar
                    ref={userChartRef}
                    data={userChartData}
                    options={chartOptions}
                  />
                </ChartPanel>
              </>
            ) : (
              <EmptyState message="The user report is currently unavailable." />
            )}
          </section>
        )}

        {/* Challenge reports */}
        {activeSection === "challenges" && (
          <section className="report-fade-in mb-10">
            <SectionHeading
              eyebrow="Current month"
              title="Challenge Reports"
              description="Challenges returned for the current month, with joined and completed user counts."
            />

            {!loadingChallenges &&
              !challengesError &&
              challenges.length > 0 && (
                <div className="mb-5 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => openReportPreview("challenges")}
                    className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-[#dce8df] bg-white px-4 py-2 text-sm font-semibold text-[#27834d] hover:bg-[#f1f8f3]"
                  >
                    <FiEye size={16} />
                    Preview Report
                  </button>

                  <button
                    type="button"
                    onClick={downloadChallengeSummaryPDF}
                    disabled={downloadingReport}
                    className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-[#27834d] px-4 py-2 text-sm font-semibold text-white hover:bg-[#206c3f] disabled:opacity-60"
                  >
                    <FiDownload size={16} />
                    {downloadingReport ? "Preparing PDF..." : "Download PDF"}
                  </button>
                </div>
              )}

            {loadingChallenges ? (
              <div className="space-y-5">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  {[1, 2, 3].map((item) => (
                    <div
                      key={item}
                      className="animate-pulse rounded-2xl border border-[#e1ebe4] bg-white p-5"
                    >
                      <div className="h-4 w-28 rounded bg-[#eaf5ed]" />
                      <div className="mt-5 h-9 w-20 rounded bg-[#eaf5ed]" />
                    </div>
                  ))}
                </div>

                <div className="animate-pulse rounded-2xl border border-[#e1ebe4] bg-white p-6">
                  <div className="h-5 w-48 max-w-full rounded bg-[#eaf5ed]" />
                  <div className="mt-5 h-64 rounded-xl bg-[#f0f4f1]" />
                </div>
              </div>
            ) : challengesError ? (
              <div className="rounded-2xl border border-red-200 bg-white p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                  <div className="flex min-w-0 flex-1 items-start gap-3 text-sm text-red-700">
                    <FiAlertCircle className="mt-0.5 shrink-0" size={18} />

                    <div>
                      <p className="font-semibold">
                        Unable to load challenge reports
                      </p>
                      <p className="mt-1">{challengesError}</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={loadChallengeReports}
                    disabled={loadingChallenges}
                    className="inline-flex min-h-10 shrink-0 items-center justify-center gap-2 rounded-lg bg-[#27834d] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#206c3f] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <FiRefreshCw
                      className={loadingChallenges ? "animate-spin" : ""}
                    />
                    {loadingChallenges ? "Retrying..." : "Try Again"}
                  </button>
                </div>
              </div>
            ) : challenges.length === 0 ? (
              <div className="rounded-2xl border border-[#e1ebe4] bg-white">
                <EmptyState message="No challenges are available in the current monthly report." />
              </div>
            ) : (
              <>
                <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <StatCard
                    title="Challenges"
                    value={challenges.length}
                    icon={FiBarChart2}
                    description="Challenges in this report"
                  />
                  <StatCard
                    title="Total Joined"
                    value={challenges.reduce(
                      (total, challenge) =>
                        total + (Number(challenge.totalJoinedUsers) || 0),
                      0,
                    )}
                    icon={FiUsers}
                    description="Combined challenge participants"
                  />
                  <StatCard
                    title="Total Completed"
                    value={challenges.reduce(
                      (total, challenge) =>
                        total + (Number(challenge.completedUsers) || 0),
                      0,
                    )}
                    icon={FiCheckCircle}
                    description="Combined challenge completions"
                  />
                </div>

                <div className="mb-6">
                  <ChartPanel
                    title="Joined vs Completed"
                    subtitle="Compare participation and completion for each challenge."
                  >
                    <Bar
                      ref={challengeChartRef}
                      data={challengeChartData}
                      options={{
                        ...chartOptions,
                        maintainAspectRatio: false,
                        scales: {
                          ...chartOptions.scales,
                          x: {
                            ...chartOptions.scales.x,
                            ticks: {
                              ...chartOptions.scales.x.ticks,
                              maxRotation: 35,
                              minRotation: 0,
                            },
                          },
                        },
                      }}
                    />
                  </ChartPanel>
                </div>

                <section className="report-fade-in overflow-hidden rounded-2xl border border-[#e1ebe4] bg-white shadow-[0_8px_25px_rgba(33,78,50,0.04)]">
                  <div className="border-b border-[#e7eee9] px-5 py-5 sm:px-6">
                    <h3 className="font-bold text-[#294a36]">
                      Monthly Challenge Details
                    </h3>
                    <p className="mt-1 text-xs leading-5 text-[#8a998f]">
                      Open an individual report for its full status breakdown.
                    </p>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[650px] border-collapse">
                      <thead>
                        <tr className="border-b border-[#e7eee9] bg-[#fbfdfb]">
                          {["Challenge", "Joined", "Completed", "Action"].map(
                            (heading) => (
                              <th
                                key={heading}
                                className="px-5 py-4 text-left text-[11px] font-semibold uppercase tracking-[.08em] text-[#718277]"
                              >
                                {heading}
                              </th>
                            ),
                          )}
                        </tr>
                      </thead>
                      <tbody>
                        {challenges.map((challenge, index) => (
                          <tr
                            key={challenge.id || challenge._id || index}
                            className="border-b border-[#edf2ee] transition-colors hover:bg-[#fbfdfb]"
                          >
                            <td className="px-5 py-4">
                              <p className="max-w-sm text-sm font-semibold text-[#294a36]">
                                {challenge.title || "Untitled Challenge"}
                              </p>
                            </td>
                            <td className="px-5 py-4 text-sm text-[#53685b]">
                              {challenge.totalJoinedUsers ?? 0}
                            </td>
                            <td className="px-5 py-4 text-sm text-[#53685b]">
                              {challenge.completedUsers ?? 0}
                            </td>
                            <td className="px-5 py-4">
                              <button
                                type="button"
                                onClick={() => openChallengeReport(challenge)}
                                disabled={detailLoading}
                                className="inline-flex items-center gap-2 rounded-lg bg-[#eaf5ed] px-3 py-2 text-xs font-semibold text-[#27834d] transition hover:bg-[#dff1e4] disabled:opacity-60"
                              >
                                <FiEye size={14} />
                                View Report
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>
              </>
            )}
          </section>
        )}
      </div>

      {/* Detail loading / error */}
      {detailLoading && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#173f2a]/30 p-4"
          role="status"
        >
          <div className="flex items-center gap-3 rounded-xl bg-white px-6 py-5 text-sm font-medium text-[#294a36] shadow-xl">
            <span className="h-5 w-5 animate-spin rounded-full border-2 border-[#dce8df] border-t-[#27834d]" />
            Loading detailed challenge report...
          </div>
        </div>
      )}

      {detailError && !selectedChallenge && (
        <div className="fixed inset-x-4 bottom-5 z-[110] mx-auto max-w-lg rounded-xl border border-red-200 bg-white p-4 shadow-xl">
          <div className="flex items-start justify-between gap-4">
            <p className="text-sm text-red-700">{detailError}</p>
            <button
              type="button"
              onClick={() => setDetailError("")}
              aria-label="Dismiss error"
              className="text-red-700"
            >
              <FiX size={18} />
            </button>
          </div>
        </div>
      )}

      {/* Detailed challenge report preview */}
      {selectedChallenge && (
        <>
          <div
            className="fixed inset-0 z-[100] overflow-y-auto bg-[#173f2a]/40 p-3 sm:p-6 report-fade-in"
            role="dialog"
            aria-modal="true"
            aria-labelledby="challenge-report-title"
          >
            <div className="mx-auto my-3 w-full max-w-5xl overflow-hidden rounded-2xl bg-[#f7fbf8] shadow-2xl sm:my-6">
              <header className="flex flex-wrap items-start justify-between gap-4 border-b border-[#e1ebe4] bg-white px-5 py-5 sm:px-7">
                <div className="min-w-0">
                  <p className="text-[11px] font-bold uppercase tracking-[.14em] text-[#27834d]">
                    Report Preview
                  </p>
                  <h2
                    id="challenge-report-title"
                    className="mt-1 break-words text-xl font-bold text-[#173f2a] sm:text-2xl"
                  >
                    {selectedChallenge.title || "Challenge Report"}
                  </h2>
                  <p className="mt-2 text-sm text-[#718277]">
                    {formatDate(selectedChallenge.startDate)} –{" "}
                    {formatDate(selectedChallenge.endDate)}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={downloadChallengePDF}
                    disabled={downloading}
                    className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-[#27834d] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#206c3f] disabled:opacity-60"
                  >
                    <FiDownload size={15} />
                    {downloading ? "Preparing PDF..." : "Download PDF"}
                  </button>

                  <button
                    type="button"
                    onClick={closeChallengeReport}
                    aria-label="Close report preview"
                    className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#dce8df] bg-white text-[#53685b] hover:bg-[#f1f8f3]"
                  >
                    <FiX size={18} />
                  </button>
                </div>
              </header>

              <div className="space-y-6 p-4 sm:p-7">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  {challengeCounts.map((item) => (
                    <StatCard
                      key={item.label}
                      title={item.label}
                      value={item.value ?? 0}
                      icon={
                        item.label === "Completed"
                          ? FiCheckCircle
                          : item.label === "Joined"
                            ? FiUsers
                            : FiActivity
                      }
                      description="Users reported for this status"
                    />
                  ))}
                </div>

                <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
                  <ChartPanel
                    title="Participation Status"
                    subtitle="Distribution of available challenge statuses."
                  >
                    <Doughnut
                      ref={detailDoughnutRef}
                      data={detailChartData}
                      options={doughnutOptions}
                    />
                  </ChartPanel>

                  <ChartPanel
                    title="Status Comparison"
                    subtitle="User count by challenge status."
                  >
                    <Bar
                      ref={detailBarRef}
                      data={{
                        labels: challengeCounts.map((item) => item.label),
                        datasets: [
                          {
                            label: "Users",
                            data: challengeCounts.map(
                              (item) => item.value ?? 0,
                            ),
                            backgroundColor: challengeCounts.map(
                              (item) => item.color,
                            ),
                            borderRadius: 7,
                            maxBarThickness: 55,
                          },
                        ],
                      }}
                      options={chartOptions}
                    />
                  </ChartPanel>
                </div>

                <section className="rounded-2xl border border-[#e1ebe4] bg-white p-5 sm:p-6">
                  <h3 className="text-base font-bold text-[#294a36]">
                    Challenge Information
                  </h3>

                  <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {[
                      ["Category", formatLabel(selectedChallenge.category)],
                      [
                        "Challenge Type",
                        formatLabel(selectedChallenge.challengeType),
                      ],
                      [
                        "Target",
                        `${selectedChallenge.target ?? "—"} ${
                          ["kgco2", "kgco2e"].includes(
                            String(selectedChallenge.unit || "")
                              .trim()
                              .toLowerCase(),
                          )
                            ? "kgCO₂e"
                            : selectedChallenge.unit || ""
                        }`.trim(),
                      ],
                      ["Title", selectedChallenge.title],
                      ["Period", formatLabel(selectedChallenge.period)],
                      ["Start Date", formatDate(selectedChallenge.startDate)],
                      ["End Date", formatDate(selectedChallenge.endDate)],
                      ["Direction", formatLabel(selectedChallenge.direction)],
                      ["Status", formatLabel(selectedChallenge.status)],
                      ["Created At", formatDate(selectedChallenge.createdAt)],
                      ["Updated At", formatDate(selectedChallenge.updatedAt)],
                    ].map(([label, value]) => (
                      <div
                        key={label}
                        className="min-w-0 rounded-xl bg-[#f7fbf8] p-3"
                      >
                        <p className="text-xs text-[#8a998f]">{label}</p>
                        <p className="mt-1 break-words text-sm font-semibold text-[#294a36]">
                          {value ?? "—"}
                        </p>
                      </div>
                    ))}
                  </div>

                  {[
                    ["Objective", selectedChallenge.description?.objective],
                    [
                      "Instructions",
                      selectedChallenge.description?.instructions,
                    ],
                    [
                      "Completion Criteria",
                      selectedChallenge.description?.completionCriteria,
                    ],
                  ].map(([label, value]) => (
                    <div key={label} className="mt-4">
                      <h4 className="text-sm font-semibold text-[#294a36]">
                        {label}
                      </h4>
                      <p className="mt-1 whitespace-pre-wrap break-words text-sm leading-6 text-[#718277]">
                        {value || "Not provided"}
                      </p>
                    </div>
                  ))}
                </section>

                <section className="overflow-hidden rounded-2xl border border-[#e1ebe4] bg-white">
                  <div className="border-b border-[#e7eee9] px-5 py-4">
                    <h3 className="font-bold text-[#294a36]">
                      Status Breakdown
                    </h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[400px] border-collapse">
                      <thead>
                        <tr className="bg-[#fbfdfb]">
                          <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[#718277]">
                            Status
                          </th>
                          <th className="px-5 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-[#718277]">
                            Users
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {challengeCounts.map((item) => (
                          <tr
                            key={item.label}
                            className="border-t border-[#edf2ee]"
                          >
                            <td className="px-5 py-3 text-sm text-[#53685b]">
                              <span
                                className="mr-2 inline-block h-2.5 w-2.5 rounded-full"
                                style={{ backgroundColor: item.color }}
                              />
                              {item.label}
                            </td>
                            <td className="px-5 py-3 text-right text-sm font-semibold text-[#294a36]">
                              {item.value ?? 0}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <p className="px-5 py-3 text-xs leading-5 text-[#8a998f]">
                    Only status counts returned by the current API are
                    displayed. Participants with no entries are included in the
                    Failed count. A separate No Entry count is not currently
                    provided by the API.
                  </p>
                </section>
              </div>
            </div>
          </div>
        </>
      )}
      {previewType && (
        <div
          className="fixed inset-0 z-[120] overflow-y-auto bg-[#173f2a]/40 p-3 sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="general-report-preview-title"
        >
          <div className="mx-auto my-4 w-full max-w-4xl overflow-hidden rounded-2xl bg-[#f7fbf8] shadow-2xl">
            <header className="flex flex-wrap items-center justify-between gap-3 border-b border-[#e1ebe4] bg-white px-5 py-5">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#27834d]">
                  EcoTrack · Report Preview
                </p>
                <h2
                  id="general-report-preview-title"
                  className="mt-1 text-xl font-bold text-[#173f2a]"
                >
                  {previewType === "users"
                    ? "User Report"
                    : "Monthly Challenge Summary"}
                </h2>
                <p className="mt-1 text-xs text-[#718277]">
                  Generated: {formatDate(new Date())}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setPreviewType(null)}
                aria-label="Close report preview"
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-[#dce8df] bg-white hover:bg-[#f1f8f3]"
              >
                <FiX size={18} />
              </button>
            </header>

            <div className="space-y-5 p-4 sm:p-6">
              {previewType === "users" && userReport && (
                <>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    {[
                      ["Total Users", userReport.totalUsers ?? 0],
                      ["Active Users", userReport.activeUsers ?? 0],
                      ["Blocked Users", userReport.blockedUsers ?? 0],
                    ].map(([label, value]) => (
                      <div
                        key={label}
                        className="rounded-xl border border-[#e1ebe4] bg-white p-4"
                      >
                        <p className="text-xs text-[#718277]">{label}</p>
                        <p className="mt-2 text-2xl font-bold text-[#173f2a]">
                          {value}
                        </p>
                      </div>
                    ))}
                  </div>

                  <section className="rounded-xl border border-[#e1ebe4] bg-white p-4">
                    <h3 className="mb-3 font-bold text-[#294a36]">
                      User Account Overview
                    </h3>
                    <div className="h-[280px]">
                      <Bar data={userChartData} options={chartOptions} />
                    </div>
                  </section>

                  <section className="overflow-x-auto rounded-xl border border-[#e1ebe4] bg-white">
                    <table className="w-full min-w-[300px]">
                      <thead>
                        <tr className="bg-[#eaf5ed]">
                          <th className="px-4 py-3 text-left text-sm">
                            Metric
                          </th>
                          <th className="px-4 py-3 text-right text-sm">
                            Count
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          ["Total Users", userReport.totalUsers ?? 0],
                          ["Active Users", userReport.activeUsers ?? 0],
                          ["Blocked Users", userReport.blockedUsers ?? 0],
                        ].map(([label, value]) => (
                          <tr key={label} className="border-t border-[#e1ebe4]">
                            <td className="px-4 py-3 text-sm">{label}</td>
                            <td className="px-4 py-3 text-right text-sm font-semibold">
                              {value}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </section>
                </>
              )}

              {previewType === "challenges" && challenges.length > 0 && (
                <>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <div className="rounded-xl border border-[#e1ebe4] bg-white p-4">
                      <p className="text-xs text-[#718277]">Challenges</p>
                      <p className="mt-2 text-2xl font-bold">
                        {challenges.length}
                      </p>
                    </div>
                    <div className="rounded-xl border border-[#e1ebe4] bg-white p-4">
                      <p className="text-xs text-[#718277]">Total Joined</p>
                      <p className="mt-2 text-2xl font-bold">
                        {challenges.reduce(
                          (sum, item) =>
                            sum + (Number(item.totalJoinedUsers) || 0),
                          0,
                        )}
                      </p>
                    </div>
                    <div className="rounded-xl border border-[#e1ebe4] bg-white p-4">
                      <p className="text-xs text-[#718277]">Total Completed</p>
                      <p className="mt-2 text-2xl font-bold">
                        {challenges.reduce(
                          (sum, item) =>
                            sum + (Number(item.completedUsers) || 0),
                          0,
                        )}
                      </p>
                    </div>
                  </div>

                  <section className="rounded-xl border border-[#e1ebe4] bg-white p-4">
                    <h3 className="mb-3 font-bold text-[#294a36]">
                      Joined vs Completed
                    </h3>
                    <div className="h-[300px]">
                      <Bar data={challengeChartData} options={chartOptions} />
                    </div>
                  </section>

                  <section className="overflow-x-auto rounded-xl border border-[#e1ebe4] bg-white">
                    <table className="w-full min-w-[440px]">
                      <thead>
                        <tr className="bg-[#eaf5ed]">
                          {["Challenge", "Joined", "Completed"].map((label) => (
                            <th
                              key={label}
                              className="px-4 py-3 text-left text-sm"
                            >
                              {label}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {challenges.map((item, index) => (
                          <tr
                            key={item.id || item._id || index}
                            className="border-t border-[#e1ebe4]"
                          >
                            <td className="px-4 py-3 text-sm">
                              {item.title || "Untitled Challenge"}
                            </td>
                            <td className="px-4 py-3 text-sm">
                              {item.totalJoinedUsers ?? 0}
                            </td>
                            <td className="px-4 py-3 text-sm">
                              {item.completedUsers ?? 0}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </section>
                </>
              )}

              <footer className="flex flex-wrap justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setPreviewType(null)}
                  className="min-h-10 rounded-lg border border-[#dce8df] bg-white px-4 py-2 text-sm font-semibold text-[#53685b] hover:bg-[#f1f8f3]"
                >
                  Close Preview
                </button>

                <button
                  type="button"
                  onClick={
                    previewType === "users"
                      ? downloadUserPDF
                      : downloadChallengeSummaryPDF
                  }
                  disabled={downloadingReport}
                  className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-[#27834d] px-4 py-2 text-sm font-semibold text-white hover:bg-[#206c3f] disabled:opacity-60"
                >
                  <FiDownload size={16} />
                  {downloadingReport ? "Preparing PDF..." : "Download PDF"}
                </button>
              </footer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminReports;
