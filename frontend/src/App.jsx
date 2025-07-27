import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import LoginForm from "./components/LoginForm";
import SignupForm from "./components/SignupForm";
import Dashboard from "./components/Dashboard";
import CreateChatroom from "./components/CreateChatroom";
import ChatRoom from "./components/Chatroom";
import JoinChatroom from "./components/JoinChatroom";
import "./App.css";
import { socket } from "./socket";
import { useEffect } from "react";
function App() {
  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
    }

    socket.on("connect", () => {
      console.log("🔗 Socket connected with ID:", socket.id);
    });

    socket.on("disconnect", () => {
      console.log("❌ Socket disconnected");
    });

    return () => {
      socket.disconnect(); // Clean up on unmount
    };
  }, []);
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginForm />} />
      <Route path="/signup" element={<SignupForm />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/create-chatroom" element={<CreateChatroom />} />
      <Route path="/chatroom/:id" element={<ChatRoom />} />
      <Route path="/join-chatroom/:id" element={<JoinChatroom />} />
    </Routes>
  );
}
export default App;
