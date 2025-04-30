import React, { useContext, useEffect, useState } from 'react'
import logo3 from '../assets/logo3.png'
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
  let { userData, setUserData, handleGetProfile } = useContext(userDataContext)
  let [showPopup, setShowPopup] = useState(false)
  let navigate = useNavigate()
  let { serverUrl } = useContext(authDataContext)
  let [searchInput, setSearchInput] = useState("")
  let [searchData, setSearchData] = useState([])

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

  const handleSearch = async () => {
    if (!searchInput.trim()) {
      setSearchData([]);
      return;
    }
    try {
      let result = await axios.get(`${serverUrl}/api/user/search?query=${searchInput}`, {
        withCredentials: true
      })
      setSearchData(result.data)
    } catch (error) {
      setSearchData([])
      console.log(error)
    }
  }

  useEffect(() => {
    handleSearch()
  }, [searchInput])

  return (
    <div className='w-full h-[80px] bg-[white] fixed top-0 shadow-lg flex justify-between sm:justify-around items-center px-[10px] left-0 z-[50] '>
      <div className='flex justify-center items-center gap-[10px] md:gap-[20px]  '>
        <div onClick={() => {
          setActiveSearch(false)
          navigate("/")
        }}>
          <img className='mix-blend-multiply bg-[white] w-[90px] ' src={logo3} alt="" />
        </div>

        {!activeSearch && (
          <div className='block sm:hidden'>
            <FaSearch className='w-[20px] h-[20px] text-gray-600' onClick={() => setActiveSearch(true)} />
          </div>
        )}

        {searchData.length > 0 && <div className='absolute top-[90px] h-[500px] left-[0px] lg:left-[20px] shadow-lg w-[100%] lg:w-[700px] bg-white flex flex-col gap-[20px] p-[20px] overflow-auto'>
          {searchData.map((sea, index) => (
            <div key={index} className='flex gap-[20px] items-center border-b-2 border-b-gray-300 p-[10px] hover:bg-gray-200 cursor-pointer rounded-lg' onClick={() => handleGetProfile(sea.userName)}>
              <div className='w-[70px] h-[70px] rounded-full overflow-hidden'>
                <img className='w-full h-full' src={sea?.profileImage || profile_image} alt="" />
              </div>
              <div>
                <div className='text-[20px] font-semibold text-gray-700'>
                  {`${sea.firstName} ${sea.lastName} `}
                </div>
                <div className='text-[14px] font-semibold text-gray-700'>
                  {sea.headline}
                </div>
              </div>
            </div>
          ))}
        </div>}

        <form className={`w-[160px] sm:w-[200px] md:w-[250px] lg:w-[350px] h-[36px] sm:h-[38px] md:h-[40px] bg-[#f0efe7] lg:flex items-center gap-[8px] px-[10px] py-[5px] rounded-md ${!activeSearch ? "hidden" : "flex"}`}>
          <div><FaSearch className='w-[18px] h-[18px] text-gray-600' /></div>
          <input className='w-[80%] h-full bg-transparent outline-none border-0 text-sm' placeholder='search user...' type="text" value={searchInput} onChange={(e) => setSearchInput(e.target.value)} />
        </form>
      </div>

      <div className='flex justify-center items-center gap-[15px] sm:gap-[20px]'>
        {/* Popup */}
        {showPopup && (
          <div className='w-[150px] sm:w-[290px] min-h-[200px] bg-white shadow-lg absolute top-[75px] rounded-lg flex flex-col items-center p-[15px] sm:p-[18px] gap-[13px] right-[2px] lg:right-[50px]'>
            {/* Profile Image */}
            <div className='w-[50px] sm:w-[40px] h-[50px] sm:h-[40px] rounded-full overflow-hidden'>
              <img className='w-full h-full object-cover' src={userData.profileImage || profile_image} alt="Profile" />
            </div>

            {/* Name */}
            <div className='text-[10px] sm:text-[14px] font-semibold text-gray-700'>
              {`${userData.firstName} ${userData.lastName}`}
            </div>

            {/* View Profile Button */}
            <button className='w-[50%] h-[35px] sm:h-[40px] rounded-full border-2 border-[#2dc0ff] text-[#2dc0ff] text-[10px] sm:text-[12px]' onClick={() => handleGetProfile(userData.userName)}>
              View Profile
            </button>

            <div className='w-full h-[1px] bg-gray-700'></div>

            {/* My Networks */}
            <div className='flex w-full items-center justify-start text-gray-600 gap-[8px] sm:gap-[10px] cursor-pointer' onClick={() => navigate("/network")}>
              <FaUserFriends className='w-[16px] sm:w-[18px] md:w-[20px] h-[16px] sm:h-[18px] md:h-[20px]' />
              <div className='text-[12px] sm:text-[14px]'>My Networks</div>
            </div>

            {/* Sign Out Button */}
            <button className='w-[100%] h-[35px] sm:h-[40px] rounded-full border-2 border-[#ec4545] text-[#ec4545] text-[14px] sm:text-[16px]' onClick={handleSignOut}>
              Sign Out
            </button>
          </div>
        )}

        {/* Home Icon (hidden on smaller screens) */}
        <div className='lg:flex flex-col items-center justify-center text-gray-600 hidden'>
          <IoIosHome className='w-[20px] sm:w-[22px] md:w-[23px] h-[20px] sm:h-[22px] md:h-[23px]' />
          <div>Home</div>
        </div>

        {/* My Networks (visible from md and up) */}
        <div className='md:flex flex-col items-center justify-center text-gray-600 hidden cursor-pointer' onClick={() => navigate("/network")}>
          <FaUserFriends className='w-[20px] sm:w-[22px] md:w-[23px] h-[20px] sm:h-[22px] md:h-[23px]' />
          <div>My Networks</div>
        </div>

        {/* Notifications Icon */}
        <div className='flex flex-col items-center justify-center text-gray-600'>
          <MdNotifications className='w-[20px] sm:w-[22px] md:w-[23px] h-[20px] sm:h-[22px] md:h-[23px] cursor-pointer' onClick={() => navigate("/notification")} />
          <div className='hidden md:block'>Notifications</div>
        </div>

        {/* Profile Image for Toggling Popup */}
        <div className='w-[40px] sm:w-[45px] md:w-[50px] h-[40px] sm:h-[45px] md:h-[50px] rounded-full overflow-hidden cursor-pointer' onClick={() => setShowPopup(prev => !prev)}>
          <img className='w-full h-full object-cover' src={userData?.profileImage || profile_image} alt="Profile" />
        </div>
      </div>

    </div>
  )
}

export default Navbar;
