# 💼 Salary Predictor

A full-stack machine learning-powered web app that predicts salaries based on user input like education level, experience, company size, and job role. Built with **React**, **Flask**, **Tailwind CSS**, and a **Random Forest Regression** model.

> 🚀 **Live Demo:** [https://salary-predictor-three.vercel.app/](https://salary-predictor-three.vercel.app/)  
> 🧠 **Model:** Trained Random Forest Regressor  
> 📊 **Dataset:** [Kaggle - Salary Prediction Dataset](https://www.kaggle.com/datasets/mohithsairamreddy/salary-data)  
> 🧰 **Tech Stack:** MERN (React frontend) + Flask (backend)

---

## 📌 Features

- 🎯 Predicts salary based on multiple parameters
- 📊 Interactive charts to visualize inputs and predictions
- 🧠 ML backend using a trained model (`RandomForestRegressor`)
- ⚡ Fast and responsive UI with Tailwind CSS v4
- 🔗 Seamless integration between React and Flask

---

## 🧠 Tech Stack

| Frontend | Backend | ML Model | Styling | Charts |
|----------|---------|----------|---------|--------|
| React    | Flask   | Random Forest Regressor | Tailwind CSS | Chart.js |

---

## 🗂️ Folder Structure

```bash
Salary-Predictor/
│
├── frontend/         # React frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── public/
│   └── tailwind.config.js
│
├── server/           # Flask backend
│   ├── app.py        # Flask API
│   ├── model.pkl     # Trained ML model
│   └── preprocess.py # Data preprocessing logic
    └── Salary_Prediction_ModelTraining.ipynb # Jupyter Notebook used for training the model
