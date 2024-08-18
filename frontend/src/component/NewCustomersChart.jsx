import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import axios from 'axios';

const NewCustomersChart = () => {
    const [newCustomersData, setNewCustomersData] = useState({
        labels: [],
        datasets: []
    });

    useEffect(() => {
        axios.get('http://localhost:8000/api/customers/new-customers')
            .then(response => {
                if (response.data && response.data.labels && response.data.newCustomers) {
                    setNewCustomersData({
                        labels: response.data.labels,
                        datasets: [{
                            label: 'New Customers',
                            data: response.data.newCustomers,
                            backgroundColor: 'rgba(255, 159, 64, 0.6)',
                            borderColor: 'rgba(255, 159, 64, 1)',
                            borderWidth: 1,
                            fill: true,
                        }]
                    });
                } else {
                    console.error('Unexpected data format:', response.data);
                }
            })
            .catch(error => {
                console.error('Error fetching new customers data:', error);
            });
    }, []);

    return (
        <div>
            <h2>New Customers Added Over Time</h2>
            {newCustomersData.labels.length > 0 ? (
                <Line 
                    data={newCustomersData}
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
                                    text: 'Number of Customers'
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
                                text: 'New Customers Added Over Time',
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

export default NewCustomersChart;
