import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser, getCurrentUser } from "../services/api";
import Loader from "../components/Loader";
import Card from "../components/Card";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  // Check if user is already logged in
  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      // If user is already logged in, redirect to dashboard
      navigate("/dashboard", { replace: true });
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();

    // Validate form
    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }

    try {
      setLoading(true);
      setError("");

      // Attempt to login
      const user = await loginUser(email, password);

      if (user) {
        // If remember me is checked, we could set a longer expiration for the token
        // This is just a placeholder for the actual implementation
        if (rememberMe) {
          localStorage.setItem("rememberMe", "true");
        }

        navigate("/dashboard");
      } else {
        setError("Email or password is incorrect!");
      }
    } catch (error) {
      console.error("Error during login:", error);
      setError("System error, please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-[#6b6bec]">Login Yunia AI</h1>
        <p className="text-gray-500 mt-2">Welcome back! Please sign in to continue</p>
      </div>

      
        <form onSubmit={handleLogin} className="p-6">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor="email">
              Email
            </label>
            <input
              className="w-full px-3 py-2 border border-gray-300 rounded text-gray-700 focus:outline-none focus:border-[#6b6bec]"
              id="email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              disabled={loading}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor="password">
              Password
            </label>
            <input
              className="w-full px-3 py-2 border border-gray-300 rounded text-gray-700 focus:outline-none focus:border-[#6b6bec]"
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              disabled={loading}
              required
            />
          </div>

          {error && (
            <div className="mb-4 text-red-500 text-sm">
              {error}
            </div>
          )}

          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <input
                id="remember-me"
                type="checkbox"
                className="h-4 w-4 text-[#6b6bec] border-gray-300 rounded"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                Remember me
              </label>
            </div>
            <div className="text-sm">
              <a href="#" className="text-[#6b6bec] hover:underline">
                Forgot password?
              </a>
            </div>
          </div>

          <button
            className="w-full bg-[#6b6bec] text-white py-2 px-4 rounded font-medium focus:outline-none flex justify-center items-center"
            type="submit"
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                Signing in...
              </>
            ) : "Sign In"}
          </button>
        </form>
      

      <div className="text-center mt-4 w-full max-w-sm">
        <p className="text-gray-600 mb-2">Don't have an account?</p>
        <button
          onClick={() => navigate('/register')}
          className=" border border-gray-300 bg-white text-gray-700 py-2 px-4 rounded font-medium hover:bg-gray-50 focus:outline-none"
          disabled={loading}
        >
          Create New Account
        </button>
      </div>
    </div>
  );
};

export default Login;
