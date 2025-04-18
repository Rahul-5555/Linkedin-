import React, { useContext, useEffect, useState } from 'react';
import { authDataContext } from '../context/AuthContext';
import axios from 'axios';
import socket from '../utils/socket';
import { userDataContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';

function ConnectionButton({ userId }) {
  const { serverUrl } = useContext(authDataContext);
  const { userData } = useContext(userDataContext);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const handleSendConnection = async () => {
    try {
      const result = await axios.post(`${serverUrl}/api/connection/send/${userId}`, {}, { withCredentials: true });
      console.log(result);
    } catch (error) {
      console.log(error);
    }
  };

  const handleRemoveConnection = async () => {
    try {
      const result = await axios.delete(`${serverUrl}/api/connection/remove/${userId}`, { withCredentials: true });
      console.log(result);
    } catch (error) {
      console.log(error);
    }
  };

  const handleGetStatus = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/connection/getstatus/${userId}`, { withCredentials: true });
      setStatus(result.data.status);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!userData?._id || !userId) return;

    if (!socket.connected) {
      socket.connect();
    }

    socket.emit("register", userData._id);
    handleGetStatus();

    const handleStatusUpdate = ({ updateUserId, newStatus }) => {
      if (updateUserId === userId) {
        setStatus(newStatus);
      }
    };

    socket.on("statusUpdate", handleStatusUpdate);

    return () => {
      socket.off("statusUpdate", handleStatusUpdate);
    };
  }, [userId, userData]);

  const handleClick = async () => {
    if (status === "disconnect") {
      await handleRemoveConnection();
    } else if (status === "received") {
      navigate("/network");
    } else {
      await handleSendConnection();
    }
  };

  const getButtonText = () => {
    switch (status) {
      case "connect":
        return "Follow";
      case "pending":
        return "Pending...";
      case "received":
        return "Received";
      case "disconnect":
        return "Unfollow";
      default:
        return "Loading...";
    }
  };

  return (
    <button
      className={`px-4 py-2 md:px-5 md:py-2.5 text-[12px] md:text-base font-semibold rounded-full si transition-colors duration-300 
      ${status === "disconnect"
          ? 'border-[#2dc0ff] text-[#2dc0ff] hover:bg-[#e6f8ff]'
          : 'border-[#2dc0ff] text-[#2dc0ff] hover:bg-[#e6f8ff]'}
      border disabled:opacity-50 disabled:cursor-not-allowed`}
      onClick={handleClick}
      disabled={loading || status === "pending"}
    >
      {getButtonText()}
    </button>
  );
}

export default ConnectionButton;
