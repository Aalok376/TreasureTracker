import React, { useState } from "react";
import { IoIosSearch } from "react-icons/io";

const Search = () => {
  return (
    <div className="border border-gray-300 p-3 rounded-lg shadow-lg flex items-center w-fit bg-gray-100">
      <input
        type="text"
        placeholder="Search"
        className="w-full max-w-xs p-2 outline-none border-none focus:ring-0 rounded-md bg-transparent"
      />
      <label
        className="ml-3 p-2 rounded-lg cursor-pointer transition-all duration-300 text-gray-400 hover:text-gray-600"
      >
        <IoIosSearch className="text-2xl font-bold" />
      </label>
    </div>
  );
};

export default Search;
