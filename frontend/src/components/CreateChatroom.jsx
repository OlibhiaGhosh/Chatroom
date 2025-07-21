import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CreateChatroom = () => {
  const navigate = useNavigate();
  const [chatroomData, setChatroomData] = useState({
    name: '',
    description: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [chatroomId, setChatroomId] = useState('');
  const [chatroomLink, setChatroomLink] = useState('');
  const [linkCopied, setLinkCopied] = useState(false);

  const handleChange = (e) => {
    setChatroomData({
      ...chatroomData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post('http://localhost:3000/api/chatroom/create-chatroom', chatroomData, {withCredentials: true});
      const newChatroomId = response.data.chatroom.room_id;
      const link = `${window.location.origin}/chatroom/${newChatroomId}`;

      setChatroomId(newChatroomId);
      setChatroomLink(link);
      setShowLinkDialog(true);
    } catch (error) {
      console.error('Failed to create chatroom:', error);
    } finally { 
      setIsLoading(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(chatroomLink);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };

  const handleGoToChatroom = () => {
    navigate(`/chatroom/${chatroomId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 py-12">
      <div className="container mx-auto px-4">
        <button
          onClick={() => navigate('/dashboard')}
          className="mb-6 text-blue-400 hover:bg-blue-900/20 hover:text-blue-300 px-3 py-1 rounded transition-colors flex items-center"
        >
          <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Dashboard
        </button>

        <div className="flex justify-center">
          <div className="w-full max-w-md border border-green-800 bg-gray-900 text-white rounded-lg">
            <div className="p-6 pb-2">
              <h2 className="text-center text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">
                Create a New Chatroom
              </h2>
              <p className="text-center text-gray-400 mt-2">Set up your chatroom and invite others to join</p>
            </div>
            <div className="p-6">
              <form onSubmit={handleSubmit}>
                <div className="grid gap-6">
                  <div className="grid gap-2">
                    <label htmlFor="name" className="text-white text-sm font-medium">
                      Chatroom Name
                    </label>
                    <input
                      id="name"
                      name="name"
                      placeholder="Enter a name for your chatroom"
                      value={chatroomData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-green-800 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                  <div className="grid gap-2">
                    <label htmlFor="description" className="text-white text-sm font-medium">
                      Description (optional)
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      placeholder="What's this chatroom about?"
                      value={chatroomData.description}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-3 py-2 border border-green-800 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2 bg-gradient-to-r from-green-500 to-green-700 text-white rounded-md hover:from-green-600 hover:to-green-800 transition-colors disabled:opacity-50"
                    disabled={isLoading || !chatroomData.name.trim()}
                  >
                    {isLoading ? 'Creating...' : 'Create Chatroom'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Dialog */}
      {showLinkDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="border border-green-800 bg-gray-900 text-white rounded-lg max-w-md w-full mx-4">
            <div className="p-6 pb-2">
              <h2 className="text-center text-2xl font-bold text-green-500">Chatroom Created!</h2>
              <p className="text-center text-blue-400 mt-2">
                Share this link with others to invite them to your chatroom
              </p>
            </div>
            <div className="p-6">
              <div className="flex items-center space-x-2 rounded-md border border-green-800 bg-gray-800 p-2">
                <div className="flex-1">
                  <div className="overflow-hidden text-sm font-medium text-white">{chatroomLink}</div>
                </div>
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className={`h-8 w-8 rounded flex items-center justify-center ${
                    linkCopied ? 'bg-green-600' : 'bg-blue-600 hover:bg-blue-700'
                  } transition-colors`}
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
                <button
                  type="button"
                  className="h-8 w-8 bg-green-600 hover:bg-green-700 rounded flex items-center justify-center transition-colors"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                  </svg>
                </button>
              </div>
              {linkCopied && <p className="text-center text-sm text-green-500 mt-2">Link copied to clipboard!</p>}
              <div className="flex justify-center mt-4">
                <button
                  onClick={handleGoToChatroom}
                  className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-md hover:from-blue-700 hover:to-blue-800 transition-colors"
                >
                  Go to Chatroom
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateChatroom;