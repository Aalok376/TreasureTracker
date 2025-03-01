import React, { useState, useEffect } from "react";
import { Send } from "lucide-react"; // Import Send icon
import { useAuth } from "../../context/AuthProvider";
import useConversation from "../../statemanage/useConversation.js";
import Cookies from "js-cookie";

const Type = ({ fetchMessages }) => {
  const { authUser } = useAuth();
  const { selectedConversation } = useConversation();
  const [message, setMessage] = useState("");
  const [token, setToken] = useState(null);

  // Get token from cookies after authUser is set
  useEffect(() => {
    if (authUser) {
      const savedToken = Cookies.get("jwt");
      setToken(savedToken);
      console.log("Token from cookies:", savedToken); // Debug log
    }
  }, [authUser]);

  // Extract sendMessage as a separate function
  const sendMessage = async () => {
    if (!message.trim()) return; // Prevent empty messages

    if (!authUser) {
      console.error("User not authenticated!");
      return;
    }

    if (!selectedConversation || !selectedConversation._id) {
      console.error("No conversation selected!");
      return;
    }

    if (!token) {
      console.error("No token found! User might not be authenticated.");
      return;
    }

    const messageData = {
      text: message,
      receiverId: selectedConversation._id,
    };

    console.log("Sending message:", messageData);

    // Optimistically update UI
    setMessage(""); // Clear input field

    try {
      const response = await fetch(`http://localhost:5002/api/message/send/${selectedConversation._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text: message }), 
      });
      
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

      console.log("Message sent successfully!");

      // ✅ Refresh messages after sending
      fetchMessages();
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage();
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2 p-3 border-t bg-slate shadow-md">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder={selectedConversation ? "Type a message..." : "Select a conversation first"}
        className="flex-grow p-2 border rounded-lg focus:outline-none"
        disabled={!selectedConversation}
      />
      <button
        type="submit"
        className="p-2 bg-slate-600 text-slate rounded-lg hover:bg-slate-800 transition"
        disabled={!selectedConversation || !message.trim()}
      >
        <Send className="w-5 h-5" />
      </button>
    </form>
  );
};

export default Type;

