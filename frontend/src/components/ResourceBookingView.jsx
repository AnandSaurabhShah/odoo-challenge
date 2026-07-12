import React, { useState } from "react";
import {
  CalendarDays,
  Plus,
  Clock,
  User as UserIcon,
  CalendarRange,
  Trash2,
  Info,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

export default function ResourceBookingView({
  currentUser,
  bookings,
  onAddBooking,
  onCancelBooking,
}) {
  const [showForm, setShowForm] = useState(false);
  const [resourceName, setResourceName] = useState("Conference Room Alpha");
  const [category, setCategory] = useState("Meeting Room");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("11:00");
  const [purpose, setPurpose] = useState("");

  const [filterCategory, setFilterCategory] = useState("All");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!resourceName || !date || !startTime || !endTime || !purpose) return;

    onAddBooking({
      resourceName,
      category,
      bookedBy: currentUser.name,
      date,
      startTime,
      endTime,
      purpose,
      status: "Confirmed",
    });

    setPurpose("");
    setShowForm(false);
  };

  const filteredBookings = bookings.filter((b) => {
    return filterCategory === "All" || b.category === filterCategory;
  });

  const getCategoryColor = (cat) => {
    switch (cat) {
      case "Meeting Room":
        return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      case "Testing Device":
        return "bg-purple-500/10 text-purple-400 border-purple-500/20";
      case "Vehicle":
        return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      case "Specialized Tool":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      default:
        return "bg-slate-500/10 text-slate-400 border-slate-500/20";
    }
  };

  const commonResources = {
    "Meeting Room": [
      "Conference Room Alpha",
      "Meeting Studio B",
      "Executive Boardroom",
      "Huddle Cabin 3",
    ],
    "Testing Device": [
      "High-Speed Testing Rig B",
      "Oscilloscope Cluster 1",
      "RF Anechoic Chamber",
      "IoT Stress Testing Bench",
    ],
    Vehicle: [
      "Operations Transit Van 2",
      "Fleet EV Sedan 4",
      "Heavy Logistics Truck 1",
    ],
    "Specialized Tool": [
      "3D Printer Core-X",
      "CNC Milling Station",
      "Laser Cutter Array",
    ],
  };

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1
            id="booking-title"
            className="text-xl font-bold text-white tracking-tight"
          >
            Resource Booking
          </h1>
          <p className="text-xs text-slate-400">
            Reserve company conference rooms, testing hardware rigs, vehicles,
            and shared equipment.
          </p>
        </div>
        <button
          id="btn-trigger-booking"
          onClick={() => {
            setShowForm(true);
            // set default resources based on category
            const defaults = commonResources[category];
            if (defaults) setResourceName(defaults[0]);
          }}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition-all self-end sm:self-auto shadow-lg shadow-blue-500/20"
        >
          <CalendarDays className="h-4 w-4" />
          Reserve Shared Asset
        </button>
      </div>

      {/* Booking Modal Form */}
      {showForm && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-slate-850 border border-slate-700 rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex justify-between items-center pb-4 border-b border-slate-800 mb-4">
              <div className="flex items-center gap-2">
                <CalendarRange className="h-5 w-5 text-emerald-400" />
                <h3 className="text-base font-bold text-white">
                  Resource Reservation Form
                </h3>
              </div>
              <button
                onClick={() => setShowForm(false)}
                className="text-slate-400 hover:text-white text-xl"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Asset Classification
                </label>
                <select
                  id="book-category-select"
                  value={category}
                  onChange={(e) => {
                    const catVal = e.target.value;
                    setCategory(catVal);
                    const list = commonResources[catVal];
                    if (list) setResourceName(list[0]);
                  }}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2 px-3 text-xs text-white focus:outline-none"
                >
                  <option value="Meeting Room">Meeting Room / Space</option>
                  <option value="Testing Device">
                    Testing Device / Hardware Rig
                  </option>
                  <option value="Vehicle">Vehicle / Transport</option>
                  <option value="Specialized Tool">
                    Specialized Tool / Fabrication
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Select Shared Resource
                </label>
                <select
                  id="book-resource-select"
                  value={resourceName}
                  onChange={(e) => setResourceName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2 px-3 text-xs text-white focus:outline-none"
                >
                  {commonResources[category]?.map((res) => (
                    <option key={res} value={res}>
                      {res}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-3 sm:col-span-1">
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Date
                  </label>
                  <input
                    id="book-date"
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2 px-3 text-xs text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Start Time
                  </label>
                  <input
                    id="book-start-time"
                    type="time"
                    required
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2 px-3 text-xs text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    End Time
                  </label>
                  <input
                    id="book-end-time"
                    type="time"
                    required
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2 px-3 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Reservation Purpose
                </label>
                <input
                  id="book-purpose"
                  type="text"
                  required
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  placeholder="e.g., Q3 Project Demo & Client Stress Testing"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl py-2 px-3 text-xs text-white placeholder-slate-500 focus:outline-none"
                />
              </div>

              <div className="pt-2 border-t border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  id="btn-save-booking"
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl"
                >
                  Create Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Filter Category Bar */}
      <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800 max-w-md">
        <button
          onClick={() => setFilterCategory("All")}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${filterCategory === "All" ? "bg-slate-800 text-white border border-slate-700/50" : "text-slate-400 hover:text-slate-200"}`}
        >
          All Resources
        </button>
        <button
          onClick={() => setFilterCategory("Meeting Room")}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${filterCategory === "Meeting Room" ? "bg-blue-600/15 text-blue-400 border border-blue-500/20" : "text-slate-400 hover:text-slate-200"}`}
        >
          Rooms
        </button>
        <button
          onClick={() => setFilterCategory("Testing Device")}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${filterCategory === "Testing Device" ? "bg-purple-600/15 text-purple-400 border border-purple-500/20" : "text-slate-400 hover:text-slate-200"}`}
        >
          Devices
        </button>
        <button
          onClick={() => setFilterCategory("Vehicle")}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${filterCategory === "Vehicle" ? "bg-amber-600/15 text-amber-400 border border-amber-500/20" : "text-slate-400 hover:text-slate-200"}`}
        >
          Fleet
        </button>
      </div>

      {/* Booking Reservation Cards Grid */}
      {filteredBookings.length === 0 ? (
        <div className="py-16 text-center bg-slate-800/10 border border-dashed border-slate-800 rounded-2xl">
          <Info className="h-10 w-10 text-slate-600 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-400">No Booking Found</h3>
          <p className="text-xs text-slate-500 mt-1">
            There are no reservations listed under this classification.
          </p>
        </div>
      ) : (
        <div
          id="bookings-list"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {filteredBookings.map((book) => (
            <div
              key={book.id}
              className="bg-slate-800/40 border border-slate-700/40 rounded-2xl p-5 flex flex-col justify-between hover:border-slate-600 transition-all relative overflow-hidden shadow"
            >
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold border ${getCategoryColor(book.category)}`}
                  >
                    {book.category}
                  </span>

                  {book.status === "Confirmed" ? (
                    <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-semibold bg-emerald-500/5 px-2 py-0.5 rounded border border-emerald-500/15">
                      <CheckCircle2 className="h-3 w-3" />
                      Active
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-[11px] text-slate-500 font-semibold bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                      <AlertCircle className="h-3 w-3" />
                      Cancelled
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="text-sm font-bold text-white leading-tight">
                    {book.resourceName}
                  </h3>
                  <p className="text-xs text-slate-400 italic mt-1.5">
                    "{book.purpose}"
                  </p>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-800/60 space-y-2.5 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <Clock className="h-3.5 w-3.5 text-slate-500" />
                  <span>
                    {book.date} &bull;{" "}
                    <strong className="text-white">
                      {book.startTime} - {book.endTime}
                    </strong>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <UserIcon className="h-3.5 w-3.5 text-slate-500" />
                  <span>Reserved by {book.bookedBy}</span>
                </div>
              </div>

              {book.status === "Confirmed" && (
                <button
                  id={`btn-cancel-book-${book.id}`}
                  onClick={() => onCancelBooking(book.id)}
                  className="mt-4 w-full py-1.5 bg-slate-900 hover:bg-rose-950/20 text-slate-400 hover:text-rose-400 rounded-lg text-xs font-semibold border border-slate-800 hover:border-rose-500/20 transition-all flex items-center justify-center gap-1.5"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Cancel Reservation
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
