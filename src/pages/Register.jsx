// src/pages/RegisterPage.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser, getCurrentUser } from "../services/api";
import Card from "../components/Card";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const navigate = useNavigate();

  // Check if user is already logged in
  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      // If user is already logged in, redirect to dashboard
      navigate("/dashboard", { replace: true });
    }
  }, [navigate]);

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

    // Validate terms agreement
    if (!agreeToTerms) {
      setError("You must agree to the Terms of Service and Privacy Policy");
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
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-[#6b6bec]">Create Account</h1>
        <p className="text-gray-500 mt-2">Join Yunia AI and start your journey</p>
      </div>

    
        <form onSubmit={handleRegister} className="p-6">
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
    

      <div className="text-center mt-4 w-full max-w-sm">
        <p className="text-gray-600 mb-2">Already have an account?</p>
        <button
          onClick={() => navigate('/login')}
          className=" border border-gray-300 bg-white text-gray-700 py-2 px-4 rounded font-medium hover:bg-gray-50 focus:outline-none"
          type="button"
          disabled={loading}
        >
          Sign In
        </button>
      </div>
    </div>
  );
}
