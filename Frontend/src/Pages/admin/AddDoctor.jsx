import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BASE_URL } from "../../config/config.js"
import { icons } from "../../assets/assets.js"

const AddDoctor = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    doctorName: '',
    gender: '',
    qualifications: '',
    designation: '',
    typeOfDoctor: '',
    specialistDetails: '',
    experience: '',
    email: '',
    password: '',
    slots: []
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [eye, setEye] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };
  // Generate time slots from 12 AM to 11 PM
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 0; hour < 24; hour++) {
      const period = hour >= 12 ? 'PM' : 'AM';
      const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
      slots.push(`${displayHour}:00 ${period}`);
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  const toggleSlot = (slot) => {
    setFormData(prev => {
      const slots = prev.slots.includes(slot)
        ? prev.slots.filter(s => s !== slot)
        : [...prev.slots, slot];
      return { ...prev, slots };
    });
  };

  const selectAllSlots = () => {
    setFormData(prev => ({ ...prev, slots: [...timeSlots] }));
  };

  const clearAllSlots = () => {
    setFormData(prev => ({ ...prev, slots: [] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (!formData.doctorName || !formData.email || !formData.password || !formData.gender) {
      setError('Doctor name, gender, email, and password are required');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${BASE_URL}/admin/add-doctor`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.doctorName,
          email: formData.email,
          gender: formData.gender,
          password: formData.password,
          qualification: formData.qualifications,
          designation: formData.designation,
          typeOfDoctor: formData.typeOfDoctor,
          specialistDetails: formData.specialistDetails,
          experience: formData.experience,
          slots: formData.slots
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to add doctor');
      }

      setSuccess('Doctor added successfully! They can now login.');

      // Reset form
      setFormData({
        doctorName: '',
        qualifications: '',
        designation: '',
        typeOfDoctor: '',
        specialistDetails: '',
        experience: '',
        email: '',
        password: '',
        slots: []
      });

      // Navigate back after 2 seconds
      setTimeout(() => {
        navigate('/admin-dashboard/doctors');
      }, 2000);

    } catch (err) {
      setError(err.message || 'Failed to add doctor. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='bg-[#d1e8f3] min-h-screen overflow-auto p-8'>
      <div className='flex justify-between items-center'>
        <h1 className='text-3xl font-bold text-gray-800'>Add New Doctor</h1>
        <button
          onClick={() => navigate('/admin-dashboard/doctors')}
          className='px-3 py-1 bg-gray-200 rounded-lg cursor-pointer hover:bg-gray-300 transition'
        >
          Go Back
        </button>
      </div>

      {error && (
        <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {success && (
        <div className="mt-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="max-w-5xl grid grid-cols-1 sm:grid-cols-2 gap-6 mt-10">
        <div className="flex flex-col">
          <label htmlFor="doctorName" className="mb-1 font-medium">
            Doctor Name *
          </label>
          <input
            type="text"
            id="doctorName"
            value={formData.doctorName}
            onChange={handleChange}
            className="p-3 outline-none bg-white placeholder:text-[#4D8799] rounded-md"
            placeholder="Enter doctor's full name"
            required
            disabled={loading}
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="qualifications" className="mb-1 font-medium">
            Qualifications
          </label>
          <input
            type="text"
            id="qualifications"
            value={formData.qualifications}
            onChange={handleChange}
            className="p-3 outline-none bg-white placeholder:text-[#4D8799] rounded-md"
            placeholder="e.g., MD, MBBS"
            disabled={loading}
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="designation" className="mb-1 font-medium">
            Designation
          </label>
          <input
            type="text"
            id="designation"
            value={formData.designation}
            onChange={handleChange}
            className="p-3 outline-none bg-white placeholder:text-[#4D8799] rounded-md"
            placeholder="e.g., Senior Consultant"
            disabled={loading}
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="typeOfDoctor" className="mb-1 font-medium">
            Type of Doctor
          </label>
          <input
            type="text"
            id="typeOfDoctor"
            value={formData.typeOfDoctor}
            onChange={handleChange}
            className="p-3 outline-none bg-white placeholder:text-[#4D8799] rounded-md"
            placeholder="e.g., Oncology, Cardiology"
            disabled={loading}
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="specialistDetails" className="mb-1 font-medium">
            Specialist Details
          </label>
          <input
            type="text"
            id="specialistDetails"
            value={formData.specialistDetails}
            onChange={handleChange}
            className="p-3 outline-none bg-white placeholder:text-[#4D8799] rounded-md"
            placeholder="e.g., Pediatric Oncology, Interventional Cardiology"
            disabled={loading}
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="experience" className="mb-1 font-medium">
            Years of Experience
          </label>
          <input
            type="number"
            id="experience"
            value={formData.experience}
            onChange={handleChange}
            className="p-3 outline-none bg-white placeholder:text-[#4D8799] rounded-md"
            placeholder="Enter years"
            min={0}
            disabled={loading}
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="email" className="mb-1 font-medium">
            Email *
          </label>
          <input
            type="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
            className="p-3 outline-none bg-white placeholder:text-[#4D8799] rounded-md"
            placeholder="example@gmail.com"
            required
            disabled={loading}
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="password" className="mb-1 font-medium">
            Password *
          </label>
          <div className='flex relative items-center'>
            <input
              type={eye ? "text" : "password"}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="p-3 w-full outline-none bg-white placeholder:text-[#4D8799] rounded-md"
              placeholder="At least 6 characters"
              required
              disabled={loading}
            />
            <span
              className="absolute right-3 cursor-pointer text-gray-600"
              onClick={() => setEye(!eye)}
            >
              {eye ? <icons.FaRegEyeSlash /> : <icons.FaRegEye />}
            </span>
          </div>
        </div>
        <div className="flex flex-col">
          <label htmlFor="gender" className="mb-1 font-medium">
            Gender *
          </label>
          <select
            id="gender"
            value={formData.gender}
            onChange={handleChange}
            className="p-3 w-fit outline-none bg-white placeholder:text-[#4D8799] rounded-md"
            required
            disabled={loading}
          >
            <option value="">Select gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
        {/* Available Time Slots */}
        <div className="col-span-full flex flex-col">
          <label className="mb-1 font-medium">
            Available Time Slots
          </label>
          <div className="bg-white p-4 rounded-md">
            {/* Quick Actions */}
            <div className="flex gap-2 mb-3">
              <button
                type="button"
                onClick={selectAllSlots}
                className="px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition text-sm"
                disabled={loading}
              >
                Select All
              </button>
              <button
                type="button"
                onClick={clearAllSlots}
                className="px-3 py-1.5 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition text-sm"
                disabled={loading}
              >
                Clear All
              </button>
              <span className="ml-auto text-sm text-gray-600 self-center">
                {formData.slots.length} slot{formData.slots.length !== 1 ? 's' : ''} selected
              </span>
            </div>

            {/* Time Slots Grid */}
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
              {timeSlots.map((slot) => {
                const isSelected = formData.slots.includes(slot);
                return (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => toggleSlot(slot)}
                    disabled={loading}
                    className={`
                      px-2 py-2 rounded-md transition text-sm
                      ${isSelected
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }
                      ${loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                    `}
                  >
                    {slot}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="col-span-full flex justify-center mt-6">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white font-semibold px-8 py-3 rounded-md shadow-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Adding Doctor...' : 'Add Doctor'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default AddDoctor