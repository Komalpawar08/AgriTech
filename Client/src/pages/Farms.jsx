import React, { useState, useEffect } from 'react';
import { Row, Col, Button, Modal, Form, Alert, Spinner, Badge } from 'react-bootstrap';
import { FaWarehouse, FaPlus, FaTrash, FaMapMarkerAlt } from 'react-icons/fa';
import Sidebar from '../components/Sidebar';
import { farmService } from '../services/api';

export default function Farms() {
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', location: '', size: '', description: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchFarms = async () => {
    setLoading(true);
    try {
      const res = await farmService.getAll();
      setFarms(res.data);
    } catch { setError('Failed to load farms.'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchFarms(); }, []);

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.name || !form.location) { setError('Name and location are required.'); return; }
    setSubmitting(true); setError('');
    try {
      await farmService.create(form);
      setSuccess('Farm added successfully!');
      setShowModal(false);
      setForm({ name: '', location: '', size: '', description: '' });
      fetchFarms();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add farm.');
    } finally { setSubmitting(false); }
  };

  const handleDelete = async id => {
    if (!confirm('Delete this farm?')) return;
    try { await farmService.delete(id); fetchFarms(); }
    catch { setError('Failed to delete farm.'); }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="main-content">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div className="page-header flex-grow-1 me-3 mb-0">
            <h1>🏡 My Farms</h1>
          </div>
          <Button className="btn-agri" onClick={() => { setShowModal(true); setError(''); }}>
            <FaPlus className="me-2" />Add Farm
          </Button>
        </div>

        {success && <Alert variant="success" dismissible onClose={() => setSuccess('')}>{success}</Alert>}
        {error && <Alert variant="danger" dismissible onClose={() => setError('')}>{error}</Alert>}

        {loading ? (
          <div className="spinner-agri"><Spinner animation="border" variant="success" /></div>
        ) : farms.length === 0 ? (
          <div className="empty-state">
            <FaWarehouse />
            <h5>No farms yet</h5>
            <p>Add your first farm to start tracking crops and activities.</p>
            <Button className="btn-agri" onClick={() => setShowModal(true)}>Add First Farm</Button>
          </div>
        ) : (
          <Row className="g-4">
            {farms.map(farm => (
              <Col key={farm._id} sm={6} lg={4}>
                <div className="agri-card h-100">
                  <div className="card-header d-flex justify-content-between align-items-center">
                    <span><FaWarehouse className="me-2" />{farm.name}</span>
                    <button className="btn btn-sm btn-link text-white p-0" onClick={() => handleDelete(farm._id)}>
                      <FaTrash />
                    </button>
                  </div>
                  <div className="p-3">
                    <p className="mb-2">
                      <FaMapMarkerAlt className="me-1" style={{ color: 'var(--primary)' }} />
                      {farm.location}
                    </p>
                    {farm.size && <p className="mb-2 text-muted">Size: <strong>{farm.size}</strong></p>}
                    {farm.description && <p className="mb-0 text-muted" style={{ fontSize: '0.875rem' }}>{farm.description}</p>}
                    <Badge bg="success" className="mt-2" style={{ fontSize: '0.75rem' }}>Active</Badge>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        )}

        <Modal show={showModal} onHide={() => setShowModal(false)} centered>
          <Modal.Header closeButton style={{ background: 'var(--primary)', color: '#fff' }}>
            <Modal.Title>Add New Farm</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handleSubmit} className="agri-form">
              <Form.Group className="mb-3">
                <Form.Label>Farm Name *</Form.Label>
                <Form.Control id="farm-name" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="Green Valley Farm" required />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Location *</Form.Label>
                <Form.Control id="farm-location" value={form.location} onChange={e => setForm(p => ({ ...p, location: e.target.value }))} placeholder="Punjab, India" required />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Size (acres)</Form.Label>
                <Form.Control id="farm-size" type="number" value={form.size} onChange={e => setForm(p => ({ ...p, size: e.target.value }))} placeholder="e.g. 25" />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control id="farm-desc" as="textarea" rows={3} value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} placeholder="Brief description of the farm..." />
              </Form.Group>
              <Button type="submit" className="btn-agri w-100" disabled={submitting}>
                {submitting ? <Spinner size="sm" /> : 'Add Farm'}
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
      </div>
    </div>
  );
}
