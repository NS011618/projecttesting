import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Card, Spin, Typography } from 'antd'
import { gethistory } from '../utils/APIRoutes'
import { ClockCircleOutlined } from '@ant-design/icons'

const { Text } = Typography

const PatProfile = () => {
   const [username, setUsername] = useState(null)
   const [records, setRecords] = useState([])
   const [error, setError] = useState(null)
   const [loading, setLoading] = useState(false)

   useEffect(() => {
      const fetchData = async () => {
         setLoading(true)
         try {
            const response = await axios.get(gethistory, {
               params: { username: username },
            })
            const data = Array.isArray(response.data) ? response.data : [response.data]
            setRecords(data)
            setLoading(false)
         } catch (error) {
            console.error('Error fetching data:', error)
            setError('Error fetching data. Please try again.')
            setLoading(false)
         }
      }

      if (username) {
         fetchData()
      }
   }, [username])

   useEffect(() => {
      const storedName = localStorage.getItem('userName')
      if (storedName) {
         setUsername(storedName)
      }
   }, [])

   if (loading) {
      return (
         <div
            style={{
               display: 'flex',
               justifyContent: 'center',
               alignItems: 'center',
               height: '100vh',
            }}
         >
            <Spin size="large" />
         </div>
      )
   }

   if (error) {
      return (
         <div style={{ marginTop: '20px' }}>
            <Text type="danger">{error}</Text>
         </div>
      )
   }

   return (
      <div
         className="flex bg-teal-300/20 shadow-inner"
         style={{ padding: '20px', minHeight: '50vh' }}
      >
         <div className="flex flex-row gap-7">
            <div className="flex flex-col gap-4">
               <Card
                  title="Basic Information"
                  bordered={false}
                  style={{
                     width: '400px',
                     height: 'fit-content',
                     padding: '10px',
                     boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                  }}
               >
                  {records.map((record, index) => (
                     <div key={index}>
                        <div>
                           <strong>Name:</strong> {record.Name}
                        </div>
                        <div>
                           <strong>Age:</strong> {record.Age}
                        </div>
                        <div>
                           <strong>Sex:</strong> {record.Sex}
                        </div>
                     </div>
                  ))}
               </Card>
               <Card
                  title="Timeline"
                  bordered={false}
                  style={{
                     width: '340px',
                     height: 'fit-content',
                     padding: '7px',
                     boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                  }}
               >
                  <div
                     style={{
                        position: 'relative',
                        height: '320px',
                        display: 'flex',
                        flexDirection: 'column',
                     }}
                  >
                     {records.map((record, recordIndex) => {
                        const dates = JSON.parse(record.Dates.replace(/'/g, '"'))
                        return dates.map((date, dateIndex) => {
                           const dotTop = `${(dateIndex / (dates.length - 1)) * 100}%`
                           return (
                              <div
                                 key={`${recordIndex}-${dateIndex}`}
                                 style={{
                                    position: 'absolute',
                                    left: '32.5%',
                                    transform: 'translateX(-50%)',
                                    top: dotTop,
                                    display: 'flex',
                                    alignItems: 'center',
                                 }}
                              >
                                 <div
                                    style={{
                                       width: '12px',
                                       height: '12px',
                                       borderRadius: '50%',
                                       backgroundColor: '#1890ff',
                                    }}
                                 />
                                 <div style={{ marginLeft: '5px', fontSize: '12px' }}>
                                    {date}
                                 </div>
                              </div>
                           )
                        })
                     })}
                     <div
                        style={{
                           position: 'absolute',
                           left: '20%',
                           top: 0,
                           bottom: 0,
                           width: '3px',
                           height: '49vh',
                           backgroundColor: '#1890ff',
                        }}
                     />
                  </div>
               </Card>
            </div>
            <div className="flex flex-col gap-4">
               <Card
                  title="Description"
                  bordered={false}
                  style={{
                     width: '100%',
                     height: 'fit-content',
                     boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                  }}
               >
                  {records.map((record, index) => (
                     <div key={index}>
                        <Text>{record.Description}</Text>
                     </div>
                  ))}
               </Card>
               <Card
                  title="Symptoms"
                  bordered={false}
                  style={{
                     width: '100%',
                     height: 'fit-content',
                     boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                  }}
               >
                  {records.map((record, index) => (
                     <div key={index}>
                        <Text>{record.Keywords}</Text>
                     </div>
                  ))}
               </Card>
               <Card
                  title="Transcription"
                  bordered={false}
                  style={{
                     width: '100%',
                     height: '100%',
                     boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                  }}
               >
                  <div>
                     <Text>
                        {records.map((record, index) => (
                           <div key={index}>
                              <Text>{record.Transcription}</Text>
                           </div>
                        ))}
                     </Text>
                  </div>
               </Card>
            </div>
         </div>
      </div>
   )
}

export default PatProfile
