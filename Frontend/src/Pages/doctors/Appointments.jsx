import React, { useEffect, useState } from "react";
import { useAuth } from "../../Context/AuthContext";
import { BASE_URL } from "../../config/config.js"
import { images, icons } from "../../assets/assets.js"
import "react-datepicker/dist/react-datepicker.css";
import Loader from "../admin/Loader.jsx";

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

const Appointments = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { uid } = useAuth();
  const [loading, setLoading] = useState(false)
  // loaded appointments for the week
  const [appointments, setAppointments] = useState([]);
  const [confirmedAppointments, setConfirmedAppointments] = useState([])

  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [doctorName, setDoctorName] = useState('')

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
  useEffect(() => {
    const fetchDoctorName = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${BASE_URL}/doctors/${uid}`);
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setDoctorName(data.message?.name)
      } catch (err) {
        console.error("fetch doctor name error:", err);
        setDoctorName([]);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctorName();
  }, [])

  // Fetch appointments  
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        setLoading(true);

        const res = await fetch(
          `${BASE_URL}/appointments/fetch_all_appointments/${uid}?doctor=${doctorName}`
        );

        if (!res.ok) throw new Error("Failed to fetch appointments");
        const data = await res.json();
        setAppointments(data.data || []);
      } catch (err) {
        setAppointments([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [doctorName, uid]);

  useEffect(() => {
    const confirmed = appointments.filter(
      (app) => app.status === "confirmed"
    );
    setConfirmedAppointments(confirmed);
  }, [appointments]);

  const handleAcceptClick = async (id) => {
    try {
      const response = await fetch(`${BASE_URL}/appointments/${id}/accept`, {
        method: "PUT",
        headers: {
          'Content-Type': 'application/json'
        }
      })
      const data = await response.json();
      setAppointments(prev =>
        prev.map(apt =>
          apt._id === id ? { ...apt, status: 'confirmed' } : apt
        )
      );
    } catch (error) {
      console.log("error while accepting appointment:", error)
    }
  }

  const handleRejectClick = async (id) => {
    try {
      const response = await fetch(`${BASE_URL}/appointments/${id}/reject`, {
        method: "PUT",
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error("Failed to reject appointment");
      }

      const data = await response.json();

      setAppointments(prev =>
        prev.map(apt =>
          apt._id === id ? { ...apt, status: 'rejected' } : apt
        )
      );
    } catch (error) {
      console.log("error while rejecting appointment:", error);
      alert("Failed to reject appointment");
    }
  }

  return (
    <div className="bg-[#f3e8d1] flex justify-start z-50">
      <div className="bg-[#f3e8d1] rounded-xl p-4 w-full max-w-5xl h-[96vh] relative overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-lato font-bold">Appointments</h2>
        </div>
        <div className="flex flex-wrap gap-2 justify-between items-center mb-2">
          <button onClick={() => setCurrentYear(y => y - 1)}
            className="px-2 py-1 text-xs sm:text-sm bg-[#f1b91f] rounded flex items-center ">
            <icons.MdKeyboardDoubleArrowLeft size={20} className="sm:hidden" />
            <icons.MdKeyboardDoubleArrowLeft size={28} className="hidden sm:block" />
            <span className="hidden sm:inline ml-1">Year</span>
          </button>
          <button onClick={prevMonth}
            className="px-2 py-1 text-xs sm:text-sm bg-[#f1b91f] rounded flex items-center">
            <icons.MdKeyboardArrowLeft size={20} className="sm:hidden" />
            <icons.MdKeyboardArrowLeft size={28} className="hidden sm:block" />
            <span className="hidden sm:inline ml-1">Month</span>
          </button>

          <h2 className="text-xl text-black font-semibold">
            {new Date(currentYear, currentMonth).toLocaleString("default", { month: "long" })} {currentYear}
          </h2>

          <button onClick={nextMonth}
            className="px-2 py-1 text-xs sm:text-sm bg-[#f1b91f] rounded flex items-center"><span className="hidden sm:inline mr-1">Month</span>
            <icons.MdKeyboardArrowRight size={20} className="sm:hidden" />
            <icons.MdKeyboardArrowRight size={28} className="hidden sm:block" /></button>

          <button onClick={() => setCurrentYear(y => y + 1)}
            className="px-2 py-1 text-xs sm:text-sm bg-[#f1b91f] rounded flex items-center"><span className="hidden sm:inline mr-1">Year</span>
            <icons.MdKeyboardDoubleArrowRight size={20} className="sm:hidden" />
            <icons.MdKeyboardDoubleArrowRight size={28} className="hidden sm:block" /> </button>
        </div>

        <div className="flex flex-col border border-black rounded-2xl overflow-x-auto overflow-y-auto h-[70vh] bg-[#f3e8d1] mb-4">
          <div
            className="grid border border-gray-300 min-w-[840px]"
            style={{
              gridTemplateColumns: `repeat(7, minmax(120px, 1fr))`,
              gridAutoRows: "90px"
            }}
          >
            {/* Header days */}
            {days.map((day, i) => (
              <div key={i} className="border border-black bg-[#f1b91f] text-center py-2 font-semibold text-black">
                {day}
              </div>
            ))}
            {/* Month cells */}
            {monthDates.map(({ date, isCurrentMonth }, idx) => {
              const dateKey = formatDateYYYYMMDD(date);
              const isTodayCell = isToday(date);
              // find appointments
              const cellAppointments = confirmedAppointments.filter(
                a => formatDateYYYYMMDD(new Date(a.date)) === dateKey
              );
              return (
                <div
                  key={idx}
                  className={`border border-black p-1 overflow-y-auto 
            ${isTodayCell ? "bg-[#f1b91f] text-black" : "bg-[#f3e8d1]"}
            ${!isCurrentMonth ? "opacity-40" : ""}`}
                >  <div className="text-xs font-bold">{date.getDate()}</div>
                  <div className="mt-1 flex flex-col gap-1">
                    {cellAppointments.map((a) => (
                      <div
                        key={a._id}
                        className="w-full text-left flex flex-col rounded px-1 py-0.5 bg-green-100 border border-green-400 text-black text-xs"
                      >
                        <span>{a.patientName} - {a.age}yr</span>
                        <span>{a.reason}</span>
                        <span>{a.consultationType === "in_person" ? "In-Person" : "Tele-Medicine"}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="max-h-[300px] rounded-t-2xl overflow-y-auto">
          <table className="w-full mb-10 text-center border-collapse bg-[#fdbc23]">
            <thead className="bg-[#f1b91f] sticky top-0">
              <tr className="text-center bg-[#f1b91f]">
                <th className="px-4 py-3 font-semibold text-gray-800">Patient</th>
                <th className="px-4 py-3 font-semibold text-gray-800 whitespace-nowrap">Date / Time</th>
                <th className="px-4 py-3 font-semibold text-gray-800">Status</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="3" className="py-6 text-center">
                    <div className="flex justify-center">
                      <Loader />
                    </div>
                  </td>
                </tr>
              ) : appointments.length > 0 ? (
                appointments.map((appointment, index) => (
                  <tr
                    key={appointment._id || appointment.name + index}
                    className="bg-[#f6e2ac]"
                  >
                    <td className="px-4 py-3 text-gray-900">{appointment.patientName}</td>

                    <td className="px-4 py-3 text-gray-900">
                      {new Date(appointment.date).toLocaleString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                      , {appointment.timeSlot}
                    </td>

                    <td className="py-3 flex gap-4 justify-center">
                      {/* Accept */}
                      <button
                        className={`px-5 py-1 rounded-2xl transition-colors ${appointment.status === "confirmed"
                          ? "bg-green-500 text-white cursor-not-allowed"
                          : appointment.status === "rejected"
                            ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                            : "bg-[#f1b91f] hover:bg-[#e0a810] cursor-pointer"
                          }`}
                        onClick={() => handleAcceptClick(appointment._id)}
                        disabled={
                          appointment.status === "confirmed" ||
                          appointment.status === "rejected"
                        }
                      >
                        {appointment.status === "confirmed" ? "Accepted" : "Accept"}
                      </button>

                      {/* Reject */}
                      <button
                        className={`px-5 py-1 rounded-2xl transition-colors ${appointment.status === "rejected"
                          ? "bg-red-500 text-white cursor-not-allowed"
                          : appointment.status === "confirmed"
                            ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                            : "bg-[#f1b91f] hover:bg-[#e0a810] cursor-pointer"
                          }`}
                        onClick={() => handleRejectClick(appointment._id)}
                        disabled={
                          appointment.status === "confirmed" ||
                          appointment.status === "rejected"
                        }
                      >
                        {appointment.status === "rejected" ? "Rejected" : "Reject"}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="py-6 text-center text-gray-600">
                    No appointments found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div >
  );
};

export default Appointments;