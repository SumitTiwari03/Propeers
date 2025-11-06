import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SplineEmbed from '../SmallComponents/SplineEmbed';
import { FaPaperPlane, FaUser, FaEnvelope, FaCommentAlt } from 'react-icons/fa';
import axios from 'axios'


const baseUrl = import.meta.env.VITE_URL;

const InputField = ({ icon: Icon, placeholder, name, value, onChange, type = 'text' }) => (
  <div className="relative mb-6">
    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
      <Icon className="w-5 h-5 text-gray-400" />
    </div>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      className="w-full py-3 pl-10 pr-4 text-gray-700 bg-white border rounded-lg dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
      placeholder={placeholder}
      required
    />
  </div>
);

export default function Contact() {
  const [formState, setFormState] = useState({
    username: '',
    email: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isloading, setIsloading] = useState(false);

  const handleChange = (e) => {
    setFormState({
      ...formState,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    const data= await axios.post(`${baseUrl}/api/maildata`,formState)
    console.log(data);

    setIsSubmitted(true);
  };



  return (
    <>
      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 flex items-center  justify-center dark:bg-gray-800">
        <div className="max-w-4xl w-full ">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white dark:bg-gray-900 shadow-2xl  rounded-3xl overflow-hidden"
          >
            <div className="grid grid-cols-1 md:grid-cols-2">
              {/* Interactive Map Section */}
              <div className="relative h-64 md:h-auto">
                <div className="absolute inset-0">
                  <SplineEmbed/>
                </div>
              </div>


              {/* Contact Form Section */}
              <div className="p-8">
                <AnimatePresence>
                  {!isSubmitted ? (
                    <motion.form
                      key="form"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onSubmit={handleSubmit}
                      className="space-y-6"
                    >
                      <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-6">Get in Touch</h2>
                      <InputField
                        icon={FaUser}
                        placeholder="Your Name"
                        name="username"
                        value={formState.name}
                        onChange={handleChange}
                      />
                      <InputField
                        icon={FaEnvelope}
                        placeholder="Your Email"
                        name="email"
                        value={formState.email}
                        onChange={handleChange}
                        type="email"
                      />
                      <div className="relative mb-6">
                        <div className="absolute top-3 left-3 pointer-events-none">
                          <FaCommentAlt className="w-5 h-5 text-gray-400" />
                        </div>
                        <textarea
                          name="message"
                          value={formState.message}
                          onChange={handleChange}
                          rows="4"
                          className="w-full py-3 pl-10 pr-4 text-gray-700 bg-white border rounded-lg dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
                          placeholder="Your Message"
                          required
                        ></textarea>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="submit"
                        className="w-full px-6 py-3 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-500 rounded-lg hover:bg-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50"
                      >
                        <FaPaperPlane className="inline mr-2" />
                        Send Message
                      </motion.button>
                    </motion.form>
                  ) : (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center"
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 260, damping: 20 }}
                        className="w-24 h-24 rounded-full bg-green-500 flex items-center justify-center mx-auto mb-6"
                      >
                        <FaPaperPlane className="text-white text-4xl" />
                      </motion.div>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Message Sent!</h3>
                      <p className="text-gray-600 dark:text-gray-300">We'll get back to you soon.</p>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsSubmitted(false)}
                        className="mt-6 px-6 py-3 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-500 rounded-lg hover:bg-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50"
                      >
                        Send Another Message
                      </motion.button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      <section className="py-20 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl dark:text-white font-bold mb-16 text-center">Frequently Asked Questions</h2>
          <div className="max-w-3xl mx-auto">
            <FAQ />
          </div>
        </div>
      </section>
    </>
  );
}

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "How do I create an account?",
      answer: "To create an account, click on the 'Sign Up' button in the top right corner of the homepage. Fill out the required information and follow the prompts to complete your registration."
    },
    {
      question: "Is my source code safe on your platform?",
      answer: "I never store or share your source code. The platform allows you to showcase your projects through live previews and descriptions without revealing the underlying code."
    },
    {
      question: "How can I connect with potential clients or employers?",
      answer: "Once your profile is set up and your projects are showcased, interested parties can reach out to you through our secure messaging system. You'll receive notifications when someone wants to connect with you."
    },
    {
      question: "Can I update or remove my projects after posting them?",
      answer: "Yes, you have full control over your projects. You can edit, update, or remove your projects at any time through your user dashboard."
    },
    {
      question: "Is there a limit to how many projects I can showcase?",
      answer: "Currently, there's no limit to the number of projects you can showcase. However, I recommend focusing on your best and most relevant work to make the strongest impression."
    }
  ];

  return (
    <div className="space-y-4 dark:bg-gray-900 dark:text-white">
      {faqs.map((faq, index) => (
        <div key={index} className="border border-gray-200 dark:text-white  rounded-lg overflow-hidden">
          <button
            className="flex justify-between items-center w-full p-4 text-left dark:bg-gray-900 dark:text-white bg-white hover:bg-gray-50 focus:outline-none"
            onClick={() => setOpenIndex(openIndex === index ? null : index)}
          >
            <span className="font-medium  text-gray-900 dark:text-white">{faq.question}</span>
            <svg
              className={`w-5 h-5 text-gray-500 dark:text-white transform ${openIndex === index ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </button>
          {openIndex === index && (
            <div className="p-4 bg-gray-50 dark:text-white dark:bg-gray-900">
              <p className="text-gray-300 ">{faq.answer}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};


