import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  FaRocket,
  FaChevronLeft,
  FaChevronRight,
  FaTimes,
  FaUser,
  FaExternalLinkAlt,
  FaSearch,
  FaHeart,
  FaRegHeart,
} from "react-icons/fa"
import axios from "axios"
  

const baseUrl = import.meta.env.VITE_URL;

export default function Projects() {
  const [projects, setProjects] = useState([])
  const [filteredProjects, setFilteredProjects] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedProject, setSelectedProject] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const projectsPerPage = 12

  const fetchProjects = async () => {
    try {
      const response = await axios.get(`${baseUrl}/api/projects`, {
        withCredentials: true,
      })
      if (response.data) {
        setProjects(response.data)
        setFilteredProjects(response.data)
      }
      console.log("website projects:- ", response.data)
    } catch (err) {
      console.log("Error ", err)
    }
  }

  useEffect(() => {
    fetchProjects()
  }, [])

  useEffect(() => {
    const results = projects.filter(
      (project) =>
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.createdBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.techStack.some((tech) => tech.toLowerCase().includes(searchTerm.toLowerCase())),
    )
    setFilteredProjects(results)
    setCurrentPage(1)
  }, [searchTerm, projects])

  const indexOfLastProject = currentPage * projectsPerPage
  const indexOfFirstProject = indexOfLastProject - projectsPerPage
  const currentProjects = filteredProjects.slice(indexOfFirstProject, indexOfLastProject)

  const paginate = (pageNumber) => setCurrentPage(pageNumber)

  return (
    <div className="min-h-screen dark:bg-gray-900 bg-gray-100 text-gray-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="relative">
            <input
              type="text"
              placeholder="Search projects by title, tech, or creator..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 pl-10
                dark:bg-gray-800 dark:text-white bg-white text-gray-900"                
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        {filteredProjects.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <FaRocket className="mx-auto text-6xl mb-4 text-red-500" />
            <h2 className="text-2xl dark:text-white font-bold mb-4">No Projects Found</h2>
            <p className="mb-8 dark:text-white">Try adjusting your search or check back later for new projects!</p>
          </motion.div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {currentProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onExplore={() => setSelectedProject(project)}
                />
              ))}
            </div>
            <Pagination
              projectsPerPage={projectsPerPage}
              totalProjects={filteredProjects.length}
              paginate={paginate}
              currentPage={currentPage}
            />
          </>
        )}
      </div>
      <AnimatePresence>
        {selectedProject && (
          <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
        )}
      </AnimatePresence>
    </div>
  )
}

function ProjectCard({ project, onExplore }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="rounded-lg p-2 overflow-hidden shadow-lg dark:bg-gray-800 bg-white flex flex-col h-full"
    >
      <div className="h-48 relative flex-shrink-0">
        <img
          src={project.imgUrl || "https://via.placeholder.com/400x200"}
          alt={project.title}
          className="w-full h-full rounded-sm object-cover"
        />
      </div>
      <div className="p-6 flex flex-col flex-1">
        <h3 className="text-xl dark:text-gray-100 font-semibold mb-2 line-clamp-2">{project.title}</h3>
        
        {/* Fixed height scrollable description */}
        <div className="mb-4 h-20 overflow-y-auto custom-scrollbar">
          <p className="dark:text-gray-300 text-gray-600 text-sm">
            {project.description}
          </p>
        </div>
        
        <div className="mb-4">
          <h4 className="font-semibold mb-2 dark:text-gray-200 text-sm">Tech Stack:</h4>
          <div className="flex flex-wrap gap-2 max-h-20 overflow-y-auto custom-scrollbar">
            {project.techStack.map((tech, index) => (
              <span
                key={index}
                className="px-2 py-1 text-xs rounded-full dark:bg-gray-700 dark:text-gray-300 bg-gray-200 text-gray-700"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
        
        {/* <p className="mb-4 dark:text-gray-300 text-gray-600 text-sm line-clamp-1">Created by: {project.createdBy}</p> */}
        
        {/* Push button to bottom */}
        <button
          onClick={onExplore}
          className="w-full px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-300 mt-auto"
        >
          Explore
        </button>
      </div>
    </motion.div>
  )
}

function ProjectModal({ project, onClose }) {
  const [isFavorite, setIsFavorite] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.9 }}
        onClick={(e) => e.stopPropagation()}
        className="rounded-lg overflow-hidden shadow-xl w-full max-w-6xl h-[90vh] max-h-[700px] dark:bg-gray-800 dark:text-white bg-white text-gray-900 relative"
      >
        <div className="flex flex-col md:flex-row h-full">
          {/* Left side - Fixed Image */}
          <div className="w-full md:w-1/2 h-64 md:h-full relative flex-shrink-0">
            <img
              src={project.imgUrl || "https://via.placeholder.com/400x400"}
              alt={project.title}
              className="w-full h-full object-cover opacity-80"
            />
          </div>

          {/* Right side - Scrollable Content */}
          <div className="w-full md:w-1/2 flex flex-col h-full overflow-hidden">
            <div className="p-6 md:p-8 overflow-y-auto flex-1 custom-scrollbar">
              <h2 className="text-2xl md:text-3xl font-bold mb-4 pr-8">{project.title}</h2>
              
              {/* Fixed height scrollable description */}
              <div className="mb-6 h-32 overflow-y-auto pr-2 custom-scrollbar">
                <p className="dark:text-gray-300 text-gray-600">{project.description}</p>
              </div>

              <div className="mb-6">
                <h3 className="text-lg md:text-xl font-semibold mb-2">Tech Stack</h3>
                <div className="flex flex-wrap gap-2">
                  {project.techStack.map((tech, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 rounded-md text-sm dark:bg-gray-700 dark:text-gray-300 bg-gray-200 text-gray-700"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* <p className="mb-6 dark:text-gray-300 text-gray-600 text-sm md:text-base">
                Created by: {project.createdBy}
              </p> */}

              <div className="flex flex-col sm:flex-row gap-3">
                {/* <a
                  href={project.developerProfileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-300 text-sm md:text-base"
                >
                  <FaUser className="mr-2" />
                  Developer Profile
                </a> */}
                <a
                  href={project.projectUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-300 flex-1 text-sm md:text-base"
                >
                  <FaExternalLinkAlt className="mr-2" />
                  Visit Project
                </a>
                {/* <button
                  onClick={() => setIsFavorite(!isFavorite)}
                  className="flex items-center justify-center px-4 py-2 border-2 border-red-500 rounded-md hover:bg-red-50 dark:hover:bg-gray-700 transition duration-300"
                  aria-label="Toggle favorite"
                >
                  {isFavorite ? (
                    <FaHeart className="text-red-500 text-xl md:text-2xl" />
                  ) : (
                    <FaRegHeart className="text-red-500 text-xl md:text-2xl" />
                  )}
                </button> */}
              </div>
            </div>
          </div>
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 text-white hover:text-red-500 transition-colors duration-200 group"
          aria-label="Close modal"
        >
          <div className="bg-gray-800 bg-opacity-60 hover:bg-opacity-80 dark:bg-gray-700 dark:bg-opacity-70 dark:hover:bg-opacity-90 rounded-full p-2.5 backdrop-blur-sm transition-all duration-200">
            <FaTimes size={20} />
          </div>
        </button>
      </motion.div>

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
      `}</style>
    </motion.div>
  );
}

function Pagination({ projectsPerPage, totalProjects, paginate, currentPage }) {
  const pageNumbers = []
  const totalPages = Math.ceil(totalProjects / projectsPerPage)

  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i)
  }

  return (
    <nav className="flex justify-center mt-8">
      <ul className="flex space-x-2">
        {/* Previous Page Button */}
        <li>
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-2 rounded-md dark:bg-gray-700 dark:text-white bg-gray-200 text-gray-700 disabled:opacity-50"
          >
            <FaChevronLeft />
          </button>
        </li>

        {/* Page Numbers */}
        {pageNumbers.map((number) => (
          <li key={number}>
            <button
              onClick={() => paginate(number)}
              className={`px-3 py-1 rounded-md ${
                currentPage === number
                  ? "bg-red-600 text-white"
                  : "bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-white"
              }`}
            >
              {number}
            </button>
          </li>
        ))}

        {/* Next Page Button */}
        <li>
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-2 rounded-md dark:bg-gray-700 dark:text-white bg-gray-200 text-gray-700 disabled:opacity-50"
          >
            <FaChevronRight />
          </button>
        </li>
      </ul>
    </nav>
  )
}