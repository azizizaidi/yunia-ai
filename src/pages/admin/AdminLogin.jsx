import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../services/api";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

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

      // Attempt to login as admin
      const user = await loginUser(email, password, "admin");

      if (user) {
        // If remember me is checked, we could set a longer expiration for the token
        if (rememberMe) {
          localStorage.setItem("rememberMe", "true");
        }

        navigate("/admin/dashboard");
      } else {
        setError("Invalid admin credentials!");
      }
    } catch (error) {
      console.error("Error during admin login:", error);
      setError("System error, please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f5f7ff]">
      <div className="text-center mb-6">
        <div className="flex justify-center mb-4">
          <div className="bg-[#4a4a9c] p-3 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
        <h1 className="text-3xl font-bold text-[#4a4a9c]">Admin Portal</h1>
        <p className="text-gray-500 mt-2">Secure login for administrators only</p>
      </div>

      <form onSubmit={handleLogin} className="p-6 bg-white shadow-md rounded-lg max-w-md">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-medium mb-1" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="admin@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
            className="w-full px-3 py-2 border border-gray-300 rounded text-gray-700 focus:outline-none focus:border-[#4a4a9c]"
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
            className="w-full px-3 py-2 border border-gray-300 rounded text-gray-700 focus:outline-none focus:border-[#4a4a9c]"
          />
        </div>

        <div className="flex items-center mb-4">
          <input
            id="rememberMe"
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="w-4 h-4 text-[#4a4a9c] border-gray-300 rounded focus:ring-[#4a4a9c]"
          />
          <label htmlFor="rememberMe" className="ml-2 text-sm text-gray-600">
            Remember me
          </label>
          <a href="#" className="ml-auto text-sm text-[#4a4a9c] hover:underline">
            Forgot password?
          </a>
        </div>

        {error && (
          <div className="mb-4 text-red-500 text-sm">
            {error}
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-[#4a4a9c] text-white py-2 px-4 rounded font-medium focus:outline-none flex justify-center items-center"
          disabled={loading}
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
              Signing in...
            </>
          ) : "Sign In as Admin"}
        </button>
      </form>

      <div className="text-center mt-4 w-full max-w-md">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <p className="text-gray-600 mb-2">Not an administrator?</p>
          <button
            onClick={() => navigate('/login')}
            className="border border-gray-400 bg-white text-gray-700 py-2 px-4 rounded font-medium hover:bg-gray-100 focus:outline-none"
            type="button"
            disabled={loading}
          >
            Go to User Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;