import React from 'react';
import { FaLightbulb, FaRocket, FaCode, FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa';
import { motion } from 'framer-motion';

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
    <div className="bg-gray-100 min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center overflow-hidden">
        {/* Left Side - Text Content */}
        <div className="w-1/2 h-full bg-gradient-to-r dark:from-gray-900  from-gray-300 dark:to-gray-700 to-gray-200  flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-black text-center max-w-md"
          >
            <h1 className="text-5xl font-bold mb-6">Empowering Developers</h1>
            <p className="text-xl mb-8">
              A platform built to showcase talent, protect ideas, and connect opportunities
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="dark:bg-gray-200 bg-gray-900 dark:text-black                                                                                                                                      text-white py-3 px-8 rounded-full font-semibold hover:bg-gray-700 transition duration-300 text-lg"
            >
              Explore the Platform
            </motion.button>
          </motion.div>
        </div>

        {/* Right Side - Visual Content */}
        <div className="w-1/2 h-full relative">
          <img
            src="/aboutus.svg"
            alt="Code Background"
            className="w-full h-full object-cover"
          />
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center"
          >
            <h2 className="text-4xl font-bold text-white text-center">
              Showcase Your Work <br />
              <span className="text-blue-300">Without Compromise</span>
            </h2>
          </motion.div>
        </div>
      </section>

      {/* Developer Profile */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="bg-white rounded-lg shadow-xl overflow-hidden transform hover:scale-105 transition-transform duration-300"
          >
            <div className="md:flex">
              <div className="md:flex-shrink-0">
                <img
                  className="h-48 w-full object-cover md:w-48"
                  src="../../../public/userProfile.png"
                  alt="Developer"
                />
              </div>
              <div className="p-8">
                <motion.div variants={fadeInUp} className="uppercase tracking-wide text-sm text-red-500 font-semibold">
                  Solo Developer
                </motion.div>
                <motion.h2
                  variants={fadeInUp}
                  className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl"
                >
                  Sumit Tiwari
                </motion.h2>
                <motion.p variants={fadeInUp} className="mt-2 text-xl text-gray-500">
                  Passionate full-stack developer with a vision to revolutionize how developers showcase their work
                </motion.p>
                <motion.div variants={fadeInUp} className="mt-4 flex space-x-4">
                  <a href="#" className="text-gray-400 hover:text-red-500">
                    <FaGithub size={24} />
                  </a>
                  <a href="#" className="text-gray-400 hover:text-red-500">
                    <FaLinkedin size={24} />
                  </a>
                  <a href="#" className="text-gray-400 hover:text-red-500">
                    <FaTwitter size={24} />
                  </a>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Project Story */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0, y: -50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-4xl font-bold mb-8 text-center"
          >
            The Story Behind the Project
          </motion.h2>
          <div className="max-w-3xl mx-auto">
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="space-y-8"
            >
              <motion.div variants={fadeInUp} className="bg-gray-50 p-6 rounded-lg shadow-md">
                <h3 className="text-2xl font-bold text-red-900 mb-4">The Problem</h3>
                <p className="text-gray-700">
                  As a developer, I struggled to showcase my work effectively without exposing my source code. I realized many others faced the same challenge, leading to missed opportunities.
                </p>
              </motion.div>
              <motion.div variants={fadeInUp} className="bg-gray-50 p-6 rounded-lg shadow-md">
                <h3 className="text-2xl font-bold text-red-900 mb-4">The Solution</h3>
                <p className="text-gray-700">
                  I envisioned a platform where developers could present their projects with live previews while keeping their code private. This idea became the foundation of this project.
                </p>
              </motion.div>
              <motion.div variants={fadeInUp} className="bg-gray-50 p-6 rounded-lg shadow-md">
                <h3 className="text-2xl font-bold text-red-900 mb-4">The Journey</h3>
                <p className="text-gray-700">
                  From concept to execution, this project has been a solo journey filled with challenges and learning. Now, I'm excited to share it with the developer community.
                </p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Project Goals */}
      <section className="py-20 bg-gray-100">
        <div className="container mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0, y: -50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-4xl font-bold mb-16 text-center"
          >
            Project Goals
          </motion.h2>
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-12"
          >
            <motion.div
              variants={fadeInUp}
              className="bg-white p-8 rounded-lg shadow-md text-center transform hover:scale-105 transition-transform duration-300"
            >
              <FaLightbulb className="text-5xl text-red-500 mx-auto mb-4" />
              <h3 className="text-2xl font-semibold mb-4">Empower Developers</h3>
              <p className="text-gray-700">Provide a platform for developers to showcase their skills effectively and securely, without compromising their intellectual property.</p>
            </motion.div>
            <motion.div
              variants={fadeInUp}
              className="bg-white p-8 rounded-lg shadow-md text-center transform hover:scale-105 transition-transform duration-300"
            >
              <FaRocket className="text-5xl text-red-500 mx-auto mb-4" />
              <h3 className="text-2xl font-semibold mb-4">Foster Opportunities</h3>
              <p className="text-gray-700">Bridge the gap between talented developers and potential clients or employers, creating meaningful professional connections.</p>
            </motion.div>
            <motion.div
              variants={fadeInUp}
              className="bg-white p-8 rounded-lg shadow-md text-center transform hover:scale-105 transition-transform duration-300"
            >
              <FaCode className="text-5xl text-red-500 mx-auto mb-4" />
              <h3 className="text-2xl font-semibold mb-4">Innovate Showcasing</h3>
              <p className="text-gray-700">Continuously improve the platform to stay at the forefront of technology and provide the best showcasing experience for developers.</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0, y: -50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-4xl font-bold mb-16 text-center"
          >
            Project Timeline
          </motion.h2>
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-red-200"></div>
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="relative z-10"
              >
                <motion.div variants={fadeInUp} className="mb-8 flex items-center w-full">
                  <div className="w-1/2 pr-8 text-right">
                    <div className="text-xl font-bold mb-2">Project Inception</div>
                    <div className="text-gray-600">The idea was born out of personal experience and market research</div>
                  </div>
                  <div className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                  <div className="w-1/2 pl-8">
                    <div className="text-gray-600">January 2023</div>
                  </div>
                </motion.div>
                <motion.div variants={fadeInUp} className="mb-8 flex items-center w-full flex-row-reverse">
                  <div className="w-1/2 pl-8">
                    <div className="text-xl font-bold mb-2">Development Kickoff</div>
                    <div className="text-gray-600">Started building the core functionality of the platform</div>
                  </div>
                  <div className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                  <div className="w-1/2 pr-8 text-right">
                    <div className="text-gray-600">March 2023</div>
                  </div>
                </motion.div>
                <motion.div variants={fadeInUp} className="mb-8 flex items-center w-full">
                  <div className="w-1/2 pr-8 text-right">
                    <div className="text-xl font-bold mb-2">Beta Launch</div>
                    <div className="text-gray-600">Released the beta version to a select group of developers for testing</div>
                  </div>
                  <div className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                  <div className="w-1/2 pl-8">
                    <div className="text-gray-600">June 2023</div>
                  </div>
                </motion.div>
                <motion.div variants={fadeInUp} className="flex items-center w-full flex-row-reverse">
                  <div className="w-1/2 pl-8">
                    <div className="text-xl font-bold mb-2">Official Launch</div>
                    <div className="text-gray-600">Excited to introduce the platform to the wider developer community</div>
                  </div>
                  <div className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                  <div className="w-1/2 pr-8 text-right">
                    <div className="text-gray-600">Coming Soon</div>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-gradient-to-r from-red-500 to-red-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <motion.h2
            initial={{ opacity: 0, y: -50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-4xl font-bold mb-4"
          >
            Be Part of the Journey
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-xl mb-8"
          >
            Join me in revolutionizing how developers showcase their work and connect with opportunities
          </motion.p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white text-red-500 py-3 px-8 rounded-full font-semibold hover:bg-gray-100 transition duration-300 text-lg"
          >
            Get Started Now
          </motion.button>
        </div>
      </section>
    </div>
  );
};

export default About;