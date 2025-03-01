
import { useState, useEffect } from "react";
import axios from "axios";
import useConversation from "../statemanage/useConversation.js";

function useGetMessage() {
  const { selectedConversation } = useConversation(); // Get selected conversation
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!selectedConversation?._id) {
      console.warn("No conversation selected. Skipping fetch.");
      setMessages([]); // Ensure state is cleared
      setLoading(false);
      return;
    }

    const fetchMessages = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.get(
          `http://localhost:5001/api/message/get/${selectedConversation._id}`
        );
        console.log("Fetched messages:", response.data);

        if (Array.isArray(response.data.messages)) {
          setMessages(response.data.messages);
        } else {
          console.warn("Expected a messages array. Received:", response.data);
          setMessages([]);
        }
      } catch (err) {
        console.error("Error fetching messages:", err);
        setError("Failed to fetch messages. Please try again later.");
        setMessages([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [selectedConversation]); // Depend on selectedConversation

  return { messages, loading, error, setMessages };
}

export default useGetMessage;
