import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const CHALLENGE_URL = import.meta.env.VITE_CHALLENGE_API;

const categoryDisplayMap = {
  transportation: "Transportation",
  electricity: "Electricity",
  "waste management": "Waste Management",
  "carbon emission": "Carbon Emission",
  "carbon save": "Carbon Save",
};

const formatLabel = (value) => {
  if (!value) return "—";

  return String(value)
    .trim()
    .split(/\s+/)
    .map((word) => {
      if (!word) return word;

      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(" ");
};

const getCategoryLabel = (category) => {
  return categoryDisplayMap[category] || formatLabel(category);
};

const formatDate = (value) => {
  if (!value) return "—";

  const datePart = String(value).slice(0, 10);
  const [year, month, day] = datePart.split("-").map(Number);

  if (!year || !month || !day) {
    return String(value);
  }

  return new Date(year, month - 1, day).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const getStatusClass = (status) => {
  switch (status) {
    case "active":
      return "status-active";

    case "completed":
      return "status-completed";

    case "failed":
      return "status-failed";

    case "cancelled":
      return "status-cancelled";

    case "closed":
      return "status-closed";

    case "not started":
      return "status-not-start";

    case "continue":
      return "status-continue";

    default:
      return "status-default";
  }
};

const Icon = ({ type }) => {
  if (type === "target") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="8" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="12" cy="12" r="1.5" />
      </svg>
    );
  }

  if (type === "calendar") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <rect x="3" y="5" width="18" height="16" rx="2" />
        <line x1="7" y1="3" x2="7" y2="7" />
        <line x1="17" y1="3" x2="17" y2="7" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    );
  }

  if (type === "clock") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="9" />
        <polyline points="12,7 12,12 15,14" />
      </svg>
    );
  }

  if (type === "users") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="9" cy="8" r="3" />
        <path d="M3.5 19c.5-3.2 2.2-5 5.5-5s5 1.8 5.5 5" />
        <path d="M16 6.5c2.1.2 3.5 1.7 3.5 3.8" />
        <path d="M17 14.2c2 .5 3.2 2 3.5 4.8" />
      </svg>
    );
  }

  if (type === "arrow-left") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <line x1="19" y1="12" x2="5" y2="12" />
        <polyline points="11,6 5,12 11,18" />
      </svg>
    );
  }

  if (type === "arrow-right") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <line x1="5" y1="12" x2="19" y2="12" />
        <polyline points="13,6 19,12 13,18" />
      </svg>
    );
  }

  if (type === "arrow") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <line x1="5" y1="12" x2="19" y2="12" />
        <polyline points="13,6 19,12 13,18" />
      </svg>
    );
  }

  if (type === "close") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <line x1="6" y1="6" x2="18" y2="18" />
        <line x1="18" y1="6" x2="6" y2="18" />
      </svg>
    );
  }

  return null;
};

function ChallengeCard({
  challenge,
  type,
  onDetails,
  onJoin,
  onCancel,
  actionLoading,
}) {
  const challengeId = challenge?._id || challenge?.id;

  const today = new Date();
  today.setHours(23, 59, 59, 999);

  const challengeEndDate = challenge.endDate
    ? new Date(challenge.endDate)
    : null;

  const canCancel =
    type === "my" &&
    (challenge.status === "not started" ||
      challenge.status === "active" ||
      (challenge.status === "failed" &&
        challengeEndDate &&
        challengeEndDate >= today));

  const canJoin =
    type === "available" &&
    (challenge.status === "not started" || challenge.status === "ongoing");

  return (
    <article className="challenge-card">
      <div className="challenge-card-top">
        <span className="challenge-category">
          {getCategoryLabel(challenge.category)}
        </span>

        {challenge.status && (
          <span
            className={`challenge-status ${getStatusClass(challenge.status)}`}
          >
            {formatLabel(challenge.status)}
          </span>
        )}
      </div>

      <h3>{challenge.title || "Untitled Challenge"}</h3>

      <p className="challenge-type">{formatLabel(challenge.challengeType)}</p>

      <div className="challenge-highlight">
        <div className="highlight-icon">
          <Icon type="target" />
        </div>

        <div>
          <span>Challenge Target</span>

          <strong>
            {challenge.target ?? "—"} {challenge.unit || ""}
          </strong>
        </div>
      </div>

      <div className="challenge-meta-grid">
        <div className="challenge-meta-item">
          <span className="meta-icon">
            <Icon type="clock" />
          </span>

          <div>
            <span>Period</span>
            <strong>{formatLabel(challenge.period)}</strong>
          </div>
        </div>

        <div className="challenge-meta-item">
          <span className="meta-icon">
            <Icon type="calendar" />
          </span>

          <div>
            <span>Start Date</span>
            <strong>{formatDate(challenge.startDate)}</strong>
          </div>
        </div>
      </div>

      <div className="challenge-end-date">
        <span>Ends on</span>
        <strong>{formatDate(challenge.endDate)}</strong>
      </div>

      <div className="challenge-card-footer">
        <button
          type="button"
          className="secondary-button"
          onClick={() => onDetails(challenge)}
        >
          View Details
          <span className="button-icon">
            <Icon type="arrow" />
          </span>
        </button>

        {canJoin && (
          <button
            type="button"
            className="primary-button"
            onClick={() => onJoin(challenge)}
            disabled={actionLoading === challengeId}
          >
            {actionLoading === challengeId ? "Joining..." : "Join Challenge"}
          </button>
        )}

        {canCancel && (
          <button
            type="button"
            className="cancel-button"
            onClick={() => onCancel(challenge)}
            disabled={actionLoading === challengeId}
          >
            {actionLoading === challengeId
              ? "Cancelling..."
              : "Cancel Challenge"}
          </button>
        )}
      </div>
    </article>
  );
}

function ChallengeSection({
  title,
  description,
  icon,
  challenges,
  type,
  onDetails,
  onJoin,
  onCancel,
  actionLoading,
  loading,
  filter,
  onFilterChange,
  filterOptions,
}) {
  const sliderRef = useRef(null);

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateArrowState = () => {
    const slider = sliderRef.current;

    if (!slider) return;

    setCanScrollLeft(slider.scrollLeft > 5);

    setCanScrollRight(
      slider.scrollLeft + slider.clientWidth < slider.scrollWidth - 5,
    );
  };

  useEffect(() => {
    const slider = sliderRef.current;

    if (!slider) return;

    slider.scrollTo({
      left: 0,
      behavior: "auto",
    });

    updateArrowState();

    slider.addEventListener("scroll", updateArrowState);
    window.addEventListener("resize", updateArrowState);

    return () => {
      slider.removeEventListener("scroll", updateArrowState);
      window.removeEventListener("resize", updateArrowState);
    };
  }, [challenges, loading]);

  const scrollCards = (direction) => {
    const slider = sliderRef.current;

    if (!slider) return;

    slider.scrollBy({
      left: direction * slider.clientWidth,
      behavior: "smooth",
    });
  };

  return (
    <section className="challenges-section">
      <div className="section-header-card">
        <div className="section-header-content">
          <div className="section-header-icon">
            <Icon type={icon} />
          </div>

          <div>
            <h2>{title}</h2>

            <p>{description}</p>
          </div>
        </div>
        <div className="challenge-filter-bar">
          <div className="challenge-filter-scroll">
            {filterOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                className={`challenge-filter ${
                  filter === option.value ? "active" : ""
                }`}
                onClick={() => onFilterChange(option.value)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {!loading && challenges.length > 2 && (
          <div className="carousel-controls">
            <button
              type="button"
              className="carousel-arrow"
              onClick={() => scrollCards(-1)}
              disabled={!canScrollLeft}
              aria-label={`Previous ${title}`}
            >
              <Icon type="arrow-left" />
            </button>

            <button
              type="button"
              className="carousel-arrow"
              onClick={() => scrollCards(1)}
              disabled={!canScrollRight}
              aria-label={`Next ${title}`}
            >
              <Icon type="arrow-right" />
            </button>
          </div>
        )}
      </div>

      {loading ? (
        <div className="challenge-slider loading-slider">
          <div className="loading-card" />
          <div className="loading-card" />
        </div>
      ) : challenges.length === 0 ? (
        <div className="empty-card">
          <div className="empty-icon">
            <Icon type="users" />
          </div>

          <h3>
            {type === "my"
              ? "No challenges joined yet"
              : "No available challenges"}
          </h3>

          <p>
            {type === "my"
              ? "Explore the available challenges below and join one to start participating."
              : "There are currently no new challenges available for you to join."}
          </p>
        </div>
      ) : (
        <div className="challenge-slider" ref={sliderRef}>
          {challenges.map((challenge) => (
            <div
              className="challenge-slide"
              key={challenge._id || challenge.id}
            >
              <ChallengeCard
                challenge={challenge}
                type={type}
                onDetails={onDetails}
                onJoin={onJoin}
                onCancel={onCancel}
                actionLoading={actionLoading}
              />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

function CommunityChallenges() {
  const [myChallenges, setMyChallenges] = useState([]);
  const [availableChallenges, setAvailableChallenges] = useState([]);
  const [myChallengeFilter, setMyChallengeFilter] = useState("all");
  const [moreChallengeFilter, setMoreChallengeFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const loadChallenges = async () => {
    try {
      setLoading(true);

      const { data } = await axios.get(`${CHALLENGE_URL}/user`, {
        withCredentials: true,
      });

      if (data.success === true) {
        setMyChallenges(
          Array.isArray(data.userChallengesData) ? data.userChallengesData : [],
        );

        setAvailableChallenges(
          Array.isArray(data.otherChallenges) ? data.otherChallenges : [],
        );

        return;
      }

      toast.error(data.message || "Unable to load challenges.");
    } catch (error) {
      console.error("Get challenges error:", error);

      toast.error(
        error.response?.data?.message ||
          "Unable to load challenges. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadChallenges();
  }, []);

  const handleJoinChallenge = async (challenge) => {
    const challengeId = challenge?._id || challenge?.id;

    if (!challengeId) return;

    try {
      setActionLoading(challengeId);

      const { data } = await axios.patch(
        `${CHALLENGE_URL}/join/${challengeId}`,
        {},
        {
          withCredentials: true,
        },
      );

      if (data.success) {
        toast.success(data.message || "Challenge joined successfully");

        await loadChallenges();
      } else {
        toast.error(data.message || "Challenge could not be joined.");
      }
    } catch (error) {
      console.error("Join challenge error:", error);

      toast.error(
        error.response?.data?.message ||
          "Unable to join challenge. Please try again.",
      );
    } finally {
      setActionLoading(null);
    }
  };

  const handleCancelChallenge = async (challenge) => {
    const challengeId = challenge?._id || challenge?.id;

    if (!challengeId) return;

    const confirmed = window.confirm(
      "Are you sure you want to cancel this challenge?",
    );

    if (!confirmed) return;

    try {
      setActionLoading(challengeId);

      const { data } = await axios.patch(
        `${CHALLENGE_URL}/cancel/${challengeId}`,
        {},
        {
          withCredentials: true,
        },
      );

      if (data.success) {
        toast.success(data.message || "Challenge cancelled successfully");

        await loadChallenges();
      } else {
        toast.error(data.message || "Challenge could not be cancelled.");
      }
    } catch (error) {
      console.error("Cancel challenge error:", error);

      toast.error(
        error.response?.data?.message ||
          "Unable to cancel challenge. Please try again.",
      );
    } finally {
      setActionLoading(null);
    }
  };

  const myChallengeFilters = [
    { value: "all", label: "All" },
    { value: "not started", label: "Not Started" },
    { value: "not have entry", label: "Not Have Entry" },
    { value: "active", label: "Active" },
    { value: "completed", label: "Completed" },
    { value: "failed", label: "Failed" },
    { value: "cancelled", label: "Cancelled" },
  ];

  const moreChallengeFilters = [
    { value: "all", label: "All" },
    { value: "not started", label: "Not Started" },
    { value: "ongoing", label: "Ongoing" },
    { value: "closed", label: "Closed" },
  ];

  const filteredMyChallenges =
    myChallengeFilter === "all"
      ? myChallenges
      : myChallenges.filter(
          (challenge) => challenge.status === myChallengeFilter,
        );

  const filteredAvailableChallenges =
    moreChallengeFilter === "all"
      ? availableChallenges
      : availableChallenges.filter(
          (challenge) => challenge.status === moreChallengeFilter,
        );

  const handleViewDetails = async (challenge) => {
    const challengeId = challenge?._id || challenge?.id;

    if (!challengeId) return;

    setDetailsOpen(true);
    setSelectedChallenge(null);
    setDetailsLoading(true);

    try {
      const { data } = await axios.get(`${CHALLENGE_URL}/${challengeId}`, {
        withCredentials: true,
      });

      if (data.success) {
        setSelectedChallenge(data.challengeData);
      } else {
        toast.error(data.message || "Unable to get challenge details.");

        setDetailsOpen(false);
      }
    } catch (error) {
      console.error("Get challenge details error:", error);

      toast.error(
        error.response?.data?.message || "Unable to get challenge details.",
      );

      setDetailsOpen(false);
    } finally {
      setDetailsLoading(false);
    }
  };

  const closeDetails = () => {
    setDetailsOpen(false);
    setSelectedChallenge(null);
  };

  return (
    <>
      <div className="community-challenges-page">
        <main className="community-challenges-container">
          <header className="challenges-topbar">
            <div className="challenges-heading">
              <span className="challenges-eyebrow">COMMUNITY</span>

              <h1>Community Challenges</h1>

              <p className="challenges-subtitle">
                Take part in sustainability challenges, build better habits, and
                make an environmental impact together.
              </p>
            </div>

            <div className="challenge-hero-visual">
              <div className="hero-visual-placeholder">
                <Icon type="users" />

                <span>Community</span>
                <small>Challenge</small>
              </div>
            </div>
          </header>

          <ChallengeSection
            title="My Challenges"
            description="Challenges you have joined and are participating in."
            icon="users"
            challenges={filteredMyChallenges}
            type="my"
            onDetails={handleViewDetails}
            onJoin={handleJoinChallenge}
            onCancel={handleCancelChallenge}
            actionLoading={actionLoading}
            loading={loading}
            filter={myChallengeFilter}
            onFilterChange={setMyChallengeFilter}
            filterOptions={myChallengeFilters}
          />

          <ChallengeSection
            title="More Challenges"
            description="Discover new challenges and join the ones you want to take part in."
            icon="target"
            challenges={filteredAvailableChallenges}
            type="available"
            onDetails={handleViewDetails}
            onJoin={handleJoinChallenge}
            onCancel={handleCancelChallenge}
            actionLoading={actionLoading}
            loading={loading}
            filter={moreChallengeFilter}
            onFilterChange={setMoreChallengeFilter}
            filterOptions={moreChallengeFilters}
          />
        </main>
      </div>

      {detailsOpen && (
        <div className="challenge-modal-overlay" onClick={closeDetails}>
          <div
            className="challenge-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="modal-close-button"
              onClick={closeDetails}
              aria-label="Close"
            >
              <Icon type="close" />
            </button>

            {detailsLoading ? (
              <div className="modal-loading">
                <div className="modal-loading-circle" />
                <p>Loading challenge details...</p>
              </div>
            ) : selectedChallenge ? (
              <>
                <span className="modal-category">
                  {getCategoryLabel(selectedChallenge.category)}
                </span>

                <h2>{selectedChallenge.title}</h2>

                <p className="modal-challenge-type">
                  {formatLabel(selectedChallenge.challengeType)}
                </p>

                <div className="modal-detail-grid">
                  <div className="modal-detail-item highlight-detail">
                    <span className="modal-detail-label">Target</span>

                    <strong>
                      {selectedChallenge.target ?? "—"}{" "}
                      {selectedChallenge.unit || ""}
                    </strong>
                  </div>

                  <div className="modal-detail-item">
                    <span className="modal-detail-label">Period</span>

                    <strong>{formatLabel(selectedChallenge.period)}</strong>
                  </div>

                  <div className="modal-detail-item">
                    <span className="modal-detail-label">Start Date</span>

                    <strong>{formatDate(selectedChallenge.startDate)}</strong>
                  </div>

                  <div className="modal-detail-item">
                    <span className="modal-detail-label">End Date</span>

                    <strong>{formatDate(selectedChallenge.endDate)}</strong>
                  </div>

                  {selectedChallenge.trackingType && (
                    <div className="modal-detail-item">
                      <span className="modal-detail-label">Tracking Type</span>

                      <strong>
                        {formatLabel(selectedChallenge.trackingType)}
                      </strong>
                    </div>
                  )}

                  {selectedChallenge.direction && (
                    <div className="modal-detail-item">
                      <span className="modal-detail-label">Goal Direction</span>

                      <strong>
                        {formatLabel(selectedChallenge.direction)}
                      </strong>
                    </div>
                  )}
                </div>

                {selectedChallenge.status && (
                  <div className="modal-status-row">
                    <span>Status</span>

                    <span
                      className={`challenge-status ${getStatusClass(
                        selectedChallenge.status,
                      )}`}
                    >
                      {formatLabel(selectedChallenge.status)}
                    </span>
                  </div>
                )}
                {(() => {
                  const description = selectedChallenge.description;
                  if (!description) return null;

                  return (
                    <section className="challenge-description">
                      <h3>Challenge Guide</h3>

                      <div className="description-section">
                        <h4>Objective :</h4>
                        <p>{description.objective}</p>
                      </div>

                      <div className="description-section">
                        <h4>Instructions : </h4>
                        <ul>
                          {description.instructions?.map(
                            (instruction, index) => (
                              <li key={index}>{instruction}</li>
                            ),
                          )}
                        </ul>
                      </div>

                      <div className="description-section">
                        <h4>Completion Criteria :</h4>
                        <p>{description.completionCriteria}</p>
                      </div>
                    </section>
                  );
                })()}
              </>
            ) : null}
          </div>
        </div>
      )}

      <style>{`
        .community-challenges-page {
          min-height: 100vh;
          background: #f8fbf9;
          color: #173f2a;
          padding: 5px;
        }

        .community-challenges-container {
          width: min(1180px, 100%);
          margin: 0 auto;
        }

        .challenges-topbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 40px;
          margin-bottom: 42px;
        }

        .challenges-heading {
          flex: 1;
        }

        .challenges-eyebrow {
          display: inline-block;
          margin-bottom: 9px;
          color: #27834d;
          font-size: 0.76rem;
          font-weight: 800;
          letter-spacing: 0.14em;
        }

        .challenges-topbar h1 {
          margin: 0;
          color: #173f2a;
          font-size: clamp(2rem, 4vw, 2.75rem);
          line-height: 1.08;
          letter-spacing: -0.04em;
        }

        .challenges-subtitle {
          max-width: 650px;
          margin: 13px 0 0;
          color: #7b8780;
          font-size: 0.98rem;
          line-height: 1.65;
        }

        .challenge-hero-visual {
          width: 205px;
          height: 150px;
          flex: 0 0 205px;
          padding: 10px;
          border: 1px solid #dce7df;
          border-radius: 24px;
          background: #edf7f0;
          box-shadow: 0 10px 28px rgba(23, 63, 42, 0.05);
        }

        .hero-visual-placeholder {
          display: flex;
          height: 100%;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          border: 1px dashed #b9d1c0;
          border-radius: 17px;
          color: #27834d;
        }

        .hero-visual-placeholder svg {
          width: 34px;
          height: 34px;
          margin-bottom: 8px;
          fill: none;
          stroke: currentColor;
          stroke-width: 1.5;
          stroke-linecap: round;
          stroke-linejoin: round;
        }

        .hero-visual-placeholder span {
          font-size: 0.78rem;
          font-weight: 800;
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }

        .hero-visual-placeholder small {
          margin-top: 2px;
          color: #7b8780;
          font-size: 0.72rem;
        }

        .challenges-section {
          margin-top: 38px;
        }

        .challenges-section + .challenges-section {
          margin-top: 52px;
        }

        .section-header-card {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          margin-bottom: 18px;
          padding: 15px 17px;
          border: 1px solid #dfeae3;
          border-radius: 16px;
          background: #edf7f0;
        }

        .section-header-content {
          display: flex;
          align-items: center;
          gap: 13px;
          min-width: 0;
        }

        .section-header-icon {
          display: grid;
          place-items: center;
          width: 42px;
          height: 42px;
          flex: 0 0 42px;
          border-radius: 12px;
          background: #ffffff;
          box-shadow: 0 4px 12px rgba(23, 63, 42, 0.05);
        }

        .section-header-icon svg {
          width: 21px;
          height: 21px;
          fill: none;
          stroke: #27834d;
          stroke-width: 1.7;
          stroke-linecap: round;
          stroke-linejoin: round;
        }

        .section-header-card h2 {
          margin: 0;
          color: #173f2a;
          font-size: 1.2rem;
          line-height: 1.2;
          letter-spacing: -0.02em;
        }

        .section-header-card p {
          margin: 4px 0 0;
          color: #7b8780;
          font-size: 0.8rem;
          line-height: 1.45;
        }
        
        .challenge-filter-bar {
          display: flex;
          align-items: center;
          overflow: hidden;
        }

        .challenge-filter-scroll {
          display: flex;
          align-items: center;
          gap: 8px;
          overflow-x: auto;
          scrollbar-width: none;
          padding: 2px;
        }

        .challenge-filter-scroll::-webkit-scrollbar {
          display: none;
        }

        .challenge-filter {
          flex: 0 0 auto;
          min-height: 35px;
          padding: 8px 13px;
          border: 1px solid #d5e3da;
          border-radius: 999px;
          background: #ffffff;
          color: #68776e;
          font-family: inherit;
          font-size: 0.74rem;
          font-weight: 750;
          white-space: nowrap;
          cursor: pointer;
          transition:
            background 0.2s ease,
            border-color 0.2s ease,
            color 0.2s ease,
            transform 0.2s ease,
            box-shadow 0.2s ease;
        }

        .challenge-filter:hover {
          border-color: #b9d1c0;
          background: #f8fbf9;
          color: #27834d;
          transform: translateY(-1px);
        }

        .challenge-filter.active {
          border-color: #27834d;
          background: #27834d;
          color: #ffffff;
          box-shadow: 0 5px 14px rgba(39, 131, 77, 0.16);
        }

        .carousel-controls {
          display: flex;
          align-items: center;
          gap: 8px;
          flex: 0 0 auto;
        }

        .carousel-arrow {
          display: grid;
          place-items: center;
          width: 38px;
          height: 38px;
          border: 1px solid #d5e3da;
          border-radius: 11px;
          background: #ffffff;
          color: #27834d;
          cursor: pointer;
          transition:
            background 0.2s ease,
            border-color 0.2s ease,
            opacity 0.2s ease,
            transform 0.2s ease;
        }

        .carousel-arrow:hover:not(:disabled) {
          border-color: #b9d1c0;
          background: #f8fbf9;
          transform: translateY(-1px);
        }

        .carousel-arrow:disabled {
          cursor: default;
          opacity: 0.35;
        }

        .carousel-arrow svg {
          width: 17px;
          height: 17px;
          fill: none;
          stroke: currentColor;
          stroke-width: 1.8;
          stroke-linecap: round;
          stroke-linejoin: round;
        }

        .challenge-slider {
          display: flex;
          gap: 20px;
          overflow-x: auto;
          scroll-snap-type: x mandatory;
          scrollbar-width: none;
          padding: 2px 2px 8px;
        }

        .challenge-slider::-webkit-scrollbar {
          display: none;
        }

        .challenge-slide {
          flex: 0 0 calc((100% - 20px) / 2);
          scroll-snap-align: start;
          min-width: 0;
        }

        .challenge-card {
          height: 100%;
          min-height: 350px;
          box-sizing: border-box;
          padding: 22px;
          border: 1px solid #e1ebe4;
          border-radius: 18px;
          background: #ffffff;
          box-shadow: 0 8px 25px rgba(23, 63, 42, 0.045);
          animation: challengeFadeUp 0.35s ease both;
          transition:
            transform 0.2s ease,
            box-shadow 0.2s ease,
            border-color 0.2s ease;
        }

        .challenge-card:hover {
          transform: translateY(-2px);
          border-color: #d2e1d7;
          box-shadow: 0 12px 30px rgba(23, 63, 42, 0.075);
        }

        .challenge-card-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 15px;
        }

        .challenge-category {
          color: #27834d;
          font-size: 0.7rem;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .challenge-status {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 25px;
          padding: 4px 10px;
          border-radius: 999px;
          font-size: 0.69rem;
          font-weight: 800;
          white-space: nowrap;
        }

        .status-active {
          background: #e7f6ed;
          color: #197044;
        }

        .status-completed {
          background: #e8f4ed;
          color: #28734a;
        }

        .status-failed {
          background: #fff0ee;
          color: #bd5a52;
        }

        .status-cancelled {
          background: #fff1f1;
          color: #bd5d5d;
        }

        .status-closed {
          background: #f0f2f1;
          color: #68736d;
        }

        .status-not-start {
          background: #edf7f0;
          color: #27834d;
        }

        .status-continue {
          background: #edf4fb;
          color: #55779b;
        }

        .status-default {
          background: #f0f4f1;
          color: #68736d;
        }

        .challenge-card h3 {
          margin: 0;
          color: #173f2a;
          font-size: 1.18rem;
          line-height: 1.3;
        }

        .challenge-type {
          margin: 6px 0 17px;
          color: #87928c;
          font-size: 0.8rem;
        }

        .challenge-highlight {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 15px;
          padding: 13px;
          border: 1px solid #dce9df;
          border-radius: 13px;
          background: #f3f9f5;
        }

        .highlight-icon {
          display: grid;
          place-items: center;
          width: 39px;
          height: 39px;
          flex: 0 0 39px;
          border-radius: 11px;
          background: #ffffff;
        }

        .highlight-icon svg {
          width: 19px;
          height: 19px;
          fill: none;
          stroke: #27834d;
          stroke-width: 1.7;
          stroke-linecap: round;
          stroke-linejoin: round;
        }

        .challenge-highlight span {
          display: block;
          margin-bottom: 3px;
          color: #7b8780;
          font-size: 0.68rem;
        }

        .challenge-highlight strong {
          color: #173f2a;
          font-size: 1rem;
        }

        .challenge-meta-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 10px;
        }

        .challenge-meta-item {
          display: flex;
          align-items: center;
          gap: 9px;
          padding: 10px;
          border-radius: 11px;
          background: #f8fbf9;
        }

        .meta-icon {
          display: grid;
          place-items: center;
          width: 31px;
          height: 31px;
          flex: 0 0 31px;
          border-radius: 9px;
          background: #edf7f0;
        }

        .meta-icon svg {
          width: 15px;
          height: 15px;
          fill: none;
          stroke: #27834d;
          stroke-width: 1.7;
          stroke-linecap: round;
          stroke-linejoin: round;
        }

        .challenge-meta-item span:not(.meta-icon) {
          display: block;
          margin-bottom: 2px;
          color: #87928c;
          font-size: 0.66rem;
        }

        .challenge-meta-item strong {
          color: #37473d;
          font-size: 0.76rem;
        }

        .challenge-end-date {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          margin-top: 12px;
          padding: 10px 2px 0;
          border-top: 1px solid #edf1ee;
        }

        .challenge-end-date span {
          color: #87928c;
          font-size: 0.7rem;
        }

        .challenge-end-date strong {
          color: #37473d;
          font-size: 0.75rem;
        }

        .challenge-card-footer {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
          margin-top: 15px;
        }

        .challenge-description {
          margin-top: 22px;
          padding: 20px;
          border: 1px solid #dce9df;
          border-radius: 14px;
          background: #f8fbf9;
        }

        .challenge-description > h3 {
          margin: 0 0 18px;
          color: #173f2a;
          font-size: 1.05rem;
        }

        .description-section + .description-section {
          margin-top: 17px; 
        }

        .description-section h4 {
          margin: 0 0 7px;
          color: #27834d;
          font-size: 0.86rem;
        }

        .description-section p,
        .description-section li {
          color: #68776e;
          font-size: 0.82rem;
          line-height: 1.65;
        }

        .description-section p {
          margin: 0;
        }

        .description-section ul {
          margin: 0;
          padding-left: 20px;
        }

        .description-section li + li {
          margin-top: 5px;
        }

        .primary-button,
        .secondary-button,
        .cancel-button {
          min-height: 39px;
          padding: 8px 13px;
          border-radius: 10px;
          font-family: inherit;
          font-size: 0.75rem;
          font-weight: 750;
          cursor: pointer;
          transition:
            background 0.2s ease,
            border-color 0.2s ease,
            transform 0.2s ease,
            opacity 0.2s ease;
        }

        .primary-button {
          border: 1px solid #167452;
          background: #167452;
          color: #ffffff;
        }

        .primary-button:hover:not(:disabled) {
          background: #126344;
          transform: translateY(-1px);
        }

        .secondary-button {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          border: 1px solid #dce7df;
          background: #ffffff;
          color: #27834d;
        }

        .secondary-button:hover {
          border-color: #bdd2c4;
          background: #f8fbf9;
        }

        .cancel-button {
          border: 1px solid #eed8d8;
          background: #fff8f8;
          color: #bd5d5d;
        }

        .cancel-button:hover:not(:disabled) {
          border-color: #e5bebe;
          background: #fff2f2;
        }

        .primary-button:disabled,
        .secondary-button:disabled,
        .cancel-button:disabled {
          cursor: not-allowed;
          opacity: 0.6;
        }

        .button-icon {
          display: inline-flex;
        }

        .button-icon svg {
          width: 13px;
          height: 13px;
          fill: none;
          stroke: currentColor;
          stroke-width: 1.8;
          stroke-linecap: round;
          stroke-linejoin: round;
        }

        .empty-card {
          padding: 44px 24px;
          border: 1px dashed #d6e3da;
          border-radius: 18px;
          background: #ffffff;
          text-align: center;
        }

        .empty-icon {
          display: grid;
          place-items: center;
          width: 48px;
          height: 48px;
          margin: 0 auto 14px;
          border-radius: 14px;
          background: #edf7f0;
        }

        .empty-icon svg {
          width: 23px;
          height: 23px;
          fill: none;
          stroke: #27834d;
          stroke-width: 1.7;
          stroke-linecap: round;
          stroke-linejoin: round;
        }

        .empty-card h3 {
          margin: 0;
          color: #173f2a;
          font-size: 1.05rem;
        }

        .empty-card p {
          max-width: 470px;
          margin: 8px auto 0;
          color: #87928c;
          font-size: 0.84rem;
          line-height: 1.6;
        }

        .loading-slider {
          overflow: hidden;
        }

        .loading-card {
          min-height: 350px;
          flex: 0 0 calc((100% - 20px) / 2);
          border: 1px solid #e1ebe4;
          border-radius: 18px;
          background: linear-gradient(
            110deg,
            #f3f7f4 8%,
            #ffffff 18%,
            #f3f7f4 33%
          );
          background-size: 200% 100%;
          animation: loadingShimmer 1.4s linear infinite;
        }

        .challenge-modal-overlay {
          position: fixed;
          inset: 0;
          z-index: 1000;
          display: grid;
          place-items: center;
          padding: 20px;
          background: rgba(23, 63, 42, 0.28);
          backdrop-filter: blur(4px);
        }

        .challenge-modal {
          position: relative;
          width: min(600px, 100%);
          max-height: min(720px, 90vh);
          overflow-y: auto;
          padding: 32px;
          border: 1px solid #e1ebe4;
          border-radius: 20px;
          background: #ffffff;
          box-shadow: 0 25px 70px rgba(23, 63, 42, 0.18);
          animation: modalFadeUp 0.25s ease both;
        }

        .modal-close-button {
          position: absolute;
          top: 18px;
          right: 18px;
          display: grid;
          place-items: center;
          width: 36px;
          height: 36px;
          border: 1px solid #e1ebe4;
          border-radius: 10px;
          background: #f8fbf9;
          color: #68736d;
          cursor: pointer;
        }

        .modal-close-button:hover {
          background: #edf7f0;
          color: #27834d;
        }

        .modal-close-button svg {
          width: 17px;
          height: 17px;
          fill: none;
          stroke: currentColor;
          stroke-width: 1.8;
          stroke-linecap: round;
        }

        .modal-category {
          display: inline-block;
          margin-bottom: 10px;
          color: #27834d;
          font-size: 0.73rem;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .challenge-modal h2 {
          margin: 0;
          padding-right: 38px;
          color: #173f2a;
          font-size: 1.65rem;
          line-height: 1.2;
        }

        .modal-challenge-type {
          margin: 8px 0 25px;
          color: #87928c;
          font-size: 0.86rem;
        }

        .modal-detail-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 12px;
        }

        .modal-detail-item {
          padding: 15px;
          border: 1px solid #e7eee9;
          border-radius: 12px;
          background: #f8fbf9;
        }

        .highlight-detail {
          border-color: #dce9df;
          background: #edf7f0;
        }

        .modal-detail-label {
          display: block;
          margin-bottom: 6px;
          color: #87928c;
          font-size: 0.72rem;
        }

        .modal-detail-item strong {
          color: #173f2a;
          font-size: 0.86rem;
        }

        .modal-status-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 15px;
          margin-top: 18px;
          padding-top: 18px;
          border-top: 1px solid #e7eee9;
          color: #68736d;
          font-size: 0.8rem;
          font-weight: 700;
        }

        .modal-loading {
          display: grid;
          place-items: center;
          min-height: 260px;
          color: #87928c;
        }

        .modal-loading-circle {
          width: 32px;
          height: 32px;
          margin-bottom: 12px;
          border: 3px solid #dce7df;
          border-top-color: #27834d;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        .modal-loading p {
          margin: 0;
          font-size: 0.85rem;
        }

        @keyframes challengeFadeUp {
          from {
            opacity: 0;
            transform: translateY(8px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes modalFadeUp {
          from {
            opacity: 0;
            transform: translateY(12px) scale(0.98);
          }

          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes loadingShimmer {
          0% {
            background-position: 200% 0;
          }

          100% {
            background-position: -200% 0;
          }
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        @media (max-width: 800px) {
          .community-challenges-page {
            padding: 28px 20px 50px;
          }

          .challenges-topbar {
            align-items: flex-start;
          }

          .challenge-hero-visual {
            width: 170px;
            flex-basis: 170px;
          }

          .challenge-slide {
            flex-basis: 100%;
          }

          .loading-card {
            flex-basis: 100%;
          }
        }

        @media (max-width: 560px) {
          .community-challenges-page {
            padding: 24px 15px 45px;
          }

          .challenges-topbar {
            flex-direction: column;
            gap: 22px;
            margin-bottom: 30px;
          }

          .challenge-hero-visual {
            width: 100%;
            height: 125px;
            flex-basis: auto;
          }

          .section-header-card {
            align-items: flex-start;
          }

          .section-header-content {
            align-items: flex-start;
          }

          .section-header-card p {
            max-width: 260px;
          }

          .challenge-card {
            min-height: auto;
            padding: 18px;
          }

          .challenge-meta-grid {
            grid-template-columns: 1fr;
          }

          .challenge-card-footer {
            align-items: stretch;
            flex-direction: column;
          }

          .primary-button,
          .secondary-button,
          .cancel-button {
            width: 100%;
            justify-content: center;
          }

          .carousel-controls {
            align-self: center;
          }

          .challenge-modal {
            padding: 25px 20px;
          }

          .modal-detail-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .challenge-card,
          .challenge-modal,
          .loading-card {
            animation: none;
          }

          .challenge-card,
          .carousel-arrow {
            transition: none;
          }

          .challenge-slider {
            scroll-behavior: auto;
          }
        }
      `}</style>
    </>
  );
}

export default CommunityChallenges;
