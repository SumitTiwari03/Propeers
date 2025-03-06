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
  FaMoon,
  FaSun,
} from "react-icons/fa"
import axios from "axios"
  
export default function Projects() {
  const [projects, setProjects] = useState([])
  const [filteredProjects, setFilteredProjects] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedProject, setSelectedProject] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const projectsPerPage = 12

  const fetchProjects = async () => {
    try {
      const response = await axios.get("https://propeers.onrender.com/api/projects", {
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
  }, []) //Fixed: Added empty dependency array to only run on mount

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
    <div
      className={"min-h-screen dark:bg-gray-900 bg-gray-100 text-gray-900 transition-colors duration-300"}
    >
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
      className="rounded-lg p-2 overflow-hidden shadow-lg dark:bg-gray-800 bg-white"    >
      <div className="h-48 relative">
        <img
          src={project.imgUrl || "https://via.placeholder.com/400x200"}
          alt={project.title}
          className="w-full h-full rounded-sm object-cover"
        />
      </div>
      <div className="p-6">
        <h3 className="text-xl dark:text-gray-100 font-semibold mb-2">{project.title}</h3>
        <p className="mb-4 dark:text-gray-300 text-gray-600">
          {project.description.length > 100 ? `${project.description.substring(0, 100)}...` : project.description}
        </p>
        <div className="mb-4">
          <h4 className="font-semibold mb-1 dark:text-gray-200">Tech Stack:</h4>
          <div className="flex flex-wrap gap-2">
            {project.techStack.map((tech, index) => (
              <span
                key={index}
                className="px-2 py-1 text-xs rounded-full  dark:bg-gray-700 dark:text-gray-300 bg-gray-200 text-gray-700">
                {tech}
              </span>
            ))}
          </div>
        </div>
        {/* <p className="mb-4 dark:text-gray-300 text-gray-600">Created by: {project.createdBy}</p> */}
        <button
          onClick={onExplore}
          className="w-full px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-300"
        >
          Explore
        </button>
      </div>
    </motion.div>
  )
}

function ProjectModal({ project, onClose  }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50"
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.9 }}
        className="rounded-lg overflow-hidden shadow-xl max-w-4xl w-full dark:bg-gray-800 dark:text-white bg-white text-gray-900">
        <div className="flex flex-col md:flex-row">
          <div className="w-full md:w-1/2 h-64 md:h-auto relative">
            <img
              src={project.imgUrl || "https://via.placeholder.com/400x400"}
              alt={project.title}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="w-full md:w-1/2 p-8">
            <h2 className="text-3xl font-bold mb-4">{project.title}</h2>
            <p className="mb-6 dark:text-gray-300 text-gray-600">{project.description}</p> 
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-2">Tech Stack</h3>
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
            {/* <p className="mb-6 dark:text-gray-300 text-gray-600">Created by: {project.createdBy}</p> */}
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
              {/* <a
                href={project.developerProfileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-300"
              >
                <FaUser className="mr-2" />
                Developer Profile
              </a> */}
              <a
                href={project.projectUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-300"
              >
                <FaExternalLinkAlt className="mr-2" />
                Visit Project
              </a>
            </div>
          </div>
        </div>
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">
          <FaTimes size={24} />
        </button>
      </motion.div>
    </motion.div>
  )
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
