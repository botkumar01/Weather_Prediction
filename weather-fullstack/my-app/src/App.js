import React, { useState } from 'react';
import './App.css';

function App() {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
  const [weather, setWeather] = useState(null);
  const API_KEY = "444fae008405377f21e5cb2ee4d39e4b";

  const handleInput = async (e) => {
    const input = e.target.value;
    setQuery(input);
    if (input.length < 2) {
      setSuggestions([]);
      return;
    }

    const res = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${input}&limit=5&appid=${API_KEY}`);
    const data = await res.json();
    setSuggestions(data);
  };

  const fetchWeather = async (lat, lon, name) => {
    const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
    const data = await res.json();
    setSelectedCity(name);
    setWeather(data);
    setSuggestions([]);
    setQuery('');
  };

  return (
    <div className="weather-container">
      <h2>🌍 Weather Finder</h2>
      <input
        type="text"
        placeholder="Start typing city name..."
        value={query}
        onChange={handleInput}
      />

      {suggestions.length > 0 && (
        <ul className="suggestion-box">
          {suggestions.map((city, idx) => (
            <li key={idx} onClick={() => fetchWeather(city.lat, city.lon, city.name)}>
              {city.name}, {city.country}
            </li>
          ))}
        </ul>
      )}

      {weather && (
        <div className="weather-card">
          <h3>{selectedCity}</h3>
          <p>🌡️ Temp: {weather.main.temp}°C</p>
          <p>💧 Humidity: {weather.main.humidity}%</p>
          <p>🌥️ Condition: {weather.weather[0].description}</p>
        </div>
      )}
    </div>
  );
}

export default App;
