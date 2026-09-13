import TrackingDetailLayout from "./tracking-detail-layout";
import { useState } from "react";
import { FaTrash,FaEdit } from "react-icons/fa";

import { NumberInput, Select } from "@mantine/core";
import { DateInput } from "@mantine/dates";

import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
export default function WasteManagement() {
  const [wasteAmount, setWasteAmount] = useState(null);
  const [unit, setUnit] = useState("");
  const [disposalMethod, setDisposalMethod] = useState("");
  const [wasteDate, setWasteDate] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [previousEntries, setPreviousEntries] = useState([
  {
    id: 1,
    amount: 5,
    unit: "kg",
    disposalMethod: "Recycling",
    date: "12/09/2025",
  },
]);//this is a sample previous entry, you can replace it with your actual data or fetch it from an API.
const handleAddEntry = () => {
  const newEntry = {
    id: editingId || Date.now(),
    amount: wasteAmount,
    unit,
    disposalMethod,
    date: wasteDate
      ? new Date(wasteDate).toLocaleDateString("en-GB")
      : "N/A",
  };

  if (editingId) {
    setPreviousEntries(
      previousEntries.map((item) =>
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
  setWasteAmount("");
  setUnit("");
  setDisposalMethod("");
  setWasteDate(null);
};
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
      placeholder="Enter waste amount"
      hideControls
      styles={inputStyles}
    />
  </div>

  <div>
    <label className="mb-2 block text-sm font-medium text-[#173F2A]">
      Unit
    </label>

    <Select
      value={unit}
      onChange={setUnit}
      placeholder="Select unit"
      data={["kg", "grams"]}
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
      data={[
        "Recycling",
        "Composting",
        "Reuse",
        "Landfill",
        "Incineration",
        "Other",
      ]}
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
  <div className="mb-6 flex items-center justify-between">
    <h2 className="text-xl font-semibold text-[#173F2A]">
      Previous Entries
    </h2>

    <span className="text-sm text-[#5C7064]">
      {previousEntries.length} Records
    </span>
  </div>

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
            Unit
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
        {previousEntries.map((entry) => (
          <tr
            key={entry.id}
            className="border-t border-[#D7EADF]"
          >
            <td className="px-6 py-4">{entry.date}</td>

            <td className="px-6 py-4">
              {entry.amount}
            </td>

            <td className="px-6 py-4">
              {entry.unit}
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
        setEditingId(entry.id);
        setWasteAmount(entry.amount);
        setUnit(entry.unit);
        setDisposalMethod(entry.disposalMethod);
        setWasteDate(entry.date);
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
  </div>
</div>
    </TrackingDetailLayout>
  );
}
