import { useState, useEffect } from "react";
import { FaSearch, FaUserCircle, FaBell } from "react-icons/fa";
import { CiMenuBurger } from "react-icons/ci";
import { IoMdClose } from "react-icons/io";
import { images } from "../assets/assets";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import { BASE_URL } from "../config/config.js";
import { BiArrowBack } from "react-icons/bi";


const Navbar = ({ setProfileShow, setDoctorProfile }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [notificationCount, setNotificationCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMobileNotifications, setShowMobileNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const navigate = useNavigate();
  const { user, uid, userName, role, isProfileAdded, manualLogout } = useAuth();
  const displayName = userName || user;

  const { pathname } = useLocation();

  // Function to get dashboard path based on role
  const getDashboardPath = () => {
    if (!role) return "/";
    return `/${role}-dashboard`;
  };

  // --------- SEARCH ROUTE MAP (edit / add your pages here) ----------
  const searchRoutes = [
    { keywords: ["home", "main", "index", "/"], path: "/" },
    { keywords: ["about", "aboutus", "about us"], path: "/aboutus" },
    { keywords: ["disease", "diseases"], path: "/diseases" },
    { keywords: ["contact", "contactus", "contact us"], path: "/contactus" },
    { keywords: ["login", "sign in", "signin"], path: "/login" },
    { keywords: ["dashboard"], path: getDashboardPath() },
    { keywords: ["emergency", "ambulance"], path: "/#emergency" },
  ];

  const normalize = (text) =>
    (text || "")
      .toString()
      .trim()
      .toLowerCase()
      .replace(/\s+/g, " ");

  const findRoute = (q) => {
    const query = normalize(q);

    // If user types an exact path like /contactus
    if (query.startsWith("/")) return query;

    // keyword match
    const match = searchRoutes.find((r) =>
      r.keywords.some((k) => query === normalize(k) || query.includes(normalize(k)))
    );

    return match?.path || null;
  };

  const handleSearch = () => {
    const route = findRoute(searchQuery);

    if (!route) {
      // If you want: show toast or alert here
      // alert("Page not found. Try: about, diseases, contact, emergency...");
      return;
    }

    navigate(route);
    window.scrollTo(0, 0);
    setShowMenu(false);
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  // Default Colors
  let navBG = "white";
  let searchBarColor = "#93ced8";
  let searchSelectorColor = "#0a4f5b";
  let setSearchTextColor = "#ffffff";
  let placeholderTextColor = "#0A4F5B";

  // Change colors based on dashboard
  if (pathname.includes("patient-dashboard")) {
    navBG = "#76b1c1";
    searchBarColor = "#93D8C1";
    searchSelectorColor = "#0A5B58";
    setSearchTextColor = "#ffffff";
    placeholderTextColor = "#0A5B58";
  }

  if (pathname.includes("doctor-dashboard")) {
    navBG = "#f3e8d1";
    searchBarColor = "#F6E2AC";
    searchSelectorColor = "#fdbc23";
    setSearchTextColor = "#000000";
    placeholderTextColor = "#000000";
  }

  if (pathname.includes("admin-dashboard")) {
    navBG = "#d1e8f3";
    searchBarColor = "#acd8f6";
    searchSelectorColor = "#236ffd";
    setSearchTextColor = "#ffffff";
    placeholderTextColor = "#000000";
  }

  if (pathname.includes("investor-dashboard")) {
    navBG = "#dbedee";
    searchBarColor = "#75cac2";
    searchSelectorColor = "#115a4c";
    setSearchTextColor = "#ffffff";
    placeholderTextColor = "#115A4C";
  }

  const canShowProfileButton = role === "patient" || role === "doctor";

  // Fetch notifications count
  useEffect(() => {
    const fetchNotifications = async () => {
      if (!uid || !canShowProfileButton) {
        setNotificationCount(0);
        return;
      }

      try {
        const response = await fetch(`${BASE_URL}/notifications/${uid}`);
        const data = await response.json();

        if (data.success) {
          const unreadCount = data.notifications.filter(n => !n.read).length;
          setNotificationCount(unreadCount);
        } else {
          setNotificationCount(0);
        }
      } catch (error) {
        console.error('Error fetching notifications:', error);
        setNotificationCount(0);
      }
    };

    fetchNotifications();

    // Refresh notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);

    return () => clearInterval(interval);
  }, [uid, canShowProfileButton, BASE_URL]);

  // Handle notification bell click
  const handleNotificationClick = async () => {
    if (!uid || !canShowProfileButton) return;

    try {
      const response = await fetch(`${BASE_URL}/notifications/${uid}`);
      const data = await response.json();

      if (data.success) {
        setNotifications(data.notifications);
        setShowNotifications(!showNotifications);

        // Mark all notifications as read
        const unreadNotifications = data.notifications.filter(n => !n.read);
        for (const notification of unreadNotifications) {
          try {
            await fetch(`${BASE_URL}/notifications/${notification._id}/read`, {
              method: 'PUT'
            });
          } catch (markError) {
            console.error('Error marking notification as read:', markError);
          }
        }

        // Update count to 0
        setNotificationCount(0);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  // Format notification time
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  return (
    <header
      className={`w-full min-h-[70px] md:h-[90px] bg-white flex items-center justify-between px-4 sm:px-6 lg:px-16 py-2 z-50 shadow-md ${pathname.includes("-dashboard") ? "fixed top-0 z-[100]" : "relative z-[100]"
        }`}
      style={{ backgroundColor: navBG }}
    >
      {/* Logo */}
      <div
        onClick={() => {
          navigate("/");
          window.scrollTo(0, 0);
          setShowMenu(false);
        }}
        className="flex items-center justify-center w-[120px] sm:w-[150px] mt-2 cursor-pointer shrink-0"
      >
        <img src={images.logo} alt="MediH Logo" className="h-8 sm:h-10 w-auto object-contain" />
      </div>

      {/* Desktop Nav */}
      <div className="hidden lg:flex items-center justify-between gap-4 xl:gap-6 flex-1">
        {/* Search */}
        <div
          className={`flex items-center ${displayName ? "w-full max-w-[500px]" : "w-full max-w-[650px]"
            } h-[42px] lg:h-[48px] flex-1 rounded-full border-none overflow-hidden`}
          style={{ backgroundColor: searchBarColor }}
        >
          <div className="relative w-[115px]">
            <select
              className="appearance-none w-full h-10 lg:h-12 px-4 pr-8 rounded-l-md text-sm lg:text-base font-lato border-none outline-none"
              style={{ backgroundColor: searchSelectorColor, color: setSearchTextColor }}
              // Optional: if later you want categories
              defaultValue="Search"
            >
              <option value="Search" className="text-white">
                Search
              </option>
            </select>

            {/* Custom Arrow */}
            <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
                style={{ color: `${setSearchTextColor}` }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          <input
            type="text"
            placeholder="Type Here"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearchKeyDown}
            className="nav-input flex-1 px-2 lg:px-4 bg-transparent outline-none text-xs lg:text-sm"
            style={{ "--tw-placeholder-opacity": "1", color: placeholderTextColor }}
          />

          <button
            type="button"
            onClick={handleSearch}
            className="px-3 lg:px-4 lg:pr-5 text-gray-800 hover:text-black"
            aria-label="Search"
          >
            <FaSearch className="font-light text-sm lg:text-base" />
          </button>
        </div>

        {/* links */}
        <nav className="flex items-center gap-3 xl:gap-8 text-[#000000] whitespace-nowrap text-sm xl:text-[16px] font-normal font-lato">
          {displayName && <Link to={getDashboardPath()}>Dashboard</Link>}
          <Link to="/aboutus" className="font-normal">
            About Us
          </Link>
          <Link to="/#emergency" className="font-normal">
            Emergency
          </Link>
          <Link to="/diseases" className="font-normal">
            Diseases
          </Link>
          <Link to="/contactus" className="font-normal">
            Contact Us
          </Link>

          {/* Notification Icon for Patient and Doctor */}
          {canShowProfileButton && (
            <div className="relative">
              <button
                onClick={handleNotificationClick}
                className="relative p-1 hover:text-gray-700 transition-colors"
              >
                <FaBell size={20} />
                {notificationCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {notificationCount > 9 ? '9+' : notificationCount}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-300 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
                  <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                    <h3 className="font-semibold text-gray-900">Notifications</h3>
                    <button onClick={() => setShowNotifications(false)}>
                      <IoMdClose size={22} />
                    </button>
                  </div>

                  <div className="divide-y divide-gray-200">
                    {notifications.length > 0 ? (
                      notifications.map((notification) => (
                        <div key={notification._id} className="p-4 hover:bg-gray-50">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <p className="text-sm text-gray-900 break-words break-all whitespace-normal">{notification.message}</p>
                              <p className="text-xs text-gray-500 mt-1">{formatTime(notification.createdAt)}</p>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 text-center text-gray-500">
                        <p className="text-sm">No notifications yet</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="relative group">
            <button
              onClick={displayName ? null : () => navigate("/login")}
              className="flex items-center gap-2 font-normal focus:outline-none hover:text-gray-700 transition-colors"
            >
              {displayName ? (
                <span className="max-w-[100px] xl:max-w-none truncate">{displayName}</span>
              ) : (
                "Log in"
              )}{" "}
              <FaUserCircle size={20} />
            </button>

            {displayName && (
              <div className="flex flex-col justify-center items-center absolute right-0 mt-2 w-32 bg-white border border-gray-300 rounded shadow-lg opacity-0 invisible group-hover:visible group-hover:opacity-100 transition-all duration-200 z-40">
                {canShowProfileButton && (
                  <button
                    onClick={() => {
                      if (role === "doctor") {
                        setDoctorProfile(true);
                      } else {
                        isProfileAdded ? setProfileShow(true) : navigate("/tell-us-about-yourself");
                      }
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                  >
                    {role === "doctor" ? "View Profile" : isProfileAdded ? "View Profile" : "Add Profile"}
                  </button>
                )}

                <button onClick={manualLogout} className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm">
                  Logout
                </button>
              </div>
            )}
          </div>
        </nav>
      </div>

      {/* Mobile Menu Button */}
      <div className="lg:hidden flex items-center text-black">
        {showMenu ? (
          <IoMdClose size={24} onClick={() => setShowMenu(false)} className="cursor-pointer" />
        ) : (
          <CiMenuBurger size={24} onClick={() => setShowMenu(true)} className="cursor-pointer" />
        )}
      </div>

      {/* Mobile Dropdown */}
      {showMenu && (
        <nav className="absolute top-full left-0 w-full bg-white text-[#000000] shadow-md flex flex-col items-start gap-4 px-6 py-4 lg:hidden z-[200] font-lato max-h-[calc(100vh-70px)] overflow-y-auto">
          {displayName && (
            <Link className="font-normal text-base" onClick={() => setShowMenu(false)} to={getDashboardPath()}>
              Dashboard
            </Link>
          )}
          <Link onClick={() => setShowMenu(false)} to="/aboutus" className="font-normal text-base">
            About Us
          </Link>
          <Link onClick={() => setShowMenu(false)} to="/#emergency" className="font-normal text-base">
            Emergency
          </Link>
          <Link onClick={() => setShowMenu(false)} to="/diseases" className="font-normal text-base">
            Diseases
          </Link>
          <Link onClick={() => setShowMenu(false)} to="/contactus" className="font-normal text-base">
            Contact Us
          </Link>

          {/* Notification Icon for Mobile */}
          {canShowProfileButton && (
            <div className="relative">
              <button
                onClick={async () => {
                  await handleNotificationClick();
                  setShowMenu(false);
                  setShowMobileNotifications(true);
                }}
                className="relative p-1 hover:text-gray-700 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <h1>Notifications</h1>
                  <FaBell size={20} />
                  {notificationCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {notificationCount > 9 ? '9+' : notificationCount}
                    </span>
                  )}
                </div>
              </button>
            </div>
          )}

          <div className="w-full border-t pt-4">
            <button
              onClick={
                displayName
                  ? null
                  : () => {
                    navigate("/login");
                    setShowMenu(false);
                  }
              }
              className="flex items-center gap-2 font-normal focus:outline-none text-base"
            >
              {displayName ? <span className="truncate max-w-[200px]">{displayName}</span> : "Log in"}{" "}
              <FaUserCircle size={20} />
            </button>

            {displayName && (
              <div className="mt-2 flex flex-col gap-2">
                {canShowProfileButton && (
                  <button
                    onClick={() => {
                      if (role === "doctor") {
                        setDoctorProfile(true);
                      } else {
                        isProfileAdded ? setProfileShow(true) : navigate("/tell-us-about-yourself");
                      }
                      setShowMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                  >
                    {role === "doctor" ? "View Profile" : isProfileAdded ? "View Profile" : "Add Profile"}
                  </button>
                )}

                <button
                  onClick={() => {
                    manualLogout();
                    setShowMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 rounded text-sm bg-gray-50"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </nav>
      )
      }
      {showMobileNotifications && (
        <div className="fixed inset-0 z-[300] bg-white animate-slide-in-left lg:hidden">

          {/* Header */}
          <div className="flex items-center gap-3 p-4 border-b">
            <button
              onClick={() => {
                setShowMobileNotifications(false);
                setShowMenu(true);
                setShowNotifications(false)
              }}
            >
              <BiArrowBack size={20} />
            </button>
            <h2 className="text-lg font-semibold">Notifications</h2>
          </div>

          <div className="divide-y divide-gray-200 overflow-y-auto h-[calc(100vh-64px)]">
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <div key={notification._id} className="p-4">
                  <p className="text-sm text-gray-900 break-words">
                    {notification.message}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {formatTime(notification.createdAt)}
                  </p>
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-gray-500">
                No notifications yet
              </div>
            )}
          </div>
        </div>
      )}
    </header >
  );
};

export default Navbar;
