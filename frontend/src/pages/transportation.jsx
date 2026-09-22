import TrackingDetailLayout from "./tracking-detail-layout";
import { useState,useEffect } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { DateInput,YearPickerInput} from "@mantine/dates";
import { Select, TextInput, NumberInput } from "@mantine/core";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import axios from "axios";

const now = new Date();

const currentYear = now.getFullYear();

const MIN_YEAR = 2000;
const minYearDate = new Date(MIN_YEAR, 0, 1);
const maxYearDate = new Date(currentYear, 11, 31);

const currentMonth = [
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
][now.getMonth()];


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
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);

const [selectedYear, setSelectedYear] = useState(
  new Date(currentYear, 0, 1)
);
  const [currentPage, setCurrentPage] = useState(1);
  
  const [loading, setLoading] = useState(false);

  const recordsPerPage = 5;
const fuelOptions =
  transportMode === "2 wheeler"
    ? [
        { value: "petrol", label: "Petrol" },
        { value: "electric", label: "Electric" },
      ]
    : transportMode === "4 wheeler"
    ? [
        { value: "petrol", label: "Petrol" },
        { value: "diesel", label: "Diesel" },
        { value: "cng", label: "CNG" },
        { value: "electric", label: "Electric" },
      ]
    : transportMode === "auto rickshaw"
    ? [
        { value: "petrol", label: "Petrol" },
        { value: "diesel", label: "Diesel" },
        { value: "cng", label: "CNG" },
        { value: "electric", label: "Electric" },
      ]
    : transportMode === "bus"
    ? [
        { value: "diesel", label: "Diesel" },
        { value: "electric", label: "Electric" },
      ]
    : transportMode === "train"
    ? [
        { value: "electric", label: "Electric" },
      ]
    : [];


  const [previousEntries, setPreviousEntries] = useState([]);
  const CARBON_ACTIVITY = import.meta.env.VITE_CARBON_ACTIVITY;
  const fetchTransportationActivities = async (
  month = currentMonth,
  year = currentYear
) => {
  try {
    const response = await axios.get(
      `${CARBON_ACTIVITY}/transportation?month=${month}&year=${year}`,
      {
        withCredentials: true,
      }
    );

    if (response.data.success) {
      setPreviousEntries(
        response.data.transporatationActivity || []
      );
    }
  } catch (error) {
    console.error(error);
  }
};
  const filteredTrips = previousEntries.filter((trip) => {
  if (!trip.date) return false;
    
const [year, month, day] = trip.date.split("-");
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
  setEditingId(trip._id);

  const [year, month, day] = trip.date.split("-");

  setTravelDate(
    new Date(`${year}-${month}-${day}`)
  );

  setTransportMode(
    trip.transportation?.transportMode || ""
  );

  setFuelType(
    trip.transportation?.fuelType || ""
  );

  setFromLocation(
    trip.transportation?.from || ""
  );

  setToLocation(
    trip.transportation?.to || ""
  );

  setDistance(
    trip.transportation?.distance || ""
  );

  setError("");
};
useEffect(() => {
    fetchTransportationActivities();
  }, []);
  
  const handleAddTrip = async () => {

    console.log("loading =", loading);
    
    if (loading) return;

    
    try {
      

      const trimmedFrom = fromLocation.trim();
      const trimmedTo = toLocation.trim();
      const numericDistance = Number(distance);
      

      if (
  !travelDate ||
  !transportMode ||
  !trimmedFrom ||
  !trimmedTo ||
  !fuelType ||
  numericDistance <= 0
) {
        
        setError("Please fill all required fields.");
        
        return;
      }
      setLoading(true);

      setError("");
      
console.log(typeof travelDate);
console.log(travelDate);
      const payload = {
  category: "transportation",
  date: travelDate.toISOString().split("T")[0],
  transportation: {
    transportMode,
    distance: numericDistance,
    fuelType,
    from: trimmedFrom,
    to: trimmedTo,
  },
};
console.log("About to send POST");
console.log(payload);
let response;

if (editingId) {
  response = await axios.patch(
    `${CARBON_ACTIVITY}/transportation`,
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
    `${CARBON_ACTIVITY}/transportation`,
    payload,
    {
      withCredentials: true,
    }
  );
}

if (response.data.success) {
  clearForm();
  fetchTransportationActivities();
}

    }
catch (error) {
    setError(
      error.response?.data?.message ||
      "Failed to save transportation activity"
    );
  } finally {
    setLoading(false);
  }
};

      /*if (editingId === null) {
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
      }*/

      
   
const handleDeleteTrip = async (tripId) => {
  try {
    const response = await axios.delete(
      `${CARBON_ACTIVITY}/${tripId}`,
      {
        withCredentials: true,
      }
    );

    if (response.data.success) {
      fetchTransportationActivities();

      if (editingId === tripId) {
        clearForm();
      }
    }
  } catch (error) {
    setError(
      error.response?.data?.message ||
        "Failed to delete transportation activity"
    );
  }
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
            minDate={new Date(2000, 0, 1)}
  maxDate={new Date()}
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
  setFuelType("");
}}
  placeholder="Select transport mode"
  data={[
  { value: "2 wheeler", label: "2 Wheeler" },
  { value: "4 wheeler", label: "4 Wheeler" },
  { value: "auto rickshaw", label: "Auto Rickshaw" },
  { value: "bus", label: "Bus" },
  { value: "train", label: "Train" },
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
          
          disabled={loading}
          
          className={`rounded-xl border border-[#27834D] px-6 py-3 font-medium text-[#27834D] transition hover:bg-[#27834D] hover:text-white ${
            loading ? "cursor-not-allowed opacity-50" : ""
          }`}
        >
          
          {loading ? "Saving..." : editingId === null ? "Add Entry" : "Update Entry"}
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
      if (value) {
        const pickedYear = new Date(value).getFullYear();
        if (pickedYear > currentYear || pickedYear < MIN_YEAR) {
          return;
        }
      }
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
                  <th className="px-6 py-4 text-left text-sm font-semibold">Distance (km)</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Fuel Type</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Carbon Emission (kg CO₂e)</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold">Actions</th>
              
                </tr>
              </thead>

              <tbody>
                {currentTrips.map((trip) => (
                  <tr key={trip._id} className="border-t border-[#D7EADF]">
                    <td className="px-6 py-4">{displayDate(trip.date)}</td>
                    <td className="px-6 py-4">{trip.transportation.transportMode}</td>
                    <td className="px-6 py-4">{trip.transportation.distance} km</td>
                    <td className="px-6 py-4">{trip.transportation?.fuelType || "N/A"}</td>
                    <td className="px-6 py-4"> {trip.emission ?? "N/A"}</td>
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
                          onClick={() => handleDeleteTrip(trip._id)}
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