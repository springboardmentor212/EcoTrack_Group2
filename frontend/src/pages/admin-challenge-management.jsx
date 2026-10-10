import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { generateChallengeDescription } from "../utils/challengeDescription";

const CHALLENGE_URL = import.meta.env.VITE_CHALLENGE_API;

const CATEGORIES = [
  "transportation",
  "electricity",
  "waste management",
  "carbon emission",
  "carbon save",
];

const CHALLENGE_TYPES = {
  transportation: [
    "distance limit challenge",
    "ev travel challenge",
    "cng commute challenge",
  ],
  electricity: ["power saving month"],
  "waste management": [
    "waste reduction week",
    "zero waste day",
    "recycle and save",
  ],
  "carbon emission": ["carbon control challenge"],
  "carbon save": ["carbon saving challenge"],
};

const TRACKING_TYPES = [
  "all",
  "transportation",
  "electricity",
  "waste management",
];

const PERIODS = ["daily", "weekly", "monthly"];

const FIXED_PERIODS = {
  "power saving month": "monthly",
  "waste reduction week": "weekly",
  "zero waste day": "daily",
};

const UNIT_MAP = {
  "distance limit challenge": "km",
  "ev travel challenge": "km",
  "cng commute challenge": "trips",
  "power saving month": "kwh",
  "waste reduction week": "kg",
  "zero waste day": "kg",
  "recycle and save": "kg",
  "carbon control challenge": "kgco2",
  "carbon saving challenge": "kgco2",
};

const STATUS_CLASS = {
  "not start": "status-not-start",
  continue: "status-continue",
  close: "status-close",
  active: "status-active",
  ongoing: "status-ongoing",
  completed: "status-completed",
  failed: "status-failed",
  cancelled: "status-cancelled",
  "not have entry": "status-not-entry",
};

const formatLabel = (value = "") =>
  value
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

const formatDate = (date) => {
  if (!date) return "";

  const d = new Date(date);

  if (Number.isNaN(d.getTime())) return date;

  return d.toLocaleDateString("en-IN", {
    timeZone: "UTC",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const toInputDate = (date) => {
  if (!date) return "";

  const d = new Date(date);

  if (Number.isNaN(d.getTime())) return "";

  const year = d.getUTCFullYear();
  const month = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const parseLocalDate = (value) => {
  if (!value) return null;

  const [year, month, day] = value.split("-").map(Number);

  return new Date(year, month - 1, day);
};

const formatDateForPayload = (value) => {
  if (!value) return "";

  const [year, month, day] = value.split("-").map(Number);

  return new Date(Date.UTC(year, month - 1, day)).toISOString();
};

const startOfToday = () => {
  const today = new Date();

  today.setHours(0, 0, 0, 0);

  return today;
};

const addDays = (date, days) => {
  const result = new Date(date);

  result.setDate(result.getDate() + days);

  return result;
};

const startOfNextWeek = () => {
  const today = startOfToday();
  const day = today.getDay();

  const daysUntilMonday = day === 0 ? 1 : 8 - day;

  return addDays(today, daysUntilMonday);
};

const startOfNextMonth = () => {
  const today = startOfToday();

  return new Date(today.getFullYear(), today.getMonth() + 1, 1);
};

const endOfMonth = (year, month) => new Date(year, month + 1, 0);

const isSameDate = (a, b) =>
  a &&
  b &&
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

const getMonday = (date) => {
  const result = new Date(date);
  const day = result.getDay();

  const diff = day === 0 ? -6 : 1 - day;

  result.setDate(result.getDate() + diff);
  result.setHours(0, 0, 0, 0);

  return result;
};

const getSunday = (date) => {
  const monday = getMonday(date);

  return addDays(monday, 6);
};

const generateTitle = (challengeType, target, period) => {
  switch (challengeType) {
    case "distance limit challenge":
      return `Limit Your Travel Distance to ${target} km${
        period ? ` ${formatLabel(period)}` : ""
      }`;

    case "ev travel challenge":
      return `Travel with EV Vehicle for ${target} km${
        period ? ` ${formatLabel(period)}` : ""
      }`;

    case "cng commute challenge":
      return `Use CNG Vehicle for ${target} Trips${
        period ? ` ${formatLabel(period)}` : ""
      }`;

    case "power saving month":
      return `Save ${target} kWh of Electricity This Month`;

    case "waste reduction week":
      return `Reduce Waste by ${target} kg This Week`;

    case "zero waste day":
      return `Limit Your Daily Waste to ${target} kg`;

    case "recycle and save":
      return `Recycle ${target} kg of Waste${
        period ? ` ${formatLabel(period)}` : ""
      }`;

    case "carbon control challenge":
      return `Keep Your Carbon Emissions Below ${target} kgco2${
        period ? ` ${formatLabel(period)}` : ""
      }`;

    case "carbon saving challenge":
      return `Save ${target} kgco2${period ? ` ${formatLabel(period)}` : ""}`;

    default:
      return "";
  }
};

function CustomSelect({
  value,
  options,
  placeholder,
  disabled = false,
  onChange,
}) {
  const wrapperRef = useRef(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  return (
    <div
      className={`custom-select-wrapper ${disabled ? "select-disabled" : ""}`}
      ref={wrapperRef}
    >
      <button
        type="button"
        className="custom-select-trigger"
        disabled={disabled}
        onClick={() => setOpen((prev) => !prev)}
      >
        <span className={value ? "select-value" : "select-placeholder"}>
          {value ? formatLabel(value) : placeholder}
        </span>

        <span className={`select-chevron ${open ? "chevron-up" : ""}`} />
      </button>

      {open && !disabled && (
        <div className="custom-select-menu">
          {options.map((option) => (
            <button
              type="button"
              key={option}
              className={`custom-select-option ${
                option === value ? "selected-option" : ""
              }`}
              onClick={() => {
                onChange(option);
                setOpen(false);
              }}
            >
              {option === "all"
                ? "All Challenges"
                : option === "not start"
                  ? "Not Started"
                  : option === "ongoing"
                    ? "Ongoing"
                    : option === "close"
                      ? "Closed"
                      : formatLabel(option)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function DatePicker({ value, onChange, period, startDate, isStart }) {
  const wrapperRef = useRef(null);
  const inputRef = useRef(null);

  const [open, setOpen] = useState(false);

  const [calendarMonth, setCalendarMonth] = useState(() => {
    const initial = value
      ? parseLocalDate(value)
      : startDate
        ? parseLocalDate(startDate)
        : new Date();

    return new Date(initial.getFullYear(), initial.getMonth(), 1);
  });

  const [popupStyle, setPopupStyle] = useState({});

  useEffect(() => {
    if (!open || !inputRef.current) return;

    const updatePosition = () => {
      const rect = inputRef.current.getBoundingClientRect();

      const popupWidth = 310;
      const popupHeight = 360;
      const gap = 8;

      let left = rect.left;

      if (left + popupWidth > window.innerWidth - 12) {
        left = window.innerWidth - popupWidth - 12;
      }

      let top = rect.bottom + gap;

      if (top + popupHeight > window.innerHeight - 12) {
        top = rect.top - popupHeight - gap;
      }

      if (top < 12) {
        top = 12;
      }

      setPopupStyle({
        top,
        left,
      });
    };

    updatePosition();

    window.addEventListener("resize", updatePosition);

    window.addEventListener("scroll", updatePosition, true);

    return () => {
      window.removeEventListener("resize", updatePosition);

      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [open]);

  useEffect(() => {
    const handleOutside = (event) => {
      const clickedInsideInput = wrapperRef.current?.contains(event.target);

      const clickedInsideCalendar =
        event.target instanceof Element &&
        event.target.closest(".date-picker-popup");

      if (!clickedInsideInput && !clickedInsideCalendar) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutside);

    return () => {
      document.removeEventListener("mousedown", handleOutside);
    };
  }, []);

  const monthName = calendarMonth.toLocaleDateString("en-IN", {
    month: "long",
    year: "numeric",
  });

  const firstDay = new Date(
    calendarMonth.getFullYear(),
    calendarMonth.getMonth(),
    1,
  );

  const firstWeekday = firstDay.getDay();

  const daysInMonth = new Date(
    calendarMonth.getFullYear(),
    calendarMonth.getMonth() + 1,
    0,
  ).getDate();

  const days = [];

  for (let i = 0; i < firstWeekday; i++) {
    days.push(null);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    days.push(
      new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), day),
    );
  }

  const isDisabledDate = (date) => {
    if (!date) return true;

    const currentDate = new Date(date);
    currentDate.setHours(0, 0, 0, 0);

    if (period === "daily") {
      if (isStart) {
        return currentDate < addDays(startOfToday(), 1);
      }

      if (startDate) {
        const selectedStart = parseLocalDate(startDate);

        selectedStart.setHours(0, 0, 0, 0);

        return currentDate <= selectedStart;
      }

      return currentDate < addDays(startOfToday(), 1);
    }

    if (period === "weekly") {
      if (isStart) {
        const nextWeek = startOfNextWeek();

        return currentDate < nextWeek || currentDate.getDay() !== 1;
      }

      if (startDate) {
        const selectedStart = parseLocalDate(startDate);

        const requiredSunday = addDays(selectedStart, 6);

        return !isSameDate(currentDate, requiredSunday);
      }

      return currentDate.getDay() !== 0;
    }

    if (period === "monthly") {
      if (isStart) {
        const nextMonth = startOfNextMonth();

        return currentDate < nextMonth || currentDate.getDate() !== 1;
      }

      if (startDate) {
        const selectedStart = parseLocalDate(startDate);

        const lastDay = endOfMonth(
          selectedStart.getFullYear(),
          selectedStart.getMonth(),
        );

        return !isSameDate(currentDate, lastDay);
      }

      return true;
    }
    return false;
  };

  const handleDateSelect = (date) => {
    if (isDisabledDate(date)) return;

    const year = date.getFullYear();

    const month = String(date.getMonth() + 1).padStart(2, "0");

    const day = String(date.getDate()).padStart(2, "0");

    onChange(`${year}-${month}-${day}`);

    setOpen(false);
  };

  const moveMonth = (amount) => {
    setCalendarMonth(
      (previous) =>
        new Date(previous.getFullYear(), previous.getMonth() + amount, 1),
    );
  };

  return (
    <div className="date-picker-wrapper" ref={wrapperRef}>
      <button
        type="button"
        ref={inputRef}
        className="date-input"
        onClick={() => setOpen((prev) => !prev)}
      >
        <span className={value ? "date-value" : "date-placeholder"}>
          {value ? formatDate(value) : "Select date"}
        </span>

        <span className="calendar-icon">▣</span>
      </button>

      {open &&
        createPortal(
          <div className="date-picker-popup" style={popupStyle}>
            <div className="calendar-header">
              <button type="button" onClick={() => moveMonth(-1)}>
                ‹
              </button>

              <strong>{monthName}</strong>

              <button type="button" onClick={() => moveMonth(1)}>
                ›
              </button>
            </div>

            <div className="calendar-weekdays">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <span key={day}>{day}</span>
              ))}
            </div>

            <div className="calendar-grid">
              {days.map((date, index) => {
                const disabled = date ? isDisabledDate(date) : true;

                const selected =
                  date && value && isSameDate(date, parseLocalDate(value));

                return (
                  <button
                    type="button"
                    key={index}
                    disabled={disabled}
                    className={`calendar-day ${
                      disabled ? "calendar-disabled" : ""
                    } ${selected ? "calendar-selected" : ""}`}
                    onClick={() => date && handleDateSelect(date)}
                  >
                    {date ? date.getDate() : ""}
                  </button>
                );
              })}
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}

function ChallengeCard({ challenge, onView, onEdit, onDelete }) {
  const statusClass = STATUS_CLASS[challenge.status] || "status-not-start";
  const canEdit =
    challenge.status === "not started" &&
    new Date(challenge.startDate) > new Date();

  const canDelete =
    challenge.status !== "close" && new Date(challenge.endDate) >= new Date();

  return (
    <div className="challenge-card">
      <div className="challenge-card-top">
        <span className="challenge-category">
          {formatLabel(challenge.category)}
        </span>

        <span className={`challenge-status ${statusClass}`}>
          {formatLabel(challenge.status)}
        </span>
      </div>

      <h3>{challenge.title}</h3>

      <div className="challenge-type">
        {formatLabel(challenge.challengeType)}
      </div>

      <div className="challenge-info-grid">
        <div>
          <span>Target</span>
          <strong>
            {challenge.target} {challenge.unit}
          </strong>
        </div>

        <div>
          <span>Period</span>
          <strong>{formatLabel(challenge.period)}</strong>
        </div>

        <div>
          <span>Start</span>
          <strong>{formatDate(challenge.startDate)}</strong>
        </div>

        <div>
          <span>End</span>
          <strong>{formatDate(challenge.endDate)}</strong>
        </div>
      </div>

      {challenge.trackingType && (
        <div className="tracking-badge">
          Tracking: {formatLabel(challenge.trackingType)}
        </div>
      )}

      <div className="card-actions">
        <button
          type="button"
          className="secondary-action"
          onClick={() => onView(challenge)}
        >
          View
        </button>

        <button
          type="button"
          className="edit-action"
          disabled={!canEdit}
          onClick={() => onEdit(challenge)}
        >
          Edit
        </button>

        <button
          type="button"
          className="delete-action"
          disabled={!canDelete}
          onClick={() => onDelete(challenge)}
        >
          Delete
        </button>
      </div>
    </div>
  );
}

function ChallengeViewModal({ challenge, onClose }) {
  if (!challenge) return null;

  return createPortal(
    <div className="modal-overlay">
      <div className="view-modal">
        <div className="modal-header">
          <div>
            <span className="modal-eyebrow">Challenge Details</span>

            <h2>{challenge.title}</h2>
          </div>

          <button type="button" className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="view-grid">
          <div className="view-item">
            <span>Category</span>
            <strong>{formatLabel(challenge.category)}</strong>
          </div>

          <div className="view-item">
            <span>Challenge Type</span>
            <strong>{formatLabel(challenge.challengeType)}</strong>
          </div>

          {challenge.trackingType && (
            <div className="view-item">
              <span>Tracking Type</span>

              <strong>{formatLabel(challenge.trackingType)}</strong>
            </div>
          )}

          <div className="view-item">
            <span>Target</span>
            <strong>
              {challenge.target} {challenge.unit}
            </strong>
          </div>

          <div className="view-item">
            <span>Period</span>
            <strong>{formatLabel(challenge.period)}</strong>
          </div>

          <div className="view-item">
            <span>Direction</span>
            <strong>{formatLabel(challenge.direction)}</strong>
          </div>

          <div className="view-item">
            <span>Status</span>
            <strong>{formatLabel(challenge.status)}</strong>
          </div>

          <div className="view-item">
            <span>Start Date</span>
            <strong>{formatDate(challenge.startDate)}</strong>
          </div>

          <div className="view-item">
            <span>End Date</span>
            <strong>{formatDate(challenge.endDate)}</strong>
          </div>
        </div>

        {(() => {
          const description = challenge.description;
          if (!description) return null;

          return (
            <section className="challenge-description">
              <h3>Challenge Guide </h3>

              <div className="description-section">
                <h4>Objective :</h4>
                <p>{description.objective}</p>
              </div>

              <div className="description-section">
                <h4>Instructions : </h4>
                <ul>
                  {description.instructions?.map((instruction, index) => (
                    <li key={index}>{instruction}</li>
                  ))}
                </ul>
              </div>

              <div className="description-section">
                <h4>Completion Criteria :</h4>
                <p>{description.completionCriteria}</p>
              </div>
            </section>
          );
        })()}

        <button
          type="button"
          className="modal-primary-button"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>,
    document.body,
  );
}

function ChallengeFormModal({ mode, initialChallenge, onClose, onSuccess }) {
  const isEdit = mode === "edit";

  const emptyForm = {
    title: "",
    category: "",
    challengeType: "",
    trackingType: "",
    target: "",
    period: "",
    startDate: "",
    endDate: "",
  };

  const [form, setForm] = useState(emptyForm);

  const [submitting, setSubmitting] = useState(false);

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isEdit && initialChallenge) {
      setForm({
        title: initialChallenge.title || "",

        category: initialChallenge.category || "",

        challengeType: initialChallenge.challengeType || "",

        trackingType: initialChallenge.trackingType || "",

        target:
          initialChallenge.target !== undefined
            ? String(initialChallenge.target)
            : "",

        period: initialChallenge.period || "",

        startDate: toInputDate(initialChallenge.startDate),

        endDate: toInputDate(initialChallenge.endDate),
      });

      setErrors({});

      return;
    }

    setForm(emptyForm);
    setErrors({});
  }, [isEdit, initialChallenge]);

  const availableChallengeTypes = useMemo(() => {
    if (!form.category) return [];

    return CHALLENGE_TYPES[form.category] || [];
  }, [form.category]);

  const availablePeriods = useMemo(() => {
    if (!form.challengeType) {
      return [];
    }

    if (
      form.category === "carbon emission" &&
      form.trackingType === "electricity"
    ) {
      return ["monthly"];
    }

    if (FIXED_PERIODS[form.challengeType]) {
      return [FIXED_PERIODS[form.challengeType]];
    }

    return PERIODS;
  }, [form.category, form.challengeType, form.trackingType]);

  const generatedTitle = useMemo(
    () => generateTitle(form.challengeType, form.target, form.period),
    [form.challengeType, form.target, form.period],
  );

  const unit = form.challengeType ? UNIT_MAP[form.challengeType] || "" : "";

  const handleCategoryChange = (category) => {
    setForm({
      ...emptyForm,
      category,
    });

    setErrors({});
  };

  const handleChallengeTypeChange = (challengeType) => {
    setForm((previous) => ({
      ...emptyForm,
      category: previous.category,
      challengeType,
      trackingType: previous.category === "carbon emission" ? "" : "",
      period: FIXED_PERIODS[challengeType] || "",
    }));

    setErrors({});
  };

  const handleTrackingTypeChange = (trackingType) => {
    setForm((previous) => ({
      ...previous,
      trackingType,

      period:
        trackingType === "electricity" &&
        previous.category === "carbon emission"
          ? "monthly"
          : FIXED_PERIODS[previous.challengeType] || "",

      startDate: "",
      endDate: "",
      target: "",
      title: "",
    }));

    setErrors((previous) => ({
      ...previous,
      trackingType: "",
      period: "",
      startDate: "",
      endDate: "",
      target: "",
      title: "",
      unit: "",
    }));
  };

  const handlePeriodChange = (period) => {
    setForm((previous) => ({
      ...previous,
      period,
      startDate: "",
      endDate: "",
    }));

    setErrors((previous) => ({
      ...previous,
      period: "",
      startDate: "",
      endDate: "",
      title: "",
    }));
  };

  const handleTargetChange = (event) => {
    const value = event.target.value;

    if (!/^\d*$/.test(value)) return;

    setForm((previous) => ({
      ...previous,
      target: value,
    }));

    setErrors((previous) => ({
      ...previous,
      target: "",
      title: "",
    }));
  };

  const handleStartDateChange = (value) => {
    setForm((previous) => ({
      ...previous,
      startDate: value,
      endDate: "",
    }));

    setErrors((previous) => ({
      ...previous,
      startDate: "",
      endDate: "",
    }));
  };

  const handleEndDateChange = (value) => {
    setForm((previous) => ({
      ...previous,
      endDate: value,
    }));

    setErrors((previous) => ({
      ...previous,
      endDate: "",
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const newErrors = {};

    if (!form.category) {
      newErrors.category = "This field is required";
    }

    if (!form.challengeType) {
      newErrors.challengeType = "This field is required";
    }

    if (form.category === "carbon emission" && !form.trackingType) {
      newErrors.trackingType = "This field is required";
    }

    if (!form.target) {
      newErrors.target = "This field is required";
    }

    if (!unit) {
      newErrors.unit = "This field is required";
    }

    if (!form.period) {
      newErrors.period = "This field is required";
    }

    if (!form.startDate) {
      newErrors.startDate = "This field is required";
    }

    if (!form.endDate) {
      newErrors.endDate = "This field is required";
    }

    if (!generatedTitle) {
      newErrors.title = "This field is required";
    }

    if (Number(form.target) < 0) {
      newErrors.target = "Target must be greater than or equal to 0";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

    const generated = generateTitle(
      form.challengeType,
      form.target,
      form.period,
    );

    const description = generateChallengeDescription({
      challengeType: form.challengeType,
      target: Number(form.target),
      unit: unit,
      period: form.period,
    });

    const payload = {
      ...(isEdit && {
        id: initialChallenge.id || initialChallenge._id,
      }),

      title: generated,

      category: form.category,

      challengeType: form.challengeType,

      target: Number(form.target),
      unit: unit,
      period: form.period,

      startDate: formatDateForPayload(form.startDate),

      endDate: formatDateForPayload(form.endDate),

      ...(description && { description }),
    };

    if (form.category === "carbon emission") {
      payload.trackingType = form.trackingType;
    }

    try {
      setSubmitting(true);
      console.log("data  : ", payload);
      const response = isEdit
        ? await axios.patch(`${CHALLENGE_URL}/`, payload, {
            withCredentials: true,
          })
        : await axios.post(`${CHALLENGE_URL}/`, payload, {
            withCredentials: true,
          });

      const data = response.data;
      if (data?.success) {
        toast.success(data.message);

        onSuccess();
      } else {
        toast.error(data?.message || "Something went wrong");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Internal server error");
    } finally {
      setSubmitting(false);
    }
  };

  return createPortal(
    <div className="modal-overlay">
      <div className="form-modal">
        <div className="modal-header">
          <div>
            <span className="modal-eyebrow">
              {isEdit ? "Update Challenge" : "Create Challenge"}
            </span>

            <h2>{isEdit ? "Edit Challenge" : "Create New Challenge"}</h2>
          </div>

          <button type="button" className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        <form className="challenge-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-field">
              <label>Category</label>

              <CustomSelect
                value={form.category}
                options={CATEGORIES}
                placeholder="Select category"
                onChange={handleCategoryChange}
              />

              {errors.category && (
                <span className="field-error">{errors.category}</span>
              )}
            </div>

            <div className="form-field">
              <label>Challenge Type</label>

              <CustomSelect
                value={form.challengeType}
                options={availableChallengeTypes}
                placeholder={
                  form.category
                    ? "Select challenge type"
                    : "Select category first"
                }
                disabled={!form.category}
                onChange={handleChallengeTypeChange}
              />

              {errors.challengeType && (
                <span className="field-error">{errors.challengeType}</span>
              )}
            </div>
          </div>

          {form.category === "carbon emission" && (
            <div className="form-field">
              <label>Tracking Type</label>

              <CustomSelect
                value={form.trackingType}
                options={TRACKING_TYPES}
                placeholder="Select tracking type"
                onChange={handleTrackingTypeChange}
              />

              {errors.trackingType && (
                <span className="field-error">{errors.trackingType}</span>
              )}
            </div>
          )}

          <div className="form-row">
            <div className="form-field">
              <label>Target</label>

              <input
                type="text"
                inputMode="numeric"
                value={form.target}
                onChange={handleTargetChange}
                placeholder="Enter target"
              />

              {errors.target && (
                <span className="field-error">{errors.target}</span>
              )}
            </div>

            <div className="form-field">
              <label>Unit</label>

              <input
                type="text"
                value={unit}
                placeholder="Auto calculated"
                readOnly
              />

              {errors.unit && (
                <span className="field-error">{errors.unit}</span>
              )}
            </div>
          </div>

          <div className="form-field">
            <label>Challenge Title</label>

            <input
              type="text"
              value={generatedTitle}
              placeholder="Title will be generated automatically"
              readOnly
            />

            {errors.title && (
              <span className="field-error">{errors.title}</span>
            )}
          </div>

          <div className="form-field">
            <label>Period</label>

            <CustomSelect
              value={form.period}
              options={availablePeriods}
              placeholder={
                form.challengeType
                  ? "Select period"
                  : "Select challenge type first"
              }
              disabled={!form.challengeType}
              onChange={handlePeriodChange}
            />

            {errors.period && (
              <span className="field-error">{errors.period}</span>
            )}
          </div>

          <div className="form-row">
            <div className="form-field">
              <label>Start Date</label>

              <DatePicker
                value={form.startDate}
                onChange={handleStartDateChange}
                period={form.period}
                startDate={form.startDate}
                isStart
              />

              {errors.startDate && (
                <span className="field-error">{errors.startDate}</span>
              )}
            </div>

            <div className="form-field">
              <label>End Date</label>

              <DatePicker
                value={form.endDate}
                onChange={handleEndDateChange}
                period={form.period}
                startDate={form.startDate}
                isStart={false}
              />

              {errors.endDate && (
                <span className="field-error">{errors.endDate}</span>
              )}
            </div>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="cancel-button"
              onClick={onClose}
              disabled={submitting}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="submit-button"
              disabled={submitting}
            >
              {submitting
                ? isEdit
                  ? "Updating..."
                  : "Creating..."
                : isEdit
                  ? "Update Challenge"
                  : "Create Challenge"}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body,
  );
}

function DeleteConfirmModal({ challenge, onClose, onConfirm, deleting }) {
  if (!challenge) return null;

  return createPortal(
    <div className="modal-overlay">
      <div className="delete-modal">
        <div className="delete-icon">!</div>

        <h2>Delete Challenge?</h2>

        <p>
          Are you sure you want to delete
          <strong> {challenge.title}</strong>?
        </p>

        <div className="delete-actions">
          <button
            type="button"
            className="cancel-button"
            onClick={onClose}
            disabled={deleting}
          >
            Cancel
          </button>

          <button
            type="button"
            className="confirm-delete-button"
            onClick={onConfirm}
            disabled={deleting}
          >
            {deleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}

function AdminChallengeManagement() {
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState("all");
  const [formModal, setFormModal] = useState(null);
  const [viewChallenge, setViewChallenge] = useState(null);
  const [deleteChallenge, setDeleteChallenge] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const ITEMS_PER_PAGE = 6;

  const filteredChallenges = useMemo(() => {
    if (filter === "all") {
      return challenges;
    }

    return challenges.filter((challenge) => challenge.status === filter);
  }, [challenges, filter]);

  const totalPages = Math.ceil(filteredChallenges.length / ITEMS_PER_PAGE);

  const currentChallenges = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;

    return filteredChallenges.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredChallenges, page]);

  const fetchChallenges = async () => {
    try {
      setLoading(true);

      const response = await axios.get(`${CHALLENGE_URL}/admin`, {
        withCredentials: true,
      });

      const data = response.data;

      if (data?.success === true) {
        setChallenges(data.challenges || []);

        return;
      }

      toast.error(data?.message || "not have any challenges to show");

      setChallenges([]);
    } catch (error) {
      toast.error(error.response?.data?.message || "internal server error");

      setChallenges([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChallenges();
  }, []);

  useEffect(() => {
    if (page > 1 && page > totalPages) {
      setPage(totalPages || 1);
    }
  }, [page, totalPages]);

  const handleCreateSuccess = async () => {
    setFormModal(null);
    setPage(1);

    await fetchChallenges();
  };

  const handleUpdateSuccess = async () => {
    setFormModal(null);
    setPage(1);

    await fetchChallenges();
  };

  const handleView = async (challenge) => {
    try {
      const id = challenge._id || challenge.id;

      const response = await axios.get(`${CHALLENGE_URL}/${id}`, {
        withCredentials: true,
      });

      const data = response.data;

      if (data?.success) {
        setViewChallenge(data.challengeData);
      } else {
        toast.error(data?.message || "Challenge doesn't exist");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Internal server error");
    }
  };

  const handleDelete = async () => {
    if (!deleteChallenge) {
      return;
    }

    try {
      setDeleting(true);

      const id = deleteChallenge._id || deleteChallenge.id;

      const response = await axios.delete(`${CHALLENGE_URL}/${id}`, {
        withCredentials: true,
      });

      const data = response.data;

      if (data?.success) {
        toast.success(data.message);

        setDeleteChallenge(null);

        setPage(1);

        await fetchChallenges();
      } else {
        toast.error(data?.message || "Internal server error");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Internal server error");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <style>{`
        * {
          box-sizing: border-box;
        }

        .admin-challenge-page {
          min-height: 100vh;
          background: #f8fbf9;
          padding: 38px 48px 55px;
          color: #173f2a;
          animation: pageFadeUp 0.55s ease;
        }

        .admin-page-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          gap: 24px;
          margin-bottom: 30px;
        }

        .admin-page-header h1 {
          margin: 0 0 8px;
          font-size: 32px;
          font-weight: 750;
          letter-spacing: -0.7px;
        }

        .admin-page-header p {
          margin: 0;
          color: #7b8780;
          font-size: 14px;
        }

        .create-challenge-button {
          border: none;
          background: #167452;
          color: white;
          padding: 12px 20px;
          border-radius: 10px;
          font-weight: 650;
          cursor: pointer;
          transition:
            transform 0.2s ease,
            box-shadow 0.2s ease,
            background 0.2s ease;
        }

        .create-challenge-button:hover {
          transform: translateY(-2px);
          background: #126343;
          box-shadow: 0 8px 20px rgba(22, 116, 82, 0.18);
        }

        .challenge-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 20px;
        }

        .challenge-card {
          background: white;
          border: 1px solid #e1ebe4;
          border-radius: 18px;
          padding: 22px;
          box-shadow: 0 8px 28px rgba(25, 63, 42, 0.055);
          animation: cardStagger 0.45s ease both;
          transition:
            transform 0.25s ease,
            box-shadow 0.25s ease;
        }

        .challenge-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 14px 34px rgba(25, 63, 42, 0.09);
        }

        .challenge-card-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          margin-bottom: 16px;
        }

        .challenge-category {
          color: #27834d;
          background: #edf7f0;
          border-radius: 999px;
          padding: 6px 10px;
          font-size: 11px;
          font-weight: 700;
        }

        .challenge-status {
          border-radius: 999px;
          padding: 6px 10px;
          font-size: 11px;
          font-weight: 700;
        }

        .status-not-start {
          background: #edf7f0;
          color: #27834d;
        }

        .status-ongoing {
          background: #eef6ff;
          color: #3573a8;
        }

        .status-continue,
        .status-active {
          background: #eef6ff;
          color: #3573a8;
        }

        .status-close,
        .status-failed,
        .status-cancelled {
          background: #fff0f0;
          color: #c35656;
        }

        .status-completed {
          background: #edf7f0;
          color: #167452;
        }

        .status-not-entry {
          background: #f2f4f3;
          color: #7b8780;
        }

        .challenge-card h3 {
          margin: 0 0 7px;
          font-size: 19px;
          line-height: 1.35;
          color: #173f2a;
        }

        .challenge-type {
          color: #87928c;
          font-size: 12px;
          margin-bottom: 19px;
        }

        .challenge-info-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
          margin-bottom: 16px;
        }

        .challenge-info-grid div {
          background: #f8fbf9;
          border: 1px solid #e8efea;
          border-radius: 10px;
          padding: 11px;
        }

        .challenge-info-grid span,
        .view-item span {
          display: block;
          color: #87928c;
          font-size: 11px;
          margin-bottom: 4px;
        }

        .challenge-info-grid strong,
        .view-item strong {
          display: block;
          color: #173f2a;
          font-size: 13px;
        }

        .tracking-badge {
          display: inline-block;
          margin-bottom: 17px;
          padding: 6px 9px;
          border-radius: 8px;
          background: #edf7f0;
          color: #27834d;
          font-size: 11px;
          font-weight: 650;
        }

        .card-actions {
          display: flex;
          gap: 8px;
        }

        .card-actions button {
          flex: 1;
          border: none;
          border-radius: 9px;
          padding: 9px 10px;
          font-size: 12px;
          font-weight: 650;
          cursor: pointer;
          transition: 0.2s ease;
        }

        .secondary-action {
          background: #f1f5f2;
          color: #173f2a;
        }

        .secondary-action:hover {
          background: #e5eee8;
        }

        .edit-action {
          background: #edf7f0;
          color: #167452;
        }

        .edit-action:hover:not(:disabled) {
          background: #dff0e5;
        }

        .delete-action {
          background: #fff0f0;
          color: #c35656;
        }

        .delete-action:hover:not(:disabled) {
          background: #ffe2e2;
        }

        .card-actions button:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        .pagination {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 7px;
          margin-top: 30px;
        }

        .pagination button {
          min-width: 34px;
          height: 34px;
          border: 1px solid #dce7df;
          background: white;
          color: #4f6258;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 650;
        }

        .pagination button:hover:not(:disabled) {
          border-color: #27834d;
          color: #27834d;
        }

        .pagination .active-page {
          background: #167452;
          border-color: #167452;
          color: white;
        }

        .pagination button:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        .pagination-arrow {
          font-size: 20px;
          line-height: 1;
        }

        .empty-state {
          background: white;
          border: 1px dashed #d7e4db;
          border-radius: 18px;
          padding: 65px 20px;
          text-align: center;
          color: #87928c;
        }

        .empty-state h3 {
          color: #173f2a;
          margin: 0 0 7px;
        }

        .loading-state {
          min-height: 300px;
          display: flex;
          justify-content: center;
          align-items: center;
          color: #27834d;
          font-weight: 650;
        }

        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(13, 38, 25, 0.46);
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 20px;
          z-index: 9999;
          animation: overlayFade 0.2s ease;
        }

        .form-modal,
        .view-modal,
        .delete-modal {
          background: white;
          border-radius: 20px;
          box-shadow: 0 25px 70px rgba(15, 42, 27, 0.22);
          animation: modalPop 0.28s ease;
        }

        .form-modal {
          width: min(720px, 100%);
          max-height: 91vh;
          overflow-y: auto;
          padding: 27px;
        }

        .view-modal {
          width: min(680px, 100%);
          max-height: 90vh;
          overflow-y: auto;
          padding: 27px;
          box-sizing: border-box;
        }
        
        
.challenge-description {
  margin-top: 25px;
  margin-bottom: 24px;
  padding: 20px;
  border: 2px solid #dce9df;
  border-radius: 20px;
  background: #f8fbf9;
  box-sizing: border-box;
  overflow-wrap: anywhere;
}

.challenge-description > h3 {
  margin: 0 0 18px;
  color: #173f2a;
  font-size: 17px;
  line-height: 1.4;
}

.challenge-description .description-section {
  margin-top: 17px;
}

.challenge-description .description-section:first-of-type {
  margin-top: 0;
}

.challenge-description .description-section h4 {
  margin: 0 0 7px;
  color: #27834d;
  font-size: 13px;
  line-height: 1.4;
}

.challenge-description .description-section p,
.challenge-description .description-section li {
  color: #68776e;
  font-size: 13px;
  line-height: 1.65;
  overflow-wrap: anywhere;
}

.challenge-description .description-section p {
  margin: 0;
}

.challenge-description .description-section ul {
  margin: 0;
  padding-left: 20px;
}

.challenge-description .description-section li + li {
  margin-top: 8px;
}

@media (max-width: 600px) {
  .view-modal {
    width: 100%;
    max-height: 88vh;
    padding: 20px;
  }

  .challenge-description {
    padding: 16px;
  }
}

        .delete-modal {
          width: min(430px, 100%);
          padding: 30px;
          text-align: center;
        }

        .modal-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 20px;
          margin-bottom: 25px;
        }

        .modal-eyebrow {
          display: block;
          color: #27834d;
          text-transform: uppercase;
          font-size: 10px;
          letter-spacing: 1px;
          font-weight: 750;
          margin-bottom: 5px;
        }

        .modal-header h2 {
          margin: 0;
          color: #173f2a;
          font-size: 23px;
        }

        .modal-close {
          width: 34px;
          height: 34px;
          border: none;
          border-radius: 9px;
          background: #f1f5f2;
          color: #526158;
          font-size: 22px;
          cursor: pointer;
        }

        .modal-close:hover {
          background: #e5eee8;
        }

        .challenge-form {
          display: flex;
          flex-direction: column;
          gap: 17px;
        }

        .form-row {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 15px;
        }

        .form-field {
          position: relative;
        }

        .form-field label {
          display: block;
          color: #30463a;
          font-size: 12px;
          font-weight: 700;
          margin-bottom: 7px;
        }

        .form-field input {
          width: 100%;
          height: 44px;
          border: 1px solid #dce7df;
          background: #fbfdfc;
          border-radius: 10px;
          padding: 0 13px;
          color: #173f2a;
          outline: none;
          font-size: 13px;
          transition:
            border 0.2s ease,
            box-shadow 0.2s ease;
        }

        .form-field input:focus {
          border-color: #27834d;
          box-shadow: 0 0 0 3px rgba(39, 131, 77, 0.09);
        }

        .form-field input[readonly] {
          color: #66756d;
          background: #f3f7f4;
        }

        .field-error {
          display: block;
          margin-top: 5px;
          color: #c35656;
          font-size: 11px;
          font-weight: 600;
          animation: errorFade 0.18s ease;
        }

        .custom-select-wrapper {
          position: relative;
        }

        .custom-select-trigger {
          width: 100%;
          height: 44px;
          border: 1px solid #dce7df;
          background: #fbfdfc;
          border-radius: 10px;
          padding: 0 40px 0 13px;
          display: flex;
          align-items: center;
          text-align: left;
          position: relative;
          color: #173f2a;
          cursor: pointer;
          font-size: 13px;
        }

        .custom-select-trigger:hover:not(:disabled) {
          border-color: #b9d0c0;
        }

        .custom-select-trigger:disabled {
          cursor: not-allowed;
          opacity: 0.55;
        }

        .select-placeholder,
        .date-placeholder {
          color: #9aa59f;
        }

        .select-value,
        .date-value {
          color: #30463a;
        }

        .select-chevron {
          position: absolute;
          right: 14px;
          top: 50%;
          width: 8px;
          height: 8px;
          border-right: 1.8px solid #68766e;
          border-bottom: 1.8px solid #68766e;
          transform: translateY(-65%) rotate(45deg);
          transition: transform 0.2s ease;
        }

        .select-chevron.chevron-up {
          transform: translateY(-25%) rotate(225deg);
        }

        .custom-select-menu {
          position: absolute;
          left: 0;
          right: 0;
          top: calc(100% + 6px);
          background: white;
          border: 1px solid #dce7df;
          border-radius: 11px;
          padding: 5px;
          box-shadow: 0 13px 30px rgba(23, 63, 42, 0.13);
          z-index: 1000;
          animation: dropdownPop 0.16s ease;
        }

        .custom-select-option {
          width: 100%;
          border: none;
          background: transparent;
          text-align: left;
          padding: 10px 11px;
          border-radius: 7px;
          color: #43564b;
          font-size: 12px;
          cursor: pointer;
        }

        .custom-select-option:hover,
        .custom-select-option.selected-option {
          background: #edf7f0;
          color: #167452;
        }

        .date-input {
          width: 100%;
          height: 44px;
          border: 1px solid #dce7df;
          background: #fbfdfc;
          border-radius: 10px;
          padding: 0 13px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          cursor: pointer;
          color: #30463a;
          font-size: 13px;
        }

        .date-input:hover {
          border-color: #b9d0c0;
        }

        .calendar-icon {
          color: #27834d;
          font-size: 15px;
        }

        .date-picker-popup {
          position: fixed;
          width: 310px;
          background: white;
          border: 1px solid #dce7df;
          border-radius: 15px;
          padding: 14px;
          box-shadow: 0 20px 50px rgba(23, 63, 42, 0.18);
          z-index: 10001;
          animation: datePop 0.18s ease;
        }

        .calendar-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 13px;
        }

        .calendar-header strong {
          font-size: 13px;
          color: #173f2a;
        }

        .calendar-header button {
          width: 30px;
          height: 30px;
          border: none;
          background: #f1f5f2;
          border-radius: 7px;
          cursor: pointer;
          font-size: 20px;
          color: #526158;
        }

        .calendar-header button:hover {
          background: #e5eee8;
        }

        .calendar-weekdays,
        .calendar-grid {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 4px;
        }

        .calendar-weekdays {
          margin-bottom: 5px;
        }

        .calendar-weekdays span {
          text-align: center;
          font-size: 10px;
          color: #8a958f;
          font-weight: 700;
        }

        .calendar-day {
          height: 34px;
          border: none;
          background: transparent;
          border-radius: 7px;
          color: #405249;
          font-size: 11px;
          cursor: pointer;
        }

        .calendar-day:hover:not(:disabled) {
          background: #edf7f0;
          color: #167452;
        }

        .calendar-day.calendar-selected {
          background: #167452;
          color: white;
          font-weight: 700;
        }

        .calendar-day.calendar-disabled {
          color: #c5ccc8;
          cursor: not-allowed;
        }

        .form-actions {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          margin-top: 7px;
        }

        .cancel-button,
        .submit-button,
        .confirm-delete-button,
        .modal-primary-button {
          border: none;
          border-radius: 9px;
          padding: 11px 18px;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
          transition: 0.2s ease;
        }

        .cancel-button {
          background: #f0f4f1;
          color: #526158;
        }

        .cancel-button:hover {
          background: #e4ebe6;
        }

        .submit-button,
        .modal-primary-button {
          background: #167452;
          color: white;
        }

        .submit-button:hover:not(:disabled),
        .modal-primary-button:hover {
          background: #126343;
          transform: translateY(-1px);
        }

        .submit-button:disabled,
        .cancel-button:disabled,
        .confirm-delete-button:disabled {
          opacity: 0.55;
          cursor: not-allowed;
        }

        .view-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
          margin-bottom: 23px;
        }

        .view-item {
          background: #f8fbf9;
          border: 1px solid #e3ece6;
          border-radius: 10px;
          padding: 12px;
        }

        .view-item strong {
          font-size: 13px;
        }

        .modal-primary-button {
          width: 100%;
        }

        .delete-icon {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: #fff0f0;
          color: #c35656;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 15px;
          font-size: 22px;
          font-weight: 800;
        }

        .delete-modal h2 {
          margin: 0 0 9px;
          color: #173f2a;
          font-size: 22px;
        }

        .delete-modal p {
          margin: 0;
          color: #7b8780;
          font-size: 13px;
          line-height: 1.6;
        }

        .delete-modal p strong {
          color: #43564b;
        }

        .delete-actions {
          display: flex;
          gap: 9px;
          margin-top: 23px;
        }

        .delete-actions button {
          flex: 1;
        }

        .confirm-delete-button {
          background: #c35656;
          color: white;
        }

        .confirm-delete-button:hover:not(:disabled) {
          background: #ad4949;
        }

        @keyframes pageFadeUp {
          from {
            opacity: 0;
            transform: translateY(12px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes cardStagger {
          from {
            opacity: 0;
            transform: translateY(15px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes modalPop {
          from {
            opacity: 0;
            transform: scale(0.96) translateY(8px);
          }

          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        @keyframes overlayFade {
          from {
            opacity: 0;
          }

          to {
            opacity: 1;
          }
        }

        @keyframes dropdownPop {
          from {
            opacity: 0;
            transform: translateY(-5px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes datePop {
          from {
            opacity: 0;
            transform: translateY(5px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes errorFade {
          from {
            opacity: 0;
            transform: translateY(-2px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 850px) {
          .admin-challenge-page {
            padding: 28px 20px 45px;
          }

          .admin-page-header {
            align-items: flex-start;
            flex-direction: column;
          }

          .challenge-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 600px) {
          .admin-challenge-page {
            padding: 22px 14px 35px;
          }

          .admin-page-header h1 {
            font-size: 27px;
          }

          .form-row,
          .view-grid {
            grid-template-columns: 1fr;
          }

          .form-modal,
          .view-modal {
            padding: 20px;
          }

          .date-picker-popup {
            width: min(310px, calc(100vw - 24px));
          }
        }
      `}</style>

      <div className="admin-challenge-page">
        <div className="admin-page-header">
          <div>
            <h1>Challenge Management</h1>

            <p>
              Create, manage and monitor community sustainability challenges.
            </p>
          </div>

          <button
            type="button"
            className="create-challenge-button"
            onClick={() => setFormModal("create")}
          >
            + Create Challenge
          </button>
        </div>
        <div className="mb-6 flex flex-wrap gap-3">
          {[
            { value: "all", label: "All Challenges" },
            { value: "not started", label: "Not Started" },
            { value: "ongoing", label: "Ongoing" },
            { value: "closed", label: "Closed" },
          ].map((status) => (
            <button
              key={status.value}
              type="button"
              onClick={() => {
                setFilter(status.value);
                setPage(1);
              }}
              className={`rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-300 ${
                filter === status.value
                  ? "bg-[#27834d] text-white shadow-md"
                  : "border border-[#d9e8df] bg-white text-[#557064] hover:border-[#27834d] hover:text-[#27834d]"
              }`}
            >
              {status.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="loading-state">Loading challenges...</div>
        ) : challenges.length === 0 ? (
          <div className="empty-state">
            <h3>No Challenges Available</h3>

            <p>Create your first challenge to get started.</p>
          </div>
        ) : (
          <>
            <div className="challenge-grid">
              {currentChallenges.map((challenge) => (
                <ChallengeCard
                  key={challenge._id || challenge.id}
                  challenge={challenge}
                  onView={handleView}
                  onEdit={(item) =>
                    setFormModal({
                      mode: "edit",
                      challenge: item,
                    })
                  }
                  onDelete={setDeleteChallenge}
                />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="pagination">
                <button
                  type="button"
                  className="pagination-arrow"
                  disabled={page === 1}
                  onClick={() =>
                    setPage((previous) => Math.max(1, previous - 1))
                  }
                >
                  ‹
                </button>

                {Array.from(
                  {
                    length: totalPages,
                  },
                  (_, index) => index + 1,
                ).map((pageNumber) => (
                  <button
                    type="button"
                    key={pageNumber}
                    className={page === pageNumber ? "active-page" : ""}
                    onClick={() => setPage(pageNumber)}
                  >
                    {pageNumber}
                  </button>
                ))}

                <button
                  type="button"
                  className="pagination-arrow"
                  disabled={page === totalPages}
                  onClick={() =>
                    setPage((previous) => Math.min(totalPages, previous + 1))
                  }
                >
                  ›
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {formModal && (
        <ChallengeFormModal
          mode={typeof formModal === "string" ? formModal : formModal.mode}
          initialChallenge={
            typeof formModal === "string" ? null : formModal.challenge
          }
          onClose={() => setFormModal(null)}
          onSuccess={
            typeof formModal === "string"
              ? handleCreateSuccess
              : handleUpdateSuccess
          }
        />
      )}

      {viewChallenge && (
        <ChallengeViewModal
          challenge={viewChallenge}
          onClose={() => setViewChallenge(null)}
        />
      )}

      {deleteChallenge && (
        <DeleteConfirmModal
          challenge={deleteChallenge}
          deleting={deleting}
          onClose={() => setDeleteChallenge(null)}
          onConfirm={handleDelete}
        />
      )}
    </>
  );
}

export default AdminChallengeManagement;
