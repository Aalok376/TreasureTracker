import React, { useState } from "react";
import { IoSendSharp } from "react-icons/io5";
import useConversation from "../../statemanage/useConversation.js";  // Assuming you have the useConversation hook

function Type() {
  const [message, setMessage] = useState("");  // State to store the typed message
  const { selectedConversation, messages, setMessages } = useConversation();  // Get the selected conversation and setMessages from the context

  const handleSend = async () => {
    if (message.trim() === "") return;  // Prevent sending empty messages

    // Add the new message to the messages state
    const newMessage = {
      text: message,
      time: new Date().toLocaleTimeString(), // Format the time when the message was sent
      sender: "me", // You can customize this depending on the user
    };

    setMessages((prevMessages) => [...prevMessages, newMessage]);  // Update messages state

    setMessage("");  // Clear the input field after sending

    // Optional: You can also send the message to the backend via an API call
    // await axios.post("/api/message/send", { text: message, conversationId: selectedConversation._id });
  };

  return (
    <div className="flex items-center gap-2 p-3 bg-white rounded-lg shadow-md">
      {/* Input Field */}
      <input
        type="text"
        placeholder="Type a message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}  // Update message state on input change
        className="input input-bordered w-full p-2 border-gray-300 rounded-lg outline-none"
      />

      {/* Send Button */}
      <button
        onClick={handleSend}
        className="p-2 bg-blue-500 text-slate rounded-lg hover:bg-blue-600 transition"
      >
        <IoSendSharp size={20} />
      </button>
    </div>
  );
}

export default Type;
