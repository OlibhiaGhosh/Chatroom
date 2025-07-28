import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import useAuth from "../hooks/useAuth";
import { use } from "react";
import { socket } from "../socket";
const ChatRoom = () => {
  const navigate = useNavigate();
  const { id: chatroomId } = useParams();
  const [creator, setCreator] = useState({});
  const [chatroomName, setChatroomName] = useState("Loading...");
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState([]);
  const [members, setMembers] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [showMobileMembers, setShowMobileMembers] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);
  const axiosPrivate = useAxiosPrivate();
  const location = useLocation();
  const { auth, setAuth } = useAuth();
  useEffect(() => {
    let isMounted = true; // Set the mounted flag to true
    const controller = new AbortController(); // on unmounting all the pending requests will be aborted
    console.log(`Chatroom ID: ${chatroomId}`);
    const fetchChatroomdata = async () => {
      try {
        setLoading(true);
        try {
          let currentUser = auth?.user;
          if (!currentUser) {
            // 🔁 Get user from backend if not present in context
            const userResponse = await axiosPrivate.post(
              "/api/auth/getUserdata",
              {},
              {
                signal: controller.signal,
              }
            );
            currentUser = userResponse.data.user;
            setAuth((prev) => ({ ...prev, user: currentUser }));
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
        const chatroomResponse = await axiosPrivate.post(
          `/api/chatroom/get-chatroomdatabyChatroomid/${chatroomId}`,
          {},
          {
            signal: controller.signal, // Pass the abort signal to the request
          }
        );
        console.log("🎯 getChatroomdata response:", chatroomResponse.data);
        try {
          const userResponse = await axiosPrivate.post(
            `/api/auth/getUserdatabyId/${chatroomResponse.data.chatroomDetails.creatorId}`,
            {},
            {
              signal: controller.signal, // Pass the abort signal to the request
            }
          );
          console.log("🎯 getUserdatabyId response:", userResponse.data);
          console.log("Creator username:", userResponse?.data?.user?.username);
          isMounted && setCreator(userResponse?.data?.user);
        } catch (error) {
          console.error("Error fetching creator data:", error);
          isMounted && setError("Failed to fetch creator data.");
          navigate("/login", {
            state: { from: location.pathname },
            replace: true,
          });
        }
        try {
          const messagesResponse = await axiosPrivate.get(
            `/api/messages/get-messages/${chatroomId}`,
            {
              signal: controller.signal, // Pass the abort signal to the request
            }
          );
          console.log("🎯 getMessages response:", messagesResponse.data);
          isMounted && setMessages(messagesResponse.data.content);
        } catch (error) {
          console.error("error in fetching messages:", error);
          isMounted && setMessages([]);
        }

        isMounted &&
          setChatroomName(chatroomResponse?.data?.chatroomDetails?.name);
        isMounted &&
          setMembers(chatroomResponse?.data?.chatroomDetails?.members);
        isMounted && setIsConnected(true);
        isMounted && setLoading(false);
        return;
      } catch (error) {
        // isMounted && setLoading(true);
        console.error("Error fetching data:", error);
        if (
          error.response?.data?.message ==
          "User is not a member of this chatroom"
        ) {
          console.log("User is not a member of this chatroom");
          isMounted && setIsConnected(false);
          navigate(`/join-chatroom/${chatroomId}`, {
            state: { from: location.pathname },
            replace: true,
          });
        } else if (
          error.response?.data?.message == "Chatroom not found" ||
          error.response?.status === 404 ||
          error.response?.data?.message == "Chatroom ID is required"
        ) {
          isMounted && setError(error.response?.data?.message);
          navigate("/dashboard", {
            state: { from: location.pathname },
            replace: true,
          });
        } else {
          navigate("/login", {
            state: { from: location.pathname },
            replace: true,
          });
        }
      }
    };
    fetchChatroomdata();
    return () => {
      isMounted = false;
      controller.abort();
      socket.emit("disconnected", {
        roomId: chatroomId,
        username: auth?.user?.username,
      });
    };
  }, [chatroomId]);

  useEffect(() => {
    const handleUserJoined = (data) => {
      console.log("From socket:", data.message);
    };

    const handleNewMessage = (data) => {
      console.log("New message received:", data);
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          user_id: data.userId,
          username: data.username,
          message: data.content,
          timestamp: new Date(),
        },
      ]);
    };

    socket.on("user_joined", (data) => {if (data.roomId === chatroomId) handleUserJoined(data)});
    socket.on("new_message", (data) => {if (data.roomId === chatroomId) handleNewMessage(data)});

    return () => {
      socket.off("user_joined", handleUserJoined);
      socket.off("new_message", handleNewMessage);
    };
  }, [chatroomId]);

  useEffect(() => {
    if (!auth?.user?.username) return; // don’t run until we know who you are
    socket.emit("join_room", {
      roomId: chatroomId,
      username: auth.user.username,
    });
  }, [chatroomId, auth?.user?.username]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (sending || !newMessage.trim()) return;

    setSending(true);
    try {
      const response = await axiosPrivate.post(
        `/api/messages/send-message/${chatroomId}`,
        {
          content: newMessage,
          username: auth.user.username,
        }
      );
      console.log("Message sent:", response.data);
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setSending(false);
    }
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleBack = () => {
    navigate("/dashboard");
  };

  const getOnlineCount = () => {
    return members.filter((member) => member.online).length;
  };
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-white">
        <p>Connecting to chatroom...</p>
      </div>
    );
  }
  console.log("Creator:", creator);
  return (
    <div className="flex h-screen flex-col bg-gradient-to-b from-black to-gray-900 text-white">
      {/* Header */}
      <header className="border-b border-green-800 bg-black p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={handleBack}
              className="mr-2 text-blue-400 hover:bg-blue-900/20 hover:text-blue-300 p-1 rounded transition-colors"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <div>
              <h1 className="text-xl font-bold text-green-500">
                {chatroomName}
              </h1>
              <div className="flex items-center gap-2">
                <span className="px-2 py-1 text-xs border border-blue-500 text-blue-400 rounded flex items-center">
                  <div className="mr-1 h-2 w-2 rounded-full bg-green-500"></div>
                  {getOnlineCount()} online
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowMobileMembers(!showMobileMembers)}
              className="px-3 py-1 text-sm border border-blue-600 text-blue-400 rounded hover:bg-blue-900/20 hover:text-blue-300 transition-colors md:hidden"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
            <button className="hidden md:flex items-center px-3 py-1 text-sm border border-blue-600 text-blue-400 rounded hover:bg-blue-900/20 hover:text-blue-300 transition-colors">
              <svg
                className="mr-2 h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                />
              </svg>
              Members ({members.length})
            </button>
          </div>
        </div>
      </header>

      {/* Chat Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="my-4 text-center text-gray-500">
            Created by: {creator.username}
          </div>
          {!messages.length ? (
            <div className="text-center text-gray-500">
              No messages yet. Start the conversation!
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {messages.map((message) => {
                const isOwnMessage = message.user_id === auth?.user?.id;
                const sender = members.find(
                  (m) => m.userId === message.user_id
                );

                return (
                  <div
                    key={message.user_id}
                    className={`flex ${
                      isOwnMessage ? "justify-end" : "justify-start"
                    }`}
                  >
                    {!isOwnMessage && (
                      <div className="mr-2 h-8 w-8 self-end bg-blue-700 rounded-full flex items-center justify-center text-sm">
                        {message.username.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        isOwnMessage
                          ? "bg-gradient-to-r from-green-600 to-green-700 text-white"
                          : "bg-gray-800 text-white"
                      }`}
                    >
                      {!isOwnMessage && (
                        <div className="mb-1 text-xs font-medium text-blue-400">
                          {message.username}
                        </div>
                      )}
                      <p>{message.message}</p>
                      <div
                        className={`mt-1 text-right text-xs opacity-70 ${
                          isOwnMessage ? "text-gray-200" : "text-gray-400"
                        }`}
                      >
                        {formatTime(message.timestamp)}
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
        {/* Members Sidebar (Desktop) */}
        <div className="hidden w-64 border-l border-green-800 bg-gray-900 p-4 md:block">
          <h2 className="mb-4 text-lg font-semibold text-green-500">
            Members ({members.length})
          </h2>
          <div key="members-list" className="flex flex-col gap-3">
            {members.map((member) => (
              <div key={member.userId} className="flex items-center gap-2">
                <div
                  className={`h-2 w-2 rounded-full ${
                    member.online ? "bg-green-500" : "bg-gray-500"
                  }`}
                />
                <div className="h-8 w-8 bg-blue-700 rounded-full flex items-center justify-center text-sm">
                  {member.username.charAt(0).toUpperCase()}
                </div>
                <span>
                  {member.username}{" "}
                  {member.userId === auth?.user?.id && "(You)"}
                </span>
              </div>
            ))}
          </div>
        </div>
        {/* Mobile Members Sidebar */}
        {showMobileMembers && (
          <div className="absolute right-0 top-16 bottom-16 w-64 border-l border-green-800 bg-gray-900 p-4 md:hidden z-10">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-green-500">
                Members ({members.length})
              </h2>
              <button
                onClick={() => setShowMobileMembers(false)}
                className="text-gray-400 hover:text-white"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="flex flex-col gap-3">
              {members.map((member) => (
                <div key={member.userId} className="flex items-center gap-2">
                  <div
                    className={`h-2 w-2 rounded-full ${
                      member.online ? "bg-green-500" : "bg-gray-500"
                    }`}
                  />
                  <div className="h-6 w-6 bg-blue-700 rounded-full flex items-center justify-center text-xs">
                    {member.username.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm">
                    {member.username} {member.userId === creator.id && "(You)"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Message Input */}
      <div className="border-t border-green-800 bg-gray-900 p-4">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-3 py-2 border border-green-800 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <button
            type="submit"
            disabled={!newMessage.trim() || sending}
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-md hover:from-blue-700 hover:to-blue-800 transition-colors disabled:opacity-50 flex items-center justify-center"
          >
            {sending ? (
              <svg
                className="h-4 w-4 animate-spin"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                ></path>
              </svg>
            ) : (
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatRoom;
