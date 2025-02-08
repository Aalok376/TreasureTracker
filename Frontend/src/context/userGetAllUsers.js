import { useState, useEffect } from "react";
import axios from "axios";


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
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return { allUsers, loading }; // Returning an object
};

export default useGetAllUsers;
