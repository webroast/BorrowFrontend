import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../CSS/Admin.css';
import axios from 'axios';

const AdminDashboard = () => {
  const navigate = useNavigate();

  // Active Tab State (Persisted in LocalStorage)
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem('adminActiveTab') || 'dashboard';
  });

  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
    localStorage.setItem('adminActiveTab', tabName);
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
    img:''
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
    img:''
  });

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

  // Fetch products and users on initial render
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
        img:''
      });
      fetchProducts();
      handleTabChange('view-medicines'); // Navigates to View All Products tab
    } catch (err) {
      console.error("Adding error:", err);
      alert("Failed to Add product.");
    }
  };

  // Open Edit Modal & Populate Selected Product Data
  const handleEditClick = (product) => {
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
  const handleDeleteClick = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await axios.delete(`http://localhost:8080/products/deletebyid/${id}`);
        alert("Product deleted successfully!");
        fetchProducts();
      } catch (err) {
        console.error("Delete error:", err);
        alert("Failed to delete product.");
      }
    }
  };

  // Toggle User Active Status
  const toggleStatus = (id) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === id ? { ...user, active: !user.active } : user
      )
    );
  };

  // Logout Handler
  const handleLogout = () => {
    if (window.confirm('Are you sure you want to log out?')) {
      localStorage.removeItem('adminActiveTab');
      navigate('/login');
    }
  };

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

      case 'view-medicines':
        return (
          <div className="content-body">
            <h4 className="page-title text-center mb-4">
              All Products <i className="fa-solid fa-box text-primary"></i>
            </h4>
            {products.length === 0 ? (
              <div className="empty-state text-center py-5 bg-white rounded-3 shadow-sm">
                <p className="text-muted m-0">No products available in database.</p>
              </div>
            ) : (
              <div className="row g-4">
                {products.map((product) => (
                  <div className="col-12 col-md-6 col-lg-4" key={product.id}>
                    <div className="med-card">
                      <div className="med-img-wrapper">
                        <img
                          src={product.img || 'https://via.placeholder.com/200?text=No+Image'}
                          alt={product.productsName}
                          className="med-img"
                        />
                      </div>

                      <div className="p-3 text-center">
                        <h6 className="fw-bold mb-2 text-dark">{product.productName}</h6>
                        <p className="med-info mb-1">
                          <strong>Category:</strong> {product.category}
                        </p>
                        <p className="med-info mb-1">
                          <strong>Description:</strong> {product.productDescription}
                        </p>
                        <p className="med-info mb-1">
                          <strong>Quantity:</strong> {product.quantity}
                        </p>
                        <p className="med-info mb-1">
                          <strong>Rating:</strong> ⭐ {product.rating} / 5
                        </p>
                        <h5 className="price-tag fw-bold mt-2 mb-3">₹{product.price}</h5>

                        <div className="d-flex justify-content-between align-items-center w-100 mt-3">
                          <button 
                            type="button"
                            className="btn btn-outline-primary btn-sm rounded-circle d-inline-flex align-items-center justify-content-center p-0"
                            style={{ width: '32px', height: '32px' }}
                            onClick={() => handleEditClick(product)}
                          >
                            <i className="fa-solid fa-pen"></i>
                          </button>
                          <button 
                            type="button"
                            className="btn btn-outline-danger btn-sm rounded-circle d-inline-flex align-items-center justify-content-center p-0" 
                            onClick={() => handleDeleteClick(product.id)}
                            style={{ width: '32px', height: '32px' }}
                          >
                            <i className="fa-solid fa-trash"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
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
                                  onChange={() => toggleStatus(u.id)}
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

      case 'add-medicine':
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
                    placeholder="Enter category (e.g. Electronics, Tools)"
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
            className={`sidebar-menu-item ${activeTab === 'view-medicines' ? 'active' : ''}`}
            onClick={() => handleTabChange('view-medicines')}
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
            className={`sidebar-menu-item ${activeTab === 'add-medicine' ? 'active' : ''}`}
            onClick={() => handleTabChange('add-medicine')}
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