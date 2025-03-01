
import React from "react";
import useConversation from "../../statemanage/useConversation.js";
import { useSocketContext } from "../../context/SocketContext.jsx";

function User({ user }) {
  const { selectedConversation, setSelectedConversation } = useConversation();
  const isSelected = selectedConversation?._id === user._id;
  const { onlineUsers } = useSocketContext();

  // Check if the user is online by their userId
  const isOnline = onlineUsers?.includes(user._id);

  return (
    <div
      className={`cursor-pointer p-4 flex flex-col items-center space-y-2 duration-300 ${
        isSelected ? "bg-gray-200" : "hover:bg-gray-100"
      }`}
      onClick={() => setSelectedConversation(user)}
    >
      
      <div className="relative w-20 h-20 rounded-full overflow-hidden">
        <img
          src={
            user.avatar ||
            "https://static.vecteezy.com/system/resources/previews/030/504/836/non_2x/avatar-account-flat-isolated-on-transparent-background-for-graphic-and-web-design-default-social-media-profile-photo-symbol-profile-and-people-silhouette-user-icon-vector.jpg"
          }
          alt="User Avatar"
          className="object-cover w-full h-full"
        />
      
        <div
          className={`absolute bottom-1 right-1 w-4 h-4 rounded-full border-2 border-white ${
            isOnline ? "bg-green-500" : "bg-gray-400"
          }`}
        ></div>
      </div>

     
      <div className="text-center">
        <h2 className="font-semibold text-gray-800 text-sm">{user.name}</h2>
        <p className="text-gray-500 text-xs">{user.email}</p>
      </div>
    </div>
  );
}

export default User;
