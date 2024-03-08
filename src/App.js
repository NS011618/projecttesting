/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import './App.css'
import React, { useEffect, useState } from 'react'
import { BrowserRouter, Link, Route, Routes, Outlet, Navigate } from 'react-router-dom'
import {
   About,
   Contact,
   Login,
   Register,
   Patientdashboard,
   Inputdat,
   Admindashboard,
   Profile,
} from './pages'
import useLocalStorageState from 'use-local-storage-state'
import { IoPersonCircleSharp } from 'react-icons/io5'

function App() {
   const [isLoggedIn, setIsLoggedIn] = useLocalStorageState(false)
   const [role, setRole] = useState('patient')
   const [username, setUsername] = useState(null)
   const [dropdownVisible, setDropdownVisible] = useState(false)

   useEffect(() => {
      const checkLoginStatus = () => {
         const storedLoginStatus = localStorage.getItem('isLoggedIn')
         setIsLoggedIn(storedLoginStatus === 'true')
      }

      checkLoginStatus()
   }, [])

   useEffect(() => {
      if (dropdownVisible) {
         const timeoutId = setTimeout(() => {
            setDropdownVisible(false);
         }, 1000); // Set the timeout to 1 seconds

         return () => clearTimeout(timeoutId); // Cleanup function to clear the timeout
      }
   }, [dropdownVisible]);

   useEffect(() => {
      const storedRole = localStorage.getItem('userRole')
      const storedName = localStorage.getItem('userName')

      if (storedRole && storedName) {
         setRole(storedRole)
         setUsername(storedName)
      }
   }, [])

   const handleLogin = () => {
      localStorage.setItem('isLoggedIn', 'true')
      setIsLoggedIn(true)
   }

   const handleLogout = () => {
      localStorage.setItem('isLoggedIn', 'false')
      localStorage.setItem('role', 'patient')
      localStorage.setItem('username', null)
      setIsLoggedIn(false)
   }

   const toggleDropdown = () => {
      setDropdownVisible(!dropdownVisible)
   }

   return (
      <BrowserRouter>
         <header className="w-full flex justify-between sm:px-8 px-5 py-4 border-b border-b-[#e6ebf4] bg-gradient-to-r from-orange-400 from-10% via-sky-300 via-30% to-yellow-200 to-90%">
            <h3
               to=""
               className="w-96 text-xl font-semibold object-contain font-inter bg-white p-3 shadow-md  text-black px-4 py-2 rounded-md"
            >
               Medical History
            </h3>

            <nav className="flex items-center space-x-4">
               {isLoggedIn ? (
                  <>
                     <Link
                        to={
                           role === 'patient' ? '/patient-dashboard' : '/admin-dashboard'
                        }
                        className="font-inter font-medium bg-white p-3 shadow-md  text-black px-4 py-2 rounded-md"
                     >
                        Dashboard
                     </Link>
                     <Link
                        to="/about-page"
                        className="font-inter font-medium bg-white p-3 shadow-md  text-black px-4 py-2 rounded-md"
                     >
                        About
                     </Link>
                     <Link
                        to="/contact-page"
                        className="font-inter font-medium bg-white p-3 shadow-md  text-black px-4 py-2 rounded-md"
                     >
                        Contact us
                     </Link>
                     <div className="relative">
                        <button
                           onClick={toggleDropdown}
                           className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 focus:outline-none"
                        >
                           <span className="rounded-full">
                              <IoPersonCircleSharp size={45} />
                           </span>
                        </button>
                        {dropdownVisible && (
                           <div
                              id="userDropdown"
                              className="absolute right-0 mt-2 p-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-100"
                           >
                              <div className="py-1">
                                 {role === 'patient' && (
                                    <>
                                       <Link
                                          to="/profile-page"
                                          className="block px-4 py-3 text-md text-gray-700 hover:bg-gray-100"
                                       >
                                          My Profile 
                                       </Link>
                                       <Link
                                          to="/input-data"
                                          className="block px-4 py-3 text-md text-gray-700 hover:bg-gray-100"
                                       >
                                          Input Data
                                       </Link>
                                    </>
                                 )}

                                 <button
                                    onClick={handleLogout}
                                    className="block w-full text-left px-4 py-3 text-md text-gray-700 hover:bg-gray-100"
                                 >
                                    Logout
                                 </button>
                              </div>
                           </div>
                        )}
                     </div>
                  </>
               ) : (
                  <>
                     <Link
                        to="/about-page"
                        className="font-inter font-medium bg-white p-3 shadow-md  text-black px-4 py-2 rounded-md"
                     >
                        About
                     </Link>
                     <Link
                        to="/contact-page"
                        className="font-inter font-medium bg-white p-3 shadow-md  text-black px-4 py-2 rounded-md"
                     >
                        Contact us
                     </Link>
                     <Link
                        to="/login-page"
                        className="font-inter font-medium bg-white p-3 shadow-md  text-black px-4 py-2 rounded-md"
                     >
                        Login
                     </Link>
                     <Link
                        to="/"
                        className="font-inter font-medium bg-white p-3 shadow-md  text-black px-4 py-2 rounded-md"
                     >
                        Sign Up
                     </Link>
                  </>
               )}
            </nav>
         </header>

         <main className="sm:px-4 px-4 py-4 w-full bg-white min-h-[calc(100vh - 80px)]">
            <Routes>
               <Route path="/about-page" element={<About />} />
               <Route path="/contact-page" element={<Contact />} />
               <Route path="/login-page" element={<Login onLogin={handleLogin} />} />
               <Route
                  path="/profile-page"
                  element={isLoggedIn ? <Profile /> : <Navigate to="/login-page" />}
               />
               <Route path="/" element={<Register />} />
               <Route
                  path="/patient-dashboard"
                  element={
                     isLoggedIn ? <Patientdashboard /> : <Navigate to="/login-page" />
                  }
               />
               <Route
                  path="/input-data"
                  element={isLoggedIn ? <Inputdat /> : <Navigate to="/login-page" />}
               />
               <Route
                  path="/admin-dashboard"
                  element={
                     isLoggedIn ? <Admindashboard /> : <Navigate to="/login-page" />
                  }
               />
            </Routes>
            <Outlet />
         </main>
      </BrowserRouter>
   )
}

export default App
