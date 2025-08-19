import React, { useEffect, useRef, useState } from "react";
import Sidebar from "../components/Sidebar";
import { GiHamburgerMenu } from "react-icons/gi";
import Header from "../components/Header";
import { ChatData } from "../context/ChatContext";
import { IoMdSend } from "react-icons/io";

import MessageDisplay from "../components/MessageDisplay"; // Adjust path as needed

const Home = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const {
    fetchResponse,
    messages,
    prompt,
    setPrompt,
    newRequestLoading,
    loading,
    chats,
  } = ChatData();

  const submitHandler = (e) => {
    e.preventDefault();
    fetchResponse();
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <Sidebar isOpen={isOpen} toggleSidebar={toggleSidebar} />

      <div className="flex flex-1 flex-col">
        <button
          onClick={toggleSidebar}
          className="md:hidden p-4 bg-gray-800 text-2xl"
        >
          <GiHamburgerMenu />
        </button>

        <div className="flex-1 p-6 flex flex-col overflow-scroll"> {/* Added flex-col here for layout */}
          <Header />
          <MessageDisplay
            messages={messages}
            loading={loading} 
            newRequestLoading={newRequestLoading} // Pass the loading state for new responses
          />
        </div>
      </div>

      {chats && chats.length === 0 && !newRequestLoading && !loading ? (
        <div className="fixed bottom-0 right-0 left-auto p-4 bg-gray-900 w-full md:w-[75%] text-center">
             <p>Create a new chat to start messaging!</p>
        </div>
      ) : (
        <div className="fixed bottom-0 right-0 left-auto p-4 bg-gray-900 w-full md:w-[75%]">
          <form
            onSubmit={submitHandler}
            className="flex justify-center items-center"
          >
            <input
              className="flex-grow p-4 bg-gray-700 rounded-l text-white outline-none"
              type="text"
              placeholder="Ask Anything"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              required
              disabled={newRequestLoading} 
            />
            <button
              className="p-4 bg-gray-700 rounded-r text-2xl text-white"
              type="submit"
              disabled={newRequestLoading} 
            >
              <IoMdSend />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Home;