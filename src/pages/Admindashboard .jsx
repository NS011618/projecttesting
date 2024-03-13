import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const UserCard = ({ username, userRole }) => (
   <div className="bg-white/25 p-4 rounded-r rounded-b shadow-md mb-4">
      <h2 className="text-xl font-bold mb-2 text-gray-800 capitalize">{username}</h2>
      <p className="text-gray-600"><span className='font-semibold'>Role:</span> {userRole}</p>
   </div>
)

const Admindashboard = () => {
   const navigate = useNavigate()
   const [userRole, setUserRole] = useState(null)
   const [username, setUsername] = useState(null)

   useEffect(() => {
      const storedRole = localStorage.getItem('userRole')
      const storedName = localStorage.getItem('userName')

      if (storedRole && storedName) {
         setUserRole(storedRole)
         setUsername(storedName)
      }
   }, [])

   return (
      <div className="flex flex-col h-screen bg-slate-200/25 rounded-lg shadow-inner">
         <div className="md:flex md:flex-row md:justify-end">
            {username && userRole && (
               <div className="md:w-1/6 md:ml-4">
                  <UserCard username={username} userRole={userRole} />
               </div>
            )}
         </div>
      </div>
   )
}

export default Admindashboard
