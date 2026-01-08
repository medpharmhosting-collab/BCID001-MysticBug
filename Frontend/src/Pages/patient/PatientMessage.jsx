import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import { icons, images } from "../../assets/assets";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";
import PatientChat from "../patient/PatientChat";
import { BASE_URL } from "../../config/config.js"
import Loader from "../admin/Loader.jsx";

const PatientMessage = () => {
  const [doctors, setDoctors] = useState([]);
  const [doctorId, setDoctorId] = useState(null)
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [lastMessages, setLastMessages] = useState({});
  const [search, setSearch] = useState("");
  const [chatOpen, setChatOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { uid } = useAuth();
  const navigate = useNavigate();

  // Fetch doctors with confirmed appointments for this patient
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(`${BASE_URL}/doctors/active_doctors_data?patientId=${uid}`);
        const doctorsData = await res.json();

        setDoctors(Array.isArray(doctorsData.doctors) ? doctorsData.doctors : []);
      } catch (err) {
        console.error("Error fetching doctors:", err);
        setDoctors([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (uid) {
      fetchDoctors();
    }
  }, [uid]);

  // Attach real doctorId directly inside doctor object
  useEffect(() => {
    const fetchDoctorIdbyId = async () => {
      try {
        const ids = {};
        await Promise.all(
          doctors.map(async (doctor) => {
            const res = await fetch(`${BASE_URL}/doctors/get_doctor_by_id/${doctor._id}`);
            if (!res.ok) return;
            const data = await res.json();
            ids[doctor._id] = data?.doctorId || null;
          })
        );

        // attach realDoctorId to doctor objects for easy usage
        setDoctors(prev => prev.map(d => ({ ...d, realDoctorId: ids[d._1] ?? ids[d._id] ?? d.uid })));

      } catch (err) {
        console.error("Error fetching doctorid by id:", err);
      }
    };

    if (doctors.length) fetchDoctorIdbyId();
  }, [doctors.length]);

  // Fetch last messages for each doctor (poll)
  useEffect(() => {
    if (!uid || doctors.length === 0) return;

    let mounted = true;

    const fetchLastMessages = async () => {
      try {
        const msgs = {};
        for (const doc of doctors) {
          const realId = doc.realDoctorId || doc.uid;
          if (!realId) {
            msgs[doc._id] = "";
            continue;
          }

          const res = await fetch(`${BASE_URL}/messages/last-messages/${uid}/${realId}`);
          if (!res.ok) {
            msgs[doc._id] = "";
            continue;
          }
          const data = await res.json();
          // backend sometimes returns the message doc directly, or an object wrapper
          const lastText = data?.message ?? data?.lastMessage?.message ?? "";
          msgs[doc._id] = lastText;
        }
        if (mounted) setLastMessages(msgs);
      } catch (err) {
        console.error("Error fetching last messages:", err);
      }
    };

    fetchLastMessages();
    const interval = setInterval(fetchLastMessages, 5000);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [uid, doctors]);


  const filteredDoctors = doctors.filter((doc) =>
    doc.name?.toLowerCase().includes(search.toLowerCase())
  );

  const handleOpenChat = (doctor) => {
    setSelectedDoctor(doctor);
    setChatOpen(true);
  };

  const handleCloseChat = () => {
    setChatOpen(false);
    setSelectedDoctor(null);
  };
  return (
    <div className="bg-[#76b1c1] min-h-screen relative overflow-auto">
      <Navbar searchBarColor="#93d8c1" />

      <div className="px-6 pt-10 pb-20 mt-16 w-full max-w-6xl mx-auto">
        <h1 className="font-merriweather text-24 sm:text-[32px] font-bold text-black mb-2">Messages</h1>
        <div className="flex justify-end mb-2">
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-2 text-sm font-medium bg-green-800 text-white rounded-lg hover:bg-green-900"
          >
            BACK
          </button>
        </div>

        <div className="flex justify-start items-center gap-2 bg-[#93d8c1] py-3 px-4 rounded-lg">
          <icons.FaSearch size={20} className="text-black" />
          <input
            type="text"
            placeholder="Search Doctor"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#93d8c1] outline-none placeholder-black"
          />
        </div>

        {isLoading && (
          <div className="text-center py-8 mt-4">
            <p className="text-black text-lg mt-2"><Loader /></p>
          </div>
        )}

        <div className="flex flex-col">
          {!isLoading && filteredDoctors.length === 0 && (
            <p className="text-black text-lg font-bold text-center mt-2">
              {search
                ? "No doctors found matching your search."
                : "No doctors available."}
            </p>
          )}

          {filteredDoctors.map((doc) => (
            <div
              key={doc._id}
              onClick={() => handleOpenChat(doc)}
              className="bg-[#004d4d] mt-4 rounded-lg p-3 cursor-pointer flex items-center gap-4 hover:bg-[#003838] transition-all"
            >
              <div className="w-14 h-14 bg-green-200 rounded-full flex items-center justify-center text-green-800 font-bold text-xl flex-shrink-0">
                {doc.name?.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <p className="font-lato text-white font-semibold text-lg truncate">
                    Dr. {doc.name}
                  </p>
                </div>
                <p className="font-lato text-gray-400 font-normal text-sm truncate mt-1">
                  {lastMessages[doc._id] || "No messages yet"}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Modal */}
      {chatOpen && selectedDoctor && (
        <PatientChat doctor={selectedDoctor} onClose={handleCloseChat} />
      )}

      <img
        src={images.bottomWave}
        alt="bottom wave"
        className="absolute bottom-0 right-0 w-100 h-[400px] pointer-events-none select-none"
      />
    </div>
  );
};

export default PatientMessage;