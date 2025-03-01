import { useState } from "react";
import axios from "axios";
import useConversation from "../statemanage/useConversation.js";
import { socket } from "../context/SocketProvider"; 

function useSendMessage() {
  const [loading, setLoading] = useState(false);
  const { selectedConversation, setMessages } = useConversation();
 
  const sendMessages = async (message) => {
    if (!selectedConversation?._id) return;
  
    setLoading(true);
    try {
      const res = await axios.post(`/api/message/send/${selectedConversation._id}`, {
        text: message.text,
        receiverId: selectedConversation._id,
      });
  
      const newMessage = res.data;
  
      console.log("Message sent successfully:", newMessage);
  
      // Emit message via Socket.IO
      socket.emit("sendMessage", newMessage);
  
      // Update messages in UI immediately
      setMessages((prevMessages) => [...prevMessages, newMessage]);
  
    } catch (error) {
      console.error(" Error sending message:", error);
    } finally {
      setLoading(false);
    }
  };
  
  
  return { sendMessages, loading };
}

export default useSendMessage;
