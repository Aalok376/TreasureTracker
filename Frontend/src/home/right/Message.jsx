import React from "react";

function Message({ message }) {
  if (!message) return null; // Guard clause to prevent rendering invalid messages

  return (
    <div className="chat-container p-2 mb-3">
      <div className="chat-bubble">{message.text}</div>
      <div className="chat-footer opacity-50">Seen at {message.time}</div>
    </div>
  );
}

export default Message;


