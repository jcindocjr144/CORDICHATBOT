import { useState, useEffect } from "react";
import axios from "axios";
import { Eye, Trash2 } from "lucide-react";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [editUser, setEditUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/users", {
        headers: { user: JSON.stringify({ role: "admin" }) },
      });
      const sorted = res.data.sort((a, b) => a.id - b.id);
      setUsers(sorted);
    } catch {
      alert("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/users/${id}`, {
        headers: { user: JSON.stringify({ role: "admin" }) },
      });
      fetchUsers();
    } catch {
      alert("Failed to delete user");
    }
  };

  const handleEditSave = async () => {
    if (!editUser.username.trim()) {
      alert("Username cannot be empty");
      return;
    }

    try {
      await axios.put(
        `http://localhost:5000/api/users/${editUser.id}`,
        {
          username: editUser.username,
          password: editUser.password || "",
          role: editUser.role,
        },
        {
          headers: { user: JSON.stringify({ role: "admin" }) },
        }
      );

      alert("User updated successfully");
      setEditUser(null);
      setSearch("");
      fetchUsers();
    } catch {
      alert("Failed to update user");
    }
  };

  const handleLogout = async () => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const { username } = JSON.parse(storedUser);
      try {
        await axios.post("http://localhost:5000/api/logout", { username });
      } catch {}
    }
    localStorage.removeItem("user");
    window.location.href = "/signin";
  };

  const filteredUsers = users.filter((u) =>
    u.username.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="text-center p-10">Loading...</div>;

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      <aside className="w-full md:w-64 bg-indigo-600 text-white flex flex-col">
        <div className="p-6 text-2xl font-bold border-b border-indigo-500">
          Admin Panel
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <a
            href="/adminDashboard"
            className="block px-4 py-2 rounded hover:bg-indigo-700"
          >
            Dashboard
          </a>
          <a
            href="/adminDashboard/Chat"
            className="block px-4 py-2 rounded hover:bg-indigo-700"
          >
            Open Chat
          </a>
          <a
            href="/adminDashboard/auto_responses"
            className="block px-4 py-2 rounded hover:bg-indigo-700"
          >
            Manage Auto Responses
          </a>
          <a
            href="/adminDashboard/users"
            className="block px-4 py-2 rounded hover:bg-indigo-700"
          >
            Manage Users
          </a>
          <button
            onClick={handleLogout}
            className="block w-full text-left px-4 py-2 mt-2 rounded bg-red-600 hover:bg-red-700"
          >
            Logout
          </button>
        </nav>
      </aside>

      <main className="flex-1 p-6">
        <h1 className="text-3xl font-bold mb-6">Manage Users</h1>

        <div className="mb-4">
          <input
            type="text"
            placeholder="Search by username..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            disabled={!!editUser}
            className={`border rounded px-3 py-2 w-full md:w-1/2 ${
              editUser ? "bg-gray-200 cursor-not-allowed" : ""
            }`}
          />
        </div>

        <div className="overflow-x-auto bg-white rounded-lg shadow-lg p-4">
          <table className="min-w-full border border-gray-200">
            <thead className="bg-indigo-500 text-white">
              <tr>
                <th className="border px-4 py-2">ID</th>
                <th className="border px-4 py-2">Username</th>
                <th className="border px-4 py-2">Role</th>
                <th className="border px-4 py-2">Last Activity</th>
                <th className="border px-4 py-2">Created At</th>
                <th className="border px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-100">
                  <td className="border px-4 py-2 text-center">{user.id}</td>
                  <td className="border px-4 py-2">{user.username}</td>
                  <td className="border px-4 py-2 capitalize">{user.role}</td>
                  <td className="border px-4 py-2">
                    {user.last_activity || "Never"}
                  </td>
                  <td className="border px-4 py-2">{user.created_at}</td>
                  <td className="border px-4 py-2 flex flex-wrap gap-2 justify-center">
                    <button
                      onClick={() => {
                        setEditUser({
                          ...user,
                          password: "",
                        });
                        setSearch("");
                      }}
                      className="bg-yellow-500 text-white p-2 rounded hover:bg-yellow-600"
                    >
                      <Eye size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="bg-red-500 text-white p-2 rounded hover:bg-red-600"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center py-4 text-gray-500">
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {editUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center px-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
              <h2 className="text-xl font-bold mb-4">View Profile</h2>

              <div className="mb-4">
                <label className="block text-gray-700">Username</label>
                <input
                  type="text"
                  value={editUser.username}
                  onChange={(e) =>
                    setEditUser({ ...editUser, username: e.target.value })
                  }
                  className="w-full border rounded px-3 py-2"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700">Password</label>
                <input
                  type="password"
                  value={editUser.password || ""}
                  onChange={(e) =>
                    setEditUser({ ...editUser, password: e.target.value })
                  }
                  className="w-full border rounded px-3 py-2"
                  placeholder="Enter new password"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700">Role</label>
                <select
                  value={editUser.role}
                  onChange={(e) =>
                    setEditUser({ ...editUser, role: e.target.value })
                  }
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="student">Student</option>
                  <option value="guest">Guest</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => {
                    setEditUser(null);
                    setSearch("");
                  }}
                  className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEditSave}
                  className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
