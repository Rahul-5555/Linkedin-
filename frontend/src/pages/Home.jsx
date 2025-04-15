import React, { useContext, useEffect, useRef, useState } from 'react'
import Navbar from '../components/Navbar'
import profile_image from '../assets/profile_image.webp'
import { FiPlus } from "react-icons/fi";
import { IoCameraOutline } from "react-icons/io5";
import { userDataContext } from '../context/UserContext';
import { HiPencil } from "react-icons/hi";
import EditProfile from '../components/EditProfile';
import { RxCross1 } from "react-icons/rx";
import { FaImage } from "react-icons/fa6";
import { authDataContext } from '../context/AuthContext';
import axios from 'axios';
import Post from '../components/Post';


const Home = () => {
  let { userData, setUserData, edit, setEdit, postData, setPostData, getPost, handleGetProfile } = useContext(userDataContext)
  let { serverUrl } = useContext(authDataContext)
  let [frontendImage, setFrontendImage] = useState('')
  let [backendImage, setBackendImage] = useState('')
  let [description, setDescription] = useState('')
  let [uploadPost, setUploadPost] = useState(false)
  let [posting, setPosting] = useState(false)
  let [suggestedUser, setSuggestedUser] = useState([])
  let image = useRef()

  function handleImage(e) {
    let file = e.target.files[0]
    setBackendImage(file)
    setFrontendImage(URL.createObjectURL(file))
  }

  async function handleUploadPost() {
    setPosting(true)
    try {
      let formdata = new FormData()
      formdata.append("description", description)
      if (backendImage) {
        formdata.append("image", backendImage)
      }
      let result = await axios.post(serverUrl + "/api/post/create", formdata, { withCredentials: true })
      console.log(result)
      setPosting(false)
      setUploadPost(false)
      getPost()
    } catch (error) {
      setPosting(false)
      console.log(error)
    }
  }

  const handleSuggestedUsers = async () => {
    try {
      let result = await axios.get(serverUrl + "/api/user/suggestedusers", {
        withCredentials: true
      })
      console.log(result.data)
      setSuggestedUser(result.data)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    handleSuggestedUsers()
  }, [])

  // useEffect(()=>{
  //   getPost()
  // },[uploadPost])

  return (
    <div className='w-full min-h-[100vh] bg-[#f0efe7] pt-[100px] flex items-center lg:items-start lg:justify-center gap-[20px] px-[20px] flex-col lg:flex-row relative pb-[50px]'>
      {
        edit && <EditProfile />
      }

      <Navbar />
      {/* left div */}
      <div className='w-full lg:w-[25%] min-h-[200px] bg-white shadow-lg rounded-lg p-[10px] relative '>
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
        </div>
        <button className='w-[100%] h-[40px] my-[20px] rounded-full border-2 border-[#2dc0ff] text-[#2dc0ff flex items-center justify-center gap-[10px]' onClick={() => setEdit(true)}>
          Edit Profile
          <HiPencil />
        </button>
      </div>

      {uploadPost && <div className='w-full h-full bg-black fixed top-0 z-[100] left-0 opacity-[0.6]'>
      </div>}


      {uploadPost && (
        // Div for uploading a post
        <div className='w-[90%] max-w-[500px] h-[600px] bg-white shadow-lg rounded-lg fixed z-[200] p-[20px] flex flex-col items-start justify-start gap-[20px]'>

          {/* Close Button */}
          <div className='absolute top-[20px] right-[20px] cursor-pointer'>
            <RxCross1 className='w-[25px] h-[25px] text-gray-800 font-bold' onClick={() => setUploadPost(false)} />
          </div>

          {/* Profile Section */}
          <div className='flex items-center gap-[10px]'>
            <div className='w-[70px] h-[70px] rounded-full overflow-hidden flex items-center justify-center border-2 border-white cursor-pointer'>
              <img className='h-full' src={userData.profileImage || profile_image} alt="profile" />
            </div>
            <div className='text-[22px]'>{`${userData.firstName} ${userData.lastName}`}</div>
          </div>

          {/* Textarea */}
          <textarea
            className={`w-full ${frontendImage ? "h-[200px]" : "h-[550px]"} outline-none border-none p-[10px] resize-none text-[19px]`}
            placeholder='What do you want to talk about...?'
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          {/* Hidden file input */}
          <input type="file" ref={image} hidden onChange={handleImage} />

          {/* Image preview */}
          {frontendImage && (
            <div className='w-full h-[300px] overflow-hidden flex justify-center items-center rounded-lg'>
              <img className='h-full rounded-lg' src={frontendImage} alt="preview" />
            </div>
          )}

          {/* Footer controls */}
          <div className='w-full flex flex-col'>
            <div className='p-[20px] flex items-center justify-start border-b-2 border-gray-500'>
              <FaImage
                className='w-[24px] h-[24px] text-gray-500 cursor-pointer'
                onClick={() => image.current.click()}
              />
            </div>

            <div className='flex justify-end items-center'>
              <button className='w-[100px] h-[50px] rounded-full bg-blue-500 mt-[30px] text-white' disabled={posting} onClick={handleUploadPost}>
                {posting ? "posting..." : "Post"}
                Post
              </button>
            </div>
          </div>
        </div>
      )}

      {/* middle div for post */}
      <div className='w-full lg:w-[50%] min-h-[200px] bg-[#f0efe7] shadow-lg flex flex-col gap-[20px]'>
        <div className='w-full h-[120px] bg-white shadow-lg rounded-lg flex items-center justify-center gap-[10px] p-[20px]'>
          {/* div for profile image */}
          <div className='w-[70px] h-[70px] rounded-full overflow-hidden flex items-center justify-center border-2 border-white cursor-pointer'>
            <img className='h-full' src={userData.profileImage || profile_image} alt="profile" />
          </div>
          <button className='w-[80%] h-[60px] border-2 border-gray-500 rounded-full flex items-center justify-start px-[20px] hover:bg-gray-200' onClick={() => setUploadPost(true)}>start a post</button>
        </div>

        {/* {postData.map((post, index) => (
          <Post key={index} id={post._id} description={post.description} author={post.author} image={post.image} likes={post.likes} comment={post.comments} createdAt={post.createdAt} />
        ))} */}
        {Array.isArray(postData) && postData.length > 0 ? (
          postData.map((post, index) => (
            post && (
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
            )
          ))
        ) : (
          <div className='text-center text-gray-500 mt-4'>No posts to display.</div>
        )}



      </div>
      {/* right div */}
      <div className='w-full lg:w-[25%] min-h-[200px] bg-white shadow-lg hidden lg:flex flex-col p-[20px]'>
        <h1 className='text-[20px] text-gray-600 font-semibold'>Suggested Users</h1>
        {
          suggestedUser.length > 0 && (
            <div className='flex flex-col gap-[10px] mt-[10px]' >
              {suggestedUser.map((su) => (
                <div key={su._id} className='flex gap-[10px] items-center border-b p-[5px] rounded-lg hover:bg-gray-100 cursor-pointer' onClick={() => handleGetProfile(su.userName)}>
                  <div className='w-[40px] h-[40px] rounded-full overflow-hidden'>
                    <img className='w-full h-full object-cover' src={su.profileImage || profile_image} alt="" />
                  </div>
                  <div>
                    <div className='text-[20px] font-semibold text-gray-700'>
                      {`${su.firstName} ${su.lastName}`}
                    </div>
                    <div className='text-[12px] font-semibold text-gray-600'>
                      {su.headline}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        }


        {
          suggestedUser.length === 0 && <div>

          </div>
        }
      </div>
    </div>
  )
}

export default Home