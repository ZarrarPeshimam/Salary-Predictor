import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Legend,
  Tooltip,
  BarController,
  LineController,
} from "chart.js";
import { Chart } from "react-chartjs-2";
import axios from "axios";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  BarController,
  LineController,
  Legend,
  Tooltip
);

const SalaryChart = () => {
  const [bins, setBins] = useState([]);
  const [frequencies, setFrequencies] = useState([]);
  const [kde, setKde] = useState([]);
  const [loading, setLoading] = useState(true); // ✅ Loading state
  const [error, setError] = useState(null); // Optional: Error state

  useEffect(() => {
    axios
      .get("https://salary-predictor-backend-app.onrender.com/salary-data")
      .then((res) => {
        const salaries = res.data;

        const binSize = 10000;
        const maxSalary = Math.max(...salaries);
        const binCount = Math.ceil(maxSalary / binSize);
        const freq = new Array(binCount).fill(0);

        salaries.forEach((sal) => {
          const binIndex = Math.min(Math.floor(sal / binSize), binCount - 1);
          freq[binIndex]++;
        });

        const binLabels = freq.map((_, i) => `${i * 10}k`);

        const kdeEstimate = freq.map((_, i, arr) => {
          const prev = arr[i - 1] || 0;
          const curr = arr[i];
          const next = arr[i + 1] || 0;
          return (prev + curr + next) / 3;
        });

        setBins(binLabels);
        setFrequencies(freq);
        setKde(kdeEstimate);
        setLoading(false); // ✅ Done loading
      })
      .catch((err) => {
        console.error("Error fetching salary data:", err);
        setError("Failed to load data.");
        setLoading(false);
      });
  }, []);

  const data = {
    labels: bins,
    datasets: [
      {
        type: "bar",
        label: "Salary Frequency",
        data: frequencies,
        backgroundColor: "#22c55e",
        borderRadius: 6,
      },
      {
        type: "line",
        label: "KDE Curve",
        data: kde,
        borderColor: "#4ade80",
        tension: 0.4,
        fill: false,
        pointBackgroundColor: "#bbf7d0",
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: "#bbf7d0",
          font: {
            size: 12,
            weight: "500",
          },
        },
      },
      title: {
        display: true,
        text: "Salary Distribution",
        color: "#4ade80",
        font: {
          size: 18,
          weight: "bold",
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Salary",
          color: "#bbf7d0",
          font: {
            size: 14,
            weight: "bold",
          },
        },
        ticks: {
          color: "#f0fdf4",
        },
      },
      y: {
        title: {
          display: true,
          text: "Frequency",
          color: "#bbf7d0",
          font: {
            size: 14,
            weight: "bold",
          },
        },
        ticks: {
          color: "#f0fdf4",
        },
      },
    },
  };

  return (
    <div className="overflow-x-auto w-full px-4 mx-auto sm:px-6 lg:px-12">
      <h2 className="text-2xl sm:text-3xl font-bold text-blue-600 mb-4 mt-7 text-center">
        Dataset Distribution
      </h2>
      <div className="w-full max-w-5xl mx-auto px-4 shadow-md sm:px-6 lg:px-8">
        <div className="w-full h-[300px] sm:h-[400px] md:h-[550px] flex items-center justify-center">
          {loading ? (
            <p className="text-green-400 text-lg">Loading chart...</p>
          ) : error ? (
            <p className="text-red-500 text-lg">{error}</p>
          ) : (
            <Chart type="bar" data={data} options={{ ...options, maintainAspectRatio: false }} />
          )}
        </div>
      </div>
    </div>
  );
};

export default SalaryChart;
