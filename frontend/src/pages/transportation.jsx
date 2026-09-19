import TrackingDetailLayout from "./tracking-detail-layout";
import { useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { DateInput,YearPickerInput} from "@mantine/dates";
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
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const recordsPerPage = 5;
const fuelOptions =
  transportMode === "2 Wheeler"
    ? ["Petrol", "Electric"]
    : transportMode === "4 Wheeler"
    ? ["Petrol", "Diesel", "CNG", "Electric"]
    : transportMode === "Auto rickshaw"
    ? ["Petrol", "CNG","Diesel", "Electric"]
    : transportMode === "Bus"
    ? ["Diesel", "Electric"]
    : transportMode === "Train"
    ? ["Electric"]
    : [];


  const [previousEntries, setPreviousEntries] = useState([]);
  
  const filteredTrips = previousEntries.filter((trip) => {
  if (!trip.date) return false;
    console.log(selectedYear, typeof selectedYear);
  const [day, month, year] = trip.date.split("/");

  const selectedMonthNumber =
    [
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
    ].indexOf(selectedMonth) + 1;

  const monthMatch =
    !selectedMonth ||
    Number(month) === selectedMonthNumber;

  const selectedYearValue = selectedYear
  ? new Date(selectedYear).getFullYear()
  : null;

const yearMatch =
  !selectedYear ||
  Number(year) === selectedYearValue;

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
    setFuelType(null);
    setFromLocation("");
    setToLocation("");
    setDistance("");
    setEditingId(null);
    setError("");
  };

  const handleEditTrip = (trip) => {
    console.log({
  travelDate,
  transportMode,
  fuelType,
  fromLocation,
  toLocation,
  distance
});
    setEditingId(trip.id);
    const [day, month, year] = trip.date.split("/");
    setTravelDate(
  new Date(`${year}-${month}-${day}`)
      );
    setTransportMode(trip.mode);
    setFuelType(trip.fuelType || "");
    setFromLocation(trip.fromLocation || "");
    setToLocation(trip.toLocation || "");
    setDistance(trip.distance);
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
      !distance ||
      !fuelType ||
  numericDistance <= 0
      
    ) {
      setError("Please fill all required fields.");
      return;
    }

    setError("");

    const tripData = {
  date: new Date(travelDate).toLocaleDateString("en-GB"),
  mode: transportMode,
  fuelType,
  fromLocation: trimmedFrom,
  toLocation: trimmedTo,
  distance: numericDistance,
};

    if (editingId === null) {
      setPreviousEntries((prevEntries) => [
        { ...tripData, id: Date.now() },
        ...prevEntries,
      ]);
    } else {
      setPreviousEntries((prevEntries) =>
        prevEntries.map((entry) =>
          entry.id === editingId ? { ...entry, ...tripData } : entry,
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
    setTransportMode(value);
  }}
  placeholder="Select transport mode"
  data={[
    "2 Wheeler",
    "4 Wheeler",
    "Auto rickshaw",
    "Bus",
    "Train",
  ]}
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
            data={fuelOptions}
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
                  <th className="px-6 py-4 text-left text-sm font-semibold">Fuel Type</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Carbon emission</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Actions</th>
              
                </tr>
              </thead>

              <tbody>
                {currentTrips.map((trip) => (
                  <tr key={trip.id} className="border-t border-[#D7EADF]">
                    <td className="px-6 py-4">{displayDate(trip.date)}</td>
                    <td className="px-6 py-4">{trip.mode}</td>
                    <td className="px-6 py-4">{trip.distance} km</td>
                    <td className="px-6 py-4">{trip.fuelType || "N/A"}</td>
                    <td className="px-6 py-4"></td>
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
                            setPreviousEntries((prevEntries) =>
                              prevEntries.filter((item) => item.id !== trip.id),
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
