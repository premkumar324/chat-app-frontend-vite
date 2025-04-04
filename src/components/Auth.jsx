import React, { useState } from "react";
import { auth, googleProvider } from "../firebase";
import { signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { Eye, EyeOff } from "lucide-react";

const Auth = ({ setUser }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Handle Google Sign-In
  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const userData = {
        uid: result.user.uid,
        name: result.user.displayName,
        email: result.user.email,
      };
      setUser(userData);
      localStorage.setItem("chatUser", JSON.stringify(userData)); // ✅ Persist user
    } catch (error) {
      setError(error.message);
    }
  };

  // Handle Email/Password Authentication
  const handleAuth = async (e) => {
    e.preventDefault();
    setError("");

    try {
      let userCredential;
      if (isLogin) {
        userCredential = await signInWithEmailAndPassword(auth, email, password);
      } else {
        userCredential = await createUserWithEmailAndPassword(auth, email, password);
      }

      const userData = {
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        name: userCredential.user.displayName || userCredential.user.email,
      };
      setUser(userData);
      localStorage.setItem("chatUser", JSON.stringify(userData)); // ✅ Persist user
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
        <h2 className="text-2xl font-semibold text-center mb-4">{isLogin ? "Login" : "Sign Up"}</h2>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <form onSubmit={handleAuth} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400 pr-10"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-gray-600"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

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

        <p className="text-sm text-gray-600 mt-3 text-center cursor-pointer" onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? "New user? Sign up here" : "Already have an account? Login here"}
        </p>
      </div>
    </div>
  );
};

export default Auth;
