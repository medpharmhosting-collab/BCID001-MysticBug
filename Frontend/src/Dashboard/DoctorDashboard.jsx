import { Outlet } from "react-router-dom"
import Sidebar from "../components/Sidebar"

const DoctorDashboard = () => {
  return (
    <div className="bg-[#f3e8d1] min-h-screen">
      <div className="flex">
        <Sidebar />

        {/* Main content area */}
        <div className="flex-1 ml-12 md:ml-[288px] pt-24 bg-[#f3e8d1] min-h-screen overflow-y-auto p-0">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default DoctorDashboard