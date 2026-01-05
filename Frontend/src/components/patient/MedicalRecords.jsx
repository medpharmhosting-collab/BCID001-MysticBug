import { useEffect, useState } from "react";
import { images } from "../../assets/assets";
import { useAuth } from "../../Context/AuthContext";
import { BASE_URL } from "../../config/config.js";
import Loader from "../../Pages/admin/Loader.jsx";

const MedicalRecords = ({ onClose, onAddNew }) => {
  const [medicalRecordsFromDoctor, setMedicalRecordsFromDoctor] = useState([]);
  const [pastMedicalRecords, setPastMedicalRecords] = useState([]);
  const [loading, setLoading] = useState(false);

  const { uid, role } = useAuth();

  useEffect(() => {
    const fetchMedicalRecords = async () => {
      try {
        setLoading(true);
        if (!uid || !role) return;
        const currentReq = fetch(`${BASE_URL}/medical_records/${uid}?sender=doctor`)
        const pastReq = fetch(`${BASE_URL}/medical_records/${uid}?sender=patient&type=past`)
        const [currentRes, pastRes] = await Promise.all([currentReq, pastReq]);

        if (currentRes.ok) setMedicalRecordsFromDoctor(await currentRes.json());
        else setMedicalRecordsFromDoctor([])
        if (pastRes.ok) setPastMedicalRecords(await pastRes.json());
        else setPastMedicalRecords([])
      } catch (error) {
        console.error("Error while fetching medical records:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMedicalRecords();
  }, [uid, role]);

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
    if (!url) return;
    const win = window.open(url, "_blank");
    if (win) win.focus();
  };
  const filteredMedicalRecords = medicalRecordsFromDoctor.filter((medi) => medi.type !== "prescriptions")
  const typeLabel = {
    ehr: "Ehr",
    lab_result: "Lab Result",
    imaging: "Imaging",
    prescriptions: "Prescriptions",
    clinicalnotes: "Clinical Notes",
  };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-[250]">
      <div className="bg-[#0a5b58] rounded-xl p-4 w-full max-w-6xl h-[96vh] relative">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-[#CCE4FF] text-20 sm:text-24 font-merriweather font-bold">
              Medical Records
            </h2>
            <h2 className="text-[#CCE4FF] font-lato font-bold text-sm sm:text-base">
              Click on image to view
            </h2>
          </div>
          <button onClick={onClose} className="text-white text-5xl hover:text-gray-300">&times;</button>
        </div>

        <div className="overflow-y-auto h-[82vh] pr-2">

          {/*  CURRENT RECORDS*/}
          <h3 className="text-[#CCE4FF] text-xl sm:text-24 font-merriweather font-bold mb-3"> Medical Records
          </h3>

          {loading ? (
            <div className="flex justify-center items-center h-40"><Loader /></div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-h-[560px] overflow-y-auto pr-1">

              {filteredMedicalRecords.length ? (
                filteredMedicalRecords.map((record) => (
                  <div
                    key={record._id}
                    className="p-3 flex flex-col justify-between w-full rounded-2xl bg-[#93d8c1] h-[210px]"
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
                <p className="text-md font-medium text-white col-span-full">No Medical Records found</p>
              )}
            </div>
          )}

          {/*  PAST RECORDS */}
          <h3 className="text-[#CCE4FF] text-xl sm:text-24 font-merriweather font-bold mt-8 mb-3">
            Past Medical Records
          </h3>

          {loading ? (
            <div className="flex justify-center items-center h-40"><Loader /></div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-h-[560px] overflow-y-auto pr-1">

              {pastMedicalRecords.map((record) => (
                <div key={record._id}
                  className="bg-[#93d8c1] rounded-xl p-4 flex flex-col gap-2 h-[220px]">
                  <p className="font-semibold text-sm truncate">{record.name}</p>
                  <p className="text-xs text-gray-700 truncate">{record.email}</p>

                  {record.createdAt && (
                    <p className="text-xs text-gray-600">{formatDate(record.createdAt)}</p>
                  )}

                  <button onClick={() => openPdf(record.pdfUrl)}
                    className="flex-1 flex items-center justify-center bg-white rounded-lg hover:shadow-lg transition-shadow cursor-pointer">
                    <div className="text-center">
                      <svg className="w-12 h-12 mx-auto text-red-600" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
                      </svg>
                      <p className="text-xs mt-2 text-blue-800 font-medium truncate break-words px-2 max-w-[150px]">
                        {record.fileName}
                      </p>
                    </div>
                  </button>
                </div>
              ))}

              {/* Add New */}
              <div onClick={onAddNew}
                className="bg-[#93d8c1] rounded-xl p-4 flex items-center justify-center h-[220px] cursor-pointer hover:bg-[#7ec7b0] transition-colors">
                <div className="bg-[#D9D9D9] rounded-full h-20 w-20 flex items-center justify-center hover:scale-105 transition-transform">
                  <span className="text-5xl text-gray-600">+</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ILLUSTRATION */}
        <div className="hidden lg:block absolute bottom-0 right-10 z-20 pointer-events-none">
          <img src={images.Medical_Records} className="w-[180px] h-[180px]" />
        </div>
      </div>
    </div>
  );

};

export default MedicalRecords;
