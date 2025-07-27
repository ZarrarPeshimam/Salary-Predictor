// src/components/Dashboard.jsx
import React from "react";
import "./Dashboard.css";
import SalaryDistributionChart from "./SalaryDistributionChart";
import SalaryForm from "./SalaryForm";
import SalaryChart from "./SalaryChart";

const Dashboard = () => {
  const mockMSE = 71176790.36;
  const mockR2 = 0.973;

  return (
    <div className="dashboard">
      <nav className="navbar">
        <h1 className="navbar-title">Salary Predictor</h1>
        <a href="https://github.com/ZarrarPeshimam/Salary-Predictor"><img src="./git.png" alt="git-hub" /></a>
      </nav>
      <div className="intro-section">
        <img
          src="https://www.ibm.com/content/dam/connectedassets-adobe-cms/worldwide-content/creative-assets/s-migr/ul/g/18/f9/ibm_logo_pos_blue60_rgb.png/_jcr_content/renditions/cq5dam.thumbnail.1280.1280.png"
          alt="Logo"
          className="intro-logo"
        />
        <div className="intro-text">
          <h2>Welcome to the Salary Predictor</h2>
          <p>
            This project was developed as part of {"IBM Virtual Internship Program"}.
            <br />
            Website is a working prototype that allows users to get prediction on there salary based on their personal information.
            A model was trained on a dataset to predict salaries based on various features such as age, Education, Job Title, etc.
          </p>
        </div>
      </div>
      <div className="metrics-grid">
        <div className="metric-card">
          <p className="metric-label">Mean Squared Error (MSE)</p>
          <p className="metric-value">{mockMSE}</p>
        </div>
        <div className="metric-card">
          <p className="metric-label">R² Score</p>
          <p className="metric-value">{mockR2}</p>
        </div>
      </div>
      <SalaryForm />
    </div>
  );
};

export default Dashboard;
