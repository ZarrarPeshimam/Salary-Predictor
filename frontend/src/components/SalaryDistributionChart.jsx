import React, { useState, useEffect, useMemo } from 'react';
import { usePapaParse } from 'react-papaparse';
import {
  BarChart,
  Bar,
  LineChart, // Needed if we overlay a line
  Line,      // Needed for the KDE approximation
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ComposedChart // Useful for combining Bar and Line charts
} from 'recharts';
import './SalaryDistributionChart.css'; // New CSS file

const SalaryDistributionChart = () => {
  const { readRemoteFile } = usePapaParse();
  const [rawData, setRawData] = useState([]); // Store raw data to process
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const csvFilePath = '/data/Salary_Data.csv'; // Assuming you have a CSV with a 'Salary' column

    readRemoteFile(csvFilePath, {
      header: true,
      dynamicTyping: true, // Crucial for 'Salary' to be numbers
      skipEmptyLines: true,
      complete: (results) => {
        if (results.errors.length) {
          console.error("CSV Parsing Errors:", results.errors);
          setError("Failed to parse CSV data.");
        } else {
          // Filter out rows where 'Salary' might be missing or not a number
          const validSalaries = results.data
            .filter(d => typeof d.Salary === 'number' && !isNaN(d.Salary))
            .map(d => d.Salary);
          setRawData(validSalaries);
        }
        setLoading(false);
      },
      error: (err) => {
        console.error("Error reading CSV file:", err);
        setError("Could not load chart data.");
        setLoading(false);
      },
    });
  }, [readRemoteFile]);

  // --- Data Binning and KDE Approximation ---
  const { histogramData, kdeData } = useMemo(() => {
    if (rawData.length === 0) return { histogramData: [], kdeData: [] };

    const salaries = rawData;
    const minSalary = Math.min(...salaries);
    const maxSalary = Math.max(...salaries);
    const numBins = 30; // Matches your plt.hist bins=30
    const binWidth = (maxSalary - minSalary) / numBins;

    const bins = Array(numBins).fill(0);
    const binEdges = Array.from({ length: numBins + 1 }, (_, i) => minSalary + i * binWidth);

    salaries.forEach(salary => {
      let binIndex = Math.floor((salary - minSalary) / binWidth);
      if (binIndex >= numBins) binIndex = numBins - 1; // Handle max value edge case
      if (binIndex < 0) binIndex = 0; // Handle min value edge case
      bins[binIndex]++;
    });

    // Format for Recharts BarChart
    const histData = bins.map((count, i) => ({
      name: `${Math.round(binEdges[i])}-${Math.round(binEdges[i + 1])}`,
      salaryRange: binEdges[i], // For sorting if needed
      frequency: count,
    }));

    // --- Simple KDE Approximation (for visualization purposes) ---
    // This is NOT a true Kernel Density Estimate.
    // A true KDE requires statistical libraries for kernel smoothing.
    // This just connects the midpoints of the histogram bars to give a smooth curve.
    const kdePoints = histData.map((d, i) => ({
      salaryRange: d.salaryRange + binWidth / 2, // Midpoint of the bin
      density: d.frequency, // Use frequency as a proxy for density for visual overlay
    }));

    // For a smoother KDE line, you might consider a moving average or spline interpolation
    // if you had a lot of data points, but Recharts line will smooth it visually.

    return { histogramData: histData, kdeData: kdePoints };
  }, [rawData]);

  if (loading) {
    return <div className="chart-loading">Loading salary data...</div>;
  }

  if (error) {
    return <div className="chart-error">{error}</div>;
  }

  if (histogramData.length === 0) {
    return <div className="chart-no-data">No salary data available for chart.</div>;
  }

  return (
    <div className="chart-container">
      <h3>Salary Distribution</h3>
      <ResponsiveContainer width="100%" height={400}>
        <ComposedChart
          data={histogramData} // Use histogramData for the bars
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#5c5f72" />
          <XAxis
            dataKey="salaryRange" // Use the numerical bin start for X-axis
            type="number" // Treat X-axis as continuous numerical data
            domain={[minSalary, maxSalary]} // Set domain based on actual salary range
            tickFormatter={(value) => `${Math.round(value)}`} // Format ticks as rounded numbers
            stroke="#e0e0e0"
            tick={{ fill: '#e0e0e0' }}
            label={{ value: 'Salary', position: 'insideBottom', offset: 0, fill: '#e0e0e0' }}
          />
          <YAxis
            stroke="#e0e0e0"
            tick={{ fill: '#e0e0e0' }}
            label={{ value: 'Frequency', angle: -90, position: 'insideLeft', fill: '#e0e0e0' }}
          />
          <Tooltip
            contentStyle={{ backgroundColor: '#3f425c', border: 'none', borderRadius: '8px' }}
            labelStyle={{ color: '#8be9fd', fontWeight: 'bold' }}
            itemStyle={{ color: '#e0e0e0' }}
            formatter={(value, name, props) => {
              if (name === 'Frequency') {
                return [value, `Salary Range: ${Math.round(props.payload.salaryRange)}-${Math.round(props.payload.salaryRange + binWidth)}`];
              }
              return [value, name];
            }}
          />
          <Bar
            dataKey="frequency"
            fill="#8be9fd" // Color for histogram bars
            barSize={binWidth * (800 / (maxSalary - minSalary))} // Adjust bar width based on chart width and bin width
            // A common way to make bars touch for histogram is to set barCategoryGap="0%"
            // but this can look odd if you also have a line
          />
          <Line
            type="monotone" // Creates a smooth curve
            data={kdeData} // Use the KDE-approximated data
            dataKey="density"
            xDataKey="salaryRange" // Map X-axis to the salaryRange from kdeData
            stroke="#ff79c6" // Color for the KDE line
            strokeWidth={2}
            dot={false} // Don't show dots on the line
            legendType="none" // Don't show this line in the legend if not needed
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SalaryDistributionChart;