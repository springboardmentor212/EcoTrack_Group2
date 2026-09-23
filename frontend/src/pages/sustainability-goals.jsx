import { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const GOALS_URL = import.meta.env.VITE_GOALS_URL;

const goalConfig = {
  Transportation: {
    periods: ["Daily", "Weekly", "Monthly"],
    types: [
      {
        label: "Reduce travelling distance",
        targets: [10, 20, 30, 40, 50],
        unit: "%",
        direction: "minimum",
      },
      {
        label: "Keep travelling distance within limit",
        targets: [10, 50, 100, 200, 300],
        unit: "km",
        direction: "maximum",
      },
      {
        label: "Use only Electric Vehicle",
        targets: [5, 10, 20, 30, 40, 50],
        unit: "trips",
        direction: "maximum",
      },
      {
        label: "Use only CNG Vehicle",
        targets: [5, 10, 20, 30, 40, 50],
        unit: "trips",
        direction: "maximum",
      },
    ],
  },

  Electricity: {
    periods: ["Monthly"],
    types: [
      {
        label: "Reduce electricity consumption",
        targets: [10, 20, 30, 40, 50],
        unit: "%",
        direction: "minimum",
      },
      {
        label: "Keep electricity consumption within limit",
        targets: [50, 100, 150, 200, 250],
        unit: "kWh",
        direction: "maximum",
      },
    ],
  },

  "Waste Management": {
    periods: ["Daily", "Weekly", "Monthly"],
    types: [
      {
        label: "Reduce waste generated",
        targets: [10, 20, 30, 40, 50],
        unit: "%",
        direction: "minimum",
      },
      {
        label: "Keep waste generation within limit",
        targets: [1, 2, 5, 10, 15],
        unit: "kg",
        direction: "maximum",
      },
    ],
  },

  "Carbon Emissions": {
    periods: ["Daily", "Weekly", "Monthly"],
    trackingTypes: [
      "All",
      "Transportation",
      "Electricity",
      "Waste Management",
    ],
    types: [
      {
        label: "Reduce carbon emissions",
        targets: [10, 20, 30, 40, 50],
        unit: "%",
        direction: "minimum",
      },
      {
        label: "Keep carbon emissions within limit",
        targets: [5, 10, 15, 20, 25],
        unit: "kg CO₂",
        direction: "maximum",
      },
    ],
  },

  "Carbon Saved": {
    periods: ["Daily", "Weekly", "Monthly"],
    types: [
      {
        label: "Increase carbon saved",
        targets: [2, 5, 10, 20, 30, 40, 50],
        unit: "kg CO₂",
        direction: "minimum",
      },
    ],
  },
};

const categories = Object.keys(goalConfig);

const getToday = () => {
  const date = new Date();

  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");
};

const formatLabel = (value) => {
  if (!value) return "";

  return String(value)
    .split(" ")
    .map(
      (word) =>
        word.charAt(0).toUpperCase() + word.slice(1)
    )
    .join(" ");
};

const getPeriodText = (period) => {
  if (period === "Daily") return "day";
  if (period === "Weekly") return "week";
  return "month";
};

const getGoalTitle = ({
  category,
  trackingType,
  goalType,
  target,
  unit,
  period,
}) => {
  if (!goalType || !target || !unit || !period) return "";

  const periodText = getPeriodText(period);

  if (category === "Carbon Emissions") {
    if (trackingType && trackingType !== "All") {
      if (goalType.startsWith("Reduce")) {
        return `${goalType} from ${trackingType} by ${target}${unit} this ${periodText}`;
      }

      return `${goalType} from ${trackingType} within ${target} ${unit} this ${periodText}`;
    }

    if (goalType.startsWith("Reduce")) {
      return `${goalType} by ${target}${unit} this ${periodText}`;
    }

    return `${goalType} within ${target} ${unit} this ${periodText}`;
  }

  if (goalType.startsWith("Reduce")) {
    return `${goalType} by ${target}${unit} this ${periodText}`;
  }

  if (goalType.startsWith("Keep")) {
    return `${goalType} within ${target} ${unit} this ${periodText}`;
  }

  if (goalType.startsWith("Use only")) {
    return `${goalType} for ${target} ${unit} this ${periodText}`;
  }

  return `${goalType} by ${target} ${unit} this ${periodText}`;
};

const normalizeGoal = (goal) => {
  const status = String(
    goal?.status || goal?.goalStatus || "active"
  ).toLowerCase();

  const progressPercentage =
    typeof goal?.progressPercentage === "number"
      ? goal.progressPercentage
      : typeof goal?.progress?.percentage === "number"
      ? goal.progress.percentage
      : null;

  const currentProgress =
    typeof goal?.currentProgress === "number"
      ? goal.currentProgress
      : typeof goal?.progress?.current === "number"
      ? goal.progress.current
      : null;

  return {
    ...goal,
    id: goal?._id || goal?.id,
    title:
      goal?.title ||
      goal?.goalTitle ||
      "Sustainability Goal",
    category:
      goal?.category ||
      goal?.goalType ||
      goal?.type ||
      "",
    target: goal?.target,
    unit: goal?.unit || "",
    period: goal?.period || "",
    endDate: goal?.endDate || "",
    trackingType: goal?.trackingType || "",
    status,
    currentProgress,
    progressPercentage,
  };
};

function Icon({ type }) {
  if (type === "plus") {
    return (
      <svg
        viewBox="0 0 24 24"
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path
          d="M12 5v14M5 12h14"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  if (type === "target") {
    return (
      <svg
        viewBox="0 0 24 24"
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <circle cx="12" cy="12" r="8.5" />
        <circle cx="12" cy="12" r="4.5" />
        <circle
          cx="12"
          cy="12"
          r="1.5"
          fill="currentColor"
        />
      </svg>
    );
  }

  if (type === "check") {
    return (
      <svg
        viewBox="0 0 24 24"
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path
          d="m5 12 4.5 4.5L19 7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (type === "clock") {
    return (
      <svg
        viewBox="0 0 24 24"
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <circle cx="12" cy="12" r="8.5" />
        <path
          d="M12 7v5l3 2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 24 24"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path
        d="M20.5 3.5C12.5 3.5 6 6.8 6 13.2c0 3.9 3.1 6.3 6.4 6.3 5.3 0 8.1-5.4 8.1-16Z"
        fill="currentColor"
        stroke="none"
      />
      <path
        d="M5 21c2.2-4.2 5.7-7.1 10.7-9.5"
        stroke="currentColor"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CustomSelect({
  label,
  value,
  options,
  placeholder,
  disabled,
  onChange,
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClick = (event) => {
      if (
        ref.current &&
        !ref.current.contains(event.target)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClick
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClick
      );
    };
  }, []);

  return (
    <div
      ref={ref}
      className="relative"
    >
      <label className="goal-form-label">
        {label}
      </label>

      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((current) => !current)}
        className={`goal-select ${
          open ? "goal-select-open" : ""
        } ${
          disabled ? "goal-select-disabled" : ""
        }`}
      >
        <span
          className={
            value
              ? "text-[#405149]"
              : "text-[#98a49d]"
          }
        >
          {value
            ? formatLabel(value)
            : placeholder}
        </span>

        <svg
          viewBox="0 0 20 20"
          className={`h-4 w-4 text-[#2f7650] transition-transform ${
            open ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        >
          <path
            d="m5 7.5 5 5 5-5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {open && !disabled && (
        <div className="goal-options">
          {options.map((option) => {
            const optionValue =
              typeof option === "object"
                ? option.value
                : option;

            const optionLabel =
              typeof option === "object"
                ? option.label
                : formatLabel(option);

            const selected =
              String(optionValue) ===
              String(value);

            return (
              <button
                key={String(optionValue)}
                type="button"
                className={`goal-option ${
                  selected
                    ? "goal-option-selected"
                    : ""
                }`}
                onClick={() => {
                  onChange(optionValue);
                  setOpen(false);
                }}
              >
                <span>{optionLabel}</span>

                {selected && (
                  <span className="text-[#27834d]">
                    ✓
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function ProgressCircle({
  percentage,
}) {
  if (
    typeof percentage !== "number" ||
    !Number.isFinite(percentage)
  ) {
    return null;
  }

  const safePercentage = Math.max(
    0,
    Math.min(100, percentage)
  );

  return (
    <div
      className="progress-circle"
      style={{
        "--progress": `${safePercentage}%`,
      }}
    >
      <div className="progress-circle-inner">
        <strong>{Math.round(safePercentage)}%</strong>
        <span>Progress</span>
      </div>
    </div>
  );
}

function GoalCard({
  goal,
  onCancel,
}) {
  const hasProgress =
    typeof goal.progressPercentage === "number" &&
    Number.isFinite(goal.progressPercentage);

  const hasCurrent =
    typeof goal.currentProgress === "number" &&
    Number.isFinite(goal.currentProgress);

  const isPrevious =
    goal.status === "failed" ||
    goal.status === "cancelled";

  return (
    <article
      className={`goal-card ${
        isPrevious
          ? "goal-card-previous"
          : ""
      }`}
    >
      <div className="goal-card-main">
        <div className="goal-card-content">
          <p
            className={`goal-category ${
              isPrevious
                ? "text-red-500"
                : ""
            }`}
          >
            {formatLabel(goal.category)}
          </p>

          <h3
            className={
              isPrevious
                ? "text-red-600"
                : ""
            }
          >
            {goal.title}
          </h3>

          {goal.trackingType &&
            goal.category ===
              "Carbon Emissions" && (
              <p className="goal-tracking">
                Tracking:{" "}
                {formatLabel(
                  goal.trackingType
                )}
              </p>
          )}

          <div className="goal-meta">
            {goal.target !== undefined &&
              goal.target !== null && (
                <span>
                  Target:{" "}
                  <strong>
                    {goal.target}{" "}
                    {goal.unit}
                  </strong>
                </span>
              )}

            {goal.period && (
              <span>
                {formatLabel(
                  goal.period
                )}
              </span>
            )}

            {goal.endDate && (
              <span>
                Ends:{" "}
                {goal.endDate}
              </span>
            )}
          </div>
        </div>

        {hasProgress && (
          <ProgressCircle
            percentage={
              goal.progressPercentage
            }
          />
        )}
      </div>

      {hasProgress && hasCurrent && (
        <div className="progress-area">
          <div className="progress-label-row">
            <span>Current progress</span>

            <strong>
              {goal.currentProgress}{" "}
              {goal.unit}
            </strong>
          </div>

          <div className="progress-track">
            <div
              className="progress-fill"
              style={{
                width: `${Math.max(
                  0,
                  Math.min(
                    100,
                    goal.progressPercentage
                  )
                )}%`,
              }}
            />
          </div>
        </div>
      )}

      {goal.status === "active" && (
        <div className="goal-card-actions">
          <button
            type="button"
            onClick={() => onCancel(goal)}
            className="cancel-goal-button"
          >
            Cancel Goal
          </button>
        </div>
      )}
    </article>
  );
}

function GoalCarousel({
  goals,
  title,
  description,
  icon,
  onCancel,
  previous,
}) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setIndex(0);
  }, [goals.length]);

  if (!goals.length) {
    return (
      <section className="goals-section">
        <div className="section-heading">
          <div className="section-heading-left">
            <div
              className={`section-icon ${
                previous
                  ? "section-icon-red"
                  : ""
              }`}
            >
              <Icon type={icon} />
            </div>

            <div>
              <h2>{title}</h2>
              <p>{description}</p>
            </div>
          </div>
        </div>

        <div
          className={`empty-card ${
            previous
              ? "empty-card-previous"
              : ""
          }`}
        >
          <div className="empty-card-icon">
            <Icon type={icon} />
          </div>

          <h3>
            {title === "Active Goals"
              ? "No active goals yet"
              : title ===
                "Completed Goals"
              ? "No completed goals yet"
              : "No previous goals yet"}
          </h3>

          <p>
            {title === "Active Goals"
              ? "Start a goal to begin tracking your sustainability progress."
              : title ===
                "Completed Goals"
              ? "Completed goals will appear here."
              : "Failed or cancelled goals will appear here."}
          </p>
        </div>
      </section>
    );
  }

  const visibleGoal = goals[index];

  return (
    <section className="goals-section">
      <div className="section-heading">
        <div className="section-heading-left">
          <div
            className={`section-icon ${
              previous
                ? "section-icon-red"
                : ""
            }`}
          >
            <Icon type={icon} />
          </div>

          <div>
            <h2>{title}</h2>
            <p>{description}</p>
          </div>
        </div>

        {goals.length > 1 && (
          <div className="carousel-controls">
            <button
              type="button"
              disabled={index === 0}
              onClick={() =>
                setIndex((current) =>
                  Math.max(0, current - 1)
                )
              }
              className="carousel-button"
              aria-label="Previous goal"
            >
              ←
            </button>

            <span>
              {index + 1} / {goals.length}
            </span>

            <button
              type="button"
              disabled={
                index === goals.length - 1
              }
              onClick={() =>
                setIndex((current) =>
                  Math.min(
                    goals.length - 1,
                    current + 1
                  )
                )
              }
              className="carousel-button"
              aria-label="Next goal"
            >
              →
            </button>
          </div>
        )}
      </div>

      <GoalCard
        goal={visibleGoal}
        onCancel={onCancel}
      />
    </section>
  );
}

export default function SustainabilityGoals() {
  const today = useMemo(
    () => getToday(),
    []
  );

  const [goals, setGoals] = useState([]);
  const [loading, setLoading] =
    useState(true);
  const [saving, setSaving] =
    useState(false);
  const [showForm, setShowForm] =
    useState(false);

  const [form, setForm] = useState({
    category: "",
    trackingType: "",
    goalType: "",
    target: "",
    unit: "",
    period: "",
    endDate: "",
  });

  const categoryConfig =
    goalConfig[form.category];

  const selectedType =
    categoryConfig?.types.find(
      (item) =>
        item.label === form.goalType
    );

  const goalTitle = getGoalTitle({
    category: form.category,
    trackingType: form.trackingType,
    goalType: form.goalType,
    target: form.target,
    unit: form.unit,
    period: form.period,
  });

  const activeGoals = goals.filter(
    (goal) =>
      goal.status === "active"
  );

  const completedGoals = goals.filter(
    (goal) =>
      goal.status === "complete" ||
      goal.status === "completed" ||
      goal.status === "achieve" ||
      goal.status === "achieved"
  );

  const previousGoals = goals.filter(
    (goal) =>
      goal.status === "failed" ||
      goal.status === "cancelled"
  );

  const loadGoals = async () => {
    try {
      setLoading(true);

      const { data } =
        await axios.get(
          `${GOALS_URL}/`,
          {
            withCredentials: true,
          }
        );

      const {
        success,
        message,
        goals: responseGoals,
      } = data;

      if (success) {
        setGoals(
          Array.isArray(responseGoals)
            ? responseGoals.map(
                normalizeGoal
              )
            : []
        );
      } else {
        toast.error(
          message ||
            "Unable to load goals."
        );
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Unable to load goals."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGoals();
  }, []);

  const resetForm = () => {
    setForm({
      category: "",
      trackingType: "",
      goalType: "",
      target: "",
      unit: "",
      period: "",
      endDate: "",
    });
  };

  const openForm = () => {
    resetForm();
    setShowForm(true);
  };

  const closeForm = () => {
    resetForm();
    setShowForm(false);
  };

  const handleCategoryChange = (
    value
  ) => {
    setForm({
      category: value,
      trackingType: "",
      goalType: "",
      target: "",
      unit: "",
      period: "",
      endDate: "",
    });
  };

  const handleTrackingTypeChange = (
    value
  ) => {
    setForm((current) => ({
      ...current,
      trackingType: value,
      goalType: "",
      target: "",
      unit: "",
    }));
  };

  const handleGoalTypeChange = (
    value
  ) => {
    const type =
      categoryConfig?.types.find(
        (item) =>
          item.label === value
      );

    setForm((current) => ({
      ...current,
      goalType: value,
      target: "",
      unit: type?.unit || "",
    }));
  };

  const handlePeriodChange = (
    value
  ) => {
    setForm((current) => ({
      ...current,
      period: value,
    }));
  };

  const handleEndDateChange = (
    event
  ) => {
    setForm((current) => ({
      ...current,
      endDate: event.target.value,
    }));
  };

  const startGoal = async (
    event
  ) => {
    event.preventDefault();

    if (
      !form.category ||
      !form.goalType ||
      !form.target ||
      !form.period ||
      !form.endDate
    ) {
      toast.error(
        "Please complete all required fields."
      );
      return;
    }

    if (
      form.category ===
        "Carbon Emissions" &&
      !form.trackingType
    ) {
      toast.error(
        "Please select a tracking type."
      );
      return;
    }

    if (form.endDate < today) {
      toast.error(
        "End date cannot be before today."
      );
      return;
    }

    try {
      setSaving(true);

      const body = {
        goalType: form.category,
        target: Number(form.target),
        unit: form.unit,
        period:
          form.period.toLowerCase(),
        startDate: today,
        endDate: form.endDate,
        goalDirection:
          selectedType?.direction,
      };

      if (
        form.category ===
        "Carbon Emissions"
      ) {
        body.trackingType =
          form.trackingType;
      }

      const { data } =
        await axios.post(
          `${GOALS_URL}/`,
          body,
          {
            withCredentials: true,
          }
        );

      const {
        success,
        message,
      } = data;

      if (success) {
        toast.success(
          message ||
            "Goal started successfully."
        );

        closeForm();
        await loadGoals();
      } else {
        toast.error(
          message ||
            "Unable to start goal."
        );
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Unable to start goal."
      );
    } finally {
      setSaving(false);
    }
  };

  const cancelGoal = async (
    goal
  ) => {
    if (!goal?.id) return;

    try {
      const { data } =
        await axios.patch(
          `${GOALS_URL}/${goal.id}/cancel`,
          {},
          {
            withCredentials: true,
          }
        );

      const {
        success,
        message,
      } = data;

      if (success) {
        toast.success(
          message ||
            "Goal cancelled."
        );

        await loadGoals();
      } else {
        toast.error(
          message ||
            "Unable to cancel goal."
        );
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Unable to cancel goal."
      );
    }
  };

  return (
    <div className="sustainability-goals-page">
      <div className="sustainability-goals-container">
        <header className="goals-topbar">
          <div>
            <p className="goals-eyebrow">
              SUSTAINABILITY
            </p>

            <h1>Goals</h1>

            <p className="goals-subtitle">
              Set meaningful goals and track your
              sustainability progress.
            </p>
          </div>

          {!showForm && (
            <button
              type="button"
              onClick={openForm}
              className="create-goal-button"
            >
              <Icon type="plus" />
              Create New Goal
            </button>
          )}
        </header>

        {showForm ? (
          <section className="goal-form-card">
            <div className="goal-form-header">
              <div>
                <p className="goals-eyebrow">
                  NEW GOAL
                </p>

                <h2>
                  Create a sustainability goal
                </h2>

                <p>
                  Choose what you want to improve
                  and set your deadline.
                </p>
              </div>

              <button
                type="button"
                onClick={closeForm}
                className="close-button"
              >
                ×
              </button>
            </div>

            <form onSubmit={startGoal}>
              <div className="goal-form-grid">
                <CustomSelect
                  label="Category"
                  value={form.category}
                  options={categories}
                  placeholder="Select category"
                  onChange={
                    handleCategoryChange
                  }
                />

                {form.category ===
                  "Carbon Emissions" && (
                  <CustomSelect
                    label="Choose Tracking Type"
                    value={
                      form.trackingType
                    }
                    options={
                      categoryConfig?.trackingTypes ||
                      []
                    }
                    placeholder="Select tracking type"
                    onChange={
                      handleTrackingTypeChange
                    }
                  />
                )}

                <CustomSelect
                  label="Goal Type"
                  value={form.goalType}
                  options={
                    categoryConfig?.types.map(
                      (item) =>
                        item.label
                    ) || []
                  }
                  placeholder="Select goal type"
                  disabled={
                    !form.category ||
                    (form.category ===
                      "Carbon Emissions" &&
                      !form.trackingType)
                  }
                  onChange={
                    handleGoalTypeChange
                  }
                />

                <CustomSelect
                  label="Target"
                  value={form.target}
                  options={
                    selectedType?.targets.map(
                      (target) =>
                        String(target)
                    ) || []
                  }
                  placeholder="Select target"
                  disabled={
                    !selectedType
                  }
                  onChange={(value) =>
                    setForm(
                      (current) => ({
                        ...current,
                        target: value,
                      })
                    )
                  }
                />

                <div>
                  <label className="goal-form-label">
                    Unit
                  </label>

                  <input
                    type="text"
                    readOnly
                    value={form.unit}
                    placeholder="Auto selected"
                    className="goal-input goal-input-muted"
                  />
                </div>

                <CustomSelect
                  label="Period"
                  value={form.period}
                  options={
                    categoryConfig?.periods ||
                    []
                  }
                  placeholder="Select period"
                  disabled={
                    !selectedType
                  }
                  onChange={
                    handlePeriodChange
                  }
                />

                <div>
                  <label className="goal-form-label">
                    End Date
                  </label>

                  <input
                    type="date"
                    min={today}
                    value={form.endDate}
                    onChange={
                      handleEndDateChange
                    }
                    className="goal-input"
                  />
                </div>

                <div className="goal-title-field">
                  <label className="goal-form-label">
                    Goal Title
                  </label>

                  <input
                    type="text"
                    readOnly
                    value={goalTitle}
                    placeholder="Generated automatically"
                    className="goal-input goal-input-muted"
                  />
                </div>
              </div>

              <div className="goal-form-footer">
                <button
                  type="button"
                  onClick={resetForm}
                  className="clear-button"
                >
                  Clear
                </button>

                <button
                  type="submit"
                  disabled={
                    saving ||
                    !form.category ||
                    !form.goalType ||
                    !form.target ||
                    !form.period ||
                    !form.endDate ||
                    form.endDate <
                      today ||
                    (form.category ===
                      "Carbon Emissions" &&
                      !form.trackingType)
                  }
                  className="start-goal-button"
                >
                  {saving
                    ? "Starting..."
                    : "Start Goal"}
                </button>
              </div>
            </form>
          </section>
        ) : (
          <>
            {loading ? (
              <div className="loading-card">
                <div className="loading-spinner" />
                <p>
                  Loading your goals...
                </p>
              </div>
            ) : (
              <>
                <GoalCarousel
                  title="Active Goals"
                  description="Goals you are currently working towards."
                  icon="target"
                  goals={activeGoals}
                  onCancel={cancelGoal}
                />

                <GoalCarousel
                  title="Completed Goals"
                  description="Goals you have successfully achieved."
                  icon="check"
                  goals={completedGoals}
                  onCancel={cancelGoal}
                />

                <GoalCarousel
                  title="Previous Goals"
                  description="Failed and cancelled goals."
                  icon="clock"
                  goals={previousGoals}
                  previous
                  onCancel={cancelGoal}
                />
              </>
            )}
          </>
        )}
      </div>

      <style>{`
        .sustainability-goals-page {
          min-height: 100%;
          background: #f8fbf9;
          padding: 28px 32px 42px;
          color: #173f2a;
        }

        .sustainability-goals-container {
          width: 100%;
          max-width: 1180px;
          margin: 0 auto;
        }

        .goals-topbar {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 24px;
          animation: goalsFadeUp .5s ease-out;
        }

        .goals-eyebrow {
          margin: 0 0 6px;
          color: #27834d;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: .16em;
        }

        .goals-topbar h1 {
          margin: 0;
          color: #173f2a;
          font-size: 30px;
          font-weight: 700;
          line-height: 1.15;
        }

        .goals-subtitle {
          margin: 7px 0 0;
          color: #7b8780;
          font-size: 12px;
        }

        .create-goal-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          min-height: 41px;
          border: 0;
          border-radius: 10px;
          background: #167452;
          padding: 0 16px;
          color: white;
          cursor: pointer;
          font-size: 12px;
          font-weight: 600;
          box-shadow: 0 8px 20px rgba(22,116,82,.13);
          transition: .25s ease;
        }

        .create-goal-button:hover {
          background: #105f43;
          transform: translateY(-1px);
        }

        .goals-section {
          margin-top: 28px;
          animation: goalsFadeUp .55s ease-out;
        }

        .section-heading {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 18px;
          margin-bottom: 12px;
        }

        .section-heading-left {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .section-icon {
          width: 31px;
          height: 31px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 9px;
          background: #e9f5ed;
          color: #27834d;
        }

        .section-icon-red {
          background: #fff0f0;
          color: #d35d5d;
        }

        .section-icon svg {
          width: 17px;
          height: 17px;
        }

        .section-heading h2 {
          margin: 0;
          color: #173f2a;
          font-size: 14px;
          font-weight: 700;
        }

        .section-heading p {
          margin: 3px 0 0;
          color: #8a958e;
          font-size: 10px;
        }

        .carousel-controls {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #819087;
          font-size: 10px;
        }

        .carousel-button {
          width: 29px;
          height: 29px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid #dce7df;
          border-radius: 8px;
          background: white;
          color: #2f7650;
          cursor: pointer;
          font-size: 15px;
          transition: .2s ease;
        }

        .carousel-button:hover:not(:disabled) {
          border-color: #9bc2aa;
          background: #edf7f0;
        }

        .carousel-button:disabled {
          opacity: .35;
          cursor: not-allowed;
        }

        .empty-card {
          min-height: 155px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          border: 1px solid #e2ebe5;
          border-radius: 13px;
          background: white;
          padding: 25px;
          text-align: center;
          box-shadow: 0 9px 28px rgba(33,78,50,.045);
        }

        .empty-card-previous {
          border-color: #f0dede;
        }

        .empty-card-icon {
          width: 44px;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          background: #edf7f0;
          color: #39845a;
          margin-bottom: 9px;
        }

        .empty-card-previous .empty-card-icon {
          background: #fff1f1;
          color: #d35d5d;
        }

        .empty-card h3 {
          margin: 0;
          color: #173f2a;
          font-size: 12px;
          font-weight: 700;
        }

        .empty-card p {
          max-width: 430px;
          margin: 5px 0 0;
          color: #849089;
          font-size: 10px;
        }

        .goal-card {
          border: 1px solid #e1ebe4;
          border-radius: 13px;
          background: white;
          padding: 19px;
          box-shadow: 0 9px 28px rgba(33,78,50,.045);
          transition: .25s ease;
        }

        .goal-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 14px 34px rgba(33,78,50,.075);
        }

        .goal-card-previous {
          border-color: #efdada;
        }

        .goal-card-main {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 25px;
        }

        .goal-card-content {
          min-width: 0;
          flex: 1;
        }

        .goal-category {
          margin: 0 0 7px;
          color: #27834d;
          font-size: 9px;
          font-weight: 700;
          letter-spacing: .13em;
          text-transform: uppercase;
        }

        .goal-card h3 {
          margin: 0;
          color: #173f2a;
          font-size: 16px;
          line-height: 1.5;
          font-weight: 700;
        }

        .goal-tracking {
          margin: 5px 0 0;
          color: #87938c;
          font-size: 10px;
        }

        .goal-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 13px;
        }

        .goal-meta span {
          border-radius: 8px;
          background: #f5f9f6;
          padding: 7px 9px;
          color: #87928c;
          font-size: 9px;
        }

        .goal-meta strong {
          color: #456052;
        }

        .progress-circle {
          --progress: 0%;
          width: 90px;
          height: 90px;
          flex: 0 0 90px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          background:
            conic-gradient(
              #27834d var(--progress),
              #e8f0eb var(--progress)
            );
        }

        .progress-circle-inner {
          width: 70px;
          height: 70px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          background: white;
        }

        .progress-circle-inner strong {
          color: #173f2a;
          font-size: 15px;
        }

        .progress-circle-inner span {
          margin-top: 2px;
          color: #8b968f;
          font-size: 8px;
        }

        .progress-area {
          margin-top: 17px;
          padding-top: 16px;
          border-top: 1px solid #edf1ee;
        }

        .progress-label-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 7px;
          color: #87928c;
          font-size: 9px;
        }

        .progress-label-row strong {
          color: #365c47;
        }

        .progress-track {
          height: 7px;
          overflow: hidden;
          border-radius: 999px;
          background: #e9f0eb;
        }

        .progress-fill {
          height: 100%;
          border-radius: inherit;
          background: linear-gradient(
            90deg,
            #5ca876,
            #27834d
          );
          transition: width .5s ease;
        }

        .goal-card-actions {
          display: flex;
          justify-content: flex-end;
          margin-top: 14px;
        }

        .cancel-goal-button {
          border: 1px solid #f0cccc;
          border-radius: 8px;
          background: white;
          padding: 7px 11px;
          color: #d35d5d;
          cursor: pointer;
          font-size: 9px;
          font-weight: 600;
          transition: .2s ease;
        }

        .cancel-goal-button:hover {
          background: #fff3f3;
        }

        .goal-form-card {
          margin-top: 24px;
          border: 1px solid #e1ebe4;
          border-radius: 13px;
          background: white;
          padding: 24px;
          box-shadow: 0 10px 30px rgba(33,78,50,.055);
          animation: goalsFadeUp .45s ease-out;
        }

        .goal-form-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 20px;
          margin-bottom: 23px;
        }

        .goal-form-header h2 {
          margin: 0;
          color: #173f2a;
          font-size: 20px;
          font-weight: 700;
        }

        .goal-form-header p:last-child {
          margin: 5px 0 0;
          color: #7d8982;
          font-size: 11px;
        }

        .close-button {
          width: 34px;
          height: 34px;
          border: 1px solid #dce7df;
          border-radius: 9px;
          background: white;
          color: #738078;
          cursor: pointer;
          font-size: 20px;
          line-height: 1;
          transition: .2s ease;
        }

        .close-button:hover {
          border-color: #efc4c4;
          background: #fff5f5;
          color: #d35d5d;
        }

        .goal-form-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 18px;
        }

        .goal-title-field {
          grid-column: 1 / -1;
        }

        .goal-form-label {
          display: block;
          margin-bottom: 7px;
          color: #173f2a;
          font-size: 11px;
          font-weight: 600;
        }

        .goal-input,
        .goal-select {
          width: 100%;
          min-height: 44px;
          box-sizing: border-box;
          border: 1px solid #dce7df;
          border-radius: 10px;
          outline: none;
          background: white;
          padding: 0 13px;
          color: #405149;
          font-size: 11px;
          transition: .22s ease;
        }

        .goal-input:focus,
        .goal-select-open {
          border-color: #72a988;
          box-shadow: 0 0 0 4px rgba(114,169,136,.11);
        }

        .goal-input-muted {
          background: #f5f8f6;
          color: #69766e;
        }

        .goal-select {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          text-align: left;
          cursor: pointer;
        }

        .goal-select-disabled {
          background: #f5f8f6;
          color: #a0aaa4;
          cursor: not-allowed;
        }

        .goal-options {
          position: absolute;
          z-index: 20;
          top: calc(100% + 6px);
          left: 0;
          right: 0;
          max-height: 220px;
          overflow-y: auto;
          border: 1px solid #dce9df;
          border-radius: 11px;
          background: white;
          padding: 5px;
          box-shadow: 0 16px 35px rgba(31,79,52,.13);
          animation: dropdownIn .15s ease-out;
        }

        .goal-option {
          width: 100%;
          min-height: 38px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          border: 0;
          border-radius: 8px;
          background: transparent;
          padding: 8px 10px;
          color: #536159;
          cursor: pointer;
          text-align: left;
          font-size: 11px;
          transition: .16s ease;
        }

        .goal-option:hover,
        .goal-option-selected {
          background: #edf7f0;
          color: #246a45;
        }

        .goal-form-footer {
          display: flex;
          justify-content: flex-end;
          gap: 9px;
          margin-top: 24px;
        }

        .clear-button,
        .start-goal-button {
          min-height: 41px;
          border-radius: 9px;
          padding: 0 18px;
          cursor: pointer;
          font-size: 11px;
          font-weight: 600;
        }

        .clear-button {
          border: 1px solid #b9d0c0;
          background: white;
          color: #2f6f4e;
        }

        .clear-button:hover {
          background: #edf7f0;
        }

        .start-goal-button {
          border: 0;
          background: #167452;
          color: white;
          box-shadow: 0 7px 18px rgba(22,116,82,.13);
        }

        .start-goal-button:hover:not(:disabled) {
          background: #105f43;
        }

        .start-goal-button:disabled {
          background: #b8c9be;
          cursor: not-allowed;
          box-shadow: none;
        }

        .loading-card {
          min-height: 180px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 10px;
          margin-top: 25px;
          border: 1px solid #e2ebe5;
          border-radius: 13px;
          background: white;
          color: #7f8b84;
          font-size: 11px;
        }

        .loading-spinner {
          width: 26px;
          height: 26px;
          border: 3px solid #dcebe1;
          border-top-color: #27834d;
          border-radius: 50%;
          animation: spin .7s linear infinite;
        }

        @keyframes goalsFadeUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes dropdownIn {
          from {
            opacity: 0;
            transform: translateY(-4px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        @media (max-width: 800px) {
          .sustainability-goals-page {
            padding: 22px 18px 35px;
          }

          .goals-topbar {
            align-items: flex-start;
            flex-direction: column;
          }

          .create-goal-button {
            width: 100%;
          }

          .goal-form-grid {
            grid-template-columns: 1fr;
          }

          .goal-title-field {
            grid-column: auto;
          }
        }

        @media (max-width: 560px) {
          .goal-card-main {
            align-items: flex-start;
            flex-direction: column;
          }

          .progress-circle {
            align-self: flex-end;
          }

          .goal-form-card {
            padding: 18px;
          }

          .goal-form-footer {
            flex-direction: column-reverse;
          }

          .clear-button,
          .start-goal-button {
            width: 100%;
          }

          .section-heading {
            align-items: flex-start;
          }

          .carousel-controls {
            flex-shrink: 0;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            animation-duration: .01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: .01ms !important;
          }
        }
      `}</style>
    </div>
  );
}