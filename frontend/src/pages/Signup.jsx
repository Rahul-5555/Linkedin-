import React, { useContext, useState } from 'react'
import logo from '../assets/logo.svg'
import { useNavigate } from 'react-router-dom'
import { authDataContext } from '../context/AuthContext'
import axios from 'axios'
import { userDataContext } from '../context/UserContext'

const Signup = () => {
  const [show, setShow] = useState(false)
  const { serverUrl } = useContext(authDataContext)
  const { setUserData } = useContext(userDataContext)
  const navigate = useNavigate()
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [userName, setUserName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSignup = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      let result = await axios.post(serverUrl + "/api/auth/signup", {
        firstName,
        lastName,
        userName,
        email,
        password
      }, { withCredentials: true })
      // console.log(result)
      setUserData(result.data)
      navigate("/")
      setLoading(false)
      setFirstName("")
      setLastName("")
      setUserName("")
      setEmail("")
      setPassword("")
      setError("")
    } catch (error) {
      setError(error.response.data.message)
      setLoading(false)
    }
  }
  return (
    <div className='w-full h-screen bg-[white] flex flex-col items-center justify-start'>
      <div className='p-[30px] lg:p-[35px] w-full h-[80px] flex items-center'>
        <img className='' src={logo} alt="" />
      </div>
      <form onSubmit={handleSignup} className='w-[90%] max-w-[400px] h-[600px] md:shadow-xl flex flex-col justify-center gap-[10px] p-[15px]' >
        <h1 className='text-gray-800 text-[30px] font-semibold mb-[30px]'>Sign Up</h1>
        <input className='w-[100%] h-[50px] border-2 border-gray-600 text-gray-800 text-[18px] px-[20px] py-[10px] rounded-md' value={firstName} onChange={(e) => setFirstName(e.target.value)} type="text" placeholder='firstname' required />

        <input className='w-[100%] h-[50px] border-2 border-gray-600 text-gray-800 text-[18px] px-[20px] py-[10px] rounded-md' value={lastName} onChange={(e) => setLastName(e.target.value)} type="text" placeholder='lastname' required />

        <input className='w-[100%] h-[50px] border-2 border-gray-600 text-gray-800 text-[18px] px-[20px] py-[10px] rounded-md' value={userName} onChange={(e) => setUserName(e.target.value)} type="text" placeholder='username' required />

        <input className='w-full h-[50px] border-2 border-gray-600 text-gray-800 text-[18px] px-[20px] py-[10px] rounded-md' value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder='email' required />


        <div className='w-[100%] h-[50px] border-2 border-gray-600 text-gray-800 text-[18px]  rounded-md relative'>
          <input className='w-full h-full border-none border-gray-600 text-gray-800 text-[18px] px-[20px] py-[10px] rounded-md' value={password} onChange={(e) => setPassword(e.target.value)} type={show ? "text" : "password"} placeholder='password' required />
          <span className='absolute right-[20px] top-[10px] text-blue-500 font-semibold cursor-pointer' onClick={() => setShow(prev => !prev)}>{show ? "hidden" : "show"}</span>
        </div>

        {error && <p className='text-red-500 text-center'>*{error}</p>}
        <button className='w-[100%] h-[50px] rounded-full bg-blue-500 mt-[30px] text-white' disabled={loading} >{loading ? "Loading..." : "Sign Up"}</button>

        <p className='text-center cursor-pointer' onClick={() => navigate("/login")}>Already have an account ? <span className='text-blue-500'>Sign In</span></p>
      </form>
    </div>
  )
}

export default Signup