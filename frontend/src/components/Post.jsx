import React, { useContext, useEffect, useState } from 'react'
import profile_image from '../assets/profile_image.webp'
import moment from 'moment'
import { AiOutlineLike } from "react-icons/ai";
import { BiSolidLike } from "react-icons/bi";
import { LuSendHorizontal } from "react-icons/lu";
import { FaRegCommentDots } from "react-icons/fa6";
import { authDataContext } from '../context/AuthContext';
import axios from 'axios'
import { io } from 'socket.io-client'
import { userDataContext } from '../context/UserContext';
import ConnectionButton from './ConnectionButton';




function Post({ id, author, likes, comment, description, image, createdAt }) {

  let [readMore, setReadMore] = useState(false)
  let { serverUrl } = useContext(authDataContext)
  let { userData, setUserdata, getPost, handleGetProfile } = useContext(userDataContext)
  let [like, setLike] = useState([])
  let [comments, setComments] = useState([])
  let [commentContent, setCommentContent] = useState("")
  let [showComment, setShowComment] = useState(false)
  const socket = io(serverUrl)


  const handleLike = async () => {
    try {
      let result = await axios.get(serverUrl + `/api/post/like/${id}`, {
        withCredentials: true
      })
      console.log(result)
      setLike(result.data.likes)
    } catch (error) {
      console.log(error)
    }
  }

  const handleComment = async (e) => {
    e.preventDefault()
    try {
      let result = await axios.post(serverUrl + `/api/post/comment/${id}`, {
        content: commentContent
      }, {
        withCredentials: true
      })
      setComments(result.data.comments)
      setCommentContent("")
    } catch (error) {
      console.log(error)
    }
  }

  // useEffect for like update
  useEffect(() => {
    socket.on("likeUpdated", ({ postId, likes }) => {
      if (postId == id) {
        setLike(likes)
      }
    })
    // socket io for comment
    socket.on("commentAdded", ({ postId, comm }) => {
      if (postId == id) {
        setComments(comm)
      }
    })

    return () => {
      socket.off("likeUpdated")
      socket.off("commentAdded")
    }
  }, [id])

  useEffect(() => {
    setLike(likes)
    setComments(comment)
  }, [likes, comment])


  return (
    <div className='w-full min-h-[200px] flex flex-col gap-[10px] bg-white rounded-lg shadow-lg p-[20px]'>

      <div className='flex justify-between items-center'>
        {/* profile image + name/headline */}
        <div className='flex items-center gap-[10px]' onClick={() => handleGetProfile(author.userName)} >
          {/* profile image */}
          <div className='w-[70px] h-[70px] rounded-full overflow-hidden flex items-center justify-center border-2 border-white cursor-pointer'>
            <img className='h-full' src={author.profileImage || profile_image} alt="profile" />
          </div>

          {/* name and headline stacked vertically */}
          <div className='flex flex-col'>
            <div className='text-[24px] font-bold'>{`${author.firstName} ${author.lastName}`}</div>
            <div className='text-[16px]'>{author.headline}</div>
            <div className='text-[16px]'>{moment(createdAt).fromNow()}

            </div>
          </div>
        </div>

        {/* optional button or actions area */}
        <div>
          {/* Add buttons if needed */}
          {userData._id != author._id && <ConnectionButton userId={author._id} />}

        </div>
      </div>
      <div className={`w-full ${readMore ? "max-h-[100px] overflow-hidden" : ""} pl-[50px]`}>
        {description}
      </div>
      <div className='pl-[50px] text-[19px] font-semibold cursor-pointer' onClick={() => setReadMore(prev => !prev)}>
        {readMore ? "read less..." : "read more..."}
      </div>

      {
        image && <div className='w-full h-[300px] overflow-hidden flex justify-center rounded-lg'>
          <img className='h-full rounded-lg' src={image} alt="" />
        </div>
      }
      <div>

        <div className='w-full flex justify-between items-center p-[20px] border-b-2 border-gray-500'>
          <div className='flex justify-between items-center gap-[5px] text-[18px]'><AiOutlineLike className='text-[#1ebbff] w-[20px] h-[20px]' /><span>{like.length}</span></div>

          <div className='flex justify-center items-center gap-[5px] text-[18px] cursor-pointer' onClick={() => setShowComment(prev => !prev)}><span>{comments.length}</span>comments</div>
        </div>

        <div className='flex justify-start items-center w-full p-[20px] gap-[20px]'>
          {!like.includes(userData._id) && <div className='flex justify-center items-center gap-[5px] cursor-pointer' onClick={() => handleLike()}>
            <AiOutlineLike className='w-[24px] h-[24px]' />
            <span>Like</span>
          </div>}
          {like.includes(userData._id) && <div className='flex justify-center items-center gap-[5px] cursor-pointer' onClick={() => handleLike()}>
            <BiSolidLike className='w-[24px] h-[24px] text-[#07a4ff]' />
            <span className='text-[#07a4ff]'>Liked</span>
          </div>}

          <div className='flex justify-center items-center gap-[5px] cursor-pointer' onClick={() => setShowComment(prev => !prev)}>
            <FaRegCommentDots className='w-[24px] h-[24px]' />
            <span>comment</span>
          </div>
        </div>

        {showComment && <div>
          <form className='w-full flex justify-between items-center border-b-2 border-b-gray-300 p-[10px]' onSubmit={handleComment}>
            <input type="text" placeholder={'leave a comment'} className='outline-none border-none' value={commentContent} onChange={(e) => setCommentContent(e.target.value)} />
            <button><LuSendHorizontal className='text-[#07a4ff] w-[22px] h-[22px]' /></button>
          </form>
          <div className='flex flex-col gap-[10px]'>
            {
              comments.map((com) => (
                <div key={com._id} className='flex flex-col gap-[20px] border-b-2 p-[20px]border-b-gray-300'>
                  <div className='w-full flex justify-start items-center gap-[10px]'>
                    <div className='w-[70px] h-[70px] rounded-full overflow-hidden flex items-center justify-center border-2 border-white cursor-pointer'>
                      <img className='h-full' src={com.user.profileImage || profile_image} alt="profile" />
                    </div>
                    <div>
                      <div className='text-[16px] font-semibold'>{`${com.user.firstName} ${com.user.lastName}`}</div>
                      <div>{moment(com.createdAt).fromNow()}</div>
                    </div>
                  </div>

                  <div className="pl-[80px] mb-4">
                    <div className="bg-gray-100 p-3 rounded-lg shadow-sm text-sm text-gray-800 max-w-xl break-words">
                      {com.content}
                    </div>
                  </div>

                </div>
              ))
            }
          </div>
        </div>}

      </div>
    </div>
  )
}

export default Post;
