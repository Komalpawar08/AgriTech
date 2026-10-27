import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { GiWheat } from 'react-icons/gi';

export default function Footer() {
  return (
    <footer className="agri-footer">
      <Container>
        <Row>
          <Col md={4} className="mb-3 mb-md-0">
            <div className="d-flex align-items-center mb-2" style={{ color: '#fff', fontWeight: 700, fontSize: '1.2rem' }}>
              <GiWheat className="me-2" style={{ color: '#95d5b2' }} />
              AgriTech
            </div>
            <p className="mb-0" style={{ fontSize: '0.875rem' }}>
              Empowering farmers with smart technology for a sustainable future.
            </p>
          </Col>
          <Col md={4} className="mb-3 mb-md-0">
            <h6 className="text-white fw-600 mb-3">Quick Links</h6>
            <div className="d-flex flex-column gap-1">
              <Link to="/">Home</Link>
              <Link to="/products">Products</Link>
              <Link to="/crop-info">Crop Info</Link>
              <Link to="/weather">Weather</Link>
            </div>
          </Col>
          <Col md={4}>
            <h6 className="text-white fw-600 mb-3">Account</h6>
            <div className="d-flex flex-column gap-1">
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
              <Link to="/dashboard">Dashboard</Link>
            </div>
          </Col>
        </Row>
        <hr style={{ borderColor: 'rgba(255,255,255,0.15)', margin: '1.5rem 0 1rem' }} />
        <p className="text-center mb-0" style={{ fontSize: '0.8rem' }}>
          © {new Date().getFullYear()} AgriTech Platform. All rights reserved.
        </p>
      </Container>
    </footer>
  );
}
