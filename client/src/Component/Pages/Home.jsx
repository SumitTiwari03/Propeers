import React from 'react';
import { FaCode, FaUser, FaEnvelope, FaArrowRight, FaStar, FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa';
import { useNavigate } from "react-router-dom";

const ParticleBackground = () => (
  <div className="absolute inset-0 overflow-hidden">
    <div className="relative w-full h-full">
      {Array.from({ length: 50 }).map((_, index) => (
        <div
          key={index}
          className="absolute bg-black dark:bg-red-500  rounded-full opacity-40 animate-float"
          style={{
            width: Math.random() * 10 + 5 + 'px',
            height: Math.random() * 10 + 5 + 'px',
            left: Math.random() * 100 + '%',
            top: Math.random() * 100 + '%',
            animationDuration: Math.random() * 3 + 2 + 's',
            animationDelay: Math.random() * 2 + 's'
          }}
        />
      ))}
    </div>
  </div>
);

const TestimonialCard = ({ name, quote, role, company }) => (
  <div className="dark:bg-gray-900  dark:text-white p-6 rounded-lg shadow-md">
    <div className="flex items-center mb-4">
      <FaStar className="text-yellow-400 mr-1" />
      <FaStar className="text-yellow-400 mr-1" />
      <FaStar className="text-yellow-400 mr-1" />
      <FaStar className="text-yellow-400 mr-1" />
      <FaStar className="text-yellow-400" />
    </div>
    <p className="text-gray-600 dark:text-white mb-4 italic">"{quote}"</p>
    <p className="font-semibold">{name}</p>
    <p className="text-sm dark:text-white">{role}, {company}</p>
  </div>
);

const FeatureCard = ({ icon, title, description }) => (
  <div className="bg-white p-8 rounded-xl shadow-lg dark:bg-gray-800 transform hover:scale-105 transition-transform duration-300 border border-gray-100 dark:border-gray-700">
    <div className="text-red-500 mb-6 text-4xl">{icon}</div>
    <h3 className="text-xl font-bold mb-4 dark:text-white">{title}</h3>
    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{description}</p>
  </div>
);

const StepCard = ({ number, title, description }) => (
  <div className="flex items-start bg-white dark:bg-gray-900 p-8 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
    <div className="bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full w-12 h-12 flex items-center justify-center mr-6 flex-shrink-0 text-xl font-bold">
      {number}
    </div>
    <div>
      <h3 className="text-xl font-bold mb-4 dark:text-white">{title}</h3>
      <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{description}</p>
    </div>
  </div>
);
const Home = () => {
  const navigate = useNavigate();
  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Enhanced Hero Section */}
      <section className="relative h-screen flex items-center overflow-hidden bg-gradient-to-br from-gray-300 via-gray-200 to-white dark:bg-gradient-to-br dark:from-gray-900 dark:via-gray-800 dark:to-black">
        <ParticleBackground />
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2">
              <div className="space-y-6 max-w-2xl">
                <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white leading-tight">
                  Showcase Your Projects With
                  <span className="bg-gradient-to-r from-red-500 to-red-600 text-transparent bg-clip-text"> Confidence</span>
                </h1>
                <p className="text-xl text-black dark:text-gray-300 leading-relaxed">
                  ProPeers is your platform to showcase projects, connect with developers,
                  and innovate together - all while protecting your intellectual property.
                </p>
                <div className="flex gap-4 pt-4">
                  <button
                    className="bg-gradient-to-r from-red-500 to-red-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:from-red-600 hover:to-red-700 transition duration-300 flex items-center"
                    onClick={() => navigate("/profile")}
                  >
                    Get Started
                    <FaArrowRight className="ml-2" />
                  </button>
                  <a href="#learnMore">
                    <button className="border-2 border-red-500 text-black dark:text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-red-500/10 transition duration-300">
                      Learn More
                    </button>
                  </a>
                </div>
              </div>
            </div>
            <div className="lg:w-1/2">
              <div className="relative">
                <div className="absolute inset-0  blur-lg opacity-30 rounded-xl"></div>
                <img
                  src="/hero.svg"
                  alt="ProPeers Platform"
                  className="relative rounded-xl w-full"
                />
              </div>
            </div>
          </div>
        </div>
      </section >

      {/* Rest of the sections remain the same but with enhanced styling */}
      {/* Features Section */}
      <section className="py-24 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 dark:text-white">Key Features</h2>
            <div className="w-24 h-1 bg-red-500 mx-auto"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <FeatureCard
              icon={<FaCode />}
              title="Project Showcasing"
              description="Display your projects with live previews, without sharing your source code. Protect your intellectual property while impressing potential clients."
            />
            <FeatureCard
              icon={<FaUser />}
              title="Developer Profiles"
              description="Create a professional profile to highlight your skills, achievements, and portfolio. Stand out in the crowded developer market."
            />
            <FeatureCard
              icon={<FaEnvelope />}
              title="Secure Communication"
              description="Connect with potential clients or employers through our platform. Our built-in messaging system ensures your privacy and professionalism."
            />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id='learnMore' className="py-24 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 dark:text-white">How It Works</h2>
            <div className="w-24 h-1 bg-red-500 mx-auto"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <StepCard
              number="1"
              title="Create Your Profile"
              description="Sign up and build your developer profile with your skills, experience, and portfolio."
            />
            <StepCard
              number="2"
              title="Upload Your Projects"
              description="Add your projects with descriptions, technologies used, and live preview links."
            />
            <StepCard
              number="3"
              title="Connect with Opportunities"
              description="Receive inquiries from interested parties and grow your professional network."
            />
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-white dark:bg-gray-700 py-20 dark:text-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-16 text-center">What Our Users Say</h2>
          <div className="grid grid-cols-1  md:grid-cols-2 gap-12">
            <TestimonialCard

              name="Alex Johnson"
              quote="This platform has been a game-changer for my freelance career. I've received multiple job offers thanks to the exposure my projects have gotten. The ability to showcase my work without sharing the code is invaluable."
              role="Freelance Developer"
              company="Self-employed"
            />
            <TestimonialCard
              name="Sarah Lee"
              quote="As a hiring manager, I love being able to see live previews of candidates' work. It makes the recruitment process so much more efficient and gives us a real sense of a developer's capabilities."
              role="Tech Recruiter"
              company="InnovaTech Solutions"
            />
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="bg-gradient-to-r from-red-500 to-red-600 dark:from-red-700 dark:to-red-800 text-white py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-16 text-center">Our Impact</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-5xl font-bold mb-2">10k+</p>
              <p className="text-xl">Developers</p>
            </div>
            <div>
              <p className="text-5xl font-bold mb-2">50k+</p>
              <p className="text-xl">Projects Showcased</p>
            </div>
            <div>
              <p className="text-5xl font-bold mb-2">5k+</p>
              <p className="text-xl">Successful Hires</p>
            </div>
            <div>
              <p className="text-5xl font-bold mb-2">100+</p>
              <p className="text-xl">Countries Reached</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-white-900 dark:bg-gray-800 dark:text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Showcase Your Work?</h2>
          <p className="text-xl mb-8">Join our community of developers and start getting noticed today!</p>
          <button onClick={() => navigate("/profile")} className="bg-red-500 dark:bg-red-600 text-white py-3 px-8 rounded-full font-semibold hover:bg-red-600 dark:hover:bg-red-700 transition duration-300 text-lg flex items-center mx-auto">
            Sign Up Now
            <FaArrowRight className="ml-2" />
          </button>
        </div>
      </section>


      {/* Footer */}

    </div >
  );
};

export default Home;


