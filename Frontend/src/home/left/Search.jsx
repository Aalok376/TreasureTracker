import React, { useState } from "react";
import { IoIosSearch } from "react-icons/io";
import useGetAllUsers from "../../context/userGetAllUsers"; // Import custom hook
import useConversation from "../../statemanage/useConversation.js";

const Search = () => {
  const [search, setSearch] = useState("");
  const { allUsers, loading } = useGetAllUsers(); // Use the custom hook
  const { setSelectedConversation } = useConversation();

  if (loading) {
    return <div>Loading...</div>; // Optionally show a loading message while fetching data
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!search) return;

    // Find the user by email
    const conversation = allUsers.find((user) =>
      user.email.toLowerCase().includes(search.toLowerCase())
    );

    // If a user is found, set it as the selected conversation
    if (conversation) {
      setSelectedConversation(conversation);
    }

    setSearch(""); // Reset search input
  };

  return (
    <div className="border border-gray-300 p-3 rounded-lg shadow-lg flex items-center w-fit bg-gray-100">
      <form onSubmit={handleSubmit} className="flex items-center w-full">
        <input
          type="text"
          placeholder="Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)} // Update search state on change
          className="w-full max-w-xs p-2 outline-none border-none focus:ring-0 rounded-md bg-transparent"
        />

        <button
          type="submit"
          className="ml-3 p-2 rounded-lg cursor-pointer transition-all duration-300 text-gray-400 hover:text-gray-600"
        >
          <IoIosSearch className="text-2xl font-bold" />
        </button>
      </form>
    </div>
  );
};

export default Search;
