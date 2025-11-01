import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

export default function SignUp() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("guest");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    try {
      await axios.post("http://localhost:5000/api/signup", {
        username,
        password,
        role,
      });
      setSuccess("Registration successful! Please sign in.");
      setError("");
      setUsername("");
      setPassword("");
      setConfirmPassword("");
      navigate("/signin");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed.");
      setSuccess("");
    }
  };

  const handleGifClick = () => {
    navigate("/home");
  };

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
          <p className="text-lg font-semibold mb-0">SIGN UP</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {error && (
            <div className="bg-red-100 text-red-700 px-3 py-2 rounded mb-4 text-sm">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-100 text-green-700 px-3 py-2 rounded mb-4 text-sm">
              {success}
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
                👁
              </button>
            </div>
          </div>

          <div className="mb-4">
            <label
              htmlFor="confirmPassword"
              className="block text-sm text-gray-700"
            >
              Confirm Password
            </label>
            <div className="flex">
              <input
                type={showConfirm ? "text" : "password"}
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full px-3 py-2 border rounded-l focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="px-3 bg-gray-200 border rounded-r hover:bg-gray-300"
              >
                👁
              </button>
            </div>
          </div>

          <div className="mb-4 flex justify-center gap-4">
            <button
              type="button"
              className={`px-4 py-1 rounded ${
                role === "student" ? "bg-indigo-600 text-white" : "bg-gray-200"
              }`}
              onClick={() => setRole("student")}
            >
              Student
            </button>
            <button
              type="button"
              className={`px-4 py-1 rounded ${
                role === "guest" ? "bg-indigo-600 text-white" : "bg-gray-200"
              }`}
              onClick={() => setRole("guest")}
            >
              Guest
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded font-semibold hover:bg-indigo-700 transition"
          >
            SIGN UP
          </button>

          <p className="text-center text-sm text-gray-600 mt-4">
            Already have an account?{" "}
            <Link to="/signin" className="text-indigo-600 hover:underline">
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
