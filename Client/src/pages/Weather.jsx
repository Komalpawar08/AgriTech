import React, { useState } from 'react';
import { Row, Col, Form, Button, Alert, Spinner } from 'react-bootstrap';
import {
  FaCloudSun, FaThermometerHalf, FaTint, FaWind,
  FaCompressArrowsAlt, FaSearch, FaLocationArrow
} from 'react-icons/fa';
import { WiDaySunny, WiCloudy, WiRain, WiSnow, WiThunderstorm } from 'react-icons/wi';
import AppNavbar from '../components/Navbar';
import Footer from '../components/Footer';
import { weatherService } from '../services/api';

const getWeatherIcon = (description = '') => {
  const d = description.toLowerCase();
  if (d.includes('rain')) return <WiRain style={{ fontSize: '5rem', color: '#74b9ff' }} />;
  if (d.includes('snow')) return <WiSnow style={{ fontSize: '5rem', color: '#dfe6e9' }} />;
  if (d.includes('thunder')) return <WiThunderstorm style={{ fontSize: '5rem', color: '#fdcb6e' }} />;
  if (d.includes('cloud')) return <WiCloudy style={{ fontSize: '5rem', color: '#b2bec3' }} />;
  return <WiDaySunny style={{ fontSize: '5rem', color: '#fdcb6e' }} />;
};

export default function Weather() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [unconfigured, setUnconfigured] = useState(false);

  const fetchWeather = async (cityName) => {
    if (!cityName.trim()) { setError('Please enter a city name.'); return; }
    setLoading(true); setError(''); setWeather(null); setUnconfigured(false);
    try {
      const res = await weatherService.getWeather(cityName);
      setWeather(res.data);
    } catch (err) {
      const msg = err.response?.data?.message || '';
      if (err.response?.status === 503 || msg.includes('not configured')) {
        setUnconfigured(true);
      } else {
        setError(err.response?.data?.message || 'City not found or service unavailable.');
      }
    } finally { setLoading(false); }
  };

  const handleSubmit = e => { e.preventDefault(); fetchWeather(city); };

  const handleGeolocate = () => {
    if (!navigator.geolocation) { setError('Geolocation not supported.'); return; }
    navigator.geolocation.getCurrentPosition(
      async pos => {
        const { latitude, longitude } = pos.coords;
        setLoading(true); setError('');
        try {
          const res = await weatherService.getWeather(`lat=${latitude}&lon=${longitude}`);
          setWeather(res.data);
          setCity(res.data.city);
        } catch { setError('Could not get weather for your location.'); }
        finally { setLoading(false); }
      },
      () => setError('Location access denied.')
    );
  };

  return (
    <>
      <AppNavbar />
      <div style={{ minHeight: '85vh', padding: '2rem 0', background: 'linear-gradient(135deg, #0096c7 0%, #023e8a 100%)' }}>
        <div className="container">
          <div className="text-center mb-5">
            <h1 style={{ color: '#fff', fontWeight: 700, fontSize: '2.5rem' }}>
              <FaCloudSun className="me-3" />Weather Forecast
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.8)' }}>Real-time weather data for your farming area</p>
          </div>

          <Row className="justify-content-center mb-4">
            <Col md={6}>
              <Form onSubmit={handleSubmit}>
                <div className="d-flex gap-2">
                  <Form.Control
                    id="weather-city"
                    type="text"
                    value={city}
                    onChange={e => setCity(e.target.value)}
                    placeholder="Enter city name (e.g. Mumbai)"
                    style={{ borderRadius: 10, border: 'none', padding: '0.75rem 1rem' }}
                  />
                  <Button type="submit" variant="light" style={{ borderRadius: 10, fontWeight: 600 }}>
                    <FaSearch />
                  </Button>
                  <Button type="button" variant="outline-light" style={{ borderRadius: 10 }} onClick={handleGeolocate} title="Use my location">
                    <FaLocationArrow />
                  </Button>
                </div>
              </Form>
            </Col>
          </Row>

          {error && (
            <Row className="justify-content-center">
              <Col md={6}>
                <Alert variant="danger">{error}</Alert>
              </Col>
            </Row>
          )}

          {unconfigured && (
            <Row className="justify-content-center">
              <Col md={8}>
                <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 16, padding: '2rem', color: '#fff', backdropFilter: 'blur(10px)' }}>
                  <h5>⚙️ Weather API Not Configured</h5>
                  <p>To enable live weather data, add your OpenWeatherMap API key to the server environment:</p>
                  <code style={{ background: 'rgba(0,0,0,0.3)', padding: '0.5rem 1rem', borderRadius: 8, display: 'block' }}>
                    OPENWEATHER_API_KEY=your_api_key_here
                  </code>
                  <p className="mt-3 mb-0 opacity-75">
                    Get a free key at <a href="https://openweathermap.org/api" target="_blank" rel="noopener noreferrer" style={{ color: '#74b9ff' }}>openweathermap.org</a>
                  </p>
                </div>
              </Col>
            </Row>
          )}

          {loading && (
            <div className="text-center py-4">
              <Spinner animation="border" variant="light" style={{ width: '3rem', height: '3rem' }} />
            </div>
          )}

          {weather && (
            <Row className="justify-content-center">
              <Col md={8}>
                <div className="weather-widget fade-in-up">
                  <Row className="align-items-center">
                    <Col sm={6}>
                      <div style={{ fontSize: '1.25rem', opacity: 0.85, marginBottom: '0.5rem' }}>
                        📍 {weather.city}, {weather.country}
                      </div>
                      <div className="weather-temp">{Math.round(weather.temperature)}°C</div>
                      <div style={{ fontSize: '1.1rem', textTransform: 'capitalize', opacity: 0.9, marginTop: '0.5rem' }}>
                        {weather.description}
                      </div>
                      <div style={{ opacity: 0.75, fontSize: '0.9rem', marginTop: '0.25rem' }}>
                        Feels like {Math.round(weather.feelsLike)}°C
                      </div>
                    </Col>
                    <Col sm={6} className="text-center">
                      {getWeatherIcon(weather.description)}
                    </Col>
                  </Row>
                  <hr style={{ borderColor: 'rgba(255,255,255,0.3)' }} />
                  <Row className="g-3 text-center">
                    {[
                      { icon: <FaTint />, label: 'Humidity', value: `${weather.humidity}%` },
                      { icon: <FaWind />, label: 'Wind', value: `${weather.windSpeed} m/s` },
                      { icon: <FaCompressArrowsAlt />, label: 'Pressure', value: `${weather.pressure} hPa` },
                      { icon: <FaThermometerHalf />, label: 'Min/Max', value: `${Math.round(weather.tempMin)}° / ${Math.round(weather.tempMax)}°` },
                    ].map((item, i) => (
                      <Col key={i} xs={6} md={3}>
                        <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 12, padding: '1rem' }}>
                          <div style={{ fontSize: '1.4rem', marginBottom: '0.25rem' }}>{item.icon}</div>
                          <div style={{ fontWeight: 700 }}>{item.value}</div>
                          <div style={{ opacity: 0.7, fontSize: '0.8rem' }}>{item.label}</div>
                        </div>
                      </Col>
                    ))}
                  </Row>
                </div>
              </Col>
            </Row>
          )}

          {!weather && !loading && !unconfigured && !error && (
            <Row className="justify-content-center">
              <Col md={6} className="text-center" style={{ color: 'rgba(255,255,255,0.7)', paddingTop: '2rem' }}>
                <FaCloudSun style={{ fontSize: '5rem', marginBottom: '1rem', opacity: 0.5 }} />
                <p>Enter a city name above to get the current weather</p>
              </Col>
            </Row>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
