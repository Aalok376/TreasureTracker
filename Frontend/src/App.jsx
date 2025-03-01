import React from "react";
import Signup from "./components/Signup";
import Login from "./components/Login";
import { useAuth } from "./context/AuthProvider";
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Chat from "./home/Chat";
import VideoCall from "./components/VideoCall"; // Import video call page
import toast, { Toaster } from "react-hot-toast";
import { SocketProvider } from "./context/SocketContext"; // Import the SocketProvider

function App() {
  const { authUser } = useAuth();

  return (
    // Wrap the entire app in SocketProvider
    <SocketProvider>
      <Routes>
        <Route path="/signup" element={authUser ? <Navigate to="/" /> : <Signup />} />
        <Route path="/login" element={authUser ? <Navigate to="/" /> : <Login />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Chat />
            </ProtectedRoute>
          }
        />
        {/* New Route for Video Call */}
        <Route
          path="/video-call/:roomID"
          element={
            <ProtectedRoute>
              <VideoCall />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to={authUser ? "/" : "/login"} />} />
      </Routes>
      <Toaster />
    </SocketProvider>
  );
}

export default App;
