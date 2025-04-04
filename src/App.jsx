import React, { useState, useEffect } from "react";
import Auth from "./components/Auth";
import ChatApp from "./components/ChatApp";

const App = () => {
  const [user, setUser] = useState(null);

  // Auto-login if user info is saved in localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("chatUser");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <div>
      {!user ? (
        <Auth setUser={(userData) => {
          localStorage.setItem("chatUser", JSON.stringify(userData)); // Save login
          setUser(userData);
        }} />
      ) : (
        <ChatApp user={user} />
      )}
    </div>
  );
};

export default App;
