import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
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

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const TotalSalesChart = () => {
    const [salesData, setSalesData] = useState({
        labels: [],
        datasets: []
    });

    const [orderCountData, setOrderCountData] = useState({
        labels: [],
        datasets: []
    });

    const [averageOrderValueData, setAverageOrderValueData] = useState({
        labels: [],
        datasets: []
    });

    useEffect(() => {
        axios.get('http://localhost:8000/api/orders/total-sales')
            .then(response => {
                if (response.data && response.data.labels && response.data.sales) {
                    // Data for Total Sales Over Time
                    setSalesData({
                        labels: response.data.labels,
                        datasets: [{
                            label: 'Total Sales',
                            data: response.data.sales,
                            backgroundColor: 'rgba(75, 192, 192, 0.6)',
                            borderColor: 'rgba(75, 192, 192, 1)',
                            borderWidth: 1,
                            fill: true,
                        }]
                    });

                    // Data for Number of Orders Over Time
                    setOrderCountData({
                        labels: response.data.labels,
                        datasets: [{
                            label: 'Number of Orders',
                            data: response.data.sales.map(() => 1), // Mock data: 1 order per day (replace with actual order count data)
                            backgroundColor: 'rgba(153, 102, 255, 0.6)',
                            borderColor: 'rgba(153, 102, 255, 1)',
                            borderWidth: 1,
                            fill: true,
                        }]
                    });

                    // Data for Average Order Value Over Time
                    setAverageOrderValueData({
                        labels: response.data.labels,
                        datasets: [{
                            label: 'Average Order Value',
                            data: response.data.sales.map((sales, index) => sales / (response.data.sales.length || 1)), // Replace with actual AOV logic
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
            .catch(error => console.error('Error fetching sales data:', error));
    }, []);

    return (
        <div>
            <div>
                <h3>Total Sales Over Time</h3>
                {salesData.labels.length > 0 ? (
                    <Line 
                        data={salesData} 
                        options={{
                            responsive: true,
                            plugins: {
                                legend: {
                                    position: 'top',
                                },
                                title: {
                                    display: true,
                                    text: 'Total Sales Over Time',
                                },
                            },
                        }}
                        redraw={true} 
                    />
                ) : (
                    <p>Loading data...</p>
                )}
            </div>
            <div>
                <h3>Number of Orders Over Time</h3>
                {orderCountData.labels.length > 0 ? (
                    <Line 
                        data={orderCountData} 
                        options={{
                            responsive: true,
                            plugins: {
                                legend: {
                                    position: 'top',
                                },
                                title: {
                                    display: true,
                                    text: 'Number of Orders Over Time',
                                },
                            },
                        }}
                        redraw={true} 
                    />
                ) : (
                    <p>Loading data...</p>
                )}
            </div>
            <div>
                <h3>Average Order Value Over Time</h3>
                {averageOrderValueData.labels.length > 0 ? (
                    <Line 
                        data={averageOrderValueData} 
                        options={{
                            responsive: true,
                            plugins: {
                                legend: {
                                    position: 'top',
                                },
                                title: {
                                    display: true,
                                    text: 'Average Order Value Over Time',
                                },
                            },
                        }}
                        redraw={true} 
                    />
                ) : (
                    <p>Loading data...</p>
                )}
            </div>
        </div>
    );
};

export default TotalSalesChart;
