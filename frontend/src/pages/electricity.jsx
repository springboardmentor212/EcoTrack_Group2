import TrackingDetailLayout from "./tracking-detail-layout";
import { FaBolt, FaHome, FaBuilding } from "react-icons/fa";
import { MonthPickerInput,YearPickerInput } from "@mantine/dates";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import { NumberInput, Select} from "@mantine/core";
import { useEffect, useRef, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import axios from "axios";


const MONTHS = [
  { value: "jan", label: "January" },
  { value: "feb", label: "February" },
  { value: "mar", label: "March" },
  { value: "apr", label: "April" },
  { value: "may", label: "May" },
  { value: "jun", label: "June" },
  { value: "jul", label: "July" },
  { value: "aug", label: "August" },
  { value: "sep", label: "September" },
  { value: "oct", label: "October" },
  { value: "nov", label: "November" },
  { value: "dec", label: "December" },
];
const MONTH_LABEL_BY_VALUE = Object.fromEntries(
  MONTHS.map(({ value, label }) => [value, label])
);
const currentYear = new Date().getFullYear();

export default function Electricity() {
  const CARBON_ACTIVITY = import.meta.env.VITE_CARBON_ACTIVITY;
  const [selectedYear, setSelectedYear] = useState(
  new Date(currentYear, 0, 1)
);
  const [usageType, setUsageType] = useState("");
  const [billingMonth, setBillingMonth] = useState(null);
  const [consumption, setConsumption] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  // CHANGE: loading state for the submit-in-progress flag (matches Transportation.jsx).
  const [loading, setLoading] = useState(false);
  // CHANGE: error state surfaced in the UI on failed requests.
  const [error, setError] = useState(null);

  const recordsPerPage = 5;
  const [previousEntries, setPreviousEntries] = useState([]);
  const formRef = useRef(null);
    const inputStyles = {
    input: {
      minHeight: "48px",
      border: "1px solid #D7EADF",
    },
  };

  const resetForm = () => {
  setBillingMonth(null);
  setConsumption("");
  setUsageType(null);
  setEditingId(null);
};

  const mapActivity = (item) => ({
    id: item._id,
    monthValue: item.electricity.month,
    month: MONTH_LABEL_BY_VALUE[item.electricity.month] || item.electricity.month,
    year: item.electricity.year,
    consumption: item.electricity.consumption,
    usageTypeValue: item.electricity.usageType,
    usageType:
      item.electricity.usageType.charAt(0).toUpperCase() +
      item.electricity.usageType.slice(1),
    emission: item.emission,
  });


  const fetchElectricityActivities = async () => {
    try {
      const params = {};
      if (selectedYear) {
        params.year = new Date(selectedYear).getFullYear();
      }

      const response = await axios.get(`${CARBON_ACTIVITY}/electricity`, {
        params,
        withCredentials: true,
      });

      if (response.data.success) {
        setPreviousEntries(response.data.electricityActivity.map(mapActivity));
      }
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to load electricity activities"
      );
    }
  };

  
  useEffect(() => {
    fetchElectricityActivities();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedYear]);

  const handleSave = async() => {
    // CHANGE: guard against duplicate submissions while a save is in progress.
    if (loading) return;

    // CHANGE: set loading to true before any processing begins.
    setLoading(true);
    // CHANGE: clear any previous error before a new attempt.
    setError(null);

    try {
      const numericConsumption = Number(consumption);
      if (!billingMonth || numericConsumption <= 0 || !usageType) {
       window.alert("Please complete all fields.");
       // CHANGE: early return still runs the finally block below.
       return;

      }
      const monthDate = new Date(billingMonth);

      const payload = {
        category: "electricity",
        electricity: {
          month: MONTHS[monthDate.getMonth()].value,
          year: monthDate.getFullYear(),
          consumption: numericConsumption,
          usageType,
        },
      };

      let response;

      if (editingId) {
        response = await axios.patch(
          `${CARBON_ACTIVITY}/electricity`,
          {
            _id: editingId,
            ...payload,
          },
          {
            withCredentials: true,
          }
        );
      } else {
        response = await axios.post(
          `${CARBON_ACTIVITY}/electricity`,
          payload,
          {
            withCredentials: true,
          }
        );
      }

      if (response.data.success) {
        resetForm();
        // CHANGE: refresh from the backend instead of hand-building local state.
        await fetchElectricityActivities();
      }
    } catch (error) {
      // CHANGE: surface backend error message, falling back to a generic one.
      setError(
        error.response?.data?.message ||
        "Failed to save electricity activity"
      );
    } finally {
      // CHANGE: loading is always reset, regardless of outcome.
      setLoading(false);
    }
  };

  const handleEdit = (entry) => {
    setEditingId(entry.id);
    // CHANGE: derive the month index from the backend abbreviation (monthValue)
    // instead of parsing the display label, so it's not locale/format-fragile.
    const monthIndex = MONTHS.findIndex((m) => m.value === entry.monthValue);
    setBillingMonth(new Date(entry.year, monthIndex >= 0 ? monthIndex : 0, 1));

    setConsumption(entry.consumption);
    // CHANGE: Select's value must be the backend value ("home"/"business"),
    // not the capitalized display label.
    setUsageType(entry.usageTypeValue);
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
 const filteredEntries = previousEntries.filter(
  (entry) =>
    !selectedYear ||
    entry.year === new Date(selectedYear).getFullYear()
);
const totalPages = Math.ceil(
  filteredEntries.length / recordsPerPage
);

const safePage = Math.min(currentPage, Math.max(totalPages, 1));

const currentEntries = filteredEntries.slice(
  (safePage - 1) * recordsPerPage,
  safePage * recordsPerPage
);

  // CHANGE: DELETE ${CARBON_ACTIVITY}/${activityId}, then refresh from backend.
  const handleDelete = async (entryId) => {
    setError(null);
    try {
      const response = await axios.delete(`${CARBON_ACTIVITY}/${entryId}`, {
        withCredentials: true,
      });

      if (response.data.success) {
        if (editingId === entryId) resetForm();
        await fetchElectricityActivities();
      }
    } catch (error) {
      setError(
        error.response?.data?.message ||
        "Failed to delete electricity activity"
      );
    }
  };

    return (
        <TrackingDetailLayout
            breadcrumbLabel="Electricity"
            title="Electricity Tracking"
            subtitle="Monitor electricity consumption and understand its environmental impact."
        >
            <div className="mb-8 flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#EEF7F0]">
                    <FaBolt className="text-2xl text-[#27834D]" />
                </div>

                <div>
                    <h2 className="text-xl font-semibold text-[#173F2A]">
                        Electricity Details
                    </h2>

                    <p className="text-[#5C7064]">
                        Add your electricity consumption information.
                    </p>
                </div>
            </div>
            <div ref={formRef} className="grid gap-6 md:grid-cols-3">
  <div>
    <label className="mb-2 block text-sm font-medium text-[#173F2A]">
      Billing Month and Year
    </label>

    <MonthPickerInput
      value={billingMonth}
      onChange={setBillingMonth}
      valueFormat="MMMM YYYY"
      placeholder="Select billing month"
      minDate={new Date(2000, 0, 1)}
  maxDate={new Date()}
      color="green"
      styles={inputStyles}
    />
  </div>

  <div>
    <label className="mb-2 block text-sm font-medium text-[#173F2A]">
      Consumption (kWh)
    </label>

    <NumberInput
      value={consumption}
      onChange={setConsumption}
      placeholder="Enter consumption"
      hideControls
      styles={inputStyles}
    />
  </div>

  <div>
    <label className="mb-2 block text-sm font-medium text-[#173F2A]">
      Usage Type
    </label>

    <Select
      value={usageType}
      onChange={setUsageType}
      placeholder="Select usage type"
      data={[
    { value: "home", label: "Home" },
    { value: "business", label: "Business" },
]}
      styles={inputStyles}
    />
  </div>
</div>

        <div className="mt-8 flex gap-4">
    <button
        type="button"
      onClick={handleSave}
        
        disabled={loading}
        
        className={`rounded-xl border border-[#27834D] bg-white px-6 py-3 font-medium text-[#27834D] transition hover:bg-[#27834D] hover:text-white ${
          loading ? "cursor-not-allowed opacity-50" : ""
        }`}
    >
      {/* CHANGE: label shows "Saving..." while loading. */}
      {loading ? "Saving..." : editingId === null ? "Add Entry" : "Update Entry"}
    </button>

    <button
        type="button"
      onClick={resetForm}
        
        disabled={loading}
        className={`rounded-xl border border-[#27834D] bg-white px-6 py-3 font-medium text-[#27834D] transition hover:bg-[#27834D] hover:text-white ${
          loading ? "cursor-not-allowed opacity-50" : ""
        }`}
    >
        Clear Form
    </button>
</div>

{/* CHANGE: surfaces request errors from handleSave / handleDelete / fetchElectricityActivities. */}
{error && (
  <p className="mt-4 text-sm text-[#B34B4B]">{error}</p>
)}

<div className="mt-12">
  <div className="mb-6 flex items-end justify-between">
  <div>
    <h2 className="text-xl font-semibold text-[#173F2A]">
      Previous Entries
    </h2>

    <span className="text-sm text-[#5C7064]">
      {filteredEntries.length} Records
    </span>
  </div>

<div className="flex items-end gap-2">
  <YearPickerInput
    value={selectedYear}
    onChange={(value) => {
      setSelectedYear(value);
      setCurrentPage(1);
    }}
    minDate={new Date(2000, 0, 1)}
  maxDate={new Date(currentYear, 11, 31)}
    placeholder="Year"
    clearable={!!selectedYear}
    styles={{
      input: {
        minHeight: "40px",
        width: "120px",
      },
    }}
  />

  
</div>
  </div>

  <div className="overflow-hidden rounded-2xl border border-[#D7EADF]">

  {filteredEntries.length === 0 ? (
    <div className="py-12 text-center">
      <p className="text-lg font-medium text-[#173F2A]">
        No entries found
      </p>

      <p className="mt-2 text-sm text-[#5C7064]">
        Add your first electricity record to get started.
      </p>
    </div>
  ) : (
    <>
      <table className="w-full">
      <thead className="bg-[#EEF7F0]">
        <tr>
          <th className="px-6 py-4 text-left text-sm font-semibold">
            Month
          </th>
          <th className="px-6 py-4 text-left text-sm font-semibold">
            Year
          </th>
          <th className="px-6 py-4 text-left text-sm font-semibold">
            Consumption (kWh)
          </th>
          <th className="px-6 py-4 text-left text-sm font-semibold">
            Usage Type
          </th>
          <th className="px-6 py-4 text-left text-sm font-semibold">
            Carbon Emission (kg CO₂e)
          </th>
          <th className="px-6 py-4 text-left text-sm font-semibold">
            Actions
          </th>
        </tr>
      </thead>

      <tbody>
        {currentEntries.map((entry) => (
          <tr key={entry.id} className="border-t border-[#D7EADF]">
            <td className="px-6 py-4">{entry.month}</td>
            <td className="px-6 py-4">{entry.year}</td>
            <td className="px-6 py-4">{entry.consumption}</td>
            <td className="px-6 py-4">
              <span className="rounded-full bg-[#EEF7F0] px-3 py-1 text-sm text-[#27834D]">
                {entry.usageType}
              </span>
            </td>
            <td className="px-6 py-4">
              {/* CHANGE: display backend-computed emission instead of a blank cell. */}
              {typeof entry.emission === "number" ? entry.emission.toFixed(2) : "-"}
            </td>
            <td className="px-6 py-4">
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => handleEdit(entry)}
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#EEF7F0] text-[#27834D] transition hover:bg-[#DFF3E6]"
                >
                  <FaEdit />
                </button>

                <button
                  type="button"
                  onClick={() => handleDelete(entry.id)}
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#FDF2F2] text-[#B34B4B] transition hover:bg-[#FBE5E5]"
                >
                  <FaTrash />
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>

    {totalPages > 1 && (
      <div className="mt-6 flex justify-center gap-2">
        {safePage > 1 && (
          <button
            onClick={() => setCurrentPage(safePage - 1)}
            className="rounded border px-3 py-1"
          >
            {"<"}
          </button>
        )}

        {Array.from(
          { length: Math.min(5, totalPages) },
          (_, index) => {
            const pageNumber =
              Math.max(
                1,
                Math.min(safePage - 2, totalPages - 4)
              ) + index;

            return (
              <button
                key={pageNumber}
                onClick={() => setCurrentPage(pageNumber)}
                className={`rounded px-3 py-1 ${
                  safePage === pageNumber
                    ? "bg-[#27834D] text-white"
                    : "border"
                }`}
              >
                {pageNumber}
              </button>
            );
          }
        )}

        {safePage < totalPages && (
          <button
            onClick={() => setCurrentPage(safePage + 1)}
            className="rounded border px-3 py-1"
          >
            {">"}
          </button>
        )}
      </div>
    )}
      </>
  )}
  </div>

</div>
  
      </TrackingDetailLayout>
    );
  }