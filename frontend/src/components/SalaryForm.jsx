import React, { useState } from 'react';
import axios from 'axios';
import './SalaryForm.css'; // Import the new, simpler CSS file
import JobTitleSelect from "./JobTitleSelect";
import EducationSelect from './EducationSelect';
import { useRef } from "react";
import { motion, useInView } from "framer-motion";


function SimpleSalaryPredictor() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: false, threshold: 0.2 });
  const [form, setForm] = useState({
    age: '',
    gender: '',
    education: '',
    jobTitle: '',
    experience: '',
  });

  const [prediction, setPrediction] = useState(null);
  const [educationLevel, setEducationLevel] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false); // Add loading state
  const [jobTitle, setJobTitle] = useState("");

const handleJobTitleChange = (e) => {
  setJobTitle(e.target.value);
};


  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPrediction(null);
    setError(null);
    setLoading(true); // Set loading to true

    try {
      // Ensure the backend server is running at http://localhost:5000
      const res = await axios.post('https://salary-predictor-backend-app.onrender.com/predict', form);
      console.log("Response from backend:", res.data);
      setPrediction(res.data.salary);
    } catch (err) {
      console.error('Error during prediction:', err);
      // Provide more user-friendly error messages
      if (err.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        setError(`Prediction failed: ${err.response.data.message || 'Server error'}`);
      } else if (err.request) {
        // The request was made but no response was received
        setError('Could not connect to the prediction server. Please ensure it is running.');
      } else {
        // Something happened in setting up the request that triggered an Error
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false); // Always set loading to false
    }
  };

  return (
    <motion.div
      className="simple-predictor-container"
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.5 }}
    >
        <div className="simple-predictor-card">
          <h2 className="simple-predictor-title">Get Your Salary Estimate</h2>
          <p className="simple-predictor-subtitle">Enter your details to predict your potential earnings.</p>

          <form onSubmit={handleSubmit} className="simple-predictor-form">
            <div className="simple-input-group">
              <label htmlFor="age">Age</label>
              <input
                type="number"
                id="age"
                name="age"
                min={21}
                max={60}
                value={form.age}
                onChange={handleChange}
                placeholder="e.g., 30"
                required
              />
            </div>

            <div className="simple-input-group">
              <label htmlFor="gender">Gender</label>
              <select
                id="gender"
                name="gender"
                value={form.gender}
                onChange={handleChange}
                required
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="simple-input-group">
              <label htmlFor="education">Education</label>
              <select
                id="education"
                name="education"
                value={form.education}
                onChange={handleChange}
                required
              >
                <option value="">Select Education</option>
                <option value="High School">High School</option>
                <option value="Bachelor's Degree">Bachelor's Degree</option>
                <option value="Master's Degree">Master's Degree</option>
                <option value="PhD">PhD</option>
              </select>
            </div>


            <div className="simple-input-group">
    <label htmlFor="jobTitle">Job Title</label>
    <JobTitleSelect value={form.jobTitle} onChange={(value) => setForm({ ...form, jobTitle: value })} />
  </div>


            <div className="simple-input-group full-width">
              <label htmlFor="experience">Years of Experience</label>
              <input
                type="number"
                id="experience"
                name="experience"
                value={form.experience}
                onChange={handleChange}
                placeholder="e.g., 5"
                required
              />
            </div>

            <div className="simple-submit-group full-width">
              <button type="submit" disabled={loading}>
                {loading ? 'Predicting...' : 'Predict Salary'}
              </button>
            </div>
          </form>

          {prediction !== null && (
            <div className="simple-prediction-result">
              <p>Estimated Salary:</p>
              <span className="simple-predicted-value">
                ₹{prediction.toLocaleString('en-IN')}
              </span>
            </div>
          )}

          {error && (
            <div className="simple-error-message">
              <p>{error}</p>
            </div>
          )}
        </div>
    </motion.div>
  );
}

export default SimpleSalaryPredictor;