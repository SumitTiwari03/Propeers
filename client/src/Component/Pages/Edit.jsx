import axios from 'axios';
import React, { useState, useRef, useEffect } from 'react';
import { FaUpload, FaTimes } from 'react-icons/fa';
import { IoArrowBackCircleSharp } from "react-icons/io5";
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { motion } from 'framer-motion';


const baseUrl = import.meta.env.VITE_URL;

export default function Edit() {
    const [userData, setUserData] = useState();
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [personalInfo, setPersonalInfo] = useState({
        imgUrl: '',
        name: '',
        email: '',
        location: '',
        college: ''
    });
    const [socialLinks, setSocialLinks] = useState({
        github: '',
        linkedin: '',
        twitter: '',
        other: ''
    });
    const [selectedSkills, setSelectedSkills] = useState([]);
    const [skillSearch, setSkillSearch] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const fileInputRef = useRef(null);

    const skills = [
        'JavaScript', 'CSS', 'HTML', 'Python', 'React', 'Express', 'MongoDB',
        'Node.js', 'TypeScript', 'Vue.js', 'Angular', 'Java', 'C++', 'Ruby',
        'PHP', 'Swift', 'Kotlin', 'Go', 'Rust', 'SQL', 'GraphQL', 'Docker',
        'Next.js', 'Gsap', 'Tailwind CSS', 'Bootstrap', 'Redux', 'Jest',
        'Git', 'AWS', 'Firebase', 'PostgreSQL', 'Django', 'Flask'
    ];

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                setLoading(true);
                const authResponse = await axios.get(`${baseUrl}/api/profile/edit`, {
                    withCredentials: true,
                });

                if (authResponse.data.user) {
                    setIsAuthenticated(true);
                    const userId = authResponse.data.user.userId;

                    const profileResponse = await axios.get(`${baseUrl}/api/profile/details`, {
                        params: { userId },
                        withCredentials: true,
                    });

                    if (profileResponse.data) {
                        console.log("profileResponse ", profileResponse);
                        setUserData(profileResponse.data);
                    }
                }
            } catch (err) {
                console.error("Error while fetching the user data:", err);
                setIsAuthenticated(false);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    useEffect(() => {
        if (userData) {
            setPersonalInfo({
                imgUrl: userData.personalInfo.imgUrl || '',
                name: userData.personalInfo.username || '',
                email: userData.personalInfo.email || '',
                location: userData.personalInfo.location || '',
                college: userData.personalInfo.college || '',
            });
            setSocialLinks({
                github: userData.socialLinks?.github || '',
                linkedin: userData.socialLinks?.linkedin || '',
                twitter: userData.socialLinks?.twitter || '',
                other: userData.socialLinks?.other || '',
            });
            // Fix: Check for both possible field names
            const skills = userData.technicalSkill || userData.technicalSkill || [];
            console.log("Loaded skills:", skills);
            setSelectedSkills(skills);
        }
    }, [userData]);

    const handlePersonalInfoChange = (e) => {
        setPersonalInfo({ ...personalInfo, [e.target.name]: e.target.value });
    };

    const handleSocialLinksChange = (e) => {
        setSocialLinks({ ...socialLinks, [e.target.name]: e.target.value });
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

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith("image/")) {
            if (file.size > 5 * 1024 * 1024) {
                toast.error("Image size should be less than 5MB");
                return;
            }
            const reader = new FileReader();
            reader.onload = (e) => setSelectedImage(e.target.result);
            reader.readAsDataURL(file);
            setSelectedFile(file);
        } else {
            setSelectedImage(null);
            setSelectedFile(null);
            toast.error("Please upload an image file.");
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith("image/")) {
            if (file.size > 5 * 1024 * 1024) {
                toast.error("Image size should be less than 5MB");
                return;
            }
            const reader = new FileReader();
            reader.onload = (e) => setSelectedImage(e.target.result);
            reader.readAsDataURL(file);
            setSelectedFile(file);
        } else {
            toast.error("Invalid file type. Please upload an image.");
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const HandleEdit = async () => {
        try {
            setIsSaving(true);
            const formData = new FormData();

            // Append userId
            formData.append('userId', userData.user);
            
            // Log skills before sending
            console.log("Selected skills before sending:", selectedSkills);
            
            // Append skills as JSON string
            formData.append('technicalSkill', JSON.stringify(selectedSkills));
            
            // Append personalInfo (without imgUrl as it's handled separately)
            const personalInfoToSend = {
                username: personalInfo.name,
                email: personalInfo.email,
                location: personalInfo.location,
                college: personalInfo.college,
            };
            formData.append('personalInfo', JSON.stringify(personalInfoToSend));
            
            // Append socialLinks
            formData.append('socialLinks', JSON.stringify(socialLinks));

            // Append image file if selected
            if (selectedFile) {
                formData.append('imgUrl', selectedFile);
            }

            // Log formData contents
            console.log("FormData contents:");
            for (let pair of formData.entries()) {
                console.log(pair[0] + ': ' + pair[1]);
            }

            const response = await axios.patch(`${baseUrl}/api/profile/edit`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                withCredentials: true,
            });
            
            console.log("Server response:", response.data);
            toast.success("Profile updated successfully!");
            
            // Refresh data after successful update
            setTimeout(() => {
                window.location.href = '/profile';
            }, 1500);
            
        } catch (error) {
            console.error('Update error:', error);
            console.error('Error response:', error.response?.data);
            toast.error(error.response?.data?.message || 'Update failed');
        } finally {
            setIsSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="bg-gray-100 dark:bg-gray-900 min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-500 mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">Loading...</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return (
            <div className="bg-gray-100 dark:bg-gray-900 min-h-screen flex flex-col items-center justify-center p-6">
                <h1 className="text-3xl dark:text-white mb-4">Please login..!</h1>
                <Link to={'/login'}>
                    <button className="bg-blue-500 dark:bg-blue-700 hover:bg-blue-600 dark:hover:bg-blue-800 text-white px-6 py-3 rounded-lg transition duration-300">
                        Login
                    </button>
                </Link>
            </div>
        );
    }

    return (
        <>
            <ToastContainer position="top-right" autoClose={3000} />
            <div className="min-h-screen bg-gray-100 text-black dark:bg-gray-900 dark:text-white p-4 md:p-8">
                <Link to={'/profile'}>
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="bg-red-600 text-white px-4 py-3 flex items-center rounded-lg gap-2 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600 transition duration-300 mb-6"
                    >
                        <IoArrowBackCircleSharp className='text-2xl' /> Back to Profile
                    </motion.button>
                </Link>

                <div className="max-w-4xl mx-auto space-y-8">
                    {/* Personal Information */}
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg"
                    >
                        <h2 className="text-2xl font-bold mb-2">Personal Information</h2>
                        <p className="text-gray-500 mb-6 dark:text-gray-400">Use a permanent address where you can receive mail.</p>
                        
                        <div className="flex flex-col md:flex-row items-start gap-6">
                            <div className="w-32 h-32 bg-gray-100 border-2 shadow-lg rounded-lg flex items-center justify-center overflow-hidden dark:bg-gray-700 dark:border-gray-600 flex-shrink-0">
                                {selectedImage ? (
                                    <img src={selectedImage} alt="Profile" className="w-full h-full object-cover" />
                                ) : personalInfo.imgUrl ? (
                                    <img src={personalInfo.imgUrl} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="text-gray-400 text-center p-4">
                                        <FaUpload className="mx-auto mb-2" />
                                        <p className="text-xs">No Image</p>
                                    </div>
                                )}
                            </div>

                            <div className="flex-1 space-y-4 w-full">
                                <div
                                    className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center cursor-pointer hover:border-red-500 dark:hover:border-red-500 transition duration-300"
                                    onClick={() => fileInputRef.current.click()}
                                    onDragOver={handleDragOver}
                                    onDrop={handleDrop}
                                >
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleFileChange}
                                        className="hidden"
                                        accept="image/*"
                                    />
                                    <FaUpload className="mx-auto mb-2 text-2xl text-gray-400" />
                                    <p className="font-medium">Click to upload or drag and drop</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">PNG, JPG, or JPEG (Max. 5MB)</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-medium mb-2">Name</label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            value={personalInfo.name}
                                            onChange={handlePersonalInfoChange}
                                            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2.5 focus:ring-2 focus:ring-red-500 focus:outline-none dark:bg-gray-700"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="email" className="block text-sm font-medium mb-2">Email</label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={personalInfo.email}
                                            onChange={handlePersonalInfoChange}
                                            disabled
                                            className="w-full rounded-lg border cursor-not-allowed bg-gray-100 dark:bg-gray-600 border-gray-300 dark:border-gray-600 px-4 py-2.5"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="location" className="block text-sm font-medium mb-2">Location</label>
                                        <input
                                            type="text"
                                            id="location"
                                            name="location"
                                            value={personalInfo.location}
                                            onChange={handlePersonalInfoChange}
                                            placeholder="City, Country"
                                            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2.5 focus:ring-2 focus:ring-red-500 focus:outline-none dark:bg-gray-700"
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="college" className="block text-sm font-medium mb-2">College</label>
                                        <input
                                            type="text"
                                            id="college"
                                            name="college"
                                            value={personalInfo.college}
                                            onChange={handlePersonalInfoChange}
                                            placeholder="Your College/University"
                                            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2.5 focus:ring-2 focus:ring-red-500 focus:outline-none dark:bg-gray-700"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.section>

                    {/* Social Links */}
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg"
                    >
                        <h2 className="text-2xl font-bold mb-2">Social Links</h2>
                        <p className="text-gray-500 mb-6 dark:text-gray-400">Connect your social media profiles.</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="github" className="block text-sm font-medium mb-2">Github</label>
                                <input
                                    type="url"
                                    id="github"
                                    name="github"
                                    value={socialLinks.github}
                                    onChange={handleSocialLinksChange}
                                    placeholder="https://github.com/username"
                                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2.5 focus:ring-2 focus:ring-red-500 focus:outline-none dark:bg-gray-700"
                                />
                            </div>
                            <div>
                                <label htmlFor="linkedin" className="block text-sm font-medium mb-2">LinkedIn</label>
                                <input
                                    type="url"
                                    id="linkedin"
                                    name="linkedin"
                                    value={socialLinks.linkedin}
                                    onChange={handleSocialLinksChange}
                                    placeholder="https://linkedin.com/in/username"
                                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2.5 focus:ring-2 focus:ring-red-500 focus:outline-none dark:bg-gray-700"
                                />
                            </div>
                            <div>
                                <label htmlFor="twitter" className="block text-sm font-medium mb-2">Twitter</label>
                                <input
                                    type="url"
                                    id="twitter"
                                    name="twitter"
                                    value={socialLinks.twitter}
                                    onChange={handleSocialLinksChange}
                                    placeholder="https://twitter.com/username"
                                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2.5 focus:ring-2 focus:ring-red-500 focus:outline-none dark:bg-gray-700"
                                />
                            </div>
                            <div>
                                <label htmlFor="other" className="block text-sm font-medium mb-2">Other</label>
                                <input
                                    type="url"
                                    id="other"
                                    name="other"
                                    value={socialLinks.other}
                                    onChange={handleSocialLinksChange}
                                    placeholder="https://yourwebsite.com"
                                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2.5 focus:ring-2 focus:ring-red-500 focus:outline-none dark:bg-gray-700"
                                />
                            </div>
                        </div>
                    </motion.section>

                    {/* Technical Skills */}
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg"
                    >
                        <h2 className="text-2xl font-bold mb-2">Technical Skills</h2>
                        <p className="text-gray-500 mb-6 dark:text-gray-400">Highlight your technical expertise.</p>
                        <div className="relative">
                            <div className="flex flex-wrap gap-2 mb-4 min-h-[50px] p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700">
                                {selectedSkills.length > 0 ? (
                                    selectedSkills.map(skill => (
                                        <span key={skill} className="bg-red-600 text-white px-3 py-1.5 rounded-md flex items-center gap-2 dark:bg-red-700 text-sm">
                                            {skill}
                                            <button onClick={() => handleSkillRemove(skill)} className="hover:text-red-200">
                                                <FaTimes />
                                            </button>
                                        </span>
                                    ))
                                ) : (
                                    <span className="text-gray-400 dark:text-gray-500 text-sm">No skills selected. Search and add skills below.</span>
                                )}
                            </div>
                            <input
                                type="text"
                                value={skillSearch}
                                onChange={(e) => setSkillSearch(e.target.value)}
                                placeholder="Search and add skills..."
                                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2.5 focus:ring-2 focus:ring-red-500 focus:outline-none dark:bg-gray-700"
                            />
                            {skillSearch && filteredSkills.length > 0 && (
                                <ul className="absolute z-10 w-full bg-white border dark:border-gray-600 dark:text-white rounded-lg mt-2 max-h-60 overflow-auto shadow-lg dark:bg-gray-800">
                                    {filteredSkills.map(skill => (
                                        <li
                                            key={skill}
                                            onClick={() => handleSkillSelect(skill)}
                                            className="px-4 py-3 hover:bg-red-50 dark:hover:bg-gray-700 cursor-pointer transition duration-200 border-b dark:border-gray-700 last:border-b-0"
                                        >
                                            {skill}
                                        </li>
                                    ))}
                                </ul>
                            )}
                            {skillSearch && filteredSkills.length === 0 && (
                                <div className="absolute z-10 w-full bg-white border dark:border-gray-600 rounded-lg mt-2 p-4 shadow-lg dark:bg-gray-800">
                                    <p className="text-gray-500 dark:text-gray-400 text-center">No skills found</p>
                                </div>
                            )}
                        </div>
                        
                        <div className="flex justify-center mt-8">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={HandleEdit}
                                disabled={isSaving}
                                className="bg-red-600 text-white px-20 py-3 rounded-lg hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600 transition duration-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSaving ? 'Saving...' : 'Save Changes'}
                            </motion.button>
                        </div>
                    </motion.section>
                </div>
            </div>
        </>
    );
}   