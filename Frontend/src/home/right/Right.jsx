import React from "react";
import Chatuser from "./Chatuser";
import Message from "./Message";
import Type from "./Type";

const Right = () => {
  return (
    <div className="flex-1 h-screen bg-gray-100 flex flex-col border-l">
      {/* Header */}
      <div className="flex-shrink-0 border-b p-3 bg-white shadow-md w-full">
        <Chatuser />
      </div>

      {/* Messages */}
      <div className="flex-grow overflow-y-auto px-4 py-2">
        <Message />
      </div>

      {/* Input */}
      <div className="flex-shrink-0 border-t p-3 bg-white shadow-md w-full">
        <Type />
      </div>
    </div>
  );
};

export default Right;
