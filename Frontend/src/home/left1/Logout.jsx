import React, { useState } from "react";
import { IoLogOutOutline } from "react-icons/io5";
import axios from "axios";
import Cookies from "js-cookie";
import toast from "react-hot-toast";

const Logout = () => {
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      const res = await axios.post("/api/user/logout");
      localStorage.removeItem("messenger");
      Cookies.remove("jwt");
      setLoading(false);
      toast.success("Logged out successfully!");
    } catch (error) {
      console.log(error);
      setLoading(false);
      toast.error("Logout failed, please try again!");
    }
  };

  return (
    <div className="flex items-center">
      <button onClick={handleLogout} disabled={loading} className="flex items-center justify-center">
        <IoLogOutOutline size={25} />
        {loading && <span>Logging out...</span>}
      </button>
    </div>
  );
};

export default Logout;
