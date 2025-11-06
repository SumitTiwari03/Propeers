import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaUpload, FaLink, FaCode, FaTimes, FaImage, FaEdit } from 'react-icons/fa';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const InputField = ({ label, name, type = 'text', value, onChange, placeholder, required = false }) => (
  <div className="mb-4">
    <label htmlFor={name} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
    />
  </div>
);

const TextAreaField = ({ label, name, value, onChange, placeholder, required = false }) => (
  <div className="mb-4">
    <label htmlFor={name} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <textarea
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      rows={4}
      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
    ></textarea>
  </div>
);

const skills = [
  'JavaScript', 'CSS', 'HTML', 'Python', 'React', 'Express', 'MongoDB',
  'Node.js', 'TypeScript', 'Vue.js', 'Angular', 'Java', 'C++', 'Ruby',
  'PHP', 'Swift', 'Kotlin', 'Go', 'Rust', 'SQL', 'GraphQL', 'Docker',
  'Spline', 'Three.js', 'Next.js', 'GSAP'
];

export default function ProjectUpload() {
  const [project, setProject] = useState({
    title: '',
    imgUrl: '',
    projectUrl: '',
    description: '',
  });
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [skillSearch, setSkillSearch] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const fileInputRef = useRef(null);
  const [createdBy, setCreatedBy] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProject(prev => ({ ...prev, [name]: value }));
  };

  const handleSkillSelect = (skill) => {
    if (!selectedSkills.includes(skill)) {
      setSelectedSkills([...selectedSkills, skill]);
    }
    setSkillSearch('');
  };

  const handleSkillRemove = (skill) => {
    setSelectedSkills(selectedSkills.filter(s => s !== skill));
  };

  const filteredSkills = skills.filter(skill =>
    skill.toLowerCase().includes(skillSearch.toLowerCase()) && !selectedSkills.includes(skill)
  );

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setSelectedImage(e.target.result);
      reader.readAsDataURL(file);
      toast.success("Image selected successfully!");
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get('https://propeers-07w5.onrender.com/api/profile/upload', {
          withCredentials: true,
        });
        if (response.data.user) {
          setCreatedBy(response.data.user.userId);
          setIsAuthenticated(true);
        }
      } catch (err) {
        console.error("Error while fetching the user data:", err);
        setIsAuthenticated(false);
      }
    };

    fetchUserData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", fileInputRef.current.files[0]); // Append the file
      formData.append("techStack", selectedSkills.join(","));
      formData.append("title", project.title);
      formData.append("imgUrl", project.imgUrl);
      formData.append("projectUrl", project.projectUrl);
      formData.append("description", project.description);
      formData.append("createdBy", createdBy);

      const response = await axios.post("https://propeers-07w5.onrender.com/api/profile/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data) {
        toast.success("Project uploaded successfully!");
        setProject({
          title: '',
          imgUrl: '',
          projectUrl: '',
          description: '',
        });
        setSelectedSkills([]);
        setSelectedImage(null);
        fileInputRef.current.value = ''; // Clear the file input
      }
    } catch (error) {
      console.error("Error uploading project:", error);
      toast.error("Failed to upload project.");
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <>
        <h1 className="text-3xl">Please login..!</h1>
        <button className="bg-blue-500 mt-3 dark:bg-blue-700 hover:bg-blue-600 dark:hover:bg-blue-800 text-white px-4 py-2 rounded flex items-center justify-center">
          <Link to={'/login'} className='flex items-center justify-evenly w-full' >
            Login
          </Link>
        </button>
      </>
    );
  }

  return (
    <>
      <ToastContainer />
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Upload Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white dark:bg-gray-800 shadow-xl rounded-lg flex-1"
            >
              <div className="px-4 py-5 sm:p-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                  <FaUpload className="mr-2" /> Upload Your Project
                </h2>
                <form onSubmit={handleSubmit}>
                  <InputField
                    label="Project Title"
                    name="title"
                    value={project.title}
                    onChange={handleChange}
                    placeholder="Enter your project title"
                    required
                  />
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Project Image
                    </label>
                    <div className="mt-1 flex items-center">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageSelect}
                        ref={fileInputRef}
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current.click()}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:bg-gray-600"
                      >
                        <FaImage className="mr-2" />
                        Select Image
                      </button>
                      {selectedImage && <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">Image selected</span>}
                    </div>
                    <InputField
                      label="Project Image URL (optional)"
                      name="imgUrl"
                      value={project.imgUrl}
                      onChange={handleChange}
                      placeholder="Enter the URL of your project image"
                    />
                  </div>
                  <InputField
                    label="Project URL"
                    name="projectUrl"
                    value={project.projectUrl}
                    onChange={handleChange}
                    placeholder="Enter your project's live URL"
                    required
                  />
                  <TextAreaField
                    label="Project Description"
                    name="description"
                    value={project.description}
                    onChange={handleChange}
                    placeholder="Describe your project"
                    required
                  />
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Technical Skills
                    </label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {selectedSkills.map(skill => (
                        <span
                          key={skill}
                          className="bg-red-600 text-white text-sm font-medium px-1 py-1 rounded dark:bg-red-900 dark:text-white flex items-center"
                        >
                          {skill}
                          <button
                            type="button"
                            onClick={() => handleSkillRemove(skill)}
                            className="ml-1 hover:text-black dark:text-black-400 dark:hover:text-red-200"
                          >
                            <FaTimes />
                          </button>
                        </span>
                      ))}
                    </div>
                    <div className="relative">
                      <input
                        type="text"
                        value={skillSearch}
                        onChange={(e) => setSkillSearch(e.target.value)}
                        placeholder="Search skills..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      />
                      {skillSearch && (
                        <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-60 overflow-auto dark:bg-gray-800 dark:border-gray-600">
                          {filteredSkills.map(skill => (
                            <li
                              key={skill}
                              onClick={() => handleSkillSelect(skill)}
                              className="px-3 py-2 hover:bg-gray-100 cursor-pointer dark:hover:bg-gray-700 dark:text-white"
                            >
                              {skill}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                  <div className="mt-6">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="submit"
                      disabled={loading}
                      className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      {loading ? 'Uploading...' : 'Upload Project'}
                    </motion.button>
                  </div>
                </form>
              </div>
            </motion.div>

            {/* Project Preview (Hidden on Mobile) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white dark:bg-gray-800 shadow-xl rounded-lg overflow-hidden flex-1 hidden lg:block"
            >
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Project Preview</h3>
                <div className="aspect-w-16 aspect-h-9 mb-4">
                  <img
                    src={selectedImage || project.imgUrl || '/placeholder.svg?height=400&width=600'}
                    alt="Project Preview"
                    className="object-cover rounded-lg w-full h-64"
                  />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{project.title || 'Project Title'}</h4>
                <p className="text-gray-600 dark:text-gray-300 mb-4">{project.description || 'Project description will appear here.'}</p>
                <div className="flex-col justify-start text-xl">
                  <div className="flex items-center text-blue-500 dark:text-blue-400">
                    <FaLink className="mr-1" />
                    <a href={project.projectUrl} target="_blank" rel="noopener noreferrer" className="hover:underline">
                      {project.projectUrl || 'Project URL'}
                    </a>
                  </div>
                  <div className="flex items-center font-bold text-red-500 dark:text-red-400">
                    <FaCode className="mr-1" />
                    <span>{selectedSkills.join(', ') || 'Tech stack'}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
}