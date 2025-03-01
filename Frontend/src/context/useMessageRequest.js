import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthProvider";

const useMessageRequests = () => {
  const { authUser } = useAuth();
  const [messageRequests, setMessageRequests] = useState([]);

  useEffect(() => {
    if (authUser) {
      axios.get(`/api/message/requests/${authUser?.user._id}`)
        .then((res) => {
          if (res.data.requests.length > 0) {
            setMessageRequests(res.data.requests);
          }
        })
        .catch((error) => console.error("Error fetching message requests:", error));
    }
  }, [authUser]);

  // Handle Accept/Decline
  const handleRequestAction = async (requestId, action) => {
    try {
      await axios.put(`/api/message/requests/${requestId}`, { status: action });
      setMessageRequests((prev) => prev.filter((req) => req._id !== requestId));
    } catch (error) {
      console.error(`Error updating request status to ${action}:`, error);
    }
  };

  return { messageRequests, handleRequestAction };
};

export default useMessageRequests;
