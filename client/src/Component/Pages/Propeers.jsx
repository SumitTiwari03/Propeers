import React, { useState, useEffect, useRef } from 'react';
import { FaPaperPlane, FaRobot, FaUser, FaArrowDown, FaCopy, FaCheck } from 'react-icons/fa';
import axios from 'axios';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

const CodeBlock = ({ code, language }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative my-4 rounded-lg overflow-hidden">
      <div className="flex justify-between items-center bg-gray-800 dark:bg-gray-900 px-4 py-2 text-gray-200">
        <span className="text-sm font-mono">{language || 'plaintext'}</span>
        <button
          onClick={handleCopy}
          className="flex items-center space-x-2 text-sm hover:text-white transition-colors"
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
        }}
      >
        {code.trim()}
      </SyntaxHighlighter>
    </div>
  );
};

const formatMessage = (text) => {
  if (!text) return null;

  // Split text into parts while preserving code blocks
  const parts = text.split(/(```[\s\S]*?```)|(\*\*.*?\*\*)|(`.*?`)|(\n# .*?\n)/g).filter(Boolean);

  return parts.map((part, index) => {
    // Handle code blocks
    if (part.startsWith('```')) {
      const lines = part.slice(3, -3).split('\n');
      const language = lines[0].trim();
      const code = lines.slice(1).join('\n');
      return <CodeBlock key={index} code={code} language={language} />;
    }
    
    // Handle inline code
    if (part.startsWith('`') && part.endsWith('`')) {
      const code = part.slice(1, -1);
      return (
        <code key={index} className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded font-mono text-sm">
          {code}
        </code>
      );
    }
    
    // Handle bold text
    if (part.startsWith('**') && part.endsWith('**')) {
      const content = part.slice(2, -2);
      return <strong key={index} className="font-bold text-lg">{content}</strong>;
    }
    
    // Handle headings
    if (part.startsWith('\n# ')) {
      const content = part.slice(3).trim();
      return <h2 key={index} className="text-xl font-bold my-4">{content}</h2>;
    }
    
    // Handle paragraphs and line breaks
    return part.split('\n').map((line, i) => (
      <p key={`${index}-${i}`} className="my-2">
        {line}
      </p>
    ));
  });
};

const fetchAIResponse = async (prompt) => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  const response = await axios.post('/api/propeers', {
    prompt: prompt,
  }).catch(err => console.log("Error while fetching AI response", err));
  return response.data.Message;
};

export default function Propeers() {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMessage = { id: Date.now(), text: inputText, isUser: true };
    setMessages(prev => [...prev, userMessage]);
    setInputText("");
    setIsLoading(true);

    const aiResponse = await fetchAIResponse(inputText);
    const aiMessage = { id: Date.now() + 1, text: aiResponse, isUser: false };
    setMessages(prev => [...prev, aiMessage]);
    setIsLoading(false);
  };

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="flex flex-col bg-gray-100 dark:bg-gray-900" style={{ minHeight: 'calc(78vh)' }}>
      <main className="flex-1 p-4 space-y-4 overflow-hidden flex flex-col" style={{ maxHeight: 'calc(78vh)' }}>
        <div ref={chatContainerRef} className="flex-1 overflow-y-auto pr-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.isUser ? 'justify-end' : 'justify-start'} animate-fadeIn`}
            >
              <div
                className={`max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl p-4 rounded-lg shadow-lg transition-all ${
                  message.isUser
                    ? 'bg-gradient-to-r from-red-500 to-red-600 text-white rounded-br-none transform hover:-translate-y-1'
                    : 'bg-white text-gray-800 dark:bg-gray-800 dark:text-white rounded-bl-none transform hover:-translate-y-1'
                }`}
              >
                <div className="flex items-center space-x-2 mb-2 border-b border-opacity-20 pb-2">
                  {message.isUser ? (
                    <>
                      <span className="font-semibold">You</span>
                      <FaUser className="text-sm" />
                    </>
                  ) : (
                    <>
                      <FaRobot className="text-sm" />
                      <span className="font-semibold">AI</span>
                    </>
                  )}
                </div>
                <div className="prose dark:prose-invert max-w-none">
                  {formatMessage(message.text)}
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start animate-fadeIn">
              <div className="bg-white text-gray-800 dark:bg-gray-800 dark:text-white p-4 rounded-lg rounded-bl-none shadow-lg">
                <div className="flex items-center space-x-2">
                  <FaRobot className="text-sm animate-bounce" />
                  <span className="font-semibold">AI is thinking...</span>
                  <span className="animate-pulse">...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>
        <button
          onClick={scrollToBottom}
          className="bg-red-500 text-white p-3 rounded-full self-end hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-300 transform hover:scale-110 shadow-lg"
          aria-label="Scroll to bottom"
        >
          <FaArrowDown />
        </button>
      </main>

      <footer className="bg-white dark:bg-gray-800 p-6 shadow-lg">
        <form onSubmit={handleSubmit} className="flex space-x-4 max-w-4xl mx-auto">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Ask me anything..."
            className="flex-1 px-6 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 transition-all duration-300 shadow-sm"
            aria-label="Enter your prompt"
          />
          <button
            type="submit"
            disabled={isLoading || !inputText.trim()}
            className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-full hover:from-red-600 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
            aria-label="Send message"
          >
            <FaPaperPlane className="w-5 h-5" />
          </button>
        </form>
      </footer>
    </div>
  );
}