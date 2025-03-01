import React, { useState, useEffect, useCallback, useRef } from "react";
import Chatuser from "./Chatuser";
import Message from "./Message";
import Type from "./Type";
import { useAuth } from "../../context/AuthProvider";
import useConversation from "../../statemanage/useConversation";
import Cookies from "js-cookie";
import { useSocketContext } from "../../context/SocketContext";

const Right = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const { selectedConversation } = useConversation();
  const { authUser } = useAuth();
  const { socket } = useSocketContext();
  const token = Cookies.get("jwt");
  const messagesEndRef = useRef(null); // Ref for scrolling to the bottom

  // Fetch messages function
  const fetchMessages = useCallback(async () => {
    if (!selectedConversation) return;

    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:5002/api/message/get/${selectedConversation._id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error(`Failed to fetch messages: ${response.status}`);

      const data = await response.json();
      if (data.messages) {
        setMessages(data.messages);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoading(false);
    }
  }, [selectedConversation, token]);

  // Fetch messages when the selected conversation changes
  useEffect(() => {
    if (selectedConversation) {
      fetchMessages();
    }
  }, [selectedConversation, fetchMessages]);

  // Handle new message received via socket
  useEffect(() => {
    if (!socket) {
      console.warn("⚠ Socket is not initialized yet.");
      return;
    }
  
    const handleNewMessage = (newMessage) => {
      console.log("Received new message:", newMessage); // Debug log to check incoming message
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    };
  
    // Listen for 'receiveMessage' event from the server
    socket.on("receiveMessage", handleNewMessage);
  
    // Cleanup on component unmount or socket change
    return () => {
      socket.off("receiveMessage", handleNewMessage);
    };
  }, [socket]); // Run whenever the socket changes
  

  // Scroll to the latest message after they are updated
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Early return for when there's no conversation
  if (!selectedConversation || !selectedConversation._id) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        No conversation selected
      </div>
    );
  }

  return (
    <div className="flex-1 h-screen bg-gray-100 flex flex-col border-l">
      <div className="flex-shrink-0 border-b p-3 bg-white shadow-md w-full">
        <Chatuser />
      </div>

      <div className="flex-grow overflow-y-auto px-4 py-2">
        {loading ? (
          <p className="text-center text-gray-500">Loading messages...</p>
        ) : messages.length > 0 ? (
          messages.map((msg) => <Message key={msg._id} message={msg} />)
        ) : (
          <p className="text-center text-gray-500">No messages yet</p>
        )}
        <div ref={messagesEndRef} /> {/* Scroll target */}
      </div>

      <div className="flex-shrink-0 border-t p-3 bg-white shadow-md w-full">
        <Type fetchMessages={fetchMessages} />
      </div>
    </div>
  );
};

export default Right;
