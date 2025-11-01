import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [totalUsers, setTotalUsers] = useState(0);
  const [onlineUsers, setOnlineUsers] = useState(0);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || user.role !== "admin") {
      navigate("/signin");
    } else {
      fetchUsers();
    }
  }, [navigate]);

  const fetchUsers = async () => {
    try {
      const resTotal = await axios.get("http://localhost:5000/api/users/total");
      const resOnline = await axios.get("http://localhost:5000/api/users/online");
      setTotalUsers(resTotal.data.total);
      setOnlineUsers(resOnline.data.online);
    } catch (err) {
      console.error("Error fetching users:", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/signin");
  };

  const goToPage = (page) => {
    switch (page) {
      case "Chat":
        navigate("/adminDashboard/Chat");
        break;
      case "auto_responses":
        navigate("/adminDashboard/auto_responses");
        break;
      case "users":
        navigate("/adminDashboard/users");
        break;
      default:
        break;
    }
  };

  return (
    <>
      <link rel="shortcut icon" href="/icon.png" />
      <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
        <aside className="w-full md:w-64 bg-indigo-600 text-white flex flex-col">
          <div className="p-6 text-2xl font-bold border-b border-indigo-500 flex justify-between items-center">
            <span>Admin Panel</span>
            <button
              className="md:hidden"
              onClick={() => {
                const menu = document.getElementById("mobileMenu");
                if (menu) menu.classList.toggle("hidden");
              }}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
          <nav id="mobileMenu" className="flex-1 p-4 space-y-2 md:block hidden">
            <button
              className="block px-4 py-2 rounded hover:bg-indigo-700 w-full text-left"
              onClick={() => goToPage("dashboard")}
            >
              Dashboard
            </button>
            <button
              className="block px-4 py-2 rounded hover:bg-indigo-700 w-full text-left"
              onClick={() => goToPage("Chat")}
            >
              Open Chat
            </button>
            <button
              className="block px-4 py-2 rounded hover:bg-indigo-700 w-full text-left"
              onClick={() => goToPage("auto_responses")}
            >
              Manage Auto Responses
            </button>
            <button
              className="block px-4 py-2 rounded hover:bg-indigo-700 w-full text-left"
              onClick={() => goToPage("users")}
            >
              Manage Users
            </button>
            <button
              onClick={handleLogout}
              className="block px-4 py-2 rounded bg-red-600 hover:bg-red-700 w-full text-left"
            >
              Logout
            </button>
          </nav>
        </aside>

        <main className="flex-1 p-4 md:p-8">
          <div className="bg-white p-6 md:p-8 rounded-lg shadow-lg w-full max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Available Users</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-blue-500 text-white p-4 rounded-lg shadow-lg flex items-center space-x-4">
                <div className="bg-blue-700 p-3 rounded-full">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87M12 14a4 4 0 100-8 4 4 0 000 8z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium">Total Registered Users</p>
                  <p className="text-2xl font-bold">{totalUsers}</p>
                </div>
              </div>

              <div className="bg-green-500 text-white p-4 rounded-lg shadow-lg flex items-center space-x-4">
                <div className="bg-green-700 p-3 rounded-full">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium">Online Users</p>
                  <p className="text-2xl font-bold">{onlineUsers}</p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
