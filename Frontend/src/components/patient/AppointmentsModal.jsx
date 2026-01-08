import React, { useEffect, useState } from "react";
import { images, icons } from "../../assets/assets";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useAuth } from "../../Context/AuthContext";
import { BASE_URL } from "../../config/config.js"
import DoctorProfileModal from "../DoctorProfileModal.jsx";
import Loader from "../../Pages/admin/Loader.jsx";

const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
const hours = [
  "12 AM", "1 AM", "2 AM", "3 AM", "4 AM", "5 AM", "6 AM", "7 AM",
  "8 AM", "9 AM", "10 AM", "11 AM", "12 PM", "1 PM", "2 PM", "3 PM",
  "4 PM", "5 PM", "6 PM", "7 PM", "8 PM", "9 PM", "10 PM", "11 PM",
];

const formatDateYYYYMMDD = (d) => {
  const tzOffset = d.getTimezoneOffset() * 60000;
  const localISO = new Date(d - tzOffset).toISOString().slice(0, 10);
  return localISO;
};

const AppointmentsModal = ({ onClose }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [calendarStartDate, setCalendarStartDate] = useState(new Date());
  const [showForm, setShowForm] = useState(false);
  const [doctorsData, setDoctorsData] = useState([]);

  // Form state 
  const [age, setAge] = useState("");
  const [reason, setReason] = useState("");
  const [doctor, setDoctor] = useState("");
  const [doctorId, setDoctorId] = useState(null);
  const [timeSlot, setTimeSlot] = useState("");
  const [consultationType, setConsultationType] = useState("")
  const [showDoctorsPopup, setShowDoctorsPopup] = useState(false);
  const [reviewPopup, setReviewPopup] = useState(false);
  const [selectedTimeSlots, setSelectedTimeSlots] = useState({});

  // Feedback states
  const [selectedDoctorProfileId, setSelectedDoctorProfileId] = useState("")
  const [selectedDoctorForReview, setSelectedDoctorForReview] = useState("");
  const [doctorReviews, setDoctorReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [openDoctorProfile, setOpenDoctorProfile] = useState(false)
  const [doctorRatings, setDoctorRatings] = useState({});

  // loaded appointments for the week
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [bookingInProgress, setBookingInProgress] = useState(false);
  const [userActions, setUserActions] = useState({});
  const [bookedSlots, setBookedSlots] = useState({});
  const { uid, user, userName, isProfileAdded } = useAuth();
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [filteredSpecialization, setFilteredSpecialization] = useState('')

  const displayName =
    Array.isArray(user) && user.length
      ? user.join('')
      : user || userName || '';
  // Get first day of month
  const getMonthDates = () => {
    const firstDay = new Date(currentYear, currentMonth, 1);
    const startDay = firstDay.getDay(); // Sunday = 0

    // Always display 6 rows → 42 days
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();

    const calendarDays = [];
    for (let i = startDay - 1; i >= 0; i--) {
      calendarDays.push({
        date: new Date(currentYear, currentMonth - 1, daysInPrevMonth - i),
        isCurrentMonth: false
      });
    }

    // Days of current month
    for (let i = 1; i <= daysInMonth; i++) {
      calendarDays.push({
        date: new Date(currentYear, currentMonth, i),
        isCurrentMonth: true
      });
    }

    // Remaining days from next month
    while (calendarDays.length < 42) {
      const nextDay = calendarDays.length - (startDay + daysInMonth) + 1;
      calendarDays.push({
        date: new Date(currentYear, currentMonth + 1, nextDay),
        isCurrentMonth: false
      });
    }
    return calendarDays;
  };

  const monthDates = getMonthDates();
  const prevMonth = () => {
    setCurrentMonth(prev => {
      if (prev === 0) {
        setCurrentYear(y => y - 1);
        return 11;
      }
      return prev - 1;
    });
  };
  const nextMonth = () => {
    setCurrentMonth(prev => {
      if (prev === 11) {
        setCurrentYear(y => y + 1);
        return 0;
      }
      return prev + 1;
    });
  };
  // Helper to convert "8 AM" etc. to 24h number
  const to24Hour = (time) => {
    const [hour, meridian] = time.split(" ");
    let h = parseInt(hour);
    if (meridian === "PM" && h !== 12) h += 12;
    if (meridian === "AM" && h === 12) h = 0;
    return h;
  };

  // Check if a date is today
  const isToday = (date) => {
    const today = new Date();
    return (
      date.getFullYear() === today.getFullYear() &&
      date.getMonth() === today.getMonth() &&
      date.getDate() === today.getDate()
    );
  };

  // Compute the week array based on selectedDate (Sunday-start)
  const getWeekDates = () => {
    const start = new Date(selectedDate);
    start.setDate(start.getDate() - start.getDay());
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(start);
      d.setDate(d.getDate() + i);
      return d;
    });
  };

  const weekDates = getWeekDates();

  // Fetch appointments  
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${BASE_URL}/appointments/fetch_all_appointments/${uid}`);
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setAppointments(data.data);
      } catch (err) {
        console.error("fetchAppointments error:", err);
        setAppointments([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [selectedDate, uid]);

  const filteredAppointment = appointments
  const appointmentMap = filteredAppointment.reduce((acc, a) => {
    const appointmentDate = new Date(a.date);
    const dateKey = formatDateYYYYMMDD(appointmentDate);
    const key = `${dateKey}_${a.timeSlot}`;

    if (!acc[key]) acc[key] = [];
    acc[key].push(a);
    return acc;
  }, {});

  // Determine available hours based on selected date
  const getAvailableHours = () => {
    if (isToday(calendarStartDate)) {
      const currentHour = new Date().getHours();
      return hours.filter((time) => to24Hour(time) > currentHour);
    }
    return hours;
  };

  const availableHours = getAvailableHours();

  // Get available doctors for a specific time slot
  const getAvailableDoctorsForSlot = (timeSlot) => {
    const dateStr = formatDateYYYYMMDD(calendarStartDate);
    const slotKey = `${dateStr}_${timeSlot}`;
    const existingAppointments = appointmentMap[slotKey] || [];

    // Get list of doctors who already have confirmed/pending appointments at this time
    const bookedDoctors = existingAppointments
      .filter(apt => apt.status === "confirmed" || apt.status === "pending")
      .map(apt => apt.doctor);

    // Return doctors who are NOT in the booked list
    return doctorsData.filter(doc => !bookedDoctors.includes(doc.name));
  };

  // Check if a time slot is completely full (no doctors available)
  const isTimeSlotFullyBooked = (timeSlot) => {
    return getAvailableDoctorsForSlot(timeSlot).length === 0;
  };

  // Update timeSlot when calendarStartDate changes or appointments/doctors update
  useEffect(() => {
    const available = getAvailableHours();
    // Find first slot that has available doctors
    const firstAvailableSlot = available.find(slot => !isTimeSlotFullyBooked(slot));
    if (firstAvailableSlot) {
      setTimeSlot(firstAvailableSlot);
    } else {
      setTimeSlot(available[0] || "");
    }
  }, [calendarStartDate, appointments, doctorsData]);

  const handleSave = async (e) => {
    e.preventDefault();

    // Prevent double submission
    if (bookingInProgress) return;

    setBookingInProgress(true);

    const dateStr = formatDateYYYYMMDD(calendarStartDate);

    if (!reason || !timeSlot || !doctor) {
      alert("Please provide all required fields.");
      setBookingInProgress(false);
      return;
    }

    // Check if user has completed profile
    if (!isProfileAdded) {
      alert("Please complete your profile before booking an appointment.");
      setBookingInProgress(false);
      return;
    }

    // Check if user has gender set
    try {
      const userRes = await fetch(`${BASE_URL}/users/profile/${uid}`);
      if (!userRes.ok) throw new Error("Failed to fetch user profile");
      const userData = await userRes.json();
      if (!userData.profile || !userData.profile.gender) {
        alert("Please complete your profile by adding gender before booking an appointment.");
        setBookingInProgress(false);
        return;
      }
    } catch (err) {
      console.error("Error checking user profile:", err);
      alert("Unable to verify profile. Please try again.");
      setBookingInProgress(false);
      return;
    }

    const payload = {
      patientName: displayName,
      age,
      reason,
      doctor,
      date: dateStr,
      timeSlot,
      status: "pending",
      patientId: uid,
      consultationType,
      doctorId
    };

    try {
      const res = await fetch(`${BASE_URL}/appointments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to save");
      }

      const result = await res.json();
      const created = result.appointment || result;

      setAppointments((prev) => [...prev, created]);

      // Reset form
      setAge("");
      setReason("");
      setDoctor("");
      setConsultationType("")
      setDoctorId(null)
      const available = getAvailableHours();
      const firstAvailableSlot = available.find(slot => !isTimeSlotFullyBooked(slot));
      setTimeSlot(firstAvailableSlot || available[0] || "");
      setShowForm(false);

      alert("Appointment booked successfully!");
    } catch (err) {
      console.error("Save error:", err);
      alert("Could not save appointment: " + err.message);
    } finally {
      setBookingInProgress(false);
    }
  };

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${BASE_URL}/doctors`);
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setDoctorsData(data.doctors);
      } catch (err) {
        console.error("fetchDoctors error:", err);
        setDoctorsData([]);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  // Fetch booked slots for all doctors when popup opens or date changes
  const fetchBookedSlotsForDoctors = async () => {
    if (!showDoctorsPopup || doctorsData.length === 0) return;

    const dateStr = formatDateYYYYMMDD(calendarStartDate);
    const newBookedSlots = {};

    try {
      // Fetch booked slots for each doctor
      const promises = doctorsData.map(async (doc) => {
        try {
          const res = await fetch(`${BASE_URL}/appointments/booked_slots/${doc.uid}/${dateStr}`);
          if (!res.ok) throw new Error("Failed to fetch");
          const data = await res.json();
          return { doctorId: doc.uid, bookedSlots: data.bookedSlots || [] };
        } catch (err) {
          console.error(`Error fetching booked slots for doctor ${doc.uid}:`, err);
          return { doctorId: doc.uid, bookedSlots: [] };
        }
      });

      const results = await Promise.all(promises);

      results.forEach(({ doctorId, bookedSlots }) => {
        const key = `${doctorId}_${dateStr}`;
        newBookedSlots[key] = bookedSlots.map(slot => slot.toLowerCase());
      });

      setBookedSlots(newBookedSlots);
    } catch (err) {
      console.error("Error fetching booked slots:", err);
    }
  };

  useEffect(() => {
    if (showDoctorsPopup) {
      fetchAllDoctorRatings();
      fetchBookedSlotsForDoctors();
    }
  }, [showDoctorsPopup, calendarStartDate, doctorsData]);

  useEffect(() => {
    if (showDoctorsPopup) {
      setTimeSlot("");
      setSelectedTimeSlots({});
    }
  }, [showDoctorsPopup]);

  const fetchAllDoctorRatings = async () => {
    try {
      const res = await fetch(`${BASE_URL}/feedback/ratings`);
      if (!res.ok) throw new Error("Failed to fetch ratings");
      const data = await res.json();

      const ratingsMap = {};
      data.ratings.forEach(r => {
        ratingsMap[r.doctor] = {
          averageRating: r.averageRating,
          totalReviews: r.totalReviews
        };
      });
      setDoctorRatings(ratingsMap);
    } catch (err) {
      console.error("Failed to fetch doctor ratings:", err);
    }
  };

  useEffect(() => {
    if (reviewPopup && selectedDoctorForReview) {
      fetchDoctorReviews(selectedDoctorForReview);
    }
  }, [reviewPopup, selectedDoctorForReview]);

  const fetchDoctorReviews = async (doctorName) => {
    try {
      setLoadingReviews(true);
      const res = await fetch(`${BASE_URL}/feedback?doctor=${encodeURIComponent(doctorName)}`);

      if (!res.ok) throw new Error("Failed to fetch reviews");

      const data = await res.json();
      setDoctorReviews(data.reviews || []);
      setAverageRating(data.averageRating || 0);
      setTotalReviews(data.totalReviews || 0);
    } catch (err) {
      console.error("Failed to fetch reviews:", err);
      setDoctorReviews([]);
      setAverageRating(0);
      setTotalReviews(0);
    } finally {
      setLoadingReviews(false);
    }
  };

  const handleLikes = async (reviewId) => {
    try {
      const res = await fetch(`${BASE_URL}/feedback/${reviewId}/like`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: uid }),
      });
      const updated = await res.json();
      setDoctorReviews((prev) =>
        prev.map((r) => (r._id === updated._id ? updated : r))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleDisLikes = async (reviewId) => {
    try {
      const res = await fetch(`${BASE_URL}/feedback/${reviewId}/dislike`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: uid }),
      });
      const updated = await res.json();
      setDoctorReviews((prev) =>
        prev.map((r) => (r._id === updated._id ? updated : r))
      );
    } catch (err) {
      console.error(err);
    }
  };
  const getValidSlotsForDate = (slots) => {
    if (!isToday(calendarStartDate)) return slots;

    const currentHour = new Date().getHours();

    return slots.filter(slot => to24Hour(slot) > currentHour);
  };
  useEffect(() => {
    if (
      timeSlot &&
      !getValidSlotsForDate(
        doctorsData.flatMap(d => d.availableSlots)
      ).includes(timeSlot)
    ) {
      setTimeSlot("");
    }
  }, [calendarStartDate]);

  const isDoctorSlotBooked = (doctorId, date, slot) => {
    const dateStr = formatDateYYYYMMDD(new Date(date));
    const key = `${doctorId}_${dateStr}`;
    const booked = bookedSlots[key] || [];
    return booked.includes(slot.toLowerCase());
  };

  useEffect(() => {
    if (
      timeSlot &&
      doctorId &&
      isDoctorSlotBooked(doctorId, calendarStartDate, timeSlot)
    ) {
      setTimeSlot("");
    }
  }, [calendarStartDate, appointments]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-[250] p-4 ">
      <div className="bg-[#0a5b58] rounded-xl p-4 w-full max-w-6xl h-[96vh] max-h-[96vh] overflow-hidden relative">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-merriweather text-white text-xl sm:text-2xl font-bold">Appointments</h2>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowForm(true)}
              className="bg-[#93d8c1] text-green-900 px-3 py-2 rounded hover:bg-green-200 transition-all duration-300 font-merriweather font-normal text-xs sm:text-sm"
            >
              Book Appointment
            </button>
            <button
              onClick={onClose}
              className="text-white text-5xl leading-none  hover:text-gray-300"
            >
              &times;
            </button>
          </div>
        </div>
        <div className="flex justify-between items-center mb-2">
          <button onClick={() => setCurrentYear(y => y - 1)}
            className="px-2 py-1 bg-white rounded flex items-center">
            <icons.MdKeyboardDoubleArrowLeft size={20} className="sm:hidden" />
            <icons.MdKeyboardDoubleArrowLeft size={28} className="hidden sm:block" />
            <span className="hidden sm:inline ml-1">Year</span></button>
          <button onClick={prevMonth}
            className="px-2 py-1 bg-white rounded flex items-center">
            <icons.MdKeyboardArrowLeft size={20} className="sm:hidden" />
            <icons.MdKeyboardArrowLeft size={28} className="hidden sm:block" />
            <span className="hidden sm:inline ml-1">Month</span></button>

          <h2 className="text-xl text-white font-semibold">
            {new Date(currentYear, currentMonth).toLocaleString("default", { month: "long" })} {currentYear}
          </h2>

          <button onClick={nextMonth}
            className="px-2 py-1 bg-white rounded flex items-center">
            <icons.MdKeyboardArrowRight size={20} className="sm:hidden" />
            <icons.MdKeyboardArrowRight size={28} className="hidden sm:block" />
            <span className="hidden sm:inline ml-1">Month</span></button>

          <button onClick={() => setCurrentYear(y => y + 1)}
            className="px-2 py-1 bg-white rounded flex items-center">
            <icons.MdKeyboardDoubleArrowRight size={20} className="sm:hidden" />
            <icons.MdKeyboardDoubleArrowRight size={28} className="hidden sm:block" />
            <span className="hidden sm:inline ml-1">Year</span></button>
        </div>

        <div className="overflow-x-auto overflow-y-auto h-[72vh] sm:h-[74vh] md:h-[75vh] lg:h-[77vh]">
          <div
            className="grid border border-green-800 min-w-[840px]
   grid-cols-7 
   auto-rows-[80px] 
   sm:auto-rows-[90px] 
   lg:auto-rows-[110px]"
          >
            {/* Header days */}
            {days.map((day, i) => (
              <div key={i} className="border bg-[#93d8c1] text-center py-2 font-semibold text-green-900">
                {day}
              </div>
            ))}

            {/* Month cells */}
            {monthDates.map(({ date, isCurrentMonth }, idx) => {
              const dateKey = formatDateYYYYMMDD(date);
              const isTodayCell = isToday(date);

              // find appointments
              const cellAppointments = appointments.filter(
                a => formatDateYYYYMMDD(new Date(a.date)) === dateKey
              );

              return (
                <div
                  key={idx}
                  className={`border p-1 overflow-y-auto  
            ${isTodayCell ? "bg-green-900 text-white" : "bg-[#93d8c1]"}
            ${!isCurrentMonth ? "opacity-40" : ""}`}
                >
                  <div className="text-xs font-bold">{date.getDate()}</div>

                  {/* show appointments */}
                  <div className="mt-1 flex flex-col gap-1">
                    {cellAppointments.map((a) => (
                      <div
                        key={a._id}
                        className={`text-xs p-1 rounded 
                  ${a.status === "confirmed" ? "bg-purple-500 text-white" :
                            a.status === "pending" ? "bg-yellow-400 text-black" :
                              "bg-red-500 text-white"}`}
                      >
                        <div><strong>{a.patientName}</strong> ({a.age}y)</div>
                        <div>Dr. {a.doctor}</div>
                        <div>{a.consultationType === "in_person" ? "In Person" : "Tele-Medicine"}</div>
                        <div>{a.reason}</div>
                        <div>{a.timeSlot}</div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        {showForm && (
          <div className=" absolute top-[123px] right-0 w-full sm:w-[280px] lg:w-[300px] h-[60vh] sm:h-[65vh] lg:h-[68vh] overflow-auto bg-[#93d8c1] p-4 rounded-lg z-50">
            <div className="flex items-center justify-between">
              <h2 className="text-center text-2xl font-merriweather mb-1 sm:w-20">
                Book Appointment
              </h2>
              <button
                onClick={() => setShowForm(false)}
                className="absolute top-4 right-4 text-black text-5xl hover:text-gray-500 cursor-pointer"
              >
                &times;
              </button>
            </div>
            <div className="flex flex-col mt-2 gap-1">
              <label className="text-xs">PATIENT NAME</label>
              <input
                value={displayName}
                disabled
                type="text"
                className="p-1 rounded bg-[#8ccdb8] outline-none text-sm"
                placeholder="Name"
              />
              <label className="text-xs">PATIENT AGE</label>
              <input
                value={age}
                onChange={(e) => setAge(e.target.value)}
                type="number"
                className="p-1 rounded bg-[#8ccdb8] outline-none text-sm"
                placeholder="age"
                min={1}
                max={90}
              />

              <label className="text-xs">REASON</label>
              <input
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                type="text"
                className="p-1 rounded bg-[#8ccdb8] outline-none text-sm"
                placeholder="e.g. Fever, Follow-up"
              />

              <label className="text-xs">DOCTOR</label>
              <input
                type="text"
                value={doctor}
                onClick={() => setShowDoctorsPopup(true)}
                readOnly
                className="p-1 rounded bg-[#8ccdb8] mb-2 outline-none text-sm cursor-pointer"
                placeholder="Select Doctor"
              />
              <label className="text-xs">TYPE OF CONSULTATION</label>
              <div className="flex gap-2 items-center mt-1 whitespace-nowrap mb-2">
                {/* IN PERSON */}
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    value="in_person"
                    checked={consultationType === "in_person"}
                    onChange={(e) => setConsultationType(e.target.value)}
                    className="cursor-pointer"
                  />
                  <span className="text-sm">In Person</span>
                </label>
                {/* ONLINE */}
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    value="telemedicine"
                    checked={consultationType === "telemedicine"}
                    onChange={(e) => setConsultationType(e.target.value)}
                    className="cursor-pointer"
                  />
                  <span className="text-sm">Tele-Medicine</span>
                </label>
              </div>
              <button
                onClick={handleSave}
                className="rounded bg-[#0a4f5b] py-2 text-white"
                disabled={bookingInProgress}
              >
                {bookingInProgress ? "Booking..." : "SAVE DETAILS"}
              </button>
            </div>
          </div>
        )}

        {showDoctorsPopup && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-[200]">
            <div className="bg-[#d6f7ff] rounded-2xl w-full max-w-3xl p-4 h-[85vh] overflow-y-auto relative">
              <div className="flex justify-between items-center">
                <h2 className="text-lg sm:text-xl">select doctor</h2>
                <button
                  onClick={() => setShowDoctorsPopup(false)}
                  className="absolute top-2 right-4 text-3xl font-bold text-[#0a5b58]"
                >
                  &times;
                </button>
              </div>
              <div className="text-center mb-2">
                <select
                  value={filteredSpecialization}
                  onChange={(e) => setFilteredSpecialization(e.target.value)}
                  className="p-2 max-w-[400px] rounded-2xl outline-none border border-black">
                  <option value="">Select Specializations</option>
                  {[...new Set(doctorsData.map(doc => doc.specialization))].map((specialization, index) => (
                    <option key={index} value={specialization}>{specialization}</option>
                  ))}
                </select>
              </div>
              <ul className="space-y-3">
                {doctorsData.filter(doc => !filteredSpecialization || doc.specialization === filteredSpecialization).map((doc, index) => {
                  const realRating = doctorRatings[doc.name];
                  const displayRating = realRating
                    ? `${realRating.averageRating} (${realRating.totalReviews} reviews)`
                    : "No ratings yet";

                  return (
                    <li
                      key={index}
                      className="p-4 rounded-xl bg-white grid grid-cols-1 lg:grid-cols-2 gap-6 transition-all duration-200"
                    >
                      {/* LEFT : Doctor Info */}
                      <div className="flex items-start gap-4">
                        <img
                          src={doc.gender === "male" ? images.male_doctor : images.female_doctor}
                          alt={doc.name}
                          className="w-[70px] h-[70px] rounded-full object-cover shrink-0"
                        />

                        <div className="flex flex-col">
                          <h1 className="font-medium text-black">Dr. {doc.name}</h1>
                          <p className="text-xs sm:text-sm text-gray-500">{doc.specialization}</p>
                          <p className="text-xs sm:text-sm text-gray-500">{doc.qualification}</p>
                          <span className="text-xs sm:text-sm text-gray-500">{doc.experience}</span>
                          <span className="text-xs sm:text-sm text-yellow-600 font-semibold">
                            ⭐ {displayRating}
                          </span>
                        </div>
                      </div>

                      {/* RIGHT : Actions */}
                      <div className="flex flex-col gap-3 justify-center">

                        {/* Profile + Reviews */}
                        <div className="flex flex-wrap gap-2">
                          <button
                            className="bg-[#0a5b58] text-white px-4 py-2 rounded-md text-xs sm:text-sm"
                            onClick={() => {
                              setSelectedDoctorProfileId(doc._id);
                              setSelectedDoctorForReview(doc.name);
                              setOpenDoctorProfile(true);
                            }}
                          >
                            DR. PROFILE
                          </button>

                          <button
                            className="bg-[#0a5b58] text-white px-4 py-2 rounded-md text-xs sm:text-sm"
                            onClick={() => {
                              setSelectedDoctorForReview(doc.name);
                              setReviewPopup(true);
                              setShowDoctorsPopup(false);
                            }}
                          >
                            REVIEWS
                          </button>
                        </div>

                        {/* Date + Slot + Select */}
                        <div className="flex flex-wrap gap-2 items-center">
                          <input
                            type="date"
                            value={calendarStartDate.toISOString().split("T")[0]}
                            onChange={(e) =>
                              setCalendarStartDate(new Date(e.target.value))
                            }
                            min={new Date().toISOString().split("T")[0]}
                            className="h-9 px-3 rounded bg-[#0a5b58] text-white outline-none text-xs sm:text-sm appearance-none"
                          />

                          <select
                            value={selectedTimeSlots[doc.uid] || ""}
                            onChange={(e) => setSelectedTimeSlots(prev => ({ ...prev, [doc.uid]: e.target.value }))}
                            className="h-9 px-3 rounded bg-[#0a5b58] text-white outline-none text-xs sm:text-sm"
                          >
                            <option value="">CHOOSE SLOT</option>
                            {getValidSlotsForDate(doc.availableSlots).length === 0 ? (
                              <option disabled>No slots available</option>
                            ) : (
                              getValidSlotsForDate(doc.availableSlots).map((s) => {
                                const booked = isDoctorSlotBooked(doc.uid, calendarStartDate, s);

                                return (
                                  <option key={s} value={s} disabled={booked}>
                                    {s} {booked ? "(Booked)" : ""}
                                  </option>
                                );
                              })
                            )}

                          </select>

                          <button
                            disabled={!selectedTimeSlots[doc.uid]}
                            className={`h-9 text-white px-4 rounded-md text-xs sm:text-sm  ${selectedTimeSlots[doc.uid] ? "bg-yellow-600 hover:bg-yellow-700" : "bg-gray-400 cursor-not-allowed"}`}
                            onClick={() => {
                              const selectedSlot = selectedTimeSlots[doc.uid];
                              if (!selectedSlot) return;
                              setTimeSlot(selectedSlot);
                              setDoctor(doc.name);
                              setDoctorId(doc.uid);
                              setShowDoctorsPopup(false);
                            }}
                          >
                            SELECT
                          </button>
                        </div>
                      </div>
                    </li>

                  );
                })}
              </ul>
            </div>
          </div>
        )}

        {reviewPopup && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-[200] p-4">
            <div className="bg-[#d6f7ff] rounded-2xl w-full max-w-5xl h-[91vh] overflow-y-auto relative shadow-2xl">
              <div className="sticky top-0 bg-[#d6f7ff] z-10 p-6 pb-4 border-b border-[#b8e6f0]">
                <div className="flex items-start justify-between mb-4">
                  <h1 className="text-3xl font-bold text-[#0a5b58]">
                    {selectedDoctorForReview}
                  </h1>
                  <button
                    onClick={() => {
                      setReviewPopup(false);
                      setSelectedDoctorForReview("");
                    }}
                    className="rounded-lg px-5 py-2 text-white bg-[#0a5b58] hover:bg-[#083d47] transition-colors font-semibold"
                  >
                    BACK
                  </button>
                </div>

                <div className="flex flex-col md:flex-row gap-6 items-start">
                  <div className="flex flex-col items-start">
                    <div className="text-5xl font-bold text-[#0a5b58]">
                      {averageRating.toFixed(1)}
                    </div>
                    <div className="flex gap-1 text-2xl">
                      {[...Array(5)].map((_, i) => (
                        <span
                          key={i}
                          className={
                            i < Math.round(averageRating)
                              ? "text-yellow-500"
                              : "text-gray-300"
                          }
                        >
                          ★
                        </span>
                      ))}
                    </div>
                    <div className="text-sm text-gray-600">{totalReviews} reviews</div>
                  </div>

                  <div className="flex-1 max-w-md space-y-2">
                    {[5, 4, 3, 2, 1].map((star) => {
                      const starReviews = doctorReviews.filter((r) => r.rating === star);
                      const percentage =
                        totalReviews > 0 ? (starReviews.length / totalReviews) * 100 : 0;
                      return (
                        <div key={star} className="flex items-center gap-3">
                          <span className="text-sm font-medium text-gray-700 w-3">
                            {star}
                          </span>
                          <div className="flex-1 bg-gray-300 rounded-full h-3 overflow-hidden">
                            <div
                              className="bg-[#0a5b58] h-full rounded-full transition-all duration-500"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <span className="text-sm text-gray-600 w-12 text-right">
                            {Math.round(percentage)}%
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="p-6">
                <h2 className="text-2xl font-bold text-black mb-4">Reviews</h2>
                <div className="space-y-4">
                  {loadingReviews ? (
                    <p className="text-center text-gray-500 py-8"><Loader /></p>
                  ) : doctorReviews.length === 0 ? (
                    <div className="text-center py-3 bg-white rounded-xl">
                      <p className="text-gray-500 text-lg">No reviews yet</p>
                    </div>
                  ) : (
                    doctorReviews.map((review) => {
                      const getTimeAgo = (date) => {
                        const months = Math.floor(
                          (new Date() - new Date(date)) / (1000 * 60 * 60 * 24 * 30)
                        );
                        if (months === 0) return "This month";
                        if (months === 1) return "1 month ago";
                        return `${months} months ago`;
                      };

                      return (
                        <div key={review._id} className="p-3">
                          <div className="flex flex-col items-start">
                            <div className="flex gap-2">
                              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#0a5b58] to-[#93d8c1] flex items-center justify-center text-white font-bold flex-shrink-0">
                                {(review.patientName || "A")
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </div>
                              <div>
                                <p className="font-bold text-lg text-gray-900">
                                  {review.patientName || "Anonymous"}
                                </p>
                                <p className="text-sm text-gray-500">
                                  {getTimeAgo(review.date)}
                                </p>
                              </div>
                            </div>

                            <div className="w-full flex justify-between mt-2">
                              <div className="flex gap-1 text-xl">
                                {[...Array(5)].map((_, i) => (
                                  <span
                                    key={i}
                                    className={
                                      i < review.rating ? "text-[#0a5b58]" : "text-gray-300"
                                    }
                                  >
                                    ★
                                  </span>
                                ))}
                              </div>

                              <div className="flex items-center gap-4 text-sm ml-4">
                                <button
                                  className={`flex items-center gap-1 transition-colors ${userActions[review._id] === "like"
                                    ? "text-[#0a5b58]"
                                    : "text-gray-600 hover:text-[#0a5b58]"
                                    }`}
                                  onClick={() => handleLikes(review._id)}
                                >
                                  <icons.FiThumbsUp />
                                  <span className="font-medium">{review.likes || 0}</span>
                                </button>
                                <button
                                  className={`flex items-center gap-1 transition-colors ${userActions[review._id] === "dislike"
                                    ? "text-red-600"
                                    : "text-gray-600 hover:text-red-600"
                                    }`}
                                  onClick={() => handleDisLikes(review._id)}
                                >
                                  <icons.FiThumbsDown />
                                  <span className="font-medium">{review.disLikes || 0}</span>
                                </button>
                              </div>
                            </div>

                            <p className="text-gray-700 leading-relaxed mt-2">
                              {review.feedback}
                            </p>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {openDoctorProfile &&
          <DoctorProfileModal
            onclose={() => setOpenDoctorProfile(false)}
            selectedDoctorForReview={selectedDoctorForReview}
            selectedDoctorProfileId={selectedDoctorProfileId} />}

        <div className="absolute bottom-[-15px] right-0 w-45 h-45">
          <img src={images.Appointments} alt="Illustration" className="w-full h-full" />
        </div>
      </div>
    </div >
  );
};

export default AppointmentsModal;
