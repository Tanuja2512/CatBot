import React, { createContext, useContext, useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";
import { server } from "../main";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [btnLoading, setBtnLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [isAuth, setIsAuth] = useState(false);
  const [loading, setLoading] = useState(true);

  async function loginUser(email, navigate) {
    setBtnLoading(true);
    try {
      const { data } = await axios.post(`https://catbot-backend-ix8j.onrender.com/api/user/login`, { email });
      console.log(email);
      toast.success(data.message);
      localStorage.setItem("verifyToken", data.verifyToken);
      navigate("/verify");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setBtnLoading(false);
    }
  }

  async function verifyUser(otp, navigate, fetchChats) {
    const verifyToken = localStorage.getItem("verifyToken");
    if (!verifyToken) {
      toast.error("Verification token missing. Please login again.");
      return;
    }

    setBtnLoading(true);
    try {
      const { data } = await axios.post(`${server}/api/user/verify`, {
        otp,
        verifyToken,
      });

      toast.success(data.message);
      localStorage.removeItem("verifyToken");
      localStorage.setItem("token", data.token);
      navigate("/");
      setIsAuth(true);
      setUser(data.user);
      fetchChats();
    } catch (error) {
      toast.error(error.response?.data?.message || "Verification failed");
    } finally {
      setBtnLoading(false);
    }
  }

  async function fetchUser() {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const { data } = await axios.get(`${server}/api/user/me`, {
        headers: {
          token,
        },
      });

      setIsAuth(true);
      setUser(data);
    } catch (error) {
      console.error("Fetch user failed:", error);
      setIsAuth(false);
    } finally {
      setLoading(false);
    }
  }

  const logoutHandler = (navigate) => {
    localStorage.removeItem("token");
    toast.success("Logged out");
    setIsAuth(false);
    setUser(null);
    navigate("/login");
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <UserContext.Provider
      value={{
        loginUser,
        btnLoading,
        isAuth,
        setIsAuth,
        user,
        verifyUser,
        loading,
        logoutHandler,
      }}
    >
      {children}
      {/* Consider moving <Toaster /> to App.jsx for global use */}
      <Toaster />
    </UserContext.Provider>
  );
};

export const UserData = () => useContext(UserContext);
