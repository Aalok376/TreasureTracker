import React from 'react';

const ChatHeader = () => {
  
  const user = {
    name: "Deekshya",
    avatar: "https://i.pinimg.com/736x/14/d0/65/14d065e8942d36334f76ec3fba11deda.jpg",
  };

  return (
    <div className="flex items-center justify-between bg-gray-100 p-6 rounded-t-lg shadow-md w-full hover:bg-gray-200 transition duration-200 ease-in-out">
      {/* Avatar */}
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full overflow-hidden border-4 border-green-500"> {/* Green border */}
          <img
            src={user.avatar}
            alt="User Avatar"
            className="object-cover w-full h-full"
          />
        </div>
        {/* User Name */}
        <div>
          <h2 className="font-semibold text-gray-800 text-2xl">{user.name}</h2>
          <span className="text-sm text-black">Online</span> {/* "Online" status in black and below */}
        </div>
      </div>

      {/* Optional icons */}
      <div className="flex gap-4">
        {/* Add optional icons if needed */}
      </div>
    </div>
  );
};

export default ChatHeader;

