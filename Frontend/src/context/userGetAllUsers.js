import { useState, useEffect } from "react";
import axios from "axios";

// Custom Hook
const useGetAllUsers = () => {
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token"); // Get token from storage
        const response = await axios.get("/api/user/getUserProfile", {
          headers: {
            Authorization: `Bearer ${token}`, // Attach token
          },
        });

        setAllUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error.response ? error.response.data : error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []); // Empty dependency array to run once on mount

  return { allUsers, loading }; // Return the data and loading state
};

export default useGetAllUsers;
