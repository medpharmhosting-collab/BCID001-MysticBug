import { useState } from 'react';
import { useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { BASE_URL } from "../../config/config.js"

const Dashboard = () => {


  const paymentData = [
    { status: 'Success', value: 0 },
    { status: 'Failed', value: 0 },
    { status: 'Pending', value: 0 }
  ];

  const [totalPatientsCount, setTotalPatientsCount] = useState(0)
  const [totalDoctorsCount, setTotalDoctorsCount] = useState(0)
  const [totalUsersCount, setTotalUsersCount] = useState(0)
  const [activeDoctors, setActiveDoctors] = useState(0)
  const [activePatients, setActivePatients] = useState(0)
  const [activeInvestor, setActiveInvestor] = useState(0)
  const [todaysAppointment, setTodaysAppointment] = useState(0)
  const [activeSessionsCount, setActiveSessionsCount] = useState(0)
  const [appointments, setAppointments] = useState([]);
  const [weeklyPercentage, setWeeklyPercentage] = useState(0);
  const [weeklyChartData, setWeeklyChartData] = useState([]);
  const [trafficData, setTrafficData] = useState([]);
  const [trafficPercentage, setTrafficPercentage] = useState(0);

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const response = await fetch(`${BASE_URL}/get_count`)
        const data = await response.json();
        setTotalDoctorsCount(data.doctorCount)
        setTotalPatientsCount(data.patientCount)
        setTotalUsersCount(data.totalCount)
        setActiveDoctors(data.activeDoctors)
        setActivePatients(data.activePatients)
        setActiveInvestor(data.activeInvestor)
      } catch (error) {
        console.log("error while getting count", error.message)
      }
    }
    fetchCount();
    const fetchAppointmentCount = async () => {
      try {
        const response = await fetch(`${BASE_URL}/appointments/today_appointments_count`)
        const todaysAppointmentData = await response.json()
        setTodaysAppointment(todaysAppointmentData.todaysAppointment)
      } catch (error) {
        console.log("error while getting todays appointment")
      }
    }
    fetchAppointmentCount()

    const interval = setInterval(fetchCount, 7000);

    return () => clearInterval(interval);
  }, [])

  useEffect(() => {
    const fetchActiveSessionsCount = async () => {
      try {
        const response = await fetch(`${BASE_URL}/admin/active-status`)
        const activeSessionsCount = await response.json()
        setActiveSessionsCount(activeSessionsCount.activeUsers)
      } catch (error) {
        console.log("error while getting active users status")
      }
    }
    fetchActiveSessionsCount()
    const interval = setInterval(fetchActiveSessionsCount, 10000);

    return () => clearInterval(interval);
  }, [])
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await fetch(`${BASE_URL}/appointments/admin_get_all_appointment`);
        const json = await res.json();
        setAppointments(json.data || []);
      } catch (err) {
        console.log("Error fetching appointments", err);
      }
    };
    fetchAppointments();
  }, []);
  useEffect(() => {
    if (!appointments.length) return;

    const now = new Date();

    // Start of current week (Monday)
    const startOfThisWeek = new Date(now);
    startOfThisWeek.setDate(now.getDate() - now.getDay() + 1);
    startOfThisWeek.setHours(0, 0, 0, 0);

    const startOfLastWeek = new Date(startOfThisWeek);
    startOfLastWeek.setDate(startOfThisWeek.getDate() - 7);

    const endOfLastWeek = new Date(startOfThisWeek);
    endOfLastWeek.setMilliseconds(-1);

    let thisWeekCount = 0;
    let lastWeekCount = 0;

    // Mon–Sun chart structure
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const weeklyMap = {
      Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0, Sun: 0
    };

    appointments.forEach(app => {
      const date = new Date(app.createdAt);

      // This week
      if (date >= startOfThisWeek) {
        thisWeekCount++;
        const day = days[date.getDay() === 0 ? 6 : date.getDay() - 1];
        weeklyMap[day]++;
      }

      // Last week
      else if (date >= startOfLastWeek && date <= endOfLastWeek) {
        lastWeekCount++;
      }
    });

    let percentage = 0;
    if (lastWeekCount === 0 && thisWeekCount > 0) {
      percentage = 100;
    } else if (lastWeekCount > 0) {
      percentage = ((thisWeekCount - lastWeekCount) / lastWeekCount) * 100;
      percentage = Math.max(-100, Math.min(100, percentage));
    }

    setWeeklyPercentage(Math.round(percentage));

    // Convert to chart array
    setWeeklyChartData(
      days.map(day => ({ day, value: weeklyMap[day] }))
    );

  }, [appointments]);
  const appointmentsData = weeklyChartData.length ? weeklyChartData : [
    { day: 'Mon', value: 0 },
    { day: 'Tue', value: 0 },
    { day: 'Wed', value: 0 },
    { day: 'Thu', value: 0 },
    { day: 'Fri', value: 0 },
    { day: 'Sat', value: 0 },
    { day: 'Sun', value: 0 }
  ];

  useEffect(() => {
    const fetchTraffic = async () => {
      try {
        const res = await fetch(`${BASE_URL}/appointments/admin/traffic/monthly`);
        const json = await res.json();
        const data = json.data;
        setTrafficData(data);

        // percentage vs last month
        const last = data[data.length - 2]?.value || 0;
        const current = data[data.length - 1]?.value || 0;

        let percent = 0;
        if (last === 0 && current > 0) {
          percent = 100;
        } else if (last === 0 && current === 0) {
          percent = 0;
        } else if (last > 0) {
          percent = Math.round(((current - last) / last) * 100);
          percent = Math.max(-100, Math.min(100, percent));
        }

        setTrafficPercentage(percent);
      } catch (error) {
        console.error('Error fetching traffic data:', error);
      }
    };

    fetchTraffic();
  }, []);

  return (
    <div className='bg-[#d1e8f3] min-h-screen p-8'>
      <h1 className='text-3xl font-bold text-gray-800 mb-4'>Dashboard</h1>

      <h2 className='text-lg font-semibold mb-4 text-gray-700'>Widgets / Cards</h2>

      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-4 mb-4'>
        <div className='rounded-lg border-2 border-blue-400 p-4'>
          <p className='text-sm text-gray-600 mb-2'>Total Users</p>
          <p className='text-2xl font-bold text-gray-800'>{totalUsersCount || 0}</p>
        </div>
        <div className='rounded-lg border-2 border-blue-400 p-4'>
          <p className='text-sm text-gray-600 mb-2'>Total Doctors</p>
          <p className='text-2xl font-bold text-gray-800'>{totalDoctorsCount || 0}</p>
        </div>
        <div className='rounded-lg border-2 border-blue-400 p-4'>
          <p className='text-sm text-gray-600 mb-2'>Appointments Today</p>
          <p className='text-2xl font-bold text-gray-800'>{todaysAppointment || 0}</p>
        </div>
        <div className='rounded-lg border-2 border-blue-400 p-4'>
          <p className='text-sm text-gray-600 mb-2'>Active Sessions</p>
          <p className='text-2xl font-bold text-gray-800'>{activeSessionsCount || 0}</p>
        </div>
        <div className='rounded-lg border-2 border-blue-400 p-4'>
          <p className='text-sm text-gray-600 mb-2'>Payment Success Rate</p>
          <p className='text-2xl font-bold text-gray-800'>0%</p>
        </div>
        <div className='rounded-lg border-2 border-blue-400 p-4'>
          <p className='text-sm text-gray-600 mb-2'>Chatbot Escalations</p>
          <p className='text-2xl font-bold text-gray-800'>0</p>
        </div>
      </div>

      <div className='grid grid-cols-3 gap-4 mb-6'>
        <div className='rounded-lg border-2 border-blue-400 p-4'>
          <p className='text-sm text-gray-600 mb-2'>Active Patients</p>
          <p className='text-2xl font-bold text-gray-800'>{activePatients || 0}</p>
        </div>
        <div className='rounded-lg border-2 border-blue-400 p-4'>
          <p className='text-sm text-gray-600 mb-2'>Active Doctors</p>
          <p className='text-2xl font-bold text-gray-800'>{activeDoctors || 0}</p>
        </div>
        <div className='rounded-lg border-2 border-blue-400 p-4'>
          <p className='text-sm text-gray-600 mb-2'>Active Investors</p>
          <p className='text-2xl font-bold text-gray-800'>{activeInvestor || 0}</p>
        </div>
      </div>

      <h2 className='text-lg font-semibold mb-4 text-gray-700'>Graphs / Charts</h2>

      {/* Charts Section */}
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'>
        {/* Appointments Chart */}
        <div className='rounded-lg border-2 border-blue-400 p-5'>
          <p className='text-sm text-gray-700 mb-1'>Appointments per week</p>
          <p className='text-3xl font-bold text-gray-800 mb-1'>{weeklyPercentage}%</p>
          <p className='text-xs text-gray-500 mb-3'>
            vs. last week{' '}
            <span className={`font-semibold ${weeklyPercentage >= 0 ? "text-green-600" : "text-red-600"}`}>
              {weeklyPercentage >= 0 ? '+' : ''}{weeklyPercentage}%
            </span>
          </p>
          <ResponsiveContainer width="100%" height={140}>
            <LineChart data={appointmentsData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="day"
                tick={{ fontSize: 11 }}
                stroke="#6b7280"
                tickMargin={5}
              />
              <YAxis
                tick={{ fontSize: 10 }}
                stroke="#6b7280"
                width={35}
              />
              <Tooltip
                contentStyle={{ fontSize: '12px' }}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#374151"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        {/* Website Traffic Chart */}
        <div className='rounded-lg border-2 border-blue-400 p-5'>
          <p className='text-sm text-gray-700 mb-1'>Website Traffic</p>
          <p className='text-3xl font-bold text-gray-800 mb-1'>
            {trafficPercentage >= 0 ? '+' : ''}
            {trafficPercentage}%
          </p>
          <p className='text-xs text-gray-500 mb-3'>
            vs. last month{' '}
            <span className={`font-semibold ${trafficPercentage >= 0 ? "text-green-600" : "text-red-600"}`}>
              {trafficPercentage >= 0 ? '+' : ''}
              {trafficPercentage}%
            </span>
          </p>
          <ResponsiveContainer width="100%" height={140}>
            <LineChart data={trafficData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 11 }}
                stroke="#6b7280"
                tickMargin={5}
              />
              <YAxis
                tick={{ fontSize: 10 }}
                stroke="#6b7280"
                width={35}
              />
              <Tooltip
                contentStyle={{ fontSize: '12px' }}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#374151"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Payment Status Chart */}
        <div className='rounded-lg border-2 border-blue-400 p-5'>
          <p className='text-sm text-gray-700 mb-1'>Payment statuses</p>
          <p className='text-3xl font-bold text-gray-800 mb-1'>0%</p>
          <p className='text-xs text-gray-500 mb-4'>
            vs. last month <span className='text-green-600 font-semibold'>+5%</span>
          </p>
          <ResponsiveContainer width="100%" height={120}>
            <BarChart data={paymentData}>
              <Bar dataKey="value" fill="#f1f1f1" radius={[4, 4, 0, 0]} minPointSize={2} />
            </BarChart>
          </ResponsiveContainer>
          <div className='flex justify-around text-xs text-gray-500 mt-2'>
            {paymentData.map(d => (
              <span key={d.status}>{d.status}</span>
            ))}
          </div>
        </div>
      </div>
    </div >
  );
};

export default Dashboard;