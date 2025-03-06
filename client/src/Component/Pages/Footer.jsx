import { NavLink, Link } from "react-router-dom";
import { FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa';

function Footer() {
    return (
        <footer className="py-12 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200">
            <hr className="mb-5 dark:border-white border-gray-800" />
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div>
                        <h3 className="text-2xl font-bold mb-4 select-none">
                            Pro<span className='text-red-500'>peers</span>
                        </h3>
                        <p className="mb-4">Empowering developers to showcase their work and connect with opportunities.</p>
                        <div className="flex space-x-4">
                            <NavLink to="#" className="hover:text-red-500 dark:hover:text-red-400">
                                <FaGithub size={24} />
                            </NavLink>
                            <NavLink to="#" className="hover:text-red-500 dark:hover:text-red-400">
                                <FaLinkedin size={24} />
                            </NavLink>
                            <NavLink to="#" className="hover:text-red-500 dark:hover:text-red-400">
                                <FaTwitter size={24} />
                            </NavLink>
                        </div>
                    </div>
                    <div>
                        <h4 className="text-lg font-semibold mb-4 select-none">Quick Links</h4>
                        <ul className="space-y-2">
                            <li><NavLink to="/" className="hover:text-red-500 dark:hover:text-red-400">Home</NavLink></li>
                            <li><NavLink to="/about" className="hover:text-red-500 dark:hover:text-red-400">About Us</NavLink></li>
                            <li><NavLink to="/projects" className="hover:text-red-500 dark:hover:text-red-400">Project</NavLink></li>
                            <li><NavLink to="/contact" className="hover:text-red-500 dark:hover:text-red-400">Contact Us</NavLink></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-lg font-semibold mb-4 select-none">Follow Us</h4>
                        <ul className="space-y-2">
                            <li><NavLink to="#" className="hover:text-red-500 dark:hover:text-red-400">Linked In</NavLink></li>
                            <li><NavLink to="#" className="hover:text-red-500 dark:hover:text-red-400">Discord</NavLink></li>
                            <li><NavLink to="#" className="hover:text-red-500 dark:hover:text-red-400">Github</NavLink></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-lg font-semibold mb-4 select-none">Contact Us</h4>
                        <p className="mb-2">Email: Sumittiwari03@gmail.com</p>
                        <p className="mb-2">Phone: +91 (123) 456-7890</p>
                        <p>Address: 123 Tech Street, Mumbai, Maharashtra</p>
                    </div>
                </div>
                <div className="border-t border-gray-700 dark:border-gray-600 mt-8 pt-8 text-center">
                    <p>&copy; 2023 <NavLink to="/" className="hover:underline dark:hover:text-red-400">Propeers</NavLink>. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
