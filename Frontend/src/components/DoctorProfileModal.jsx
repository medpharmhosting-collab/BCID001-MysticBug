import { useEffect, useState } from "react"
import Loader from "../Pages/admin/Loader";
import { BASE_URL } from "../config/config.js";

const DoctorProfileModal = ({ onclose, selectedDoctorForReview, selectedDoctorProfileId }) => {
  const [doctorProfileData, setDoctorProfileData] = useState(null)
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!selectedDoctorProfileId) {
      setDoctorProfileData(null);
      return;
    }
    const fetchDoctorProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${BASE_URL}/doctors/get_doctor_by_id/${selectedDoctorProfileId}`)
        const data = await response.json()
        setDoctorProfileData(data?.doctorProfile)
        setLoading(false)
        setError(null)
      } catch (error) {
        console.log("error while getting doctor profile", error.message)
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }
    fetchDoctorProfile()
  }, [selectedDoctorProfileId])

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-[200] p-4">
      <div className="bg-[#d6f7ff] rounded-2xl w-full max-w-3xl h-[81vh] overflow-y-auto relative shadow-2xl">
        {error && <p className="text-red-600 flex justify-center">{error}</p>}
        <div className="sticky top-0 bg-[#d6f7ff] z-10 p-6 pb-4 border-b border-[#b8e6f0]">
          <div className="flex items-start justify-between mb-4">
            <h1 className="text-3xl font-bold text-[#0a5b58]">
              {selectedDoctorForReview}
            </h1>
            <button
              onClick={onclose}
              className="rounded-lg px-5 py-2 text-white bg-[#0a5b58] hover:bg-[#083d47] transition-colors font-semibold"
            >
              BACK
            </button>
          </div>
        </div>
        {loading ? (
          <div className="flex justify-center p-10">
            <Loader />
          </div>
        ) : (
          <div className="px-4 sm:px-8 md:px-12 py-4">
            <form className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 ">
              <div className="flex flex-col">
                <label htmlFor="doctorName" className="mb-1 font-medium text-sm sm:text-base">
                  Doctor Name
                </label>
                <input
                  type="text"
                  id="doctorName"
                  value={doctorProfileData?.name}
                  readOnly
                  className="w-full p-3 border border-gray-300 cursor-not-allowed outline-none bg-gray-50 rounded-lg"
                />
              </div>

              <div className="flex flex-col">
                <label htmlFor="qualifications" className="mb-1 font-medium text-sm sm:text-base">
                  Qualifications
                </label>
                <input
                  type="text"
                  id="qualifications"
                  value={doctorProfileData?.qualification}
                  readOnly
                  className="w-full p-3 border border-gray-300 cursor-not-allowed outline-none bg-gray-50 rounded-lg"
                />
              </div>

              <div className="flex flex-col">
                <label htmlFor="designation" className="mb-1 font-medium text-sm sm:text-base">
                  Designation
                </label>
                <input
                  type="text"
                  id="designation"
                  value={doctorProfileData?.designation}
                  readOnly
                  className="w-full p-3 border border-gray-300 cursor-not-allowed outline-none bg-gray-50 rounded-lg"
                />
              </div>

              <div className="flex flex-col">
                <label htmlFor="typeOfDoctor" className="mb-1 font-medium text-sm sm:text-base">
                  Type of Doctor
                </label>
                <input
                  type="text"
                  id="typeOfDoctor"
                  value={doctorProfileData?.typeOfDoctor}
                  readOnly
                  className="w-full p-3 border border-gray-300 cursor-not-allowed outline-none bg-gray-50 rounded-lg"
                />
              </div>

              <div className="flex flex-col">
                <label htmlFor="specialistDetails" className="mb-1 font-medium text-sm sm:text-base">
                  Specialist Details
                </label>
                <input
                  type="text"
                  id="specialistDetails"
                  value={doctorProfileData?.specialization}
                  readOnly
                  className="w-full p-3 border border-gray-300 cursor-not-allowed outline-none bg-gray-50 rounded-lg"
                />
              </div>

              <div className="flex flex-col">
                <label htmlFor="experience" className="mb-1 font-medium text-sm sm:text-base">
                  Years of Experience
                </label>
                <input
                  type="number"
                  id="experience"
                  inputMode="none"
                  value={doctorProfileData?.experience}
                  readOnly
                  className="w-full p-3 border border-gray-300 cursor-not-allowed outline-none bg-gray-50 rounded-lg"
                />
              </div>

              <div className="flex flex-col">
                <label htmlFor="gender" className="mb-1 font-medium text-sm sm:text-base">
                  Gender
                </label>
                <input
                  type="text"
                  id="gender"
                  value={doctorProfileData?.gender}
                  readOnly
                  className="w-full p-3 border border-gray-300 cursor-not-allowed outline-none bg-gray-50 rounded-lg"
                />
              </div>

              <div className="flex flex-col">
                <label htmlFor="email" className="mb-1 font-medium text-sm sm:text-base">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={doctorProfileData?.email}
                  readOnly
                  className="w-full p-3 border border-gray-300 cursor-not-allowed outline-none bg-gray-50 rounded-lg"
                />
              </div>
            </form>
          </div>
        )}
      </div>
    </div >
  )
}

export default DoctorProfileModal
