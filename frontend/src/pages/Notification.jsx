import React, { useContext, useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import axios from 'axios'
import profile_image from "../assets/profile_image.webp"
import { authDataContext } from '../context/AuthContext'
import { RxCross1 } from "react-icons/rx";

const Notification = () => {
  const { serverUrl } = useContext(authDataContext)
  const [notificationData, setNotificationData] = useState([])

  const handleGetNotification = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/notification/get`, {
        withCredentials: true
      })
      setNotificationData(result.data)
    } catch (error) {
      console.log(error)
    }
  }

  const handleDeleteNotification = async (id) => {
    try {
      await axios.delete(`${serverUrl}/api/notification/deleteone/${id}`, {
        withCredentials: true
      })
      handleGetNotification()
    } catch (error) {
      console.log(error)
    }
  }

  const handleClearAllNotification = async () => {
    try {
      await axios.delete(`${serverUrl}/api/notification`, {
        withCredentials: true
      })
      handleGetNotification()
    } catch (error) {
      console.log(error)
    }
  }

  const handleMessage = (type) => {
    if (type === "like") return "liked your post"
    if (type === "comment") return "commented on your post"
    return "accepted your connection"
  }

  useEffect(() => {
    handleGetNotification()
  }, [])

  return (
    <div className='w-full min-h-screen bg-[#f0efe7] pt-[100px] px-4 flex flex-col items-center gap-10'>
      <Navbar />

      {/* Top Header */}
      <div className='w-full max-w-2xl bg-white shadow-md rounded-lg p-4 flex justify-between items-center text-lg text-gray-700'>
        <span>Notifications ({notificationData.length})</span>
        {notificationData.length > 0 && (
          <button
            onClick={handleClearAllNotification}
            className='px-3 py-1.5 rounded-full border border-red-500 text-red-500 text-sm hover:bg-red-100 transition'
          >
            Clear All
          </button>
        )}
      </div>

      {/* Notification List */}
      {notificationData.length > 0 && (
        <div className='w-full max-w-2xl bg-white shadow-md rounded-lg p-4 flex flex-col gap-5 overflow-auto max-h-[70vh]'>
          {notificationData.map((noti, index) => (
            <div
              key={index}
              className='flex justify-between items-center border-b pb-3'
            >
              {/* Left Side: Profile + Message */}
              <div className='flex items-center gap-3'>
                {/* Profile Image */}
                <div className='w-10 h-10 rounded-full overflow-hidden'>
                  <img
                    src={noti.relatedUser?.profileImage || profile_image}
                    alt="Profile"
                    className='w-full h-full object-cover'
                  />
                </div>

                {/* Message */}
                <div className='text-sm text-gray-800'>
                  {noti.relatedUser
                    ? <span className='font-medium'>
                      {noti.relatedUser.firstName} {noti.relatedUser.lastName}
                    </span>
                    : <span className='font-medium'>A user</span>}
                  &nbsp;{handleMessage(noti.type)}
                </div>
              </div>

              {/* Right Side: Post Thumbnail + Delete */}
              <div className='flex items-center gap-3'>
                {/* Post Thumbnail (if available) */}
                {noti.relatedPost?.image && (
                  <div className='w-8 h-8 sm:w-10 sm:h-10 md:w-8 md:h-8 rounded-md overflow-hidden'>
                    <img
                      src={noti.relatedPost.image}
                      alt="Post"
                      className='w-full h-full object-cover'
                    />
                  </div>
                )}

                {/* Delete Icon */}
                <RxCross1
                  className='w-4 h-4 text-gray-600 cursor-pointer hover:text-red-500'
                  onClick={() => handleDeleteNotification(noti._id)}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Notification
