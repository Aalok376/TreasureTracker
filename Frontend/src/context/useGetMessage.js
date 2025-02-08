import { useState, useEffect } from 'react';
import axios from 'axios';

function useGetMessage() {
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState([]);
  
  useEffect(() => {
    const fetchMessages = async () => {
      setLoading(true);
      try {
        const response = await axios.get('/api/message/get/');
        console.log("Fetched messages:", response.data); // Check the data
        setMessages(response.data);
      } catch (error) {
        console.error("Error fetching messages:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, []);

  return { messages, loading };
}

export default useGetMessage;
