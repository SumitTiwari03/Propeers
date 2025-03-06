import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import axios from 'axios'
import { FaGithub, FaLinkedin, FaTwitter, FaGlobe, FaEnvelope, FaMapMarkerAlt, FaUniversity, FaEdit, FaTrash } from 'react-icons/fa';
axios.defaults.withCredentials = true

function Profile() {
  const [userData, setUserData] = useState(null);
  const [projects, setProjects] = useState();
  const [personalInfo, setPersonalInfo] = useState({
    imgUrl:'',
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

  const handelReq = async () => {
    try {
      const user = await axios.get('https://propeers.onrender.com/api/profile', {
        withCredentials: true,
      });
      console.log("User data:", user.data.user);
      return user.data;
    } catch (err) {
      console.log("Error while fetching the user data", err);
    }
  };

  const fetchUserData = async (userId) => {
    try {
      console.log("Received userId in request params:", userId);
      const user = await axios.get('https://propeers.onrender.com/api/profile/details', {
        params: { userId }, // Pass userId as a query parameter
        withCredentials: true,
      });

      if (user.data) {
        const profiledata = user.data
        setUserData(profiledata)
        console.log("User profile data:", profiledata);
        setSkills(user.data.tecnicalSkill)
        setPersonalInfo({
          imgUrl:user.data.personalInfo.imgUrl || '',
          name: user.data.personalInfo.username || '',
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
      const project = await axios.get('https://propeers.onrender.com/api/profile/project', {
        query: { userId }, // Pass userId as a query parameter
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
      if (data) {
        setUsers(data.user); // Update users state with the fetched user data
      }
    };

    fetchAndPostProfile();
  }, []);


  useEffect(() => {
    if (users) {
      fetchUserData(users.userId); // Call fetchUserData only after users is set
      handelProject(users.userId)

    }
  }, [users]);

  const [selectedProject, setSelectedProject] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const openPopup = (project) => {
    setSelectedProject(project);
    setIsOpen(true);
    console.log("Project details", project);
  };

  // edit project function
  const editProject = async () => {
    try {
      const response = await axios.patch('api/profile/editproject', selectedProject)
      console.log("response data:- ", response.data)
      console.log("SuccessFully updated:- ", response.data)
      console.log("Project details:-", selectedProject);
      setSelectedProject(null);
      setIsOpen(false);
    } catch (err) {
      console.log("Error while Project edit", err);
    }

  };
  // delete project function
  const deleteProject = async () => {

    try {
      const response = await axios.delete('api/profile/deleteproject', { data: { _id: selectedProject._id } })
      console.log("Project id:-", selectedProject._id);
      console.log("Project successFully delete:- ", response.data);

      setSelectedProject(null);
      setIsOpen(false);
    } catch (err) {
      console.log("Error while deleting the project", err);
    }
  }
  if (!userData) {
    return (
      <>
        <h1 className="text-3xl">Please login..!</h1>
        <button className="bg-blue-500 mt-3 dark:bg-blue-700 hover:bg-blue-600 dark:hover:bg-blue-800 text-white px-4 py-2 rounded flex items-center justify-center">
          <Link to={'/login'} className='flex items-center justify-evenly w-full' >
            Login
          </Link>
        </button>
      </>
    )

  };

  return (
    <div className="bg-white-900 dark:bg-gray-900 min-h-screen p-6">
      <div className="flex flex-col item-cen md:flex-row gap-6">

        {/* Profile Section */}
        <div className="flex flex-col items-center w-full md:w-1/4 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">

          {/* Profile Image & Info */}
          <div className="flex flex-col items-center mb-6">
            <img
              src={personalInfo.imgUrl}
              alt="Profile"
              className=" rounded-full mb-4 shadow-md w-28 h-28 object-cover"
            />
            <h2 className="text-2xl font-bold dark:text-white">{personalInfo.name}</h2>
            <p className="text-gray-400 dark:text-gray-300">#{personalInfo.email}</p>
          </div>

          {/* Social Links */}
          <div className="flex justify-center space-x-4 mb-6">
            {socialLinks.github && (
              <a href={socialLinks.github} target="_blank" rel="noopener noreferrer">
                <FaGithub className="text-2xl text-gray-600 hover:text-red-500 dark:text-gray-300" />
              </a>
            )}
            {socialLinks.linkedIn && (
              <a href={socialLinks.linkedIn} target="_blank" rel="noopener noreferrer">
                <FaLinkedin className="text-2xl text-gray-600 hover:text-red-500 dark:text-gray-300" />
              </a>
            )}
            {socialLinks.Twitter && (
              <a href={socialLinks.Twitter} target="_blank" rel="noopener noreferrer">
                <FaTwitter className="text-2xl text-gray-600 hover:text-red-500 dark:text-gray-300" />
              </a>
            )}
            {socialLinks.others && socialLinks.others.map((link, index) => (
              <a key={index} href={link.url} target="_blank" rel="noopener noreferrer">
                <FaGlobe className="text-2xl text-gray-600 hover:text-red-500 dark:text-gray-300" />
              </a>
            ))}
          </div>

          {/* User Details */}
          <div className="space-y-3  bg-gray-100 dark:bg-gray-700 p-4 rounded-lg shadow">
            <div className="flex items-center justify-center dark:text-gray-300">
              <FaEnvelope className="mr-2" />
              <span>{personalInfo.email}</span>
            </div>
            <div className="flex items-center justify-center dark:text-gray-300">
              <FaMapMarkerAlt className="mr-2" />
              <span>{personalInfo.location}</span>
            </div>
            <div className="flex items-center justify-center dark:text-gray-300">
              <FaUniversity className="mr-2" />
              <span>{personalInfo.college}</span>
            </div>
          </div>

          {/* Skills Section */}
          <div className="w-full mt-6 bg-gray-100 dark:bg-gray-700 p-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-white mb-3 text-center">Skills</h3>
            {skills && skills.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {skills.map((skill, index) => (
                  <span key={index} className="px-3 py-2 text-xs font-medium bg-red-500 text-white rounded-md dark:bg-red-600">
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-center">No skills added yet.</p>
            )}
          </div>

          {/* Edit Button */}
          <Link to={'/edit'} className="w-full mt-4">
            <button className="w-full bg-blue-500 dark:bg-blue-700 hover:bg-blue-600 dark:hover:bg-blue-800 text-white py-2 rounded flex justify-center items-center">
              <FaEdit className="mr-2" /> Edit Profile
            </button>
          </Link>
        </div>

        {/* Projects Section */}
        <div className="w-full md:w-3/4 p-4">
          <h2 className="text-2xl font-bold dark:text-white mb-4">Projects</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects && projects.map((card) => (
              <div key={card._id} className="bg-white dark:bg-gray-800 p-4 shadow-lg border dark:border-gray-700 rounded-lg flex flex-col">
                <img
                  src={card.image}
                  alt={card.title}
                  className="w-full h-40 object-cover rounded-lg mb-4 shadow"
                />
                <h3 className="text-xl font-bold dark:text-white mb-2">{card.title}</h3>
                <p className="text-gray-500 dark:text-gray-300 flex-grow">{card.description}</p>
                <div className="flex justify-between mt-4">
                  <button
                    className="bg-blue-500 dark:bg-blue-700 hover:bg-blue-600 dark:hover:bg-blue-800 text-white px-4 py-2 rounded flex items-center"
                    onClick={() => openPopup(card)}
                  >
                    <FaEdit className="mr-2" /> Edit
                  </button>
                  <a href={`${card.projectUrl}`} target="_blank">
                    <button className="bg-red-500 dark:bg-red-600 hover:bg-red-600 text-white px-4 py-2 rounded flex items-center">
                      Visit
                    </button>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {isOpen && (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
        <h2 className="text-xl font-semibold mb-4">EDIT PROJECT</h2>
        <label className="block mb-2">
          <span className="text-gray-700">Title:</span>
          <input
            type="text"
            value={selectedProject.title}
            onChange={(e) => setSelectedProject({ ...selectedProject, title: e.target.value })}
            className="w-full p-2 border rounded"
          />
        </label>
        <label className="block mb-2">
          <span className="text-gray-700">Project URL:</span>
          <input
            type="text"
            value={selectedProject.projectUrl}
            onChange={(e) => setSelectedProject({ ...selectedProject, projectUrl: e.target.value })}
            className="w-full p-2 border rounded"
          />
        </label>
        <label className="block mb-2">
          <span className="text-gray-700">TectStack:</span>
          <input
            type="text"
            value={selectedProject.techStack}
            onChange={(e) => setSelectedProject({ ...selectedProject, techStack: e.target.value })}
            className="w-full p-2 border rounded"
          />
        </label>
        <label className="block mb-4">
          <span className="text-gray-700">Description:</span>
          <textarea
            rows="5"
            value={selectedProject.description}
            onChange={(e) => setSelectedProject({ ...selectedProject, description: e.target.value })}
            className="w-full p-2 border rounded"
          />
        </label>
        <div className="flex justify-end space-x-2">
          <button
            className="bg-blue-600 dark:bg-blue-600 hover:bg-blue-600 dark:hover:bg-blue-600 text-white px-4 py-2 rounded flex items-center"
            onClick={editProject}
          >
            <FaEdit className="mr-2" /> Save
          </button>
          <button
            className="bg-red-600 dark:bg-red-600 hover:bg-red-600 dark:hover:bg-red-600 text-white px-4 py-2 rounded flex items-center"
            onClick={deleteProject}
          >
            <FaTrash className="mr-2" /> Delete
          </button>
        </div>
      </div>
    </div>
  )}

    </div>
  );
}

  export default Profile;