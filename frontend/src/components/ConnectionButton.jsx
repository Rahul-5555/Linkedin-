import React, { useContext, useEffect, useState } from 'react';
import { authDataContext } from '../context/AuthContext';
import axios from 'axios';
import socket from '../utils/socket';   // ✅ imported centralized socket instance
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
    if (!userData?._id || !userId) return;  // ✅ check both userData._id and userId

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
        return "Connect";
      case "pending":
        return "Pending...";
      case "received":
        return "Received";
      case "disconnect":
        return "Disconnect";
      default:
        return "Loading...";
    }
  };

  return (
    <button
      className={`min-w-[100px] h-[40px] rounded-full border-2 ${status === "disconnect" ? 'border-red-500 text-red-500' : 'border-[#2dc0ff] text-[#2dc0ff]'} `}
      onClick={handleClick}
      disabled={loading || status === "pending"}
    >
      {getButtonText()}
    </button>
  );
}

export default ConnectionButton;
