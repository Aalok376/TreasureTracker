import React from "react";
import Signup from "./components/Signup";
import Login from "./components/Login";
import { useAuth } from "./context/AuthProvider";
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Chat from "./home/Chat";
import Loading from "./components/Loading";

function App() {
    const { authUser } = useAuth();

    return (
        <>
           {/*  <Loading /> */}
           
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
                <Route path="*" element={<Navigate to={authUser ? "/" : "/login"} />} />
            </Routes>
            
        </>
    );
}

export default App;
