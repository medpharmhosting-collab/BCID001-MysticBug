import { useEffect, useState, useCallback, useRef } from "react";
import { icons } from "../../assets/assets";
import { useAuth } from "../../Context/AuthContext";
import DoctorChatModal from "./DoctorChatModal";
import DoctorToDoctorChatModal from "./DoctorToDoctorChatModal";
import Loader from "../admin/Loader";
import { BASE_URL } from "../../config/config.js";

const POLL_MS = 4000;

const DoctorMessage = () => {
  const { uid } = useAuth();
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [patientChatOpen, setPatientChatOpen] = useState(false);
  const [doctorChatOpen, setDoctorChatOpen] = useState(false);
  const [loadingPatients, setLoadingPatients] = useState(true);
  const [loadingDoctors, setLoadingDoctors] = useState(true);
  const [activeTab, setActiveTab] = useState("Patients");

  const patientsPollRef = useRef(null);
  const lastMsgPollRef = useRef(null);
  const doctorsPollRef = useRef(null);
  const doctorLastMsgPollRef = useRef(null);

  const fetchAssignedPatients = useCallback(async (signal) => {
    if (!uid) return;
    try {
      setLoadingPatients(true);
      const res = await fetch(`${BASE_URL}/messages/doctor-patients/${uid}`, { signal });
      if (!res.ok) throw new Error("Failed to fetch doctor patients");
      const data = await res.json();
      setPatients((prev) => {
        // keep any lastMessage  
        const prevMap = new Map(prev.map(p => [p.patientId, p.lastMessage]));
        return (data || []).map(item => ({
          patientId: item.patientId,
          patientName: item.patientName,
          lastMessage: prevMap.get(item.patientId) || null
        }));
      });
    } catch (err) {
      if (err.name !== "AbortError") {
        console.error("Error loading patients:", err);
        setPatients([]);
      }
    } finally {
      setLoadingPatients(false);
    }
  }, [uid]);

  useEffect(() => {
    const controller = new AbortController();
    if (uid) fetchAssignedPatients(controller.signal);
    // polling
    patientsPollRef.current = setInterval(() => fetchAssignedPatients(new AbortController().signal), POLL_MS);
    return () => {
      controller.abort();
      clearInterval(patientsPollRef.current);
    };
  }, [uid, fetchAssignedPatients]);

  const patientsRef = useRef(patients);
  useEffect(() => { patientsRef.current = patients; }, [patients]);

  const fetchLastMessagesForPatients = useCallback(async () => {
    if (!uid || !patientsRef.current || patientsRef.current.length === 0) return;

    try {
      // promises for current patient list
      const promises = patientsRef.current.map(async (p) => {
        try {
          const res = await fetch(`${BASE_URL}/messages/last-messages/${uid}/${p.patientId}`);
          if (!res.ok) return { patientId: p.patientId, lastMessage: null };
          const data = await res.json();
          return { patientId: p.patientId, lastMessage: data ?? null };
        } catch (e) {
          return { patientId: p.patientId, lastMessage: null };
        }
      });

      const results = await Promise.all(promises);

      // update patients atomically
      setPatients(prev => prev.map(p => {
        const found = results.find(r => r.patientId === p.patientId);
        return {
          ...p,
          lastMessage: (found && found.lastMessage) ? found.lastMessage : p.lastMessage ?? null
        };
      }));
    } catch (err) {
      console.error("Error fetching last messages for patients:", err);
    }
  }, [uid]);

  // call once when patients change, and poll using stable function
  useEffect(() => {
    fetchLastMessagesForPatients();

    const interval = setInterval(fetchLastMessagesForPatients, 5000);
    return () => clearInterval(interval);
  }, [fetchLastMessagesForPatients]); // re-starts only if patients length changes

  // Fetch all doctors (internal tab)
  const fetchAllDoctors = useCallback(async (signal) => {
    try {
      setLoadingDoctors(true);
      const res = await fetch(`${BASE_URL}/doctors`, { signal });
      if (!res.ok) throw new Error("Failed to fetch doctors");
      const data = await res.json();
      setDoctors((data?.doctors || []).filter(d => d.uid !== uid));
    } catch (err) {
      if (err.name !== "AbortError") console.error("error while fetching doctors", err);
      setDoctors([]);
    } finally {
      setLoadingDoctors(false);
    }
  }, [uid]);

  useEffect(() => {
    const controller = new AbortController();
    if (uid) fetchAllDoctors(controller.signal);
    doctorsPollRef.current = setInterval(() => fetchAllDoctors(new AbortController().signal), POLL_MS * 3);
    return () => {
      controller.abort();
      clearInterval(doctorsPollRef.current);
    };
  }, [uid, fetchAllDoctors]);

  const doctorsRef = useRef([]);
  useEffect(() => { doctorsRef.current = doctors; }, [doctors]);
  // Fetch last message for each doctor (internal)
  const fetchLastMessagesForDoctors = useCallback(async () => {
    if (!uid || doctorsRef.current.length === 0) return;
    try {
      const promises = doctorsRef.current.map(async (d) => {
        const res = await fetch(`${BASE_URL}/messages/doctor-last-messages/${uid}/${d.uid}`);
        if (!res.ok) return { uid: d.uid, lastMessage: null };
        const data = await res.json();
        return { uid: d.uid, lastMessage: data ?? null };
      });
      const results = await Promise.all(promises);
      setDoctors(prev => prev.map(d => ({
        ...d,
        lastMessage: results.find(r => r.uid === d.uid)?.lastMessage || d.lastMessage || null
      })));
    } catch (err) {
      console.error("Error fetching last messages for doctors:", err);
    }
  }, [uid]);

  useEffect(() => {
    fetchLastMessagesForDoctors();
    doctorLastMsgPollRef.current = setInterval(fetchLastMessagesForDoctors, POLL_MS * 3);
    return () => clearInterval(doctorLastMsgPollRef.current);
  }, [fetchLastMessagesForDoctors]);

  const filteredPatients = patients.filter(p => p.patientName?.toLowerCase().includes(search.toLowerCase()));
  const filteredDoctors = doctors.filter(d => d.name?.toLowerCase().includes(search.toLowerCase()));

  const openPatientChat = (patient) => {
    setSelectedPatient(patient);
    setPatientChatOpen(true);
  };
  const closePatientChat = () => {
    setPatientChatOpen(false);
    setSelectedPatient(null);
  };

  const openDoctorChat = (doctor) => {
    setSelectedDoctor(doctor);
    setDoctorChatOpen(true);
  };
  const closeDoctorChat = () => {
    setDoctorChatOpen(false);
    setSelectedDoctor(null);
  };

  return (
    <div className="w-full h-screen bg-[#f3e8d1]">
      <div className="flex-1 overflow-hidden flex flex-col items-center px-4 py-6">
        <div className="w-full max-w-5xl">
          <h1 className="font-bold text-3xl mb-6">Messages</h1>

          {/* Tabs */}
          <div className="flex gap-8 mb-6 border-b-2 border-[#004d4d] pb-2">
            <span
              onClick={() => setActiveTab("Patients")}
              className={`${activeTab === "Patients" ? "font-bold text-sm border-b-4 border-[#004d4d]" : "text-[#59788C] font-bold text-sm"} cursor-pointer transition-all`}
            >
              Patients
            </span>

            <span
              onClick={() => setActiveTab("Internal")}
              className={`${activeTab === "Internal" ? "font-bold text-sm border-b-4 border-[#004d4d]" : "text-[#59788C] font-bold text-sm"} cursor-pointer transition-all`}
            >
              Internal
            </span>
          </div>

          {/* Patients Tab */}
          {activeTab === "Patients" && (
            <div>
              <div className="flex items-center gap-2 bg-[#f6e2ac] rounded-md px-4 py-3 mb-4">
                <icons.FaSearch size={20} />
                <input
                  type="text"
                  placeholder="Search patients..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-[#f6e2ac] outline-none"
                />
              </div>

              {loadingPatients && <p className="text-center py-8"><Loader /></p>}

              <div className="flex flex-col gap-4">
                {!loadingPatients && filteredPatients.length === 0 && (
                  <p className="text-black text-lg font-bold text-center mt-2">
                    {search ? "No patients found matching your search." : "No patients available."}
                  </p>
                )}

                {filteredPatients.map((p) => (
                  <div
                    key={p.patientId}
                    onClick={() => openPatientChat(p)}
                    className="bg-[#004d4d] p-4 rounded-lg cursor-pointer flex gap-4 hover:bg-[#006666] transition-colors"
                  >
                    <div className="w-12 h-12 bg-[#f6e2ac] rounded-full flex items-center justify-center font-bold text-xl text-[#004d4d]">
                      {p.patientName?.charAt(0)?.toUpperCase() || "P"}
                    </div>

                    <div className="flex-1">
                      <h3 className="text-white font-semibold text-lg">{p.patientName}</h3>
                      <p className="text-gray-300 text-sm truncate">
                        {p.lastMessage?.message ? p.lastMessage.message : "Start a conversation"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Internal Tab */}
          {activeTab === "Internal" && (
            <div>
              <div className="flex items-center gap-2 bg-[#f6e2ac] rounded-md px-4 py-3 mb-4">
                <icons.FaSearch className="w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search doctors..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-[#f6e2ac] outline-none"
                />
              </div>

              {loadingDoctors && <p className="text-center text-[#004d4d] py-8"><Loader /></p>}

              <div className="flex flex-col gap-4">
                {!loadingDoctors && filteredDoctors.length === 0 && (
                  <p className="text-black text-lg font-bold text-center mt-2">{search ? "No doctors found matching your search." : "No doctors available."}</p>
                )}

                {filteredDoctors.map((doc) => (
                  <div
                    key={doc._id}
                    onClick={() => openDoctorChat(doc)}
                    className="bg-[#004d4d] p-4 rounded-lg cursor-pointer flex gap-4 hover:bg-[#006666] transition-colors"
                  >
                    <div className="w-12 h-12 bg-[#f6e2ac] rounded-full flex items-center justify-center font-bold text-xl text-[#004d4d]">
                      {doc.name?.charAt(0)?.toUpperCase() || "D"}
                    </div>

                    <div className="flex-1">
                      <h3 className="text-white font-semibold text-lg">{doc.name}</h3>
                      <p className="text-gray-300 text-sm truncate">
                        {doc.lastMessage?.message ? doc.lastMessage.message : "Start a conversation"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Patient Chat Modal */}
      {patientChatOpen && selectedPatient && (
        <DoctorChatModal patient={selectedPatient} onClose={closePatientChat} />
      )}

      {/* Doctor-to-Doctor Chat Modal */}
      {doctorChatOpen && selectedDoctor && (
        <DoctorToDoctorChatModal doctor={selectedDoctor} onClose={closeDoctorChat} />
      )}
    </div>
  );
};

export default DoctorMessage;
