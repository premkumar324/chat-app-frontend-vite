import React, { useState } from "react";
import Auth from "./components/Auth";
import ChatApp from "./components/ChatApp";

const App = () => {
  const [user, setUser] = useState(null);

  return (
    <div>
      {!user ? (
        <Auth setUser={setUser} />
      ) : (
        <ChatApp user={user} />
      )}
    </div>
  );
};

export default App;
