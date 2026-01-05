// API Configuration - Change this to your VPS IP
// export const API_BASE_URL = "http://localhost:8000";
export const API_BASE_URL = "https://hirup-backend.pradanayahya.me";

export interface WeatherParams {
  prediction_time: string;
  rr: number;
  ws_avg: number;
  ws_max: number;
  wd_avg: number;
  tt_air_avg: number;
  rh_avg: number;
  sr_avg: number;
  pp_air: number;
}

export interface SimpleParams extends WeatherParams {
  pm25_current: number;
}

export interface ProParams extends SimpleParams {
  pm25_1h_ago: number;
}

export interface PredictionResponse {
  predicted_pm25: number;
  confidence?: number;
  aqi_level?: number;
}

export const predictEstimator = async (params: WeatherParams): Promise<PredictionResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/predict/estimator`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || "Server error. Please try again.");
    }
    
    return response.json();
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error("Cannot connect to server. Make sure the backend is running.");
    }
    throw error;
  }
};

export const predictSimple = async (params: SimpleParams): Promise<PredictionResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/predict/simple`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || "Server error. Please try again.");
    }
    
    return response.json();
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error("Cannot connect to server. Make sure the backend is running.");
    }
    throw error;
  }
};

export const predictPro = async (params: ProParams): Promise<PredictionResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/predict/pro`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || "Server error. Please try again.");
    }
    
    return response.json();
  } catch (error) {
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error("Cannot connect to server. Make sure the backend is running.");
    }
    throw error;
  }
};
