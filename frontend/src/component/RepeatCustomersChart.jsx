import React, { useEffect, useState } from 'react';
import { Radar, Bar } from 'react-chartjs-2';
import axios from 'axios';

const RepeatCustomersChart = () => {
    const [chartData, setChartData] = useState({
        labels: [],
        radarData: [],
        barData: []
    });
    const [interval, setInterval] = useState('monthly'); // Default to monthly

    useEffect(() => {
        axios.get(`http://localhost:8000/api/customers/repeat-customers?interval=${interval}`)
            .then(response => {
                if (response.data && response.data.labels && response.data.repeatCustomers) {
                    setChartData({
                        labels: response.data.labels,
                        radarData: response.data.repeatCustomers,
                        barData: response.data.repeatCustomers.map(data => data * 2) // Example transformation for bar chart
                    });
                } else {
                    console.error('Unexpected data format:', response.data);
                }
            })
            .catch(error => {
                console.error('Error fetching repeat customers data:', error);
            });
    }, [interval]);

    const handleIntervalChange = (e) => {
        setInterval(e.target.value);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <h2>Number of Repeat Customers Over Time</h2>
            <div style={{ width: '70%' }}>
                <label>
                    Select Interval: 
                    <select value={interval} onChange={handleIntervalChange}>
                        <option value="yearly">Yearly</option>
                        <option value="quarterly">Quarterly</option>
                        <option value="monthly">Monthly</option>
                        <option value="daily">Daily</option>
                    </select>
                </label>
                <h2>Radar Chart</h2>
                {chartData.labels.length > 0 ? (
                    <Radar 
                        data={{
                            labels: chartData.labels,
                            datasets: [{
                                label: 'Repeat Customers',
                                data: chartData.radarData,
                                backgroundColor: 'rgba(54, 162, 235, 0.6)',
                                borderColor: 'rgba(54, 162, 235, 1)',
                                borderWidth: 1,
                                pointBackgroundColor: 'rgba(54, 162, 235, 1)',
                                pointBorderColor: '#fff',
                                pointHoverBackgroundColor: '#fff',
                                pointHoverBorderColor: 'rgba(54, 162, 235, 1)',
                                fill: true,
                            }]
                        }}
                        options={{
                            responsive: true,
                            scales: {
                                r: {
                                    angleLines: {
                                        display: true
                                    },
                                    suggestedMin: 0,
                                    suggestedMax: Math.max(...chartData.radarData || [10]) + 10,
                                    ticks: {
                                        beginAtZero: true
                                    },
                                    pointLabels: {
                                        font: {
                                            size: 14
                                        }
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
                                    text: `Number of Repeat Customers Over Time (${interval.charAt(0).toUpperCase() + interval.slice(1)})`,
                                },
                            },
                        }}
                    />
                ) : (
                    <p>Loading data...</p>
                )}
            </div>

            <div style={{ width: '70%' }}>
                <h2>Bar Chart</h2>
                {chartData.labels.length > 0 ? (
                    <Bar 
                        data={{
                            labels: chartData.labels,
                            datasets: [{
                                label: 'Repeat Customers (Bar)',
                                data: chartData.barData,
                                backgroundColor: 'rgba(255, 99, 132, 0.6)',
                                borderColor: 'rgba(255, 99, 132, 1)',
                                borderWidth: 1,
                                hoverBackgroundColor: 'rgba(255, 99, 132, 0.8)',
                                hoverBorderColor: 'rgba(255, 99, 132, 1)',
                            }]
                        }}
                        options={{
                            responsive: true,
                            scales: {
                                x: {
                                    title: {
                                        display: true,
                                        text: 'Time Interval'
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
                                    text: `Repeat Customers (Bar Chart) - ${interval.charAt(0).toUpperCase() + interval.slice(1)}`,
                                },
                            },
                        }}
                    />
                ) : (
                    <p>Loading data...</p>
                )}
            </div>
        </div>
    );
};

export default RepeatCustomersChart;
