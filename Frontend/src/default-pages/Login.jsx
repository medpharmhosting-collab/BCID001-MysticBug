import { useNavigate } from 'react-router-dom';
import { images } from '../assets/assets';

const Login = () => {
  const navigate = useNavigate();
  const handleNavigate = (path, userType) => {
    navigate(path, { state: { userType } });
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-between bg-white overflow-hidden">
      <img
        src={images.Clippath_group}
        alt="upper wave image"
        className="absolute sm:-top-10 left-0 w-full object-cover min-h-[450px] z-0 pointer-events-none"
      />

      {/* Center content */}
      <div className="relative z-20 flex flex-col justify-center items-center flex-grow px-4 sm:px-6 lg:px-8 mb-[40px]">
        <div className="text-center pt-16 sm:pt-0">
          <h1 className="font-bold font-merriweather text-3xl sm:text-5xl lg:text-6xl mb-3">Log In</h1>
          <p className="font-lato font-normal mb-3 text-sm sm:text-lg">
            Select login type before proceeding
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-10 max-w-5xl mx-auto">
            <div className="w-full">
              <div
                role="button"
                tabIndex={0}
                aria-label="Patient login"
                onClick={() => handleNavigate('/patient-login', 'patient')}
                className="p-4 rounded-2xl shadow-md border-4 border-[#0A4F5B] h-[200px] sm:h-[250px] flex items-center justify-center bg-white cursor-pointer hover:shadow-lg transition-shadow duration-200"
              >
                <img
                  src={images.Patient}
                  alt="patient image"
                  className="w-[140px] sm:w-[200px] object-contain h-auto pointer-events-none"
                />
              </div>
              <h2 className="font-lato text-lg sm:text-2xl mt-2 text-center">Patient</h2>
            </div>

            <div className="w-full">
              <div
                role="button"
                tabIndex={0}
                aria-label="Doctor login"
                onClick={() => handleNavigate('/doctor-login', 'doctor')}
                className="p-4 rounded-2xl shadow-md border-4 border-[#0A4F5B] h-[200px] sm:h-[250px] flex items-center justify-center bg-white cursor-pointer hover:shadow-lg transition-shadow duration-200"
              >
                <img
                  src={images.Doctor}
                  alt="doctor image"
                  className="w-[140px] sm:w-[200px] object-contain h-auto pointer-events-none"
                />
              </div>
              <h2 className="font-lato text-lg sm:text-2xl mt-2 text-center">Doctor</h2>
            </div>

            <div className="w-full">
              <div
                role="button"
                tabIndex={0}
                aria-label="Investor login"
                onClick={() => handleNavigate('/investor-login', 'investor')}
                className="p-4 rounded-2xl shadow-md border-4 border-[#0A4F5B] h-[200px] sm:h-[250px] flex items-center justify-center bg-white cursor-pointer hover:shadow-lg transition-shadow duration-200"
              >
                <img
                  src={images.Investor}
                  alt="investor image"
                  className="w-[140px] sm:w-[200px] object-contain h-auto pointer-events-none"
                />
              </div>
              <h2 className="font-lato text-lg sm:text-2xl mt-2 text-center">Investor</h2>
            </div>

            <div className="w-full">
              <div
                role="button"
                tabIndex={0}
                aria-label="Admin login"
                onClick={() => handleNavigate('/admin-login', 'admin')}
                className="p-4 rounded-2xl shadow-md border-4 border-[#0A4F5B] h-[200px] sm:h-[250px] flex items-center justify-center bg-white cursor-pointer hover:shadow-lg transition-shadow duration-200"
              >
                <img
                  src={images.Admin}
                  alt="admin image"
                  className="w-[140px] sm:w-[200px] object-contain h-auto pointer-events-none"
                />
              </div>
              <h2 className="font-lato text-lg sm:text-2xl mt-2 text-center">Admin</h2>
            </div>
          </div>
        </div>
      </div>

      <img
        src={images.Group}
        alt="bottom wave image"
        className="absolute -bottom-[10px] sm:bottom-[-80px] left-0 w-full min-h-[200px] object-cover z-0 pointer-events-none"
      />
    </div>
  );
};

export default Login;
