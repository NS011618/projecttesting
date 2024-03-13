import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import Papa from 'papaparse'
import { registerRoute, inputRoute } from '../utils/APIRoutes'

function Register() {
   const [username, setUsername] = useState('')
   const [email, setEmail] = useState('')
   const [password, setPassword] = useState('')
   const [confirmPassword, setConfirmPassword] = useState('')
   const [role, setRole] = useState('patient')
   const [message, setMessage] = useState('')
   const [loading, setLoading] = useState(false)

   // File upload related states
   const [csvData, setCsvData] = useState([])
   const [fileNames, setFileNames] = useState([])
   const [userRole, setUserRole] = useState(null)

   const navigate = useNavigate()

   useEffect(() => {
      // Check the login status when the component mounts
      const checkRole = () => {
         const storedRole = localStorage.getItem('userRole')
         setUserRole(storedRole)
      }

      checkRole()
   }, [])

   const navigateToDashboard = (role) => {
      if (role === 'patient') {
         navigate('/patient-dashboard')
      } else {
         navigate('/admin-dashboard')
      }
   }

   const handleFileUpload = (event) => {
      const files = event.target.files
      const newFiles = Array.from(files)

      newFiles.forEach((file) => {
         Papa.parse(file, {
            header: true,
            complete: (results) => {
               const nonEmptyRows = results.data.filter((row) =>
                  Object.values(row).some(
                     (value) => value !== null && value !== undefined && value !== '',
                  ),
               )

               setCsvData((prevData) => [...prevData, ...nonEmptyRows])

               if (!username && nonEmptyRows.length > 0) {
                  setUsername(nonEmptyRows[0].Name)
               }

               const newFileNames = newFiles.map(() => {
                  const fileName = `${nonEmptyRows[0].Name}.csv`
                  return fileName
               })

               setFileNames((prevFileNames) => [...prevFileNames, ...newFileNames])
            },
         })
      })
   }

   const handleRemoveFile = (fileName) => {
      setFileNames((prevFileNames) => prevFileNames.filter((name) => name !== fileName))
      setUsername('')
      setCsvData((prevData) => prevData.filter((row) => row._fileName !== fileName))
   }

   const handleSignup = async () => {
      try {
         setLoading(true)

         if (password !== confirmPassword) {
            setMessage('Password and confirm password do not match')
            return
         }

         const response = await axios.post(registerRoute, {
            username,
            email,
            password,
            confirmPassword,
            role,
         })

         if (response.status === 201) {
            setMessage('User registered successfully')

            if (role === 'patient') {
               await postDataToPublicURL()
            }

            navigateToDashboard(role)
         }
      } catch (error) {
         const errorMessage = error.response?.data?.message || 'An error occurred'
         setMessage('Error: ' + errorMessage)
      } finally {
         setLoading(false)
      }
   }

   const postDataToPublicURL = async () => {
      if (csvData.length === 0) {
         setMessage('No data to post')
         return
      }

      try {
         const response = await fetch(inputRoute, {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
            },
            body: JSON.stringify([userRole, csvData]),
            credentials: 'include',
         })

         if (response.ok) {
            setMessage('Data posted successfully')
         } else {
            setMessage('Failed to post data')
         }
      } catch (error) {
         console.error('Error posting data:', error)
         setMessage('An error occurred while posting data')
      }
   }

   return (
      <div className="flex justify-center items-center h-max-80">
         <form className="bg-white shadow-xl p-6 rounded-lg">
            <h1 className="text-2xl mb-4">Register</h1>
            <div className="flex flex-wrap mb-4">
               <div className="w-full md:w-1/2 md:pr-2">
                  <label className="block mb-1">Username:</label>
                  <input
                     className="w-full px-3 py-2 border rounded-lg"
                     type="text"
                     placeholder="Username"
                     value={username}
                     onChange={(e) => setUsername(e.target.value)}
                  />
               </div>
               <div className="w-full md:w-1/2 md:pl-2">
                  <label className="block mb-1">Email:</label>
                  <input
                     className="w-full px-3 py-2 border rounded-lg"
                     type="email"
                     placeholder="Email"
                     value={email}
                     onChange={(e) => setEmail(e.target.value)}
                  />
               </div>
            </div>
            <div className="flex flex-wrap mb-4">
               <div className="w-full md:w-1/2 md:pr-2">
                  <label className="block mb-1">Password:</label>
                  <input
                     className="w-full px-3 py-2 border rounded-lg"
                     type="password"
                     placeholder="Password"
                     value={password}
                     onChange={(e) => setPassword(e.target.value)}
                  />
               </div>
               <div className="w-full md:w-1/2 md:pl-2">
                  <label className="block mb-1">Confirm Password:</label>
                  <input
                     className="w-full px-3 py-2 border rounded-lg"
                     type="password"
                     placeholder="Confirm Password"
                     value={confirmPassword}
                     onChange={(e) => setConfirmPassword(e.target.value)}
                  />
               </div>
            </div>
            <div className="mb-4">
               <label className="block mb-1">Role:</label>
               <select
                  className="w-full px-3 py-2 border rounded-lg"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
               >
                  <option value="admin">Admin</option>
                  <option value="patient">Patient</option>
               </select>
            </div>

            {role === 'patient' && (
               <div className="mb-4">
                  <label className="block mb-1">CSV File:</label>
                  <input
                     className="w-full px-3 py-2 border rounded-lg"
                     type="file"
                     accept=".csv"
                     multiple
                     onChange={handleFileUpload}
                  />
                  {fileNames.length === 0 && <div className="text-gray-500">No file chosen</div>}
               </div>
            )}

            {fileNames.length > 0 && (
               <div className="mb-4">
                  <h2 className="text-xl mb-2">Selected Files:</h2>
                  <ul>
                     {fileNames.map((fileName, index) => (
                        <li key={index} className="flex justify-between items-center mb-2">
                           {fileName}
                           <button
                              className="bg-red-600 px-2 py-1 text-white rounded"
                              onClick={() => handleRemoveFile(fileName)}
                           >
                              Remove
                           </button>
                        </li>
                     ))}
                  </ul>
               </div>
            )}

            <button
               className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
               type="submit" onClick={handleSignup}
               disabled={loading}
            >
               {loading ? 'Signing up...' : 'Sign Up'}
            </button>

            {message && <div className="text-red-500 mt-4">{message}</div>}
            <Link className="block mt-4 " to="/login-page">
               Already have an account? <span className='text-blue-500'>Log In</span>
            </Link>
         </form>
      </div>
   )
}

export default Register
