import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useConversation from "../../statemanage/useConversation.js";
import { useSocketContext } from "../../context/SocketContext.jsx";
import { Video } from "lucide-react"; // Import video icon

const ChatHeader = () => {
  const { selectedConversation } = useConversation();
  const { onlineUsers } = useSocketContext();
  const navigate = useNavigate();

  const [user, setUser] = useState({
    email: "Select a user",
    avatar: "https://static.vecteezy.com/system/resources/previews/030/504/836/non_2x/avatar-account-flat-isolated-on-transparent-background-for-graphic-and-web-design-default-social-media-profile-photo-symbol-profile-and-people-silhouette-user-icon-vector.jpg",
  });

  // Update user state when selectedConversation changes
  useEffect(() => {
    if (selectedConversation && selectedConversation.email) {
      setUser({
        email: selectedConversation.email || "Unknown User",
        avatar: selectedConversation.avatar || "https://static.vecteezy.com/system/resources/previews/030/504/836/non_2x/avatar-account-flat-isolated-on-transparent-background-for-graphic-and-web-design-default-social-media-profile-photo-symbol-profile-and-people-silhouette-user-icon-vector.jpg",
      });
    }
  }, [selectedConversation]);  // Only updates when selectedConversation changes
  
  const isOnline = selectedConversation ? onlineUsers.includes(selectedConversation._id) : false;

  const handleVideoCall = () => {
    if (selectedConversation?._id) {
      navigate(`/video-call/${selectedConversation._id}`);  // Ensure roomID is passed
    }
  };

  return (
    <div className="flex items-center justify-between bg-gray-100 p-6 rounded-t-lg shadow-md w-full hover:bg-gray-200 transition duration-200 ease-in-out">
      {/* User Info */}
      <div className="flex items-center gap-4">
        <div className="relative w-16 h-16 rounded-full overflow-hidden">
          <img src={user.avatar} alt="User Avatar" className="object-cover w-full h-full" />
          <div
            className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 ${isOnline ? "bg-green-500" : "bg-gray-400"}`}
          ></div>
        </div>
        <div>
          <h2 className="font-semibold text-slate text-2xl">{user.email}</h2>
          <p className="text-sm text-gray-500">{isOnline ? "Online" : "Offline"}</p>
        </div>
      </div>

      {/* Video Call Button */}
      <button
        onClick={handleVideoCall}
        className="p-3 rounded-full bg-blue-500 hover:bg-blue-600 text-slate"
      >
        <Video size={24} />
      </button>
    </div>
  );
};

export default ChatHeader;
