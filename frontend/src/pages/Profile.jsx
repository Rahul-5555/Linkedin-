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
import Post from '../components/Post';
import ConnectionButton from '../components/ConnectionButton';

const Profile = () => {
  let { serverUrl } = useContext(authDataContext)
  let { userData, setUserData, edit, setEdit, postData, setPostData, profileData, setProfileData } = useContext(userDataContext)

  let [profilePost, setProfilePost] = useState([])


  // UseEffect for filter post ,only user post
  useEffect(() => {
    setProfilePost(postData.filter((post) =>
      post.author?._id === profileData._id))
  }, [profileData])

  return (
    <div className='w-full min-h-[100vh] bg-[#f0efe7] flex flex-col items-center pt-[100px] pb-[40px]'>
      <Navbar />
      {
        edit && <EditProfile />
      }

      <div className='w-full max-w-[900px] min-h-[100vh] flex flex-col gap-[10px]'>

        <div className='relative bg-[white] pb-[40px] rounded shadow-lg'>
          {/* div for cover image */}
          <div className='w-full h-[100px] bg-gray-400 rounded overflow-hidden flex items-center justify-center relative cursor-pointer' onClick={() => setEdit(true)}>
            <img src={profileData?.coverImage || null} alt="" />
            <IoCameraOutline className='absolute right-[20px] top-[10px] w-[25px] h-[25px] text-blue-500' />
          </div>
          {/* div for profile image */}
          <div className='w-[70px] h-[70px] rounded-full overflow-hidden flex items-center justify-center absolute top-[65px] left-[35px] border-2 border-white cursor-pointer' onClick={() => setEdit(true)}>
            <img className='h-full' src={profileData?.profileImage || profile_image} alt="profile" />
          </div>

          {/* div for + icon */}
          <div className='w-[15px] h-[15px] rounded-full bg-[#17c1ff] flex items-center justify-center absolute top-[105px] left-[90px] cursor-pointer'>
            <FiPlus className='text-white' />
          </div>
          {/* div for name */}
          <div className='mt-[30px] pl-[20px]  font-semibold text-gray-600'>
            <div className='text-[22px]'>{`${profileData.firstName} ${profileData.lastName}`}</div>
            <div className='text-[18px] font-semibold text-gray-600'>{profileData.headline || ""}</div>
            <div className='text-[16px] text-gray-500'>{profileData.location}</div>
            <div className='text-[16px] text-blue-400'>{`${profileData.connection.length}  Connections`}</div>
          </div>
          {
            profileData._id === userData._id &&
            <button className='min-w-[150px] h-[40px] my-[20px] rounded-full border-2 border-[#2dc0ff] ml-[20px] text-[#2dc0ff flex items-center justify-center gap-[10px]' onClick={() => setEdit(true)}>
              Edit Profile
              <HiPencil />
            </button>
          }
          {
            profileData._id !== userData._id &&
            <div className='ml-[20px] mt-[20px]'>
              <ConnectionButton userId={profileData._id} />
            </div>
          }


        </div>

        {/* div for user post */}
        <div className='w-full min-h-[100px] flex items-center p-[20px] text-[22px] text-gray-600 font-semibold bg-white shadow-lg rounded-lg'>
          {`Post (${profilePost.length})`}
        </div>

        {/* showing profile post */}
        {profilePost.map((post, index) => (
          <Post
            key={index}
            id={post._id}
            description={post.description}
            author={post.author}
            image={post.image}
            likes={post.likes}
            comment={post.comments}
            createdAt={post.createdAt}
          />
        ))}


        {/* div for skills */}
        {profileData.skills.length > 0 &&
          <div className='w-full min-h-[100px] flex flex-col gap-[10px] justify-center p-[20px] font-semibold bg-white shadow-lg rounded-lg '>
            <div className='text-[22px] text-gray-600'>
              Skills
            </div>
            <div className='flex flex-wrap justify-start items-center gap-[10px] text-gray-600 p-[20px]'>
              {profileData.skills.map((skill, index) => (
                <div key={index} className='text-[18px]'>{skill}</div>
              ))}
              {profileData._id === userData._id &&
                <button className='min-w-[150px] h-[40px] rounded-full border-2 border-[#2dc0ff] ml-[20px] text-[#2dc0ff flex items-center justify-center gap-[10px]' onClick={() => setEdit(true)}>Add Skills</button>
              }

            </div>
          </div>
        }

        {/* div for education */}
        {profileData.education.length > 0 &&
          <div className='w-full min-h-[100px] flex flex-col gap-[10px] justify-center p-[20px] font-semibold bg-white shadow-lg rounded-lg '>
            <div className='text-[22px] text-gray-600'>
              Education
            </div>
            <div className='flex flex-col justify-start items-start gap-[10px] text-gray-600 p-[20px]'>
              {profileData.education.map((edu) => (
                <>
                  <div className='text-[18px]'>College: {edu.college}</div>
                  <div className='text-[18px]'>Degree: {edu.degree}</div>
                  <div className='text-[18px]'>Field of study: {edu.fieldOfStudy}</div>
                </>
              ))}
              {profileData._id === userData._id &&
                <button className='min-w-[150px] h-[40px] rounded-full border-2 border-[#2dc0ff] ml-[20px] text-[#2dc0ff flex items-center justify-center gap-[10px]' onClick={() => setEdit(true)}>
                  Add Education
                </button>
              }

            </div>
          </div>
        }

        {/* div for experience  experience */}
        {profileData.experience.length > 0 &&
          <div className='w-full min-h-[100px] flex flex-col gap-[10px] justify-center p-[20px] font-semibold bg-white shadow-lg rounded-lg '>
            <div className='text-[22px] text-gray-600'>
              Experience
            </div>
            <div className='flex flex-col justify-start items-start gap-[10px] text-gray-600 p-[20px]'>
              {profileData.experience.map((ex, index) => (
                <div key={index} className='flex flex-col gap-1'>
                  <div className='text-[18px]'>Title: {ex.title}</div>
                  <div className='text-[18px]'>Company: {ex.company}</div>
                  <div className='text-[18px]'>Description: {ex.description}</div>
                </div>
              ))}
              {
                profileData._id === userData._id && <button className='min-w-[150px] h-[40px] rounded-full border-2 border-[#2dc0ff] ml-[20px] text-[#2dc0ff flex items-center justify-center gap-[10px]' onClick={() => setEdit(true)}>
                  Add Experience
                </button>
              }

            </div>
          </div>
        }

      </div>
    </div>
  )
}

export default Profile