import React, { useState, useEffect } from 'react';
import { Table, Badge, Alert, Spinner } from 'react-bootstrap';
import { FaShoppingCart, FaReceipt } from 'react-icons/fa';
import Sidebar from '../components/Sidebar';
import { orderService } from '../services/api';

const STATUS_VARIANTS = {
  pending: 'warning',
  processing: 'info',
  shipped: 'primary',
  delivered: 'success',
  cancelled: 'danger',
};

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    orderService.getMyOrders()
      .then(res => setOrders(res.data))
      .catch(() => setError('Failed to load orders.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="main-content">
        <div className="page-header mb-4">
          <h1>📦 My Orders</h1>
        </div>

        {error && <Alert variant="danger">{error}</Alert>}

        {loading ? (
          <div className="spinner-agri"><Spinner animation="border" variant="success" /></div>
        ) : orders.length === 0 ? (
          <div className="empty-state">
            <FaShoppingCart />
            <h5>No orders yet</h5>
            <p>Browse our products and place your first order.</p>
          </div>
        ) : (
          <div className="agri-table">
            <Table responsive hover className="mb-0">
              <thead>
                <tr>
                  <th>Order #</th>
                  <th>Product</th>
                  <th>Qty</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order, i) => (
                  <tr key={order._id}>
                    <td>
                      <FaReceipt className="me-1" style={{ color: 'var(--primary)' }} />
                      #{String(i + 1).padStart(4, '0')}
                    </td>
                    <td>{order.product?.name || 'N/A'}</td>
                    <td>{order.quantity}</td>
                    <td style={{ color: 'var(--primary)', fontWeight: 600 }}>₹{order.totalAmount}</td>
                    <td>
                      <Badge bg={STATUS_VARIANTS[order.status] || 'secondary'}>
                        {order.status}
                      </Badge>
                    </td>
                    <td style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}
