import React, { useContext, useEffect, useState } from 'react';
import profile_image from '../assets/profile_image.webp';
import moment from 'moment';
import { AiOutlineLike } from "react-icons/ai";
import { BiSolidLike } from "react-icons/bi";
import { LuSendHorizontal } from "react-icons/lu";
import { FaRegCommentDots } from "react-icons/fa6";
import { authDataContext } from '../context/AuthContext';
import axios from 'axios';
import { socket, userDataContext } from '../context/UserContext';
import ConnectionButton from './ConnectionButton';

function Post({ id, author, likes, comment, description, image, createdAt }) {
  const [readMore, setReadMore] = useState(false);
  const { serverUrl } = useContext(authDataContext);
  const { userData, handleGetProfile } = useContext(userDataContext);
  const [like, setLike] = useState(likes);
  const [comments, setComments] = useState(comment);
  const [commentContent, setCommentContent] = useState("");
  const [showComment, setShowComment] = useState(false);

  const handleLike = async () => {
    try {
      const { data } = await axios.get(`${serverUrl}/api/post/like/${id}`, {
        withCredentials: true
      });
      setLike(data.likes);
    } catch (error) {
      console.log(error);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(`${serverUrl}/api/post/comment/${id}`, {
        content: commentContent
      }, { withCredentials: true });

      setComments(data.comments);
      setCommentContent("");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    socket.on("likeUpdated", ({ postId, likes }) => {
      if (postId === id) {
        setLike(likes);
      }
    });

    socket.on("commentAdded", ({ postId, comm }) => {
      if (postId === id) {
        setComments(comm);
      }
    });

    return () => {
      socket.off("likeUpdated");
      socket.off("commentAdded");
    };
  }, [id]);

  return (
    <div className='w-full flex flex-col gap-4 bg-white rounded-xl shadow-lg p-4 sm:p-6'>
   
      {/* Header */}
      {/* Header */}
      <div className='flex justify-between items-center flex-wrap gap-4'>
        <div
          className='flex items-center gap-3 sm:gap-4 flex-1 min-w-0 cursor-pointer'
          onClick={() => handleGetProfile(author.userName)}
        >
          <div className='w-12 h-12 sm:w-20 sm:h-20 rounded-full overflow-hidden border-2 border-white shrink-0'>
            <img
              className='w-full h-full object-cover'
              src={author?.profileImage || profile_image}
              alt="profile"
            />
          </div>
          <div className='flex flex-col overflow-hidden'>
            <div className='text-sm sm:text-xl font-bold truncate'>{`${author?.firstName} ${author?.lastName}`}</div>
            <div className='text-xs sm:text-base text-gray-600 truncate'>{author?.headline}</div>
            <div className='text-[10px] sm:text-sm text-gray-500'>{moment(createdAt).fromNow()}</div>
          </div>
        </div>

        {userData?._id !== author?._id && (
          <div className='shrink-0'>
            <ConnectionButton userId={author?._id} />
          </div>
        )}
      </div>


      {/* Description */}
      <div className={`w-full ${!readMore ? "max-h-[100px] overflow-hidden" : ""}`}>
        <p className='text-sm sm:text-base px-2 sm:px-6'>{description}</p>
      </div>
      <div className='px-2 sm:px-6 text-sm text-blue-600 font-semibold cursor-pointer' onClick={() => setReadMore(prev => !prev)}>
        {readMore ? "Read less..." : "Read more..."}
      </div>

      {/* Image */}
      {image && (
        <div className='w-full h-48 sm:h-72 md:h-96 overflow-hidden rounded-lg flex justify-center items-center'>
          <img className='w-full h-full object-cover rounded-lg' src={image} alt="post" />
        </div>
      )}

      {/* Like & Comment Count */}
      <div className='w-full flex justify-between items-center px-2 sm:px-6 py-3 border-b border-gray-300'>
        <div className='flex items-center gap-2 text-sm sm:text-base'>
          <AiOutlineLike className='text-[#1ebbff] w-5 h-5' />
          <span>{like.length}</span>
        </div>
        <div className='flex items-center gap-2 text-sm sm:text-base cursor-pointer' onClick={() => setShowComment(prev => !prev)}>
          <span>{comments.length}</span> comments
        </div>
      </div>

      {/* Action Buttons */}
      <div className='flex items-center gap-6 px-2 sm:px-6'>
        <div className='flex items-center gap-2 cursor-pointer' onClick={handleLike}>
          {like.includes(userData._id)
            ? <BiSolidLike className='w-6 h-6 text-[#07a4ff]' />
            : <AiOutlineLike className='w-6 h-6' />}
          <span className={`text-sm sm:text-base ${like.includes(userData._id) ? 'text-[#07a4ff]' : ''}`}>
            {like.includes(userData._id) ? 'Liked' : 'Like'}
          </span>
        </div>
        <div className='flex items-center gap-2 cursor-pointer' onClick={() => setShowComment(prev => !prev)}>
          <FaRegCommentDots className='w-6 h-6' />
          <span className='text-sm sm:text-base'>Comment</span>
        </div>
      </div>

      {/* Comments Section */}
      {showComment && (
        <div className='mt-4'>
          <form className='w-full flex items-center gap-3 border-b border-gray-200 px-2 sm:px-6 py-2' onSubmit={handleComment}>
            <input
              type="text"
              placeholder="Leave a comment"
              className='outline-none flex-1 p-2 text-sm sm:text-base border rounded-md'
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
            />
            <button type="submit" className='text-[#07a4ff]'>
              <LuSendHorizontal className='w-6 h-6' />
            </button>
          </form>

          <div className='flex flex-col gap-4 px-2 sm:px-6 mt-4'>
            {comments.map((com) => (
              <div key={com._id} className='flex flex-col gap-3 border-b border-gray-200 pb-4'>
                <div className='flex items-center gap-4'>
                  <div className='w-12 h-12 sm:w-16 sm:h-16 rounded-full overflow-hidden border'>
                    <img className='w-full h-full object-cover' src={com.user?.profileImage || profile_image} alt="commenter" />
                  </div>
                  <div>
                    <div className='text-sm sm:text-base font-semibold'>{`${com.user.firstName} ${com.user.lastName}`}</div>
                    <div className='text-xs sm:text-sm text-gray-500'>{moment(com.createdAt).fromNow()}</div>
                  </div>
                </div>
                <div className="ml-14 sm:ml-20">
                  <div className="bg-gray-100 p-3 rounded-lg text-sm text-gray-800 max-w-full break-words">
                    {com.content}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Post;
