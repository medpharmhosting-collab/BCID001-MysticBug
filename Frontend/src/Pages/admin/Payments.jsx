
import { useState } from 'react'
import { icons } from '../../assets/assets'
import Loader from './Loader'
import { useNavigate } from "react-router-dom"

const Payments = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()
  const dummyTableData = []
  const filteredData = dummyTableData.filter((user => {
    let searchMatch = searchTerm ? String(user.amount).toLowerCase().includes(searchTerm.toLowerCase()) : true;
    return searchMatch
  }
  ))
  return (
    <div className='bg-[#d1e8f3] min-h-screen p-8'>
      <h1 className='text-3xl font-bold text-gray-800'>Payments Logs</h1>
      <div className='flex justify-center items-center gap-2 w-full p-2 rounded-md mt-6 bg-gray-200'>
        <span><icons.FaSearch /></span>
        <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} type="search" className='w-full bg-transparent outline-none placeholder:text-[#4A739C]' placeholder='Search by payment amount' />
      </div>
      <div className="rounded-lg mt-6 overflow-y-auto max-h-[68vh]">
        <table className="bg-[#f7fafc] w-full">
          <thead>
            <tr className="text-center font-semibold bg-gray-100">
              <th className="px-4 py-3">Payment ID</th>
              <th className="px-4 py-3">User</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Timestamp</th>
              <th className="px-4 py-3">Gateway Response</th>
            </tr>
          </thead>
          <tbody>
            {loading ? <tr> <td colSpan="6" className='py-6'><Loader /></td> </tr> : filteredData.length > 0 ? filteredData.map((data) => (
              <tr className="text-center" key={data.id}>
                <td className="px-4 py-3">{data.id}</td>
                <td className="px-4 py-3">{data.name}</td>
                <td className="px-4 py-3">₹{data.amount}</td>
                <td className="px-4 py-3">
                  <button className="cursor-auto px-3 py-1 bg-[#e8edf2] rounded">
                    {data.status}
                  </button>
                </td>
                <td className="px-4 py-3">{data.timestamp}</td>
                <td className="px-4 py-3">{data.gateway}</td>
              </tr>
            )) : <tr className='text-center font-semibold text-red-500'>
              <td
                colSpan="6" className="py-4">
                No data available
              </td>
            </tr>
            }
          </tbody>
        </table>
      </div>


    </div>
  )
}

export default Payments
