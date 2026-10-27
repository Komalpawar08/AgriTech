import React, { useState, useEffect } from 'react';
import { Row, Col, Alert, Spinner, Table, Badge, Button } from 'react-bootstrap';
import { FaUsers, FaBoxOpen, FaShoppingCart, FaTachometerAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import { adminService } from '../../services/api';

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    adminService.getDashboard()
      .then(res => setData(res.data))
      .catch(() => setError('Failed to load dashboard.'))
      .finally(() => setLoading(false));
  }, []);

  const stats = data ? [
    { label: 'Total Users', value: data.totalUsers, icon: <FaUsers />, color: '#2d6a4f' },
    { label: 'Products', value: data.totalProducts, icon: <FaBoxOpen />, color: '#52b788' },
    { label: 'Total Orders', value: data.totalOrders, icon: <FaShoppingCart />, color: '#f4a261' },
    { label: 'Revenue (₹)', value: data.totalRevenue?.toFixed(0) || 0, icon: <FaTachometerAlt />, color: '#0096c7' },
  ] : [];

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="main-content">
        <div className="page-header mb-4">
          <h1>⚙️ Admin Dashboard</h1>
        </div>

        {error && <Alert variant="danger">{error}</Alert>}
        {loading ? (
          <div className="spinner-agri"><Spinner animation="border" variant="success" /></div>
        ) : (
          <>
            <Row className="g-4 mb-4">
              {stats.map((s, i) => (
                <Col key={i} sm={6} xl={3}>
                  <div className="stat-card">
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <div className="stat-value">{s.value}</div>
                        <div className="stat-label">{s.label}</div>
                      </div>
                      <div className="stat-icon" style={{ background: `${s.color}20`, color: s.color }}>
                        {s.icon}
                      </div>
                    </div>
                  </div>
                </Col>
              ))}
            </Row>

            <Row className="g-4">
              <Col md={6}>
                <div className="agri-card">
                  <div className="card-header d-flex justify-content-between align-items-center">
                    <span>Recent Orders</span>
                    <Link to="/admin/orders" className="text-white text-decoration-none" style={{ fontSize: '0.8rem' }}>View All →</Link>
                  </div>
                  <div className="p-0">
                    {data?.recentOrders?.length > 0 ? (
                      <Table responsive className="mb-0" style={{ fontSize: '0.875rem' }}>
                        <thead><tr><th>Product</th><th>Amount</th><th>Status</th></tr></thead>
                        <tbody>
                          {data.recentOrders.map(o => (
                            <tr key={o._id}>
                              <td>{o.product?.name || 'N/A'}</td>
                              <td>₹{o.totalAmount}</td>
                              <td><Badge bg={o.status === 'delivered' ? 'success' : 'warning'}>{o.status}</Badge></td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    ) : <div className="p-3 text-muted text-center">No orders yet</div>}
                  </div>
                </div>
              </Col>
              <Col md={6}>
                <div className="agri-card">
                  <div className="card-header d-flex justify-content-between align-items-center">
                    <span>Quick Actions</span>
                  </div>
                  <div className="p-3 d-flex flex-column gap-2">
                    <Link to="/admin/products" className="btn btn-outline-success">Manage Products</Link>
                    <Link to="/admin/users" className="btn btn-outline-primary">Manage Users</Link>
                    <Link to="/admin/products/new" className="btn-agri btn">Add New Product</Link>
                  </div>
                </div>
              </Col>
            </Row>
          </>
        )}
      </div>
    </div>
  );
}
