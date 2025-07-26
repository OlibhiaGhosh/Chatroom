import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import Navbar from "./Navbar";

const JoinChatroom = () => {
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const { id: chatroomId } = useParams(); // Assuming you get the chatroom ID from the URL params
  const [isLoading, setIsLoading] = useState(false);

  const handleJoinChatroom = async () => {
    let isMounted = true; // Set the mounted flag to true
    setIsLoading(true);
    const controller = new AbortController();
    try {
      const response = await axiosPrivate.post(
        `/api/chatroom/join-chatroom/${chatroomId}`,
        {
          signal: controller.signal, // Pass the abort signal to the request
        }
      );
      console.log("Join chatroom successful:", response.data);
      isMounted && setIsLoading(false);
      navigate(`/chatroom/${chatroomId}`, { replace: true });
      return;
    } catch (error) {
      console.error("Join chatroom failed:", error);
      navigate("/dashboard", {
        state: { from: location.pathname },
        replace: true,
      });
    }
    return () => {
      isMounted = false;
      setIsLoading(false);
      controller.abort(); // Abort the join request on unmount
    };
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 py-12">
        <div className="container mx-auto px-4">
          <button
            onClick={() => navigate("/dashboard")}
            className="mb-6 text-blue-400 hover:bg-blue-900/20 hover:text-blue-300 px-3 py-1 rounded transition-colors flex items-center"
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
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Dashboard
          </button>

          <div className="flex justify-center">
            <div className="w-full max-w-md border border-green-800 bg-gray-900 text-white rounded-lg">
              <div className="p-6 pb-2">
                <h2 className="text-center text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">
                  Wanna join the Chatroom ?
                </h2>
              </div>
              <div className="p-6">
                <button
                  type="submit"
                  className="w-full py-2 bg-gradient-to-r from-green-500 to-green-700 text-white rounded-md hover:from-green-600 hover:to-green-800 transition-colors disabled:opacity-50"
                  disabled={isLoading}
                  onClick={handleJoinChatroom}
                >
                  {isLoading ? "Joining..." : "Join Chatroom"}
                </button>
                <p
                  className="text-center text-gray-400 mt-4 cursor-pointer hover:text-green-400"
                  onClick={() => {
                    navigate("/chatroom/create");
                  }}
                >
                  Set up your chatroom and invite others to join
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default JoinChatroom;
