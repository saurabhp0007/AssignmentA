import React, { useEffect, useState } from 'react';
import { Line, PolarArea } from 'react-chartjs-2';
import { Chart as ChartJS, RadialLinearScale, LineElement, PointElement, LineController, CategoryScale, LinearScale, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import axios from 'axios';

// Register necessary components
ChartJS.register(
    RadialLinearScale,
    LineElement,
    PointElement,
    LineController,
    CategoryScale,
    LinearScale,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

const CustomerLifetimeValueChart = () => {
    const [lifetimeValueData, setLifetimeValueData] = useState({
        labels: [],
        datasets: []
    });

    useEffect(() => {
        axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/customers/lifetime-value-cohorts`)
            .then(response => {
                if (response.data && response.data.cohorts && response.data.lifetimeValue) {
                    const chartData = {
                        labels: response.data.cohorts,
                        datasets: [{
                            label: 'Customer Lifetime Value',
                            data: response.data.lifetimeValue,
                            backgroundColor: [
                                'rgba(255, 99, 132, 0.6)',
                                'rgba(54, 162, 235, 0.6)',
                                'rgba(255, 206, 86, 0.6)',
                                'rgba(75, 192, 192, 0.6)',
                                'rgba(153, 102, 255, 0.6)',
                                'rgba(255, 159, 64, 0.6)'
                            ],
                            borderColor: [
                                'rgba(255, 99, 132, 1)',
                                'rgba(54, 162, 235, 1)',
                                'rgba(255, 206, 86, 1)',
                                'rgba(75, 192, 192, 1)',
                                'rgba(153, 102, 255, 1)',
                                'rgba(255, 159, 64, 1)'
                            ],
                            borderWidth: 1,
                        }]
                    };
                    setLifetimeValueData(chartData);
                } else {
                    console.error('Unexpected data format:', response.data);
                }
            })
            .catch(error => {
                console.error('Error fetching customer lifetime value data:', error);
            });

        // Cleanup function to destroy the chart instance before re-creating it
        return () => {
            if (ChartJS.instances.length > 0) {
                ChartJS.instances.forEach(chart => chart.destroy());
            }
        };
    }, []);

    return (
        <div>
            <h2>Customer Lifetime Value by Cohorts</h2>
            {lifetimeValueData.labels.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-around' }}>
                    <div style={{ width: '100%' }}>
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
                                        text: 'Customer Lifetime Value by Cohorts (Line Chart)',
                                    },
                                },
                            }}
                        />
                    </div>
                    <div style={{ width: '100%' }}>
                        <PolarArea
                            data={lifetimeValueData}
                            options={{
                                responsive: true,
                                plugins: {
                                    legend: {
                                        display: true,
                                        position: 'top',
                                    },
                                    title: {
                                        display: true,
                                        text: 'Customer Lifetime Value by Cohorts (Polar Area Chart)',
                                    },
                                },
                                scales: {
                                    r: {
                                        ticks: {
                                            beginAtZero: true
                                        }
                                    }
                                }
                            }}
                            height={400}
                            width={400}
                        />
                    </div>
                </div>
            ) : (
                <p>Loading data...</p>
            )}
        </div>
    );
};

export default CustomerLifetimeValueChart;
