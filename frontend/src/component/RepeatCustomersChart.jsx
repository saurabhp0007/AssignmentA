import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import axios from 'axios';

const RepeatCustomersChart = () => {
    const [repeatCustomersData, setRepeatCustomersData] = useState({
        labels: [],
        datasets: []
    });

    useEffect(() => {
        axios.get('http://localhost:8000/api/customers/repeat-customers')
            .then(response => {
                if (response.data && response.data.labels && response.data.repeatCustomers) {
                    setRepeatCustomersData({
                        labels: response.data.labels,
                        datasets: [{
                            label: 'Repeat Customers',
                            data: response.data.repeatCustomers,
                            backgroundColor: 'rgba(255, 206, 86, 0.6)',
                            borderColor: 'rgba(255, 206, 86, 1)',
                            borderWidth: 1,
                            fill: true,
                        }]
                    });
                } else {
                    console.error('Unexpected data format:', response.data);
                }
            })
            .catch(error => {
                console.error('Error fetching repeat customers data:', error);
            });
    }, []);

    return (
        <div>
            <h2>Number of Repeat Customers Over Time</h2>
            {repeatCustomersData.labels.length > 0 ? (
                <Line 
                    data={repeatCustomersData}
                    options={{
                        responsive: true,
                        scales: {
                            x: {
                                title: {
                                    display: true,
                                    text: 'Month'
                                }
                            },
                            y: {
                                title: {
                                    display: true,
                                    text: 'Number of Repeat Customers'
                                }
                            }
                        },
                        plugins: {
                            legend: {
                                display: true,
                                position: 'top',
                            },
                            title: {
                                display: true,
                                text: 'Number of Repeat Customers Over Time',
                            },
                        },
                    }}
                />
            ) : (
                <p>Loading data...</p>
            )}
        </div>
    );
};

export default RepeatCustomersChart;
