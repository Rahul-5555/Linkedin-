// import React, { useContext, useEffect, useState } from 'react'
// import { authDataContext } from '../context/AuthContext'
// import axios from 'axios'
// import io from 'socket.io-client'
// import { userDataContext } from '../context/UserContext'
// import { useNavigate } from 'react-router-dom'
// const socket = io("http://localhost:8000")
// function ConnectionButton({ userId }) {
//   let { serverUrl } = useContext(authDataContext)
//   let { userData, setUserData } = useContext(userDataContext)
//   let [status, setStatus] = useState("")
//   let navigate = useNavigate()


//   const handleSendConnection = async () => {
//     try {
//       let result = await axios.post(`${serverUrl}/api/connection/send/${userId}`,
//         {}, { withCredentials: true }
//       )

//       console.log(result)
//     } catch (error) {
//       console.log(error)
//     }
//   }

//   const handleRemoveConnection = async () => {
//     try {
//       let result = await axios.delete(`${serverUrl}/api/connection/remove/${userId}`,

//         { withCredentials: true })
//       console.log(result)

//     } catch (error) {
//       console.log(error)
//     }
//   }

//   const handleGetStatus = async () => {
//     try {
//       let result = await axios.get(`${serverUrl}/api/connection/getstatus/${userId}`,
//         { withCredentials: true }
//       )
//       console.log(userId)
//       console.log(result)
//       setStatus(result.data.status)

//     } catch (error) {
//       console.log(error)
//     }
//   }


//   useEffect(() => {
//     socket.emit("register", userData._id)
//     handleGetStatus()

//     socket.on("statusUpdate", ({ updateUserId, newStatus }) => {
//       if (updateUserId == userId) {
//         setStatus(newStatus)
//       }
//     })

//     return () => {
//       socket.off("statusUpdate")
//     }
//   }, [userId])

//   const handleClick = async () => {
//     if (status == "disconnect") {
//       await handleRemoveConnection()
//     } else if (status == "received") {
//       navigate("/network")
//     } else {
//       await handleSendConnection()
//     }
//   }

//   return (
//     <button className='min-w-[100px] h-[40px] rounded-full border-2 border-[#2dc0ff] text-[#2dc0ff' onClick={handleClick}>
//       Connect
//     </button>
//   )
// }

// export default ConnectionButton;

import React, { useContext, useEffect, useState } from 'react';
import { authDataContext } from '../context/AuthContext';
import axios from 'axios';
import io from 'socket.io-client';
import { userDataContext } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';

const socket = io("http://localhost:8000");

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
    if (!userData?._id) return;

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
      className={`min-w-[100px] h-[40px] rounded-full border-2 ${status === "disconnect" ? 'border-red-500 text-red-500' : 'border-[#2dc0ff] text-[#2dc0ff]'
        }`}
      onClick={handleClick}
      disabled={loading || status === "pending"}
    >
      {getButtonText()}
    </button>
  );
}

export default ConnectionButton;
