import { useState } from "react";
import { icons } from "../assets/assets";
import { NavLink } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import { images } from "../assets/assets";

const Admin_Sidebar = () => {
  const [open, setOpen] = useState(false);
  const { user } = useAuth();

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="md:hidden fixed top-[110px] left-4 z-50 bg-[#d1eaf3] text-[#0D1A1C] p-2 rounded-md shadow-md"
      >
        <icons.FaArrowRight size={24} />
      </button>

      {/* Backdrop (visible when menu open on mobile) */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <div
        className={`fixed top-[101px] left-0 h-[calc(100vh-101px)] bg-[#d1eaf3] 
           w-[260px] flex flex-col justify-between p-0 z-50
           transform transition-transform duration-300 ease-in-out 
           ${open ? "translate-x-0 mt-[-21px]" : "-translate-x-full"} 
           md:translate-x-0 md:w-[288px]
        `}
      >
        <div>
          <div className="flex items-center gap-2 px-6 py-1">
            <img
              src={images.admin_img}
              alt="admin_img"
              className="w-10 h-10 rounded-full bg-gray-300"
            />
            <div>
              <h1 className="font-lato font-medium text-[#0D1A1C]">
                {user}
              </h1>
              <p className="text-[#111] font-lato font-normal text-sm">
                Admin
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-1 p-4">
            <NavLink
              end
              to="dashboard"
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${isActive
                  ? "bg-[#acd8f6] text-[#0D1A1C]"
                  : "text-[#0D1A1C] hover:bg-[#acd8f6]"
                }`
              }
              onClick={() => setOpen(false)} // close on click (mobile)
            >
              <img src={images.DashboardIcon} alt="DashboardIcon" />
              <span>Dashboard</span>
            </NavLink>

            <NavLink
              to="users"
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${isActive
                  ? "bg-[#acd8f6] text-[#0D1A1C]"
                  : "text-[#0D1A1C] hover:bg-[#acd8f6]"
                }`
              }
              onClick={() => setOpen(false)}
            >
              <img src={images.UsersIcon} alt="UsersIcon" />
              <span>Users</span>
            </NavLink>

            <NavLink
              to="doctors"
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${isActive
                  ? "bg-[#acd8f6] text-[#0D1A1C]"
                  : "text-[#0D1A1C] hover:bg-[#acd8f6]"
                }`
              }
              onClick={() => setOpen(false)}
            >
              <img src={images.DoctorsIcon} alt="DoctorsIcon" />
              <span>Doctors</span>
            </NavLink>
            <NavLink
              to="investors"
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${isActive
                  ? "bg-[#acd8f6] text-[#0D1A1C]"
                  : "text-[#0D1A1C] hover:bg-[#acd8f6]"
                }`
              }
              onClick={() => setOpen(false)}
            >
              <img src={images.UsersIcon} alt="UsersIcon" />
              <span>Investors</span>
            </NavLink>
            <NavLink
              to="patientList"
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${isActive
                  ? "bg-[#acd8f6] text-[#0D1A1C]"
                  : "text-[#0D1A1C] hover:bg-[#acd8f6]"
                }`
              }
              onClick={() => setOpen(false)}
            >
              <img src={images.UsersIcon} alt="UsersIcon" />
              <span>Patients</span>
            </NavLink>
            <NavLink
              to="appointments"
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${isActive
                  ? "bg-[#acd8f6] text-[#0D1A1C]"
                  : "text-[#0D1A1C] hover:bg-[#acd8f6]"
                }`
              }
              onClick={() => setOpen(false)}
            >
              <img src={images.AppointmentsIcon} alt="Appointments" />
              <span>Appointments</span>
            </NavLink>
            <NavLink
              to="medical_histories"
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${isActive
                  ? "bg-[#acd8f6] text-[#0D1A1C]"
                  : "text-[#0D1A1C] hover:bg-[#acd8f6]"
                }`
              }
              onClick={() => setOpen(false)}
            >
              <img src={images.MedicalHistoriesIcon} alt="MedicalHistoriesIcon" />
              <span>Medical Histories</span>
            </NavLink>
            <NavLink
              to="payments"
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${isActive
                  ? "bg-[#acd8f6] text-[#0D1A1C]"
                  : "text-[#0D1A1C] hover:bg-[#acd8f6]"
                }`
              }
              onClick={() => setOpen(false)}
            >
              <img src={images.PaymentsIcon} alt="PaymentsIcon" />
              <span>Payments</span>
            </NavLink>
            <NavLink
              to="chatbot_logs"
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${isActive
                  ? "bg-[#acd8f6] text-[#0D1A1C]"
                  : "text-[#0D1A1C] hover:bg-[#acd8f6]"
                }`
              }
              onClick={() => setOpen(false)}
            >
              <img src={images.ChatbotLogsIcon} alt="ChatbotLogsIcon" />
              <span>Chatbot Logs</span>
            </NavLink>
            <NavLink
              to="notifications"
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${isActive
                  ? "bg-[#acd8f6] text-[#0D1A1C]"
                  : "text-[#0D1A1C] hover:bg-[#acd8f6]"
                }`
              }
              onClick={() => setOpen(false)}
            >
              <img src={images.NotificationsIcon} alt="NotificationsIcon" />
              <span>Notifications</span>
            </NavLink>

            <NavLink
              to="system_settings"
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${isActive
                  ? "bg-[#acd8f6] text-[#0D1A1C]"
                  : "text-[#0D1A1C] hover:bg-[#acd8f6]"
                }`
              }
              onClick={() => setOpen(false)}
            >
              <img src={images.SettingIcon} alt="SettingIcon" />
              <span>System Settings</span>
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin_Sidebar;
