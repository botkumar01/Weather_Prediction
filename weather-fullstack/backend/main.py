from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
import requests

app = FastAPI()

# Allow frontend access (CORS)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production: replace with your frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

API_KEY = "444fae008405377f21e5cb2ee4d39e4b"

@app.get("/weather")
def get_weather(city: str = Query(...)):
    geo_url = f"https://api.openweathermap.org/geo/1.0/direct?q={city}&limit=1&appid={API_KEY}"
    geo_res = requests.get(geo_url).json()
    if not geo_res:
        return {"error": "City not found"}

    lat, lon = geo_res[0]["lat"], geo_res[0]["lon"]
    weather_url = f"https://api.openweathermap.org/data/2.5/weather?lat={lat}&lon={lon}&appid={API_KEY}&units=metric"
    weather_res = requests.get(weather_url).json()

    return {
        "city": weather_res["name"],
        "temperature": weather_res["main"]["temp"],
        "humidity": weather_res["main"]["humidity"],
        "description": weather_res["weather"][0]["description"]
    }
