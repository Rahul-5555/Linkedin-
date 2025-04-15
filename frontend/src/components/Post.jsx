import React, { useContext, useEffect, useState } from 'react'
import profile_image from '../assets/profile_image.webp'
import moment from 'moment'
import { AiOutlineLike } from "react-icons/ai";
import { BiSolidLike } from "react-icons/bi";
import { LuSendHorizontal } from "react-icons/lu";
import { FaRegCommentDots } from "react-icons/fa6";
import { authDataContext } from '../context/AuthContext';
import axios from 'axios'
import { socket, userDataContext } from '../context/UserContext';
import ConnectionButton from './ConnectionButton';
// import { socket } from '../socket' // ✅ socket instance created in a separate file


function Post({ id, author, likes, comment, description, image, createdAt }) {
  const [readMore, setReadMore] = useState(false)
  const { serverUrl } = useContext(authDataContext)
  const { userData, handleGetProfile } = useContext(userDataContext)
  const [like, setLike] = useState(likes)
  const [comments, setComments] = useState(comment)
  const [commentContent, setCommentContent] = useState("")
  const [showComment, setShowComment] = useState(false)

  const handleLike = async () => {
    try {
      const { data } = await axios.get(`${serverUrl}/api/post/like/${id}`, {
        withCredentials: true
      })
      setLike(data.likes)
    } catch (error) {
      console.log(error)
    }
  }

  const handleComment = async (e) => {
    e.preventDefault()
    try {
      const { data } = await axios.post(`${serverUrl}/api/post/comment/${id}`, {
        content: commentContent
      }, { withCredentials: true })

      setComments(data.comments)
      setCommentContent("")
    } catch (error) {
      console.log(error)
    }
  }

  // useEffect for socket listeners
  useEffect(() => {
    socket.on("likeUpdated", ({ postId, likes }) => {
      if (postId === id) {
        setLike(likes)
      }
    })

    socket.on("commentAdded", ({ postId, comm }) => {
      if (postId === id) {
        setComments(comm)
      }
    })

    return () => {
      socket.off("likeUpdated")
      socket.off("commentAdded")
    }
  }, [id])

  return (
    <div className='w-full min-h-[200px] flex flex-col gap-[10px] bg-white rounded-lg shadow-lg p-[20px]'>

      {/* Header */}
      <div className='flex justify-between items-center'>
        <div className='flex items-center gap-[10px]' onClick={() => handleGetProfile(author.userName)}>
          <div className='w-[70px] h-[70px] rounded-full overflow-hidden border-2 border-white cursor-pointer'>
            <img className='h-full' src={author?.profileImage || profile_image} alt="profile" />
          </div>
          <div className='flex flex-col'>
            <div className='text-[24px] font-bold'>{`${author?.firstName} ${author?.lastName}`}</div>
            <div className='text-[16px]'>{author?.headline}</div>
            <div className='text-[16px]'>{moment(createdAt).fromNow()}</div>
          </div>
        </div>
        {userData?._id !== author?._id && <ConnectionButton userId={author?._id} />}
      </div>

      {/* Description */}
      <div className={`w-full pl-[50px] ${!readMore ? "max-h-[100px] overflow-hidden" : ""}`}>
        {description}
      </div>
      <div className='pl-[50px] text-[19px] font-semibold cursor-pointer' onClick={() => setReadMore(prev => !prev)}>
        {readMore ? "Read less..." : "Read more..."}
      </div>

      {/* Image */}
      {image && (
        <div className='w-full h-[300px] overflow-hidden flex justify-center rounded-lg'>
          <img className='h-full rounded-lg' src={image} alt="post" />
        </div>
      )}

      {/* Like & Comment Count */}
      <div className='w-full flex justify-between items-center p-[20px] border-b-2 border-gray-500'>
        <div className='flex items-center gap-[5px] text-[18px]'>
          <AiOutlineLike className='text-[#1ebbff] w-[20px] h-[20px]' />
          <span>{like.length}</span>
        </div>
        <div className='flex items-center gap-[5px] text-[18px] cursor-pointer' onClick={() => setShowComment(prev => !prev)}>
          <span>{comments.length}</span> comments
        </div>
      </div>

      {/* Action Buttons */}
      <div className='flex items-center w-full p-[20px] gap-[20px]'>
        <div className='flex items-center gap-[5px] cursor-pointer' onClick={handleLike}>
          {like.includes(userData._id)
            ? <BiSolidLike className='w-[24px] h-[24px] text-[#07a4ff]' />
            : <AiOutlineLike className='w-[24px] h-[24px]' />}
          <span className={like.includes(userData._id) ? 'text-[#07a4ff]' : ''}>
            {like.includes(userData._id) ? 'Liked' : 'Like'}
          </span>
        </div>

        <div className='flex items-center gap-[5px] cursor-pointer' onClick={() => setShowComment(prev => !prev)}>
          <FaRegCommentDots className='w-[24px] h-[24px]' />
          <span>Comment</span>
        </div>
      </div>

      {/* Comments Section */}
      {showComment && (
        <div>
          <form className='w-full flex justify-between items-center border-b-2 border-b-gray-300 p-[10px]' onSubmit={handleComment}>
            <input
              type="text"
              placeholder="Leave a comment"
              className='outline-none flex-1 mr-3'
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
            />
            <button type="submit"><LuSendHorizontal className='text-[#07a4ff] w-[22px] h-[22px]' /></button>
          </form>

          <div className='flex flex-col gap-[10px]'>
            {comments.map((com) => (
              <div key={com._id} className='flex flex-col gap-[20px] border-b-2 border-b-gray-300 p-[20px]'>
                <div className='flex items-center gap-[10px]'>
                  <div className='w-[70px] h-[70px] rounded-full overflow-hidden border-2 border-white cursor-pointer'>
                    <img className='h-full' src={com.user?.profileImage || profile_image} alt="profile" />
                  </div>
                  <div>
                    <div className='text-[16px] font-semibold'>{`${com.user.firstName} ${com.user.lastName}`}</div>
                    <div>{moment(com.createdAt).fromNow()}</div>
                  </div>
                </div>
                <div className="pl-[80px]">
                  <div className="bg-gray-100 p-3 rounded-lg text-sm text-gray-800 max-w-xl break-words">
                    {com.content}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default Post
