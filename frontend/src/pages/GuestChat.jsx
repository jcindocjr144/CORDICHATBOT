import React, { useEffect, useState, useRef } from "react";
import axios from "axios";

export default function GuestChat() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [messages, setMessages] = useState([]);
  const [autoResponses, setAutoResponses] = useState([]);
  const [message, setMessage] = useState("");
  const [typing, setTyping] = useState(false);
  const chatBoxRef = useRef(null);

  const BASE_URL = "http://localhost:5000/api/userMessages";

  const scrollToBottom = () => {
    chatBoxRef.current?.scrollTo({
      top: chatBoxRef.current.scrollHeight,
      behavior: "smooth",
    });
  };

  const fetchMessages = async () => {
    if (!user?.id) return;
    try {
      const res = await axios.get(`${BASE_URL}/fetchMessages`, {
        params: { user_id: user.id },
      });
      if (res.data.success && Array.isArray(res.data.messages)) {
        setMessages(res.data.messages);
        scrollToBottom();
      } else {
        setMessages([]);
      }
    } catch (err) {
      console.error("Error fetching messages:", err);
    }
  };

  const fetchAutoResponses = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/autoResponses`);
      setAutoResponses(res.data);
    } catch (err) {
      console.error("Error fetching auto responses:", err);
    }
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    const text = message.trim();
    if (!text) return;
    setMessage("");

    try {
      await axios.post(
        `${BASE_URL}/send`,
        { message: text },
        {
          headers: {
            "Content-Type": "application/json",
            user: JSON.stringify(user),
          },
        }
      );
      fetchMessages();
      scrollToBottom();
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  const handleAutoClick = async (text) => {
    if (!text) return;
    setMessage("");
    setTyping(true);
    try {
      await axios.post(
        `${BASE_URL}/send`,
        { message: text },
        {
          headers: {
            "Content-Type": "application/json",
            user: JSON.stringify(user),
          },
        }
      );
      setTyping(false);
      fetchMessages();
      scrollToBottom();
    } catch (err) {
      console.error("Error sending auto message:", err);
      setTyping(false);
    }
  };

  useEffect(() => {
    fetchMessages();
    fetchAutoResponses();
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/signin";
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 relative">
      {/* Header */}
      <div className="p-4 bg-white shadow flex justify-between items-center z-20">
        <h1 className="text-lg font-bold">CORDI Chat (Guest)</h1>
        <button
          onClick={handleLogout}
          className="bg-gray-700 text-white px-3 py-1 rounded hover:bg-gray-800"
        >
          Logout
        </button>
      </div>

      <div
        ref={chatBoxRef}
        className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50 relative"
        style={{
          backgroundImage: "url('/schoollogo.png')",
          backgroundSize: "contain",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          paddingBottom: "160px",
        }}
      >
        <div className="absolute inset-0 "></div>
        <div className="relative z-10 space-y-3">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${
                msg.sender_id === user.id ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`p-2 rounded-xl max-w-[75%] ${
                  msg.sender_id === user.id
                    ? "bg-blue-600 text-white"
                    : "bg-gray-300 text-gray-900"
                }`}
              >
                {msg.message}
              </div>
            </div>
          ))}

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
      </div>

      {/* Auto-response Buttons */}
      <div className="sticky bottom-16 bg-white p-3 border-t z-30 w-full">
        {autoResponses.length > 0 ? (
          <div className="flex flex-wrap gap-2 justify-center">
            {autoResponses.map((item) => (
              <button
                key={item.id}
                onClick={() => handleAutoClick(item.question)}
                className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
              >
                {item.question}
              </button>
            ))}
          </div>
        ) : (
          <p className="text-gray-400 italic text-center">
            No auto-response questions available
          </p>
        )}
      </div>

      {/* Message Input */}
      <form
        onSubmit={sendMessage}
        className="flex p-3 bg-white border-t w-full fixed bottom-0 left-0 z-40"
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
          className="ml-2 bg-green-600 text-white px-4 py-2 rounded-full hover:bg-green-700"
        >
          Send
        </button>
      </form>
    </div>
  );
}
