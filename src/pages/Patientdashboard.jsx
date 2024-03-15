import React, { useState, useEffect } from 'react'
import {
   predictRoute,
   getSymptomsRoute,
   gethistory,
   predictAndSuggestRoute,
} from '../utils/APIRoutes'
import { Link } from 'react-router-dom'
import { TiArrowSortedUp, TiArrowSortedDown } from 'react-icons/ti'

const UserCard = ({ username, userrole }) => (
   <header className="flex flex-row justify-between bg-teal-600/35 rounded-xl">
      <div className="max-w-7xl px-6 py-7">
         <h1 className="text-2xl font-semibold text-gray-800">Patient Dashboard</h1>
      </div>
      <div className="flex flex-col rounded-md px-2 py-3 mb-2 mr-6">
         <h2 className="text-xl font-semibold mb-2 text-gray-600">{username}</h2>
         <p className="text-gray-600">
            <span className="font-semibold">Role:</span> {userrole}
         </p>
      </div>
   </header>
)

const PatientDashboard = () => {
   /* State to manage the sections */

   const [username, setUsername] = useState(null)
   const [role, setRole] = useState(null)

   const [activeSection, setActiveSection] = useState('selectSymptoms')

   /* State to manage the list of symptoms, selected symptoms and manage the loading and error status of symptoms */

   const [symptomsList, setSymptomsList] = useState([])
   const [selectedSymptoms, setSelectedSymptoms] = useState([])
   const [symptomsLoaded, setSymptomsLoaded] = useState(false)
   const [symptomsError, setSymptomsError] = useState(null)

   /* State to manage the prediction error, predicted disease */

   const [predictionError, setPredictionError] = useState(null)
   const [predictedDisease, setPredictedDisease] = useState('')

   /* State to manage the accuracy, and algorithm */

   const [accuracy, setAccuracy] = useState(null)
   const [algorithm, setAlgorithm] = useState('DecisionTree')

   /* State to manage the search term for filtering symptoms */

   const [searchTerm, setSearchTerm] = useState('')
   const [pasthistory, setPastHistory] = useState(null)
   const [Suggestion, setSuggestion] = useState('')
   const algorithmOptions = ['DecisionTree']

   useEffect(() => {
      const fetchUser = async () => {
         const storedName = localStorage.getItem('userName')
         const storedRole = localStorage.getItem('userRole')
         if (storedName && storedRole) {
            setUsername(storedName)
            setRole(storedRole)
         }
      }
      fetchUser()
   }, [])

   useEffect(() => {
      const fetchSymptoms = async () => {
         const storedName = localStorage.getItem('userName')
         if (storedName) {
            setUsername(storedName)
         }
         try {
            const response = await fetch(getSymptomsRoute, {
               method: 'GET',
               headers: {
                  'Content-Type': 'application/json',
               },
            })

            if (response.ok) {
               const symptoms = await response.json()
               setSymptomsList(symptoms)
               setSymptomsLoaded(true)
            } else {
               setSymptomsError('Failed to fetch symptoms. Please try again later.')
               console.error(
                  'Failed to fetch symptoms. Server returned:',
                  response.status,
                  response.statusText,
               )
            }
         } catch (error) {
            setSymptomsError('Error fetching symptoms. Please try again later.')
            console.error('Error:', error)
         }
      }

      fetchSymptoms()
   }, [])

   useEffect(() => {
      const fetchPastHistory = async () => {
         try {
            const storedName = localStorage.getItem('userName')
            const response = await fetch(`${gethistory}?username=${storedName}`, {
               method: 'GET',
               headers: {
                  'Content-Type': 'application/json',
               },
            })

            if (response.ok) {
               const pastHistoryData = await response.json()
               const keywordsArray = pastHistoryData.Keywords.split(',').map((keyword) =>
                  keyword.trim(),
               )
               const filteredKeywords = keywordsArray.filter((keyword) => keyword !== '')
               const replacedSpacesKeywords = filteredKeywords.map((keyword) =>
                  keyword.replace(/ /g, '_'),
               )
               setPastHistory(replacedSpacesKeywords)
            } else {
               console.error(
                  'Failed to fetch past history. Server returned:',
                  response.status,
                  response.statusText,
               )
            }
         } catch (error) {
            console.error('Error fetching past history:', error)
         }
      }

      fetchPastHistory()
   }, [])

   const handleSymptomToggle = (event) => {
      const { value } = event.target
      setSelectedSymptoms((prevSelected) => {
         if (prevSelected.includes(value)) {
            return prevSelected.filter((symptom) => symptom !== value)
         } else {
            return [...prevSelected, value]
         }
      })
   }

   const handleAlgorithmChange = (event) => {
      setAlgorithm(event.target.value)
   }

   const handleSubmit = async () => {
      try {
         const response = await fetch(predictRoute, {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
            },
            body: JSON.stringify({
               symptoms: selectedSymptoms,
               algorithm: algorithm,
               listsymptoms: symptomsList[0]?.sname, // Use optional chaining
               pasthistory: pasthistory,
            }),
         })

         if (response.ok) {
            const result = await response.json()
            setPredictedDisease(result.predicted_disease)
            setAccuracy(result.accuracy)
            setPredictionError(null)
         } else {
            setPredictionError('Failed to get prediction. Please try again later.')
            console.error(
               'Failed to get prediction. Server returned:',
               response.status,
               response.statusText,
            )
         }
      } catch (error) {
         setPredictionError('Error getting prediction. Please try again later.')
         console.error('Error:', error)
      }
   }

   const fetchMedicationAndNutrient = async () => {
      try {
         const response = await fetch(predictAndSuggestRoute, {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
            },
            body: JSON.stringify({
               symptoms: selectedSymptoms,
               disease: predictedDisease,
            }),
         })

         if (response.ok) {
            const result = await response.json()
            console.log(result)
            setSuggestion(result.generated_text)
         } else {
            throw new Error(
               `Failed to fetch medication and nutrient. Server returned: ${response.status} ${response.statusText}`,
            )
         }
      } catch (error) {
         console.error('Error fetching medication and nutrient:', error.message)
      }
   }

   const handleClearAll = () => {
      setSelectedSymptoms([])
   }

   const handleClearPredictions = () => {
      setPredictedDisease('')
      setAccuracy(null)
      setSuggestion('')
   }

   return (
      <>
         <UserCard username={username} userrole={role} />
         <div className="flex flex-row justify-between p-4">
            <div className="flex flex-row  ml-8 w-5/5 ">
               {activeSection === 'selectSymptoms' && (
                  <>
                     <div className="flex  flex-col w-1/3  bg-purple-300/10 p-6 rounded-lg shadow-md ">
                        <div className="mt-4">
                           <h2 className="text-xl font-bold mb-2 text-gray-800">
                              Disease Prediction
                           </h2>

                           {symptomsError && (
                              <p className="text-red-600">{symptomsError}</p>
                           )}
                           {symptomsLoaded ? (
                              <form>
                                 <div className="mb-4">
                                    <label
                                       htmlFor="algorithm"
                                       className="block text-gray-700 text-sm font-bold mb-2"
                                    >
                                       Algorithm
                                    </label>
                                    <select
                                       id="algorithm"
                                       name="algorithm"
                                       className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                       onChange={handleAlgorithmChange}
                                       value={algorithm}
                                    >
                                       {algorithmOptions.map((option) => (
                                          <option key={option} value={option}>
                                             {option}
                                          </option>
                                       ))}
                                    </select>
                                 </div>

                                 <div className="flex">
                                    <button
                                       type="button"
                                       className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2"
                                       onClick={handleSubmit}
                                    >
                                       Predict Disease
                                    </button>
                                    <button
                                       type="button"
                                       className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                       onClick={handleClearPredictions}
                                    >
                                       Clear Predicted Results
                                    </button>
                                 </div>
                              </form>
                           ) : (
                              <p>Loading symptoms...</p>
                           )}

                           {predictionError && (
                              <p className="text-red-600">{predictionError}</p>
                           )}

                           {predictedDisease !== null && (
                              <div className="mt-4">
                                 <p className="text-gray-800">
                                    Predicted Disease: <strong>{predictedDisease}</strong>
                                 </p>
                                 {accuracy !== null && (
                                    <p className="text-gray-800">
                                       Accuracy: <strong>{accuracy}%</strong>
                                    </p>
                                 )}
                              </div>
                           )}
                        </div>
                     </div>
                     <div className="flex p-6 ml-5 flex-col w-4/5 mr-4  bg-purple-300/10 rounded-lg shadow-md ">
                        <div className="mb-4">
                           <label
                              htmlFor="search"
                              className="block text-gray-700 text-sm font-bold mb-2"
                           >
                              Search Symptoms
                           </label>
                           <input
                              type="text"
                              id="search"
                              name="search"
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                           />
                        </div>
                        {symptomsError && <p className="text-red-600">{symptomsError}</p>}
                        {symptomsLoaded ? (
                           <form>
                              <div className="mb-4">
                                 <label className="block text-gray-700 text-sm font-bold mb-2">
                                    Select Symptoms
                                 </label>
                                 <div className="flex">
                                    <div className="mb-4 max-h-80 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                       {symptomsList.map((category, index) => (
                                          <div
                                             key={index}
                                             className="bg-white w-fit p-4 rounded-md "
                                          >
                                             <p className="text-blue-600 font-semibold mb-1">
                                                {category.category}
                                             </p>
                                             {category.sname
                                                .filter((symptom) =>
                                                   symptom
                                                      .toLowerCase()
                                                      .includes(searchTerm.toLowerCase()),
                                                )
                                                .sort()
                                                .map((symptom, innerIndex) => (
                                                   <div
                                                      key={`${index}-${innerIndex}`}
                                                      className="mb-2 flex items-center"
                                                   >
                                                      <input
                                                         type="checkbox"
                                                         id={`symptom-${index}-${innerIndex}`}
                                                         value={symptom}
                                                         checked={selectedSymptoms.includes(
                                                            symptom,
                                                         )}
                                                         onChange={handleSymptomToggle}
                                                         className="mr-2 cursor-pointer text-blue-500"
                                                      />
                                                      <label
                                                         htmlFor={`symptom-${index}-${innerIndex}`}
                                                         className="text-gray-800"
                                                      >
                                                         {symptom}
                                                      </label>
                                                   </div>
                                                ))}
                                          </div>
                                       ))}
                                    </div>
                                    <button
                                       type="button"
                                       className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                       onClick={handleClearAll}
                                    >
                                       Clear All
                                    </button>
                                    <div className="flex flex-wrap items-center mt-4 ml-8">
                                       {selectedSymptoms.map((symptom, index) => (
                                          <span
                                             key={index}
                                             className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2"
                                          >
                                             {symptom}
                                          </span>
                                       ))}
                                    </div>
                                 </div>
                              </div>
                           </form>
                        ) : (
                           <p>Loading symptoms...</p>
                        )}
                     </div>
                  </>
               )}
            </div>

            {activeSection === 'medicationNutrient' && (
               <div className="flex flex-col w-full mr-7  bg-purple-300/10 p-6 rounded-lg shadow-md ">
                  <h2 className="text-xl font-bold mb-2 text-gray-800">
                     Medication and Nutrient Suggestions
                  </h2>
                  <p className="text-gray-600">
                     Based on the predicted disease and selected symptoms.
                  </p>
                  <button
                     type="button"
                     className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-4"
                     onClick={fetchMedicationAndNutrient}
                  >
                     Get Suggestions
                  </button>

                  {Suggestion !== '' ? (
                     <div className="mt-4">
                        <p className="text-gray-800 whitespace-pre-line">{Suggestion}</p>
                     </div>
                  ) : (
                     <p className="mt-4 text-gray-800">No suggestions available.</p>
                  )}
               </div>
            )}

            <div className="flex flex-col shadow-md w-10 h-16 bg-gray-300 rounded-md  p-2">
               <Link
                  className={` rounded-md text-md hover:bg-white shadow-inner text-black ${
                     activeSection === 'selectSymptoms'
                  }`}
                  onClick={() => setActiveSection('selectSymptoms')}
               >
                  <TiArrowSortedUp size={24} />
               </Link>

               <Link
                  className={`rounded-md text-md hover:bg-white shadow-inner text-black ${
                     activeSection === 'medicationNutrient'
                  }`}
                  onClick={() => setActiveSection('medicationNutrient')}
               >
                  <TiArrowSortedDown size={24} />
               </Link>
            </div>
         </div>
      </>
   )
}

export default PatientDashboard
