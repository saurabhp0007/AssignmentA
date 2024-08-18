import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import axios from 'axios';

const SalesGrowthRateChart = () => {
    const [growthRateData, setGrowthRateData] = useState({
        labels: [],
        datasets: []
    });

    useEffect(() => {
        axios.get('http://localhost:8000/api/orders/sales-growth-rate')
            .then(response => {
                if (response.data && response.data.labels && response.data.growthRates) {
                    setGrowthRateData({
                        labels: response.data.labels,
                        datasets: [{
                            label: 'Sales Growth Rate (%)',
                            data: response.data.growthRates,
                            backgroundColor: 'rgba(153, 102, 255, 0.6)',
                            borderColor: 'rgba(153, 102, 255, 1)',
                            borderWidth: 1,
                            fill: true,
                        }]
                    });
                } else {
                    console.error('Unexpected data format:', response.data);
                }
            })
            .catch(error => {
                console.error('Error fetching sales growth rate data:', error);
            });
    }, []);

    return (
        <div>
            <h2>Sales Growth Rate Over Time</h2>
            {growthRateData.labels.length > 0 ? (
                <Line 
                    data={growthRateData}
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
                                    text: 'Growth Rate (%)'
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
                                text: 'Sales Growth Rate Over Time',
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

export default SalesGrowthRateChart;
