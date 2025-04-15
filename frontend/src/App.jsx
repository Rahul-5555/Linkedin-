import React, { useContext } from 'react'
import Home from './pages/Home'
import Signup from './pages/Signup'
import Login from './pages/Login'
import { Route, Routes } from 'react-router-dom'
import { userDataContext } from './context/UserContext'
import { Navigate } from 'react-router-dom'
import Network from './pages/Network'
import Profile from './pages/Profile'
import Notification from './pages/Notification'

const App = () => {
  let { userData } = useContext(userDataContext)
  return (
    <Routes>
      <Route path="/" element={userData ? <Home /> : <Navigate to="/login" />} />
      <Route path="/signup" element={userData ? <Navigate to="/" /> : <Signup />} />
      <Route path="/login" element={userData ? <Navigate to="/" /> : <Login />} />
      <Route path="/network" element={userData ? <Network /> : <Navigate to="/login" />} />
      <Route path="/profile" element={userData ? <Profile /> : <Navigate to="/login" />} />
      <Route path="/notification" element={userData ? <Notification /> : <Navigate to="/login" />} />
    </Routes>
  )
}

export default App