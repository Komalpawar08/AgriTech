import axios from 'axios';

export const getWeather = async (req, res) => {
  const apiKey = process.env.OPENWEATHER_API_KEY;
  if (!apiKey) {
    return res.status(503).json({ message: 'Weather API not configured. Add OPENWEATHER_API_KEY to .env' });
  }

  const { city } = req.query;
  if (!city) return res.status(400).json({ message: 'City is required.' });

  try {
    let url;
    // Support lat/lon format: "lat=X&lon=Y"
    if (city.startsWith('lat=')) {
      const params = Object.fromEntries(new URLSearchParams(city));
      url = `https://api.openweathermap.org/data/2.5/weather?lat=${params.lat}&lon=${params.lon}&appid=${apiKey}&units=metric`;
    } else {
      url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;
    }

    const response = await axios.get(url);
    const d = response.data;

    res.json({
      city: d.name,
      country: d.sys.country,
      temperature: d.main.temp,
      feelsLike: d.main.feels_like,
      tempMin: d.main.temp_min,
      tempMax: d.main.temp_max,
      description: d.weather[0].description,
      icon: d.weather[0].icon,
      humidity: d.main.humidity,
      windSpeed: d.wind.speed,
      pressure: d.main.pressure,
    });
  } catch (err) {
    if (err.response?.status === 404) {
      return res.status(404).json({ message: 'City not found. Please check the city name.' });
    }
    res.status(500).json({ message: 'Weather service error.' });
  }
};
