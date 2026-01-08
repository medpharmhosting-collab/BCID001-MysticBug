import { useEffect, useState, useMemo } from 'react';
import { default_page_images, images } from '../../assets/assets';
import { useAuth } from '../../Context/AuthContext';
import { BASE_URL } from "../../config/config.js"

const Overview = () => {
  const [patients, setPatients] = useState([]);
  const [taskCount, setTaskCount] = useState(0);
  const [doctorSlots, setDoctorSlots] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [unreadMessages, setUnreadMessages] = useState(0);

  const { user, uid } = useAuth();
  const isNewUser = localStorage.getItem("isNewUser") === "true"

  const getLocalDate = (date = new Date()) => {
    const d = new Date(date);
    return (
      d.getFullYear() + "-" +
      String(d.getMonth() + 1).padStart(2, "0") + "-" +
      String(d.getDate()).padStart(2, "0")
    );
  };

  const convertTo24 = (slot) => {
    if (!slot) return -1;
    const [time, period] = slot.split(" ");
    let hour = parseInt(time.split(":")[0]);

    if (period === "PM" && hour !== 12) return hour + 12;
    if (period === "AM" && hour === 12) return 0;

    return hour;
  };

  // Update current time every minute for real-time hour comparison
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 30000); // Update every 30 seconds for more responsive UI
    return () => clearInterval(interval);
  }, []);

  // Fetch doctor slots
  useEffect(() => {
    if (!uid) return;
    const fetchDoctorProfile = async () => {
      try {
        const res = await fetch(`${BASE_URL}/doctors/${uid}`);
        const data = await res.json();
        setDoctorSlots(data.message.availableSlots || []);
      } catch (err) {
        console.log("error fetching doctor slots");
      }
    };
    fetchDoctorProfile();
  }, [uid]);

  // Fetch appointments
  useEffect(() => {
    if (!uid || !user) return;

    const fetchAppointments = async () => {
      try {
        const response = await fetch(`${BASE_URL}/appointments/fetch_all_appointments/${uid}?doctor=${user}`)
        const data = await response.json();
        setPatients(data.data || [])
      } catch (error) {
        console.log("error while fetching appointments")
      }
    }
    fetchAppointments();
    const interval = setInterval(fetchAppointments, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, [uid, user]);

  // Fetch tasks
  useEffect(() => {
    if (!uid) return;

    const fetchPendingTaskCount = async () => {
      try {
        const response = await fetch(`${BASE_URL}/tasks/${uid}`)
        const data = await response.json();
        const pending = data.tasks?.filter(task => !task.completed).length || 0;
        setTaskCount(pending);
      } catch (error) {
        console.log("error while fetching pending task count")
      }
    }
    fetchPendingTaskCount();
    const interval = setInterval(fetchPendingTaskCount, 60000); // Update every 60 seconds
    return () => clearInterval(interval);
  }, [uid])

  // Fetch unread messages
  useEffect(() => {
    if (!uid) return;

    const fetchUnreadMessageCount = async () => {
      try {
        const response = await fetch(`${BASE_URL}/messages/unread-count/${uid}`)
        const data = await response.json();
        setUnreadMessages(data.count || 0);
      } catch (error) {
        console.log("error while fetching unread message count")
      }
    }
    fetchUnreadMessageCount();
  }, [uid])

  // Get fresh values - these update with currentTime state changes
  const todayDate = useMemo(() => getLocalDate(), [currentTime]);
  const currentHour = useMemo(() => currentTime.getHours(), [currentTime]);

  // Calculate available slots - memoized for performance
  const availableSlots = useMemo(() => {
    if (!doctorSlots.length) return 0;

    const nowHour = currentHour;
    const normalize = (s) => s?.trim() || s;

    // Get today's appointments
    const todayAppointments = patients.filter(p => getLocalDate(p.date) === todayDate);

    // Get future slots (slots that haven't passed yet, including current hour)
    const futureSlots = doctorSlots.map(normalize).filter(slot => convertTo24(slot) > nowHour);

    // Get booked slots (confirmed OR pending)
    const bookedSlots = todayAppointments
      .filter(a => a.status.toLowerCase() === "confirmed" || a.status.toLowerCase() === "pending")
      .map(a => normalize(a.timeSlot));

    // Available = future slots - booked slots (rejected slots are available if in future)
    const available = futureSlots.filter(slot => !bookedSlots.includes(slot));

    return available.length;
  }, [patients, doctorSlots, currentHour, todayDate]);

  // Active patients - all confirmed appointments - memoized
  const allConfirmedAppointment = useMemo(() =>
    patients.filter(p => p.status.toLowerCase() === "confirmed").length,
    [patients]
  );

  // New patients today - confirmed appointments for today - memoized
  const filteredTodayPatients = useMemo(() =>
    patients.filter(p =>
      getLocalDate(p.date) === todayDate && p.status.toLowerCase() === "confirmed"
    ).length,
    [patients, todayDate]
  );

  // Upcoming appointments - memoized
  const filteredUpcomingAppointments = useMemo(() => {
    const upcoming = patients.filter(p =>
      getLocalDate(p.date) === todayDate &&
      convertTo24(p.timeSlot) > currentHour &&
      p.status.toLowerCase() === "confirmed"
    );
    console.log("Upcoming appointments:", upcoming.length, "currentHour:", currentHour, "todayDate:", todayDate, "patients:", patients);
    return upcoming.length;
  }, [patients, todayDate, currentHour]);

  // Cancelled appointments TODAY - memoized
  const upcomingCancelledAppointments = useMemo(() =>
    patients.filter(p =>
      getLocalDate(p.date) === todayDate &&
      p.status.toLowerCase() === "rejected"
    ).length,
    [patients, todayDate]
  );

  return (
    <div className="bg-[#f3e8d1] min-h-screen px-8 relative overflow-hidden">
      <div className="mb-6 mt-3">
        <h1 className="text-4xl font-bold font-lato mb-2" >
          {isNewUser ? `Welcome Dr.${user}` : `Welcome Back Dr. ${user}`}
        </h1>
        <p className="text-base font-semibold">
          Here's an overview of your day.
        </p>
      </div>

      <div className="max-w-5xl space-y-6 mb-20">
        <div>
          <h2 className="text-2xl font-bold mb-3" >
            Patient Management
          </h2>
          <div className="grid grid-cols-2 gap-x-6 gap-y-4">
            <div>
              <p className="font-bold text-sm mb-1">Active Patients</p>
              <h1 className="font-extrabold mb-2">{allConfirmedAppointment || 0}</h1>
              <p className="text-sm font-semibold">Patients currently under your care.</p>
            </div>
            <div>
              <p className="font-bold text-sm mb-1">New Patients Today</p>
              <h1 className="font-extrabold mb-2">{filteredTodayPatients || 0}</h1>
              <p className="text-sm font-semibold">New patients added to your caseload today.</p>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-3" >
            Appointment Management
          </h2>
          <div className="grid grid-cols-2 gap-x-6 gap-y-4">
            <div>
              <p className="font-bold text-sm mb-1">Upcoming Appointments</p>
              <h1 className="font-extrabold mb-2">{filteredUpcomingAppointments || 0}</h1>
              <p className="text-sm font-semibold">Appointments scheduled for today.</p>
            </div>
            <div>
              <p className="font-bold text-sm mb-1">Cancellations</p>
              <h1 className="font-extrabold mb-2">{upcomingCancelledAppointments || 0}</h1>
              <p className="text-sm font-semibold">Appointments cancelled today.</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <h2 className="text-2xl font-bold mb-3" >
              Communication Hub
            </h2>
            <div>
              <p className="font-bold text-sm mb-1">Unread Messages</p>
              <h1 className="font-extrabold mb-2">{unreadMessages}</h1>
              <p className="text-sm font-semibold">New messages from patients and staff.</p>
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-3" >
              Calendar & Scheduling
            </h2>
            <div>
              <p className="font-bold text-sm mb-1">Available Slots Today</p>
              <h1 className="font-extrabold mb-2">{availableSlots}</h1>
              <p className="text-sm font-semibold">Open slots for new appointments.</p>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-3" >
            Task and Workflow Manager
          </h2>
          <div className="grid grid-cols-2 gap-x-6 gap-y-4">
            <div>
              <p className="font-bold text-sm mb-1">Pending Tasks</p>
              <h1 className="font-extrabold mb-2">{taskCount}</h1>
              <p className="text-sm font-semibold">Tasks Awaiting Completion</p>
            </div>
          </div>
        </div>
      </div>
      <div className="hidden md:block md:fixed bottom-0 right-0 w-full pointer-events-none">
        <div className="relative h-44">
          <img
            className='absolute right-[-6px] w-[1180px]'
            src={default_page_images.clip_path_group} alt="clip_path_group" />

          <div className="absolute bottom-0 right-6 w-64 h-64 flex items-end justify-center">
            <div className="relative">
              <div className="relative z-6 flex items-end space-x-4">
                <img src={images.Doctor} alt="Doctor" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;
