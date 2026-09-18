import TrackingDetailLayout from "./tracking-detail-layout";
import { useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { DateInput } from "@mantine/dates";
import { Select, TextInput, NumberInput } from "@mantine/core";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";

const toInputDate = (date) => {
  if (!date) return null;
  if (/^\d{4}-\d{2}-\d{2}$/.test(date)) return date;
  const [day, month, year] = date.split("/");
  return `${year}-${month}-${day}`;
};

const displayDate = (date) => {
  if (!date) return "";
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(date)) return date;
  const [year, month, day] = date.split("-");
  return `${day}/${month}/${year}`;
};

export default function Transportation() {
  const [travelDate, setTravelDate] = useState(null);
  const [transportMode, setTransportMode] = useState("");
  const [distance, setDistance] = useState("");
  const [fromLocation, setFromLocation] = useState("");
  const [toLocation, setToLocation] = useState("");
  const [fuelType, setFuelType] = useState("");
  const [tripPurpose, setTripPurpose] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("All");
  const [selectedYear, setSelectedYear] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  const recordsPerPage = 5;
  const fuelRequiredModes = ["2 wheeler", "4 wheeler", "auto rickshaw"];

  const [previousEntries, setPreviousEntries] = useState([]);

  const filteredTrips = previousEntries.filter((trip) => {
    const tripDateParts = trip.date.split("/");
    const monthMatch =
      selectedMonth === "All" || tripDateParts[1] === selectedMonth;
    const yearMatch =
      selectedYear === "All" || tripDateParts[2] === selectedYear;

    return monthMatch && yearMatch;
  });

  const totalPages = Math.ceil(filteredTrips.length / recordsPerPage);
  const pageCount = totalPages || 1;
  const startIndex = (currentPage - 1) * recordsPerPage;
  const currentTrips = filteredTrips.slice(startIndex, startIndex + recordsPerPage);

  const inputStyles = {
    input: {
      minHeight: "48px",
      border: "1px solid #D7EADF",
    },
  };

  const clearForm = () => {
    setTravelDate(null);
    setTransportMode(null);
    setFuelType("");
    setFromLocation("");
    setToLocation("");
    setDistance("");
    setTripPurpose("");
    setEditingId(null);
    setError("");
  };

  const handleEditTrip = (trip) => {
    setEditingId(trip.id);
    setTravelDate(toInputDate(trip.date));
    setTransportMode(trip.mode);
    setFuelType(trip.fuelType || "");
    setFromLocation(trip.fromLocation || "");
    setToLocation(trip.toLocation || "");
    setDistance(trip.distance);
    setTripPurpose(trip.purpose);
    setError("");
  };

  const handleAddTrip = () => {
    const trimmedFrom = fromLocation.trim();
    const trimmedTo = toLocation.trim();
    const numericDistance = Number(distance);

    if (
      !travelDate ||
      !transportMode ||
      !trimmedFrom ||
      !trimmedTo ||
      !tripPurpose ||
      !distance ||
      numericDistance <= 0 ||
      (fuelRequiredModes.includes(transportMode) && !fuelType)
    ) {
      setError("Please fill all required fields.");
      return;
    }

    setError("");

    const tripData = {
      date: new Date(travelDate).toLocaleDateString("en-GB"),
      mode: transportMode,
      fuelType: fuelRequiredModes.includes(transportMode) ? fuelType : "",
      fromLocation: trimmedFrom,
      toLocation: trimmedTo,
      distance: numericDistance,
      purpose: tripPurpose,
    };

    if (editingId === null) {
      setPreviousEntries((prevEntries) => [
        { ...tripData, id: Date.now() },
        ...prevEntries,
      ]);
    } else {
      setPreviousTrips((prevTrips) =>
        prevTrips.map((trip) =>
          trip.id === editingId ? { ...trip, ...tripData } : trip,
        ),
      );
    }

    clearForm();
  };

  return (
    <TrackingDetailLayout
      breadcrumbLabel="Transportation"
      title="Transportation Tracking"
      subtitle="Track your travel activities and calculate transportation-related emissions."
    >
      <div className="grid gap-6 md:grid-cols-3">
        <div>
          <label className="mb-2 block text-sm font-medium text-[#173F2A]">
            Travel Date
          </label>

          <DateInput
            value={travelDate}
            onChange={setTravelDate}
            valueFormat="DD/MM/YYYY"
            placeholder="Select travel date"
            color="green"
            styles={inputStyles}
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-[#173F2A]">
            Transport Mode
          </label>

          <Select
            value={transportMode}
            onChange={(value) => {
              setTransportMode(value || "");
              if (value && !fuelRequiredModes.includes(value)) {
                setFuelType("");
              }
              setError("");
            }}
            placeholder="Select transport mode"
            data={["2 wheeler", "4 wheeler", "auto rickshaw", "bus", "train"]}
            styles={inputStyles}
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-[#173F2A]">
            Fuel Type
          </label>

          <Select
            value={fuelType}
            onChange={(value) => {
              setFuelType(value || "");
              setError("");
            }}
            placeholder="Select fuel type"
            disabled={!fuelRequiredModes.includes(transportMode)}
            data={["Petrol", "Diesel", "CNG", "Electric"]}
            styles={inputStyles}
          />
        </div>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-3">
        <div>
          <label className="mb-2 block text-sm font-medium text-[#173F2A]">
            From
          </label>

          <TextInput
            value={fromLocation}
            onChange={(e) => setFromLocation(e.target.value)}
            placeholder="Starting location"
            styles={inputStyles}
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-[#173F2A]">
            To
          </label>

          <TextInput
            value={toLocation}
            onChange={(e) => setToLocation(e.target.value)}
            placeholder="Destination"
            styles={inputStyles}
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-[#173F2A]">
            Distance (km)
          </label>

          <NumberInput
            value={distance}
            onChange={setDistance}
            placeholder="Enter distance"
            hideControls
            styles={inputStyles}
          />
        </div>
      </div>

      <div className="mt-6">
        <label className="mb-2 block text-sm font-medium text-[#173F2A]">
          Trip Purpose
        </label>

        <Select
          value={tripPurpose}
          onChange={(value) => {
            setTripPurpose(value || "");
            setError("");
          }}
          placeholder="Select trip purpose"
          data={["Work", "Personal", "Leisure", "Other"]}
          styles={inputStyles}
        />
      </div>

      {error && (
        <p className="mt-2 text-sm text-red-500">{error}</p>
      )}

      <div className="mt-8 flex gap-4">
        <button
          type="button"
          onClick={handleAddTrip}
          className="rounded-xl border border-[#27834D] px-6 py-3 font-medium text-[#27834D] transition hover:bg-[#27834D] hover:text-white"
        >
          {editingId === null ? "Add Entry" : "Update Entry"}
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
              Previous Trips
            </h2>

            <span className="text-sm text-[#5C7064]">
              {filteredTrips.length} Records
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
                  setSelectedMonth(value || "All");
                  setCurrentPage(1);
                }}
                placeholder="All"
                w={120}
                data={[
                  "All",
                  "01",
                  "02",
                  "03",
                  "04",
                  "05",
                  "06",
                  "07",
                  "08",
                  "09",
                  "10",
                  "11",
                  "12",
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
                  setSelectedYear(value || "All");
                  setCurrentPage(1);
                }}
                placeholder="All"
                w={120}
                data={["All", "2024", "2025", "2026"]}
              />
            </div>
          </div>
        </div>

        {currentTrips.length === 0 ? (
          <div className="rounded-2xl border border-[#D7EADF] p-8 text-center">
            <p className="text-lg font-medium text-[#173F2A]">
        No entries found
      </p>

      <p className="mt-2 text-sm text-[#5C7064]">
        Add your first trip record to get started.
      </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-[#D7EADF]">
            <table className="w-full">
              <thead className="bg-[#EEF7F0]">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Date</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Mode</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Distance</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Purpose</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Actions</th>
                </tr>
              </thead>

              <tbody>
                {currentTrips.map((trip) => (
                  <tr key={trip.id} className="border-t border-[#D7EADF]">
                    <td className="px-6 py-4">{displayDate(trip.date)}</td>
                    <td className="px-6 py-4">{trip.mode}</td>
                    <td className="px-6 py-4">{trip.distance} km</td>
                    <td className="px-6 py-4">
                      <span className="rounded-full bg-[#EEF7F0] px-3 py-1 text-sm text-[#27834D]">
                        {trip.purpose}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-3">
                        <button
                          type="button"
                          onClick={() => handleEditTrip(trip)}
                          className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#EEF7F0] text-[#27834D] transition hover:bg-[#DFF3E6]"
                        >
                          <FaEdit />
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setPreviousTrips((prevTrips) =>
                              prevTrips.filter((item) => item.id !== trip.id),
                            );
                            if (editingId === trip.id) {
                              clearForm();
                            }
                          }}
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
        )}

        {currentTrips.length > 0 && totalPages > 1 && (
          <div className="mt-6 flex justify-center gap-2">
            {currentPage > 1 && (
              <button
                type="button"
                onClick={() => setCurrentPage((prev) => prev - 1)}
                className="rounded border px-3 py-1"
              >
                {"<"}
              </button>
            )}

            {Array.from({ length: Math.min(5, totalPages) }, (_, index) => {
              const startPage = Math.max(1, Math.min(currentPage - 2, totalPages - 4));
              const pageNumber = startPage + index;

              if (pageNumber > totalPages) return null;

              return (
                <button
                  key={pageNumber}
                  type="button"
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
                type="button"
                onClick={() => setCurrentPage((prev) => prev + 1)}
                className="rounded border px-3 py-1"
              >
                {">"}
              </button>
            )}
          </div>
        )}
      </div>
    </TrackingDetailLayout>
  );
}
