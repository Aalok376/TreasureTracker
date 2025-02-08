import React from "react";
import useConversation from "../../statemanage/useConversation.js";

function User({ user }) {
  const { selectedConversation, setSelectedConversation } = useConversation();
  const isSelected = selectedConversation?._id === user._id;

  return (
    <div
      className={`cursor-pointer p-4 flex flex-col items-center space-y-2 duration-300 ${
        isSelected ? "bg-gray-200" : "hover:bg-gray-100"
      }`}
      onClick={() => setSelectedConversation(user)}
    >
      {/* Avatar */}
      <div className="w-20 h-20 rounded-full overflow-hidden">
        <img
          src={
            user.avatar ||
            "https://i.pinimg.com/736x/14/d0/65/14d065e8942d36334f76ec3fba11deda.jpg"
          }
          alt="User Avatar"
          className="object-cover w-full h-full"
        />
      </div>

      {/* Name and Email */}
      <div className="text-center">
        <h2 className="font-semibold text-gray-800 text-sm">{user.name}</h2>
        <p className="text-gray-500 text-xs">{user.email}</p>
      </div>
    </div>
  );
}

export default User;
