import React, { useState, useEffect } from 'react';
import { Row, Col, Button, Modal, Form, Alert, Spinner, Badge } from 'react-bootstrap';
import { FaBoxOpen, FaShoppingCart, FaTag } from 'react-icons/fa';
import AppNavbar from '../components/Navbar';
import Footer from '../components/Footer';
import { productService, orderService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [orderModal, setOrderModal] = useState({ show: false, product: null });
  const [qty, setQty] = useState(1);
  const [orderNote, setOrderNote] = useState('');
  const [ordering, setOrdering] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    productService.getAll()
      .then(res => setProducts(res.data))
      .catch(() => setError('Failed to load products.'))
      .finally(() => setLoading(false));
  }, []);

  const openOrder = product => {
    if (!user) { navigate('/login'); return; }
    setOrderModal({ show: true, product });
    setQty(1); setOrderNote(''); setOrderSuccess('');
  };

  const handleOrder = async e => {
    e.preventDefault();
    setOrdering(true);
    try {
      await orderService.create({
        product: orderModal.product._id,
        quantity: qty,
        note: orderNote,
      });
      setOrderSuccess(`Order placed for ${orderModal.product.name}!`);
    } catch (err) {
      setError(err.response?.data?.message || 'Order failed.');
      setOrderModal({ show: false, product: null });
    } finally { setOrdering(false); }
  };

  const categoryColors = {
    Seeds: 'success', Fertilizer: 'warning', Tools: 'primary',
    Pesticide: 'danger', Equipment: 'info', Other: 'secondary'
  };

  return (
    <>
      <AppNavbar />
      <div style={{ padding: '2rem 0', minHeight: '80vh', background: 'var(--bg-light)' }}>
        <div className="container">
          <div className="page-header mb-4">
            <h1>🛒 Agricultural Products</h1>
            <p className="mb-0" style={{ opacity: 0.85 }}>Quality products to boost your farm's productivity</p>
          </div>

          {error && <Alert variant="danger" dismissible onClose={() => setError('')}>{error}</Alert>}

          {loading ? (
            <div className="spinner-agri"><Spinner animation="border" variant="success" /></div>
          ) : products.length === 0 ? (
            <div className="empty-state">
              <FaBoxOpen />
              <h5>No products available</h5>
              <p>Check back later for new products.</p>
            </div>
          ) : (
            <Row className="g-4">
              {products.map(p => (
                <Col key={p._id} sm={6} md={4} lg={3}>
                  <div className="product-card">
                    {p.imageUrl ? (
                      <img src={p.imageUrl} alt={p.name} className="product-img" />
                    ) : (
                      <div className="product-img-placeholder">🌿</div>
                    )}
                    <div className="p-3">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <h6 className="fw-700 mb-0" style={{ color: 'var(--text-dark)' }}>{p.name}</h6>
                        {p.category && (
                          <Badge bg={categoryColors[p.category] || 'secondary'} style={{ fontSize: '0.7rem' }}>
                            {p.category}
                          </Badge>
                        )}
                      </div>
                      {p.description && <p className="text-muted mb-2" style={{ fontSize: '0.8rem' }}>{p.description}</p>}
                      <div className="d-flex justify-content-between align-items-center mt-2">
                        <div>
                          <span style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '1.1rem' }}>
                            ₹{p.price}
                          </span>
                          {p.stock > 0 ? (
                            <span className="text-muted ms-2" style={{ fontSize: '0.75rem' }}>In stock</span>
                          ) : (
                            <span className="text-danger ms-2" style={{ fontSize: '0.75rem' }}>Out of stock</span>
                          )}
                        </div>
                      </div>
                      <Button
                        className="btn-agri w-100 mt-3"
                        size="sm"
                        onClick={() => openOrder(p)}
                        disabled={p.stock === 0}
                      >
                        <FaShoppingCart className="me-1" /> Order Now
                      </Button>
                    </div>
                  </div>
                </Col>
              ))}
            </Row>
          )}
        </div>
      </div>

      <Modal show={orderModal.show} onHide={() => setOrderModal({ show: false, product: null })} centered>
        <Modal.Header closeButton style={{ background: 'var(--primary)', color: '#fff' }}>
          <Modal.Title>Order: {orderModal.product?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {orderSuccess ? (
            <Alert variant="success">
              ✅ {orderSuccess}
              <div className="mt-2">
                <Button size="sm" variant="outline-success" onClick={() => navigate('/my-orders')}>View Orders</Button>
              </div>
            </Alert>
          ) : (
            <Form onSubmit={handleOrder} className="agri-form">
              <div className="d-flex align-items-center gap-2 mb-3 p-3 rounded" style={{ background: 'var(--accent-light)' }}>
                <FaTag style={{ color: 'var(--primary)' }} />
                <div>
                  <div className="fw-600">{orderModal.product?.name}</div>
                  <div style={{ color: 'var(--primary)', fontWeight: 700 }}>₹{orderModal.product?.price} per unit</div>
                </div>
              </div>
              <Form.Group className="mb-3">
                <Form.Label>Quantity</Form.Label>
                <Form.Control
                  id="order-qty"
                  type="number"
                  min="1"
                  max={orderModal.product?.stock || 999}
                  value={qty}
                  onChange={e => setQty(Number(e.target.value))}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Order Notes (optional)</Form.Label>
                <Form.Control id="order-note" as="textarea" rows={2} value={orderNote} onChange={e => setOrderNote(e.target.value)} placeholder="Delivery preferences..." />
              </Form.Group>
              <div className="d-flex justify-content-between align-items-center mb-3 p-2 rounded" style={{ background: '#f8f9fa' }}>
                <span className="fw-600">Total:</span>
                <span style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '1.2rem' }}>
                  ₹{((orderModal.product?.price || 0) * qty).toFixed(2)}
                </span>
              </div>
              <Button type="submit" className="btn-agri w-100" disabled={ordering}>
                {ordering ? <Spinner size="sm" /> : 'Place Order'}
              </Button>
            </Form>
          )}
        </Modal.Body>
      </Modal>

      <Footer />
    </>
  );
}
