import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const Notification_API = import.meta.env.VITE_NOTIFICATION_API;
const CHALLENGE_URL = import.meta.env.VITE_CHALLENGE_API;

function Notifications() {
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([]);
  const [selected, setSelected] = useState("all");
  const [status, setStatus] = useState("all");
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState([]);
  const loadNotifications = async () => {
    try {
      setLoading(true);

      const { data } = await axios.get(
        `${Notification_API}/?selected=${selected}&status=${status}`,
        {
          withCredentials: true,
        },
      );

      if (data.success) {
        setNotifications(data.notificationData || []);
        setSelectedIds([]);
      } else {
        setNotifications([]);
        setSelectedIds([]);
        toast.error(data.message || "Unable to fetch notifications.");
      }
    } catch (error) {
      setNotifications([]);
      setSelectedIds([]);
      console.error("Fetch notifications error:", error);
      toast.error(
        error.response?.data?.message || "Unable to fetch notifications.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, [selected, status]);

  const handleRead = async (notification) => {
    if (notification.isRead) return;

    try {
      const { data } = await axios.patch(
        `${Notification_API}/read/${notification.id}`,
        {},
        {
          withCredentials: true,
        },
      );

      if (data.success) {
        setNotifications((prev) =>
          prev.map((item) =>
            item.id === notification.id
              ? {
                  ...item,
                  isRead: true,
                  readAt: new Date().toISOString(),
                }
              : item,
          ),
        );
      } else {
        toast.error(data.message || "Unable to mark notification as read.");
      }
    } catch (error) {
      console.error("Mark notification read error:", error);
      toast.error(
        error.response?.data?.message || "Unable to mark notification as read.",
      );
    }
  };

  const handleDeleteAll = async () => {
    if (!notifications.length) return;

    try {
      const { data } = await axios.delete(`${Notification_API}/`, {
        withCredentials: true,
      });

      if (data.success) {
        toast.success(
          data.message || "All notifications deleted successfully.",
        );
        setNotifications([]);
        setSelectedIds([]);
      } else {
        toast.error(data.message || "Unable to delete notifications.");
      }
    } catch (error) {
      console.error("Delete all notifications error:", error);
      toast.error(
        error.response?.data?.message || "Unable to delete notifications.",
      );
    }
  };

  const handleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const handleDeleteSelected = async () => {
    if (!selectedIds.length) return;

    try {
      const { data } = await axios.patch(
        `${Notification_API}/delete`,
        {
          notifications: selectedIds,
        },
        {
          withCredentials: true,
        },
      );

      if (data.success) {
        toast.success(data.message || "Notifications deleted successfully.");

        setNotifications((prev) =>
          prev.filter((item) => !selectedIds.includes(item.id)),
        );

        setSelectedIds([]);
      } else {
        toast.error(data.message || "Unable to delete notifications.");
      }
    } catch (error) {
      console.error("Delete selected notifications error:", error);
      toast.error(
        error.response?.data?.message || "Unable to delete notifications.",
      );
    }
  };

  const handleNotificationDoubleClick = (notification) => {
    const { type, action } = notification;

    // Profile Completion
    if (
      (type === "profile completion" || type === "profile complition") &&
      action === "complete profile"
    ) {
      navigate("/profile");
      return;
    }

    // Goal Suggestion
    if (type === "goal suggestion" && action === "create goal") {
      navigate("/sustainability-goals");
      return;
    }

    // Goal Reminder
    if (type === "goal reminder" && action === "entry activity") {
      navigate("/tracking");
      return;
    }

    // Challenge Reminder
    if (type === "challenge reminder" && action === "entry activity") {
      navigate("/tracking");
      return;
    }

    // Challenge Information
    if (
      type === "challenge information" &&
      action === "informational notification"
    ) {
      return;
    }
  };

  const handleJoinChallenge = async (notification) => {
    const challengeId = notification.relatedId;

    if (!challengeId) {
      toast.error("Challenge information is unavailable.");
      return;
    }

    try {
      const { data } = await axios.patch(
        `${CHALLENGE_URL}/join/${challengeId}`,
        {},
        {
          withCredentials: true,
        },
      );

      if (data.success) {
        toast.success(data.message || "Challenge joined successfully");

        navigate("/community-challenges");
      } else {
        toast.error(data.message || "Challenge could not be joined.");
      }
    } catch (error) {
      console.error("Join challenge error:", error);
      toast.error(
        error.response?.data?.message || "Challenge could not be joined.",
      );
    }
  };

  const formatDate = (date) => {
    if (!date) return "";

    return new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getIcon = (type) => {
    switch (type) {
      case "profile completion":
      case "profile complition":
        return "👤";

      case "goal suggestion":
      case "goal reminder":
        return "🎯";

      case "challenge suggestion":
      case "challenge reminder":
      case "challenge information":
        return "🏆";

      default:
        return "🔔";
    }
  };

  return (
    <div className="notifications-page">
      <style>{`
        * {
          box-sizing: border-box;
        }

        .notifications-page {
          min-height: 100vh;
          padding: 40px 7%;
          background:
            radial-gradient(circle at top left, rgba(46, 125, 50, 0.08), transparent 35%),
            linear-gradient(135deg, #f6fff7, #eef8f0);
          color: #183b20;
        }

        .notifications-container {
          max-width: 1100px;
          margin: 0 auto;
        }

        .notifications-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 20px;
          margin-bottom: 28px;
          animation: fadeDown 0.5s ease;
        }

        .notifications-title h1 {
          margin: 0;
          font-size: 34px;
          font-weight: 800;
          color: #1b5e20;
        }

        .notifications-title p {
          margin: 8px 0 0;
          color: #64806a;
          font-size: 15px;
        }

        .delete-all-btn {
          border: none;
          background: #fff;
          color: #c62828;
          border: 1px solid #f1c5c5;
          padding: 11px 17px;
          border-radius: 10px;
          font-weight: 700;
          cursor: pointer;
          transition: 0.25s ease;
        }

        .delete-all-btn:hover {
          background: #fff3f3;
          transform: translateY(-2px);
        }

        .filters-card {
          background: rgba(255, 255, 255, 0.92);
          border: 1px solid #dcefe0;
          border-radius: 16px;
          padding: 18px;
          display: flex;
          align-items: center;
          gap: 18px;
          flex-wrap: wrap;
          margin-bottom: 22px;
          box-shadow: 0 10px 30px rgba(27, 94, 32, 0.07);
          animation: fadeUp 0.55s ease;
        }

        .filter-group {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-right: 100px;
        }

        .filter-group label {
        font-size: 11px;
        font-weight: 800;
        letter-spacing: 0.8px;
        text-transform: uppercase;
        color: #315d38;
        background: #edf7ee;
        border: 1px solid #d5e9d8;
        padding: 6px 9px;
        border-radius: 7px;
        min-width: 52px;
        text-align: center; 
        }

        .filter-pills {
          display: flex;
          gap: 7px;
          flex-wrap: wrap;
        }

        .filter-pill {
          border: 1px solid #cfe4d2;
          background: #f5faf6;
          color: #52705a;
          padding: 8px 14px;
          border-radius: 20px;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          transition: 0.2s ease;
        }

        .filter-pill:hover {
          background: #e9f6eb;
          border-color: #9ac99f;
          transform: translateY(-1px);
        }

        .filter-pill.active {
          background: #2e7d32;
          color: #fff;
          border-color: #2e7d32;
          box-shadow: 0 4px 10px rgba(46, 125, 50, 0.18);
        }

        .selected-actions {
          margin-left: auto;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .selected-count {
          color: #64806a;
          font-size: 13px;
          font-weight: 600;
        }

        .delete-selected-btn {
          border: none;
          background: #fceaea;
          color: #c62828;
          padding: 9px 13px;
          border-radius: 8px;
          font-weight: 700;
          cursor: pointer;
        }

        .delete-selected-btn:disabled {
          opacity: 0.45;
          cursor: not-allowed;
        }

        .notifications-list {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .notification-card {
          background: #fff;
          border: 1px solid #e0eee2;
          border-radius: 16px;
          padding: 18px;
          display: flex;
          align-items: flex-start;
          gap: 15px;
          box-shadow: 0 8px 24px rgba(27, 94, 32, 0.06);
          transition: 0.25s ease;
          animation: fadeUp 0.45s ease;
        }

        .notification-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 30px rgba(27, 94, 32, 0.1);
        }

        .notification-card.unread {
          border-left: 4px solid #43a047;
          background: #fbfffb;
        }

        .notification-card.read {
          opacity: 0.84;
        }

        .notification-check {
          padding-top: 3px;
        }

        .notification-check input {
          width: 17px;
          height: 17px;
          accent-color: #2e7d32;
          cursor: pointer;
        }

        .notification-icon {
          width: 46px;
          height: 46px;
          min-width: 46px;
          border-radius: 13px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #edf8ee;
          font-size: 22px;
        }

        .notification-content {
          flex: 1;
          min-width: 0;
          cursor: pointer;
        }

        .notification-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 15px;
        }

        .notification-title {
          margin: 0;
          color: #214d29;
          font-size: 17px;
          font-weight: 800;
        }

        .notification-date {
          color: #8aa08e;
          font-size: 12px;
          white-space: nowrap;
        }

        .notification-message {
          margin: 8px 0 0;
          color: #5d7161;
          line-height: 1.55;
          font-size: 14px;
        }

        .notification-actions {
          margin-top: 13px;
          display: flex;
          align-items: center;
          gap: 9px;
          flex-wrap: wrap;
        }

        .read-btn {
          border: none;
          background: #2e7d32;
          color: white;
          padding: 8px 14px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          transition: 0.2s ease;
        }

        .read-btn:hover {
          background: #256528;
          transform: translateY(-1px);
        }

        .read-status {
          color: #4d8a54;
          font-size: 12px;
          font-weight: 700;
        }

        .join-btn {
          border: none;
          background: #43a047;
          color: white;
          padding: 9px 16px;
          border-radius: 9px;
          font-size: 13px;
          font-weight: 800;
          cursor: pointer;
          transition: 0.2s ease;
        }

        .join-btn:hover {
          background: #2e7d32;
          transform: translateY(-1px);
        }

        .empty-state {
          background: rgba(255, 255, 255, 0.9);
          border: 1px dashed #c9dfcc;
          border-radius: 18px;
          padding: 65px 20px;
          text-align: center;
          color: #718776;
          animation: fadeUp 0.5s ease;
        }

        .empty-icon {
          font-size: 42px;
          margin-bottom: 10px;
        }

        .empty-state h3 {
          margin: 0 0 7px;
          color: #315d38;
        }

        .empty-state p {
          margin: 0;
          font-size: 14px;
        }

        .loading-state {
          text-align: center;
          padding: 70px 20px;
          color: #628068;
          font-weight: 600;
        }

        @keyframes fadeDown {
          from {
            opacity: 0;
            transform: translateY(-12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeUp {
          from {
            opacity: 0;
            transform: translateY(14px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 700px) {
          .notifications-page {
            padding: 28px 4%;
          }

          .notifications-header {
            flex-direction: column;
          }

          .notifications-title h1 {
            font-size: 28px;
          }

          .delete-all-btn {
            width: 100%;
          }

          .filters-card {
            align-items: flex-start;
            flex-direction: column;
          }

          .filter-group {
            width: 100%;
            align-items: flex-start;
            flex-direction: column;
          }

          .filter-pills {
            width: 100%;
          }

          .selected-actions {
            width: 100%;
            margin-left: 0;
            justify-content: space-between;
          }

          .notification-card {
            padding: 15px;
          }

          .notification-top {
            align-items: flex-start;
            flex-direction: column;
            gap: 4px;
          }

          .notification-date {
            white-space: normal;
          }
        }
      `}</style>

      <div className="notifications-container">
        <div className="notifications-header">
          <div className="notifications-title">
            <h1>Notifications</h1>
            <p>
              Stay updated with your goals, challenges and EcoTrack activities.
            </p>
          </div>

          <button
            className="delete-all-btn"
            onClick={handleDeleteAll}
            disabled={!notifications.length}
          >
            Delete All
          </button>
        </div>

        <div className="filters-card">
          {/* Type Filter */}
          <div className="filter-group">
            <label>Type</label>

            <div className="filter-pills">
              <button
                className={`filter-pill ${selected === "all" ? "active" : ""}`}
                onClick={() => setSelected("all")}
              >
                All
              </button>

              <button
                className={`filter-pill ${selected === "goal" ? "active" : ""}`}
                onClick={() => setSelected("goal")}
              >
                Goals
              </button>

              <button
                className={`filter-pill ${
                  selected === "challenge" ? "active" : ""
                }`}
                onClick={() => setSelected("challenge")}
              >
                Challenges
              </button>
            </div>
          </div>

          {/* Status Filter */}
          <div className="filter-group">
            <label>Status</label>

            <div className="filter-pills">
              <button
                className={`filter-pill ${status === "all" ? "active" : ""}`}
                onClick={() => setStatus("all")}
              >
                All
              </button>

              <button
                className={`filter-pill ${status === "unread" ? "active" : ""}`}
                onClick={() => setStatus("unread")}
              >
                Unread
              </button>

              <button
                className={`filter-pill ${status === "read" ? "active" : ""}`}
                onClick={() => setStatus("read")}
              >
                Read
              </button>
            </div>
          </div>

          <div className="selected-actions">
            <span className="selected-count">
              {selectedIds.length} selected
            </span>

            <button
              className="delete-selected-btn"
              onClick={handleDeleteSelected}
              disabled={!selectedIds.length}
            >
              Delete Selected
            </button>
          </div>
        </div>

        {loading ? (
          <div className="loading-state">Loading notifications...</div>
        ) : notifications.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🔔</div>
            <h3>No notifications</h3>
            <p>You're all caught up. New notifications will appear here.</p>
          </div>
        ) : (
          <div className="notifications-list">
            {notifications.map((notification) => {
              const isChallengeSuggestion =
                notification.type === "challenge suggestion" &&
                notification.action === "join challenge";

              return (
                <div
                  className={`notification-card ${
                    notification.isRead ? "read" : "unread"
                  }`}
                  key={notification.id}
                >
                  <div className="notification-check">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(notification.id)}
                      onChange={() => handleSelect(notification.id)}
                    />
                  </div>

                  <div className="notification-icon">
                    {getIcon(notification.type)}
                  </div>

                  <div
                    className="notification-content"
                    onDoubleClick={() =>
                      handleNotificationDoubleClick(notification)
                    }
                  >
                    <div className="notification-top">
                      <h3 className="notification-title">
                        {notification.title}
                      </h3>

                      <span className="notification-date">
                        {formatDate(notification.createdAt)}
                      </span>
                    </div>

                    {notification.isRead && (
                      <p className="notification-message">
                        {notification.message}
                      </p>
                    )}

                    <div className="notification-actions">
                      {!notification.isRead ? (
                        <button
                          className="read-btn"
                          onClick={() => handleRead(notification)}
                        >
                          Read
                        </button>
                      ) : (
                        <span className="read-status">✓ Read</span>
                      )}

                      {isChallengeSuggestion && (
                        <button
                          className="join-btn"
                          onClick={() => handleJoinChallenge(notification)}
                        >
                          Join Challenge
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default Notifications;
