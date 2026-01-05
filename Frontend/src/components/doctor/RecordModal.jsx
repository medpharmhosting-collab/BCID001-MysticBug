import { useEffect, useState } from "react";
import { BASE_URL } from "../../config/config";
import { icons } from "../../assets/assets";

const RecordModal = ({ recordName, setContainerClose, showForm, setShowForm,
  uid,
  doctorId,
  doctor,
  userName,
  recordType,
  postEndpoint }) => {
  const [loading, setLoading] = useState(false);
  const [records, setRecords] = useState([]);
  const [formData, setFormData] = useState({
    patientId: uid,
    doctorId: doctorId,
    medication: '',
    notes: '',
    pdfFile: null,
    doctorName: doctor
  });
  const [fileName, setFileName] = useState('');

  useEffect(() => {
    if (uid) {
      setFormData(prev => ({
        ...prev,
        patientId: uid,
        doctorName: doctor || userName
      }));
    }
  }, [uid, doctor]);

  const fetchRecord = async () => {
    try {
      const response = await fetch(`${BASE_URL}/medical_records/${uid}?type=${recordType}&sender=doctor`);
      if (!response.ok) {
        console.error("Failed fetching records", await response.text());
        setRecords([]);
        return;
      }
      const data = await response.json();
      setRecords(data || []);
    } catch (error) {
      console.error(`Error fetching ${recordName}:`, error);
      setRecords([]);
    }
  };

  useEffect(() => {
    if (recordName) fetchRecord();
  }, [recordName, uid, recordType]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setFormData(prev => ({ ...prev, pdfFile: file }));
      setFileName(file.name);
    } else {
      alert('Please upload a PDF file');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fileName) return alert('Please upload a PDF file');
    setLoading(true);
    try {
      const submitData = new FormData();
      submitData.append('patientId', formData.patientId);
      submitData.append('medication', formData.medication);
      submitData.append('notes', formData.notes);
      submitData.append('doctorName', formData.doctorName);
      if (formData.pdfFile) submitData.append('file', formData.pdfFile);

      const response = await fetch(`${BASE_URL}${postEndpoint}?sender=doctor`, {
        method: 'POST',
        body: submitData,
      });
      if (!response.ok) throw new Error(await response.text() || 'Failed');

      await fetchRecord();
      setFormData({ patientId: uid, medication: '', notes: '', pdfFile: null, doctorName: doctor });
      setFileName('');
      setLoading(false);
      setShowForm(false);
      alert(`${recordName} created successfully`);
    } catch (error) {
      console.error(error);
      setLoading(false);
      alert('Failed to create record. Try again.');
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

  return (
    <div>
      {recordName && <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-[150]">
        <div className="bg-[#fdbc23] rounded-xl p-4 w-full max-w-5xl h-full max-h-[86vh] relative overflow-auto mx-2 sm:mx-4">
          <div className="flex justify-between items-center mb-4">
            <div className="p-2">
              <h2 className="text-24 font-merriweather font-bold">Medical Records</h2>
              <h2 className="font-lato font-bold">{recordName}</h2>
            </div>
            <button onClick={setContainerClose} className=" text-5xl">&times;</button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4 mx-2 sm:mx-0">
            <div className="p-4 flex items-center justify-center gap-2 h-[180px] w-[240px] rounded-xl bg-[#ffffff] transition-colors cursor-pointer">
              <div onClick={setShowForm} className="flex justify-center items-center h-24 w-24 bg-[#D9D9D9] rounded-full cursor-pointer hover:scale-105 transition-transform">
                <span className="text-6xl text-gray-600 cursor-pointer">+</span>
              </div>
            </div>

            {records.map((record) => (
              <div
                key={record._id}
                className="p-3 flex flex-col justify-between w-full rounded-2xl bg-[#93d8c1] h-[180px]"
              >
                <div className="flex flex-col gap-1 overflow-hidden">
                  <p className="text-sm text-gray-700 truncate font-semibold">
                    Medicine: {record?.medication || "N/A"}
                  </p>

                  <p className="text-xs text-gray-700">
                    Note: {record?.notes || "NA"}
                  </p>
                  <p className="text-xs text-gray-700">
                    {formatDate(record?.createdAt)}
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
            ))}

            {showForm && (
              <div className="fixed inset-0 z-50 flex items-center justify-center">
                <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm" onClick={setShowForm} />
                <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto mx-2 sm:mx-4 my-4">
                  <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-800">New {recordName}</h2>
                    <button onClick={setShowForm} className="text-gray-500 hover:text-gray-700 transition">
                      <icons.MdClose size={24} />
                    </button>
                  </div>
                  <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Medication Name *</label>
                      <input type="text" name="medication" value={formData.medication} onChange={handleInputChange} required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        placeholder="e.g., Amoxicillin" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Additional Notes</label>
                      <textarea name="notes" value={formData.notes} onChange={handleInputChange} rows="3" required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
                        placeholder="Special instructions" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Upload {recordName} PDF</label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition">
                        <input name='file' type="file" accept=".pdf" onChange={handleFileChange} className="hidden" id="pdf-upload" />
                        <label htmlFor="pdf-upload" className="cursor-pointer flex flex-col items-center">
                          {fileName ? <span className="text-sm text-green-600 font-medium">{fileName}</span> :
                            <><span className="text-sm text-gray-600">Click to upload PDF</span><span className="text-xs text-gray-400 mt-1">Max 10MB</span></>}
                        </label>
                      </div>
                    </div>
                    <button type="submit" disabled={loading}
                      className={`max-w-[300px] w-full sm:max-w-[300px] mx-auto px-6 py-3 rounded-lg text-white font-medium flex items-center justify-center
                      ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"}`}>
                      {loading ? "Creating..." : `Create ${recordName}`}
                    </button>
                  </form>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>}
    </div>
  )
}

export default RecordModal;
