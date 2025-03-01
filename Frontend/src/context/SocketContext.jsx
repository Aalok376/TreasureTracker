
import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthProvider";
import io from "socket.io-client";
const SocketContext = createContext();

// it is a hook.
export const useSocketContext = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const {authUser} = useAuth();

    useEffect(() => {
      if (authUser) {
        const newSocket = io("http://localhost:5002", {
          query: { userId: authUser._id },
        });
        setSocket(newSocket);
        console.log("🔌 Socket initialized:", newSocket);
    
        newSocket.on("getOnlineUsers", (users) => {
          setOnlineUsers(users);
          console.log(" Online Users Updated:", users);
        });
    
        return () => {
          newSocket.disconnect();
          setSocket(null);
          console.log("🔌 Socket disconnected.");
        };
      }
    }, [authUser]);
    
  return (
    <SocketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};