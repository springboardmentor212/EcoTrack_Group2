import TrackingDetailLayout from "./tracking-detail-layout";
import { FaBolt, FaHome, FaBuilding } from "react-icons/fa";
import { DateInput } from "@mantine/dates";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import { NumberInput } from "@mantine/core";
import { useRef, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";

const parseDate = (value) => {
  const [day, month, year] = value.split("/").map(Number);
  return new Date(year, month - 1, day);
};

const parseInputDate = (value) => {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
};

const formatInputDate = (date) => {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) return null;
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const formatDate = (date) => {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) return "";
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${day}/${month}/${date.getFullYear()}`;
};

export default function Electricity() {
    const [usageType, setUsageType] = useState("");
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
  const [consumption, setConsumption] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [previousEntries, setPreviousEntries] = useState([
    {
      id: 1,
      startDate: parseDate("01/08/2025"),
      endDate: parseDate("31/08/2025"),
      consumption: 245,
      usageType: "Home",
    },
    {
      id: 2,
      startDate: parseDate("01/07/2025"),
      endDate: parseDate("31/07/2025"),
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
    setStartDate(null);
    setEndDate(null);
    setConsumption("");
    setUsageType("");
    setEditingId(null);
  };

  const handleSave = () => {
    console.log("startDate", startDate);
console.log("endDate", endDate);
console.log("formatted endDate", formatDate(endDate));
    const numericConsumption = Number(consumption);
    if (!startDate || !endDate || numericConsumption <= 0 || !usageType) {
      window.alert("Please complete all fields with valid values.");
      console.log("startDate:", startDate);
console.log("endDate:", endDate);
      return;
    }

    const entry = {
      startDate,
      endDate,
      consumption: numericConsumption,
      usageType: usageType === "home" ? "Home" : "Business",
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
    setStartDate(entry.startDate);
    setEndDate(entry.endDate);
    setConsumption(entry.consumption);
    setUsageType(entry.usageType.toLowerCase());
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

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
                        Billing Start Date
                    </label>
                    <DateInput
                        value={formatInputDate(startDate)}
                        onChange={(value) => setStartDate(value ? parseInputDate(value) : null)}
                        valueFormat="DD/MM/YYYY"
                        styles={inputStyles}
                        placeholder="Select start date"
                        color="green"
                    />
                </div>

                <div>
                    <label className="mb-2 block text-sm font-medium text-[#173F2A]">
                        Billing End Date
                    </label>
                    <DateInput
  value={formatInputDate(endDate)}
  onChange={(value) =>
    setEndDate(value ? parseInputDate(value) : null)
  }
  valueFormat="DD/MM/YYYY"
  placeholder="Select end date"
  styles={inputStyles}
  color="green"
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
            Period
          </th>
          <th className="px-6 py-4 text-left text-sm font-semibold">
            Consumption
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
        {previousEntries.map((entry) => (
          <tr
            key={entry.id}
            className="border-t border-[#D7EADF]"
          >
            <td className="px-6 py-4">
              {formatDate(entry.startDate)} - {formatDate(entry.endDate)}
            </td>

            <td className="px-6 py-4">
              {entry.consumption} kWh
            </td>

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
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#FDF2F2] text-[#B34B4B] transition hover:bg-[#FBE5E5]"
                  onClick={() => handleDelete(entry.id)}
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