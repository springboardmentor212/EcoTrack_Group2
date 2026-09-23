import TrackingDetailLayout from "./tracking-detail-layout";
import { useEffect, useState } from "react";
import { FaTrash, FaEdit } from "react-icons/fa";
import axios from "axios";

import { NumberInput, Select } from "@mantine/core";
import { DateInput, YearPickerInput } from "@mantine/dates";

import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";

// CHANGE: waste type dropdown — display label vs. backend value.
const WASTE_TYPES = [
  { value: "wet waste", label: "Wet Waste" },
  { value: "dry waste", label: "Dry Waste" },
  { value: "e waste", label: "E-Waste" },
];

// CHANGE: disposal methods depend on waste type; each entry pairs the
// backend value with its display label.
const DISPOSAL_METHODS = {
  "wet waste": [
    { value: "composting", label: "Composting" },
    { value: "landfill", label: "Landfill" },
  ],
  "dry waste": [
    { value: "recycled", label: "Recycled" },
    { value: "burned", label: "Burned" },
    { value: "landfill", label: "Landfill" },
  ],
  "e waste": [
    { value: "recycled", label: "Recycled" },
    { value: "burned", label: "Burned" },
    { value: "landfill", label: "Landfill" },
  ],
};
const now = new Date();

const currentYear = now.getFullYear();

const currentMonth = [
  "jan",
  "feb",
  "mar",
  "apr",
  "may",
  "jun",
  "jul",
  "aug",
  "sep",
  "oct",
  "nov",
  "dec",
][now.getMonth()];

// CHANGE: helpers to render friendly labels in the table from stored values.
const labelFor = (options, value) =>
  options.find((option) => option.value === value)?.label || value;

export default function WasteManagement() {
  const CARBON_ACTIVITY = import.meta.env.VITE_CARBON_ACTIVITY;
  const [wasteAmount, setWasteAmount] = useState(null);
  const [disposalMethod, setDisposalMethod] = useState(null);

  const [wasteDate, setWasteDate] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [wasteType, setWasteType] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [selectedYear, setSelectedYear] = useState(new Date(currentYear, 0, 1));
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [formKey, setFormKey] = useState(0);

  const [loading, setLoading] = useState(false);

  const recordsPerPage = 5;
  // CHANGE: wasteType state now holds the backend value (e.g. "wet waste"),
  // so look disposal options up directly from the map.
  const disposalOptions = DISPOSAL_METHODS[wasteType] || [];
  const [previousEntries, setPreviousEntries] = useState([]);
  // CHANGE: maps a raw API record ({ _id, date, emission, waste: {...} })
  // into the flat shape the table/edit logic below expects.
  const mapActivity = (item) => ({
    id: item._id,
    date: item.date,
    amount: item.waste.wasteAmount,
    wasteType: item.waste.wasteType,
    disposalMethod: item.waste.disposalMethod,
    emission: item.emission,
    carbonSave: item.waste.carbonSave,
  });

  // CHANGE: GET /waste?month=...&year=... — fetches and stores previousEntries.
  const fetchWasteActivities = async () => {
    try {
      const params = {};
      if (selectedMonth) params.month = selectedMonth;
      if (selectedYear) params.year = new Date(selectedYear).getFullYear();

      const response = await axios.get(`${CARBON_ACTIVITY}/waste`, {
        params,
        withCredentials: true,
      });

      if (response.data.success) {
        setPreviousEntries(response.data.wasteActivity.map(mapActivity));
      }
    } catch (error) {
      setError(
        error.response?.data?.message || "Failed to load waste activities",
      );
    }
  };

  // CHANGE: fetch on initial load, and again whenever month/year filters change.
  useEffect(() => {
    fetchWasteActivities();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedMonth, selectedYear]);

  const handleAddEntry = async () => {
    if (loading) return;

    if (
      wasteAmount === "" ||
      Number(wasteAmount) <= 0 ||
      !wasteType ||
      !disposalMethod ||
      !wasteDate
    ) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      const payload = {
        category: "waste",
        date: new Date(wasteDate).toISOString().split("T")[0],
        waste: {
          wasteType,
          wasteAmount: Number(wasteAmount),
          disposalMethod,
        },
      };

      let response;

      if (editingId) {
        response = await axios.patch(
          `${CARBON_ACTIVITY}/waste`,
          {
            id: editingId,
            ...payload,
          },
          { withCredentials: true },
        );
      } else {
        response = await axios.post(`${CARBON_ACTIVITY}/waste`, payload, {
          withCredentials: true,
        });
      }

      if (response.data.success) {
        clearForm();
        // CHANGE: refresh from the backend instead of hand-building local state.
        await fetchWasteActivities();
      }
    } catch (error) {
      setError(
        error.response?.data?.message || "Failed to save waste activity",
      );
    } finally {
      setLoading(false);
    }
  };

  const inputStyles = {
    input: {
      minHeight: "48px",
      border: "1px solid #D7EADF",
    },
  };
  const clearForm = () => {
    setWasteAmount("");
    setWasteType(null);
    setDisposalMethod(null);
    setWasteDate(null);
    setEditingId(null);
    setError("");
    setFormKey((prev) => prev + 1);
  };

  // CHANGE: DELETE ${CARBON_ACTIVITY}/${activityId}, then refresh from backend.
  const handleDelete = async (entryId) => {
    setError("");
    try {
      const response = await axios.delete(`${CARBON_ACTIVITY}/${entryId}`, {
        withCredentials: true,
      });

      if (response.data.success) {
        if (editingId === entryId) clearForm();
        await fetchWasteActivities();
      }
    } catch (error) {
      setError(
        error.response?.data?.message || "Failed to delete waste activity",
      );
    }
  };
  // CHANGE: month/year filtering now happens server-side via fetchWasteActivities'
  // query params, so previousEntries is already the filtered set. Keeping the name
  // "filteredEntries" avoids touching the JSX below that references it.
  const filteredEntries = previousEntries;
  const totalPages = Math.ceil(filteredEntries.length / recordsPerPage);

  const startIndex = (currentPage - 1) * recordsPerPage;

  const currentEntries = filteredEntries.slice(
    startIndex,
    startIndex + recordsPerPage,
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
            Waste Amount (kg)
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
            Waste type
          </label>

          <Select
            key={`waste-type-${formKey}`}
            value={wasteType}
            onChange={(value) => {
              // CHANGE: reset disposal method when waste type changes, since its
              // options depend on wasteType and a stale value could persist.
              setWasteType(value);
              setDisposalMethod(null);
            }}
            placeholder="Select waste type"
            data={WASTE_TYPES}
            styles={inputStyles}
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-[#173F2A]">
            Disposal Method
          </label>

          <Select
            key={`disposal-method-${formKey}`}
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
            minDate={new Date(2000, 0, 1)}
            maxDate={new Date()}
            styles={inputStyles}
          />
        </div>
      </div>
      {error && (
        <p className="mb-4 text-sm font-medium text-red-500">{error}</p>
      )}

      <div className="mt-8 flex gap-4">
        <button
          type="button"
          onClick={handleAddEntry}
          disabled={loading}
          className={`rounded-xl border border-[#27834D] px-6 py-3 font-medium text-[#27834D] transition hover:bg-[#27834D] hover:text-white ${
            loading ? "cursor-not-allowed opacity-50" : ""
          }`}
        >
          {loading ? "Saving..." : editingId ? "Update Entry" : "Add Entry"}
        </button>

        <button
          type="button"
          onClick={clearForm}
          disabled={loading}
          className={`rounded-xl border border-[#27834D] px-6 py-3 font-medium text-[#27834D] transition hover:bg-[#27834D] hover:text-white ${
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
              minDate={new Date(2000, 0, 1)}
              maxDate={new Date(currentYear, 11, 31)}
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
                  <th className="px-6 py-3 text-left text-sm font-semibold">
                    Date
                  </th>

                  <th className="px-6 py-3 text-left text-sm font-semibold">
                    Waste Amount
                    <br></br>
                    (kg)
                  </th>

                  <th className="px-6 py-3 text-left text-sm font-semibold">
                    Waste Type
                  </th>

                  <th className="px-6 py-3 text-left text-sm font-semibold">
                    Disposal Method
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">
                    Carbon Emission
                    <br></br>
                    (kg CO₂e)
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">
                    Carbon Saved
                    <br></br>(kg CO₂e)
                  </th>

                  <th className="px-3 py-3 text-left text-sm font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {currentEntries.map((entry) => (
                  <tr key={entry.id} className="border-t border-[#D7EADF]">
                    {/* CHANGE: entry.date is an ISO string from the API; format for display. */}
                    <td className="px-6 py-4">
                      {entry.date
                        ? new Date(entry.date).toLocaleDateString("en-GB")
                        : "-"}
                    </td>

                    <td className="px-6 py-4">{entry.amount}</td>

                    <td className="px-6 py-4">
                      {/* CHANGE: show the friendly label for the stored backend value. */}
                      {labelFor(WASTE_TYPES, entry.wasteType)}
                    </td>

                    <td className="px-6 py-4">
                      <span className="rounded-full bg-[#EEF7F0] px-3 py-1 text-sm text-[#27834D]">
                        {/* CHANGE: show the friendly label for the stored backend value. */}
                        {labelFor(
                          DISPOSAL_METHODS[entry.wasteType] || [],
                          entry.disposalMethod,
                        )}
                      </span>
                    </td>
                    {/* CHANGE: display backend-computed emission/carbon-saved instead of blank cells. */}
                    <td className="px-6 py-4">
                      {typeof entry.emission === "number"
                        ? entry.emission.toFixed(2)
                        : "-"}
                    </td>
                    <td className="px-6 py-4">
                      {typeof entry.carbonSave === "number"
                        ? entry.carbonSave.toFixed(2)
                        : "-"}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-3">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingId(entry.id);
                            setWasteAmount(entry.amount);
                            setDisposalMethod(entry.disposalMethod);
                            // CHANGE: entry.date is now an ISO date string from the API.
                            setWasteDate(new Date(entry.date));
                            setWasteType(entry.wasteType);
                          }}
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

                {Array.from({ length: Math.min(5, totalPages) }, (_, index) => {
                  const pageNumber =
                    Math.max(1, Math.min(currentPage - 2, totalPages - 4)) +
                    index;

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
                })}

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
