import React from 'react';
import { FaLightbulb, FaRocket, FaCode, FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { NavLink, Link } from "react-router-dom";

// Animation variants for Framer Motion
const fadeInUp = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const About = () => {
  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen transition-colors duration-300">
      {/* Hero Section */}
      <section className="relative h-screen flex flex-col md:flex-row items-center overflow-hidden">
        {/* Left Side - Text Content */}
        <div className="w-full md:w-1/2 h-full bg-gradient-to-br from-gray-200 via-gray-300 to-gray-400 dark:from-gray-800 dark:via-gray-900 dark:to-black flex items-center justify-center p-8">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-gray-900 dark:text-white text-center max-w-md"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-red-500 to-red-700 bg-clip-text text-transparent">
              Empowering Developers
            </h1>
            <p className="text-lg md:text-xl mb-8 text-gray-700 dark:text-gray-300">
              A platform built to showcase talent, protect ideas, and connect opportunities
            </p>
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(239, 68, 68, 0.3)" }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-red-500 to-red-600 text-white py-3 px-8 rounded-full font-semibold hover:from-red-600 hover:to-red-700 transition duration-300 text-lg shadow-lg"
            >
              <NavLink to='/projects'>Explore the Platform </NavLink>
              
            </motion.button>
          </motion.div>
        </div>

        {/* Right Side - Visual Content */}
        <div className="w-full md:w-1/2 h-full relative bg-gradient-to-br from-gray-900 to-gray-800">
          <img
            src="/aboutus.svg"
            alt="Code Background"
            className="w-full h-full object-cover opacity-60"
          />
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent flex items-center justify-center p-8"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white text-center">
              Showcase Your Work <br />
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Without Compromise
              </span>
            </h2>
          </motion.div>
        </div>
      </section>

      {/* Developer Profile */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden transform hover:scale-[1.02] transition-all duration-300 max-w-4xl mx-auto"
          >
            <div className="md:flex">
              <div className="md:flex-shrink-0">
                <div className="h-64 w-full md:w-64 bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center">
                  <div className="w-48 h-48 bg-white dark:bg-gray-700 rounded-full flex items-center justify-center text-6xl">
                    👨‍💻
                  </div>
                </div>
              </div>
              <div className="p-8">
                <motion.div 
                  variants={fadeInUp} 
                  className="uppercase tracking-wide text-sm text-red-500 dark:text-red-400 font-semibold mb-2"
                >
                  Solo Developer
                </motion.div>
                <motion.h2
                  variants={fadeInUp}
                  className="text-3xl md:text-4xl leading-8 font-extrabold tracking-tight text-gray-900 dark:text-white"
                >
                  Sumit Tiwari
                </motion.h2>
                <motion.p 
                  variants={fadeInUp} 
                  className="mt-4 text-lg text-gray-600 dark:text-gray-300"
                >
                  Passionate full-stack developer with a vision to revolutionize how developers showcase their work
                </motion.p>
                <motion.div variants={fadeInUp} className="mt-6 flex space-x-4">
                  <a 
                    href="#" 
                    className="text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors duration-300 transform hover:scale-110"
                  >
                    <FaGithub size={28} />
                  </a>
                  <a 
                    href="#" 
                    className="text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors duration-300 transform hover:scale-110"
                  >
                    <FaLinkedin size={28} />
                  </a>
                  <a 
                    href="#" 
                    className="text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors duration-300 transform hover:scale-110"
                  >
                    <FaTwitter size={28} />
                  </a>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Project Story */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0, y: -50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold mb-12 text-center text-gray-900 dark:text-white"
          >
            The Story Behind the Project
          </motion.h2>
          <div className="max-w-4xl mx-auto">
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="space-y-8"
            >
              <motion.div 
                variants={fadeInUp} 
                className="bg-gradient-to-br from-red-50 to-red-100 dark:from-gray-700 dark:to-gray-800 p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 border-l-4 border-red-500"
              >
                <h3 className="text-2xl font-bold text-red-900 dark:text-red-400 mb-4 flex items-center">
                  <span className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center mr-4 text-white">1</span>
                  The Problem
                </h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  As a developer, I struggled to showcase my work effectively without exposing my source code. I realized many others faced the same challenge, leading to missed opportunities.
                </p>
              </motion.div>
              
              <motion.div 
                variants={fadeInUp} 
                className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-700 dark:to-gray-800 p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 border-l-4 border-blue-500"
              >
                <h3 className="text-2xl font-bold text-blue-900 dark:text-blue-400 mb-4 flex items-center">
                  <span className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center mr-4 text-white">2</span>
                  The Solution
                </h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  I envisioned a platform where developers could present their projects with live previews while keeping their code private. This idea became the foundation of this project.
                </p>
              </motion.div>
              
              <motion.div 
                variants={fadeInUp} 
                className="bg-gradient-to-br from-green-50 to-green-100 dark:from-gray-700 dark:to-gray-800 p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 border-l-4 border-green-500"
              >
                <h3 className="text-2xl font-bold text-green-900 dark:text-green-400 mb-4 flex items-center">
                  <span className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center mr-4 text-white">3</span>
                  The Journey
                </h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  From concept to execution, this project has been a solo journey filled with challenges and learning. Now, I'm excited to share it with the developer community.
                </p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Project Goals */}
      <section className="py-20 bg-gray-100 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0, y: -50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold mb-16 text-center text-gray-900 dark:text-white"
          >
            Project Goals
          </motion.h2>
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto"
          >
            <motion.div
              variants={fadeInUp}
              whileHover={{ y: -10 }}
              className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl text-center group hover:shadow-2xl transition-all duration-300"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <FaLightbulb className="text-4xl text-white" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">Empower Developers</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Provide a platform for developers to showcase their skills effectively and securely, without compromising their intellectual property.
              </p>
            </motion.div>
            
            <motion.div
              variants={fadeInUp}
              whileHover={{ y: -10 }}
              className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl text-center group hover:shadow-2xl transition-all duration-300"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <FaRocket className="text-4xl text-white" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">Foster Opportunities</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Bridge the gap between talented developers and potential clients or employers, creating meaningful professional connections.
              </p>
            </motion.div>
            
            <motion.div
              variants={fadeInUp}
              whileHover={{ y: -10 }}
              className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl text-center group hover:shadow-2xl transition-all duration-300"
            >
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <FaCode className="text-4xl text-white" />
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">Innovate Showcasing</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Continuously improve the platform to stay at the forefront of technology and provide the best showcasing experience for developers.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0, y: -50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold mb-16 text-center text-gray-900 dark:text-white"
          >
            Project Timeline
          </motion.h2>
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-red-500 to-red-700"></div>
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="relative z-10 space-y-12"
              >
                <motion.div variants={fadeInUp} className="flex items-center w-full">
                  <div className="w-1/2 pr-8 text-right">
                    <div className="bg-white dark:bg-gray-700 p-6 rounded-xl shadow-lg">
                      <div className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Project Inception</div>
                      <div className="text-gray-600 dark:text-gray-300">The idea was born out of personal experience and market research</div>
                    </div>
                  </div>
                  <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-red-700 rounded-full flex items-center justify-center shadow-lg">
                    <div className="w-3 h-3 bg-white rounded-full"></div>
                  </div>
                  <div className="w-1/2 pl-8">
                    <div className="text-gray-600 dark:text-gray-400 font-semibold">January 2023</div>
                  </div>
                </motion.div>
                
                <motion.div variants={fadeInUp} className="flex items-center w-full flex-row-reverse">
                  <div className="w-1/2 pl-8">
                    <div className="bg-white dark:bg-gray-700 p-6 rounded-xl shadow-lg">
                      <div className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Development Kickoff</div>
                      <div className="text-gray-600 dark:text-gray-300">Started building the core functionality of the platform</div>
                    </div>
                  </div>
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center shadow-lg">
                    <div className="w-3 h-3 bg-white rounded-full"></div>
                  </div>
                  <div className="w-1/2 pr-8 text-right">
                    <div className="text-gray-600 dark:text-gray-400 font-semibold">March 2023</div>
                  </div>
                </motion.div>
                
                <motion.div variants={fadeInUp} className="flex items-center w-full">
                  <div className="w-1/2 pr-8 text-right">
                    <div className="bg-white dark:bg-gray-700 p-6 rounded-xl shadow-lg">
                      <div className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Beta Launch</div>
                      <div className="text-gray-600 dark:text-gray-300">Released the beta version to a select group of developers for testing</div>
                    </div>
                  </div>
                  <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-700 rounded-full flex items-center justify-center shadow-lg">
                    <div className="w-3 h-3 bg-white rounded-full"></div>
                  </div>
                  <div className="w-1/2 pl-8">
                    <div className="text-gray-600 dark:text-gray-400 font-semibold">June 2023</div>
                  </div>
                </motion.div>
                
                <motion.div variants={fadeInUp} className="flex items-center w-full flex-row-reverse">
                  <div className="w-1/2 pl-8">
                    <div className="bg-gradient-to-br from-red-500 to-red-700 text-white p-6 rounded-xl shadow-xl">
                      <div className="text-xl font-bold mb-2">Official Launch</div>
                      <div>Excited to introduce the platform to the wider developer community</div>
                    </div>
                  </div>
                  <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                    <div className="w-3 h-3 bg-white rounded-full"></div>
                  </div>
                  <div className="w-1/2 pr-8 text-right">
                    <div className="text-yellow-600 dark:text-yellow-400 font-bold">Coming Soon</div>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-gradient-to-r from-red-500 via-red-600 to-red-700 text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.h2
            initial={{ opacity: 0, y: -50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold mb-6"
          >
            Be Part of the Journey
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto"
          >
            Join me in revolutionizing how developers showcase their work and connect with opportunities
          </motion.p>
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(0,0,0,0.3)" }}
            whileTap={{ scale: 0.95 }}
            className="bg-white text-red-500 py-4 px-10 rounded-full font-bold hover:bg-gray-100 transition duration-300 text-lg shadow-2xl"
          >
            Get Started Now
          </motion.button>
        </div>
      </section>
    </div>
  );
};

export default About;