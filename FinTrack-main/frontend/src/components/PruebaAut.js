/* import React, { useState } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar, Line, Pie } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Title, Tooltip, Legend);

const PruebaAut = () => {
    const generateRandomData = (length = 7) => {
        return Array.from({ length }, () => Math.floor(Math.random() * 100));
    };

    const [barData, setBarData] = useState({
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
        datasets: [
            {
                label: 'Dataset 1',
                data: generateRandomData(),
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
            },
            {
                label: 'Dataset 2',
                data: generateRandomData(),
                backgroundColor: 'rgba(53, 162, 235, 0.5)',
            },
        ],
    });

    const [lineData, setLineData] = useState({
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
        datasets: [
            {
                label: 'Dataset 1',
                data: generateRandomData(),
                borderColor: 'rgba(255, 99, 132, 0.5)',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                fill: true,
            },
            {
                label: 'Dataset 2',
                data: generateRandomData(),
                borderColor: 'rgba(53, 162, 235, 0.5)',
                backgroundColor: 'rgba(53, 162, 235, 0.2)',
                fill: true,
            },
        ],
    });

    const [pieData, setPieData] = useState({
        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        datasets: [
            {
                label: 'Dataset 1',
                data: generateRandomData(6),
                backgroundColor: [
                    'rgba(255, 99, 132, 0.5)',
                    'rgba(53, 162, 235, 0.5)',
                    'rgba(255, 206, 86, 0.5)',
                    'rgba(75, 192, 192, 0.5)',
                    'rgba(153, 102, 255, 0.5)',
                    'rgba(255, 159, 64, 0.5)',
                ],
            },
        ],
    });

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Sample Chart',
            },
        },
    };

    const updateBarData = () => {
        setBarData({
            ...barData,
            datasets: barData.datasets.map(dataset => ({
                ...dataset,
                data: generateRandomData(),
            })),
        });
    };

    const updateLineData = () => {
        setLineData({
            ...lineData,
            datasets: lineData.datasets.map(dataset => ({
                ...dataset,
                data: generateRandomData(),
            })),
        });
    };

    const updatePieData = () => {
        setPieData({
            ...pieData,
            datasets: pieData.datasets.map(dataset => ({
                ...dataset,
                data: generateRandomData(6),
            })),
        });
    };

    return (
        <div style={{ width: '800px', margin: '0 auto' }}>
            <div style={{ marginBottom: '40px' }}>
                <Bar options={options} data={barData} />
                <button onClick={updateBarData} style={{ marginTop: '20px' }}>
                    Update Bar Chart Data
                </button>
            </div>
            <div style={{ marginBottom: '40px' }}>
                <Line options={options} data={lineData} />
                <button onClick={updateLineData} style={{ marginTop: '20px' }}>
                    Update Line Chart Data
                </button>
            </div>
            <div style={{ marginBottom: '40px' }}>
                <Pie options={options} data={pieData} />
                <button onClick={updatePieData} style={{ marginTop: '20px' }}>
                    Update Pie Chart Data
                </button>
            </div>
        </div>
    );
};

export default PruebaAut; */