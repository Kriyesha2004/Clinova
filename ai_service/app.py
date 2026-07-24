from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import pandas as pd
import os

app = FastAPI(title="Clinova AI Prediction Service")

# Allow requests from the Node.js backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load Models
MODEL_PATH = os.path.join(os.path.dirname(__file__), "best_random_forest_model.joblib")
ENCODER_PATH = os.path.join(os.path.dirname(__file__), "label_encoder.joblib")

try:
    model = joblib.load(MODEL_PATH)
    label_encoder = joblib.load(ENCODER_PATH)
    print("AI Model and Label Encoder loaded successfully.")
except Exception as e:
    print(f"Error loading models: {e}")
    model = None
    label_encoder = None

class PredictionRequest(BaseModel):
    TEM: float
    TMAX: float
    Tm: float
    SLP: float
    H: float
    PP: float
    VV: float
    V: float
    VM: float
    Week: int

@app.get("/")
def health_check():
    return {"status": "ok", "message": "AI Service is running"}

@app.post("/predict")
def predict_dengue_risk(req: PredictionRequest):
    if not model or not label_encoder:
        raise HTTPException(status_code=500, detail="AI Model is not loaded properly.")
    
    try:
        # Construct DataFrame matching training data
        # Ensure column names exactly match the model's expected features
        input_data = pd.DataFrame([{
            "TEM": req.TEM,
            "TMAX": req.TMAX,
            "Tm": req.Tm,
            "SLP": req.SLP,
            "H": req.H,
            "PP": req.PP,
            "VV": req.VV,
            "V": req.V,
            "VM": req.VM,
            "Week": req.Week
        }])
        
        # Predict
        prediction_code = model.predict(input_data)[0]
        probabilities = model.predict_proba(input_data)[0]
        probability = float(probabilities[prediction_code] * 100)
        
        # Inverse transform to get human readable label (e.g. 'High', 'Medium', 'Low')
        prediction_label = label_encoder.inverse_transform([prediction_code])[0]
        
        # Log to the console so the user can see it working!
        print(f"--- New Prediction Request ---")
        print(f"Received Features: {req.model_dump()}")
        print(f"Predicted Risk Level: {prediction_label.upper()} (Code: {int(prediction_code)}), Confidence: {probability:.1f}%")
        print(f"------------------------------")

        return {
            "prediction": prediction_label,
            "risk_level_code": int(prediction_code),
            "probability": round(probability, 1)
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    # Run service on port 8000
    uvicorn.run(app, host="0.0.0.0", port=8000)
