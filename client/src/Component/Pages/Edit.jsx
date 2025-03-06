import axios from 'axios';
import React, { useState, useRef, useEffect } from 'react';
import { FaUpload, FaEye, FaEyeSlash, FaTimes } from 'react-icons/fa';
import { IoArrowBackCircleSharp } from "react-icons/io5";
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export default function Edit() {
    const [userData, setUserData] = useState(); // Store fetched user data
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                // Fetch user authentication data
                const authResponse = await axios.get('https://propeers.onrender.com/api/profile/edit', {
                    withCredentials: true,
                });

                if (authResponse.data.user) {
                    setIsAuthenticated(true); // User is authenticated
                    const userId = authResponse.data.user.userId;

                    // Fetch profile data using userId
                    const profileResponse = await axios.get('https://propeers.onrender.com/api/profile/details', {
                        params: { userId }, // Pass userId as a query parameter
                        withCredentials: true,
                    });

                    if (profileResponse.data) {
                        setUserData(profileResponse.data); // Save profile data
                    }
                }
            } catch (err) {
                console.error("Error while fetching the user data:", err);
                setIsAuthenticated(false); // User is not authenticated
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
            setSelectedSkills(userData.tecnicalSkill || []);
        }
    }, [userData]);


    const skills = [
        'JavaScript', 'CSS', 'HTML', 'Python', 'React', 'Express', 'MongoDB',
        'Node.js', 'TypeScript', 'Vue.js', 'Angular', 'Java', 'C++', 'Ruby',
        'PHP', 'Swift', 'Kotlin', 'Go', 'Rust', 'SQL', 'GraphQL', 'Docker',
        'Html', 'Next.js', 'Gsap'
    ];
    const [personalInfo, setPersonalInfo] = useState({
        imgUrl:'',
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
    const fileInputRef = useRef(null);

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
            const reader = new FileReader();
            reader.onload = (e) => setSelectedImage(e.target.result);
            reader.readAsDataURL(file); // Uncommented
            setSelectedFile(file); // Store the File object
        } else {
            setSelectedImage(null);
            setSelectedFile(null);
            alert("Please upload an image file.");
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith("image/")) {
            const reader = new FileReader();
            reader.onload = (e) => setSelectedImage(e.target.result);
            reader.readAsDataURL(file);
        } else {
            alert("Invalid file type. Please upload an image.");
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };


    const HandleEdit = async () => {
        try {
          const formData = new FormData();
          
          // Append the file with correct field name
          if (selectedFile) {
            formData.append('imgUrl', selectedFile);
          }
          
          // Append other data as JSON strings
          formData.append('userId', userData.user);
          formData.append('personalInfo', JSON.stringify(personalInfo));
          formData.append('socialLinks', JSON.stringify(socialLinks));
          formData.append('technicalSkill', JSON.stringify(selectedSkills));
      
          const response = await axios.patch('https://propeers.onrender.com/api/profile/edit', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
            withCredentials: true,
          });
      
          toast.success("Profile updated successfully!");
        } catch (error) {
          console.error('Update error:', error);
          toast.error(error.response?.data?.message || 'Update failed');
        }
      };
    const [isAuthenticated, setIsAuthenticated] = useState(false)

    if (!isAuthenticated) {
        // navigate('/login')
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

    }

    return (
        <>
        <ToastContainer />
            {isAuthenticated && (

                <div className="min-h-screen bg-white text-black dark:bg-gray-900 dark:text-white p-8">
                    <Link to={'/profile'}>
                        <button className="bg-red-600 text-white px-2 py-3 flex items-center rounded-md gap-2 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600">
                            <IoArrowBackCircleSharp className='text-2xl' /> Back to Profile
                        </button>
                    </Link>
                    <div className="max-w-4xl mx-auto space-y-8">
                        {/* Personal Information */}
                        <section>
                            <h2 className="text-2xl font-bold mb-4">Personal</h2>
                            <p className="text-gray-500 mb-4 dark:text-gray-400">Use a permanent address where you can receive mail.</p>
                            <div className="flex items-start space-x-4">
                                <div className="w-32 h-32 bg-white border shadow-lg rounded-lg flex items-center justify-center overflow-hidden dark:bg-gray-800 dark:border-gray-700">
                                    {selectedImage ? (
                                        <img src={selectedImage} alt="Profile" className="w-full h-full object-cover" />
                                    ) : (
                                        <img src={personalInfo.imgUrl} alt="Profile" className="w-full h-full object-cover" />
                                    )}
                                </div>
                                <div className="flex-1 space-y-4">
                                    <div
                                        className="border-2 border-dashed border-gray-700 rounded-lg p-4 text-center cursor-pointer hover:border-red-600 dark:border-gray-600 dark:hover:border-red-500"
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
                                        <FaUpload className="mx-auto mb-2" />
                                        <p>Click to upload or drag and drop</p>
                                        <p className="text-sm">PNG, JPG, or JPEG (Max. 1MB)</p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label htmlFor="name" className="block text-sm font-medium mb-1">Name</label>
                                            <input
                                                type="text"
                                                id="name"
                                                name="name"
                                                value={personalInfo.name}
                                                onChange={handlePersonalInfoChange}
                                                className="w-full rounded-md border border-gray-700 px-3 py-2 dark:border-gray-600 dark:bg-gray-800"
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
                                            <input
                                                type="email"
                                                id="email"
                                                name="email"
                                                value={personalInfo.email}
                                                onChange={handlePersonalInfoChange}
                                                disabled
                                                className="w-full rounded-md border cursor-not-allowed border-gray-700 px-3 py-2 dark:border-gray-600 dark:bg-gray-800"
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="location" className="block text-sm font-medium mb-1">Location</label>
                                            <input
                                                type="text"
                                                id="location"
                                                name="location"
                                                value={personalInfo.location}
                                                onChange={handlePersonalInfoChange}
                                                className="w-full rounded-md border border-gray-700 px-3 py-2 dark:border-gray-600 dark:bg-gray-800"
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="college" className="block text-sm font-medium mb-1">College</label>
                                            <input
                                                type="text"
                                                id="college"
                                                name="college"
                                                value={personalInfo.college}
                                                onChange={handlePersonalInfoChange}
                                                className="w-full rounded-md border border-gray-700 px-3 py-2 dark:border-gray-600 dark:bg-gray-800"
                                            />
                                        </div>
                                    </div>
                                    
                                </div>
                            </div>
                        </section>

                        {/* Social Links */}
                        <section>
                            <h2 className="text-2xl font-bold mb-4">Social Links</h2>
                            <p className="text-gray-500 mb-4 dark:text-gray-400">Your Social Links.</p>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="github" className="block text-sm font-medium mb-1">Github</label>
                                    <input
                                        type="url"
                                        id="github"
                                        name="github"
                                        value={socialLinks.github}
                                        onChange={handleSocialLinksChange}
                                        className="w-full rounded-md border border-gray-700 px-3 py-2 dark:border-gray-600 dark:bg-gray-800"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="linkedin" className="block text-sm font-medium mb-1">LinkedIn</label>
                                    <input
                                        type="url"
                                        id="linkedin"
                                        name="linkedin"
                                        value={socialLinks.linkedin}
                                        onChange={handleSocialLinksChange}
                                        className="w-full rounded-md border border-gray-700 px-3 py-2 dark:border-gray-600 dark:bg-gray-800"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="twitter" className="block text-sm font-medium mb-1">Twitter</label>
                                    <input
                                        type="url"
                                        id="twitter"
                                        name="twitter"
                                        value={socialLinks.twitter}
                                        onChange={handleSocialLinksChange}
                                        className="w-full rounded-md border border-gray-700 px-3 py-2 dark:border-gray-600 dark:bg-gray-800"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="other" className="block text-sm font-medium mb-1">Other</label>
                                    <input
                                        type="url"
                                        id="other"
                                        name="other"
                                        value={socialLinks.other}
                                        onChange={handleSocialLinksChange}
                                        className="w-full rounded-md border border-gray-700 px-3 py-2 dark:border-gray-600 dark:bg-gray-800"
                                    />
                                </div>
                            </div>
                        </section>

                        {/* Password */}
                        {/* <section>
                            <h2 className="text-2xl font-bold mb-4">Password</h2>
                            <p className="mb-4">Update your password associated with your account.</p>
                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="current-password" className="block text-sm font-medium mb-1">Current Password</label>
                                    <div className="relative">
                                        <input
                                            type={showPassword.current ? "text" : "password"}
                                            id="current-password"
                                            name="current"
                                            value={passwords.current}
                                            onChange={handlePasswordChange}
                                            className="w-full rounded-md border border-gray-700 px-3 py-2 pr-10 dark:border-gray-600 dark:bg-gray-800"
                                        />
                                        <button
                                            type="button"
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                            onClick={() => togglePasswordVisibility('current')}
                                        >
                                            {showPassword.current ? <FaEyeSlash /> : <FaEye />}
                                        </button>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="new-password" className="block text-sm font-medium mb-1">New Password</label>
                                        <div className="relative">
                                            <input
                                                type={showPassword.new ? "text" : "password"}
                                                id="new-password"
                                                name="new"
                                                value={passwords.new}
                                                onChange={handlePasswordChange}
                                                className="w-full rounded-md border border-gray-700 px-3 py-2 pr-10 dark:border-gray-600 dark:bg-gray-800"
                                            />
                                            <button
                                                type="button"
                                                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                                onClick={() => togglePasswordVisibility('new')}
                                            >
                                                {showPassword.new ? <FaEyeSlash /> : <FaEye />}
                                            </button>
                                        </div>
                                    </div>
                                    <div>
                                        <label htmlFor="confirm-password" className="block text-sm font-medium mb-1">Confirm Password</label>
                                        <div className="relative">
                                            <input
                                                type={showPassword.confirm ? "text" : "password"}
                                                id="confirm-password"
                                                name="confirm"
                                                value={passwords.confirm}
                                                onChange={handlePasswordChange}
                                                className="w-full rounded-md border border-gray-700 px-3 py-2 pr-10 dark:border-gray-600 dark:bg-gray-800"
                                            />
                                            <button
                                                type="button"
                                                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                                onClick={() => togglePasswordVisibility('confirm')}
                                            >
                                                {showPassword.confirm ? <FaEyeSlash /> : <FaEye />}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section> */}

                        {/* Technical Skills */}
                        <section>
                            <h2 className="text-2xl font-bold mb-4">Technical Skills</h2>
                            <p className="text-gray-500 mb-4 dark:text-gray-400">Highlighting technical expertise</p>
                            <div className="relative">
                                <div className="flex flex-wrap gap-2 mb-2">
                                    {selectedSkills.map(skill => (
                                        <span key={skill} className="bg-red-600 text-white px-2 py-1 rounded-md flex items-center dark:bg-red-700">
                                            {skill}
                                            <button onClick={() => handleSkillRemove(skill)} className="ml-2">
                                                <FaTimes />
                                            </button>
                                        </span>
                                    ))}
                                </div>
                                <input
                                    type="text"
                                    value={skillSearch}
                                    onChange={(e) => setSkillSearch(e.target.value)}
                                    placeholder="Search skills..."
                                    className="w-full rounded-md border border-gray-700 px-3 py-2 dark:border-gray-600 dark:bg-gray-800"
                                />
                                {skillSearch && (
                                    <ul className="absolute z-10 w-full bg-white border dark:border-gray-700 dark:text-white rounded-md mt-1 max-h-60 overflow-auto dark:bg-gray-900">
                                        {filteredSkills.map(skill => (
                                            <li
                                                key={skill}
                                                onClick={() => handleSkillSelect(skill)}
                                                className="px-3 py-2 hover:bg-red-100 cursor-pointer dark:hover:bg-gray-600"
                                            >
                                                {skill}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                            <center><button onClick={HandleEdit} className="bg-red-600 text-white px-20 mx-auto py-2 rounded-md mt-8 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-600">Save</button></center>
                        </section>
                    </div>
                </div>
            )}
        </>
    );
}


// error solve hogya for usernot found and now img uploadkrneka dekhna hai uploadpage ka ref leke
// fir project page pe kaam krne ka hai search api bhi bana hai 