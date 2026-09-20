import TrackingDetailLayout from "./tracking-detail-layout";
import { FaBolt, FaHome, FaBuilding } from "react-icons/fa";
import { MonthPickerInput,YearPickerInput } from "@mantine/dates";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import { NumberInput, Select} from "@mantine/core";
import { useRef, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";


export default function Electricity() {

  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState(null);
  const [usageType, setUsageType] = useState("");
  const [billingMonth, setBillingMonth] = useState(null);
  const [consumption, setConsumption] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  // CHANGE: loading state for the submit-in-progress flag (matches Transportation.jsx).
  const [loading, setLoading] = useState(false);

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

  const handleSave = async() => {
    // CHANGE: guard against duplicate submissions while a save is in progress.
    if (loading) return;

    // CHANGE: set loading to true before any processing begins.
    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 3000)); //remove this after connecting backend

    try {
      const numericConsumption = Number(consumption);
      if (!billingMonth || numericConsumption <= 0 || !usageType) {
       window.alert("Please complete all fields.");
       // CHANGE: early return still runs the finally block below.
       return;

      }
        const monthDate = new Date(billingMonth);
      const entry = {
    id: editingId || Date.now(),
    month: monthDate.toLocaleString("en-US", {
      month: "long",
    }),
    year: monthDate.getFullYear(),
    consumption: numericConsumption,
    usageType:
      usageType.charAt(0).toUpperCase() +
      usageType.slice(1),
  };

      if (editingId === null) {
        setPreviousEntries((entries) => [
          { ...entry, id: Date.now() },
          ...entries,
          
        ]);
      } else {
        setPreviousEntries((entries) =>
          entries.map((item) =>
            item.id === editingId ? { ...item, ...entry } : item,
          ),
        );
      }

      resetForm();
    } finally {
      // CHANGE: loading is always reset, regardless of outcome.
      setLoading(false);
    }
  };

  const handleEdit = (entry) => {
    setEditingId(entry.id);
    const monthIndex = new Date(`${entry.month} 1, ${entry.year}`).getMonth();
    setBillingMonth(new Date(entry.year, monthIndex, 1));

    setConsumption(entry.consumption);
    setUsageType(entry.usageType);
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
 const filteredEntries = previousEntries.filter((entry) => {
  const yearMatch =
    !selectedYear ||
    entry.year === new Date(selectedYear).getFullYear();

  const monthMatch =
    !selectedMonth ||
    entry.month === selectedMonth;

  return yearMatch && monthMatch;
});
const totalPages = Math.ceil(
  filteredEntries.length / recordsPerPage
);

const safePage = Math.min(currentPage, Math.max(totalPages, 1));

const currentEntries = filteredEntries.slice(
  (safePage - 1) * recordsPerPage,
  safePage * recordsPerPage
);

  const handleDelete = (entryId) => {
    setPreviousEntries((entries) => entries.filter((item) => item.id !== entryId));
    if (editingId === entryId) resetForm();
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
      data={["Home", "Business"]}
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
    placeholder="Year"
    clearable={!!selectedYear}
    styles={{
      input: {
        minHeight: "40px",
        width: "120px",
      },
    }}
  />

  <Select
    value={selectedMonth}
    onChange={(value) => {
      setSelectedMonth(value || "");
      setCurrentPage(1);
    }}
    placeholder="Month"
    clearable={!!selectedMonth}
    
    data={[
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ]}
    styles={{
      input: {
        minHeight: "40px",
        width: "140px",
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
            <td></td>
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