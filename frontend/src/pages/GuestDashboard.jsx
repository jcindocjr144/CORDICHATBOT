import React, { useEffect, useState, useRef } from "react";
import axios from "axios";

export default function GuestDashboard() {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const chatBoxRef = useRef(null);
  const BASE = "http://localhost:5000/api/guestMessages";

  const user = JSON.parse(localStorage.getItem("user")) || {};
  const myId = user.id;

  const scrollToBottom = () => {
    if (chatBoxRef.current) chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
  };

  const fetchMessages = async () => {
    try {
      const res = await axios.get(`${BASE}/fetchMessages`, { params: { sender_id: myId } });
      setMessages(res.data);
      scrollToBottom();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    try {
      await axios.post(`${BASE}/send`, { sender_id: myId, message: message.trim() });
      setMessage("");
      fetchMessages();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-gray-100">
      <div className="p-4 bg-white shadow flex justify-between items-center">
        <h1 className="text-xl font-bold">Guest Dashboard</h1>
        <button
          onClick={() => { localStorage.removeItem("user"); window.location.href = "/"; }}
          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      <div className="flex-1 flex flex-col">
        <div ref={chatBoxRef} className="flex-1 p-4 overflow-y-auto space-y-3">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-gray-900">
              <p>No conversation yet 💬</p>
            </div>
          ) : (
            messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender_id===myId ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-xs md:max-w-md px-4 py-2 rounded-2xl text-sm shadow ${msg.sender_id===myId ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-800"}`}>
                  {msg.message}
                  <div className="text-[10px] opacity-70 text-right">
                    {new Date(msg.created_at).toLocaleTimeString([], {hour:"2-digit", minute:"2-digit"})}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <form onSubmit={handleSend} className="flex p-4 bg-white border-t">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 border rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
          <button type="submit" className="ml-3 bg-blue-500 text-white px-5 py-2 rounded-full hover:bg-blue-600">Send</button>
        </form>
      </div>
    </div>
  );
}
