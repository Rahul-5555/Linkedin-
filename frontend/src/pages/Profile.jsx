import React, { useContext, useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import profile_image from '../assets/profile_image.webp'
import { FiPlus } from "react-icons/fi";
import { IoCameraOutline } from "react-icons/io5";
import { userDataContext } from '../context/UserContext';
import { HiPencil } from "react-icons/hi";
import EditProfile from '../components/EditProfile';
import axios from 'axios';
import { authDataContext } from '../context/AuthContext';

const Profile = () => {
  let { serverUrl } = useContext(authDataContext)
  let { userData, setUserData, edit, setEdit } = useContext(userDataContext)

  let [userConnection, setUserConnection] = useState([])

  const handleGetUserConnection = async () => {
    try {
      let result = await axios.get(`${serverUrl}/api/connection`, { withCredentials: true })
      setUserConnection(result.data)
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(() => {
    handleGetUserConnection()
  })

  return (
    <div className='w-full min-h-[100vh] bg-[#f0efe7] flex flex-col items-center pt-[100px]'>
      <Navbar />
      {
        edit && <EditProfile />
      }

      <div className='w-full max-w-[900px] min-h-[100vh]'>

        <div className='relative bg-[white] pb-[40px] rounded shadow-lg'>
          {/* div for cover image */}
          <div className='w-full h-[100px] bg-gray-400 rounded overflow-hidden flex items-center justify-center relative cursor-pointer' onClick={() => setEdit(true)}>
            <img src={userData.coverImage || null} alt="" />
            <IoCameraOutline className='absolute right-[20px] top-[10px] w-[25px] h-[25px] text-blue-500' />
          </div>
          {/* div for profile image */}
          <div className='w-[70px] h-[70px] rounded-full overflow-hidden flex items-center justify-center absolute top-[65px] left-[35px] border-2 border-white cursor-pointer' onClick={() => setEdit(true)}>
            <img className='h-full' src={userData.profileImage || profile_image} alt="profile" />
          </div>

          {/* div for + icon */}
          <div className='w-[15px] h-[15px] rounded-full bg-[#17c1ff] flex items-center justify-center absolute top-[105px] left-[90px] cursor-pointer'>
            <FiPlus className='text-white' />
          </div>
          {/* div for name */}
          <div className='mt-[30px] pl-[20px]  font-semibold text-gray-600'>
            <div className='text-[22px]'>{`${userData.firstName} ${userData.lastName}`}</div>
            <div className='text-[18px] font-semibold text-gray-600'>{userData.headline || ""}</div>
            <div className='text-[16px] text-gray-500'>{userData.location}</div>
            <div className='text-[16px] text-blue-400'>{`${userConnection.length}  Connections`}</div>
          </div>
          <button className='min-w-[150px] h-[40px] my-[20px] rounded-full border-2 border-[#2dc0ff] ml-[20px] text-[#2dc0ff flex items-center justify-center gap-[10px]' onClick={() => setEdit(true)}>
            Edit Profile
            <HiPencil />
          </button>
        </div>
      </div>

    </div>
  )
}

export default Profile