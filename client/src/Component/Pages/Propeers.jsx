import React, { useState, useEffect, useRef } from 'react';
import { FaPaperPlane, FaRobot, FaUser, FaArrowDown, FaCopy, FaCheck, FaTrash } from 'react-icons/fa';
import axios from 'axios';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { motion, AnimatePresence } from 'framer-motion';

const baseUrl = import.meta.env.VITE_URL;

const CodeBlock = ({ code, language }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); 
  };

  return (
    <div className="relative my-4 rounded-lg overflow-hidden shadow-lg">
      <div className="flex justify-between items-center bg-gray-800 dark:bg-gray-950 px-4 py-2 text-gray-200">
        <span className="text-sm font-mono text-blue-400">{language || 'plaintext'}</span>
        <button
          onClick={handleCopy}
          className="flex items-center space-x-2 text-sm hover:text-white transition-colors duration-200 bg-gray-700 hover:bg-gray-600 px-3 py-1 rounded"
        >
          {copied ? (
            <><FaCheck className="text-green-500" /><span>Copied!</span></>
          ) : (
            <><FaCopy /><span>Copy code</span></>
          )}
        </button>
      </div>
      <SyntaxHighlighter
        language={language || 'plaintext'}
        style={vscDarkPlus}
        customStyle={{
          margin: 0,
          borderRadius: '0 0 0.5rem 0.5rem',
          fontSize: '0.9rem',
        }}
      >
        {code.trim()}
      </SyntaxHighlighter>
    </div>
  );
};

const formatMessage = (text) => {
  if (!text) return null;

  const parts = text.split(/(```[\s\S]*?```)|(\*\*.*?\*\*)|(`.*?`)|(\n#{1,3} .*?\n)|(\n)/g).filter(Boolean);

  return parts.map((part, index) => {
    if (part.startsWith('```')) {
      const lines = part.slice(3, -3).split('\n');
      const language = lines[0].trim();
      const code = lines.slice(1).join('\n');
      return <CodeBlock key={index} code={code} language={language} />;
    }
    
    if (part.startsWith('`') && part.endsWith('`') && !part.includes('\n')) {
      const code = part.slice(1, -1);
      return (
        <code key={index} className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded font-mono text-sm text-red-600 dark:text-red-400">
          {code}
        </code>
      );
    }
    
    if (part.startsWith('**') && part.endsWith('**')) {
      const content = part.slice(2, -2);
      return <strong key={index} className="font-bold text-gray-900 dark:text-white">{content}</strong>;
    }
    
    if (part.match(/^\n#{1,3} /)) {
      const level = part.match(/^(\n#{1,3})/)[1].length - 1;
      const content = part.replace(/^\n#{1,3} /, '').trim();
      const HeadingTag = `h${Math.min(level, 3)}`;
      const sizes = ['text-2xl', 'text-xl', 'text-lg'];
      return React.createElement(
        HeadingTag,
        { key: index, className: `${sizes[level - 1]} font-bold my-3 text-gray-900 dark:text-white` },
        content
      );
    }
    
    if (part === '\n') {
      return <br key={index} />;
    }
    
    return (
      <span key={index} className="leading-relaxed">
        {part}
      </span>
    );
  });
};

const fetchAIResponse = async (prompt, sessionId) => {
  try {
    const response = await axios.post(`${baseUrl}/api/propeers`, {
      prompt: prompt,
      sessionId: sessionId,
    });
    return {
      message: response.data.Message,
      sessionId: response.data.sessionId,
      historyLength: response.data.historyLength
    };
  } catch (error) {
    console.error("Error while fetching AI response:", error);
    throw new Error(error.response?.data?.error || "Failed to get AI response");
  }
};

export default function Propeers() {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const chatEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  useEffect(() => {
    const newSessionId = Date.now().toString();
    setSessionId(newSessionId);
    console.log("New chat session started:", newSessionId);
  }, []);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleScroll = () => {
    if (chatContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 200;
      setShowScrollButton(!isNearBottom);
    }
  };

  useEffect(() => {
    const container = chatContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;

    const userMessage = { id: Date.now(), text: inputText, isUser: true };
    setMessages(prev => [...prev, userMessage]);
    setInputText("");
    setIsLoading(true);
    setError(null);

    try {
      const aiResponse = await fetchAIResponse(inputText, sessionId);
      
      if (aiResponse.sessionId && aiResponse.sessionId !== sessionId) {
        setSessionId(aiResponse.sessionId);
      }
      
      const aiMessage = { 
        id: Date.now() + 1, 
        text: aiResponse.message, 
        isUser: false,
        historyLength: aiResponse.historyLength 
      };
      setMessages(prev => [...prev, aiMessage]);
      
      console.log("Chat history length:", aiResponse.historyLength);
    } catch (err) {
      setError(err.message);
      const errorMessage = { 
        id: Date.now() + 1, 
        text: `Sorry, I encountered an error: ${err.message}`, 
        isUser: false,
        isError: true 
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const clearChat = () => {
    setMessages([]);
    setError(null);
    const newSessionId = Date.now().toString();
    setSessionId(newSessionId);
    console.log("Chat cleared. New session:", newSessionId);
  };

  return (
    <div className="fixed inset-0 flex flex-col bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-black">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-md p-3 border-b dark:border-gray-700 flex-shrink-0">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-red-500 to-red-600 p-2 rounded-lg">
              <FaRobot className="text-white text-xl md:text-2xl" />
            </div>
            <div>
              <h1 className="text-base md:text-lg font-bold text-gray-900 dark:text-white">ProPeers AI</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Powered by Gemini {messages.length > 0 && `• ${messages.length} messages`}
              </p>
            </div>
          </div>
          {messages.length > 0 && (
            <button
              onClick={clearChat}
              className="flex items-center space-x-2 px-3 md:px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors duration-200 text-sm"
            >
              <FaTrash className="text-sm" />
              <span className="hidden sm:inline">Clear</span>
            </button>
          )}
        </div>
      </div>

      {/* Chat Area */}
      <main className="flex-1 overflow-hidden relative">
        <div 
          ref={chatContainerRef} 
          className="h-full overflow-y-auto px-4 py-4 custom-scrollbar"
        >
          <div className="max-w-5xl mx-auto space-y-4">
            {messages.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center h-full min-h-[60vh] space-y-6 px-4"
              >
                <div className="bg-gradient-to-r from-red-500 to-red-600 p-6 rounded-full shadow-2xl">
                  <FaRobot className="text-white text-5xl md:text-6xl" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white text-center">Welcome to ProPeers AI</h2>
                <p className="text-gray-600 dark:text-gray-400 text-center max-w-md text-sm md:text-base">
                  Ask me anything! I'm here to help with coding, explanations, ideas, and more.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 mt-8 w-full max-w-2xl">
                  {[
                    "Explain React hooks",
                    "Write a sorting algorithm",
                    "Debug my JavaScript code",
                    "Best practices for Node.js"
                  ].map((suggestion, i) => (
                    <button
                      key={i}
                      onClick={() => setInputText(suggestion)}
                      className="px-4 md:px-6 py-3 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 text-left border border-gray-200 dark:border-gray-700 hover:border-red-500"
                    >
                      <p className="text-xs md:text-sm text-gray-700 dark:text-gray-300">{suggestion}</p>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[90%] md:max-w-3xl p-4 rounded-2xl shadow-lg transition-all ${
                      message.isUser
                        ? 'bg-gradient-to-r from-red-500 to-red-600 text-white rounded-br-none'
                        : message.isError
                        ? 'bg-red-100 dark:bg-red-900 text-red-900 dark:text-red-100 rounded-bl-none border border-red-300 dark:border-red-700'
                        : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-bl-none border border-gray-200 dark:border-gray-700'
                    }`}
                  >
                    <div className="flex items-center space-x-2 mb-3 pb-2 border-b border-opacity-20">
                      {message.isUser ? (
                        <>
                          <FaUser className="text-sm flex-shrink-0" />
                          <span className="font-semibold text-sm">You</span>
                        </>
                      ) : (
                        <>
                          <FaRobot className={`text-sm flex-shrink-0 ${message.isError ? 'text-red-600' : ''}`} />
                          <span className="font-semibold text-sm">AI Assistant</span>
                        </>
                      )}
                    </div>
                    <div className="prose dark:prose-invert max-w-none text-sm leading-relaxed">
                      {formatMessage(message.text)}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-start"
              >
                <div className="bg-white dark:bg-gray-800 text-gray-800 dark:text-white p-4 rounded-2xl rounded-bl-none shadow-lg border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-3">
                    <FaRobot className="text-red-500 animate-bounce" />
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                    <span className="text-sm font-medium">AI is thinking...</span>
                  </div>
                </div>
              </motion.div>
            )}
            <div ref={chatEndRef} />
          </div>
        </div>

        {/* Scroll to Bottom Button */}
        <AnimatePresence>
          {showScrollButton && (
            <motion.button
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              onClick={scrollToBottom}
              className="fixed bottom-24 md:bottom-28 right-4 md:right-8 bg-gradient-to-r from-red-500 to-red-600 text-white p-4 rounded-full hover:from-red-600 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-300 transform hover:scale-110 shadow-2xl z-10"
              aria-label="Scroll to bottom"
            >
              <FaArrowDown className="text-xl" />
            </motion.button>
          )}
        </AnimatePresence>
      </main>

      {/* Input Footer */}
      <footer className="bg-white dark:bg-gray-800 p-3 md:p-4 shadow-lg border-t dark:border-gray-700 flex-shrink-0">
        <form onSubmit={handleSubmit} className="flex space-x-2 md:space-x-4 max-w-5xl mx-auto">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Ask me anything..."
            className="flex-1 px-4 md:px-6 py-2 md:py-3 border-2 border-gray-300 dark:border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:text-white transition-all duration-300 shadow-sm text-sm md:text-base"
            aria-label="Enter your prompt"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !inputText.trim()}
            className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 md:px-6 py-2 md:py-3 rounded-full hover:from-red-600 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg flex items-center space-x-2"
            aria-label="Send message"
          >
            <FaPaperPlane className="w-4 h-4 md:w-5 md:h-5" />
            <span className="hidden sm:inline text-sm md:text-base">Send</span>
          </button>
        </form>
      </footer>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #ef4444;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #dc2626;
        }
      `}</style>
    </div>
  );
}