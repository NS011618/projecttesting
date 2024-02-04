// Admindashboard.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { totalpatients } from '../utils/APIRoutes';


const UserCard = ({ username, userRole }) => (
   <div className="bg-white p-4 rounded-md shadow-md mb-4">
      <h2 className="text-2xl font-bold mb-2 text-gray-800">{username}</h2>
      <p className="text-gray-600">Role: {userRole}</p>
   </div>
);

const PatientCount = ({ totalPatients }) => (
   <div className="bg-white p-3 rounded-md shadow-md">
      <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
      {totalPatients !== null && (
         <p className="text-gray-600">Total Patients: {totalPatients}</p>
      )}
   </div>
);

const Admindashboard = () => {
   const navigate = useNavigate();
   const [userRole, setUserRole] = useState(null);
   const [username, setUsername] = useState(null);
   const [totalPatients, setTotalPatients] = useState(null);

   useEffect(() => {
      const storedRole = localStorage.getItem('userRole');
      const storedName = localStorage.getItem('userName');

      if (storedRole && storedName) {
         setUserRole(storedRole);
         setUsername(storedName);
      }

      axios.get(totalpatients)
         .then(response => {
            setTotalPatients(response.data.total_patients);
         })
         .catch(error => {
            console.error('Error fetching total patients:', error);
         });
   }, []);

   const handleInput = () => {
      navigate('/input-data');
   };

   return (
      <div className="flex flex-col h-screen p-4 ">
         <div className="md:w-1/2 md:mr-5">
            {username && userRole && <UserCard username={username} userRole={userRole} />}
         </div>

         <div className="grid grid-cols-2 gap-4 mt-4">
            <PatientCount totalPatients={totalPatients} />
            
            <div className="bg-white p-3 rounded-md shadow-md">
               <div className="flex items-center justify-between mb-4">
                  <p className="text-xl font-bold">Upload Datasets</p>
                  <button
                     className="bg-blue-500 text-white px-4 py-2 rounded-md transition duration-300 ease-in-out hover:bg-blue-600"
                     onClick={handleInput}
                  >
                     Upload
                  </button>
               </div>
               <p className="text-gray-600 mb-4">You can upload datasets here.</p>
            </div>
         </div>
      </div>
   );
};

export default Admindashboard;
