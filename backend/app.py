from flask import Flask, request, jsonify
import numpy as np
import pandas as pd
import pickle

from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Load model and preprocessing objects
with open("model.pkl", "rb") as f:
    model = pickle.load(f)

with open("scaler.pkl", "rb") as f:
    scaler = pickle.load(f)

with open("ohe.pkl", "rb") as f:
    ohe = pickle.load(f)

with open("columns.pkl", "rb") as f:
    feature_columns = pickle.load(f)

# Define input structure
categorical_cols = ['Job Title', 'Education Level', 'Gender']
numeric_cols = ['Age', 'Years of Experience']

@app.route("/salary-data", methods=["GET"])
def salary_data():
    df = pd.read_csv("Salary_Data.csv")  # or use preloaded df
    salary_data = df["Salary"].dropna().tolist()
    return jsonify(salary_data)

@app.route("/predict", methods=["POST"])
def predict():
    data = request.get_json()

    # Step 1: Create DataFrame from input
    input_df = pd.DataFrame([{
        'Job Title': data['jobTitle'],
        'Education Level': data['education'],
        'Gender': data['gender'],
        'Age': data['age'],
        'Years of Experience': data['experience']
    }])

    # Step 2: One-hot encode categorical columns using loaded encoder
    encoded_array = ohe.transform(input_df[categorical_cols])
    encoded_cols = ohe.get_feature_names_out(categorical_cols)
    df_ohe = pd.DataFrame(encoded_array, columns=encoded_cols, index=input_df.index)

    # Step 3: Combine encoded and numeric columns
    df_encoded = pd.concat([input_df.drop(columns=categorical_cols), df_ohe], axis=1)

    # Step 4: Scale numeric features
    df_encoded[numeric_cols] = scaler.transform(df_encoded[numeric_cols])

    # Step 5: Align column order with training data (fill missing columns with 0)
    df_encoded = df_encoded.reindex(columns=feature_columns, fill_value=0)

    # Step 6: Make prediction
    prediction = model.predict(df_encoded)[0]

    # Inverse transform the predicted salary if needed (if you scaled y during training)
    return jsonify({"salary": float(prediction)})

if __name__ == "__main__":
    app.run(debug=True)
