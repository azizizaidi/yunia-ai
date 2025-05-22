// src/pages/Login.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchUsers } from "../services/api";
import Loader from "../components/Loader";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState(""); // password tidak diperiksa, demo sahaja
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const users = await fetchUsers();
      // Hanya validasi email wujud
      const user = users.find(u => u.email === email);
      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
        navigate("/dashboard");
      } else {
        setError("Email tidak dijumpai.");
      }
    } catch (err) {
      setError("Gagal login. Sila cuba lagi.");
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
      <h1 className="text-3xl font-bold">Login Yunia AI</h1>
      <form
        className="flex flex-col gap-4 mt-8 w-80 bg-white p-6 rounded shadow"
        onSubmit={handleLogin}
        autoComplete="off"
      >
        <input
          className="border px-3 py-2 rounded"
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          className="border px-3 py-2 rounded"
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        {error && <span className="text-red-500 text-sm">{error}</span>}
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded"
        >
          {loading ? <Loader /> : "Login"}
        </button>
      </form>
    </div>
  );
}
