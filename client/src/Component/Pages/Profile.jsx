import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios'
import { FaGithub, FaLinkedin, FaTwitter, FaGlobe, FaEnvelope, FaMapMarkerAlt, FaUniversity, FaEdit, FaTrash, FaTimes } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
axios.defaults.withCredentials = true

function Profile() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [projects, setProjects] = useState();
  const [loading, setLoading] = useState(true);
  const [showLoginMessage, setShowLoginMessage] = useState(false);
  const [personalInfo, setPersonalInfo] = useState({
    imgUrl:'',
    username: '',
    name: '',
    email: '',
    location: '',
    college: ''
  });
  const [skills, setSkills] = useState([])
  const [socialLinks, setSocialLinks] = useState({
    github: '',
    linkedin: '',
    twitter: '',
    other: '' 
  });
  const [users, setUsers] = useState()
  const [selectedProject, setSelectedProject] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [notification, setNotification] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handelReq = async () => {
    try {
      const user = await axios.get('https://propeers-07w5.onrender.com/api/profile', {
        withCredentials: true,
      });
      console.log("User data only user:", user);
      console.log("User data user.data.user:", user.data.user);
      return user.data;
    } catch (err) {
      console.log("Error while fetching the user data", err);
      return null;
    }
  };

  const fetchUserData = async (userId) => {
    try {
      console.log("Received userId in request params:", userId);
      const user = await axios.get('https://propeers-07w5.onrender.com/api/profile/details', {
        params: { userId },
        withCredentials: true,
      });

      if (user.data) {
        const profiledata = user.data
        console.log(user) 
        setUserData(profiledata)
        setSkills(user.data.technicalSkill || user.data.tecnicalSkill || [])
        setPersonalInfo({
          imgUrl:user.data.personalInfo.imgUrl || '',
          name: user.data.personalInfo.name ||'',
          username: user.data.personalInfo.username||'',
          email: user.data.personalInfo.email || '',
          location: user.data.personalInfo.location || '',
          college: user.data.personalInfo.college || '',
        });
        setSocialLinks({
          github: user.data.socialLinks?.github || '',
          linkedin: user.data.socialLinks?.linkedin || '',
          twitter: user.data.socialLinks?.twitter || '',
          other: user.data.socialLinks?.other || '',
        });
      }
    } catch (err) {
      console.error("Error while fetching the user profile data", err);
    }
  };

  const handelProject = async (userId) => {
    try {
      console.log("Received userId in request params:", userId);
      const project = await axios.get('https://propeers-07w5.onrender.com/api/profile/project', {
        query: { userId },
        withCredentials: true,
      });
      if (project.data) setProjects(project.data) 
      console.log("Users project:- ", project);
    } catch (err) {
      console.log("Error ", err);
    }
  }

  useEffect(() => {
    const fetchAndPostProfile = async () => {
      const data = await handelReq();
      if (data && data.user) {
        setUsers(data.user);
      } else {
        // User not found or session expired
        setShowLoginMessage(true);
        setTimeout(() => {
          setLoading(false);
        }, 2000);
      }
    };
    fetchAndPostProfile();
  }, []);

  useEffect(() => {
    if (users) {
      const loadData = async () => {
        await fetchUserData(users.userId);
        await handelProject(users.userId);
        setLoading(false);
      };
      loadData();
    }
  }, [users]);

  const openPopup = (project) => {
    setSelectedProject(project);
    setIsOpen(true);
    console.log("Project details", project);
  };

  const closePopup = () => {
    setSelectedProject(null);
    setIsOpen(false);
    setShowDeleteConfirm(false);
  };

  const editProject = async () => {
    try {
      const response = await axios.patch('https://propeers-07w5.onrender.com/api/profile/editproject', selectedProject)
      console.log("response data:- ", response.data)
      console.log("SuccessFully updated:- ", response.data)
      setNotification({ type: 'success', message: 'Project updated successfully!' });
      setTimeout(() => setNotification(null), 3000);
      closePopup();
      if (users) handelProject(users.userId);
    } catch (err) {
      console.log("Error while Project edit", err);
      setNotification({ type: 'error', message: 'Failed to update project' });
      setTimeout(() => setNotification(null), 3000);
    }
  };

  const deleteProject = async () => {
    try {
      const response = await axios.delete('https://propeers-07w5.onrender.com/api/profile/deleteproject', { 
        data: { _id: selectedProject._id } 
      })
      console.log("Project id:-", selectedProject._id);
      console.log("Project successFully delete:- ", response.data);
      setNotification({ type: 'success', message: 'Project deleted successfully!' });
      setTimeout(() => setNotification(null), 3000);
      closePopup();
      if (users) handelProject(users.userId);
    } catch (err) {
      console.log("Error while deleting the project", err);
      setNotification({ type: 'error', message: 'Failed to delete project' });
      setTimeout(() => setNotification(null), 3000);
    }
  }

  console.log("checking user Data:- ",userData)
  
  if (loading) {
    return (
      <div className="bg-gray-100 dark:bg-gray-900 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!userData || showLoginMessage) {
    return (
      <div className="bg-gray-100 dark:bg-gray-900 min-h-screen flex flex-col items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg max-w-md"
        >
          <div className="text-6xl mb-4">🔒</div>
          <h1 className="text-3xl font-bold dark:text-white mb-3">Session Expired</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Your login session has expired. Please log in again to continue.
          </p>
          <Link to={'/login'}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-blue-500 dark:bg-blue-700 hover:bg-blue-600 dark:hover:bg-blue-800 text-white px-8 py-3 rounded-lg transition duration-300 font-medium"
            >
              Login Again
            </motion.button>
          </Link>
        </motion.div>
      </div>
    )
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen p-6">
      <div className="flex flex-col md:flex-row gap-6">

        {/* Profile Section */}
        <div className="flex flex-col items-center w-full md:w-1/4 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg md:sticky md:top-6 md:max-h-[calc(100vh-3rem)] md:overflow-y-auto custom-scrollbar">

          {/* Profile Image & Info */}
          <div className="flex flex-col items-center mb-6">
            <img
              src={personalInfo.imgUrl || 'https://via.placeholder.com/150'}
              alt="Profile"
              className="rounded-full mb-4 shadow-md w-28 h-28 object-cover"
            />
            <p className="text-black font-bold text-2xl dark:text-gray-300">{personalInfo.username}</p>
          </div>

          {/* Social Links */}
          <div className="flex justify-center space-x-4 mb-6">
            {socialLinks.github && (
              <a 
                href={socialLinks.github} 
                target="_blank" 
                rel="noopener noreferrer"
                title="GitHub Profile"
                className="transform hover:scale-110 transition-transform duration-200"
              >
                <FaGithub className="text-2xl text-gray-600 hover:text-red-500 dark:text-gray-300 transition duration-300" />
              </a>
            )}
            {socialLinks.linkedin && (
              <a 
                href={socialLinks.linkedin} 
                target="_blank" 
                rel="noopener noreferrer"
                title="LinkedIn Profile"
                className="transform hover:scale-110 transition-transform duration-200"
              >
                <FaLinkedin className="text-2xl text-gray-600 hover:text-red-500 dark:text-gray-300 transition duration-300" />
              </a>
            )}
            {socialLinks.twitter && (
              <a 
                href={socialLinks.twitter} 
                target="_blank" 
                rel="noopener noreferrer"
                title="Twitter Profile"
                className="transform hover:scale-110 transition-transform duration-200"
              >
                <FaTwitter className="text-2xl text-gray-600 hover:text-red-500 dark:text-gray-300 transition duration-300" />
              </a>
            )}
            {socialLinks.other && (
              <a 
                href={socialLinks.other} 
                target="_blank" 
                rel="noopener noreferrer"
                title="Website"
                className="transform hover:scale-110 transition-transform duration-200"
              >
                <FaGlobe className="text-2xl text-gray-600 hover:text-red-500 dark:text-gray-300 transition duration-300" />
              </a>
            )}
          </div>

          {/* User Details */}
          <div className="w-full space-y-3 bg-gray-100 dark:bg-gray-700 p-4 rounded-lg shadow">
            <div className="flex items-center dark:text-gray-300">
              <FaEnvelope className="mr-2 flex-shrink-0" />
              <span className="text-sm truncate">{personalInfo.email}</span>
            </div>
            <div className="flex items-center dark:text-gray-300">
              <FaMapMarkerAlt className="mr-2 flex-shrink-0" />
              <span className="text-sm">{personalInfo.location}</span>
            </div>
            <div className="flex items-center dark:text-gray-300">
              <FaUniversity className="mr-2 flex-shrink-0" />
              <span className="text-sm">{personalInfo.college}</span>
            </div>
          </div>

          {/* Skills Section */}
          <div className="w-full mt-6 bg-gray-100 dark:bg-gray-700 p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-white mb-3 text-center">Skills</h3>
            {skills && skills.length > 0 ? (
              <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto custom-scrollbar">
                {skills.map((skill, index) => (
                  <span key={index} className="px-3 py-1.5 text-xs font-medium bg-red-500 text-white rounded-md dark:bg-red-600">
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-center text-sm">No skills added yet.</p>
            )}
          </div>

          {/* Edit Button */}
          <Link to={'/edit'} className="w-full mt-4">
            <button className="w-full bg-blue-500 dark:bg-blue-700 hover:bg-blue-600 dark:hover:bg-blue-800 text-white py-2.5 rounded-lg flex justify-center items-center transition duration-300">
              <FaEdit className="mr-2" /> Edit Profile
            </button>
          </Link>
        </div>

        {/* Projects Section */}
        <div className="w-full md:w-3/4 p-4">
          <h2 className="text-2xl font-bold dark:text-white mb-6">Projects</h2>
          {projects && projects.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((card) => (
                <motion.div
                  key={card._id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white dark:bg-gray-800 p-4 shadow-lg border dark:border-gray-700 rounded-lg flex flex-col h-full"
                >
                  <div className="h-40 w-full mb-4 flex-shrink-0">
                    <img
                      src={card.image || 'https://via.placeholder.com/400x200'}
                      alt={card.title}
                      className="w-full h-full object-cover rounded-lg shadow"
                    />
                  </div>
                  <h3 className="text-xl font-bold dark:text-white mb-2 line-clamp-2">{card.title}</h3>
                  <div className="flex-grow mb-4 h-20 overflow-y-auto custom-scrollbar">
                    <p className="text-gray-500 dark:text-gray-300 text-sm">{card.description}</p>
                  </div>
                  <div className="flex justify-between gap-2 mt-auto">
                    <button
                      className="flex-1 bg-blue-500 dark:bg-blue-700 hover:bg-blue-600 dark:hover:bg-blue-800 text-white px-4 py-2 rounded-lg flex items-center justify-center transition duration-300"
                      onClick={() => openPopup(card)}
                    >
                      <FaEdit className="mr-2" /> Edit
                    </button>
                    <a href={`${card.projectUrl}`} target="_blank" rel="noopener noreferrer" className="flex-1">
                      <button className="w-full bg-red-500 dark:bg-red-600 hover:bg-red-600 dark:hover:bg-red-700 text-white px-4 py-2 rounded-lg transition duration-300">
                        Visit
                      </button>
                    </a>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="text-gray-400 dark:text-gray-500 text-6xl mb-4">📁</div>
              <h3 className="text-xl font-semibold dark:text-white mb-2">No Projects Yet</h3>
              <p className="text-gray-500 dark:text-gray-400 text-center">
                Start showcasing your work by adding your first project!
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Edit Project Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-75 z-50 p-4"
            onClick={closePopup}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative custom-scrollbar"
            >
              <button
                onClick={closePopup}
                className="absolute top-4 right-4 z-10 text-gray-400 hover:text-red-500 transition-colors duration-200"
                aria-label="Close modal"
              >
                <div className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-full p-2.5 backdrop-blur-sm transition-all duration-200">
                  <FaTimes size={20} />
                </div>
              </button>

              <h2 className="text-2xl font-bold mb-6 dark:text-white">Edit Project</h2>
              
              <label className="block mb-4">
                <span className="text-gray-700 dark:text-gray-300 font-medium mb-2 block">Title:</span>
                <input
                  type="text"
                  value={selectedProject?.title || ''}
                  onChange={(e) => setSelectedProject({ ...selectedProject, title: e.target.value })}
                  className="w-full p-3 border dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </label>

              <label className="block mb-4">
                <span className="text-gray-700 dark:text-gray-300 font-medium mb-2 block">Project URL:</span>
                <input
                  type="text"
                  value={selectedProject?.projectUrl || ''}
                  onChange={(e) => setSelectedProject({ ...selectedProject, projectUrl: e.target.value })}
                  className="w-full p-3 border dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </label>

              <label className="block mb-4">
                <span className="text-gray-700 dark:text-gray-300 font-medium mb-2 block">Tech Stack:</span>
                <input
                  type="text"
                  value={selectedProject?.techStack || ''}
                  onChange={(e) => setSelectedProject({ ...selectedProject, techStack: e.target.value })}
                  className="w-full p-3 border dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="e.g., React, Node.js, MongoDB"
                />
              </label>

              <label className="block mb-6">
                <span className="text-gray-700 dark:text-gray-300 font-medium mb-2 block">Description:</span>
                <textarea
                  rows="5"
                  value={selectedProject?.description || ''}
                  onChange={(e) => setSelectedProject({ ...selectedProject, description: e.target.value })}
                  className="w-full p-3 border dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none custom-scrollbar"
                />
              </label>

              <div className="flex justify-end gap-3">
                <button
                  className="bg-gray-400 dark:bg-gray-600 hover:bg-gray-500 dark:hover:bg-gray-500 text-white px-6 py-2.5 rounded-lg transition duration-300"
                  onClick={closePopup}
                >
                  Cancel
                </button>
                <button
                  className="bg-blue-500 dark:bg-blue-600 hover:bg-blue-600 dark:hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg flex items-center transition duration-300"
                  onClick={editProject}
                >
                  <FaEdit className="mr-2" /> Save
                </button>
                <button
                  className="bg-red-500 dark:bg-red-600 hover:bg-red-600 dark:hover:bg-red-700 text-white px-6 py-2.5 rounded-lg flex items-center transition duration-300"
                  onClick={() => setShowDeleteConfirm(true)}
                >
                  <FaTrash className="mr-2" /> Delete
                </button>
              </div>

              {/* Delete Confirmation */}
              {showDeleteConfirm && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-sm mx-4">
                    <h3 className="text-lg font-bold dark:text-white mb-4">Confirm Delete</h3>
                    <p className="dark:text-gray-300 mb-6">Are you sure you want to delete this project? This action cannot be undone.</p>
                    <div className="flex gap-3">
                      <button
                        className="flex-1 bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-lg transition duration-300"
                        onClick={() => setShowDeleteConfirm(false)}
                      >
                        Cancel
                      </button>
                      <button
                        className="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition duration-300"
                        onClick={() => {
                          deleteProject();
                          setShowDeleteConfirm(false);
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Notification Toast */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg ${
              notification.type === 'success' 
                ? 'bg-green-500 text-white' 
                : 'bg-red-500 text-white'
            }`}
          >
            {notification.message}
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #888;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #555;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}

export default Profile;