import { useEffect, useState } from 'react'
import { icons } from "../../assets/assets"
import Loader from './Loader'
import { BASE_URL } from "../../config/config.js"

const MedicalHistory = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [appointments, setAppointments] = useState([])



  useEffect(() => {
    const fetchAppointments = async () => {
      setLoading(true)

      try {
        const response = await fetch(`${BASE_URL}/appointments/admin_get_all_appointment`)

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        setAppointments(data.data || [])
      } catch (err) {
        console.error("Error fetching appointment history:", err)
        setAppointments([])
      } finally {
        setLoading(false)
      }
    }

    fetchAppointments()
  }, [])

  const filteredData = appointments.filter((appointment) => {
    if (!searchTerm) return true

    const search = searchTerm.toLowerCase()
    const patientMatch = appointment.patientName?.toLowerCase().includes(search)
    const doctorMatch = appointment.doctor?.toLowerCase().includes(search)

    return patientMatch || doctorMatch
  })

  return (
    <div className='bg-[#d1e8f3] min-h-screen p-8'>
      <h1 className='text-3xl font-bold text-gray-800'>Medical History</h1>
      <p className='text-sm font-normal text-[#4A739C] mt-2'>
        Search by user or doctor
      </p>

      <div className='flex justify-center items-center gap-2 w-full p-2 rounded-md mt-6 bg-gray-200'>
        <icons.FaSearch className="text-gray-600" size={20} />
        <input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          type="search"
          className='w-full bg-transparent outline-none placeholder:text-[#4A739C]'
          placeholder='Search by user or doctor'
          disabled={loading}
        />
      </div>

      <div className="rounded-lg mt-6 overflow-hidden">
        <div className="overflow-y-auto max-h-[68vh]">
          <table className="bg-[#f7fafc] w-full">
            <thead className="sticky top-0 bg-gray-100 z-10">
              <tr className="text-center font-semibold">
                <th className="px-4 py-3">History ID</th>
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">Doctor</th>
                <th className="px-4 py-3">Illness</th>
                <th className="px-4 py-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className='py-6'>
                    <Loader />
                  </td>
                </tr>
              ) : filteredData.length > 0 ? (
                filteredData.map((data, index) => (
                  <tr
                    className="text-center hover:bg-gray-100 transition-colors"
                    key={data.id || index}
                  >
                    <td className="px-4 py-3">{index + 1}</td>
                    <td className="px-4 py-3">{data.patientName || 'N/A'}</td>
                    <td className="px-4 py-3">{data.doctor || 'N/A'}</td>
                    <td className="px-4 py-3">{data.reason || 'N/A'}</td>
                    <td className="px-4 py-3">
                      {data.date ? new Date(data.date).toLocaleDateString('en-GB', {
                        day: "numeric",
                        month: "short",
                        year: "numeric"
                      }) : 'N/A'}
                    </td>
                  </tr>
                ))
              ) : (
                <tr className='text-center font-semibold text-gray-500'>
                  <td colSpan="5" className="py-4">
                    {searchTerm ? 'No matching records found' : 'No data available'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default MedicalHistory