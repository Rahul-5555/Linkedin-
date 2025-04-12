import React, { useContext, useState } from 'react'
import logo2 from '../assets/logo2.png'
import { FaSearch } from "react-icons/fa";
import { IoIosHome } from "react-icons/io";
import { FaUserFriends } from "react-icons/fa";
import { MdNotifications } from "react-icons/md";
import profile_image from '../assets/profile_image.webp'
import { userDataContext } from '../context/UserContext';
import { authDataContext } from '../context/AuthContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const Navbar = () => {
  let [activeSearch, setActiveSearch] = useState(false)
  let { userData, setUserData } = useContext(userDataContext)
  let [showPopup, setShowPopup] = useState(false)
  let navigate = useNavigate()
  let { serverUrl } = useContext(authDataContext)

  const handleSignOut = async () => {
    try {
      let result = await axios.get(serverUrl + "/api/auth/logout", {
        withCredentials: true
      })
      setUserData(null)
      navigate("/login")
      console.log(result)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className='w-full h-[80px] bg-[white] fixed top-0 shadow-lg flex justify-between md:justify-around items-center px-[10px] left-0 z-[80]'>
      <div className='flex justify-center items-center gap-[10px]'>
        <div onClick={() => {
          setActiveSearch(false)
          navigate("/")
        }}>
          <img className='w-[50px]' src={logo2} alt="" />
        </div>

        {!activeSearch && <div><FaSearch className='w-[25px] h-[23px] text-gray-600 lg:hidden' onClick={() => setActiveSearch(true)} /></div>}

        <form className={`w-[190px] lg:w-[350px] h-[40px] bg-[#f0efe7] lg:flex items-center gap-[10px] px-[10px] py-[5px] rounded-md ${!activeSearch ? "hidden" : "flex"}`}>
          <div><FaSearch className='w-[25px] h-[23px] text-gray-600' /></div>
          <input className='w-[80%] h-full bg-transparent outline-none border-0' placeholder='search user...' type="text" />
        </form>
      </div>

      {/* // right side of the navbar */}
      <div className='flex justify-center items-center gap-[20px] relative'>

        {
          showPopup && <div className='w-[300px] min-h-[300px] bg-white shadow-lg absolute top-[75px] rounded-lg flex flex-col items-center p-[20px] gap-[20px]'>
            <div className='w-[70px] h-[70px] rounded-full overflow-hidden'>
              <img className='w-full h-full' src={userData.profileImage || profile_image} alt="" />
            </div>
            <div className='text-[20px] font-semibold text-gray-700'>
              {`${userData.firstName} ${userData.lastName} `}
            </div>
            <button className='w-[100%] h-[40px] rounded-full border-2 border-[#2dc0ff] text-[#2dc0ff' onClick={() => navigate("/profile")}>
              View Profile
            </button>
            <div className='w-full h-[1px] bg-gray-700'></div>

            <div className='flex w-full items-center justify-start text-gray-600 gap-[10px] cursor-pointer' onClick={() => navigate("/network")}>
              <FaUserFriends className='w-[23px] h-[23px] text-gray-600' />
              <div>My Networks</div>
            </div>
            <button className='w-[100%] h-[40px] rounded-full border-2 border-[#ec4545] text-[#ec4545' onClick={handleSignOut}>
              Sign Out
            </button>
          </div>
        }


        <div className='lg:flex flex-col items-center justify-center text-gray-600 hidden'>
          <IoIosHome className='w-[23px] h-[23px] text-gray-600' />
          <div>Home</div>
        </div>

        <div className='md:flex flex-col items-center justify-center text-gray-600 hidden cursor-pointer' onClick={() => navigate("/network")}>
          <FaUserFriends className='w-[23px] h-[23px] text-gray-600' />
          <div>My Networks</div>
        </div>

        <div className='flex flex-col items-center justify-center text-gray-600'>
          <MdNotifications className='w-[23px] h-[23px] text-gray-600' />
          <div className='hidden md:block'>Notifications</div>
        </div>
        <div className='w-[50px] h-[50px] rounded-full overflow-hidden cursor-pointer' onClick={() => setShowPopup(prev => !prev)}>
          <img src={userData.profileImage || profile_image} alt="" />
        </div>
      </div>
    </div>
  )
}

export default Navbar