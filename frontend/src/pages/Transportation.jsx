import TrackingDetailLayout from "./tracking-detail-layout";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useState } from "react";
import { DateInput } from "@mantine/dates";
import { Select } from "@mantine/core";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import { TextInput, NumberInput } from "@mantine/core";

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
    const inputStyles = {
  input: {
    minHeight: "48px",
    border: "1px solid #D7EADF",
  },
  
};
    const [previousTrips, setPreviousTrips] = useState([
      {
        id: 1,
        date: "12/09/2025",
        mode: "Car",
        fuelType: "Petrol",
        fromLocation: "Hyderabad",
        toLocation: "Gachibowli",
        distance: 18,
        purpose: "Work",
      },
      {
        id: 2,
        date: "10/09/2025",
        mode: "Train",
        fuelType: "",
        fromLocation: "Mumbai",
        toLocation: "Pune",
        distance: 30,
        purpose: "Education",
      },
    ]);

    const clearForm = () => {
      setTravelDate(null);
      setTransportMode("");
      setFuelType("");
      setFromLocation("");
      setToLocation("");
      setDistance("");
      setTripPurpose("");
      setEditingId(null);
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
    };

    const handleAddTrip = () => {
      const numericDistance = Number(distance);
      if (!travelDate || !transportMode || numericDistance <= 0 || !tripPurpose) {
        window.alert("Please complete all required trip fields with valid values.");
        return;
      }

      const tripData = {
        date: travelDate,
        mode: transportMode,
        fuelType,
        fromLocation,
        toLocation,
        distance: numericDistance,
        purpose: tripPurpose,
      };

      if (editingId === null) {
        setPreviousTrips((prevTrips) => [
          { ...tripData, id: Date.now() },
          ...prevTrips,
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
  {/* Travel Date */}
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

  {/* Transport Mode */}
  <div>
    <label className="mb-2 block text-sm font-medium text-[#173F2A]">
      Transport Mode
    </label>

    <Select
      value={transportMode}
      onChange={setTransportMode}
      placeholder="Select transport mode"
      data={[
        "2 wheeler",
        "4 wheeler",
        "auto rickshaw",
        "bus",
        "train"
      ]}
      styles={inputStyles}
    />
  </div>

  {/* Fuel Type */}
  <div>
    <label className="mb-2 block text-sm font-medium text-[#173F2A]">
      Fuel Type
    </label>

    <Select
      value={fuelType}
      onChange={setFuelType}
      placeholder="Select fuel type"
      disabled={
        transportMode !== "2 wheeler" && transportMode !== "4 wheeler" && transportMode !== "auto rickshaw"
      }
      data={[
        "Petrol",
        "Diesel",
        "CNG",
        "Electric",
      ]}
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
    onChange={setTripPurpose}
    placeholder="Select trip purpose"
    data={[
      "Work",
      "Personal",
      "Leisure",
      "Other",
    ]}
    styles={inputStyles}
  />
</div>


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
  <div className="mb-6 flex items-center justify-between">
    <h2 className="text-xl font-semibold text-[#173F2A]">
      Previous Trips
    </h2>

    <span className="text-sm text-[#5C7064]">
      {previousTrips.length} Records
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
            Mode
          </th>

          <th className="px-6 py-4 text-left text-sm font-semibold">
            Distance
          </th>

          <th className="px-6 py-4 text-left text-sm font-semibold">
            Purpose
          </th>
          <th className="px-6 py-4 text-left text-sm font-semibold">
  Actions
</th>
        </tr>
      </thead>

      <tbody>
        {previousTrips.map((trip) => (
          <tr
            key={trip.id}
            className="border-t border-[#D7EADF]"
          >
            <td className="px-6 py-4">{displayDate(trip.date)}</td>

            <td className="px-6 py-4">{trip.mode}</td>

            <td className="px-6 py-4">
              {trip.distance} km
            </td>

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
        setPreviousTrips(
          previousTrips.filter((item) => item.id !== trip.id)
        );
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
</div>

</TrackingDetailLayout>

    );
}
