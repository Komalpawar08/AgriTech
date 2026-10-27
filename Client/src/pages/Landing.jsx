import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { GiWheat, GiFarmTractor, GiWateringCan, GiPlantRoots } from 'react-icons/gi';
import { FaCloudSun, FaShoppingBasket, FaChartLine, FaLeaf } from 'react-icons/fa';
import AppNavbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';

const features = [
  { icon: <GiFarmTractor />, title: 'Farm Management', desc: 'Track and manage all your farms in one place with detailed insights.' },
  { icon: <GiPlantRoots />, title: 'Crop Tracking', desc: 'Monitor crop growth, health, and harvest schedules effortlessly.' },
  { icon: <FaCloudSun />, title: 'Weather Forecasts', desc: 'Real-time weather data to plan your farming activities optimally.' },
  { icon: <FaShoppingBasket />, title: 'AgriMarket', desc: 'Browse and order quality agricultural products delivered to you.' },
  { icon: <FaLeaf />, title: 'Crop Information', desc: 'Detailed growing guides and best practices for 20+ crops.' },
  { icon: <FaChartLine />, title: 'Analytics', desc: 'Data-driven insights to maximize your farm\'s productivity.' },
];

const stats = [
  { value: '500+', label: 'Farms Managed' },
  { value: '1200+', label: 'Happy Farmers' },
  { value: '50+', label: 'Crop Varieties' },
  { value: '98%', label: 'Satisfaction Rate' },
];

export default function Landing() {
  const { user } = useAuth();

  return (
    <>
      <AppNavbar />
      {/* Hero */}
      <section className="hero-section">
        <Container>
          <Row className="align-items-center g-5">
            <Col lg={6} className="hero-content fade-in-up">
              <h1 className="hero-title mb-4">
                Smart Farming for a <span>Sustainable</span> Future
              </h1>
              <p className="hero-subtitle mb-5">
                AgriTech empowers farmers with cutting-edge digital tools — manage farms, track crops, 
                get weather forecasts, and order agricultural supplies all in one platform.
              </p>
              <div className="d-flex gap-3 flex-wrap">
                {user ? (
                  <Button as={Link} to="/dashboard" size="lg" className="btn-agri">
                    Go to Dashboard
                  </Button>
                ) : (
                  <>
                    <Button as={Link} to="/register" size="lg" className="btn-agri">
                      Get Started Free
                    </Button>
                    <Button as={Link} to="/login" size="lg" variant="outline-light">
                      Sign In
                    </Button>
                  </>
                )}
              </div>
            </Col>
            <Col lg={6} className="text-center d-none d-lg-block">
              <div style={{ fontSize: '12rem', opacity: 0.9 }}>🌾</div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Stats */}
      <section style={{ background: 'var(--primary)', padding: '3rem 0' }}>
        <Container>
          <Row className="text-center g-4">
            {stats.map((s, i) => (
              <Col key={i} sm={6} md={3}>
                <div style={{ color: '#fff' }}>
                  <div style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--accent)' }}>{s.value}</div>
                  <div style={{ opacity: 0.85, fontWeight: 500 }}>{s.label}</div>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Features */}
      <section style={{ padding: '5rem 0', background: '#fff' }}>
        <Container>
          <div className="text-center mb-5">
            <h2 className="section-title">Everything You Need to Farm Smarter</h2>
            <div className="section-divider mx-auto"></div>
          </div>
          <Row className="g-4">
            {features.map((f, i) => (
              <Col key={i} md={6} lg={4}>
                <div className="feature-card">
                  <div className="feature-icon">{f.icon}</div>
                  <h5 style={{ fontWeight: 700, color: 'var(--primary-dark)' }}>{f.title}</h5>
                  <p style={{ color: 'var(--text-muted)', margin: 0 }}>{f.desc}</p>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* CTA */}
      <section style={{ background: 'var(--accent-light)', padding: '5rem 0' }}>
        <Container className="text-center">
          <h2 className="section-title mb-3">Ready to Transform Your Farm?</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: 500, margin: '0 auto 2rem' }}>
            Join thousands of farmers already using AgriTech to boost their productivity and profits.
          </p>
          {!user && (
            <Button as={Link} to="/register" size="lg" className="btn-agri">
              Start For Free Today
            </Button>
          )}
        </Container>
      </section>

      <Footer />
    </>
  );
}
