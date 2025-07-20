import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [chatrooms, setChatrooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/auth/getUserdata",
          {
            withCredentials: true,
          }
        );
        const userId = response.data.user.id;
        if (!userId) {
          navigate("/login");
          return;
        }
        setUser(response.data.user);
      } catch (error) {
        console.error("Error fetching user data:", error);
        navigate("/login");
      }
      setLoading(false);
    };
    fetchUserData();
    // Mock data for chatrooms
    setChatrooms([
      {
        id: "chat-1",
        name: "Team Alpha",
        createdAt: "2023-06-07T10:00:00Z",
        memberCount: 3,
      },
      {
        id: "chat-2",
        name: "Project Discussion",
        createdAt: "2023-06-02T14:30:00Z",
        memberCount: 5,
      },
      {
        id: "chat-3",
        name: "Gaming Squad",
        createdAt: "2023-05-28T20:15:00Z",
        memberCount: 4,
      },
    ]);
  }, [navigate]);

  const handleCreateChatroom = () => {
    navigate("/create-chatroom");
  };

  const handleLogout = () => {
    try {
      const response = axios.post(
        "http://localhost:3000/api/auth/logout",
        {},
        { withCredentials: true }
      );
      console.log("Logout successful:", response.data);
    } catch (error) {
      console.error("Logout failed:", error);
    }
    navigate("/");
  };

  const handleDeleteChatroom = (id) => {
    setChatrooms(chatrooms.filter((room) => room.id !== id));
  };

  const handleJoinChatroom = (id) => {
    navigate(`/chatroom/${id}`);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // if (!user) {
  //   return <div className="flex min-h-screen items-center justify-center bg-black text-white">Loading...</div>;
  // }

  return loading ? (
    <div className="flex min-h-screen items-center justify-center bg-black text-white">
      Loading...
    </div>
  ) : (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-white">
      <header className="border-b border-green-800 bg-black p-4">
        <div className="container mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">
            ChatConnect
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-blue-400">Welcome {user?.firstName}!</span>
            <button
              onClick={handleLogout}
              className="px-3 py-1 text-sm border border-red-600 text-red-500 rounded-md hover:bg-red-900/20 hover:text-red-400 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-6">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-green-400">
            Your Chatrooms
          </h2>
          <button
            onClick={handleCreateChatroom}
            className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-700 text-white rounded-md hover:from-green-600 hover:to-green-800 transition-colors flex items-center"
          >
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
                d="M12 4v16m8-8H4"
              />
            </svg>
            Create New Chatroom
          </button>
        </div>

        {chatrooms.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-green-800 bg-gray-900 p-12 text-center">
            <p className="mb-4 text-xl text-gray-400">
              You haven't created any chatrooms yet
            </p>
            <button
              onClick={handleCreateChatroom}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center"
            >
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
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Create Your First Chatroom
            </button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {chatrooms.map((chatroom) => (
              <div
                key={chatroom.id}
                className="border border-green-800 bg-gray-900 rounded-lg transition-all hover:shadow-md hover:shadow-green-900/20"
              >
                <div className="p-6 pb-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl text-green-500 font-semibold">
                      {chatroom.name}
                    </h3>
                    <div className="relative">
                      <button className="h-8 w-8 p-0 text-gray-400 hover:text-white">
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
                            d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <p className="text-blue-400 text-sm">
                    Created on {formatDate(chatroom.createdAt)}
                  </p>
                </div>
                <div className="px-6">
                  <div className="flex items-center gap-2 text-gray-300">
                    <svg
                      className="h-4 w-4 text-blue-400"
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
                    <span>{chatroom.memberCount} members active</span>
                  </div>
                </div>
                <div className="p-6">
                  <button
                    onClick={() => handleJoinChatroom(chatroom.id)}
                    className="w-full py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-md hover:from-blue-700 hover:to-blue-800 transition-colors"
                  >
                    Join Chatroom
                  </button>
                </div>
              </div>
            ))}

            <div className="flex items-center justify-center border-dashed border-green-800 bg-gray-900 rounded-lg p-6 transition-all hover:border-green-600">
              <button
                onClick={handleCreateChatroom}
                className="h-full w-full flex flex-col items-center gap-2 text-green-500 hover:bg-green-900/20 hover:text-green-400 transition-colors rounded-md p-4"
              >
                <svg
                  className="h-8 w-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                <span>Create New Chatroom</span>
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
