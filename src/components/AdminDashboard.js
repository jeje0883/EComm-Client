import { Notyf } from 'notyf';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal, Button, Form, Table } from 'react-bootstrap';
import 'notyf/notyf.min.css';

export default function AdminDashboard() {
  const notyf = new Notyf();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [refresh, setRefresh] = useState(false); // State to trigger re-fetch
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    imageLinks: [''], // Initialize with one empty string
    isActive: true,
  });

  useEffect(() => {
    fetch(`${process.env.REACT_APP_BASE_URL}/products/all`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
      })
      .catch((error) => {
        notyf.error('Failed to fetch products.');
      });
  }, [refresh]);

  // Handle disabling product
  function disableProduct(e, productId) {
    e.preventDefault();
    if (!productId) {
      notyf.error('Product ID is not valid.');
      return;
    }
    fetch(`${process.env.REACT_APP_BASE_URL}/products/${productId}/archive`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message) {
          notyf.success(data.message);
          setRefresh(!refresh); // Trigger re-fetch
        } else {
          notyf.error(data.error || 'An unexpected error occurred.');
        }
      })
      .catch(() => {
        notyf.error('Failed to disable product.');
      });
  }

  // Handle activating product
  function activateProduct(e, productId) {
    e.preventDefault();
    if (!productId) {
      notyf.error('Product ID is not valid.');
      return;
    }
    fetch(`${process.env.REACT_APP_BASE_URL}/products/${productId}/activate`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message) {
          notyf.success(data.message);
          setRefresh(!refresh); // Trigger re-fetch
        } else {
          notyf.error(data.error || 'An unexpected error occurred.');
        }
      })
      .catch(() => {
        notyf.error('Failed to activate product.');
      });
  }

  // Open modal for adding a new product
  const handleAddNewProduct = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      imageLinks: [''], // Reset imageLinks
      isActive: true,
    });
    setShowModal(true);
  };

  // Open modal for editing an existing product
  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name || '',
      description: product.description || '',
      price: product.price || '',
      imageLinks:
        Array.isArray(product.imageLinks) && product.imageLinks.length > 0
          ? product.imageLinks
          : [''], // Ensure imageLinks is an array
      isActive: product.isActive || false,
    });
    setShowModal(true);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle image link input changes
  const handleImageLinkChange = (e, index) => {
    const newImageLinks = [...formData.imageLinks];
    newImageLinks[index] = e.target.value;
    setFormData({ ...formData, imageLinks: newImageLinks });
  };

  const addImageLinkField = () => {
    setFormData({ ...formData, imageLinks: [...formData.imageLinks, ''] });
  };

  const removeImageLinkField = (index) => {
    const newImageLinks = [...formData.imageLinks];
    newImageLinks.splice(index, 1);
    setFormData({ ...formData, imageLinks: newImageLinks });
  };

  // Handle form submission (add or update product)
  const handleFormSubmit = (e) => {
    e.preventDefault();

    // Prepare form data
    const submissionData = {
      ...formData,
      imageLinks: formData.imageLinks.filter((link) => link.trim() !== ''), // Remove empty strings
    };

    const method = editingProduct ? 'PATCH' : 'POST';
    const url = editingProduct
      ? `${process.env.REACT_APP_BASE_URL}/products/${editingProduct._id}/update`
      : `${process.env.REACT_APP_BASE_URL}/products/`;

    fetch(url, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(submissionData),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message) {
          notyf.success(data.message);
          setShowModal(false);
          setRefresh(!refresh); // Trigger re-fetch
        } else if (data.error) {
          notyf.error(data.error);
        } else {
          notyf.error('An unexpected error occurred.');
        }
      })
      .catch(() => {
        notyf.error('Failed to submit product.');
      });
  };

  return (
    <div className="container py-5">
      <h4 className="text-center mb-4">Admin Dashboard</h4>
      <div className="mb-3 d-flex justify-content-between">
        <Button className="btn btn-success" onClick={handleAddNewProduct}>
          Add Product
        </Button>
        <Button className="btn btn-primary" onClick={() => navigate('/orders')}>
          Orders
        </Button>
      </div>
      <div className="table-responsive">
        <Table striped bordered hover className="table-striped">
          <thead className="bg-dark text-white">
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Price</th>
              <th>Images</th>
              <th>Availability</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.length > 0 ? (
              products.map((product) => (
                <tr key={product._id}>
                  <td>{product.name}</td>
                  <td>{product.description}</td>
                  <td>
                    ₱
                    {product.price.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </td>
                  <td>
                    {Array.isArray(product.imageLinks) && product.imageLinks.length > 0 ? (
                      product.imageLinks.map((link, idx) => (
                        <img
                          key={idx}
                          src={link}
                          alt={product.name}
                          style={{
                            width: '50px',
                            height: '50px',
                            marginRight: '5px',
                          }}
                        />
                      ))
                    ) : (
                      'No images'
                    )}
                  </td>
                  <td>{product.isActive ? 'Available' : 'Out of Stock'}</td>
                  <td>
                    <Button
                      className="btn btn-warning me-2"
                      onClick={() => handleEditProduct(product)}
                    >
                      Update
                    </Button>
                    {product.isActive ? (
                      <Button
                        className="btn btn-danger"
                        onClick={(e) => disableProduct(e, product._id)}
                      >
                        Disable
                      </Button>
                    ) : (
                      <Button
                        className="btn btn-success"
                        onClick={(e) => activateProduct(e, product._id)}
                      >
                        Activate
                      </Button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center">
                  No products available
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>

      {/* Modal for adding/updating products */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {editingProduct ? 'Update Product' : 'Add New Product'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleFormSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                name="price"
                min="0"
                value={formData.price}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            {/* Image Links Field with Previews */}
            <Form.Group className="mb-3">
              <Form.Label>Image Links</Form.Label>
              {Array.isArray(formData.imageLinks) && formData.imageLinks.length > 0 ? (
                formData.imageLinks.map((link, index) => (
                  <div key={index} className="d-flex mb-2 align-items-center">
                    <Form.Control
                      type="text"
                      name="imageLink"
                      placeholder={`Image Link ${index + 1}`}
                      value={link}
                      onChange={(e) => handleImageLinkChange(e, index)}
                      required
                    />
                    {link.trim() && (
                      <img
                        src={link}
                        alt={`Preview ${index + 1}`}
                        style={{
                          width: '50px',
                          height: '50px',
                          marginLeft: '10px',
                        }}
                      />
                    )}
                    <Button
                      variant="danger"
                      onClick={() => removeImageLinkField(index)}
                      className="ms-2"
                      disabled={formData.imageLinks.length === 1}
                    >
                      Remove
                    </Button>
                  </div>
                ))
              ) : (
                // If imageLinks is not an array or empty, show a message or initialize it
                <p>No image links available.</p>
              )}
              <Button variant="secondary" onClick={addImageLinkField}>
                Add Another Image Link
              </Button>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                label="Available"
                name="isActive"
                checked={formData.isActive}
                onChange={(e) =>
                  setFormData({ ...formData, isActive: e.target.checked })
                }
              />
            </Form.Group>
            <Button type="submit" className="btn btn-primary w-100">
              {editingProduct ? 'Update Product' : 'Add Product'}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}
