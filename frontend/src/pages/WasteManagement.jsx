import TrackingDetailLayout from "./tracking-detail-layout";
import { useState } from "react";
import { FaTrash,FaEdit } from "react-icons/fa";

import { NumberInput, Select } from "@mantine/core";
import { DateInput } from "@mantine/dates";

import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
export default function WasteManagement() {
  const [wasteAmount, setWasteAmount] = useState(null);
  const [disposalMethod, setDisposalMethod] = useState(null);
 
  const [wasteDate, setWasteDate] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [wasteType, setWasteType] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState("All");
const [selectedYear, setSelectedYear] = useState("All");
const [error, setError] = useState("");
const [currentPage, setCurrentPage] = useState(1);

const recordsPerPage = 5;
  const disposalOptions =
  wasteType === "Wet Waste"
    ? ["Composting", "Landfill"]
    : wasteType === "Dry Waste"
    ? ["Recycling", "Burned", "Landfill"]
    : wasteType === "E-waste"
    ? ["Recycling", "Burned", "Landfill"]
    : [];
  const [previousEntries, setPreviousEntries] = useState([]);
const handleAddEntry = () => {
  if (
    wasteAmount === null ||
    wasteAmount === "" ||
    !wasteType ||
    !disposalMethod ||
    !wasteDate
  ) {
    setError("Please fill all fields");
    return;
  }
  setError("");
  const newEntry = {
  id: editingId || Date.now(),
  amount: wasteAmount,
  wasteType,
  disposalMethod,
  date: wasteDate
    ? new Date(wasteDate).toLocaleDateString("en-GB")
    : "N/A",
};
const filteredEntries = previousEntries.filter((entry) => {
  return (
    selectedMonth === "All" ||
    entry.date.split("/")[1] === selectedMonth
  );
});
const totalPages = Math.ceil(
  filteredEntries.length / recordsPerPage
);

const currentEntries = filteredEntries.slice(
  (currentPage - 1) * recordsPerPage,
  currentPage * recordsPerPage
);

  if (editingId) {
    setPreviousEntries(
      currentEntries.map((item) =>
        item.id === editingId ? newEntry : item
      )
    );

    setEditingId(null);
  } else {
    setPreviousEntries((prev) => [
      newEntry,
      ...prev,
    ]);
  }

  clearForm();
};

  const inputStyles = {
    input: {
      minHeight: "48px",
      border: "1px solid #D7EADF",
    },
  };
const clearForm = () => {
  console.log("clearForm called");
  setWasteAmount(undefined);
  setWasteType(null);
  setDisposalMethod(null);
  setWasteDate(null);
  setEditingId(null);
  setError("");
};
const filteredEntries = previousEntries.filter((entry) => {
  const monthMatch =
    selectedMonth === "All" ||
    entry.date.split("/")[1] === selectedMonth;

  const yearMatch =
    selectedYear === "All" ||
    entry.date.split("/")[2] === selectedYear;

  return monthMatch && yearMatch;
});
const totalPages = Math.ceil(
  filteredEntries.length / recordsPerPage
);

const startIndex =
  (currentPage - 1) * recordsPerPage;

const currentEntries =
  filteredEntries.slice(
    startIndex,
    startIndex + recordsPerPage
  );
  return (
    <TrackingDetailLayout
      breadcrumbLabel="Waste Management"
      title="Waste Management Tracking"
      subtitle="Record waste generation and disposal activities to support sustainability efforts."
    >
      <div className="grid gap-6 md:grid-cols-4">
  <div>
    <label className="mb-2 block text-sm font-medium text-[#173F2A]">
      Waste Amount
    </label>

    <NumberInput
      value={wasteAmount}
      onChange={setWasteAmount}
      placeholder="Enter waste amount (in Kg)"
      hideControls
      styles={inputStyles}
    />
  </div>

  <div>
    <label className="mb-2 block text-sm font-medium text-[#173F2A]">
      Waste type
    </label>

    <Select
      value={wasteType}
      onChange={setWasteType}
      placeholder="Select waste type"
      data={[
      "Wet Waste",
      "Dry Waste",
      "E-waste"
      ]}
      styles={inputStyles}
    />
  </div>

  <div>
    <label className="mb-2 block text-sm font-medium text-[#173F2A]">
      Disposal Method
    </label>

    <Select
  value={disposalMethod}
  onChange={setDisposalMethod}
  placeholder="Select disposal method"
  data={disposalOptions}
  styles={inputStyles}
/>
  </div>

  <div>
    <label className="mb-2 block text-sm font-medium text-[#173F2A]">
      Date
    </label>

    <DateInput
      value={wasteDate}
      onChange={setWasteDate}
      valueFormat="DD/MM/YYYY"
      placeholder="Select date"
      color="green"
      styles={inputStyles}
    />
  </div>
</div>
{error && (
  <p className="mb-4 text-sm font-medium text-red-500">
    {error}
  </p>
)}

<div className="mt-8 flex gap-4">
  <button
  type="button"
  onClick={handleAddEntry}
  className="rounded-xl border border-[#27834D] px-6 py-3 font-medium text-[#27834D] transition hover:bg-[#27834D] hover:text-white"
>
  {editingId ? "Update Entry" : "Add Entry"}
</button>

  <button
  type="button"
  onClick={clearForm}
  className="rounded-xl border border-[#27834D] px-6 py-3 font-medium text-[#27834D] transition hover:bg-[#27834D] hover:text-white"
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

  <div className="flex gap-4">
    <div>
      <label className="mb-1 block text-sm font-medium text-[#173F2A]">
        Month
      </label>

      <Select
        value={selectedMonth}
        onChange={(value) => {
          setSelectedMonth(value);
          setCurrentPage(1);
        }}
        placeholder="All"
        w={120}
        data={[
          "All","01","02","03","04","05","06",
          "07","08","09","10","11","12",
        ]}
      />
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
</div>

{currentEntries.length === 0 ? (
  <div className="rounded-2xl border border-[#D7EADF] p-8 text-center">
    <p className="text-lg font-medium text-[#173F2A]">
        No entries found
      </p>

      <p className="mt-2 text-sm text-[#5C7064]">
        Add your first record to get started.
      </p>
  </div>
) : (
  <div className="overflow-hidden rounded-2xl border border-[#D7EADF]">
    
    <table className="w-full">
      
      <thead className="bg-[#EEF7F0]">
        <tr>
          <th className="px-6 py-4 text-left text-sm font-semibold">
            Date
          </th>

          <th className="px-6 py-4 text-left text-sm font-semibold">
            Amount
          </th>

          <th className="px-6 py-4 text-left text-sm font-semibold">
            Waste Type
          </th>

          <th className="px-6 py-4 text-left text-sm font-semibold">
            Disposal Method
          </th>
          <th className="px-6 py-4 text-left text-sm font-semibold">
  Actions
</th>
        </tr>
        
      </thead>

      <tbody>
        {currentEntries.map((entry) => (
          <tr
            key={entry.id}
            className="border-t border-[#D7EADF]"
          >
            <td className="px-6 py-4">{entry.date}</td>

            <td className="px-6 py-4">
              {entry.amount}
            </td>

            <td className="px-6 py-4">
              {entry.wasteType}
            </td>

            <td className="px-6 py-4">
              <span className="rounded-full bg-[#EEF7F0] px-3 py-1 text-sm text-[#27834D]">
                {entry.disposalMethod}
              </span>
            </td>
            <td className="px-6 py-4">
  <div className="flex gap-3">
    <button
      type="button"
      onClick={() => {
        const [day, month, year] = entry.date.split("/");
        setEditingId(entry.id);
        setWasteAmount(entry.amount);
        setDisposalMethod(entry.disposalMethod);
        setWasteDate(
  new Date(year, month - 1, day)
);
        setWasteType(entry.wasteType);
      }}
      className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#EEF7F0] text-[#27834D] transition hover:bg-[#DFF3E6]"
    >
      <FaEdit />
    </button>

    <button
      type="button"
      onClick={() =>
        setPreviousEntries(
          previousEntries.filter(
            (item) => item.id !== entry.id
          )
        )
      }
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
)}
</div>
    </TrackingDetailLayout>
  );
}
