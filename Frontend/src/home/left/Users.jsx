import React from "react";
import useGetAllUsers from "../../context/userGetAllUsers.js";
import User from "./User.jsx";

const Users = () => {
  const { allUsers, loading } = useGetAllUsers(); // Destructure as an object

  if (loading) return <p>Loading...</p>;

  // Ensure the data exists
  const users = allUsers?.filteredUsers || [];  // Fallback to empty array if no data

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">All Users</h2>
      {users.length > 0 ? (
        <div>
          {users.map((user) => (
            <User key={user._id} user={user} />  // Display user in a linear list format
          ))}
        </div>
      ) : (
        <p>No users found</p>
      )}
    </div>
  );
};

export default Users;
