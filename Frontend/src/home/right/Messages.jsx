import React from "react";
import Message from "./Message";
import Loading from "../../components/Loading.jsx";
import useGetMessage from "../../context/useGetMessage.js";  // Assuming this hook handles fetching messages

function Messages() {
  const { messages, loading } = useGetMessage();  // Get messages and loading from the hook

  if (loading) {
    return <Loading />;  // Show loading state if still fetching messages
  }

  return (
    <div className="bg-slate-100 h-screen flex flex-col p-4">
      <div className="flex-1 overflow-y-auto">
        {/* Render messages or show "Say Hi!" if no messages */}
        {messages?.length > 0 ? (
          messages.map((message, index) => (
            <Message key={index} message={message} />
          ))
        ) : (
          <p className="text-center text-gray-700 mt-8">Say Hi! to start the conversation</p>
        )}
      </div>
    </div>
  );
}

export default Messages;

