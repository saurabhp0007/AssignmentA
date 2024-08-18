import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import axios from 'axios';

const CustomerLifetimeValueChart = () => {
    const [lifetimeValueData, setLifetimeValueData] = useState({
        labels: [],
        datasets: []
    });

    useEffect(() => {
        axios.get('http://localhost:8000/api/customers/lifetime-value-cohorts')
            .then(response => {
                if (response.data && response.data.cohorts && response.data.lifetimeValue) {
                    setLifetimeValueData({
                        labels: response.data.cohorts,
                        datasets: [{
                            label: 'Customer Lifetime Value',
                            data: response.data.lifetimeValue,
                            backgroundColor: 'rgba(255, 99, 132, 0.6)',
                            borderColor: 'rgba(255, 99, 132, 1)',
                            borderWidth: 1,
                            fill: true,
                        }]
                    });
                } else {
                    console.error('Unexpected data format:', response.data);
                }
            })
            .catch(error => {
                console.error('Error fetching customer lifetime value data:', error);
            });
    }, []);

    return (
        <div>
            <h2>Customer Lifetime Value by Cohorts</h2>
            {lifetimeValueData.labels.length > 0 ? (
                <Line 
                    data={lifetimeValueData}
                    options={{
                        responsive: true,
                        scales: {
                            x: {
                                title: {
                                    display: true,
                                    text: 'Cohort (Month)'
                                }
                            },
                            y: {
                                title: {
                                    display: true,
                                    text: 'Lifetime Value (INR)'
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
                                text: 'Customer Lifetime Value by Cohorts',
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

export default CustomerLifetimeValueChart;
