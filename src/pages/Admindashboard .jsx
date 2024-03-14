import React, { useState, useEffect } from 'react'
import { Admindash } from '../utils/APIRoutes'

const UserCard = ({ username, userRole }) => (
   <div className="bg-white rounded-md shadow-md p-4 mb-4">
      <h2 className="text-xl font-bold mb-2 text-gray-800">{username}</h2>
      <p className="text-gray-600">
         <span className="font-semibold">Role:</span> {userRole}
      </p>
   </div>
)

const Admindashboard = () => {
   const [userRole, setUserRole] = useState(null)
   const [username, setUsername] = useState(null)
   const [totalPatients, setTotalPatients] = useState(0)
   const [activePatients, setActivePatients] = useState(0)

   useEffect(() => {
      const storedRole = localStorage.getItem('userRole')
      const storedName = localStorage.getItem('userName')

      if (storedRole && storedName) {
         setUserRole(storedRole)
         setUsername(storedName)
      }
   }, [])

   useEffect(() => {
      const gettotal = async () => {
         const response = await fetch(Admindash, {
            method: 'GET',
            headers: {
               'Content-Type': 'application/json',
            }
         }).then((res) => res.json())
         setTotalPatients(response.total_patients) 
         setActivePatients(response.active_patients)
         console.log(response)
      }
      gettotal()
   }
   , [])

   return (
      <div className="flex flex-col h-screen bg-sky-300/25 shadow-inner">
         <header className="bg-white/30 shadow-md">
            <div className="max-w-7xl mx-auto px-4 py-6">
               <h1 className="text-2xl font-semibold text-gray-800">Admin Dashboard</h1>
            </div>
         </header>
         <div className="flex flex-col md:flex-row flex-1">
            <div className="md:w-1/5 p-4">
               <UserCard username={username} userRole={userRole} />
               <div className="bg-gray-900/25 rounded-md shadow-inner h-1 w-78"></div>
               <br />
               <div className="bg-white/40 rounded-md shadow-inner p-4">
                  <h1 className="text-2xl font-semibold text-center text-gray-800 mb-2">Active Patients</h1>
                  <div className="text-4xl font-semibold text-center text-teal-800">{activePatients}</div>
               </div>
               <br />
               <div className="bg-white/40 rounded-md shadow-inner p-4">
                  <h1 className="text-2xl font-semibold text-center text-gray-800 mb-2">Total Patients</h1>
                  <div className="text-4xl font-semibold text-center text-teal-800">{totalPatients}</div>
               </div>
            </div>
            <div className="md:w-4/5 p-3">
               <iframe
                  title="admindashboard"
                  width="100%"
                  height="100%"
                  src="https://app.powerbi.com/reportEmbed?reportId=8277b47a-9953-48fa-8fa4-cccff7b8f81f&autoAuth=true&ctid=8ba02f42-a433-4ad5-bdab-0103a1bc5fa5"
                  frameBorder="0"
               ></iframe>
            </div>
         </div>
      </div>
   )
}

export default Admindashboard
