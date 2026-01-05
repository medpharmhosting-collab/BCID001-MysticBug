import React, { useEffect, useState } from "react";
import { useAuth } from "../../Context/AuthContext";
import Loader from "./Loader";
import { BASE_URL } from "../../config/config.js"
import { icons } from "../../assets/assets.js";

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
  const [calendarStartDate, setCalendarStartDate] = useState(new Date());
  const [doctorName, setDoctorName] = useState("");
  const [patientsList, setPatientsList] = useState([]);
  const { uid, loading } = useAuth();
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [allAppointments, setAllAppointments] = useState([]);
  const [monthlyAppointments, setMonthlyAppointments] = useState([]);
  // fetch Patients of current doctor

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

  // Determine available hours based on selected date
  const getAvailableHours = () => {
    if (isToday(calendarStartDate)) {
      const currentHour = new Date().getHours();
      return hours.filter((time) => to24Hour(time) > currentHour);
    }
    return hours;
  };

  const availableHours = getAvailableHours();

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
  const getMonthDates = () => {
    const firstDay = new Date(currentYear, currentMonth, 1);
    const startDay = firstDay.getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();

    const days = [];

    for (let i = startDay - 1; i >= 0; i--) {
      days.push({
        date: new Date(currentYear, currentMonth - 1, daysInPrevMonth - i),
        isCurrentMonth: false
      });
    }

    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        date: new Date(currentYear, currentMonth, i),
        isCurrentMonth: true
      });
    }

    while (days.length < 42) {
      const nextDay = days.length - (startDay + daysInMonth) + 1;
      days.push({
        date: new Date(currentYear, currentMonth + 1, nextDay),
        isCurrentMonth: false
      });
    }

    return days;
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

  // Fetch appointments for this week
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await fetch(`${BASE_URL}/appointments/admin_get_all_appointment`);
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setAllAppointments(data.data || []);
      } catch (err) {
        console.error("fetchAppointments error:", err);
        setAllAppointments([]);
      }
    };
    fetchAppointments();
  }, [selectedDate]);

  useEffect(() => {
    const monthAppointments = allAppointments.filter(app => {
      const d = new Date(app.date);
      return (
        d.getMonth() === currentMonth &&
        d.getFullYear() === currentYear
      );
    });

    setMonthlyAppointments(monthAppointments);
  }, [allAppointments, currentMonth, currentYear]);


  const appointmentMap = allAppointments.reduce((acc, a) => {
    const appointmentDate = new Date(a.date);
    const dateKey = formatDateYYYYMMDD(appointmentDate);
    const key = `${dateKey}_${a.timeSlot}`;

    if (!acc[key]) acc[key] = [];
    acc[key].push(a);
    return acc;
  }, {});

  return (
    <div className="bg-[#d1e8f3] min-h-screen p-3 sm:p-6">
      <div className="bg-[#d1e8f3] rounded-xl p-4 w-full max-w-5xl min-h-screen relative overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className='text-xl sm:text-3xl font-bold text-gray-800'>Appointments</h2>
        </div>
        <div className="flex flex-wrap gap-2 justify-between items-center mb-2">
          <button onClick={() => setCurrentYear(y => y - 1)}
            className="px-2 py-1 text-xs sm:text-sm bg-[#acd8f6] rounded flex items-center ">
            <icons.MdKeyboardDoubleArrowLeft size={20} className="sm:hidden" />
            <icons.MdKeyboardDoubleArrowLeft size={28} className="hidden sm:block" />
            <span className="hidden sm:inline ml-1">Year</span>
          </button>
          <button onClick={prevMonth}
            className="px-2 py-1 text-xs sm:text-sm bg-[#acd8f6] rounded flex items-center">
            <icons.MdKeyboardArrowLeft size={20} className="sm:hidden" />
            <icons.MdKeyboardArrowLeft size={28} className="hidden sm:block" />
            <span className="hidden sm:inline ml-1">Month</span>
          </button>

          <h2 className="text-xl text-black font-semibold">
            {new Date(currentYear, currentMonth).toLocaleString("default", { month: "long" })} {currentYear}
          </h2>

          <button onClick={nextMonth}
            className="px-2 py-1 text-xs sm:text-sm bg-[#acd8f6] rounded flex items-center"><span className="hidden sm:inline mr-1">Month</span>
            <icons.MdKeyboardArrowRight size={20} className="sm:hidden" />
            <icons.MdKeyboardArrowRight size={28} className="hidden sm:block" /></button>

          <button onClick={() => setCurrentYear(y => y + 1)}
            className="px-2 py-1 text-xs sm:text-sm bg-[#acd8f6] rounded flex items-center"><span className="hidden sm:inline mr-1">Year</span>
            <icons.MdKeyboardDoubleArrowRight size={20} className="sm:hidden" />
            <icons.MdKeyboardDoubleArrowRight size={28} className="hidden sm:block" /> </button>
        </div>

        {/* Month Calendar */}
        <div className="border border-black rounded-2xl overflow-auto h-[55vh] sm:h-[70vh] bg-[#d1e8f3]">
          <div
            className="grid"
            style={{ gridTemplateColumns: "repeat(7, minmax(90px, 1fr))", gridAutoRows: "80px" }}
          >
            {days.map(day => (
              <div key={day} className="border border-black bg-[#acd8f6] text-center font-semibold py-2">
                {day}
              </div>
            ))}

            {monthDates.map(({ date, isCurrentMonth }, idx) => {
              const dateKey = formatDateYYYYMMDD(date);
              const isTodayCell = isToday(date);

              const cellAppointments =
                appointmentMap
                  ? Object.entries(appointmentMap)
                    .filter(([key]) => key.startsWith(dateKey))
                    .flatMap(([, val]) => val)
                  : [];
              return (
                <div
                  key={idx}
                  className={`border border-black p-1 overflow-hidden
            ${isTodayCell ? "bg-[#acd8f6]" : "bg-[#d1e8f3]"}
            ${!isCurrentMonth ? "opacity-40" : ""}`}
                >
                  <div className="text-xs font-bold">{date.getDate()}</div>

                  <div className="mt-1 flex flex-col gap-1 overflow-y-auto h-[55px] sm:h-[70px]">
                    {cellAppointments.map(a => (
                      <div
                        key={a._id}
                        className={`
                          ${a.status === "confirmed" ? "bg-green-300 text-black" :
                            a.status === "rejected" ? "bg-red-300" :
                              "bg-white"} border text-xs rounded p-1`}
                      >
                        <div className="font-semibold truncate">{a.patientName} - {a.age}</div>
                        <div className="truncate">{a.reason}</div>
                        <div className="truncate">{a.status}</div>

                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <h2 className="text-2xl font-lato font-bold mt-4">Appointments</h2>
        <div className="rounded-lg mt-4 overflow-x-auto overflow-y-auto max-h-[68vh]">
          <table className="rounded-lg mt-4 overflow-x-auto overflow-y-auto max-h-[68vh] text-xs sm:text-sm">
            <thead>
              <tr className="text-center font-semibold bg-gray-100">
                <th className="px-4 py-3">Appointment ID</th>
                <th className="px-4 py-3">Date/Time</th>
                <th className="px-4 py-3">Doctor</th>
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? <tr> <td colSpan="6" className='py-6'><Loader /></td> </tr> : monthlyAppointments.length > 0 ? monthlyAppointments.map((data, index) => (
                <tr className="text-center" key={data._id}>
                  <td className="px-4 py-3">{index + 1}</td>
                  <td className="px-4 py-3">{new Date(data.date).toLocaleDateString('en-GB', {
                    day: "2-digit",
                    month: "short",
                    year: "numeric"
                  })} - {data.timeSlot}</td>
                  <td className="px-4 py-3">{data.doctor}</td>
                  <td className="px-4 py-3">{data.patientName}</td>
                  <td className="px-4 py-3">
                    <button className="bg-[#e8edf2] rounded px-3 sm:px-6 py-1 shadow">
                      {data.status}
                    </button>
                  </td>
                </tr>
              )) : <tr className='text-center font-semibold text-red-500'>
                <td
                  colSpan="6" className="py-4">
                  No data available
                </td>
              </tr>
              }
            </tbody>
          </table>
        </div>

      </div>
    </div >
  );
};

export default Appointments;