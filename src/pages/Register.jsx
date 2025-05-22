// src/pages/RegisterPage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../services/api";
import Card from "../components/Card";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    // Validate form
    if (!name || !email || !password) {
      setError("Please fill in all fields");
      return;
    }

    // Validate password length
    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Register new user
      await registerUser({ name, email, password });

      // Show success message
      alert("Registration successful! You can now sign in.");

      // Redirect to login page
      navigate("/login");
    } catch (error) {
      console.error("Error during registration:", error);

      // Display specific error message if available
      if (error.message === "Email is already registered!") {
        setError(error.message);
      } else {
        setError("System error. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f5f7ff]">
      <div className="text-center mb-6">
        <div className="flex justify-center mb-4">
          <div className="bg-[#6b6bec] p-3 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" viewBox="0 0 20 20" fill="currentColor">
              <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
            </svg>
          </div>
        </div>
        <h1 className="text-3xl font-bold text-[#6b6bec]">Create Account</h1>
        <p className="text-gray-500 mt-2">Join Yunia AI and start your journey</p>
      </div>


        <form onSubmit={handleRegister} className="p-6 bg-white shadow-md rounded-lg w-full max-w-md">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor="name">
              Full Name
            </label>
            <input
              id="name"
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={loading}
              className="w-full px-3 py-2 border border-gray-300 rounded text-gray-700 focus:outline-none focus:border-[#6b6bec]"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              className="w-full px-3 py-2 border border-gray-300 rounded text-gray-700 focus:outline-none focus:border-[#6b6bec]"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              className="w-full px-3 py-2 border border-gray-300 rounded text-gray-700 focus:outline-none focus:border-[#6b6bec]"
            />
            <p className="text-xs text-gray-500 mt-1">Password must be at least 6 characters long</p>
          </div>

          {error && (
            <div className="mb-4 text-red-500 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-[#6b6bec] text-white py-2 px-4 rounded font-medium focus:outline-none flex justify-center items-center"
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                Creating Account...
              </>
            ) : "Create Account"}
          </button>
        </form>


      <div className="text-center mt-4 w-full max-w-md">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <p className="text-gray-600 mb-2">Already have an account?</p>
          <button
            onClick={() => navigate('/login')}
            className="border border-[#6b6bec] bg-white text-[#6b6bec] py-2 px-4 rounded font-medium hover:bg-[#f5f7ff] focus:outline-none"
            type="button"
            disabled={loading}
          >
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
}
