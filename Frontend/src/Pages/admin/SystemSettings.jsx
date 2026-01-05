import { useState } from 'react'

const SystemSettings = () => {
  const [loading, setLoading] = useState(false)
  const [maintenanceMode, setMaintenanceMode] = useState(false)
  const [chatbotEnabled, setChatbotEnabled] = useState(true)

  const dummyTableData = [
    { id: 1, date: "2024-01-15", type: "email", status: "failed", recepient: "user1@gmail.com" },
    { id: 1, date: "2024-01-19", type: "sms", status: "sent", recepient: "user1@gmail.com" },
    { id: 1, date: "2024-01-15", type: "email", status: "failed", recepient: "user1@gmail.com" },
    { id: 1, date: "2024-01-19", type: "sms", status: "sent", recepient: "user1@gmail.com" },
    { id: 1, date: "2024-01-15", type: "email", status: "failed", recepient: "user1@gmail.com" },
    { id: 1, date: "2024-01-19", type: "email", status: "sent", recepient: "user1@gmail.com" },
    { id: 1, date: "2024-01-15", type: "email", status: "failed", recepient: "user1@gmail.com" },
    { id: 1, date: "2024-01-19", type: "email", status: "sent", recepient: "user1@gmail.com" },
    { id: 1, date: "2024-01-15", type: "email", status: "sent", recepient: "user1@gmail.com" },
    { id: 1, date: "2024-01-19", type: "email", status: "sent", recepient: "user1@gmail.com" },
    { id: 1, date: "2024-01-15", type: "email", status: "sent", recepient: "user1@gmail.com" },
    { id: 1, date: "2024-01-19", type: "email", status: "sent", recepient: "user1@gmail.com" },
    { id: 1, date: "2024-01-20", type: "email", status: "sent", recepient: "user1@gmail.com" }
  ]

  const ToggleSwitch = ({ enabled, onToggle }) => {
    return (
      <button
        onClick={onToggle}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${enabled ? 'bg-[#0D80F2]' : 'bg-gray-300'
          }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${enabled ? 'translate-x-6' : 'translate-x-1'
            }`}
        />
      </button>
    )
  }

  return (
    <div className='bg-[#d1e8f3] min-h-screen p-4 sm:p-6 lg:p-8'>
      <h1 className='text-2xl sm:text-3xl font-bold text-gray-800 mb-4'>System Settings</h1>
      <p className='font-bold text-lg sm:text-[22px] text-[#0D141C] mb-2 mt-5'>Roles and permissions</p>

      <div className='flex flex-col lg:flex-row gap-6'>
        <div className='flex flex-col w-full lg:w-auto'>
          <label htmlFor="roleName" className='text-sm sm:text-base'>Role Name</label>
          <input
            type="text"
            id="roleName"
            className='mt-1 w-full lg:w-[400px] p-2 rounded-lg bg-white placeholder:text-[#61758A] font-normal text-base outline-none'
            placeholder='enter role name'
          />

          <button
            type="button"
            className='mt-8 sm:mt-20 text-left bg-[#0D80F2] px-4 py-3 w-fit rounded-lg text-sm font-bold text-white'
          >
            Add Role
          </button>
        </div>

        <div className='flex flex-col w-full lg:flex-1'>
          <label htmlFor="permissions" className='text-sm sm:text-base'>Permissions</label>
          <textarea
            cols={50}
            rows={5}
            id="permissions"
            className='mt-1 p-2 rounded-lg bg-white placeholder:text-[#61758A] font-normal text-base outline-none w-full'
          />
        </div>
      </div>

      <h1 className='text-lg sm:text-22 font-bold text-[#121417] mt-7'>API Keys</h1>
      <div className='py-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
        <div className='flex flex-col mt-4'>
          <label htmlFor="razorpay_key" className='text-sm sm:text-base'>Razorpay Key</label>
          <input
            type="text"
            id="razorpay_key"
            className='mt-1 p-2 rounded-lg bg-white placeholder:text-[#61758A] font-normal text-base outline-none'
            placeholder='Enter razorpay key'
          />
        </div>
        <div className='flex flex-col mt-4'>
          <label htmlFor="chatbot_key" className='text-sm sm:text-base'>Chatbot Key</label>
          <input
            type="text"
            id="chatbot_key"
            className='mt-1 p-2 rounded-lg bg-white placeholder:text-[#61758A] font-normal text-base outline-none'
            placeholder='Enter chatbot key'
          />
        </div>
        <div className='flex flex-col mt-4'>
          <label htmlFor="smtp_key" className='text-sm sm:text-base'>Email (SMTP) Configuration</label>
          <input
            type="text"
            id="smtp_key"
            className='mt-1 p-2 rounded-lg bg-white placeholder:text-[#61758A] font-normal text-base outline-none'
            placeholder='Enter SMTP Configuration'
          />
        </div>
      </div>
      <button
        type="button"
        className='mt-5 text-left bg-[#0D80F2] px-4 py-3 w-fit rounded-lg text-sm font-bold text-white'
      >
        Save Api Keys
      </button>

      <h1 className='font-bold text-lg sm:text-22 text-[#121417] mt-7'>App Configuration</h1>

      <div className='mt-2 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 bg-white p-4 rounded-lg'>
        <div className='flex-1'>
          <h1 className='text-[#121417] font-medium'>Maintenance Mode</h1>
          <p className='text-[#61758A] text-sm'>Enable or disable maintenance mode for the application</p>
        </div>
        <ToggleSwitch
          enabled={maintenanceMode}
          onToggle={() => setMaintenanceMode(!maintenanceMode)}
        />
      </div>

      <div className='mt-2 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 bg-white p-4 rounded-lg'>
        <div className='flex-1'>
          <h1 className='text-[#121417] font-medium'>Chatbot Enable/Disable</h1>
          <p className='text-[#61758A] text-sm'>Enable or disable the chatbot feature</p>
        </div>
        <ToggleSwitch
          enabled={chatbotEnabled}
          onToggle={() => setChatbotEnabled(!chatbotEnabled)}
        />
      </div>
    </div>
  )
}

export default SystemSettings