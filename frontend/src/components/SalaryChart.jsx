import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Legend,
  Tooltip
} from "chart.js";
import { Chart } from "react-chartjs-2";
import axios from "axios";

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Legend, Tooltip);

const SalaryChart = () => {
  const [bins, setBins] = useState([]);
  const [frequencies, setFrequencies] = useState([]);
  const [kde, setKde] = useState([]);

  useEffect(() => {
    axios.get("https://salary-predictor-backend-app.onrender.com/salary-data").then((res) => {
      const salaries = res.data;

      // 🔹 Binning logic
      const binSize = 10000;
      const maxSalary = Math.max(...salaries);
      const binCount = Math.ceil(maxSalary / binSize);
      const freq = new Array(binCount).fill(0);

      salaries.forEach((sal) => {
        const binIndex = Math.min(Math.floor(sal / binSize), binCount - 1);
        freq[binIndex]++;
      });

      const binLabels = freq.map((_, i) => `${i * 10}k`);

      // 🔹 KDE (very basic smooth estimate)
      const kdeEstimate = freq.map((_, i, arr) => {
        const prev = arr[i - 1] || 0;
        const curr = arr[i];
        const next = arr[i + 1] || 0;
        return (prev + curr + next) / 3;
      });

      setBins(binLabels);
      setFrequencies(freq);
      setKde(kdeEstimate);
    });
  }, []);

  const data = {
  labels: bins,
  datasets: [
    {
      type: "bar",
      label: "Salary Frequency",
      data: frequencies,
      backgroundColor: "#22c55e", // Tailwind green-500
      borderRadius: 6,
    },
    {
      type: "line",
      label: "KDE Curve",
      data: kde,
      borderColor: "#4ade80", // Tailwind green-400
      tension: 0.4,
      fill: false,
      pointBackgroundColor: "#bbf7d0", // green-200
    },
  ],
};

const options = {
  // ... same structure
  plugins: {
    legend: {
      position: "top",
      labels: {
        color: "#bbf7d0", // green-200
        font: {
          size: 12,
          weight: "500",
        },
      },
    },
    title: {
      display: true,
      text: "Salary Distribution",
      color: "#4ade80", // green-400
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
        color: "#f0fdf4", // very soft green background tone
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
    <div className="p-6 rounded-xl shadow-md overflow-x-auto">
      <h2 className="text-3xl font-bold text-blue-600 mb-4 mt-6 text-center">
      Dataset Distribution
    </h2>
  <Chart type="bar" data={data} options={options} />
</div>
  );
};

export default SalaryChart;
