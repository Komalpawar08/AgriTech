import React, { useState, useEffect } from 'react';
import { Table, Button, Alert, Spinner, Badge, Modal, Form, Row, Col } from 'react-bootstrap';
import { FaPlus, FaEdit, FaTrash, FaBoxOpen } from 'react-icons/fa';
import Sidebar from '../../components/Sidebar';
import { productService } from '../../services/api';
import { Link, useNavigate } from 'react-router-dom';

const CATEGORIES = ['Seeds', 'Fertilizer', 'Tools', 'Pesticide', 'Equipment', 'Other'];

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', description: '', category: '', price: '', stock: '', imageUrl: '' });
  const [submitting, setSubmitting] = useState(false);

  const fetchProducts = () => {
    setLoading(true);
    productService.getAll()
      .then(res => setProducts(res.data))
      .catch(() => setError('Failed to load products.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchProducts(); }, []);

  const openCreate = () => {
    setEditing(null);
    setForm({ name: '', description: '', category: '', price: '', stock: '', imageUrl: '' });
    setShowModal(true); setError('');
  };

  const openEdit = (p) => {
    setEditing(p);
    setForm({ name: p.name, description: p.description || '', category: p.category || '', price: p.price, stock: p.stock, imageUrl: p.imageUrl || '' });
    setShowModal(true); setError('');
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.name || !form.price) { setError('Name and price are required.'); return; }
    setSubmitting(true); setError('');
    try {
      if (editing) {
        await productService.update(editing._id, form);
        setSuccess('Product updated!');
      } else {
        await productService.create(form);
        setSuccess('Product created!');
      }
      setShowModal(false);
      fetchProducts();
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed.');
    } finally { setSubmitting(false); }
  };

  const handleDelete = async id => {
    if (!confirm('Delete this product?')) return;
    try { await productService.delete(id); setSuccess('Product deleted.'); fetchProducts(); }
    catch { setError('Delete failed.'); }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="main-content">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div className="page-header flex-grow-1 me-3 mb-0">
            <h1><FaBoxOpen className="me-2" />Products Management</h1>
          </div>
          <Button className="btn-agri" onClick={openCreate}>
            <FaPlus className="me-2" />Add Product
          </Button>
        </div>

        {success && <Alert variant="success" dismissible onClose={() => setSuccess('')}>{success}</Alert>}
        {error && !showModal && <Alert variant="danger" dismissible onClose={() => setError('')}>{error}</Alert>}

        {loading ? (
          <div className="spinner-agri"><Spinner animation="border" variant="success" /></div>
        ) : (
          <div className="agri-table">
            <Table responsive hover className="mb-0">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.length === 0 ? (
                  <tr><td colSpan={6} className="text-center text-muted py-4">No products. Add one above.</td></tr>
                ) : products.map((p, i) => (
                  <tr key={p._id}>
                    <td>{i + 1}</td>
                    <td>{p.name}</td>
                    <td>{p.category && <Badge bg="success">{p.category}</Badge>}</td>
                    <td style={{ color: 'var(--primary)', fontWeight: 600 }}>₹{p.price}</td>
                    <td>
                      <Badge bg={p.stock > 0 ? 'success' : 'danger'}>
                        {p.stock > 0 ? p.stock + ' units' : 'Out of stock'}
                      </Badge>
                    </td>
                    <td>
                      <Button size="sm" variant="outline-primary" className="me-2" onClick={() => openEdit(p)}>
                        <FaEdit />
                      </Button>
                      <Button size="sm" variant="outline-danger" onClick={() => handleDelete(p._id)}>
                        <FaTrash />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}

        <Modal show={showModal} onHide={() => setShowModal(false)} centered size="lg">
          <Modal.Header closeButton style={{ background: 'var(--primary)', color: '#fff' }}>
            <Modal.Title>{editing ? 'Edit Product' : 'Add New Product'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handleSubmit} className="agri-form">
              <Row>
                <Col md={8}>
                  <Form.Group className="mb-3">
                    <Form.Label>Product Name *</Form.Label>
                    <Form.Control id="prod-name" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="Organic Fertilizer" required />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Category</Form.Label>
                    <Form.Select id="prod-cat" value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}>
                      <option value="">Select</option>
                      {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
              <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control id="prod-desc" as="textarea" rows={2} value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} placeholder="Product description..." />
              </Form.Group>
              <Row>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Price (₹) *</Form.Label>
                    <Form.Control id="prod-price" type="number" min="0" step="0.01" value={form.price} onChange={e => setForm(p => ({ ...p, price: e.target.value }))} required />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Stock</Form.Label>
                    <Form.Control id="prod-stock" type="number" min="0" value={form.stock} onChange={e => setForm(p => ({ ...p, stock: e.target.value }))} />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Image URL</Form.Label>
                    <Form.Control id="prod-img" type="url" value={form.imageUrl} onChange={e => setForm(p => ({ ...p, imageUrl: e.target.value }))} placeholder="https://..." />
                  </Form.Group>
                </Col>
              </Row>
              <Button type="submit" className="btn-agri w-100" disabled={submitting}>
                {submitting ? <Spinner size="sm" /> : (editing ? 'Update Product' : 'Create Product')}
              </Button>
            </Form>
          </Modal.Body>
        </Modal>
      </div>
    </div>
  );
}
