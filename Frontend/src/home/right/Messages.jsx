
import React, { useState, useEffect, useRef } from "react";
import Message from "./Message";
import Loading from "../../components/Loading";
import useGetMessage from "../../context/useGetMessage";
import useSendMessage from "../../context/useSendMessage";
import { useAuth } from "../../context/AuthProvider";
import { useConversation } from "../../statemanage/useConversation";
import useGetSocketMessage from "../../context/useGetSocketMessage"; 
import { socket } from "../../context/SocketContext"; // Import socket

const Messages = () => {
  const { authUser } = useAuth();
  const { selectedConversation } = useConversation();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const { loading: fetchLoading, messages: fetchedMessages } = useGetMessage(selectedConversation?._id);
  const { sendMessages, loading: sendLoading } = useSendMessage();
  
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!socket) return;
  
    const handleReceiveMessage = (newMessage) => {
      console.log("🟢 New message received via socket:", newMessage);
  
      setMessages((prevMessages) => [...prevMessages, newMessage]); // Update UI
    };
  
    socket.on("receiveMessage", handleReceiveMessage);
  
    return () => {
      socket.off("receiveMessage", handleReceiveMessage);
    };
  }, [socket]);
  
  

  // Auto-scroll to the latest message
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (message.trim()) {
      const newMessage = {
        text: message,
        receiverId: selectedConversation?._id,
        senderId: authUser?.user._id,
      };

      try {
        await sendMessages(newMessage);
        setMessage(""); // Clear input after sending
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };

  if (fetchLoading || sendLoading) {
    return <Loading />;
  }

  return (
    <div className="bg-slate-100 h-screen flex flex-col p-4">
      <div className="flex-1 overflow-y-auto">
        {messages.length > 0 ? (
          messages.map((msg, index) => <Message key={index} message={msg} />)
        ) : (
          <p className="text-center text-gray-700 mt-8">No messages yet. Start the conversation!</p>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="flex-shrink-0 border-t p-3 bg-white shadow-md w-full flex">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={selectedConversation ? "Type a message..." : "Select a conversation first"}
          className="flex-grow p-2 border rounded-lg focus:outline-none"
          disabled={!selectedConversation}
        />
        <button
          onClick={handleSendMessage}
          disabled={!selectedConversation || !message.trim()}
          className="ml-2 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Messages;
