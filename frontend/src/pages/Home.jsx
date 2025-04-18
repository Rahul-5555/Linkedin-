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
  const {
    userData,
    edit,
    setEdit,
    postData,
    getPost,
    handleGetProfile
  } = useContext(userDataContext);

  const { serverUrl } = useContext(authDataContext);

  const [frontendImage, setFrontendImage] = useState('');
  const [backendImage, setBackendImage] = useState('');
  const [description, setDescription] = useState('');
  const [uploadPost, setUploadPost] = useState(false);
  const [posting, setPosting] = useState(false);
  const [suggestedUser, setSuggestedUser] = useState([]);

  const imageRef = useRef();

  const handleImage = (e) => {
    const file = e.target.files[0];
    setBackendImage(file);
    setFrontendImage(URL.createObjectURL(file));
  };

  const handleUploadPost = async () => {
    if (!description.trim() && !backendImage) return;
    setPosting(true);
    try {
      const formData = new FormData();
      formData.append("description", description);
      if (backendImage) {
        formData.append("image", backendImage);
      }

      await axios.post(`${serverUrl}/api/post/create`, formData, { withCredentials: true });
      setPosting(false);
      setUploadPost(false);
      setDescription('');
      setFrontendImage('');
      setBackendImage('');
      getPost();
    } catch (error) {
      console.error(error);
      setPosting(false);
    }
  };

  const fetchSuggestedUsers = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/user/suggestedusers`, { withCredentials: true });
      setSuggestedUser(result.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchSuggestedUsers();
  }, []);

  return (
    <div className="w-full min-h-[100vh] bg-[#f0efe7] pt-[100px] flex items-center lg:items-start lg:justify-center gap-[20px] px-[20px] flex-col lg:flex-row relative pb-[50px]">
      <Navbar />

      {uploadPost && <div className="fixed inset-0 bg-black opacity-60 z-[100]" />}

      {/* Edit Profile Modal */}
      {edit && <EditProfile />}

      {/* Left Section */}
      <div className="w-full lg:w-[25%] bg-white shadow-lg rounded-lg p-[10px] relative">
        {/* Cover Image */}
        <div className="w-full h-[100px] bg-gray-400 rounded overflow-hidden flex items-center justify-center relative cursor-pointer" onClick={() => setEdit(true)}>
          {userData?.coverImage && <img src={userData.coverImage} alt="cover" />}
          <IoCameraOutline className="absolute right-5 top-2.5 w-6 h-6 text-blue-500" />
        </div>

        {/* Profile Image */}
        <div className="w-[70px] h-[70px] rounded-full overflow-hidden flex items-center justify-center absolute top-[65px] left-[35px] border-2 border-white cursor-pointer" onClick={() => setEdit(true)}>
          <img className="h-full" src={userData?.profileImage || profile_image} alt="profile" />
        </div>

        {/* Plus Icon */}
        <div className="w-4 h-4 rounded-full bg-[#17c1ff] flex items-center justify-center absolute top-[105px] left-[90px] cursor-pointer">
          <FiPlus className="text-white text-sm" />
        </div>

        {/* Name */}
        <div className="mt-8 pl-5 font-semibold text-gray-600">
          <div className="text-xl">{`${userData.firstName || ''} ${userData.lastName || ''}`}</div>
          <div className="text-[17px] font-semibold text-gray-600">{userData.headline || ""}</div>
          <div className="text-[15px] text-gray-500">{userData.location || ""}</div>
        </div>

        <button className="w-full h-10 my-5 rounded-full border-2 border-[#2dc0ff] text-[#2dc0ff] flex items-center justify-center gap-2" onClick={() => setEdit(true)}>
          Edit Profile <HiPencil />
        </button>
      </div>

      {/* Upload Post Modal */}
      {uploadPost && (
        <div className="w-full max-w-[500px] h-[500px] bg-white shadow-lg rounded-lg fixed z-[200] p-5 flex flex-col gap-5">
          <RxCross1 className="absolute top-5 right-5 w-6 h-6 text-gray-800 cursor-pointer" onClick={() => setUploadPost(false)} />

          <div className="flex items-center gap-3">
            <div className="w-[70px] h-[70px] rounded-full overflow-hidden border-2 border-white">
              <img className="h-full" src={userData?.profileImage || profile_image} alt="profile" />
            </div>
            <div className="text-lg font-semibold">{`${userData.firstName || ''} ${userData.lastName || ''}`}</div>
          </div>

          <textarea
            className="w-full h-[200px] outline-none border-none p-3 resize-none text-[18px]"
            placeholder="What do you want to talk about...?"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <input type="file" ref={imageRef} hidden onChange={handleImage} />

          {frontendImage && (
            <div className="w-full h-[300px] overflow-hidden flex justify-center items-center rounded-lg">
              <img className="h-full rounded-lg" src={frontendImage} alt="preview" />
            </div>
          )}

          <div className="w-full flex flex-col">
            <div className="p-5 flex items-center justify-start border-b border-gray-300">
              <FaImage className="w-6 h-6 text-gray-500 cursor-pointer" onClick={() => imageRef.current.click()} />
            </div>

            <div className="flex justify-end">
              <button
                className="w-[100px] h-[50px] rounded-full bg-blue-500 mt-5 text-white disabled:opacity-50"
                disabled={posting}
                onClick={handleUploadPost}
              >
                {posting ? "Posting..." : "Post"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Center Post Section */}
      <div className="w-full lg:w-[50%] min-h-[200px] bg-[#f0efe7] flex flex-col gap-5">
        <div className="w-full h-[120px] bg-white shadow-lg rounded-lg flex items-center gap-4 p-5">
          <div className="w-[60px] h-[60px] rounded-full overflow-hidden border-2 border-white">
            <img className="h-full" src={userData?.profileImage || profile_image} alt="profile" />
          </div>
          <button className="flex-1 h-12 border-2 border-gray-500 rounded-full flex items-center px-4 hover:bg-gray-200 text-base"
            onClick={() => setUploadPost(true)}>
            Start a post
          </button>
        </div>

        {Array.isArray(postData) && postData.length > 0 ? (
          postData.map((post) => (
            post && (
              <Post
                key={post._id}
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
          <div className="text-center text-gray-500 mt-4">No posts to display.</div>
        )}
      </div>

      {/* Right Suggested Users */}
      <div className="w-full lg:w-[25%] min-h-[200px] bg-white shadow-lg hidden lg:flex flex-col p-5">
        <h1 className="text-lg text-gray-600 font-semibold">Suggested Users</h1>
        <div className="flex flex-col gap-3 mt-3">
          {suggestedUser.map((su) => (
            <div key={su._id} className="flex gap-3 items-center border-b p-2 rounded-lg hover:bg-gray-100 cursor-pointer" onClick={() => handleGetProfile(su.userName)}>
              <div className="w-10 h-10 rounded-full overflow-hidden">
                <img className="w-full h-full object-cover" src={su?.profileImage || profile_image} alt="user" />
              </div>
              <div>
                <div className="text-base font-semibold text-gray-700">{`${su.firstName} ${su.lastName}`}</div>
                <div className="text-sm text-gray-600">{su.headline}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Home;
