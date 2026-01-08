import { useState, useEffect } from 'react';
import { images } from '../assets/assets';
import { BASE_URL } from "../config/config.js";
import { useAuth } from "../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import { firebaseAuth } from "../Context/AuthContext";

const TellUsAboutYourself = () => {
  const navigate = useNavigate();
  const { uid, updateAuthUser, userName } = useAuth()
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    email: '',
    medicalHistory: '',
    previousHospitalizations: '',
    allergies: '',
    age: '',
    dateOfBirth: '',
    gender: '',
    oxymeterHeartbeat: '',
    bloodType: '',
    height: '',
    weight: '',
    country: '',
    state: '',
    city: '',
    street: '',
    bloodPressure: '',
    diabetes: '',
    existingInsurance: ''
  });

  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [loadingCountries, setLoadingCountries] = useState(false);
  const [loadingStates, setLoadingStates] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);

  useEffect(() => {
    // Set fullName and email from context/firebase
    setFormData(prev => ({
      ...prev,
      fullName: userName || '',
      email: firebaseAuth.currentUser?.email || ''
    }));
  }, [userName]);

  useEffect(() => {
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
  }, []);

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

    try {
      const res = await fetch(`${BASE_URL}/users/profile/${uid}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      // Update auth context with profile added status
      updateAuthUser({ isProfileAdded: true, gender: formData.gender, phoneNumber: formData.phoneNumber });

      alert("Profile added successfully!");
      navigate("/patient-dashboard");

    } catch (err) {
      console.log(err);
      alert("Something went wrong!");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br bg-[#76b1c1] relative overflow-hidden">
      <div className="relative z-10 container mx-auto px-4 py-8 max-w-6xl">
        <h2 className="text-5xl text-center text-gray-900 font-bold mb-8">
          Tell us a bit more about yourself!
        </h2>
        <form onSubmit={handleSubmit} className="space-y-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor='fullName' className="block text-gray-800 font-medium mb-2">Full Name*</label>
              <input
                id='fullName'
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-[#Add0Da] border border-black  focus:outline-none placeholder:text-gray-700 uppercase placeholder:lowercase cursor-not-allowed"
                placeholder='enter name'
                disabled
                required
              />
            </div>
            <div>
              <label htmlFor='number' className="block text-gray-800 font-medium mb-2">Phone Number*</label>
              <input
                id='number'
                type="text"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                maxLength={10}
                inputMode="numeric"
                pattern="[0-9]*"
                className="w-full px-4 py-3 bg-[#Add0Da] border border-black  focus:outline-none placeholder:text-gray-700 uppercase placeholder:lowercase"
                placeholder='enter phone number'
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor='email' className="block text-gray-800 font-medium mb-2">Email*</label>
              <input
                id='email'
                type="text"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder='email@example.com'
                className="w-full px-4 py-3 bg-[#Add0Da] border border-black  focus:outline-none placeholder:text-gray-700 uppercase placeholder:lowercase cursor-not-allowed"
                disabled
                required
              />
            </div>
            <div>
              <label htmlFor='medicalHistory' className="block text-gray-800 font-medium mb-2">Medical History</label>
              <input
                id='medicalHistory'
                type="text"
                name="medicalHistory"
                placeholder="enter here"
                value={formData.medicalHistory}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-[#Add0Da] border border-black  focus:outline-none  placeholder-gray-700 uppercase placeholder:lowercase"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor='previousHospitalizations' className="block text-gray-800 font-medium mb-2">Previous Hospitalizations/Surgeries</label>
              <input
                id='previousHospitalizations'
                type="text"
                name="previousHospitalizations"
                placeholder="enter here"
                value={formData.previousHospitalizations}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-[#Add0Da] border border-black  focus:outline-none  placeholder-gray-700 uppercase placeholder:lowercase"
                required
              />
            </div>
            <div>
              <label htmlFor='allergies' className="block text-gray-800 font-medium mb-2">Allergies</label>
              <input
                id='allergies'
                type="text"
                name="allergies"
                placeholder="enter here"
                value={formData.allergies}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-[#Add0Da] border border-black  focus:outline-none  placeholder-gray-700 uppercase placeholder:lowercase"

              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 whitespace-nowrap">
            <div className="flex gap-2 flex-wrap md:flex-nowrap">

              <div className="w-[170px]">
                <label htmlFor='dob' className="block text-gray-800 font-medium mb-2">Date of Birth*</label>
                <input
                  id='dob'
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  className="w-full h-[50px] px-3 py-3 bg-[#Add0Da] border border-black focus:outline-none"
                  required
                />
              </div>

              <div className="w-[80px]">
                <label htmlFor='age' className="block text-gray-800 font-medium mb-2">Age*</label>
                <input
                  id='age'
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  className="w-full px-2 py-3 bg-[#Add0Da] border border-black focus:outline-none placeholder-gray-700"
                  placeholder='00'
                  min={0}
                  required
                />
              </div>

              <div className="w-[200px]">
                <label htmlFor='gender' className="block text-gray-800 font-medium mb-2">Gender*</label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full h-[50px] px-3 py-3 bg-[#Add0Da] border border-black focus:outline-none text-sm"
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="w-[140px]">
                <label htmlFor='oxymeter' className="block text-gray-800 font-medium mb-2">Oxymeter Heartbeat</label>
                <input
                  id='oxymeter'
                  type="number"
                  name="oxymeterHeartbeat"
                  value={formData.oxymeterHeartbeat}
                  onChange={handleChange}
                  className="w-full px-3 py-3 bg-[#Add0Da] border border-black focus:outline-none uppercase placeholder-gray-700"
                  placeholder='000'
                />
              </div>
            </div>
            <div className="flex gap-2 flex-wrap md:flex-nowrap">
              <div className="w-[180px]">
                <label htmlFor='bloodType' className="block text-gray-800 font-medium mb-2">
                  Blood Type*
                </label>
                <select
                  id='bloodType'
                  name="bloodType"
                  value={formData.bloodType}
                  onChange={handleChange}
                  className="w-full h-[50px] px-4 bg-[#Add0Da] border border-black focus:outline-none text-sm"
                  required
                >
                  <option value="">Select Blood Type</option>
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

              <div className="w-[180px]">
                <label htmlFor='height' className="block text-gray-800 font-medium mb-2">
                  Height
                </label>
                <input
                  id='height'
                  type="number"
                  name="height"
                  value={formData.height}
                  onChange={handleChange}
                  className="w-full h-[50px] px-3 bg-[#Add0Da] border border-black focus:outline-none placeholder:text-gray-800"
                  placeholder='00'
                />
              </div>

              <div className="w-[180px]">
                <label htmlFor='weight' className="block text-gray-800 font-medium mb-2">
                  Weight
                </label>
                <input
                  id='weight'
                  type="number"
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                  className="w-full h-[50px] px-3 bg-[#Add0Da] border border-black focus:outline-none placeholder:text-gray-800"
                  placeholder='00'
                />
              </div>
            </div>

          </div>


          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor='country' className="block text-gray-800 font-medium mb-2">Country*</label>
                <select
                  id='country'
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-[#Add0Da] border border-black focus:outline-none"
                  required
                >
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
                </select>
              </div>
              <div>
                <label htmlFor='state' className="block text-gray-800 font-medium mb-2">State*</label>
                <select
                  id='state'
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-[#Add0Da] border border-black focus:outline-none"
                  required
                  disabled={!formData.country}
                >
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
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor='city' className="block text-gray-800 font-medium mb-2">City*</label>
                <select
                  id='city'
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-[#Add0Da] border border-black focus:outline-none"
                  required
                  disabled={!formData.state}
                >
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
                </select>
              </div>
              <div>
                <label htmlFor='street' className="block text-gray-800 font-medium mb-2">Street*</label>
                <input
                  id='street'
                  type="text"
                  name="street"
                  value={formData.street}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-[#Add0Da] border border-black focus:outline-none placeholder:text-gray-800"
                  placeholder='Enter street address'
                  required
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
                  value={formData.bloodPressure}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-[#Add0Da] border border-black  focus:outline-none placeholder:text-gray-800 uppercase placeholder:lowercase"
                  placeholder='do you face from bp issues?'
                  required
                />
              </div>
              <div>
                <label htmlFor='diabeties' className="block text-gray-800 font-medium mb-2">Diabetes*</label>
                <input
                  id='diabeties'
                  type="text"
                  name="diabetes"
                  value={formData.diabetes}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-[#Add0Da] border border-black  focus:outline-none placeholder:text-gray-800 uppercase placeholder:lowercase"
                  placeholder='do you have diabetes?'
                  required
                />
              </div>
            </div>
            <div>
              <label htmlFor='existingMedicalInsurance' className="block text-gray-800 font-medium mb-2">Existing Medical Insurance</label>
              <input
                id='existingMedicalInsurance'
                type="text"
                name="existingInsurance"
                placeholder="enter here"
                value={formData.existingInsurance}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-[#Add0Da] border border-black  focus:outline-none  placeholder-gray-700 uppercase placeholder:lowercase"
                required
              />
            </div>
          </div>

          <div className='flex justify-center pb-32'>
            <button type="submit" className="px-32 py-3 bg-[#Add0Da] border border-black  focus:outline-none text-sm">Submit</button>
          </div>
        </form>

      </div>
      <div className="absolute bottom-0 right-0 z-0 pointer-events-none">
        <img src={images.bottomWave} alt="bottomWave img"
          className="w-full h-auto" />
      </div>
    </div>
  );
};
export default TellUsAboutYourself;
