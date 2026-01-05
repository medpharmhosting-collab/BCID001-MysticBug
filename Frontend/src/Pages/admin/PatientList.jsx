import { useState, useEffect } from 'react'
import { icons } from '../../assets/assets'
import { useNavigate } from 'react-router-dom'
import Loader from './Loader'
import { BASE_URL } from "../../config/config.js"

const PatientList = () => {
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [datas, setDatas] = useState([])
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [userData, setUserData] = useState(null)
  const [loadingUserData, setLoadingUserData] = useState(false)


  const navigate = useNavigate()

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/users`)
      const data = await response.json()
      const filteredData = data.filter((d => d.userType === 'patient'))
      setDatas(filteredData)
    } catch (error) {
      console.log("error while getting patients")
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    fetchUsers()
  }, [])

  const filteredData = datas.filter((user) => {
    const statusMatch = status
      ? (status === "active" ? user.isActive === true : user.isActive === false)
      : true;
    let searchMatch = searchTerm.length > 0
      ? user.name.toLowerCase().includes(searchTerm.toLowerCase())
      : true;
    return statusMatch && searchMatch
  })

  const fetchUserRoleData = async (user) => {
    setLoadingUserData(true)
    try {
      if (user.userType === 'patient') {
        const response = await fetch(`${BASE_URL}/appointments/smart_userdata?patientName=${user.name}`)
        const data = await response.json()
        setUserData(data || [])
      } else {
        setUserData([])
      }
    } catch (error) {
      console.log("error while getting user role data", error.message)
      setUserData([])
    } finally {
      setLoadingUserData(false)
    }
  }

  const handleViewUser = (user) => {
    setSelectedUser(user)
    setModalOpen(true)
    fetchUserRoleData(user)
  }

  const closeModal = () => {
    setModalOpen(false)
    setSelectedUser(null)
    setUserData([])
  }
  const handlePatientDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this patient?")) return;
    try {
      setLoading(true);
      const res = await fetch(`${BASE_URL}/patient/delete_patient/${id}`,
        { method: 'DELETE' }
      );
      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Delete failed");
        return;
      }

      // ✅ refetch list
      await fetchUsers();

    }
    catch (err) {
      console.error("Error fetching Users:", err);
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className='bg-[#d1e8f3] min-h-screen p-8'>
      <h1 className='text-3xl font-bold text-gray-800'>Patients</h1>
      <div className='flex justify-center items-center gap-2 w-full p-2 rounded-md mt-8 bg-gray-200'>
        <span><icons.FaSearch size={20} /></span>
        <input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          type="search"
          className='w-full bg-transparent outline-none placeholder:text-[#4A739C]'
          placeholder='Search users'
        />
      </div>

      <div className='flex flex-start gap-4 mt-3'>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className='bg-[#e8edf2] border-2 border-b-purple-400 px-3 py-1 rounded-md outline-none'
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      <div className="rounded-lg mt-6 overflow-y-auto max-h-[68vh]">
        <table className="bg-[#f7fafc] w-full">
          <thead>
            <tr className="text-center font-semibold bg-gray-100">
              <th className="px-4 py-3">Patient ID</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
              <th className="px-4 py-3">Manage</th>
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
                    <button className="cursor-auto px-3 py-1 bg-[#e8edf2] rounded">
                      {data.isActive ? "Active" : "Inactive"}
                    </button>
                  </td>
                  <td className="text-[#4D7399] text-sm font-bold px-4 py-3 space-x-2">
                    <button
                      onClick={() => handleViewUser(data)}
                      className="cursor-pointer shadow-md px-3 py-1 bg-[#e8edf2] rounded hover:bg-[#d8e3ee]"
                    >
                      View
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-center items-center h-full">
                      <icons.MdDelete
                        size={22}
                        className=" cursor-pointer text-red-500 hover:text-red-600 transition-transform duration-150 hover:scale-110"
                        onClick={() => handlePatientDelete(data._id)}
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

      {/* Dynamic Modal */}
      {modalOpen && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[200] p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center z-10">
              <h2 className="text-2xl font-bold text-gray-800 capitalize">
                {selectedUser?.userType} Profile
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100"
              >
                <icons.MdClose size={24} />
              </button>
            </div>

            {/* User Basic Details */}
            <div className="p-6 border-b bg-[#f7fafc]">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="font-semibold text-gray-800">{selectedUser.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-semibold text-gray-800">{selectedUser.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Role</p>
                  <p className="font-semibold text-gray-800 capitalize">{selectedUser.userType}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <p className={`font-semibold ${selectedUser.isActive ? 'text-green-600' : 'text-red-600'}`}>
                    {selectedUser.isActive ? 'Active' : 'Inactive'}
                  </p>
                </div>
                {/* Patient-specific fields */}
                {selectedUser?.userType === 'patient' && selectedUser.age && (
                  <div>
                    <p className="text-sm text-gray-500">Age</p>
                    <p className="font-semibold text-gray-800">{selectedUser.age} years</p>
                  </div>
                )}

                {selectedUser.createdAt && (
                  <div>
                    <p className="text-sm text-gray-500">Joined Date</p>
                    <p className="font-semibold text-gray-800">
                      {new Date(selectedUser.createdAt).toLocaleDateString('en-GB', {
                        day: "2-digit",
                        month: "short",
                        year: "numeric"
                      })}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="p-6">
              {selectedUser?.userType === 'patient' && (
                <>
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Appointments History</h3>
                  {loadingUserData ? (
                    <div className="text-center py-8 text-gray-500"><Loader /></div>
                  ) : userData && userData.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full bg-white border rounded-lg">
                        <thead>
                          <tr className="bg-gray-100 text-left">
                            <th className="px-4 py-3 font-semibold">S.No</th>
                            <th className="px-4 py-3 font-semibold">Doctor Name</th>
                            <th className="px-4 py-3 font-semibold">Date</th>
                            <th className="px-4 py-3 font-semibold">Reason</th>
                            <th className="px-4 py-3 font-semibold">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {userData.map((appointment, index) => (
                            <tr key={appointment._id || index} className="border-t hover:bg-gray-50">
                              <td className="px-4 py-3">{index + 1}</td>
                              <td className="px-4 py-3">{appointment.doctor || 'N/A'}</td>
                              <td className="px-4 py-3">
                                {appointment.date ? new Date(appointment.date).toLocaleDateString('en-GB', {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric"
                                }) : 'N/A'}
                              </td>
                              <td className="px-4 py-3">{appointment.reason || 'N/A'}</td>
                              <td className="px-4 py-3">
                                <span className={`inline-block w-[90px] px-2 py-1 font-semibold text-center rounded text-sm ${appointment.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                                  appointment.status === 'rejected' ? 'bg-yellow-100 text-yellow-700' :
                                    'bg-gray-100 text-gray-700'
                                  }`}>
                                  {appointment.status || 'N/A'}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      No appointments found for this patient
                    </div>
                  )}
                </>
              )}
            </div>

          </div>
        </div>
      )}
    </div>
  )
}

export default PatientList