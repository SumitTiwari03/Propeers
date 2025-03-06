import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios'
import { NavLink, useNavigate } from 'react-router-dom'; // Import NavLink from react-router-dom
import { FaBars, FaTimes, FaUser, FaMoon, FaSun, FaHeart, FaSignOutAlt, FaUpload } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import { login, logout, toggleDarkMode } from '../../Redux/Store';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const { isLoggedIn, user } = useSelector((state) => state.auth);
  const isDarkMode = useSelector((state) => state.darkMode.isDarkMode);
  const dispatch = useDispatch();
  const navigate = useNavigate()

  // Function to fetch user data from API
  const fetchUserData = async () => {
    try {
      const response = await axios.get('/api/profile', { withCredentials: true });
      if (response.data.user) {
        dispatch(login(response.data.user)); // Update Redux with user data
      }
    } catch (error) {
      dispatch(logout());
    }
  };
  
  if (isLoggedIn) fetchUserData();

  // Fetch user data and set it in the component state
  useEffect(() => {
    const handleFetchUserData = async () => {
      const savedDarkMode = localStorage.getItem('darkMode') === 'true';
      if (savedDarkMode) {
        dispatch(enableDarkMode());
        document.documentElement.classList.add('dark');
      }
      const userData = await fetchUserData();
      if (userData) {
        setUsername(userData.username); // Set the fetched username
        dispatch(login()); // Log in the user after successful fetch
      }
    };
    handleFetchUserData();
  }, [dispatch]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleMenu = () => setIsOpen(!isOpen);
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  const toggleDarkModeHandler = () => {
    dispatch(toggleDarkMode());
    const newMode = !isDarkMode;
    localStorage.setItem('darkMode', newMode);
    document.documentElement.classList.toggle('dark');
  };

  const handleLinkClick = () => {
    setIsOpen(false);
    setIsDropdownOpen(false);
  };
  const handleLogout = async () => {
    try {
      const response = await axios.post('/api/auth/logout', {}, { withCredentials: true });

      // console.log(response)
      if (response.status === 200) {
        // Handle successful logout on frontend
        console.log("Logged out successfully!");
        navigate('/login');
      }
    } catch (error) {
      console.error("Error during logout:", error);
      // Display error message to the user
      alert("An error occurred during logout. Please try again.");
    }

  }
  return (
    <nav className="bg-white z-10 relative dark:bg-gray-900 shadow-lg transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h2 className="text-3xl select-none font-bold dark:text-white">Pro<span className="text-red-500">peers</span></h2>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <NavLink to="/" activeClassname="text-red-500" className={"dark:text-white hover:text-red-500 dark:hover:text-red-500"} onClick={handleLinkClick}>Home</NavLink>
                <NavLink to="/about" activeClassname="text-red-500" className={"dark:text-white hover:text-red-500 dark:hover:text-red-500"} onClick={handleLinkClick}>About</NavLink>
                <NavLink to="/contact" activeClassname="text-red-500" className={"dark:text-white hover:text-red-500 dark:hover:text-red-500"} onClick={handleLinkClick}>Contact Us</NavLink>
                <NavLink to="/propeers" activeClassname="text-red-500" className={"dark:text-white hover:text-red-500 dark:hover:text-red-500"} onClick={handleLinkClick}>Propeers</NavLink>
                <NavLink to="/projects" activeClassname="text-red-500" className={"dark:text-white hover:text-red-500 dark:hover:text-red-500"} onClick={handleLinkClick}>Projects</NavLink>
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6 space-x-3">
              <button
                onClick={toggleDarkModeHandler}
                className="bg-gray-200 dark:bg-gray-700 p-1 rounded-full text-gray-700 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
              >
                {isDarkMode ? <FaSun className="h-6 w-6" /> : <FaMoon className="h-6 w-6" />}
              </button>
              {isLoggedIn ? (
                <>
                  <div className="relative" ref={dropdownRef}>
                    <button
                      onClick={toggleDropdown}
                      className="bg-gray-200 dark:bg-gray-700 rounded-full flex items-center text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
                    >
                      <span className="sr-only">Open user menu</span>
                      <FaUser className="h-8 w-8 rounded-full p-1 text-gray-700 dark:text-gray-300" />
                    </button>
                    {isDropdownOpen && (
                      <div className="origin-top-right z-10 absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none transition-all duration-200 ease-in-out transform opacity-100 scale-100">
                        <div className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300">Hi, {username}</div>
                        <NavLink to="/profile" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"><FaUser className="inline mr-2" />Profile</NavLink>
                        {/* <NavLink to="/favorites" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                          <FaHeart className="inline mr-2 text-red-500" />Favorites
                        </NavLink> */}
                        <button onClick={handleLogout} className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                          <FaSignOutAlt className="inline mr-2" />Logout
                        </button>
                      </div>
                    )}
                  </div>
                  <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center">
                    <NavLink to="/upload" className={"flex p-1"}>
                      <FaUpload className="mr-2" />
                      Upload
                    </NavLink>
                  </button>
                </>
              ) : (
                <NavLink to="/login">
                  <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200">
                    Login
                  </button>
                </NavLink>
              )}
            </div>
          </div>
          <div className="flex md:hidden">
            <button
              onClick={toggleDarkModeHandler}
              className="bg-gray-200 dark:bg-gray-700 p-1 rounded-full text-gray-700 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200 mr-2"
            >
              {isDarkMode ? <FaSun className="h-6 w-6" /> : <FaMoon className="h-6 w-6" />}
            </button>
            <button
              onClick={toggleMenu}
              className="bg-gray-200 dark:bg-gray-700 inline-flex items-center justify-center p-2 rounded-md text-gray-700 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? <FaTimes className="block h-6 w-6" /> : <FaBars className="block h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 flex flex-col items-center">
            <NavLink to="/" activeClassname="text-red-500" onClick={handleLinkClick}>Home</NavLink>
            <NavLink to="/about" activeClassname="text-red-500" onClick={handleLinkClick}>About</NavLink>
            <NavLink to="/propeers" activeClassname="text-red-500" onClick={handleLinkClick}>Propeers</NavLink>
            <NavLink to="/projects" activeClassname="text-red-500" onClick={handleLinkClick}>Projects</NavLink>
          </div>
          {isLoggedIn ? (
            <>
              <hr className="border-gray-200 dark:border-gray-700 mx-4" />
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 flex flex-col items-center">
                <NavLink to="/profile" activeClassname="text-red-500" onClick={handleLinkClick}>Profile</NavLink>
                {/* <NavLink to="/favorites" activeClassname="text-red-500" onClick={handleLinkClick}>
                  <FaHeart className="inline mr-2 text-red-500" />Favorites
                </NavLink> */}
                <NavLink to="/logout" activeClassname="text-red-500" onClick={handleLinkClick}>
                  <FaSignOutAlt className="inline mr-2" />Logout
                </NavLink>
              </div>
              <div className="px-2 pt-2 pb-3 flex justify-center">
                <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center">
                  <FaUpload className="mr-2" />
                  Upload
                </button>
              </div>
            </>
          ) : (
            <div className="px-2 pt-2 pb-3 flex justify-center">
              <NavLink to="/login">
                <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200">
                  Login
                </button>
              </NavLink>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};


export default Navbar;
