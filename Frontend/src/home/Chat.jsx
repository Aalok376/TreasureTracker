import Left from "./left/Left";
import Right from "./right/Right";
import Logout from "./left1/Logout";

const Chat = () => {
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
      {/* Left Sidebar */}
      <div
        style={{
          flex: "0.35", // Increased width
          minWidth: "350px", // Wider min-width
          backgroundColor: "#f4f4f4",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "15px",
          borderRight: "2px solid #ddd",
          overflowY: "auto",
          overflowX: "hidden", // Prevent horizontal scrolling
          position: "relative", // For positioning logout button properly
        }}
      >
        <Left />
        <div style={{
          marginTop: "20px",
          position: 'absolute',
          bottom: "20px",
          width: "100%",
        }}>
          <Logout />
        </div>
      </div>

      {/* Right Chat Section */}
      <div
        style={{
          flex: 1, // Uses equal space distribution
          backgroundColor: "#fff",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between", // Ensures spacing
          alignItems: "stretch", // Makes sure it expands properly
          padding: "20px",
          overflow: "hidden",
        }}
      >
        <Right />
      </div>
    </div>
  );
};

export default Chat;


