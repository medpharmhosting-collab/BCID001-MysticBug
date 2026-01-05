import { useState, useEffect } from 'react'
import { icons } from '../../assets/assets'
import Loader from './Loader'
import { BASE_URL } from "../../config/config.js"

const Users = () => {
  const [role, setRole] = useState('')
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [datas, setDatas] = useState([])
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [userData, setUserData] = useState(null)
  const [loadingUserData, setLoadingUserData] = useState(false)



  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${BASE_URL}/users`)
        const data = await response.json()
        setDatas(data)
      } catch (error) {
        console.log("error while getting users")
      } finally {
        setLoading(false);
      }
    }
    fetchUsers()
  }, [BASE_URL])

  const filteredData = datas.filter((user) => {
    let roleMatch = role ? user.userType === role : true
    const statusMatch = status
      ? (status === "active" ? user.isActive === true : user.isActive === false)
      : true;
    let searchMatch = searchTerm.length > 0
      ? user.name.toLowerCase().includes(searchTerm.toLowerCase())
      : true;
    return statusMatch && roleMatch && searchMatch
  })

  const fetchUserRoleData = async (user) => {
    setLoadingUserData(true)
    try {
      if (user.userType === 'doctor') {
        // Fetch appointments where this user is the doctor 
        const response = await fetch(`${BASE_URL}/appointments/smart_userdata?doctor=${user.name}`)
        const data = await response.json()
        setUserData(data || [])
      } else if (user.userType === 'patient') {
        // Fetch appointments where this user is the patient
        const response = await fetch(`${BASE_URL}/appointments/smart_userdata?patientName=${user.name}`)
        const data = await response.json()
        setUserData(data || [])
      } else if (user.userType === 'investor') {
        // Fetch investments for this investor
        const response = await fetch(`${BASE_URL}/investors?investorId=${user._id}`)
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

  return (
    <div className='bg-[#d1e8f3] min-h-screen p-8'>
      <div className='flex justify-between items-center'>
        <h1 className='text-3xl font-bold text-gray-800'>Users</h1>
      </div>

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
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className='bg-[#e8edf2] border-2 border-b-purple-400 px-3 py-1 rounded-md outline-none'
        >
          <option value="">All Roles</option>
          <option value="patient">Patient</option>
          <option value="doctor">Doctor</option>
          <option value="investor">Investor</option>
          <option value="admin">Admin</option>
        </select>
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
              <th className="px-4 py-3">User ID</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className='py-6'><Loader /></td>
              </tr>
            ) : filteredData.length > 0 ? (
              filteredData.map((data, index) => (
                <tr className="text-center" key={data._id}>
                  <td className="px-4 py-3">{index + 1}</td>
                  <td className="px-4 py-3">{data.name}</td>
                  <td className="px-4 py-3">{data.email}</td>
                  <td className="px-4 py-3">
                    <button className="cursor-auto px-3 py-1 bg-[#e8edf2] rounded capitalize">
                      {data.userType}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <button className="cursor-auto px-3 py-1 bg-[#e8edf2] rounded">
                      {data.isActive ? "Active" : "Inactive"}
                    </button>
                  </td>
                  <td className="text-[#4D7399] text-sm font-bold px-4 py-3 space-x-2">
                    <button
                      onClick={() => handleViewUser(data)}
                      className="hover:underline"
                    >
                      View
                    </button>
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

                {/* Doctor-specific fields */}
                {selectedUser?.userType === 'doctor' && (
                  <>
                    <div>
                      <p className="text-sm text-gray-500">Specialization</p>
                      <p className="font-semibold text-gray-800 capitalize">{selectedUser.specialization}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Qualification</p>
                      <p className="font-semibold text-gray-800 capitalize">{selectedUser.qualification}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Experience</p>
                      <p className="font-semibold text-gray-800 capitalize">{selectedUser.experience}</p>
                    </div>
                  </>
                )}

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

            {/* Role-specific data section */}
            <div className="p-6">
              {/* DOCTOR: Show Patients List */}
              {selectedUser?.userType === 'doctor' && (
                <>
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Patients List</h3>
                  {loadingUserData ? (
                    <div className="text-center py-8 text-gray-500"><Loader /></div>
                  ) : userData && userData.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full bg-white border rounded-lg">
                        <thead>
                          <tr className="bg-gray-100 text-left">
                            <th className="px-4 py-3 font-semibold">S.No</th>
                            <th className="px-4 py-3 font-semibold">Patient Name</th>
                            <th className="px-4 py-3 font-semibold">Age</th>
                            <th className="px-4 py-3 font-semibold">Illness</th>
                            <th className="px-4 py-3 font-semibold">Last Visit</th>
                            <th className='px-4 py-3 font-semibold'>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {userData.map((patient, index) => (
                            <tr key={patient._id || index} className="border-t hover:bg-gray-50">
                              <td className="px-4 py-3">{index + 1}</td>
                              <td className="px-4 py-3">{patient.patientName}</td>
                              <td className="px-4 py-3">{patient.age || 'N/A'}</td>
                              <td className="px-4 py-3">{patient.reason || 'N/A'}</td>
                              <td className="px-4 py-3">
                                {new Date(patient.date).toLocaleDateString('en-GB', {
                                  day: 'numeric',
                                  month: "short",
                                  year: "numeric"
                                })}
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
                </>
              )}

              {/* PATIENT: Show Appointments */}
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

              {/* INVESTOR: Show Investments */}
              {selectedUser?.userType === 'investor' && (
                <>
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Investment Portfolio</h3>
                  {loadingUserData ? (
                    <div className="text-center py-8 text-gray-500"><Loader /></div>
                  ) : userData && userData.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full bg-white border rounded-lg">
                        <thead>
                          <tr className="bg-gray-100 text-left">
                            <th className="px-4 py-3 font-semibold">S.No</th>
                            <th className="px-4 py-3 font-semibold">Name</th>
                            <th className="px-4 py-3 font-semibold">Income</th>
                            <th className="px-4 py-3 font-semibold">Expense</th>
                            <th className="px-4 py-3 font-semibold">Profit</th>
                            <th className="px-4 py-3 font-semibold">ROI</th>
                          </tr>
                        </thead>
                        <tbody>
                          {userData.map((investment, index) => (
                            <tr key={investment._id || index} className="border-t hover:bg-gray-50">
                              <td className="px-4 py-3">{index + 1}</td>
                              <td className="px-4 py-3">{investment.name || 'N/A'}</td>
                              <td className="px-4 py-3">₹{investment.income || 'N/A'}</td>
                              <td className="px-4 py-3">{investment.expense || 'N/A'}</td>
                              <td className="px-4 py-3">{investment.profits || 'N/A'}</td>
                              <td className="px-4 py-3">
                                <span className={`px-2 py-1 rounded text-sm`}>
                                  {investment.roi || 'N/A'}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      No investments found for this investor
                    </div>
                  )}
                </>
              )}

              {/* ADMIN: Show Activity/Stats */}
              {selectedUser?.userType === 'admin' && (
                <div className="text-center py-8">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">Admin Account</h3>
                  <p className="text-gray-500">Full system access and management privileges</p>
                </div>
              )}
            </div>

          </div>
        </div>
      )}
    </div>
  )
}

export default Users
