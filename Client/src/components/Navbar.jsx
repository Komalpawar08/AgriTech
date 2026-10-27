import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Navbar, Container, Nav, NavDropdown } from 'react-bootstrap';
import { GiWheat } from 'react-icons/gi';
import { FaUser, FaSignOutAlt, FaTachometerAlt } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

export default function AppNavbar() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [expanded, setExpanded] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setExpanded(false);
  };

  const close = () => setExpanded(false);

  return (
    <Navbar className="agri-navbar" expand="lg" expanded={expanded} onToggle={setExpanded}>
      <Container>
        <Navbar.Brand as={Link} to="/" onClick={close}>
          <GiWheat className="me-2" />
          Agri<span>Tech</span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="nav-menu" />
        <Navbar.Collapse id="nav-menu">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/" onClick={close} className={location.pathname === '/' ? 'active' : ''}>Home</Nav.Link>
            <Nav.Link as={Link} to="/products" onClick={close} className={location.pathname === '/products' ? 'active' : ''}>Products</Nav.Link>
            <Nav.Link as={Link} to="/crop-info" onClick={close} className={location.pathname === '/crop-info' ? 'active' : ''}>Crop Info</Nav.Link>
            <Nav.Link as={Link} to="/weather" onClick={close} className={location.pathname === '/weather' ? 'active' : ''}>Weather</Nav.Link>
          </Nav>
          <Nav>
            {user ? (
              <NavDropdown title={<><FaUser className="me-1" />{user.name}</>} id="user-dropdown">
                {isAdmin && (
                  <NavDropdown.Item as={Link} to="/admin" onClick={close}>
                    <FaTachometerAlt className="me-1" /> Admin Panel
                  </NavDropdown.Item>
                )}
                <NavDropdown.Item as={Link} to="/dashboard" onClick={close}>
                  <FaTachometerAlt className="me-1" /> Dashboard
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleLogout}>
                  <FaSignOutAlt className="me-1" /> Logout
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <>
                <Nav.Link as={Link} to="/login" onClick={close} className="me-1">
                  <button className="btn btn-outline-light btn-sm">Login</button>
                </Nav.Link>
                <Nav.Link as={Link} to="/register" onClick={close}>
                  <button className="btn-agri btn btn-sm">Register</button>
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
