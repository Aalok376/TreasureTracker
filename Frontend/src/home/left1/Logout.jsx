import React, { useState } from "react";
import { IoLogOutOutline } from "react-icons/io5";
import axios from "axios";
import Cookies from "js-cookie";

const Logout = () => {
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      const res = await axios.post("/api/user/logout");
      localStorage.removeItem("messenger");
      Cookies.remove("jwt");
      setLoading(false);
      alert("Logged out Successfully!");
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  return (
    <div className="flex items-bottom gap-2">
      <button onClick={handleLogout} disabled={loading}>
        <IoLogOutOutline size={25} />
        {loading && <span>Logging out...</span>}
      </button>
    </div>
  );
};

export default Logout;
