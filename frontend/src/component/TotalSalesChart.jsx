import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import axios from 'axios';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const SalesDashboard = () => {
    const [totalSalesData, setTotalSalesData] = useState({
        labels: [],
        datasets: []
    });
    const [interval, setInterval] = useState('monthly'); // State to manage the selected interval

    const fetchData = () => {
        axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/orders/total-sales?interval=${interval}`)
            .then(response => {
                if (response.data && response.data.labels && response.data.sales) {
                    setTotalSalesData({
                        labels: response.data.labels,
                        datasets: [{
                            label: 'Total Sales',
                            data: response.data.sales,
                            backgroundColor: 'rgba(75, 192, 192, 0.2)',
                            borderColor: 'rgba(75, 192, 192, 1)',
                            borderWidth: 1,
                            fill: true,
                        }]
                    });
                } else {
                    console.error('Unexpected data format:', response.data);
                }
            })
            .catch(error => {
                console.error('Error fetching total sales data:', error);
            });
    };

    useEffect(() => {
        fetchData();
    }, [interval]); // Fetch data when the interval changes

    return (
        <div>
            <h2>Total Sales Over Time</h2>
            <select onChange={e => setInterval(e.target.value)} value={interval}>
                <option value="daily">Daily</option>
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="yearly">Yearly</option>
            </select>
            {totalSalesData.labels.length > 0 ? (
                <Line 
                    data={totalSalesData}
                    options={{
                        responsive: true,
                        scales: {
                            x: {
                                title: {
                                    display: true,
                                    text: interval === 'daily' ? 'Date' : interval === 'monthly' ? 'Month' : interval === 'quarterly' ? 'Quarter' : 'Year'
                                }
                            },
                            y: {
                                title: {
                                    display: true,
                                    text: 'Sales in INR'
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
                                text: `Total Sales Over Time (${interval.charAt(0).toUpperCase() + interval.slice(1)})`,
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

export default SalesDashboard;
