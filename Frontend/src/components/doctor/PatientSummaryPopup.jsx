
import { useEffect, useState } from "react"
import { images } from "../../assets/assets.js"
import { BASE_URL } from "../../config/config.js"
const PatientSummaryPopup = ({ recordPopup, setRecordPopup, uid }) => {
  const [patientProfileData, setPatientProfileData] = useState({})

  useEffect(() => {
    const getUserProfiledData = async () => {
      try {
        const response = await fetch(`${BASE_URL}/users/profile/${uid}`)
        const data = await response.json()
        setPatientProfileData(data.profile)
      } catch (error) {
        console.log("error while updating user profile data", error)
      }
    }
    getUserProfiledData()
  }, [uid])
  return (
    <div>
      {recordPopup && <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
        <div className="relative bg-[#fdbc23] rounded-xl p-4 w-full max-w-5xl max-h-[75vh] mt-3 overflow-hidden mx-3 sm:mx-0">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-24 font-merriweather font-bold">Patient Record Summary</h2>
            </div>
            <button
              onClick={() => setRecordPopup(false)}
              className="text-5xl"
            >
              &times;
            </button>
          </div>
          <div className='max-w-3xl max-h-[calc(75vh-80px)] overflow-auto pr-2'>
            <form className="space-y-4 mb-2">
              {/* NAME & PHONE */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor='fullName' className="block text-gray-800 font-medium mb-2">Full Name</label>
                  <input
                    id='fullName'
                    type="text"
                    name="fullName"
                    value={patientProfileData.fullName || "NA"}
                    readOnly
                    className="w-full px-4 py-3 bg-[#f3e8da] border border-black focus:outline-none uppercase cursor-not-allowed"
                  />
                </div>

                <div>
                  <label htmlFor='number' className="block text-gray-800 font-medium mb-2">Phone Number</label>
                  <input
                    id='number'
                    type="text"
                    name="phoneNumber"
                    value={patientProfileData.phoneNumber || "NA"}
                    maxLength={10}
                    readOnly
                    className="w-full px-4 py-3 bg-[#f3e8da] border border-black focus:outline-none uppercase cursor-not-allowed"
                  />
                </div>
              </div>

              {/* EMAIL & MEDICAL HISTORY */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor='email' className="block text-gray-800 font-medium mb-2">Email</label>
                  <input
                    id='email'
                    type="text"
                    name="email"
                    value={patientProfileData.email || "NA"}
                    readOnly
                    className="w-full px-4 py-3 bg-[#f3e8da] border border-black focus:outline-none uppercase cursor-not-allowed"
                  />
                </div>

                <div>
                  <label htmlFor='medicalHistory' className="block text-gray-800 font-medium mb-2">Medical History</label>
                  <input
                    id='medicalHistory'
                    type="text"
                    name="medicalHistory"
                    value={patientProfileData.medicalHistory || "NA"}
                    readOnly
                    className="w-full px-4 py-3 bg-[#f3e8da] border border-black focus:outline-none uppercase cursor-not-allowed"
                  />
                </div>
              </div>

              {/* HOSPITALIZATION & ALLERGIES */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor='previousHospitalizations' className="block text-gray-800 font-medium mb-2">
                    Previous Hospitalizations / Surgeries
                  </label>
                  <input
                    id='previousHospitalizations'
                    type="text"
                    name="previousHospitalizations"
                    value={patientProfileData.previousHospitalizations || "NA"}
                    readOnly
                    className="w-full px-4 py-3 bg-[#f3e8da] border border-black focus:outline-none uppercase cursor-not-allowed"
                  />
                </div>

                <div>
                  <label htmlFor='allergies' className="block text-gray-800 font-medium mb-2">Allergies</label>
                  <input
                    id='allergies'
                    type="text"
                    name="allergies"
                    value={patientProfileData.allergies || "NA"}
                    readOnly
                    className="w-full px-4 py-3 bg-[#f3e8da] border border-black focus:outline-none uppercase cursor-not-allowed"
                  />
                </div>
              </div>

              {/* AGE, DOB, GENDER, OXYMETER - FIXED GRID */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* LEFT SIDE BLOCK */}
                <div className="grid grid-cols-[auto_1fr_1fr_1fr] gap-2">
                  <div>
                    <label htmlFor='age' className="block text-gray-800 font-medium mb-2 text-sm">Age</label>
                    <input
                      id='age'
                      type="number"
                      name="age"
                      value={patientProfileData.age || "NA"}
                      readOnly
                      className="w-[50px] px-2 py-3 bg-[#f3e8da] border border-black focus:outline-none cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label htmlFor='dob' className="block text-gray-800 font-medium mb-2 text-sm">DOB</label>
                    <input
                      id='dob'
                      type="text"
                      name="dateOfBirth"
                      value={patientProfileData.dateOfBirth || "NA"}
                      readOnly
                      className="w-full px-2 py-3 bg-[#f3e8da] border border-black focus:outline-none cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label htmlFor='gender' className="block text-gray-800 font-medium mb-2 text-sm">Gender</label>
                    <input
                      id='gender'
                      type="text"
                      name="gender"
                      value={patientProfileData.gender || "NA"}
                      readOnly
                      className="w-full px-2 py-3 bg-[#f3e8da] border border-black focus:outline-none uppercase cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label htmlFor='oxymeter' className="block text-gray-800 font-medium mb-2 text-sm">Oxymeter HB</label>
                    <input
                      id='oxymeter'
                      type="text"
                      name="oxymeterHeartbeat"
                      value={patientProfileData.oxymeterHeartbeat || "NA"}
                      readOnly
                      className="w-full px-2 py-3 bg-[#f3e8da] border border-black focus:outline-none cursor-not-allowed"
                    />
                  </div>
                </div>

                {/* RIGHT SIDE BLOCK */}
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label htmlFor='bloodType' className="block text-gray-800 font-medium mb-2 text-sm">Blood Type</label>
                    <input
                      id='bloodType'
                      type="text"
                      name="bloodType"
                      value={patientProfileData.bloodType || "NA"}
                      readOnly
                      className="w-full px-2 py-3 bg-[#f3e8da] border border-black focus:outline-none uppercase cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label htmlFor='height' className="block text-gray-800 font-medium mb-2 text-sm">Height</label>
                    <input
                      id='height'
                      type="text"
                      name="height"
                      value={patientProfileData.height || "NA"}
                      readOnly
                      className="w-full px-2 py-3 bg-[#f3e8da] border border-black focus:outline-none cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label htmlFor='weight' className="block text-gray-800 font-medium mb-2 text-sm">Weight</label>
                    <input
                      id='weight'
                      type="text"
                      name="weight"
                      value={patientProfileData.weight || "NA"}
                      readOnly
                      className="w-full px-2 py-3 bg-[#f3e8da] border border-black focus:outline-none cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>

              {/* ADDRESS, BP, DIABETES */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor='address' className="block text-gray-800 font-medium mb-2">Address</label>
                  <input
                    id='address'
                    type="text"
                    name="address"
                    value={patientProfileData.address || "NA"}
                    readOnly
                    className="w-full px-4 py-3 bg-[#f3e8da] border border-black focus:outline-none uppercase cursor-not-allowed"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor='bloodPressure' className="block text-gray-800 font-medium mb-2">Blood Pressure</label>
                    <input
                      id='bloodPressure'
                      type="text"
                      name="bloodPressure"
                      value={patientProfileData.bloodPressure || "NA"}
                      readOnly
                      className="w-full px-4 py-3 bg-[#f3e8da] border border-black focus:outline-none uppercase cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label htmlFor='diabetes' className="block text-gray-800 font-medium mb-2">Diabetes</label>
                    <input
                      id='diabetes'
                      type="text"
                      name="diabetes"
                      value={patientProfileData.diabetes || "NA"}
                      readOnly
                      className="w-full px-4 py-3 bg-[#f3e8da] border border-black focus:outline-none uppercase cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>

              {/* INSURANCE */}
              <div>
                <label htmlFor='existingMedicalInsurance' className="block text-gray-800 font-medium mb-2">Existing Medical Insurance</label>
                <input
                  id='existingMedicalInsurance'
                  type="text"
                  name="existingInsurance"
                  value={patientProfileData.existingInsurance || "NA"}
                  readOnly
                  className="w-full px-4 py-3 bg-[#f3e8da] border border-black focus:outline-none uppercase cursor-not-allowed"
                />
              </div>
            </form>
          </div>
          <img src={images.Patient} alt="Patient" className='hidden sm:block w-[160px] sm:w-[200px] h-[160px] sm:h-[200px] absolute bottom-0 right-5 pointer-events-none' />
        </div>
      </div>}
    </div>
  )
}

export default PatientSummaryPopup
