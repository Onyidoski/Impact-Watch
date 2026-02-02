from fastapi import FastAPI
from pydantic import BaseModel
import joblib
import pandas as pd
from preprocess import clean_text
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],
)

print("⏳ Loading AI Models...")
nb_model = joblib.load('naive_bayes_model.pkl')
lr_model = joblib.load('log_reg_model.pkl')
vectorizer = joblib.load('tfidf_vectorizer.pkl')
print("✅ Models Loaded Successfully!")

class AnalysisRequest(BaseModel):
    text: str

@app.post("/analyze")
def analyze_sentiment(request: AnalysisRequest):
    cleaned_text = clean_text(request.text)
    
    vectorized_text = vectorizer.transform([cleaned_text])
    
    prediction_nb = nb_model.predict(vectorized_text)[0]
    probs_nb = nb_model.predict_proba(vectorized_text)[0]
    confidence_nb = max(probs_nb) 
    
    prediction_lr = lr_model.predict(vectorized_text)[0]
    
    return {
        "text": request.text,
        "sentiment": prediction_nb, 
        "confidence": float(f"{confidence_nb:.2f}"), 
        "model_comparison": {
            "naive_bayes": prediction_nb,
            "logistic_regression": prediction_lr
        }
    }

@app.get("/")
def read_root():
    return {"status": "ImpactWatch AI is Online"}