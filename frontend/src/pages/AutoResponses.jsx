import { useState, useEffect } from "react";
import axios from "axios";

export default function AutoResponses() {
  const [responses, setResponses] = useState([]);
  const [newQuestion, setNewQuestion] = useState("");
  const [newResponse, setNewResponse] = useState("");
  const [activeTab, setActiveTab] = useState("manage");
  const [showSidebar, setShowSidebar] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));

  const fetchResponses = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/auto-responses", {
        headers: { user: JSON.stringify(user) },
      });
      setResponses(res.data.sort((a, b) => a.id - b.id));
    } catch (err) {
      console.error(err.response?.data?.message || err.message);
    }
  };

  useEffect(() => {
    fetchResponses();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "http://localhost:5000/api/auto-responses",
        { question: newQuestion, response: newResponse },
        { headers: { user: JSON.stringify(user) } }
      );
      setNewQuestion("");
      setNewResponse("");
      fetchResponses();
    } catch (err) {
      console.error(err.response?.data?.message || err.message);
    }
  };

  const handleUpdate = async (id, question, response) => {
    try {
      await axios.put(
        `http://localhost:5000/api/auto-responses/${id}`,
        { question, response },
        { headers: { user: JSON.stringify(user) } }
      );
      fetchResponses();
    } catch (err) {
      console.error(err.response?.data?.message || err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this response?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/auto-responses/${id}`, {
        headers: { user: JSON.stringify(user) },
      });
      fetchResponses();
    } catch (err) {
      console.error(err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <div
        className={`fixed md:static top-0 left-0 h-full w-64 bg-blue-800 text-white flex flex-col transition-transform duration-300 z-50 ${
          showSidebar ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="p-4 border-b border-blue-600">
          <button
            onClick={() => (window.location.href = "/adminDashboard")}
            className="bg-gray-100 text-blue-700 font-semibold px-3 py-1 rounded hover:bg-gray-200 w-full"
          >
            ← Dashboard
          </button>
        </div>

        <div className="flex items-center justify-between p-4 border-b border-blue-600">
          <h2 className="text-xl font-bold">Auto Responses</h2>
          <button
            className="md:hidden text-white"
            onClick={() => setShowSidebar(false)}
          >
            ✕
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <button
            className={`w-full text-left px-4 py-2 rounded ${
              activeTab === "manage" ? "bg-blue-600" : "hover:bg-blue-700"
            }`}
            onClick={() => setActiveTab("manage")}
          >
            🛠 Manage Responses
          </button>
          <button
            className={`w-full text-left px-4 py-2 rounded ${
              activeTab === "table" ? "bg-blue-600" : "hover:bg-blue-700"
            }`}
            onClick={() => setActiveTab("table")}
          >
            📋 Questions & Actions
          </button>
        </nav>
      </div>

      <div className="flex-1 overflow-y-auto p-6 md:ml-0">
        <button
          className="md:hidden mb-4 bg-blue-700 text-white px-4 py-2 rounded"
          onClick={() => setShowSidebar(true)}
        >
          ☰ Menu
        </button>

        {activeTab === "manage" && (
          <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow">
            <h2 className="text-2xl font-bold mb-4 text-center text-blue-800">
              Manage Auto Responses
            </h2>
            <form onSubmit={handleAdd} className="mb-6 space-y-2 bg-blue-50 p-4 rounded">
              <input
                type="text"
                placeholder="Question"
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
                className="w-full border border-black p-2 rounded"
                required
              />
              <textarea
                placeholder="Response"
                value={newResponse}
                onChange={(e) => setNewResponse(e.target.value)}
                className="w-full border border-black p-2 rounded"
                required
              />
              <button
                type="submit"
                className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800"
              >
                Add Response
              </button>
            </form>
          </div>
        )}

        {activeTab === "table" && (
          <div className="max-w-5xl mx-auto bg-white p-6 rounded shadow">
            <h2 className="text-2xl font-bold mb-4 text-center text-blue-800">
              Questions & Responses
            </h2>

            <div className="hidden md:block overflow-x-auto">
              <table className="w-full min-w-[600px] border-collapse">
                <thead className="bg-black text-white">
                  <tr>
                    <th className="p-2 text-left w-1/4">Question</th>
                    <th className="p-2 text-left">Response & Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {responses.map((res) => (
                    <tr key={res.id} className="border-b border-black">
                      <td className="p-2 align-top w-1/4">
                        <input
                          className="w-full border border-black p-2 rounded mb-2"
                          value={res.question}
                          onChange={(e) => {
                            const updated = responses.map((r) =>
                              r.id === res.id ? { ...r, question: e.target.value } : r
                            );
                            setResponses(updated);
                          }}
                        />
                      </td>
                      <td className="p-2">
                        <textarea
                          className="w-full border border-black p-2 rounded mb-2"
                          value={res.response}
                          onChange={(e) => {
                            const updated = responses.map((r) =>
                              r.id === res.id ? { ...r, response: e.target.value } : r
                            );
                            setResponses(updated);
                          }}
                        />
                        <div className="flex flex-col md:flex-row gap-2">
                          <button
                            className="bg-blue-700 text-white px-3 py-1 rounded hover:bg-blue-800 flex-1"
                            onClick={() =>
                              handleUpdate(res.id, res.question, res.response)
                            }
                          >
                            Save
                          </button>
                          <button
                            className="bg-red-700 text-white px-3 py-1 rounded hover:bg-red-800 flex-1"
                            onClick={() => handleDelete(res.id)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="block md:hidden space-y-4">
              {responses.map((res) => (
                <div
                  key={res.id}
                  className="border border-gray-400 rounded-lg p-4 bg-blue-50 shadow"
                >
                  <label className="font-semibold text-gray-800">Question:</label>
                  <input
                    className="w-full border border-black p-2 rounded mb-2"
                    value={res.question}
                    onChange={(e) => {
                      const updated = responses.map((r) =>
                        r.id === res.id ? { ...r, question: e.target.value } : r
                      );
                      setResponses(updated);
                    }}
                  />
                  <label className="font-semibold text-gray-800">Response:</label>
                  <textarea
                    className="w-full border border-black p-2 rounded mb-2"
                    value={res.response}
                    onChange={(e) => {
                      const updated = responses.map((r) =>
                        r.id === res.id ? { ...r, response: e.target.value } : r
                      );
                      setResponses(updated);
                    }}
                  />
                  <div className="flex flex-col gap-2">
                    <button
                      className="bg-blue-700 text-white px-3 py-1 rounded hover:bg-blue-800"
                      onClick={() =>
                        handleUpdate(res.id, res.question, res.response)
                      }
                    >
                      Save
                    </button>
                    <button
                      className="bg-red-700 text-white px-3 py-1 rounded hover:bg-red-800"
                      onClick={() => handleDelete(res.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
