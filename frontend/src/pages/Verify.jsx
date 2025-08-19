import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserData } from "../context/UserContext";
import { ChatData } from "../context/ChatContext";
import { LoadingSpinner } from "../components/Loading";

const Verify = () => {
  const [otp, setOtp] = useState("");
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  const { verifyUser, btnLoading } = UserData();
  const { fetchChats } = ChatData();
  const navigate = useNavigate();

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  const submitHandler = (e) => {
    e.preventDefault();
    verifyUser(Number(otp), navigate, fetchChats);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 transition-colors duration-300">

      <div className="w-full max-w-md bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg dark:shadow-gray-700">
        <h2 className="text-3xl font-semibold text-center text-gray-800 dark:text-white mb-6">
          Enter OTP to Verify
        </h2>

        <form onSubmit={submitHandler} className="space-y-5">
          <div>
            <label htmlFor="otp" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              OTP Code
            </label>
            <input
              type="number"
              id="otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your 6-digit code"
              required
            />
          </div>

          <button
            type="submit"
            disabled={btnLoading}
            className={`w-full py-2 px-4 text-white rounded-lg font-medium transition ${
              btnLoading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {btnLoading ? <LoadingSpinner /> : "Verify"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Verify;
