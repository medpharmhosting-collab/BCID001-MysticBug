import { useState, useEffect } from "react";
import { images } from "../../assets/assets";
import { useAuth } from "../../Context/AuthContext";
import { BASE_URL } from "../../config/config.js";
import Loader from "../../Pages/admin/Loader.jsx";

const Prescriptions = ({ onClose }) => {
  const { uid } = useAuth();

  const [prescriptionsData, setPrescriptionsData] = useState([]);
  const [loading, setLoading] = useState(false);

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

  useEffect(() => {
    if (!uid) return;

    const controller = new AbortController();
    const { signal } = controller;

    const fetchPrescriptions = async () => {
      setLoading(true);

      try {
        const res = await fetch(
          `${BASE_URL}/medical_records/${uid}?sender=doctor`,
          { signal }
        );

        if (!res.ok) {
          setPrescriptionsData([]);
          return;
        }

        const data = await res.json();

        const filtered = data?.filter(
          (item) => item?.type === "prescriptions"
        );

        setPrescriptionsData(filtered || []);
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Error fetching prescriptions:", err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchPrescriptions();

    return () => controller.abort();
  }, [uid]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-[250] p-4">
      <div className="bg-[#0a5b58] rounded-xl p-4 sm:p-6 w-full max-w-6xl h-[90vh] sm:h-[96vh] relative overflow-hidden flex flex-col">

        {/* Header */}
        <div className="flex justify-between items-center mb-6 flex-shrink-0">
          <div>
            <h2 className="text-[#CCE4FF] text-2xl font-merriweather font-bold">
              Prescriptions
            </h2>
            <p className="text-[#CCE4FF] font-lato text-sm mt-1">
              Click on any card to view details
            </p>
          </div>

          <button
            onClick={onClose}
            className="text-white text-5xl hover:text-gray-300"
          >
            &times;
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto flex-1 pr-2">
          <div className="mb-8">
            <h3 className="text-[#CCE4FF] text-xl sm:text-24 font-merriweather font-bold mb-4">
              Prescriptions
            </h3>

            {loading ? (
              <div className="flex justify-center items-center h-40">
                <Loader />
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-h-[560px] overflow-y-auto pr-1">
                {prescriptionsData.length > 0 ? (
                  prescriptionsData.map((record) => (
                    <div
                      key={record._id}
                      className="p-3 flex flex-col justify-between w-full rounded-2xl bg-[#93d8c1] h-[180px]"
                    >
                      <div className="flex flex-col gap-1 overflow-hidden">
                        <div className="flex justify-between items-center">
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
                    </div>
                  ))
                ) : (
                  <p className="text-md font-medium text-white col-span-full">
                    No prescriptions Records found
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Illustration */}
        <div className="hidden sm:flex items-center absolute bottom-2 right-2 w-55 h-55 pointer-events-none opacity-90">
          <img
            src={images.Prescriptions}
            alt="Illustration"
            className="block w-full h-full object-contain"
          />
        </div>
      </div>
    </div>
  );
};

export default Prescriptions;
