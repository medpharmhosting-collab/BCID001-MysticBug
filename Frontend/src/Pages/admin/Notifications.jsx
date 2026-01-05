
import { useState } from 'react'
import { icons } from '../../assets/assets'
import Loader from './Loader'

const Notifications = () => {
  const [loading, setLoading] = useState(false)

  const dummyTableData = [] //get from backend
  return (
    <div className='bg-[#d1e8f3] min-h-screen p-8'>
      <h1 className='text-3xl font-bold text-gray-800 mb-4'>Notifications</h1>
      <p className='font-bold text-[22px] text-[#0D141C] mb-2 mt-5'>Overview</p>
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'>
        <div className='border border-[#236FFD] rounded-lg p-6'>
          <p className='text-[#0D141C] font-medium text-base'>Total Sent</p>
          <h1 className='font-bold text-2xl text-[#0D141C]'>0</h1>
        </div>
        <div className='border border-[#236FFD] rounded-lg p-6'>
          <p className='text-[#0D141C] font-medium text-base'>Total Failed</p>
          <h1 className='font-bold text-2xl text-[#0D141C]'>0</h1>
        </div>
        <div className='border border-[#236FFD] rounded-lg p-6'>
          <p className='text-[#0D141C] font-medium text-base'>Pending</p>
          <h1 className='font-bold text-2xl text-[#0D141C]'>0</h1>
        </div>
      </div>
      <h1 className='font-bold text-[22px] text-[#0D141C] mt-4'>Recent Activity</h1>
      <div className="rounded-lg mt-6 overflow-y-auto max-h-[68vh]">
        <table className="bg-[#f7fafc] w-full">
          <thead>
            <tr className="text-center font-semibold bg-gray-100">
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Recepient</th>
            </tr>
          </thead>
          <tbody>
            {loading ? <tr> <td colSpan="6" className='py-6'><Loader /></td> </tr> : dummyTableData.length > 0 ? dummyTableData.map((data) => (
              <tr className="text-center" key={data.id}>
                <td className="px-4 py-3">{data.date}</td>
                <td className="px-4 py-3">{data.type}</td>
                <td className="px-4 py-3">
                  <button className="cursor-auto px-3 py-1 bg-[#e8edf2] rounded">
                    {data.status}
                  </button>
                </td>
                <td className="px-4 py-3">{data.recepient}</td>
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

export default Notifications
