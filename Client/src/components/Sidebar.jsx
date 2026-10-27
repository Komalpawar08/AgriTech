import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  FaTachometerAlt, FaSeedling, FaWarehouse, FaShoppingCart,
  FaCloudSun, FaBoxOpen, FaUsers, FaHome
} from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

export default function Sidebar() {
  const { isAdmin } = useAuth();

  const userLinks = [
    { to: '/dashboard', icon: <FaTachometerAlt />, label: 'Dashboard' },
    { to: '/farms', icon: <FaWarehouse />, label: 'My Farms' },
    { to: '/crops', icon: <FaSeedling />, label: 'My Crops' },
    { to: '/products', icon: <FaBoxOpen />, label: 'Products' },
    { to: '/my-orders', icon: <FaShoppingCart />, label: 'My Orders' },
    { to: '/weather', icon: <FaCloudSun />, label: 'Weather' },
  ];

  const adminLinks = [
    { to: '/admin', icon: <FaTachometerAlt />, label: 'Admin Dashboard' },
    { to: '/admin/users', icon: <FaUsers />, label: 'Users' },
    { to: '/admin/products', icon: <FaBoxOpen />, label: 'Products' },
  ];

  const links = isAdmin ? adminLinks : userLinks;

  return (
    <div className="sidebar">
      {links.map(link => (
        <NavLink
          key={link.to}
          to={link.to}
          end={link.to === '/dashboard' || link.to === '/admin'}
          className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
        >
          {link.icon}
          <span>{link.label}</span>
        </NavLink>
      ))}
    </div>
  );
}
