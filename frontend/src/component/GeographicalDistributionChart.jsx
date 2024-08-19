import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import axios from 'axios';

// Register the required components with Chart.js
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const GeographicalDistributionChart = () => {
    const [geoDistributionData, setGeoDistributionData] = useState({
        labels: [],
        datasets: []
    });

    useEffect(() => {
        axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/customers/geographical-distribution`)
            .then(response => {
                if (response.data && response.data.cities && response.data.customerCount) {
                    setGeoDistributionData({
                        labels: response.data.cities,
                        datasets: [{
                            label: 'Customer Count',
                            data: response.data.customerCount,
                            backgroundColor: 'rgba(75, 192, 192, 0.6)',
                            borderColor: 'rgba(75, 192, 192, 1)',
                            borderWidth: 1,
                        }]
                    });
                } else {
                    console.error('Unexpected data format:', response.data);
                }
            })
            .catch(error => {
                console.error('Error fetching geographical distribution data:', error);
            });
    }, []);

    return (
        <div>
            <h2>Geographical Distribution of Customers</h2>
            {geoDistributionData.labels.length > 0 ? (
                <Bar 
                    data={geoDistributionData}
                    options={{
                        responsive: true,
                        scales: {
                            x: {
                                title: {
                                    display: true,
                                    text: 'City'
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
                                text: 'Geographical Distribution of Customers',
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

export default GeographicalDistributionChart;
