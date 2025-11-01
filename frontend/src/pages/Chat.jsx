import React, { useEffect, useState, useRef } from "react";
import axios from "axios";

export default function Chat() {
  const [contacts, setContacts] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [showContacts, setShowContacts] = useState(false);
  const chatBoxRef = useRef(null);

  const BASE = "http://localhost:5000";
  const ADMIN_ID = 0;

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const res = await axios.get(`${BASE}/api/users`);
        const filtered = res.data.filter((u) => u.role !== "admin");
        setContacts(filtered);
      } catch (err) {
        console.error(err);
      }
    };
    fetchContacts();
    const interval = setInterval(fetchContacts, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchMessages = async (receiverId) => {
    if (!receiverId) return;
    try {
      const res = await axios.get(`${BASE}/api/messages/fetchMessages`, {
        params: {
          sender_id: ADMIN_ID,
          receiver_id: receiverId,
        },
      });
      const filtered = res.data.filter(
        (m) =>
          (m.sender_id === ADMIN_ID && m.receiver_id === receiverId) ||
          (m.sender_id === receiverId && m.receiver_id === ADMIN_ID)
      );
      setMessages(filtered);
      setTimeout(() => {
        if (chatBoxRef.current) {
          chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
        }
      }, 200);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (!selectedUser) return;
    fetchMessages(selectedUser.id);
    const interval = setInterval(() => fetchMessages(selectedUser.id), 2000);
    return () => clearInterval(interval);
  }, [selectedUser]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!message.trim() || !selectedUser) return;
    const payload = {
      sender_id: ADMIN_ID,
      receiver_id: selectedUser.id,
      message: message.trim(),
    };
    const tempMessage = message.trim();
    setMessage("");
    try {
      const res = await axios.post(`${BASE}/api/messages/send`, payload);
      if (res.data.success) {
        await fetchMessages(selectedUser.id);
        setStatus("");
      } else {
        setStatus("Failed to send");
        setMessage(tempMessage);
      }
    } catch (err) {
      console.error(err);
      setStatus("Failed to send");
      setMessage(tempMessage);
    }
  };

  const filteredContacts = contacts.filter((u) =>
    `${u.username} (${u.role})`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col md:flex-row h-screen w-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-full md:w-1/4 bg-blue-600 text-white shadow-lg p-4 overflow-y-auto md:h-screen border-r relative">
        <div className="mb-4 flex justify-between items-center">
          <button
            onClick={() => (window.location.href = "/adminDashboard")}
            className="bg-gray-100 text-blue-700 font-semibold px-3 py-1 rounded hover:bg-gray-200"
          >
            ← Dashboard
          </button>

          {/* Mobile toggle button */}
          <button
            onClick={() => setShowContacts(!showContacts)}
            className="md:hidden bg-white text-blue-700 px-3 py-1 rounded hover:bg-gray-100"
          >
            {showContacts ? "Hide" : "Show"}
          </button>
        </div>

        <input
          type="text"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            if (e.target.value.trim() !== "") setShowContacts(true);
          }}
          placeholder="Search contacts..."
          className="w-full mb-3 px-3 py-2 border rounded text-black focus:outline-none focus:ring focus:ring-blue-300"
        />

        {/* Contact list (toggle on mobile) */}
        <ul
          className={`transition-all duration-300 ease-in-out ${
            showContacts ? "max-h-screen opacity-100" : "max-h-0 opacity-0 md:opacity-100 md:max-h-full"
          } overflow-hidden md:overflow-visible`}
        >
          {filteredContacts.map((user) => (
            <li
              key={user.id}
              className={`flex items-center justify-between mb-1 cursor-pointer p-2 rounded ${
                selectedUser?.id === user.id ? "bg-blue-400" : "hover:bg-blue-500"
              }`}
              onClick={() => {
                setSelectedUser(user);
                fetchMessages(user.id);
                setShowContacts(false);
              }}
            >
              <div className="flex-1">
                <span className="font-medium">{user.username}</span>{" "}
                <span className="text-xs opacity-80">({user.role})</span>
              </div>
              <span
                className={`w-3 h-3 rounded-full ${
                  user.is_online ? "bg-green-300" : "bg-gray-300"
                }`}
                title={user.is_online ? "Online" : "Offline"}
              ></span>
            </li>
          ))}
        </ul>
      </div>

      {/* Chatbox */}
      <div className="flex-1 flex flex-col relative h-screen bg-gray-50 bg-[url('/logo.png')] bg-center bg-no-repeat bg-contain bg-opacity-30">
        {selectedUser && (
          <>
            <div className="p-4 bg-white border-b shadow-sm">
              <h2 className="text-lg font-semibold text-gray-700">
                Chat with <span className="text-blue-600">{selectedUser.username}</span>
              </h2>
            </div>

            <div
              ref={chatBoxRef}
              className="flex-1 p-4 overflow-y-auto bg-gray-50/70"
            >
              {messages.length > 0 && (
                <div className="space-y-3">
                  {messages.map((msg) => {
                    const isMe = msg.sender_id === ADMIN_ID;
                    return (
                      <div
                        key={msg.id}
                        className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-xs md:max-w-md px-4 py-2 rounded-2xl text-sm shadow ${
                            isMe
                              ? "bg-blue-500 text-white rounded-br-none"
                              : "bg-gray-200 text-gray-800 rounded-bl-none"
                          }`}
                        >
                          <p>{msg.message}</p>
                          <span className="text-[10px] opacity-70 block mt-1 text-right">
                            {new Date(msg.created_at).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <form
              onSubmit={handleSend}
              className="flex p-4 bg-white border-t sticky bottom-0"
            >
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 border rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
              <button
                type="submit"
                className="ml-3 bg-blue-500 text-white px-5 py-2 rounded-full hover:bg-blue-600 transition"
              >
                Send
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
  