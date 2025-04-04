import React, { useState } from "react";
import { auth, googleProvider } from "../firebase"; 
import { signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";

const Auth = ({ setUser }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState("");

  // Handle Google Sign-In
  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      setUser({ uid: result.user.uid, name: result.user.displayName, email: result.user.email });
    } catch (error) {
      setError(error.message);
    }
  };

  // Handle Email/Password Sign-In
  const handleAuth = async (e) => {
    e.preventDefault();
    setError("");

    try {
      let userCredential;
      if (isLogin) {
        // Sign In
        userCredential = await signInWithEmailAndPassword(auth, email, password);
      } else {
        // Sign Up
        userCredential = await createUserWithEmailAndPassword(auth, email, password);
      }
      setUser({
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        name: userCredential.user.displayName || userCredential.user.email,
      });
      
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
        <h2 className="text-2xl font-semibold text-center mb-4">{isLogin ? "Login" : "Sign Up"}</h2>
        
        {error && <p className="text-red-500 text-sm">{error}</p>}

        <form onSubmit={handleAuth} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
          <button type="submit" className="w-full p-2 bg-blue-500 text-white rounded">
            {isLogin ? "Login" : "Sign Up"}
          </button>
        </form>

        <button
          onClick={handleGoogleSignIn}
          className="w-full mt-3 p-2 bg-red-500 text-white rounded"
        >
          Sign in with Google
        </button>

        <p className="text-sm text-gray-600 mt-3 cursor-pointer" onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? "New user? Sign up here" : "Already have an account? Login here"}
        </p>
      </div>
    </div>
  );
};

export default Auth;
