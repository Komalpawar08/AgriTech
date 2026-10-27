import React, { useState, useEffect } from 'react';
import { Row, Col, Button, Modal, Form, Alert, Spinner, Badge } from 'react-bootstrap';
import { FaSeedling, FaPlus, FaTrash, FaCalendarAlt } from 'react-icons/fa';
import Sidebar from '../components/Sidebar';
import { cropService, farmService } from '../services/api';

const CROP_STAGES = ['Seedling', 'Vegetative', 'Flowering', 'Fruiting', 'Harvest'];
const CROP_TYPES = ['Vegetable', 'Fruit', 'Grain', 'Legume', 'Herb', 'Other'];

const stageColor = { Seedling: 'info', Vegetative: 'success', Flowering: 'warning', Fruiting: 'primary', Harvest: 'danger' };

export default function Crops() {
  const [crops, setCrops] = useState([]);
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', type: '', farm: '', plantedDate: '', stage: 'Seedling', notes: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const [cropsRes, farmsRes] = await Promise.all([cropService.getAll(), farmService.getAll()]);
      setCrops(cropsRes.data);
      setFarms(farmsRes.data);
    } catch { setError('Failed to load crops.'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.name || !form.farm) { setError('Crop name and farm are required.'); return; }
    setSubmitting(true); setError('');
    try {
      await cropService.create(form);
      setSuccess('Crop added!');
      setShowModal(false);
      setForm({ name: '', type: '', farm: '', plantedDate: '', stage: 'Seedling', notes: '' });
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add crop.');
    } finally { setSubmitting(false); }
  };

  const handleDelete = async id => {
    if (!confirm('Delete this crop?')) return;
    try { await cropService.delete(id); fetchData(); }
    catch { setError('Failed to delete.'); }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="main-content">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div className="page-header flex-grow-1 me-3 mb-0">
            <h1>🌱 My Crops</h1>
          </div>
          <Button className="btn-agri" onClick={() => { setShowModal(true); setError(''); }}>
            <FaPlus className="me-2" />Add Crop
          </Button>
        </div>

        {success && <Alert variant="success" dismissible onClose={() => setSuccess('')}>{success}</Alert>}
        {error && <Alert variant="danger" dismissible onClose={() => setError('')}>{error}</Alert>}

        {loading ? (
          <div className="spinner-agri"><Spinner animation="border" variant="success" /></div>
        ) : crops.length === 0 ? (
          <div className="empty-state">
            <FaSeedling />
            <h5>No crops yet</h5>
            <p>Add your first crop to start monitoring growth.</p>
            <Button className="btn-agri" onClick={() => setShowModal(true)}>Add First Crop</Button>
          </div>
        ) : (
          <Row className="g-4">
            {crops.map(crop => (
              <Col key={crop._id} sm={6} lg={4}>
                <div className="agri-card h-100">
                  <div className="card-header d-flex justify-content-between">
                    <span><FaSeedling className="me-2" />{crop.name}</span>
                    <button className="btn btn-sm btn-link text-white p-0" onClick={() => handleDelete(crop._id)}>
                      <FaTrash />
                    </button>
                  </div>
                  <div className="p-3">
                    {crop.type && <p className="mb-2 text-muted">Type: <strong>{crop.type}</strong></p>}
                    {crop.farm && <p className="mb-2 text-muted">Farm: <strong>{crop.farm?.name || 'Unknown'}</strong></p>}
                    {crop.plantedDate && (
                      <p className="mb-2 text-muted">
                        <FaCalendarAlt className="me-1" />
                        Planted: {new Date(crop.plantedDate).toLocaleDateString()}
                      </p>
                    )}
                    <Badge bg={stageColor[crop.stage] || 'secondary'}>{crop.stage}</Badge>
                    {crop.notes && <p className="mt-2 mb-0 text-muted" style={{ fontSize: '0.8rem' }}>{crop.notes}</p>}
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        )}

        <Modal show={showModal} onHide={() => setShowModal(false)} centered>
          <Modal.Header closeButton style={{ background: 'var(--primary)', color: '#fff' }}>
            <Modal.Title>Add New Crop</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handleSubmit} className="agri-form">
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Crop Name *</Form.Label>
                    <Form.Control id="crop-name" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="Wheat, Rice, Tomato..." required />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Type</Form.Label>
                    <Form.Select id="crop-type" value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))}>
                      <option value="">Select type</option>
                      {CROP_TYPES.map(t => <option key={t}>{t}</option>)}
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
              <Form.Group className="mb-3">
                <Form.Label>Farm *</Form.Label>
                <Form.Select id="crop-farm" value={form.farm} onChange={e => setForm(p => ({ ...p, farm: e.target.value }))} required>
                  <option value="">Select farm</option>
                  {farms.map(f => <option key={f._id} value={f._id}>{f.name}</option>)}
                </Form.Select>
              </Form.Group>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Planted Date</Form.Label>
                    <Form.Control id="crop-date" type="date" value={form.plantedDate} onChange={e => setForm(p => ({ ...p, plantedDate: e.target.value }))} />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Growth Stage</Form.Label>
                    <Form.Select id="crop-stage" value={form.stage} onChange={e => setForm(p => ({ ...p, stage: e.target.value }))}>
                      {CROP_STAGES.map(s => <option key={s}>{s}</option>)}
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
              <Form.Group className="mb-3">
                <Form.Label>Notes</Form.Label>
                <Form.Control id="crop-notes" as="textarea" rows={2} value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} placeholder="Any observations..." />
              </Form.Group>
              <Button type="submit" className="btn-agri w-100" disabled={submitting}>
                {submitting ? <Spinner size="sm" /> : 'Add Crop'}
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
      </div>
    </div>
  );
}
