import TrackingDetailLayout from "./tracking-detail-layout";
import { FaBolt, FaHome, FaBuilding } from "react-icons/fa";
import { MonthPickerInput } from "@mantine/dates";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import { NumberInput, Select} from "@mantine/core";
import { useRef, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";


export default function Electricity() {
  const [usageType, setUsageType] = useState("");
  const [billingMonth, setBillingMonth] = useState(null);
  const [consumption, setConsumption] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [selectedYear, setSelectedYear] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  const recordsPerPage = 5;
  const [previousEntries, setPreviousEntries] = useState([
    { id : 1,
      month: "June",
      year: 2025,
      consumption: 245,
      usageType: "Home",
    },
    { id : 2,
      month: "July",
      year: 2025,
      consumption: 280,
      usageType: "Business",
    },
  ]);
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
  setUsageType("");
  setEditingId(null);
};

  const handleSave = () => {
    const numericConsumption = Number(consumption);
    if (!billingMonth || numericConsumption <= 0 || !usageType) {
     window.alert("Please complete all fields.");
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
        ...entries,
        { ...entry, id: Date.now() },
      ]);
    } else {
      setPreviousEntries((entries) =>
        entries.map((item) =>
          item.id === editingId ? { ...item, ...entry } : item,
        ),
      );
    }

    resetForm();
  };

  const handleEdit = (entry) => {
    setEditingId(entry.id);
    const monthIndex = new Date(`${entry.month} 1, ${entry.year}`).getMonth();
    setBillingMonth(new Date(entry.year, monthIndex, 1));

    setConsumption(entry.consumption);
    setUsageType(entry.usageType.toLowerCase());
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  const filteredEntries = previousEntries.filter((entry) => {
  return (
    selectedYear === "All" ||
    String(entry.year) === selectedYear
  );
});
const totalPages = Math.ceil(
  filteredEntries.length / recordsPerPage
);

const currentEntries = filteredEntries.slice(
  (currentPage - 1) * recordsPerPage,
  currentPage * recordsPerPage
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
            </div>
<div className="mt-8">
    <label className="mb-4 block text-sm font-medium text-[#173F2A]">
        Usage Type
    </label>

    <div className="grid gap-4 md:grid-cols-2">

        <button
    type="button"
    onClick={() => setUsageType("home")}
    className={`flex items-center gap-4 rounded-2xl p-5 text-left transition ${
        usageType === "home"
            ? "border-2 border-[#27834D] bg-[#EEF7F0]"
            : "border border-[#D7EADF] hover:border-[#27834D] hover:bg-[#EEF7F0]"
    }`}
>
            <FaHome className="text-2xl text-[#27834D]" />

            <div>
                <h3 className="font-semibold">Home</h3>
                <p className="text-sm text-[#5C7064]">
                    Residential electricity usage
                </p>
            </div>
        </button>

        <button
    type="button"
    onClick={() => setUsageType("business")}
    className={`flex items-center gap-4 rounded-2xl p-5 text-left transition ${
        usageType === "business"
            ? "border-2 border-[#27834D] bg-[#EEF7F0]"
            : "border border-[#D7EADF] hover:border-[#27834D] hover:bg-[#EEF7F0]"
    }`}
>
            <FaBuilding className="text-2xl text-[#27834D]" />

            <div>
                <h3 className="font-semibold">Business</h3>
                <p className="text-sm text-[#5C7064]">
                    Commercial electricity usage
                </p>
            </div>
        </button>

    </div>
</div>
        <div className="mt-8 flex gap-4">
    <button
        type="button"
      onClick={handleSave}
        className="rounded-xl border border-[#27834D] bg-white px-6 py-3 font-medium text-[#27834D] transition hover:bg-[#27834D] hover:text-white"
    >
      {editingId === null ? "Add Entry" : "Update Entry"}
    </button>

    <button
        type="button"
      onClick={resetForm}
        className="rounded-xl border border-[#27834D] bg-white px-6 py-3 font-medium text-[#27834D] transition hover:bg-[#27834D] hover:text-white"
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

  <div>
    <label className="mb-1 block text-sm font-medium text-[#173F2A]">
  Year
</label>

<Select
  value={selectedYear}
  onChange={(value) => {
    setSelectedYear(value);
    setCurrentPage(1);
  }}
  placeholder="All"
  w={120}
  data={[
    "All",
    "2024",
    "2025",
    "2026",
  ]}
/>

  </div>

  </div>

  <div className="overflow-hidden rounded-2xl border border-[#D7EADF]">
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
        {currentPage > 1 && (
          <button
            onClick={() => setCurrentPage(currentPage - 1)}
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
                Math.min(currentPage - 2, totalPages - 4)
              ) + index;

            return (
              <button
                key={pageNumber}
                onClick={() => setCurrentPage(pageNumber)}
                className={`rounded px-3 py-1 ${
                  currentPage === pageNumber
                    ? "bg-[#27834D] text-white"
                    : "border"
                }`}
              >
                {pageNumber}
              </button>
            );
          }
        )}

        {currentPage < totalPages && (
          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            className="rounded border px-3 py-1"
          >
            {">"}
          </button>
        )}
      </div>
    )}
  </div>

  </div>
  
      </TrackingDetailLayout>
    );
  }