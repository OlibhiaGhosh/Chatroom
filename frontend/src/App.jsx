import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import LoginForm from "./components/LoginForm";
import SignupForm from "./components/SignupForm";
import Dashboard from "./components/Dashboard";
import CreateChatroom from "./components/CreateChatroom";
import ChatRoom from "./components/Chatroom";
import JoinChatroom from "./components/JoinChatroom";
import "./App.css";
import { io } from "socket.io-client";

export const socket = io("http://localhost:3000", {
  withCredentials: true,       // send cookies along
  autoConnect: true,           // or manually call socket.connect()
});
function App() {
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
