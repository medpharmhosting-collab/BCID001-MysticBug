import { useState, useEffect } from 'react'
import { icons } from "../../assets/assets"
import { useNavigate } from 'react-router-dom'
import Loader from './Loader'
import { BASE_URL } from "../../config/config.js"

const Doctors = () => {
  const [specialization, setSpecialization] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(false)
  const [doctorsData, setDoctorsData] = useState([])
  const [modalOpen, setModalOpen] = useState(false)
  const [addDoctorModal, setAddDoctorModal] = useState(false)
  const [selectedDoctor, setSelectedDoctor] = useState(null)
  const [doctorPatients, setDoctorPatients] = useState([])
  const [loadingPatients, setLoadingPatients] = useState(false)
  const [isEditing, setIsEditing] = useState(false);
  const [adminFormData, setAdminFormData] = useState({
    name: "",
    email: "",
    specialization: "",
    qualification: "",
    experience: "",
    gender: "",
    availableSlots: [],
  });

  const navigate = useNavigate()
  const fetchDoctors = async () => {
    try {
      const response = await fetch(`${BASE_URL}/doctors`)
      const data = await response.json()
      setDoctorsData(data.doctors);
    } catch (error) {
      console.log("error while getting doctors", error.message)
    }
  }
  useEffect(() => {
    fetchDoctors()
  }, [])

  const fetchDoctorPatients = async (doctor) => {
    setLoadingPatients(true)
    try {
      const response = await fetch(`${BASE_URL}/appointments/smart_userdata?doctor=${doctor}`)
      const data = await response.json()
      setDoctorPatients(data || [])
    } catch (error) {
      console.log("error while getting doctor's patients", error.message)
      setDoctorPatients([])
    } finally {
      setLoadingPatients(false)
    }
  }

  const handleViewProfile = (doctor) => {
    setSelectedDoctor(doctor)
    setModalOpen(true)
    fetchDoctorPatients(doctor.name)
  }
  useEffect(() => {
    if (selectedDoctor) {
      setAdminFormData({
        name: selectedDoctor.name || "",
        email: selectedDoctor.email || "",
        specialization: selectedDoctor.specialization || "",
        qualification: selectedDoctor.qualification || "",
        experience: selectedDoctor.experience || "",
        gender: selectedDoctor.gender || "",
        availableSlots: selectedDoctor.availableSlots || [],
      });
    }
  }, [selectedDoctor]);

  const handleAdminChange = (e) => {
    const { name, value } = e.target;

    setAdminFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const closeModal = () => {
    setModalOpen(false)
    setSelectedDoctor(null)
    setDoctorPatients([])
  }

  const handleDoctorDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this doctor?")) return;

    try {
      setLoading(true);
      const res = await fetch(`${BASE_URL}/doctors/delete_doctor/${id}`,
        { method: 'DELETE' }
      );
      const data = await res.json();
      if (!res.ok) {
        alert(data.message || "Delete failed");
        return;
      }
      // ✅ refetch list
      await fetchDoctors();
    }
    catch (err) {
      console.error("Error fetching investors:", err);
    } finally {
      setLoading(false);
    }
  }

  const filteredData = doctorsData.filter((user) => {
    let specializationMatch = specialization ? user.specialization === specialization : true
    let searchMatch = searchTerm ? user.name.toLowerCase().includes(searchTerm.toLowerCase()) : true
    return specializationMatch && searchMatch
  })

  const generateTimeSlots = () => {
    const slots = [];
    for (let minutes = 9 * 60; minutes <= 23 * 60; minutes += 30) {
      const hour = Math.floor(minutes / 60);
      const min = minutes % 60;
      const period = hour >= 12 ? 'PM' : 'AM';
      const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
      slots.push(`${displayHour}:${min.toString().padStart(2, '0')} ${period}`);
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();
  const toggleSlot = (slot) => {
    if (!isEditing) return;

    setAdminFormData(prev => {
      const updatedSlots = prev.availableSlots.includes(slot)
        ? prev.availableSlots.filter(s => s !== slot)
        : [...prev.availableSlots, slot];

      return { ...prev, availableSlots: updatedSlots };
    });
  };
  const handleAdminUpdateDoctor = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        `${BASE_URL}/admin/update-doctor/${selectedDoctor._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(adminFormData),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Update failed");
        return;
      }

      await fetchDoctors();
      setIsEditing(false);
      closeModal();
    } catch (err) {
      console.error("Admin update doctor error:", err);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };
  const selectAllSlots = () => {
    if (!isEditing) return;
    setAdminFormData(prev => ({
      ...prev,
      availableSlots: [...timeSlots],
    }));
  };

  const clearAllSlots = () => {
    if (!isEditing) return;
    setAdminFormData(prev => ({
      ...prev,
      availableSlots: [],
    }));
  };


  return (
    <div className='bg-[#d1e8f3] min-h-screen p-8'>
      <div className='flex justify-between items-center'>
        <h1 className='text-3xl font-bold text-gray-800'>Doctors</h1>
        <button
          className='px-3 py-1 bg-gray-200 rounded-lg cursor-pointer'
          onClick={() => navigate('add_doctor')}>
          Add Doctor
        </button>
      </div>

      <div className='flex justify-center items-center gap-2 w-full p-2 rounded-md mt-8 bg-gray-200'>
        <span><icons.FaSearch size={20} /></span>
        <input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          type="search"
          className='w-full bg-transparent outline-none placeholder:text-[#4A739C]'
          placeholder='Search doctors'
        />
      </div>

      <div className='flex flex-start gap-4 mt-3'>
        <select
          value={specialization}
          onChange={(e) => setSpecialization(e.target.value)}
          className='bg-[#e8edf2] border-2 border-b-purple-400 px-3 py-1 rounded-md outline-none'
        >
          <option value="">All Specializations</option>
          <option value="cardiology">Cardiology</option>
          <option value="neurology">Neurology</option>
          <option value="pediatrics">Pediatrics</option>
          <option value="dermatology">Dermatology</option>
          <option value="orthopedics">Orthopedics</option>
          <option value="urology">Urology</option>
          <option value="gastroenteology">Gastroenterology</option>
          <option value="endocrinology">Endocrinology</option>
        </select>
      </div>

      <div className="rounded-lg mt-6 overflow-y-auto max-h-[68vh]">
        <table className="bg-[#f7fafc] w-full">
          <thead>
            <tr className="text-center font-semibold bg-gray-100">
              <th className="px-4 py-3">Doctor ID</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Specialization</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
              <th className='px-4 py-3'>Manage</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className='py-6 text-center'><Loader /></td>
              </tr>
            ) : filteredData.length > 0 ? (
              filteredData.map((data, index) => (
                <tr className="text-center" key={data._id}>
                  <td className="px-4 py-3">{index + 1}</td>
                  <td className="px-4 py-3">{data.name}</td>
                  <td className="px-4 py-3">{data.email}</td>
                  <td className="px-4 py-3">
                    <button className="capitalize">
                      {data.specialization}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <button className="cursor-auto px-3 py-1 bg-[#e8edf2] rounded">
                      {data.isActive ? "Active" : "Inactive"}
                    </button>
                  </td>
                  <td className="text-[#4D7399] text-sm font-bold px-4 py-3 space-x-2">
                    <button
                      className="cursor-pointer shadow-md px-3 py-1 bg-[#e8edf2] rounded hover:bg-[#d8e3ee]"
                      onClick={() => handleViewProfile(data)}
                    >
                      View Profile
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-center items-center h-full">
                      <icons.MdDelete
                        size={22}
                        className=" cursor-pointer text-red-500 hover:text-red-600 transition-transform duration-150 hover:scale-110"
                        onClick={() => handleDoctorDelete(data._id)}
                      />
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr className='text-center font-semibold text-red-500'>
                <td colSpan="6" className="py-4">
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {modalOpen && selectedDoctor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[200] p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center z-10">
              <h2 className="text-2xl font-bold text-gray-800">Doctor Profile</h2>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    if (isEditing && selectedDoctor) {
                      setAdminFormData({
                        name: selectedDoctor.name || "",
                        email: selectedDoctor.email || "",
                        specialization: selectedDoctor.specialization || "",
                        qualification: selectedDoctor.qualification || "",
                        experience: selectedDoctor.experience || "",
                        gender: selectedDoctor.gender || "",
                        availableSlots: selectedDoctor.availableSlots || [],
                      });
                    }
                    setIsEditing(!isEditing);
                  }}
                  className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm"
                >
                  {isEditing ? 'Cancel Edit' : 'Edit Profile'}
                </button>
                <button
                  onClick={closeModal}
                  className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
                >
                  <icons.MdClose size={24} />
                </button>
              </div>
            </div>

            {/* Doctor Details */}
            <div className="p-6 border-b bg-[#f7fafc]">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  {!isEditing ? (
                    <p className="font-semibold text-gray-800">{adminFormData.name}</p>
                  ) : (
                    <input
                      name="name"
                      value={adminFormData.name}
                      onChange={handleAdminChange}
                      className="border px-3 py-2 rounded w-full"
                    />
                  )}
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  {!isEditing ? (
                    <p className="font-semibold text-gray-800">{adminFormData.email}</p>
                  ) : (
                    <input
                      name="email"
                      value={adminFormData.email}
                      onChange={handleAdminChange}
                      className="border px-3 py-2 rounded w-full"
                    />
                  )}
                </div>
                <div>
                  <p className="text-sm text-gray-500">Specialization</p>
                  {!isEditing ? (
                    <p className="font-semibold text-gray-800 capitalize">
                      {adminFormData.specialization}
                    </p>
                  ) : (
                    <input
                      name="specialization"
                      value={adminFormData.specialization}
                      onChange={handleAdminChange}
                      className="border px-3 py-2 rounded w-full"
                    />
                  )}
                </div>
                <div>
                  <p className="text-sm text-gray-500">Experience</p>
                  {!isEditing ? (
                    <p className="font-semibold text-gray-800 capitalize">
                      {adminFormData.experience}
                    </p>
                  ) : (
                    <input
                      name="experience"
                      value={adminFormData.experience}
                      onChange={handleAdminChange}
                      className="border px-3 py-2 rounded w-full"
                    />
                  )}
                </div>
                <div>
                  <p className="text-sm text-gray-500">Qualification</p>
                  {!isEditing ? (
                    <p className="font-semibold text-gray-800 capitalize">
                      {adminFormData.qualification}
                    </p>
                  ) : (
                    <input
                      name="qualification"
                      value={adminFormData.qualification}
                      onChange={handleAdminChange}
                      className="border px-3 py-2 rounded w-full"
                    />
                  )}
                </div>
                <div>
                  <p className="text-sm text-gray-500">Gender</p>
                  {!isEditing ? (
                    <p className="font-semibold text-gray-800 capitalize">
                      {adminFormData.gender}
                    </p>
                  ) : (
                    <select
                      name="gender"
                      value={adminFormData.gender}
                      onChange={handleAdminChange}
                      className="border px-3 py-2 rounded w-full"
                    >
                      <option value="">Select</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  )}
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <p className={`font-semibold ${selectedDoctor.isActive ? 'text-green-600' : 'text-red-600'}`}>
                    {selectedDoctor.isActive ? 'Active' : 'Inactive'}
                  </p>
                </div>
              </div>
              <div className='w-full mt-3'>
                <p className="text-sm text-gray-500">AvailableSlots</p>
                {!isEditing ? (
                  <p className="font-semibold text-gray-800">
                    {selectedDoctor.availableSlots?.join(', ') || 'No slots'}
                  </p>
                ) : (
                  <div className="bg-white p-4 rounded-md mt-2">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex gap-2">
                        <button
                          onClick={selectAllSlots}
                          className="px-3 py-1 bg-blue-600 text-white rounded text-sm"
                        >
                          Select All
                        </button>

                        <button
                          onClick={clearAllSlots}
                          className="px-3 py-1 bg-gray-200 rounded text-sm"
                        >
                          Clear
                        </button>
                      </div>

                      {/* RIGHT SIDE */}
                      {isEditing && (
                        <div className="flex gap-3">
                          <button
                            onClick={() => {
                              setAdminFormData({
                                name: selectedDoctor.name || "",
                                email: selectedDoctor.email || "",
                                specialization: selectedDoctor.specialization || "",
                                qualification: selectedDoctor.qualification || "",
                                experience: selectedDoctor.experience || "",
                                gender: selectedDoctor.gender || "",
                                availableSlots: selectedDoctor.availableSlots || [],
                              });
                              setIsEditing(false);
                            }}
                            className="px-3 py-1 bg-gray-300 rounded"
                          >
                            Cancel
                          </button>

                          <button
                            onClick={handleAdminUpdateDoctor}
                            disabled={loading}
                            className="px-3 py-1 bg-green-600 text-white rounded"
                          >
                            {loading ? "Saving..." : "Save Changes"}
                          </button>
                        </div>
                      )}
                    </div>


                    <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                      {timeSlots.map(slot => {
                        const active = adminFormData.availableSlots.includes(slot);
                        return (
                          <button
                            key={slot}
                            type="button"
                            onClick={() => toggleSlot(slot)}
                            className={`px-2 py-2 rounded text-sm ${active ? 'bg-blue-600 text-white' : 'bg-gray-100'
                              }`}
                          >
                            {slot}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
            {/* Patients List */}
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Patients List</h3>

              {loadingPatients ? (
                <div className="text-center py-8 text-gray-500"><Loader /></div>
              ) : doctorPatients.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full bg-white border rounded-lg">
                    <thead>
                      <tr className="bg-gray-100 text-left">
                        <th className="px-4 py-3 font-semibold">Patient ID</th>
                        <th className="px-4 py-3 font-semibold">Name</th>
                        <th className="px-4 py-3 font-semibold">Age</th>
                        <th className="px-4 py-3 font-semibold">illness</th>
                        <th className="px-4 py-3 font-semibold">Last Visit</th>
                        <th className='px-4 py-3 font-semibold'>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {doctorPatients.map((patient, index) => (
                        <tr key={patient._id || index} className="border-t hover:bg-gray-50">
                          <td className="px-4 py-3">{index + 1}</td>
                          <td className="px-4 py-3">{patient.patientName}</td>
                          <td className="px-4 py-3">{patient.age || 'N/A'}</td>
                          <td className="px-4 py-3">{patient.reason || 'N/A'}</td>
                          <td className="px-4 py-3">
                            {new Date(patient.date).toLocaleDateString('en-GB', {
                              day: "numeric",
                              month: "short",
                              year: "numeric"
                            }) || 'N/A'}
                          </td>
                          <td className="px-4 py-3">
                            <span className={`inline-block w-[90px] px-2 py-1 font-semibold text-center rounded text-sm ${patient.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                              patient.status === 'rejected' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-gray-100 text-gray-700'
                              }`}>
                              {patient.status || 'N/A'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No patients found for this doctor
                </div>
              )}
            </div>
          </div>
        </div>
      )
      }
    </div >
  )
}

export default Doctors
