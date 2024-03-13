import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { getrecords } from '../utils/APIRoutes';


const PatProfile = () => {
    const [username, setUsername] = useState(null);
    const [records, setRecords] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await axios.get(getrecords, {
                    params: {
                        username: username,
                    },
                });
                const data = Array.isArray(response.data) ? response.data : [response.data];
                setRecords(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                setError('Error fetching data. Please try again.');
                setLoading(false);
            }
        };

        if (username) {
            fetchData();
        }
    }, [username]);

    useEffect(() => {
        const storedName = localStorage.getItem('userName');
        if (storedName) {
            setUsername(storedName);
        }
    }, []);

    return (
        <div>
            <h1>Patient Profile</h1>
            
            {loading && <p>Loading...</p>}
            {error && <p>{error}</p>}
            <ul>
                {records.map((record) => (
                    <li key={record.id}>{record.name}</li>
                ))}
            </ul>
        </div>
    );
};

export default PatProfile;
