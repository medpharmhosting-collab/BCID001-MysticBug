import { Outlet } from "react-router-dom"
import Navbar from "../components/Navbar"
import Admin_Sidebar from "../components/Admin_Sidebar"

const AdminDashboard = () => {
  return (
    <div className="bg-[#d1eaf3] min-h-screen">
      <Navbar navBG='#d1eaf3' searchBarColor='#acd8f6' searchSelectorColor='#236ffd' />
      <div className="flex">
        <Admin_Sidebar />
        <div className="flex-1 ml-12 md:ml-[288px] mt-24 md:mt-[80px] bg-white min-h-[calc(100vh-101px)] overflow-y-auto p-0">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
