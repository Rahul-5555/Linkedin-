import React, { createContext } from 'react'

export const authDataContext = createContext()

function AuthContext({ children }) {

  // const serverUrl = "http://localhost:8000"
  const serverUrl = "https://linkedin-backend-l8rc.onrender.com"

  let value = {
    serverUrl
  }
  return (
    <div>
      <authDataContext.Provider value={value}>
        {children}
      </authDataContext.Provider>
    </div>
  )
}

export default AuthContext
