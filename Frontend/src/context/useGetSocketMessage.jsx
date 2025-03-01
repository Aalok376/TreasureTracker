
import { useEffect } from "react";
import { useSocketContext } from "./SocketContext";

const useGetSocketMessage = (setMessages) => {
  const { socket } = useSocketContext();

  useEffect(() => {
    if (!socket) return;

    // Handle incoming messages
    const handleNewMessage = (newMessage) => {
      console.log("Received new message:", newMessage);
      
      setMessages((prevMessages) => [newMessage, ...prevMessages]); // Latest message first
    };

    // Listen for incoming messages
    socket.on("receiveMessage", handleNewMessage);

    // Cleanup listener when the component unmounts or socket changes
    return () => {
      socket.off("receiveMessage", handleNewMessage);
    };
  }, [socket, setMessages]); 

  return null; // This hook does not return JSX
};

export default useGetSocketMessage;
