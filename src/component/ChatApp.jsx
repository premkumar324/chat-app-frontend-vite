import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { motion } from "framer-motion";
import { Send } from "lucide-react";

const socket = io("https://mern-chat-app-backend-zxx3.onrender.com"); // Connect to backend

const ChatApp = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [userId, setUserId] = useState(null); // Unique user ID
  const chatRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    // Get unique socket ID when connected
    socket.on("connect", () => {
      setUserId(socket.id);
      console.log("Connected with ID:", socket.id); // Debugging
    });

    // Receive messages from the server
    socket.on("chatMessage", (msg) => {
      console.log("Received message:", msg); // Debugging
      setMessages((prevMessages) => [...prevMessages, msg]);
      scrollToBottom();
    });

    return () => {
      socket.off("chatMessage");
    };
  }, []);

  const sendMessage = () => {
    if (message.trim()) {
      const msgData = { text: message, senderId: userId }; // Track sender
      socket.emit("chatMessage", msgData);
      setMessage("");
    }
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      chatRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  // Prevent chat from jumping up on mobile keyboard open
  useEffect(() => {
    const handleResize = () => {
      if (window.innerHeight < 600) {
        setTimeout(() => scrollToBottom(), 300);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex flex-col h-screen w-full bg-gray-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-lg font-semibold py-3 text-center shadow-md">
        Chat App
      </header>

      {/* Chat Container */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 custom-scrollbar">
        {messages.map((msg, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex w-full ${
              msg.senderId === userId ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-xs p-3 rounded-xl text-white text-sm shadow-lg ${
                msg.senderId === userId ? "bg-blue-500" : "bg-gray-500"
              }`}
            >
              {msg.text}
            </div>
          </motion.div>
        ))}
        <div ref={chatRef}></div>
      </div>

      {/* Input Box */}
      <div className="flex items-center p-4 bg-white shadow-lg fixed bottom-0 w-full">
        <input
          ref={inputRef}
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 p-3 border rounded-full focus:outline-none text-gray-700"
        />
        <button
          onClick={sendMessage}
          className="ml-2 p-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full shadow-md hover:bg-indigo-700 transition duration-200"
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
};

export default ChatApp;
