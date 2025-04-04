import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { motion } from "framer-motion";
import { Send } from "lucide-react";
import EmojiPicker from "emoji-picker-react";

const socket = io("https://mern-chat-app-backend-zxx3.onrender.com");

const getUsername = (email) => email.split("@")[0];

const ChatApp = ({ user }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [typing, setTyping] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const chatRef = useRef(null);

  useEffect(() => {
    socket.emit("userJoined", user.email);

    socket.on("updateUsers", (users) => {
      setOnlineUsers(users);
    });

    socket.on("chatMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
      scrollToBottom();
    });

    socket.on("userTyping", (typingUser) => {
      if (typingUser !== user.email) {
        setTyping(`${getUsername(typingUser)} is typing...`);
      } else {
        setTyping("");
      }
    });

    return () => {
      socket.emit("userLeft", user.email);
      socket.off("updateUsers");
      socket.off("chatMessage");
      socket.off("userTyping");
    };
  }, [user.email]);

  const sendMessage = () => {
    if (message.trim()) {
      const msgData = {
        text: message,
        sender: user.email,
        timestamp: new Date().toISOString(),
      };
      socket.emit("chatMessage", msgData);
      setMessage("");
      scrollToBottom();
    }
  };

  const handleTyping = () => {
    socket.emit("userTyping", user.email);
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      chatRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  return (
    <div className="flex flex-col h-screen w-full bg-gray-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-lg font-semibold py-3 text-center shadow-md">
        Chat App
      </header>

      {/* Online Users */}
      <div className="p-4 bg-white shadow-md">
        <h3 className="text-lg font-semibold">Online Users</h3>
        <ul>
          {onlineUsers.map((u, i) => (
            <li key={i} className="text-sm text-gray-700">
              {getUsername(u)}
            </li>
          ))}
        </ul>
      </div>

      {/* Chat Container */}
      <div className="flex-1 p-4 overflow-y-auto flex flex-col space-y-4">
        {messages.map((msg, index) => (
         <motion.div
         key={index}
         initial={{ opacity: 0, y: 10 }}
         animate={{ opacity: 1, y: 0 }}
         className={`max-w-xs p-3 rounded-xl shadow-md ${
           msg.sender === user.email
             ? "bg-blue-500 ml-auto text-white"
             : "bg-gray-100 mr-auto text-gray-800"
         }`}
       >
         <p className="text-xs text-gray-300 mb-1">{getUsername(msg.sender)}</p>
         <p className="text-base font-medium break-words">{msg.text}</p>
         <p className="text-[10px] text-gray-400 mt-1 text-right">
           {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
         </p>
       </motion.div>
       
        ))}
        <div ref={chatRef}></div>
      </div>

      {/* Typing Indicator */}
      {typing && <p className="text-sm text-gray-500 text-center">{typing}</p>}

      {/* Input Box */}
      <div className="flex items-center p-4 bg-white shadow-lg">
        <button onClick={() => setShowEmoji(!showEmoji)} className="mr-2">😀</button>
        {showEmoji && (
          <div className="absolute bottom-24 left-4 z-10">
            <EmojiPicker onEmojiClick={(emoji) => setMessage((prev) => prev + emoji.emoji)} />
          </div>
        )}
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleTyping}
          placeholder="Type a message..."
          className="flex-1 p-3 border rounded-full focus:outline-none text-gray-700"
        />
        <button
          onClick={sendMessage}
          className="ml-2 p-2 bg-blue-500 text-white rounded-full"
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
};

export default ChatApp;
