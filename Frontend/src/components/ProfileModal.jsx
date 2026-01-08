import React, { useEffect, useState } from "react";
import { BASE_URL } from "../config/config.js"
import { useAuth } from "../Context/AuthContext"
const ProfileModal = ({ onClose }) => {
  const { uid, updateAuthUser } = useAuth()
  const [formData, setFormData] = useState({
    phoneNumber: "",
    medicalHistory: "",
    previousHospitalizations: "",
    allergies: "",
    age: "",
    dateOfBirth: "",
    gender: "",
    oxymeterHeartbeat: "",
    bloodType: "",
    height: "",
    weight: "",
    country: "",
    state: "",
    city: "",
    street: "",
    bloodPressure: "",
    diabetes: "",
    existingInsurance: ""
  });
  const [editMode, setEditMode] = useState(false);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [loadingCountries, setLoadingCountries] = useState(false);
  const [loadingStates, setLoadingStates] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);

  useEffect(() => {
    const getUserProfiledData = async () => {
      try {
        if (editMode) return;
        const response = await fetch(`${BASE_URL}/users/profile/${uid}`)
        const data = await response.json()
        console.log(data)
        if (response.status === 200) {
          updateAuthUser({
            isProfileAdded: true,
            gender: formData.gender
          });
        }
        if (data?.profile) {
          setFormData((prev) => ({
            ...prev,
            ...data.profile
          }));
        }
      } catch (error) {
        console.log("error while updating user profile data", error)
      }
    }
    getUserProfiledData()
  }, [uid, editMode])

  useEffect(() => {
    if (!editMode) return;
    const fetchCountries = async () => {
      setLoadingCountries(true);
      try {
        const response = await fetch('https://countriesnow.space/api/v0.1/countries');
        const data = await response.json();
        if (data.data) {
          setCountries(data.data);
        }
      } catch (error) {
        console.error('Error fetching countries:', error);
      } finally {
        setLoadingCountries(false);
      }
    };
    fetchCountries();
  }, [editMode]);

  useEffect(() => {
    if (editMode && formData.country) {
      fetchStates(formData.country);
    }
  }, [editMode, formData.country]);
  useEffect(() => {
    if (editMode && formData.country && formData.state) {
      fetchCities(formData.country, formData.state);
    }
  }, [editMode, formData.state]);

  const fetchStates = async (country) => {
    setLoadingStates(true);
    try {
      const response = await fetch('https://countriesnow.space/api/v0.1/countries/states', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ country })
      });
      const data = await response.json();
      if (data.data && data.data.states) {
        setStates(data.data.states);
      } else {
        setStates([]);
      }
    } catch (error) {
      console.error('Error fetching states:', error);
      setStates([]);
    } finally {
      setLoadingStates(false);
    }
  };

  const fetchCities = async (country, state) => {
    setLoadingCities(true);
    try {
      const response = await fetch('https://countriesnow.space/api/v0.1/countries/state/cities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ country, state })
      });
      const data = await response.json();
      if (data.data) {
        setCities(data.data);
      } else {
        setCities([]);
      }
    } catch (error) {
      console.error('Error fetching cities:', error);
      setCities([]);
    } finally {
      setLoadingCities(false);
    }
  };



  const handleChange = (e) => {
    const { name, value } = e.target;

    // For phone: allow only digits
    if (name === "phoneNumber") {
      if (!/^\d*$/.test(value)) return;
      return setFormData({ ...formData, [name]: value });
    }

    if (name === "country") {
      setFormData(prev => ({
        ...prev,
        country: value,
        state: '',
        city: ''
      }));
      if (value) {
        fetchStates(value);
      } else {
        setStates([]);
        setCities([]);
      }
      return;
    }

    if (name === "state") {
      setFormData(prev => ({
        ...prev,
        state: value,
        city: ''
      }));
      if (value && formData.country) {
        fetchCities(formData.country, value);
      } else {
        setCities([]);
      }
      return;
    }

    if (name === "dateOfBirth") {
      // Calculate age
      const today = new Date();
      const birthDate = new Date(value);
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      setFormData(prev => ({
        ...prev,
        dateOfBirth: value,
        age: age.toString()
      }));
      return;
    }

    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate age matches DOB
    if (formData.dateOfBirth) {
      const today = new Date();
      const birthDate = new Date(formData.dateOfBirth);
      let calculatedAge = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        calculatedAge--;
      }
      if (parseInt(formData.age) !== calculatedAge) {
        alert("Age does not match the selected Date of Birth.");
        return;
      }
    }

    setEditMode(false);
    try {
      const response = await fetch(`${BASE_URL}/users/profile/${uid}`, {
        method: 'PATCH',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })
      const data = await response.json()
      alert(data.message)
    } catch (error) {
      console.log("error while updating user profile data", error)
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-[999] px-3">
      <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-xl shadow-xl relative overflow-hidden">

        {/* CLOSE BUTTON */}
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-xl font-bold text-gray-800 z-10"
        >
          ✕
        </button>

        {/* TITLE */}
        <div className="p-6 pb-4">
          <h2 className="text-3xl text-center text-gray-900 font-bold">
            {editMode ? "Edit Profile" : "Your Profile"}
          </h2>
        </div>

        <div className="px-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          <form className="space-y-4">
            {/* NAME & PHONE */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor='fullName' className="block text-gray-800 font-medium mb-2">Full Name*</label>
                <input
                  id='fullName'
                  type="text"
                  name="fullName"
                  disabled
                  value={formData.fullName || ''}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-[#Add0Da] border border-black focus:outline-none uppercase ${editMode ? "bg-white cursor-not-allowed" : "cursor-not-allowed"}`}
                />
              </div>

              <div>
                <label htmlFor='number' className="block text-gray-800 font-medium mb-2">Phone Number*</label>
                <input
                  id='number'
                  type="text"
                  name="phoneNumber"
                  disabled={!editMode}
                  value={formData.phoneNumber || ''}
                  maxLength={10}
                  inputMode="numeric"
                  pattern="[0-9]*"
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-[#Add0Da] border border-black focus:outline-none ${editMode ? "bg-white" : "cursor-not-allowed"}`}
                />
              </div>
            </div>

            {/* EMAIL & MEDICAL HISTORY */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor='email' className="block text-gray-800 font-medium mb-2">Email*</label>
                <input
                  id='email'
                  type="text"
                  name="email"
                  disabled
                  value={formData.email || ''}
                  className={`w-full px-4 py-3 bg-[#Add0Da] border border-black focus:outline-none ${editMode ? "bg-white cursor-not-allowed" : "cursor-not-allowed"}`}
                />
              </div>

              <div>
                <label htmlFor='medicalHistory' className="block text-gray-800 font-medium mb-2">Medical History</label>
                <input
                  id='medicalHistory'
                  type="text"
                  name="medicalHistory"
                  disabled={!editMode}
                  value={formData.medicalHistory || ''}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-[#Add0Da] border border-black focus:outline-none uppercase ${editMode ? "bg-white" : "cursor-not-allowed"}`}
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
                  disabled={!editMode}
                  value={formData.previousHospitalizations || ''}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-[#Add0Da] border border-black focus:outline-none uppercase ${editMode ? "bg-white" : "cursor-not-allowed"}`}
                />
              </div>

              <div>
                <label htmlFor='allergies' className="block text-gray-800 font-medium mb-2">Allergies</label>
                <input
                  id='allergies'
                  type="text"
                  name="allergies"
                  disabled={!editMode}
                  value={formData.allergies || ''}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-[#Add0Da] border border-black focus:outline-none uppercase ${editMode ? "bg-white" : "cursor-not-allowed"}`}
                />
              </div>
            </div>

            {/* AGE, DOB, GENDER, OXYMETER */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

              {/* LEFT SIDE */}
              <div className="grid grid-cols-12 gap-4">

                {/* DOB */}
                <div className="col-span-4">
                  <label className="block h-[20px] text-gray-800 font-medium mb-2 whitespace-nowrap">
                    DOB*
                  </label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    disabled={!editMode}
                    value={formData.dateOfBirth || ""}
                    onChange={handleChange}
                    className={`w-full h-[48px] px-2 border border-black focus:outline-none ${editMode ? "bg-white" : "bg-[#Add0Da] cursor-not-allowed"
                      }`}
                  />
                </div>

                {/* AGE */}
                <div className="col-span-2">
                  <label className="block h-[20px] text-gray-800 font-medium mb-2 whitespace-nowrap">
                    Age*
                  </label>
                  <input
                    type="number"
                    name="age"
                    disabled={!editMode}
                    value={formData.age || ""}
                    onChange={handleChange}
                    className={`w-full h-[48px] px-2 border border-black focus:outline-none ${editMode ? "bg-white" : "bg-[#Add0Da] cursor-not-allowed"
                      }`}
                  />
                </div>

                {/* GENDER */}
                <div className="col-span-3">
                  <label className="block h-[20px] text-gray-800 font-medium mb-2 whitespace-nowrap">
                    Gender*
                  </label>
                  <select
                    name="gender"
                    disabled={!editMode}
                    value={formData.gender || ""}
                    onChange={handleChange}
                    className={`w-full h-[48px] px-4 text-sm border border-black focus:outline-none uppercase  appearance-none
  ${editMode ? "bg-white" : "bg-[#Add0Da] cursor-not-allowed"}`}
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>

                </div>

                {/* OXYMETER */}
                <div className="col-span-3">
                  <label className="block h-[20px] text-gray-800 font-medium mb-2 whitespace-nowrap">
                    Oxymeter HB
                  </label>
                  <input
                    type="number"
                    name="oxymeterHeartbeat"
                    disabled={!editMode}
                    value={formData.oxymeterHeartbeat || ""}
                    onChange={handleChange}
                    className={`w-full h-[48px] px-2 border border-black focus:outline-none ${editMode ? "bg-white" : "bg-[#Add0Da] cursor-not-allowed"
                      }`}
                  />
                </div>

              </div>

              {/* RIGHT SIDE */}
              <div className="grid grid-cols-12 gap-4">

                <div className="col-span-5">
                  <label className="block h-[20px] text-gray-800 font-medium mb-2 whitespace-nowrap">
                    Blood Type*
                  </label>
                  <select
                    name="bloodType"
                    disabled={!editMode}
                    value={formData.bloodType || ""}
                    onChange={handleChange}
                    className={`w-full h-[48px] px-4 text-sm border border-black focus:outline-none
      ${editMode ? "bg-white" : "bg-[#Add0Da] cursor-not-allowed"}`}
                  >
                    <option value="">Blood Type</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                </div>

                <div className="col-span-3">
                  <label className="block h-[20px] text-gray-800 font-medium mb-2 whitespace-nowrap">
                    Height*
                  </label>
                  <input
                    type="number"
                    name="height"
                    disabled={!editMode}
                    value={formData.height || ""}
                    onChange={handleChange}
                    className={`w-full h-[48px] px-2 border border-black focus:outline-none
      ${editMode ? "bg-white" : "bg-[#Add0Da] cursor-not-allowed"}`}
                  />
                </div>

                <div className="col-span-4">
                  <label className="block h-[20px] text-gray-800 font-medium mb-2 whitespace-nowrap">
                    Weight*
                  </label>
                  <input
                    type="number"
                    name="weight"
                    disabled={!editMode}
                    value={formData.weight || ""}
                    onChange={handleChange}
                    className={`w-full h-[48px] px-2 border border-black focus:outline-none
      ${editMode ? "bg-white" : "bg-[#Add0Da] cursor-not-allowed"}`}
                  />
                </div>

              </div>
            </div>



            {/* ADDRESS, BP, DIABETES */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor='country' className="block text-gray-800 font-medium mb-2">Country</label>
                  <select
                    id='country'
                    name="country"
                    disabled={!editMode}
                    value={formData.country || ''}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 bg-[#Add0Da] border border-black focus:outline-none ${editMode ? "bg-white" : "cursor-not-allowed"}`}
                  >
                    {editMode ? (
                      <>
                        <option value="">Select Country</option>
                        {loadingCountries ? (
                          <option disabled>Loading...</option>
                        ) : (
                          countries.map((country, index) => (
                            <option key={index} value={country.country}>
                              {country.country}
                            </option>
                          ))
                        )}
                      </>
                    ) : (
                      <option value={formData.country || ""}>{formData.country || "N/A"}</option>
                    )}
                  </select>
                </div>
                <div>
                  <label htmlFor='state' className="block text-gray-800 font-medium mb-2">State</label>
                  <select
                    id='state'
                    name="state"
                    disabled={!editMode}
                    value={formData.state || ''}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 bg-[#Add0Da] border border-black focus:outline-none ${editMode ? "bg-white" : "cursor-not-allowed"}`}
                  >
                    {editMode ? (
                      <>
                        <option value="">Select State</option>
                        {loadingStates ? (
                          <option disabled>Loading...</option>
                        ) : (
                          states.map((state, index) => (
                            <option key={index} value={state.name || state}>
                              {state.name || state}
                            </option>
                          ))
                        )}
                      </>
                    ) : (
                      <option value={formData.state || ""}>{formData.state || "N/A"}</option>
                    )}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor='city' className="block text-gray-800 font-medium mb-2">City</label>
                  <select
                    id='city'
                    name="city"
                    disabled={!editMode}
                    value={formData.city || ''}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 bg-[#Add0Da] border border-black focus:outline-none ${editMode ? "bg-white" : "cursor-not-allowed"}`}
                  >
                    {editMode ? (
                      <>
                        <option value="">Select City</option>
                        {loadingCities ? (
                          <option disabled>Loading...</option>
                        ) : (
                          cities.map((city, index) => (
                            <option key={index} value={city}>
                              {city}
                            </option>
                          ))
                        )}
                      </>
                    ) : (
                      <option value={formData.city || ""}>{formData.city || "N/A"}</option>
                    )}
                  </select>
                </div>
                <div>
                  <label htmlFor='street' className="block text-gray-800 font-medium mb-2">Street</label>
                  <input
                    id='street'
                    type="text"
                    name="street"
                    disabled={!editMode}
                    value={formData.street || ''}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 bg-[#Add0Da] border border-black focus:outline-none uppercase ${editMode ? "bg-white" : "cursor-not-allowed"}`}
                    placeholder={editMode ? 'Enter street address' : formData.street || 'N/A'}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor='bloodPressure' className="block text-gray-800 font-medium mb-2">Blood Pressure*</label>
                  <input
                    id='bloodPressure'
                    type="text"
                    name="bloodPressure"
                    disabled={!editMode}
                    value={formData.bloodPressure || ''}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 bg-[#Add0Da] border border-black focus:outline-none ${editMode ? "bg-white" : "cursor-not-allowed"}`}
                  />
                </div>

                <div>
                  <label htmlFor='diabetes' className="block text-gray-800 font-medium mb-2">Diabetes*</label>
                  <input
                    id='diabetes'
                    type="text"
                    name="diabetes"
                    disabled={!editMode}
                    value={formData.diabetes || ''}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 bg-[#Add0Da] border border-black focus:outline-none uppercase ${editMode ? "bg-white" : "cursor-not-allowed"}`}
                  />
                </div>
              </div>
              <div>
                <label htmlFor='existingMedicalInsurance' className="block text-gray-800 font-medium mb-2">Existing Medical Insurance</label>
                <input
                  id='existingMedicalInsurance'
                  type="text"
                  name="existingInsurance"
                  disabled={!editMode}
                  value={formData.existingInsurance || ''}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-[#Add0Da] border border-black focus:outline-none uppercase ${editMode ? "bg-white" : "cursor-not-allowed"}`}
                />
              </div>
            </div>


          </form>
        </div>

        {/* STICKY BUTTONS FOOTER */}
        <div className="flex justify-center gap-4 py-6 px-6 border-t border-gray-200 bg-white">
          {!editMode ? (
            <button
              type="button"
              onClick={() => {
                setEditMode(true);
              }}
              className="px-10 py-3 bg-blue-300 border border-black font-medium hover:bg-blue-400 transition-colors"
            >
              Edit Profile
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              type="submit"
              className="px-10 py-3 bg-[#Add0Da] border border-black font-medium hover:bg-[#9dc0ca] transition-colors"
            >
              Save Changes
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
