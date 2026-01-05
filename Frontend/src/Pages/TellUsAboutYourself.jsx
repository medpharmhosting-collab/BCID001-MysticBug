import { useState } from 'react';
import { images } from '../assets/assets';
import { BASE_URL } from "../config/config.js";
import { useAuth } from "../Context/AuthContext";
import { useNavigate } from "react-router-dom";

const TellUsAboutYourself = () => {
  const navigate = useNavigate();
  const { uid, updateAuthUser } = useAuth()
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
    address: '',
    bloodPressure: '',
    diabetes: '',
    existingInsurance: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    // For phone: allow only digits
    if (name === "phoneNumber") {
      if (!/^\d*$/.test(value)) return;
      return setFormData({ ...formData, [name]: value });
    }

    setFormData({
      ...formData,
      [name]: value
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

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
                className="w-full px-4 py-3 bg-[#Add0Da] border border-black  focus:outline-none placeholder:text-gray-700 uppercase placeholder:lowercase"
                placeholder='enter name'
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
                className="w-full px-4 py-3 bg-[#Add0Da] border border-black  focus:outline-none placeholder:text-gray-700 uppercase placeholder:lowercase"
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
            <div>
              <label htmlFor='address' className="block text-gray-800 font-medium mb-2">Address</label>
              <input
                id='address'
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-[#Add0Da] border border-black  focus:outline-none placeholder:text-gray-800 uppercase placeholder:lowercase"
                placeholder='enter here'
                required
              />
            </div>
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
