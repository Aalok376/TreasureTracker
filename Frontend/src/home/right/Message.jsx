import React, { useEffect } from "react";
import { useAuth } from "../../context/AuthProvider"; // Use AuthContext

function Message({ message }) {
  const { authUser } = useAuth();

  // Ensure message has a valid createdAt time
  const createdAt = new Date(message.createdAt);
  const formattedTime = createdAt.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  });

  // Skip invalid message objects
  if (!message || !message.senderId || (!message.text && !message.message)) {
    console.warn("Skipping invalid message:", message);
    return null;
  }

  // Skip messages if authUser is not available
  if (!authUser || !authUser._id) {
    console.warn("Skipping message due to missing authUser:", authUser);
    return null;
  }

  // Check if the message was sent by the current user
  const itsMe = message.senderId === authUser._id;

  // Play notification sound when a new message is received
  useEffect(() => {
    const audio = new Audio("/noti.mp3"); // Specify the path to your audio file
    audio.play();
  }, [message]); // Trigger sound effect each time the `message` changes

  return (
    <div className={`flex ${itsMe ? "justify-end" : "justify-start"} mb-2`}>
      <div
        className={`px-4 py-2 rounded-xl text-white max-w-xs break-words ${
          itsMe ? "bg-blue-600 text-white" : "bg-gray-500 text-white"
        }`}
        style={{ borderRadius: "20px", padding: "10px 15px" }}
      >
        {/* Display message text */}
        {message.text || message.message}
        {/* Display the timestamp */}
        <div className="text-xs text-gray-300 mt-1">{formattedTime}</div>
      </div>
    </div>
  );
}

export default Message;

