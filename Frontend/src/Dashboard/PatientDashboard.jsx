import { useState } from 'react'
import { images } from '../assets/assets'
import AppointmentsModal from '../components/patient/AppointmentsModal'
import MedicalRecords from '../components/patient/MedicalRecords'
import Prescriptions from '../components/patient/Prescriptions'
import Reminders from '../components/patient/Reminders'
import Monitoring from '../components/patient/Monitoring'
import { useAuth } from '../Context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { BASE_URL } from "../config/config.js"

const PatientDashboard = () => {
  const [selectedCard, setSelectedCard] = useState(null)
  const [activeDoctorCount, setActiveDoctorCount] = useState(0)
  const { user, uid, userName, isProfileAdded } = useAuth()
  const displayName = userName || user
  const navigate = useNavigate()
  const isNewUser = localStorage.getItem("isNewUser") === "true"
  const cardsData = [
    { id: 1, src: images.Appointments, title: "Appointments" },
    { id: 2, src: images.Medical_Records, title: "Medical Records" },
    { id: 3, src: images.Prescriptions, title: "Prescriptions" },
    { id: 4, src: images.Reminders, title: "Reminders" },
    { id: 5, src: images.Monitoring, title: "Monitoring" }
  ]
  const sirenwtext = '/gifs/sirenwtext.gif';


  const handleNavigateToUpload = () => {
    setSelectedCard(null);
    setTimeout(() => {
      navigate("/patient-dashboard/upload-medical-records");
    }, 50);
  };

  useEffect(() => {
    const fetchActiveDoctorsCount = async () => {
      try {
        const response = await fetch(`${BASE_URL}/doctors/active_doctors_data?patientId=${uid}`)
        const data = await response.json()
        const doctors = data.doctors || []
        const activeCount = doctors.filter(doctor => doctor.isActive === true).length
        setActiveDoctorCount(activeCount)
      } catch (error) {
        console.log("error while getting active doctors count:", error)
        setActiveDoctorCount(0)
      }
    }
    if (uid) {
      fetchActiveDoctorsCount()
    }
  }, [uid, BASE_URL])

  const handleSupportCall = () => {
    window.location.href = "tel:number"
  }
  return (
    <div className='bg-[#76b1c1] h-full min-h-screen relative overflow-auto'>
      <div className='pt-20 md:pt-24 pb-8 px-4 sm:px-8 lg:px-16 relative'>
        <div className='bg-transparent rounded-xl p-4 sm:p-6'>
          {/* Profile Completion Alert */}
          {!isProfileAdded && (
            <div className='max-w-7xl mb-4 p-4 bg-yellow-100 border border-yellow-400 text-yellow-800 rounded-lg'>
              <p className='font-lato text-sm sm:text-base'>
                Please complete your profile to enable notifications and password recovery.
              </p>
            </div>
          )}

          <div className='max-w-7xl flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4'>
            <h1 className='font-merriweather text-2xl sm:text-3xl md:text-4xl font-bold text-black'>
              {isNewUser ? `Welcome, ${displayName}` : `Welcome Back, ${displayName}`}
            </h1>
            <div className='flex flex-col items-start sm:items-end gap-2'>
              <p className='font-lato text-sm sm:text-base font-bold text-black'>
                Doctors Active: {activeDoctorCount}
              </p>
              <button className='px-4 sm:px-6 py-2 bg-[#00504E] text-white font-medium text-xs sm:text-sm rounded hover:bg-[#083f3d] transition-colors' onClick={() => navigate('messages')}>
                MESSAGES
              </button>
            </div>
          </div>

          {/* Cards Grid */}
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-8 lg:mb-0'>
            {cardsData.map((card) => (
              <div
                key={card.id}
                onClick={() => setSelectedCard(card)}
                className='cursor-pointer flex flex-col justify-center items-center rounded-2xl shadow-lg bg-white p-6 sm:p-6 hover:shadow-xl transition-shadow z-[40] sm:z-0 w-full max-w-[400px] h-[190px] sm:h-[220px] mx-auto'
              >
                <img
                  src={card.src}
                  alt={card.title}
                  className='w-[160px] sm:w-[120px] md:w-[190px] h-[100px] sm:h-[100px] md:h-[150px] object-contain'

                />
                <h1 className='font-merriweather text-lg sm:text-xl md:text-2xl lg:text-36 font-bold text-center mt-2'>
                  {card.title}
                </h1>
              </div>
            ))}

            <div className="flex justify-center items-center w-full mx-auto h-[200px] sm:h-[220px] z-40">
              <img
                onClick={handleSupportCall}
                src={sirenwtext}
                alt="emergency alert assistant"
                className="h-[220px] sm:h-[330px] object-contain cursor-pointer hover:scale-110 transition-transform"
              />
            </div>
          </div>
        </div>

        {/* Bottom Wave */}
        {/* <div className='flex fixed bottom-0 right-0 z-10 pointer-events-none'>
          <img
            src={images.bottomWave}
            alt="bottomWave image"
            className='w-full h-[350px] xl:h-[490px] object-cover'
          />
        </div> */}

        {/* Modal */}
        {selectedCard && (
          selectedCard.id === 1 ? <AppointmentsModal onClose={() => setSelectedCard(null)} /> : selectedCard.id === 2 ?
            <MedicalRecords
              onClose={() => setSelectedCard(null)}
              onAddNew={handleNavigateToUpload}
            /> :
            selectedCard.id === 3 ? <Prescriptions onClose={() => setSelectedCard(null)} /> :
              selectedCard.id === 4 ? <Reminders onClose={() => setSelectedCard(null)} /> :
                selectedCard.id === 5 ? <Monitoring onClose={() => setSelectedCard(null)} /> :
                  null
        )}
      </div>
    </div >
  )
}

export default PatientDashboard
