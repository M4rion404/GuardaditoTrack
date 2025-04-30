/* import React, { useState, useEffect } from 'react';
import { Bar, Line, Pie } from 'react-chartjs-2';
import axios from 'axios';

const PruebaPres = () => {
    const [chartData, setChartData] = useState(null);

    const fetchRandomData = async () => {
        try {
            const response = await axios.get('http://localhost:3000/api/datos'); // Cambia la URL según tu backend
            setChartData(response.data);
        } catch (error) {
            console.error('Error fetching random data:', error);
        }
    };

    useEffect(() => {
        fetchRandomData();
    }, []);

    if (!chartData) {
        return <p>Cargando datos...</p>;
    }

    const barData = {
        labels: chartData.labels,
        datasets: [
            {
                label: 'Bar Chart Data',
                data: chartData.values,
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
            },
        ],
    };

    const lineData = {
        labels: chartData.labels,
        datasets: [
            {
                label: 'Line Chart Data',
                data: chartData.values,
                borderColor: 'rgba(153, 102, 255, 1)',
                fill: false,
            },
        ],
    };

    const pieData = {
        labels: chartData.labels,
        datasets: [
            {
                label: 'Pie Chart Data',
                data: chartData.values,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.6)',
                    'rgba(54, 162, 235, 0.6)',
                    'rgba(255, 206, 86, 0.6)',
                    'rgba(75, 192, 192, 0.6)',
                    'rgba(153, 102, 255, 0.6)',
                ],
            },
        ],
    };

    return (
        <div>
            <h1>Prueba de Gráficos</h1>
            <button onClick={fetchRandomData}>Actualizar Datos</button>
            <div>
                <h2>Bar Chart</h2>
                <Bar data={barData} />
            </div>
            <div>
                <h2>Line Chart</h2>
                <Line data={lineData} />
            </div>
            <div>
                <h2>Pie Chart</h2>
                <Pie data={pieData} />
            </div>
        </div>
    );
};

export default PruebaPres; */