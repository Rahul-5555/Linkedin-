import React, { useContext, useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import profile_image from '../assets/profile_image.webp';
import { FiPlus } from "react-icons/fi";
import { IoCameraOutline } from "react-icons/io5";
import { HiPencil } from "react-icons/hi";
import EditProfile from '../components/EditProfile';
import Post from '../components/Post';
import ConnectionButton from '../components/ConnectionButton';
import { userDataContext } from '../context/UserContext';
// import { authDataContext } from '../context/AuthContext';

const Profile = () => {
  // const { serverUrl } = useContext(authDataContext);
  const {
    userData, setEdit, edit,
    postData, profileData
  } = useContext(userDataContext);

  const [profilePost, setProfilePost] = useState([]);

  // Filter user's posts
  useEffect(() => {
    setProfilePost(postData.filter(post => post.author?._id === profileData._id));
  }, [postData, profileData]);

  // at the top inside Profile component
  const isOwnProfile = userData && profileData && profileData._id === userData._id;


  const Section = ({ title, children, showAddButton, onAddClick }) => (
    <div className='w-full min-h-[100px] flex flex-col gap-[10px] p-4 sm:p-6 font-semibold bg-white shadow-lg rounded-lg'>
      <div className='text-[20px] sm:text-[22px] text-gray-600'>{title}</div>
      {children}
      {showAddButton && (
        <button
          className='text-[14px] sm:text-[16px] min-w-[120px] sm:min-w-[150px] h-[35px] sm:h-[40px] rounded-full border-2 border-[#2dc0ff] text-[#2dc0ff] flex items-center justify-center gap-[8px]'
          onClick={onAddClick}
        >
          Add {title}
        </button>
      )}
    </div>
  );

  return (
    <div className='w-full min-h-screen bg-[#f0efe7] flex flex-col items-center pt-[100px] pb-[40px]'>
      <Navbar />
      {edit && <EditProfile />}

      <div className='w-full max-w-[900px] flex flex-col gap-[10px]'>

        {/* Profile Card */}
        {/* Profile Card */}
        <div className='relative bg-white pb-[40px] rounded shadow-lg'>
          <div
            className='w-full h-[100px] bg-gray-400 rounded overflow-hidden flex items-center justify-center relative'
            onClick={() => isOwnProfile && setEdit(true)}
            style={{ cursor: isOwnProfile ? 'pointer' : 'default' }}
          >
            {profileData?.coverImage && <img src={profileData.coverImage} alt="cover" />}
            {isOwnProfile && (
              <IoCameraOutline className='absolute right-[20px] top-[10px] w-[25px] h-[25px] text-blue-500' />
            )}
          </div>

          <div
            className='w-[70px] h-[70px] rounded-full overflow-hidden flex items-center justify-center absolute top-[65px] left-[35px] border-2 border-white'
            onClick={() => isOwnProfile && setEdit(true)}
            style={{ cursor: isOwnProfile ? 'pointer' : 'default' }}
          >
            <img className='h-full' src={profileData?.profileImage || profile_image} alt="profile" />
          </div>

          {isOwnProfile && (
            <div className='w-[15px] h-[15px] rounded-full bg-[#17c1ff] flex items-center justify-center absolute top-[105px] left-[90px] cursor-pointer'>
              <FiPlus className='text-white' />
            </div>
          )}

          <div className='mt-[30px] pl-[20px] text-gray-600 font-semibold'>
            <div className='text-[22px]'>{`${profileData.firstName} ${profileData.lastName}`}</div>
            <div className='text-[18px]'>{profileData.headline}</div>
            <div className='text-[16px] text-gray-500'>{profileData.location}</div>
            <div className='text-[16px] text-blue-400'>{`${profileData.connection.length} Connections`}</div>
          </div>

          {isOwnProfile ? (
            <button
              className='min-w-[150px] h-[40px] my-[20px] rounded-full border-2 border-[#2dc0ff] ml-[20px] text-[#2dc0ff] flex items-center justify-center gap-[10px]'
              onClick={() => setEdit(true)}
            >
              Edit Profile <HiPencil />
            </button>
          ) : (
            <div className='ml-[20px] mt-[20px]'>
              <ConnectionButton userId={profileData._id} />
            </div>
          )}
        </div>


        {/* Posts */}
        <div className='w-full flex items-center p-[20px] text-[22px] text-gray-600 font-semibold bg-white shadow-lg rounded-lg'>
          {`Post (${profilePost.length})`}
        </div>

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

        {/* Skills */}
        {profileData.skills.length > 0 && (
          <Section
            title="Skills"
            showAddButton={isOwnProfile}
            onAddClick={() => setEdit(true)}
          >
            <div className='flex flex-wrap gap-3 text-gray-600'>
              {profileData.skills.map((skill, i) => (
                <div key={i} className='text-[16px] sm:text-[18px] bg-gray-100 px-3 py-1 rounded-full'>
                  {skill}
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* Education */}
        {profileData.education.length > 0 && (
          <Section
            title="Education"
            showAddButton={isOwnProfile}
            onAddClick={() => setEdit(true)}
          >
            <div className='flex flex-col gap-4 text-gray-600'>
              {profileData.education.map((edu, i) => (
                <div key={i} className='text-[16px] sm:text-[18px] bg-gray-50 p-3 rounded-lg shadow-sm'>
                  <div><strong>College:</strong> {edu.college}</div>
                  <div><strong>Degree:</strong> {edu.degree}</div>
                  <div><strong>Field of Study:</strong> {edu.fieldOfStudy}</div>
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* Experience */}
        {profileData.experience.length > 0 && (
          <Section
            title="Experience"
            showAddButton={isOwnProfile}
            onAddClick={() => setEdit(true)}
          >
            <div className='flex flex-col gap-4 text-gray-600'>
              {profileData.experience.map((ex, i) => (
                <div key={i} className='text-[16px] sm:text-[18px] bg-gray-50 p-3 rounded-lg shadow-sm'>
                  <div><strong>Title:</strong> {ex.title}</div>
                  <div><strong>Company:</strong> {ex.company}</div>
                  <div><strong>Description:</strong> {ex.description}</div>
                </div>
              ))}
            </div>
          </Section>
        )}

      </div>
    </div>
  );
};

export default Profile;
