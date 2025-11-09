import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

export default function SignIn() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!username || !password) {
      setError("Please enter both username and password.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/api/auth/signin", {
        username,
        password,
      });

      if (response.data?.success) {
        const { id, username, role } = response.data;
        localStorage.setItem("user", JSON.stringify({ id, username, role }));

        if (role.toLowerCase() === "admin") navigate("/admindashboard");
        else if (role.toLowerCase() === "student") navigate("/studentchat");
        else if (role.toLowerCase() === "guest") navigate("/guestchat");
        else setError("Unknown role received from server.");
      } else {
        setError(response.data.message || "Invalid server response");
      }
    } catch (err) {
      console.error("Signin error:", err.response || err);

      if (err.response?.status === 401) {
        setError(err.response.data?.message || "Invalid credentials.");
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Signin failed. Check server connection.");
      }
    }
  };

  const handleGifClick = () => navigate("/chatai");

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">CORDI</h2>
        <p className="text-gray-500 text-sm">
          Cordova Public College Chatbot Assistant
        </p>
      </div>

      <img
        src="/robologo.gif"
        alt="Robot Icon"
        className="w-32 h-36 mx-auto mb-4 cursor-pointer"
        onClick={handleGifClick}
      />

      <div className="bg-white shadow-md rounded-lg w-full max-w-md overflow-hidden">
        <div className="bg-gray-900 text-white flex items-center px-4 py-3">
          <img src="/logo.png" alt="Logo" className="w-10 h-10 mr-2" />
          <p className="text-lg font-semibold mb-0">SIGN IN</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="bg-red-100 text-red-700 px-3 py-2 rounded mb-4 text-sm">
              {error}
            </div>
          )}

          <div className="mb-4">
            <label htmlFor="username" className="block text-sm text-gray-700">
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block text-sm text-gray-700">
              Password
            </label>
            <div className="flex">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3 py-2 border rounded-l focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="px-3 bg-gray-200 border rounded-r hover:bg-gray-300"
              >
                {showPassword ? "🙈" : "👁"}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded font-semibold hover:bg-indigo-700 transition"
          >
            SIGN IN
          </button>

          <p className="text-center text-sm text-gray-600 mt-4">
            Don't have an account?{" "}
            <Link to="/signup" className="text-indigo-600 hover:underline">
              Signup
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
