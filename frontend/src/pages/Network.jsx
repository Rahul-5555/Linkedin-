import React, { useContext, useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import axios from 'axios'
import { authDataContext } from '../context/AuthContext'
import profile_image from "../assets/profile_image.webp"
import { MdOutlineCheckCircle } from "react-icons/md";
import { RxCrossCircled } from "react-icons/rx";

const Network = () => {
  let { serverUrl } = useContext(authDataContext)
  let [connections, setConnections] = useState([])
  
  const handleGetRequests = async () => {
    try {
      let result = await axios.get(`${serverUrl}/api/connection/requests`, {
        withCredentials: true
      })
      setConnections(result.data)
    } catch (error) {
      console.log(error)
    }
  }

  const handleAcceptConnection = async (requestId) => {
    try {
      let result = await axios.put(`${serverUrl}/api/connection/accept/${requestId}`, {},
        { withCredentials: true }
      )
      setConnections(connections.filter((con) => con._id !== requestId))
      console.log(result)
    } catch (error) {
      console.log(error)
    }
  }

  const handleRejectConnection = async (requestId) => {
    try {
      let result = await axios.put(`${serverUrl}/api/connection/reject/${requestId}`, {},
        { withCredentials: true }
      )
      setConnections(connections.filter((con) => con._id == requestId))
    } catch (error) {
      console.log(error)
    }
  }



  useEffect(() => {
    handleGetRequests()
  }, [])

  return (
    <div className='w-screen h-[100vh] bg-[#f0efe7] pt-[100px] px-[20px] flex flex-col items-center gap-[40px]'>
      <Navbar />
      <div className='w-full h-[70px] bg-[white] shadow-lg rounded-lg flex items-center p-[10px] text-[20px] sm:text-[18px] text-gray-600'>
        Invitations {connections.length}
      </div>

      {
        connections.length > 0 && <div className='w-[100%] max-w-[900px] bg-white shadow-lg rounded-lg flex flex-col gap-[20px] min-h-[100px]'>
          {connections.map((connection, index) => (
            <div className='w-full min-h-[100px] p-[20px] flex justify-between items-center'>
              {/* Left div for profile */}
              <div className='flex justify-center items-center gap-[10px]'>
                <div className='w-[40px] h-[40px] sm:w-[50px] sm:h-[50px] md:w-[60px] md:h-[60px] rounded-full overflow-hidden cursor-pointer'>
                  <img src={connection.sender?.profileImage || profile_image} alt="" className='w-full h-full' />
                </div>
                {/* div for name */}
                <div className='text-[14px] sm:text-[20px] font-semibold text-gray-700'>
                  {`${connection.sender.firstName} ${connection.sender.lastName} `}
                </div>

              </div>
              {/* right div for button*/}
              <div className='flex justify-center items-center gap-[10px]'>
                <button className='text-[#18c5ff] font-semibold' onClick={() => handleAcceptConnection(connection._id)}>
                  <MdOutlineCheckCircle className='w-[30px] h-[30px] sm:w-[40px] sm:h-[40px] ' />
                </button>
                <button className='text-[#d65555] font-semibold' onClick={() => handleRejectConnection(connection._id)}>
                  <RxCrossCircled className='w-[30px] h-[30px] sm:w-[40px] sm:h-[40px] ' />
                </button>
              </div>
            </div>
          ))}
        </div>
      }


    </div>
  )
}

export default Network
