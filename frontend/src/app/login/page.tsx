"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginUser } from "../../services/api";
import AuthLayout from "../../components/layout/AuthLayout";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }

    try {
      setLoading(true);
      setError("");

      // Attempt to login as user (not admin)
      const user = await loginUser(email, password, "user");

      if (user) {
        // If remember me is checked, we could set a longer expiration for the token
        if (rememberMe) {
          localStorage.setItem("rememberMe", "true");
        }

        router.push("/dashboard");
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
    <AuthLayout>
      <div className="text-center mb-6">
        <div className="flex justify-center mb-4">
          <div className="bg-[#6b6bec] p-3 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
        <h1 className="text-3xl font-bold text-[#6b6bec]">User Portal</h1>
        <p className="text-gray-500 mt-2">Welcome back! Please sign in to continue</p>
      </div>

      <form onSubmit={handleLogin} className="space-y-4">
        <div>
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

        <div>
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
        </div>

        <div className="flex items-center">
          <input
            id="rememberMe"
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="w-4 h-4 text-[#6b6bec] border-gray-300 rounded focus:ring-[#6b6bec]"
          />
          <label htmlFor="rememberMe" className="ml-2 text-sm text-gray-600">
            Remember me
          </label>
          <a href="#" className="ml-auto text-sm text-[#6b6bec] hover:underline">
            Forgot password?
          </a>
        </div>

        {error && (
          <div className="text-red-500 text-sm">
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
              Signing in...
            </>
          ) : "Sign In"}
        </button>
      </form>

      <div className="text-center mt-4">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <p className="text-gray-600 mb-2">Don't have an account?</p>
          <button
            onClick={() => router.push('/register')}
            className="border border-[#6b6bec] bg-white text-[#6b6bec] py-2 px-4 rounded font-medium hover:bg-[#f5f7ff] focus:outline-none"
            type="button"
            disabled={loading}
          >
            Create New Account
          </button>
        </div>
      </div>
      
      <div className="text-center mt-4">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <p className="text-gray-600 mb-2">Are you an administrator?</p>
          <button
            onClick={() => router.push('/admin/login')}
            className="btn btn-primary"
            type="button"
            disabled={loading}
          >
            Go to Admin Login
          </button>
        </div>
      </div>
    </AuthLayout>
  );
}
