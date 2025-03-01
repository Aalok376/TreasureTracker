
import React from "react";
import Search from "./Search";
import Users from "./Users";

function Left() {
  return (
    <div className="bg-white shadow-md rounded-lg w-[350px] h-screen p-4 flex flex-col border-r overflow-y-auto">
      <h1 className="text-lg font-semibold text-gray-700 mb-2">Chats</h1>
      <Search />
      <div className="flex flex-col gap-2 mt-4 flex-grow overflow-y-auto">
        <hr />
        <Users />
      </div>
    </div>
  );
}

export default Left; 






