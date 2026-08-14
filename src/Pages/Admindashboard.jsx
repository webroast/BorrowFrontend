import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../CSS/Admin.css';
import axios from 'axios';

const CATEGORIES_LIST = [
  { id: 'digital', name: 'Digital', icon: 'fa-laptop' },
  { id: 'party', name: 'Party', icon: 'fa-champagne-glasses' },
  { id: 'furniture', name: 'Furniture', icon: 'fa-couch' },
  { id: 'eventwear', name: 'Eventwear', icon: 'fa-shirt' },
  { id: 'tools', name: 'Tools', icon: 'fa-screwdriver-wrench' },
  { id: 'camping', name: 'Camping', icon: 'fa-campground' },
  { id: 'gaming', name: 'Gaming', icon: 'fa-gamepad' },
  { id: 'more', name: 'More', icon: 'fa-layer-group' }
];

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Read active tab and selected category directly from URL
  const activeTab = searchParams.get('tab') || localStorage.getItem('adminActiveTab') || 'dashboard';
  const selectedCategory = searchParams.get('category');

  // Change tab and sync with browser history
  const handleTabChange = (tabName) => {
    localStorage.setItem('adminActiveTab', tabName);
    setSearchParams({ tab: tabName });
  };

  // Select category and push history state (so browser back/swiping works)
  const handleSelectCategory = (categoryName) => {
    setSearchParams({ tab: 'view-products', category: categoryName });
  };

  // Back action: uses browser history
  const handleBackToCategories = () => {
    navigate(-1);
  };

  // Backend Data States
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);

  // Form State for Adding New Product
  const [newProduct, setNewProduct] = useState({
    productName: '',
    productDescription: '',
    price: 0,
    category: '',
    quantity: 0,
    rating: 0,
    img: ''
  });

  // Modal State for Editing Product
  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState({
    id: null,
    productName: '',
    productDescription: '',
    price: 0,
    category: '',
    quantity: 0,
    rating: 0,
    img: ''
  });

  // Modal State for Viewing Product Details
  const [viewProduct, setViewProduct] = useState(null);

  // Fetch all products from backend API
  const fetchProducts = useCallback(() => {
    axios.get("http://localhost:8080/products/viewall")
      .then((response) => {
        setProducts(response.data);
        console.log("Fetched Products: ", response.data);
      })
      .catch((error) => {
        console.error("Error fetching products: ", error);
      });
  }, []);

  // Fetch all users from backend API
  const fetchUsers = useCallback(() => {
    axios.get("http://localhost:8080/users/viewall")
      .then((response) => {
        setUsers(response.data);
        console.log("Fetched Users: ", response.data);
      })
      .catch((error) => {
        console.error("Error fetching users: ", error);
      });
  }, []);

  useEffect(() => {
    fetchProducts();
    fetchUsers();
  }, [fetchProducts, fetchUsers]);

  // Handle Input Changes for Add Product Form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct({
      ...newProduct,
      [name]: value
    });
  };

  // Submit New Product
  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`http://localhost:8080/products/add`, newProduct);
      alert("Product Added Successfully!");
      setNewProduct({
        productName: '',
        productDescription: '',
        price: 0,
        category: '',
        quantity: 0,
        rating: 0,
        img: ''
      });
      fetchProducts();
      handleTabChange('view-products');
    } catch (err) {
      console.error("Adding error:", err);
      alert("Failed to Add product.");
    }
  };

  // Open Edit Modal & Populate Selected Product Data
  const handleEditClick = (product, e) => {
    if (e) e.stopPropagation();
    setEditProduct({
      id: product.id,
      productName: product.productName || '',
      productDescription: product.productDescription || '',
      price: product.price || 0,
      category: product.category || '',
      quantity: product.quantity || 0,
      rating: product.rating || 0,
      img: product.img || ''
    });
    setViewProduct(null);
    setShowModal(true);
  };

  // Submit Updated Product Details
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(`http://localhost:8080/products/update/${editProduct.id}`, editProduct);
      alert("Product Updated Successfully!");
      setShowModal(false);
      fetchProducts();
    } catch (err) {
      console.error("Update error:", err);
      alert("Failed to update product.");
    }
  };

  // Delete Product
  const handleDeleteClick = async (id, e) => {
    if (e) e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await axios.delete(`http://localhost:8080/products/deletebyid/${id}`);
        alert("Product deleted successfully!");
        setViewProduct(null);
        fetchProducts();
      } catch (err) {
        console.error("Delete error:", err);
        alert("Failed to delete product.");
      }
    }
  };

  // ==========================================
  // TOGGLE USER STATUS & SYNC WITH DATABASE
  // ==========================================
  const toggleStatus = async (user) => {
    const newStatus = !user.active;

    // 1. Optimistic Update (Update UI immediately)
    setUsers((prevUsers) =>
      prevUsers.map((u) =>
        u.id === user.id ? { ...u, active: newStatus } : u
      )
    );

    // 2. Persist to Backend API
    try {
      // Updates the user active status on the backend
      await axios.patch(
        `http://localhost:8080/users/updatestatus/${user.id}`,
        null,
        {
          params: { active: newStatus }
        }
      );
      console.log(`User ${user.id} status updated to:`, newStatus);
    } catch (error) {
      console.error("Error updating user status in database:", error);
      alert("Failed to update status in database. Reverting changes.");
      
      // Rollback UI if backend call fails
      setUsers((prevUsers) =>
        prevUsers.map((u) =>
          u.id === user.id ? { ...u, active: !newStatus } : u
        )
      );
    }
  };

  // Logout Handler
  const handleLogout = () => {
    if (window.confirm('Are you sure you want to log out?')) {
      localStorage.removeItem('adminActiveTab');
      navigate('/login');
    }
  };

  // Filter products by selected category
  const filteredProducts = products.filter((p) => {
    if (!selectedCategory) return false;
    const cat = (p.category || '').trim().toLowerCase();
    const sel = selectedCategory.trim().toLowerCase();

    if (sel === 'more') {
      const standardCategories = ['digital', 'party', 'furniture', 'eventwear', 'tools', 'camping', 'gaming'];
      return !standardCategories.some((sc) => cat.includes(sc));
    }

    return cat.includes(sel);
  });

  // Render Section
  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="content-body">
            <h4 className="page-title text-center mb-4">
              Dashboard Overview <i className="fa-solid fa-chart-simple text-primary"></i>
            </h4>
            
            <div className="row g-4 mb-4">
              <div className="col-12 col-sm-6 col-lg-4">
                <div className="stat-card shadow-sm rounded-3 bg-white p-3 border-start border-primary border-4">
                  <span className="text-muted small fw-semibold">Total Products</span>
                  <h3 className="fw-bold text-dark mt-1 mb-0">{products.length}</h3>
                </div>
              </div>
              <div className="col-12 col-sm-6 col-lg-4">
                <div className="stat-card shadow-sm rounded-3 bg-white p-3 border-start border-success border-4">
                  <span className="text-muted small fw-semibold">Total Registered Users</span>
                  <h3 className="fw-bold text-dark mt-1 mb-0">{users.length}</h3>
                </div>
              </div>
              <div className="col-12 col-sm-6 col-lg-4">
                <div className="stat-card shadow-sm rounded-3 bg-white p-3 border-start border-warning border-4">
                  <span className="text-muted small fw-semibold">Total Orders</span>
                  <h3 className="fw-bold text-dark mt-1 mb-0">{orders.length}</h3>
                </div>
              </div>
            </div>

            <div className="med-table-card shadow-sm rounded-3 bg-white p-4">
              <h6 className="fw-bold mb-3 text-secondary">Quick Activity Summary</h6>
              <p className="text-muted small mb-0">
                Welcome to your Borrow Admin Panel. Select an option from the sidebar to manage your inventory, review registered customers, or monitor customer orders.
              </p>
            </div>
          </div>
        );

      case 'view-products':
        return (
          <div className="content-body">
            {!selectedCategory ? (
              <div>
                <h4 className="page-title text-center mb-2">
                  Select Product Category <i className="fa-solid fa-layer-group text-primary"></i>
                </h4>
                <p className="text-center text-muted small mb-4">
                  Choose a category below to view and manage its products.
                </p>

                <div className="row g-4">
                  {CATEGORIES_LIST.map((cat) => {
                    const count = products.filter((p) => {
                      const c = (p.category || '').toLowerCase();
                      if (cat.id === 'more') {
                        const standard = ['digital', 'party', 'furniture', 'eventwear', 'tools', 'camping', 'gaming'];
                        return !standard.some((st) => c.includes(st));
                      }
                      return c.includes(cat.id);
                    }).length;

                    return (
                      <div className="col-12 col-sm-6 col-lg-3" key={cat.id}>
                        <div
                          className="card border-0 shadow-sm rounded-4 p-4 text-center h-100 category-selection-card"
                          style={{
                            cursor: 'pointer',
                            transition: 'all 0.25s ease',
                            background: '#ffffff'
                          }}
                          onClick={() => handleSelectCategory(cat.name)}
                        >
                          <div className="d-flex align-items-center justify-content-center mb-3">
                            <div
                              className="rounded-circle bg-primary-subtle text-primary d-flex align-items-center justify-content-center"
                              style={{ width: '60px', height: '60px', fontSize: '1.4rem' }}
                            >
                              <i className={`fa-solid ${cat.icon}`}></i>
                            </div>
                          </div>
                          
                          <span className={`badge mb-2 mx-auto px-3 py-1 ${count > 0 ? 'bg-primary-subtle text-primary' : 'bg-light text-muted border'}`}>
                            {count} {count === 1 ? 'Item' : 'Items'}
                          </span>

                          <h5 className="fw-bold text-dark mb-0">{cat.name}</h5>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div>
                <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-2 bg-white p-3 rounded-3 shadow-sm border">
                  <div className="d-flex align-items-center gap-3">
                    <button
                      type="button"
                      className="btn btn-primary btn-sm px-3 rounded-pill d-inline-flex align-items-center gap-2"
                      onClick={handleBackToCategories}
                    >
                      <i className="fa-solid fa-arrow-left"></i>
                      <span>Back to Categories</span>
                    </button>
                    <div>
                      <h5 className="fw-bold mb-0 text-dark">
                        {selectedCategory}
                      </h5>
                      <small className="text-muted">Showing all items in this category</small>
                    </div>
                  </div>
                  <span className="badge bg-light text-dark border px-3 py-2">
                    Total: {filteredProducts.length} items
                  </span>
                </div>

                {filteredProducts.length === 0 ? (
                  <div className="empty-state text-center py-5 bg-white rounded-3 shadow-sm">
                    <i className="fa-solid fa-box-open text-muted fs-1 mb-3"></i>
                    <h6 className="fw-bold text-dark">No Products Found</h6>
                    <p className="text-muted small mb-3">There are currently no products listed under "{selectedCategory}".</p>
                    <button
                      type="button"
                      className="btn btn-outline-primary btn-sm px-4 rounded-pill"
                      onClick={handleBackToCategories}
                    >
                      Choose Another Category
                    </button>
                  </div>
                ) : (
                  <div className="row g-4">
                    {filteredProducts.map((product) => (
                      <div className="col-12 col-md-6 col-lg-4" key={product.id}>
                        <div 
                          className="med-card h-100 position-relative shadow-sm"
                          style={{ cursor: 'pointer', transition: 'transform 0.2s ease, box-shadow 0.2s ease' }}
                          onClick={() => setViewProduct(product)}
                        >
                          <div className="med-img-wrapper">
                            <img
                              src={product.img || 'https://via.placeholder.com/200?text=No+Image'}
                              alt={product.productName}
                              className="med-img"
                            />
                          </div>

                          <div className="p-3 text-center d-flex flex-column justify-content-between">
                            <div>
                              <h6 className="fw-bold mb-2 text-dark text-truncate">{product.productName}</h6>
                              <span className="badge bg-secondary-subtle text-secondary mb-2">{product.category}</span>
                              <p className="med-info mb-1 text-muted small text-truncate">
                                {product.productDescription}
                              </p>
                              <p className="med-info mb-1 small">
                                <strong>Quantity:</strong> {product.quantity} &nbsp;|&nbsp; <strong>Rating:</strong> ⭐ {product.rating}
                              </p>
                              <h5 className="price-tag fw-bold mt-2 mb-2 text-primary">₹{product.price} <small className="text-muted fs-6 fw-normal">/ day</small></h5>
                            </div>

                            <div className="d-flex justify-content-between align-items-center w-100 mt-2 pt-2 border-top">
                              <span className="text-primary small fw-semibold">
                                <i className="fa-regular fa-eye me-1"></i> View Full Details
                              </span>
                              <div className="d-flex gap-2">
                                <button 
                                  type="button"
                                  className="btn btn-outline-primary btn-sm rounded-circle d-inline-flex align-items-center justify-content-center p-0"
                                  style={{ width: '32px', height: '32px' }}
                                  onClick={(e) => handleEditClick(product, e)}
                                  title="Edit Product"
                                >
                                  <i className="fa-solid fa-pen"></i>
                                </button>
                                <button 
                                  type="button"
                                  className="btn btn-outline-danger btn-sm rounded-circle d-inline-flex align-items-center justify-content-center p-0" 
                                  style={{ width: '32px', height: '32px' }}
                                  onClick={(e) => handleDeleteClick(product.id, e)}
                                  title="Delete Product"
                                >
                                  <i className="fa-solid fa-trash"></i>
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* PRODUCT FULL DETAIL PREVIEW MODAL */}
            {viewProduct && (
              <div 
                className="custom-modal-backdrop" 
                style={{
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  backgroundColor: 'rgba(0, 0, 0, 0.65)',
                  zIndex: 1050,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '20px'
                }}
                onClick={() => setViewProduct(null)}
              >
                <div 
                  className="bg-white rounded-4 shadow-lg overflow-hidden border-0"
                  style={{
                    maxWidth: '750px',
                    width: '100%',
                    maxHeight: '90vh',
                    overflowY: 'auto',
                    animation: 'fadeIn 0.2s ease-in-out'
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="p-3 px-4 border-bottom d-flex justify-content-between align-items-center bg-light">
                    <span className="badge bg-primary px-3 py-2 rounded-pill text-uppercase">
                      {viewProduct.category}
                    </span>
                    <button 
                      type="button" 
                      className="btn-close" 
                      onClick={() => setViewProduct(null)}
                    ></button>
                  </div>

                  <div className="p-4">
                    <div className="row g-4 align-items-center">
                      <div className="col-12 col-md-5 text-center">
                        <div className="rounded-3 overflow-hidden border shadow-sm p-2 bg-light">
                          <img 
                            src={viewProduct.img || 'https://via.placeholder.com/350?text=No+Image'} 
                            alt={viewProduct.productName}
                            className="img-fluid rounded-2"
                            style={{ maxHeight: '280px', width: '100%', objectFit: 'cover' }}
                          />
                        </div>
                      </div>

                      <div className="col-12 col-md-7">
                        <h4 className="fw-bold text-dark mb-2">{viewProduct.productName}</h4>
                        <div className="d-flex align-items-center gap-3 mb-3">
                          <span className="badge bg-warning text-dark px-2 py-1">
                            ⭐ {viewProduct.rating} / 5.0
                          </span>
                          <span className={`badge ${viewProduct.quantity > 0 ? 'bg-success-subtle text-success' : 'bg-danger-subtle text-danger'}`}>
                            {viewProduct.quantity > 0 ? `${viewProduct.quantity} Available in Stock` : 'Out of Stock'}
                          </span>
                        </div>

                        <h3 className="fw-bold text-primary mb-3">
                          ₹{viewProduct.price} <span className="text-muted fs-6 fw-normal">/ day rental</span>
                        </h3>

                        <h6 className="fw-bold text-secondary text-uppercase small mb-1">Description</h6>
                        <p className="text-muted" style={{ lineHeight: '1.6', fontSize: '0.95rem' }}>
                          {viewProduct.productDescription}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 px-4 border-top bg-light d-flex justify-content-between align-items-center">
                    <button 
                      type="button" 
                      className="btn btn-outline-secondary px-4 rounded-pill"
                      onClick={() => setViewProduct(null)}
                    >
                      Close
                    </button>
                    <div className="d-flex gap-2">
                      <button 
                        type="button" 
                        className="btn btn-outline-danger px-3 rounded-pill"
                        onClick={(e) => handleDeleteClick(viewProduct.id, e)}
                      >
                        <i className="fa-solid fa-trash me-1"></i> Delete
                      </button>
                      <button 
                        type="button" 
                        className="btn btn-primary px-4 rounded-pill"
                        onClick={(e) => handleEditClick(viewProduct, e)}
                      >
                        <i className="fa-solid fa-pen me-1"></i> Edit Details
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* EDIT PRODUCT MODAL */}
            {showModal && (
              <div className="custom-modal-backdrop">
                <div className="custom-modal-content">
                  <div className="modal-header pb-3 mb-3 border-bottom d-flex justify-content-between align-items-center">
                    <h5 className="fw-bold m-0">Edit Product Details</h5>
                    <button 
                      type="button" 
                      className="btn-close" 
                      onClick={() => setShowModal(false)}
                    ></button>
                  </div>

                  <form onSubmit={handleUpdateSubmit}>
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label className="form-label fw-medium">Product Name</label>
                        <input 
                          type="text" 
                          className="form-control" 
                          value={editProduct.productName}
                          onChange={(e) => setEditProduct({...editProduct, productName: e.target.value})}
                          required
                        />
                      </div>

                      <div className="col-md-6 mb-3">
                        <label className="form-label fw-medium">Category</label>
                        <input 
                          type="text" 
                          className="form-control" 
                          value={editProduct.category}
                          onChange={(e) => setEditProduct({...editProduct, category: e.target.value})}
                          required
                        />
                      </div>
                    </div>

                    <div className="mb-3">
                      <label className="form-label fw-medium">Product Description</label>
                      <textarea 
                        className="form-control" 
                        rows="2"
                        value={editProduct.productDescription}
                        onChange={(e) => setEditProduct({...editProduct, productDescription: e.target.value})}
                        required
                      ></textarea>
                    </div>

                    <div className="row">
                      <div className="col-md-4 mb-3">
                        <label className="form-label fw-medium">Price (₹)</label>
                        <input 
                          type="number" 
                          step="0.01"
                          className="form-control" 
                          value={editProduct.price}
                          onChange={(e) => setEditProduct({...editProduct, price: parseFloat(e.target.value) || 0})}
                          required
                        />
                      </div>

                      <div className="col-md-4 mb-3">
                        <label className="form-label fw-medium">Quantity</label>
                        <input 
                          type="number" 
                          className="form-control" 
                          value={editProduct.quantity}
                          onChange={(e) => setEditProduct({...editProduct, quantity: parseInt(e.target.value) || 0})}
                          required
                        />
                      </div>

                      <div className="col-md-4 mb-3">
                        <label className="form-label fw-medium">Rating (0 - 5)</label>
                        <input 
                          type="number" 
                          step="0.1"
                          max="5"
                          min="0"
                          className="form-control" 
                          value={editProduct.rating}
                          onChange={(e) => setEditProduct({...editProduct, rating: parseFloat(e.target.value) || 0})}
                          required
                        />
                      </div>

                      <div className="mb-3">
                        <label className="form-label fw-medium">Image URL</label>
                        <input 
                          type="text" 
                          className="form-control" 
                          value={editProduct.img}
                          onChange={(e) => setEditProduct({...editProduct, img: e.target.value})}
                          required
                        />
                      </div>
                    </div>

                    <div className="d-flex justify-content-end gap-2 border-top pt-3">
                      <button 
                        type="button" 
                        className="btn btn-secondary" 
                        onClick={() => setShowModal(false)}
                      >
                        Cancel
                      </button>
                      <button type="submit" className="btn btn-primary px-4">
                        Save Changes
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        );

      case 'view-users':
        return (
          <div className="content-body">
            <h4 className="page-title text-center mb-4">
              Registered Users <i className="fa-regular fa-user text-primary"></i>
            </h4>
            <div className="med-table-card shadow-sm rounded-3 bg-white p-3">
              {users.length === 0 ? (
                <div className="empty-state text-center py-4">
                  <p className="text-muted m-0">No users registered yet.</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="table-light">
                      <tr>
                        <th>User ID</th>
                        <th>Full Name</th>
                        <th>Email</th>
                        <th>Contact</th>
                        <th>Gender</th>
                        <th>Role</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((u) => (
                        <tr key={u.id}>
                          <td>#{u.id}</td>
                          <td className="fw-medium">{u.fullName}</td>
                          <td>{u.email}</td>
                          <td>{u.contact}</td>
                          <td>{u.gender}</td>
                          <td>
                            <span className="badge bg-teal-subtle text-teal">
                              {u.role || 'USER'}
                            </span>
                          </td>
                          <td>
                            <div className="d-flex align-items-center gap-2">
                              <div className="form-check form-switch mb-0">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  role="switch"
                                  checked={u.active}
                                  onChange={() => toggleStatus(u)}
                                />
                              </div>

                              <span
                                className={`badge ${
                                  u.active
                                    ? "bg-success-subtle text-success"
                                    : "bg-danger-subtle text-danger"
                                }`}
                              >
                                {u.active ? "Active" : "Inactive"}
                              </span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        );

      case 'view-orders':
        return (
          <div className="content-body">
            <h4 className="page-title text-center mb-4">
              Customer Orders <i className="fa-solid fa-list text-primary"></i>
            </h4>
            <div className="med-table-card shadow-sm rounded-3 bg-white p-3">
              {orders.length === 0 ? (
                <div className="empty-state text-center py-4">
                  <p className="text-muted m-0">No orders placed yet.</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover align-middle mb-0">
                    <thead className="table-light">
                      <tr>
                        <th>Order ID</th>
                        <th>Customer</th>
                        <th>Product</th>
                        <th>Quantity</th>
                        <th>Total Amount</th>
                        <th>Order Date</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order) => (
                        <tr key={order.id}>
                          <td>#{order.id}</td>
                          <td className="fw-medium">{order.userName}</td>
                          <td>{order.productName}</td>
                          <td>{order.quantity}</td>
                          <td className="fw-bold text-success">₹{order.totalPrice}</td>
                          <td>{order.orderDate}</td>
                          <td>
                            <span className="badge bg-warning text-dark">
                              {order.active || 'PENDING'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        );

      case 'add-product':
        return (
          <div className="content-body">
            <h4 className="page-title text-center mb-4">
              Add New Product <i className="fa-solid fa-plus text-primary"></i>
            </h4>
            <div className="med-form-card shadow-sm rounded-3 bg-white p-4">
              <form onSubmit={handleAddProduct}>
                <div className="mb-3">
                  <label className="form-label fw-medium">Product Name</label>
                  <input
                    type="text"
                    name="productName"
                    className="form-control"
                    placeholder="Enter product name"
                    value={newProduct.productName}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-medium">Product Description</label>
                  <textarea
                    name="productDescription"
                    className="form-control"
                    rows="2"
                    placeholder="Enter product description..."
                    value={newProduct.productDescription}
                    onChange={handleInputChange}
                    required
                  ></textarea>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-medium">Category</label>
                  <input
                    type="text"
                    name="category"
                    className="form-control"
                    placeholder="Enter category (e.g. Camping, Digital, Tools)"
                    value={newProduct.category}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="row">
                  <div className="col-md-4 mb-3">
                    <label className="form-label fw-medium">Price (₹)</label>
                    <input
                      type="number"
                      step="0.01"
                      name="price"
                      className="form-control"
                      placeholder="0.00"
                      value={newProduct.price}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="col-md-4 mb-3">
                    <label className="form-label fw-medium">Quantity</label>
                    <input
                      type="number"
                      name="quantity"
                      className="form-control"
                      placeholder="0"
                      value={newProduct.quantity}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="col-md-4 mb-3">
                    <label className="form-label fw-medium">Rating (0 - 5)</label>
                    <input
                      type="number"
                      step="0.1"
                      max="5"
                      min="0"
                      name="rating"
                      className="form-control"
                      placeholder="e.g. 4.5"
                      value={newProduct.rating}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-medium">Image URL</label>
                    <input
                      type="text"
                      name="img"
                      className="form-control"
                      placeholder="Enter Image URL"
                      value={newProduct.img}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <button type="submit" className="btn btn-primary w-100 mt-2 py-2 fw-semibold">
                  Save Product
                </button>
              </form>
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center py-5">
            <p className="text-muted">Select an option from the sidebar.</p>
          </div>
        );
    }
  };

  return (
    <div className="medishop-admin-container">
      {/* SIDEBAR NAVIGATION */}
      <aside className="medishop-sidebar">
        <div className="sidebar-brand-box">
          <h2 className="logo m-0">
            <span className="medi">Bor</span>
            <span className="shop">row</span>
          </h2>
          <span className="admin-badge">Admin</span>
        </div>

        <ul className="sidebar-menu-list">
          <li
            className={`sidebar-menu-item ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => handleTabChange('dashboard')}
          >
            Dashboard
          </li>
          <li
            className={`sidebar-menu-item ${activeTab === 'view-products' ? 'active' : ''}`}
            onClick={() => handleTabChange('view-products')}
          >
            View All Products
          </li>
          <li
            className={`sidebar-menu-item ${activeTab === 'view-users' ? 'active' : ''}`}
            onClick={() => handleTabChange('view-users')}
          >
            View All Users
          </li>
          <li
            className={`sidebar-menu-item ${activeTab === 'view-orders' ? 'active' : ''}`}
            onClick={() => handleTabChange('view-orders')}
          >
            View All Orders
          </li>
          <li
            className={`sidebar-menu-item ${activeTab === 'add-product' ? 'active' : ''}`}
            onClick={() => handleTabChange('add-product')}
          >
            Add New Product
          </li>
        </ul>

        {/* LOGOUT BUTTON */}
        <div className="sidebar-footer">
          <button type="button" className="btn btn-danger-custom w-100" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="medishop-main-content">
        {renderTabContent()}
      </main>
    </div>
  );
};

export default AdminDashboard;