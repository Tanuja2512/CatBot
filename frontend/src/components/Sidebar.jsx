import React, { useState } from "react";
import { IoIosCloseCircle } from "react-icons/io";
import { ChatData } from "../context/ChatContext";
import { MdDelete, MdEdit } from "react-icons/md";
import { LoadingSpinner } from "./Loading";
import { UserData } from "../context/UserContext";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const {
    chats,
    createChat,
    createLod,
    setSelected,
    deleteChat,
    selected,
  } = ChatData();
  const { logoutHandler } = UserData();
  const [hoveredChat, setHoveredChat] = useState(null);

  const deleteChatHandler = (id, e) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this chat?")) {
      deleteChat(id);
    }
  };

  const clickEvent = (id) => {
    setSelected(id);
    toggleSidebar();
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden" 
          onClick={toggleSidebar}
        />
      )}
      
      <div
        className={`fixed top-0 left-0 h-full bg-gray-900 border-r border-gray-700 transition-transform duration-300 ease-in-out z-50 md:relative md:translate-x-0 md:w-80 flex flex-col ${
          isOpen ? "translate-x-0 w-80" : "-translate-x-full w-80"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-gray-400 to-black rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">
                <img src="/logo.png" alt="logo" className="w-full h-full object-contain" />
              </span>
            </div>
            <h1 className="text-white font-semibold text-lg">CatGPT</h1>
          </div>
          
          <button
            className="md:hidden p-1.5 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
            onClick={toggleSidebar}
          >
            <IoIosCloseCircle size={24} />
          </button>
        </div>

        {/* New Chat Button */}
        <div className="p-4">
          <button
            onClick={createChat}
            disabled={createLod}
            className="w-full h-11 bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2 border border-gray-600"
          >
            {createLod ? (
              <LoadingSpinner />
            ) : (
              <>
                <span className="text-lg">+</span>
                <span>New chat</span>
              </>
            )}
          </button>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-hidden px-4">
          <div className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
            {chats && chats.length > 0 ? (
              <div className="space-y-1 pb-4">
                {chats.map((chat) => (
                  <div
                    key={chat._id}
                    onClick={() => clickEvent(chat._id)}
                    onMouseEnter={() => setHoveredChat(chat._id)}
                    onMouseLeave={() => setHoveredChat(null)}
                    className={`group relative flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                      selected === chat._id
                        ? "bg-gray-700 text-white"
                        : "text-gray-300 hover:bg-gray-800"
                    }`}
                  >
                    {/* Chat Icon */}
                    <div className="flex-shrink-0 w-6 h-6">
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        className="text-gray-400"
                      >
                        <path
                          d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>

                    {/* Chat Title */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {chat.latestMessage?.slice(0, 25) || "New Chat"}
                        {chat.latestMessage?.length > 25 && "..."}
                      </p>
                    </div>

                    {/* Action Buttons */}
                    <div
                      className={`flex items-center gap-1 transition-opacity duration-200 ${
                        hoveredChat === chat._id || selected === chat._id
                          ? "opacity-100"
                          : "opacity-0"
                      }`}
                    >
                      <button
                        onClick={(e) => deleteChatHandler(chat._id, e)}
                        className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-gray-600 rounded transition-colors"
                      >
                        <MdDelete size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-32 text-gray-500">
                <svg
                  width="48"
                  height="48"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="mb-3 text-gray-600"
                >
                  <path
                    d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <p className="text-sm">No conversations yet</p>
                <p className="text-xs text-gray-600 mt-1">Start a new chat to begin</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-700 p-4">
          <button
            onClick={logoutHandler}
            className="w-full flex items-center gap-3 p-3 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors duration-200"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16,17 21,12 16,7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            <span className="font-medium">Log out</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;