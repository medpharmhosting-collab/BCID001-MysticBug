import { useEffect, useState } from "react";
import { images } from "../../assets/assets"
import { useAuth } from "../../Context/AuthContext";
import { BASE_URL } from "../../config/config.js"

const Monitoring = ({ onClose }) => {
  const [appointments, setAppointments] = useState([])
  const [medicalRecords, setMedicalRecords] = useState([])
  const [previousDoctors, setPreviousDoctors] = useState([])
  const [selectedDoctor, setSelectedDoctor] = useState("")
  const [rating, setRating] = useState(0)
  const [feedback, setFeedback] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const today = new Date();
  let currentHour = today.getHours();
  const todayDate = today.toISOString().split('T')[0] //keep as it is

  const { uid } = useAuth()
  const convertTo24 = (slot) => {
    const [time, period] = slot.split(" ");
    let hour = parseInt(time);

    if (period === "PM" && hour !== 12) hour += 12;
    if (period === "AM" && hour === 12) hour = 0;

    return hour;
  };
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await fetch(`${BASE_URL}/appointments/${uid}`);
        if (!res.ok) {
          setAppointments([]);
          return;
        }
        const data = await res.json();

        const filtered = data?.appointment?.filter((app) => {
          if (app.status === "rejected") return false;

          const appointmentDate = new Date(app.date).toISOString().split('T')[0];

          // Future dates (after today)
          if (appointmentDate > todayDate) return true;

          // Today's appointments that haven't passed yet
          if (appointmentDate === todayDate && convertTo24(app.timeSlot) > currentHour) {
            return true;
          }

          return false;
        })

        setAppointments(filtered || []);
        // Extract unique doctors from past appointments
        const doctors = [...new Set(filtered.map(apt => apt.doctor).filter(Boolean))];
        setPreviousDoctors(doctors);
      } catch (err) {
        console.error("fetchAppointments error:", err);
        setAppointments([]);
      }
    }
    fetchAppointments();

    const fetchMedicalRecords = async () => {
      try {
        const res = await fetch(`${BASE_URL}/medical_records/${uid}?sender=doctor`);
        if (!res.ok) throw new Error("Failed to fetch medical records");
        const data = await res.json();
        setMedicalRecords(data || []);
      } catch (err) {
        console.log('medical record fetch fail', err.message)
      }
    }
    fetchMedicalRecords()
  }, []);

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();

    if (!selectedDoctor || !rating || !feedback.trim()) {
      alert("Please select a doctor, rating, and provide feedback");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`${BASE_URL}/feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          doctor: selectedDoctor,
          rating,
          feedback,
          date: new Date().toISOString()
        }),
      });

      if (!res.ok) throw new Error("Failed to submit feedback");

      alert("Feedback submitted successfully!");
      setSelectedDoctor("");
      setRating(0);
      setFeedback("");
    } catch (err) {
      console.error("Feedback submission error:", err);
      alert("Failed to submit feedback");
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Unknown date";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const openPdf = (url) => {
    const newWindow = window.open(url, '_blank');
    if (newWindow) newWindow.focus();
  }
  const typeLabel = {
    ehr: "Ehr",
    lab_result: "Lab Result",
    imaging: "Imaging",
    prescriptions: "Prescriptions",
    clinicalnotes: "Clinical Notes",
  };
  return (
    <div>
      <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-[250]">
        <div className="bg-[#0a5b58] rounded-xl p-4 w-full max-w-6xl max-h-[96vh] h-auto relative overflow-auto">
          <div className="flex justify-between items-center mb-2">
            <div className="">
              <h2 className="text-[#CCE4FF] text-xl sm:text-24 font-merriweather font-bold mb-3 mt-4">Next Appointment</h2>
            </div>
            <button
              onClick={onClose}
              className="text-white text-5xl hover:text-gray-300"
            >
              &times;
            </button>
          </div>

          <div className="w-full flex flex-col sm:flex-row flex-wrap gap-4">
            {appointments.length > 0 ?
              (appointments.map((appointment) => (
                <div key={appointment._id} className="bg-[#93d8c1] rounded-lg p-4 text-center text-18 font-lato font-bold min-h-[100px] min-w-[260px] flex flex-col items-start ">
                  <h1>Name: {appointment.patientName || "N/A"}</h1>
                  <h1>reason: {appointment.reason || "N/A"}</h1>
                  <h1>time: {appointment.timeSlot || "N/A"}</h1>
                </div>
              ))) :
              (<p className="bg-[#93d8c1] rounded-lg p-2 w-[220px]">No Next Appointment</p>)}
          </div>

          <h2 className="text-[#CCE4FF] text-xl sm:text-24 font-merriweather font-bold mb-3 mt-4">Latest Records</h2>
          <div className="flex flex-col sm:flex-row flex-wrap gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-h-[560px] overflow-y-auto pr-1">
              {medicalRecords.length ? (
                medicalRecords.map((record) => (
                  <div
                    key={record._id}
                    className="p-3 flex flex-col justify-between w-full rounded-2xl bg-[#93d8c1] h-[200px]"
                  >
                    <div className="flex flex-col gap-1 overflow-hidden">
                      <div className="flex justify-between items-center gap-2">
                        <p className="font-semibold text-sm truncate">
                          Dr. {record?.name || "Unknown"}
                        </p>
                        <p className="text-xs text-gray-700">
                          {formatDate(record?.createdAt)}
                        </p>
                      </div>

                      <p className="text-sm text-gray-700 truncate font-semibold">
                        Medicine: {record?.medication || "N/A"}
                      </p>

                      <p className="text-xs text-gray-700">
                        Note: {record?.notes || "NA"}
                      </p>
                    </div>

                    <button
                      onClick={() => openPdf(record?.pdfUrl)}
                      className="flex items-center justify-center bg-white rounded-lg p-2 hover:shadow-lg transition-shadow cursor-pointer"
                    >
                      <div className="text-center">
                        <svg
                          className="w-10 h-10 mx-auto text-red-600"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
                        </svg>
                        <p className="text-xs text-blue-800 font-medium px-2 truncate break-all max-w-[150px]">
                          {record?.fileName || "File"}
                        </p>
                      </div>
                    </button>
                    <h1 className="text-center text-xl font-semibold capitalize">
                      {typeLabel[record?.type] || "Unknown"}
                    </h1>
                  </div>
                ))
              ) : (
                <p className="text-md font-medium text-white col-span-full">
                  No Medical Records found
                </p>
              )}

            </div>
          </div>

          <div>
            <h2 className="text-[#CCE4FF] text-xl sm:text-24 font-merriweather font-bold mb-3 mt-4">Latest Reminders</h2>
            <div className="space-y-2" >
              {appointments.length ?
                appointments.map((appointment) => (
                  <p key={appointment._id} className="max-w-3xl bg-[#93d8c1] p-2 px-4 rounded-2xl ">{new Date(appointment.date).toLocaleDateString('en', {
                    day: "2-digit",
                    month: "short",
                    year: "numeric"
                  })}, {appointment.timeSlot}, {appointment.patientName}, {appointment.reason}</p>
                )) :
                <p className="text-black bg-[#93d8c1] p-2 rounded-md w-[220px] mb-2">No latest Reminders</p>}
            </div>
          </div>

          {/* Feedback Section */}
          <div>
            <h2 className="text-[#CCE4FF] text-xl sm:text-24 font-merriweather font-bold mb-3 mt-4">Doctor Feedback</h2>
            <div className="bg-[#93d8c1] p-6 max-w-3xl rounded-xl">
              <form onSubmit={handleFeedbackSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-800 mb-2">
                    SELECT DOCTOR
                  </label>
                  {previousDoctors.length > 0 ? (
                    <select
                      value={selectedDoctor}
                      onChange={(e) => setSelectedDoctor(e.target.value)}
                      className="w-full p-3 rounded-lg bg-[#8ccdb8] outline-none text-base font-lato"
                      required
                    >
                      <option value="">-- Choose a doctor --</option>
                      {previousDoctors.map((doctor, idx) => (
                        <option key={idx} value={doctor}>
                          {doctor}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <p className="text-gray-600 text-sm italic">
                      No previous appointments found. Book an appointment first!
                    </p>
                  )}
                </div>

                {/* Rating */}
                {previousDoctors.length > 0 && (
                  <>
                    <div>
                      <label className="block text-sm font-bold text-gray-800 mb-2">
                        RATING
                      </label>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            className={`text-3xl transition-all ${star <= rating ? "text-yellow-500" : "text-gray-400"
                              }`}
                          >
                            ★
                          </button>
                        ))}
                        <span className="ml-2 text-gray-700 font-semibold self-center">
                          {rating > 0 ? `${rating}/5` : "Select rating"}
                        </span>
                      </div>
                    </div>

                    {/* Feedback Text */}
                    <div>
                      <label className="block text-sm font-bold text-gray-800 mb-2">
                        YOUR FEEDBACK
                      </label>
                      <textarea
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        rows="4"
                        className="w-full p-3 rounded-lg bg-[#8ccdb8] outline-none text-base font-lato resize-none"
                        placeholder="Share your experience with the doctor..."
                        required
                      />
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full bg-[#0a4f5b] text-white font-bold py-3 rounded-lg hover:bg-[#083d47] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {submitting ? "SUBMITTING..." : "SUBMIT FEEDBACK"}
                    </button>
                  </>
                )}
              </form>
            </div>
          </div>
        </div>

        <div className="hidden sm:flex items-center absolute bottom-2 right-40 w-45 h-45 pointer-events-none z-[300]">
          <img
            src={images.Monitoring}
            alt="Illustration"
            className="block w-full h-full"
          />
        </div>
      </div>
    </div >
  )
}

export default Monitoring