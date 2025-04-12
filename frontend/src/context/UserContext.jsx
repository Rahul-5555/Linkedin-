import React, { createContext, useContext, useEffect, useState } from 'react'
import { authDataContext } from './AuthContext'
import axios from 'axios'

export const userDataContext = createContext()
const UserContext = ({ children }) => {
  let [userData, setUserData] = useState(null)
  let { serverUrl } = useContext(authDataContext)
  let [edit, setEdit] = useState(false)
  let [postData, setPostData] = useState([])

  const getCurrentUser = async () => {
    try {
      let result = await axios.get(serverUrl + "/api/user/currentuser", {
        withCredentials: true
      })
      setUserData(result.data.user)
      console.log(result)

    } catch (error) {
      console.log(error)
      setUserData(null)
    }
  }

  // for get post
  const getPost = async () => {
    try {
      let result = await axios.get(serverUrl + "/api/post/getpost", {
        withCredentials: true
      })
      console.log(result)
      setPostData(result.data)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getCurrentUser();
    getPost()
  }, [])

  const value = {
    userData,
    setUserData,
    edit, setEdit,
    postData, setPostData, getPost
  }
  return (

    <userDataContext.Provider value={value}>
      {children}
    </userDataContext.Provider>

  )
}

export default UserContext