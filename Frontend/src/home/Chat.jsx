
import React, { useState } from "react";
import Left from "./left/Left";
import Right from "./right/Right";
import Logout from "./left1/Logout";

const Chat = () => {
  const [receiverId, setReceiverId] = useState(null);

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        width: "100vw",
        overflow: "hidden",
        backgroundColor: "#eaeaea",
      }}
    >
      {/* Left section */}
      <div
        style={{
          flex: "0.35",
          minWidth: "350px",
          backgroundColor: "#f4f4f4",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "15px",
          borderRight: "2px solid #ddd",
          overflowY: "auto",
          overflowX: "hidden",
          position: "relative",
        }}
      >
        <Left setReceiverId={setReceiverId} />
        
        {/* Logout button */}
        <div
          style={{
            marginTop: "20px",
            position: "absolute",
            bottom: "20px",
            width: "100%",
          }}
        >
          <Logout />
        </div>
      </div>

      {/* Right section */}
      <div
        style={{
          flex: 1,
          backgroundColor: "#fff",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          alignItems: "stretch",
          padding: "20px",
          overflow: "hidden",
        }}
      >
        <Right receiverId={receiverId} />
      </div>
    </div>
  );
};

export default Chat;
