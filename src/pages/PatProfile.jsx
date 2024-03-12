import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { getrecords } from '../utils/APIRoutes';
import {
    Container,
    Typography,
    CircularProgress,
    Grid,
    Card,
    CardContent,
    Divider,
    Paper,
} from '@mui/material';

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
        <Container maxWidth="lg" style={{ marginTop: '20px' }}>
            <Typography variant="h4" align="center" gutterBottom>
                Patient Profile Dashboard
            </Typography>
            <Grid container justifyContent="center">
                <Grid item xs={12} md={8}>
                    {loading && <CircularProgress style={{ display: 'block', margin: '0 auto' }} />}
                    {error && (
                        <Typography color="error" align="center" style={{ marginBottom: '20px' }}>
                            {error}
                        </Typography>
                    )}
                    {!loading && records.length === 0 && (
                        <Typography align="center" style={{ marginBottom: '20px' }}>
                            No records found.
                        </Typography>
                    )}
                    {records.map((record, index) => (
                        <Paper key={index} elevation={3} style={{ marginBottom: '20px', padding: '20px' }}>
                            <Typography variant="h6" gutterBottom style={{ marginBottom: '10px' }}>
                                {record.Name}
                            </Typography>
                            <Divider style={{ marginBottom: '10px' }} />
                            <div style={{ marginBottom: '10px' }}>
                                <Typography variant="body1">
                                    <strong>Age:</strong> {record.Age}
                                </Typography>
                                <Typography variant="body1">
                                    <strong>Sex:</strong> {record.Sex}
                                </Typography>
                                <Typography variant="body1">
                                    <strong>Date:</strong> {record.Dates}
                                </Typography>
                            </div>
                            <Typography variant="body1" style={{ marginBottom: '10px' }}>
                                <strong>Description:</strong> {record.Description}
                            </Typography>
                            <Typography variant="body1" style={{ marginBottom: '10px' }}>
                                <strong>Medical Specialty:</strong> {record.Medical_specialty}
                            </Typography>
                            <Typography variant="body1" style={{ marginBottom: '10px' }}>
                                <strong>Sample Name:</strong> {record.Sample_name}
                            </Typography>
                            <Typography variant="body1" style={{ marginBottom: '10px' }}>
                                <strong>Transcription:</strong> {record.Transcription}
                            </Typography>
                            <Typography variant="body1" style={{ marginBottom: '10px' }}>
                                <strong>Keywords:</strong> {record.Keywords}
                            </Typography>
                        </Paper>
                    ))}
                </Grid>
            </Grid>
        </Container>
    );
};

export default PatProfile;
