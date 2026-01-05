import { useState } from "react";
import Navbar from "../../components/Navbar";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";
import { BASE_URL } from "../../config/config.js";

const UploadMedicalRecords = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { uid, role } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !file) {
      alert("Please fill all details and upload a PDF file.");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("file", file);
    try {
      setLoading(true);
      if (!uid || !role) {
        console.log('Waiting for uid and role...', { uid, role });
        return;
      }
      const res = await fetch(`${BASE_URL}/medical_records/past/${uid}?sender=${role}`, {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Failed to upload record");

      await res.json();
      alert("Medical record uploaded successfully!");

      setName("");
      setEmail("");
      setFile(null);

      navigate("/patient-dashboard");
    } catch (error) {
      alert("Failed to upload record. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#76b1c1] min-h-screen flex flex-col">
      <Navbar navBG={"#76b1c1"} searchBarColor={"#93ced8"} />

      <div className="flex flex-1 justify-center items-center px-4">
        <div className="w-full max-w-xl bg-white/20 backdrop-blur-md p-8 rounded-2xl shadow-lg border border-white/40">
          <h2 className="font-merriweather text-3xl sm:text-4xl font-normal mb-4 text-center text-[#034a48]">
            Upload Medical Records
          </h2>

          <p className="text-center text-sm sm:text-base mb-6 text-[#043f3d] font-medium">
            Please upload your previous medical documents in below given field.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col">
              <label className="text-sm font-semibold mb-1">Name*</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="p-2 rounded-md bg-[#d9f3eb] border border-[#0a5b58] focus:outline-none focus:ring-2 focus:ring-[#0a5b58]"
                required
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-semibold mb-1">Email*</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="p-2 rounded-md bg-[#d9f3eb] border border-[#0a5b58] focus:outline-none focus:ring-2 focus:ring-[#0a5b58]"
                required
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-semibold mb-1">Upload PDF*</label>
              <input
                type="file"
                accept="application/pdf"
                onChange={(e) => setFile(e.target.files[0])}
                className="p-2 rounded-md bg-[#d9f3eb] border border-[#0a5b58] focus:outline-none"
                required
              />
              <span className="text-xs mt-1 text-[#0a5b58] font-semibold">maximum file size 10mb</span>
            </div>
            <button
              type="submit"
              disabled={loading}
              className={`p-3 rounded-lg text-white text-lg font-semibold transition-all mt-4 ${loading
                ? "bg-[#0a5b5890] cursor-not-allowed"
                : "bg-[#0a5b58] hover:bg-[#094946]"
                }`}
            >
              {loading ? "Uploading..." : "Upload Record"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UploadMedicalRecords;
