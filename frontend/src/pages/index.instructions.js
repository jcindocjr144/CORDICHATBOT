import React, { useEffect, useState, useRef } from "react";
import axios from "axios";

export default function StudentChat() {
  const [messages, setMessages] = useState([]);
  const [autoResponses, setAutoResponses] = useState([]);
  const [message, setMessage] = useState("");
  const [typing, setTyping] = useState(false);

  const user = JSON.parse(localStorage.getItem("user")); // { id, name, role }
  const chatBoxRef = useRef(null);

  const BASE_URL = "http://localhost:5000/api/studentMessages";

  // Scroll to bottom automatically
  const scrollToBottom = () => {
    chatBoxRef.current?.scrollTo({
      top: chatBoxRef.current.scrollHeight,
      behavior: "smooth",
    });
  };

  // Fetch chat messages
  const fetchMessages = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/messages`, {
        params: { sender_id: user.id, receiver_id: ADMIN_ID },
      });
      setMessages(res.data);
      scrollToBottom();
    } catch (err) {
      console.error("Error fetching messages:", err);
    }
  };

  // Fetch auto-response buttons
  const fetchAutoResponses = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/autoResponses`);
      setAutoResponses(res.data);
    } catch (err) {
      console.error("Error fetching auto responses:", err);
    }
  };

  // Send message
  const sendMessage = async (e) => {
    if (e?.preventDefault) e.preventDefault();
    if (!message.trim()) return;

    const msgToSend = message.trim();
    setMessage("");

    try {
      await axios.post(`${BASE_URL}/send`, { sender_id: user.id, message: msgToSend });
      fetchMessages();
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  // Handle auto-response button click
  const handleAutoClick = async (text) => {
    setMessage("");
    try {
      await axios.post(`${BASE_URL}/send`, { sender_id: user.id, message: text });
      fetchMessages();
    } catch (err) {
      console.error("Error sending auto-response message:", err);
    }
  };

  // Initial load
  useEffect(() => {
    fetchMessages();
    fetchAutoResponses();
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between bg-white px-6 py-4 shadow-md border-b">
        <h2 className="text-xl font-bold text-gray-800">CORDI Chat</h2>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Logout
        </button>
      </div>

      {/* Chat container */}
      <div
        ref={chatBoxRef}
        className="flex-1 overflow-y-auto p-6 space-y-4"
        style={{ backgroundColor: "#f4f6f8" }}
      >
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.sender_id === user.id ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`rounded-lg p-3 max-w-[70%] ${
                msg.sender_id === user.id
                  ? "bg-blue-600 text-white rounded-br-none"
                  : "bg-gray-300 text-gray-900 rounded-bl-none"
              } shadow`}
            >
              {msg.message}
              <div className="text-xs text-gray-500 mt-1">
                {new Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </div>
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {typing && (
          <div className="flex items-center gap-2 text-gray-500 italic mt-2">
            <div className="flex space-x-1">
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></span>
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-300"></span>
            </div>
            <span>Admin is typing...</span>
          </div>
        )}
      </div>

      {/* Auto-response buttons */}
      <div className="bg-white p-4 border-t flex flex-wrap gap-2">
        {autoResponses.length > 0 ? (
          autoResponses.map((item) => (
            <button
              key={item.id}
              onClick={() => handleAutoClick(item.question)}
              className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {item.question}
            </button>
          ))
        ) : (
          <p className="text-gray-400 italic">No auto-response questions available</p>
        )}
      </div>

      {/* Message input */}
      <form
        onSubmit={sendMessage}
        className="flex bg-white border-t p-4 items-center"
      >
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 border rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="ml-3 px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700"
        >
          Send
        </button>
      </form>
    </div>
  );
}
