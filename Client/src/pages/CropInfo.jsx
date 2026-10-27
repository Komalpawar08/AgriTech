import React from 'react';
import { Row, Col, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import AppNavbar from '../components/Navbar';
import Footer from '../components/Footer';

const cropData = [
  {
    emoji: '🌾',
    name: 'Wheat',
    season: 'Rabi (Oct-Mar)',
    soil: 'Loamy, well-drained',
    temp: '12-25°C',
    water: 'Moderate (450-650mm)',
    duration: '90-120 days',
    tips: ['Sow seeds 2-3 cm deep', 'Apply nitrogen fertilizer at tillering stage', 'Irrigate at crown root stage'],
    yield: '3-5 tonnes/ha',
  },
  {
    emoji: '🌾',
    name: 'Rice',
    season: 'Kharif (Jun-Nov)',
    soil: 'Clay, waterlogged',
    temp: '20-35°C',
    water: 'High (1200-1800mm)',
    duration: '90-150 days',
    tips: ['Transplant seedlings 30 days old', 'Maintain 5cm water level', 'Apply phosphorus at planting'],
    yield: '4-6 tonnes/ha',
  },
  {
    emoji: '🌽',
    name: 'Maize',
    season: 'Kharif & Rabi',
    soil: 'Sandy loam to clay loam',
    temp: '18-32°C',
    water: 'Moderate (500-800mm)',
    duration: '70-100 days',
    tips: ['Plant 25cm apart in rows', 'Top-dress with urea at knee height', 'Critical watering at tasseling'],
    yield: '5-8 tonnes/ha',
  },
  {
    emoji: '🍅',
    name: 'Tomato',
    season: 'Year-round (tropical)',
    soil: 'Sandy loam, pH 6-7',
    temp: '18-28°C',
    water: 'Regular drip irrigation',
    duration: '60-80 days',
    tips: ['Stake plants for support', 'Prune suckers regularly', 'Watch for fungal diseases'],
    yield: '20-40 tonnes/ha',
  },
  {
    emoji: '🥔',
    name: 'Potato',
    season: 'Rabi (Oct-Feb)',
    soil: 'Loose, well-drained loam',
    temp: '10-20°C',
    water: 'Frequent, shallow',
    duration: '70-100 days',
    tips: ['Plant tubers 30cm apart', 'Earth up when plants are 20cm', 'Avoid overwatering to prevent rot'],
    yield: '20-30 tonnes/ha',
  },
  {
    emoji: '🧅',
    name: 'Onion',
    season: 'Rabi (Nov-Apr)',
    soil: 'Well-drained loam',
    temp: '12-25°C',
    water: 'Regular, stop 15 days before harvest',
    duration: '100-130 days',
    tips: ['Transplant seedlings 6 weeks old', 'Avoid high nitrogen', 'Harvest when tops fall over'],
    yield: '20-25 tonnes/ha',
  },
  {
    emoji: '🫘',
    name: 'Soybean',
    season: 'Kharif (Jun-Oct)',
    soil: 'Clay loam, pH 6-7',
    temp: '20-30°C',
    water: 'Moderate (450-700mm)',
    duration: '90-120 days',
    tips: ['Inoculate seeds with Rhizobium', 'Avoid waterlogging', 'Harvest when 95% pods are mature'],
    yield: '2-3 tonnes/ha',
  },
  {
    emoji: '🥦',
    name: 'Cabbage',
    season: 'Rabi (Sep-Jan)',
    soil: 'Rich, well-drained',
    temp: '10-18°C',
    water: 'Regular, consistent',
    duration: '60-90 days',
    tips: ['Transplant at 4-6 leaf stage', 'Apply boron to prevent hollow stem', 'Control aphids early'],
    yield: '25-40 tonnes/ha',
  },
];

export default function CropInfo() {
  return (
    <>
      <AppNavbar />
      <div style={{ minHeight: '85vh', background: 'var(--bg-light)', padding: '2rem 0' }}>
        <Container>
          <div className="page-header mb-5">
            <h1>🌿 Crop Information Guide</h1>
            <p className="mb-0" style={{ opacity: 0.85 }}>
              Detailed growing guides, soil requirements, and best practices for major crops
            </p>
          </div>

          <Row className="g-4">
            {cropData.map((crop, i) => (
              <Col key={i} md={6} lg={4}>
                <div className="crop-card">
                  <div className="crop-card-header">
                    <span className="crop-emoji">{crop.emoji}</span>
                    <h5 className="fw-700 mb-1">{crop.name}</h5>
                    <small style={{ opacity: 0.85 }}>{crop.season}</small>
                  </div>
                  <div className="p-3">
                    <table className="table table-sm mb-3">
                      <tbody>
                        <tr><td className="text-muted fw-500">Soil</td><td>{crop.soil}</td></tr>
                        <tr><td className="text-muted fw-500">Temperature</td><td>{crop.temp}</td></tr>
                        <tr><td className="text-muted fw-500">Water</td><td>{crop.water}</td></tr>
                        <tr><td className="text-muted fw-500">Duration</td><td>{crop.duration}</td></tr>
                        <tr><td className="text-muted fw-500">Yield</td><td><strong style={{ color: 'var(--primary)' }}>{crop.yield}</strong></td></tr>
                      </tbody>
                    </table>
                    <div>
                      <div className="fw-600 mb-2" style={{ color: 'var(--primary-dark)', fontSize: '0.875rem' }}>
                        💡 Growing Tips
                      </div>
                      <ul className="mb-0" style={{ paddingLeft: '1.2rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        {crop.tips.map((tip, j) => <li key={j}>{tip}</li>)}
                      </ul>
                    </div>
                  </div>
                </div>
              </Col>
            ))}
          </Row>

          <div className="text-center mt-5 p-4 rounded-3" style={{ background: 'var(--accent-light)' }}>
            <h5 style={{ color: 'var(--primary-dark)' }}>Ready to track your crops?</h5>
            <p style={{ color: 'var(--text-muted)' }}>Add your farms and start monitoring crop growth in real-time.</p>
            <Link to="/register" className="btn-agri btn">Get Started Free</Link>
          </div>
        </Container>
      </div>
      <Footer />
    </>
  );
}
