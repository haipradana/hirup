from fastapi import FastAPI, HTTPException, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import joblib
import pandas as pd
import numpy as np
from datetime import datetime
from typing import Optional

# app intitiation
app = FastAPI(title="HIRUP", version="1.0")

# setup CORS (how frontend can access this backend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # url frontent
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Exception handler untuk debug validation errors
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    body = await request.body()
    print(f"Validation error details: {exc.errors()}")
    print(f"Request body: {body.decode()}")
    return JSONResponse(
        status_code=422,
        content={"detail": exc.errors(), "body": body.decode()}
    )

# load models
models = {}

@app.on_event("startup")
def load_models():
    try:
        # Load dictionary lengkap (model + features) 
        est_data = joblib.load('models/rf_pm25_estimator_harian.joblib')
        simp_data = joblib.load('models/rf_pm25_simpel_harian.joblib')
        pro_data = joblib.load('models/rf_pm25_pro_harian.joblib')

        models['estimator'] = est_data['model']
        models['simple'] = simp_data['model']
        models['pro'] = pro_data['model']
        
        print("model berhasil diload!")
    except Exception as e:
        print(f"error loading models: {e}")
        print("Pastikan file .joblib ada di folder yang sama!")

# SKEMA INPUT (PYDANTIC)
# Ini validasi data dari Frontend
class WeatherInput(BaseModel):
    # Parameter Waktu
    prediction_time: str  # Format: "2024-12-31 14:00"
    
    # Parameter Cuaca input
    rr: float
    ws_avg: float
    ws_max: float
    wd_avg: float  # user input derajat (0-360), nanti diconvert
    tt_air_avg: float
    rh_avg: float
    sr_avg: float
    pp_air: float

class SimpleInput(WeatherInput):
    pm25_current: float # Lag-1

class ProInput(WeatherInput):
    pm25_current: float # Lag-1
    pm25_1h_ago: float  # Lag-2

# PREPROCESSING supaya setara dengan kode dan input training
def preprocess_features(data: WeatherInput):

    # Parsing Waktu
    dt = datetime.strptime(data.prediction_time, "%Y-%m-%dT%H:%M") # Sesuaikan format ISO dari frontend
    # hour = dt.hour
    month = dt.month

    # Hitung Sin/Cos Waktu
    # hour_sin = np.sin(2 * np.pi * hour / 24)
    # hour_cos = np.cos(2 * np.pi * hour / 24)
    month_sin = np.sin(2 * np.pi * month / 12)
    month_cos = np.cos(2 * np.pi * month / 12)

    # Hitung Sin/Cos Angin
    # wd_rad = data.wd_avg * np.pi / 180
    wd_rad = np.deg2rad(data.wd_avg)
    wd_sin = np.sin(wd_rad)
    wd_cos = np.cos(wd_rad)

    # Bungkus jadi Dictionary Dasar
    # urutan nanti disesuaikan per model
    processed = {
        'rr': data.rr,
        'ws_avg': data.ws_avg,
        'ws_max': data.ws_max,
        'wd_sin': wd_sin,
        'wd_cos': wd_cos,
        'tt_air_avg': data.tt_air_avg,
        'rh_avg': data.rh_avg,
        'sr_avg': data.sr_avg,
        'pp_air': data.pp_air,
        # 'hour_sin': hour_sin,
        # 'hour_cos': hour_cos,
        'month_sin': month_sin,
        'month_cos': month_cos
    }
    return processed

# ENDPOINTS

@app.get("/")
def home():
    return {"message": "backend hirup: kualitas udara started"}

@app.post("/predict/estimator")
def predict_estimator(input_data: WeatherInput):
    if 'estimator' not in models:
        raise HTTPException(status_code=503, detail="Model not loaded. Please restart the server.")
    
    try:
        # preprocess
        feats = preprocess_features(input_data)
        
        # urutkan kolom sesuai input ML
        feature_order = ['rr', 'ws_avg', 'ws_max', 'wd_sin', 'wd_cos', 
                         'tt_air_avg', 'rh_avg', 'sr_avg', 'pp_air', 
                         'month_sin', 'month_cos']
        
        df_ready = pd.DataFrame([feats])[feature_order]
        
        # prediksi XGBoost (TIDAK pakai inverse - langsung output nilai PM2.5)
        # pred = models['estimator'].predict(df_ready)[0]
        
        # KODE LAMA (pakai log transform):
        pred_log = models['estimator'].predict(df_ready)[0]
        # Inverse log transform (karena model di-train dengan log1p)
        pred = np.expm1(pred_log)
        
        # Validate prediction
        if pred < 0:
            pred = 0.0
        
        return {"predicted_pm25": round(float(pred), 2), "unit": "µg/m³"}
    except Exception as e:
        print(f"Error in estimator prediction: {e}")
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")

@app.post("/predict/simple")
def predict_simple(input_data: SimpleInput):
    if 'simple' not in models:
        raise HTTPException(status_code=503, detail="Model not loaded. Please restart the server.")
    
    try:
        # preprocess base
        feats = preprocess_features(input_data)
        
        # tambah Lag-1
        feats['pm25_lag1'] = input_data.pm25_current
        
        # urutkan kolom
        feature_order = ['rr', 'ws_avg', 'ws_max', 'wd_sin', 'wd_cos', 
                         'tt_air_avg', 'rh_avg', 'sr_avg', 'pp_air', 
                          'month_sin', 'month_cos', 'pm25_lag1']
        
        df_ready = pd.DataFrame([feats])[feature_order]
        
        # prediksi (simple model TIDAK pakai log transform)
        pred = models['simple'].predict(df_ready)[0]
        
        # Validate prediction
        if pred < 0:
            pred = 0.0
        
        return {"predicted_pm25": round(float(pred), 2), "unit": "µg/m³"}
    except Exception as e:
        print(f"Error in simple prediction: {e}")
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")

@app.post("/predict/pro")
def predict_pro(input_data: ProInput):
    if 'pro' not in models:
        raise HTTPException(status_code=503, detail="Model not loaded. Please restart the server.")
    
    try:
        # DEBUG: Print input data
        print(f"DEBUG Pro Input: {input_data.dict()}")
        
        # preprocess base
        feats = preprocess_features(input_data)
        
        # tambah lags
        feats['pm25_lag1'] = input_data.pm25_current
        feats['pm25_lag2'] = input_data.pm25_1h_ago
        # feats['pm25_lag3'] = input_data.pm25_2h_ago
        
        # urutkan kolom
        feature_order = ['rr', 'ws_avg', 'ws_max', 'wd_sin', 'wd_cos', 
                         'tt_air_avg', 'rh_avg', 'sr_avg', 'pp_air',
                         'month_sin', 'month_cos', 
                         'pm25_lag1', 'pm25_lag2']
        
        df_ready = pd.DataFrame([feats])[feature_order]
        
        # prediksi (pro model TIDAK pakai log transform)
        pred = models['pro'].predict(df_ready)[0]
        
        # Validate prediction
        if pred < 0:
            pred = 0.0
        
        return {"predicted_pm25": round(float(pred), 2), "unit": "µg/m³"}
    except Exception as e:
        print(f"Error in pro prediction: {e}")
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")