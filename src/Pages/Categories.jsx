import React, { useState, useEffect, useCallback, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import axios from 'axios'
import Header from '../Component/Header'
import Footer from '../Component/Footer'
import catimg from '../Images/CategoriesBackground.png'

const Categories = () => {
  const [products, setProducts] = useState([])
  const [wishlist, setWishlist] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [expandedProduct, setExpandedProduct] = useState(null)
  const productsSectionRef = useRef(null)
  const navigate = useNavigate()
  const location = useLocation()

  const categoryConfig = [
    { id: 1, name: 'Digital', icon: 'fa-laptop' },
    { id: 2, name: 'Party', icon: 'fa-champagne-glasses' },
    { id: 3, name: 'Furniture', icon: 'fa-couch' },
    { id: 4, name: 'Eventwear', icon: 'fa-shirt' },
    { id: 5, name: 'Tools', icon: 'fa-screwdriver-wrench' },
    { id: 6, name: 'Camping', icon: 'fa-campground' },
    { id: 7, name: 'Gaming', icon: 'fa-gamepad' },
    { id: 8, name: 'More', icon: 'fa-layer-group' },
  ]

  const getFullImageUrl = (imageSrc) => {
    if (!imageSrc) return 'https://via.placeholder.com/300x220?text=No+Image'
    if (imageSrc.startsWith('http://') || imageSrc.startsWith('https://') || imageSrc.startsWith('data:')) {
      return imageSrc
    }
    const cleanPath = imageSrc.startsWith('/') ? imageSrc.substring(1) : imageSrc
    return `http://localhost:8080/${cleanPath}`
  }

  const getUserData = () => {
    try {
      const stored = localStorage.getItem('user')
      if (!stored) return null
      const parsed = JSON.parse(stored)
      const resolvedId = parsed.id || parsed.userId || parsed.user_id || parsed.uId
      if (!resolvedId) return null
      return { ...parsed, id: Number(resolvedId) }
    } catch {
      return null
    }
  }

  const fetchProducts = useCallback(() => {
    setLoading(true)
    axios
      .get('http://localhost:8080/products/viewall')
      .then((response) => {
        setProducts(Array.isArray(response.data) ? response.data : [])
      })
      .catch((error) => console.error('Error fetching categories products: ', error))
      .finally(() => setLoading(false))

    const storedWishlist = JSON.parse(localStorage.getItem('wishlist')) || []
    setWishlist(storedWishlist)
  }, [])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const categoryParam = params.get('category')
    if (categoryParam) {
      setSelectedCategory(categoryParam)
      setTimeout(() => {
        if (productsSectionRef.current) {
          productsSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }, 300)
    }
  }, [location.search])

  const matchesCategory = (productCategory, targetCategoryName) => {
    const pCat = (productCategory || '').trim().toLowerCase()
    const tCat = (targetCategoryName || '').trim().toLowerCase()

    if (tCat === 'more') {
      const standard = ['digital', 'party', 'furniture', 'eventwear', 'tools', 'camping', 'gaming']
      return !standard.some((sc) => pCat.includes(sc))
    }
    return pCat.includes(tCat) || tCat.includes(pCat)
  }

  const categoryList = categoryConfig.map((cat) => {
    const count = products.filter((item) => matchesCategory(item.category, cat.name)).length
    return { ...cat, itemsCount: `${count} ${count === 1 ? 'Item' : 'Items'}`, count }
  })

  const filteredProducts = selectedCategory
    ? products.filter((item) => matchesCategory(item.category, selectedCategory))
    : []

  const handleCategoryClick = (categoryName) => {
    if (selectedCategory === categoryName) {
      setSelectedCategory(null)
      navigate('/categories', { replace: true })
    } else {
      setSelectedCategory(categoryName)
      navigate(`/categories?category=${encodeURIComponent(categoryName)}`, { replace: true })
      setTimeout(() => {
        if (productsSectionRef.current) {
          productsSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }, 100)
    }
  }

  // ── Wishlist Toggle ──
  const handleWishlistToggle = (item) => {
    const user = getUserData()
    if (!user || !user.id) {
      setShowLoginModal(true)
      return
    }

    const currentWishlist = JSON.parse(localStorage.getItem('wishlist')) || []
    const itemId = item.id || item.productId
    const exists = currentWishlist.some((w) => (w.id || w.productId) === itemId)

    let updated
    if (exists) {
      updated = currentWishlist.filter((w) => (w.id || w.productId) !== itemId)
    } else {
      updated = [...currentWishlist, item]
    }

    setWishlist(updated)
    localStorage.setItem('wishlist', JSON.stringify(updated))
  }

  // ── Add to Cart (Synchronized to /api/cart/addtocart) ──
  const handleBorrowClick = async (item) => {
    const user = getUserData()
    if (!user || !user.id) {
      setShowLoginModal(true)
      return
    }

    if (item.quantity !== undefined && item.quantity <= 0) {
      alert(`${item.productName || item.itemName} is currently out of stock!`)
      return
    }

    const rawProductId = item.id || item.productId
    const validProductId = Number(rawProductId)
    const validUserId = Number(user.id)

    if (!validProductId || isNaN(validProductId)) {
      alert('Invalid product selected.')
      return
    }

    const title = item.productName || item.hardwareName || item.itemName || 'Item'
    const existingCart = JSON.parse(localStorage.getItem('cart')) || []
    const isItemInCart = existingCart.some((cartItem) => (cartItem.productId || cartItem.id) === validProductId)

    if (isItemInCart) {
      alert(`${title} is already in your cart!`)
      return
    }

    try {
      await axios.post('http://localhost:8080/api/cart/addtocart', null, {
        params: {
          userid: validUserId,
          productid: validProductId,
          quantity: 1
        }
      })

      const newCartItem = {
        id: validProductId,
        productId: validProductId,
        name: title,
        image: getFullImageUrl(item.img || item.image),
        price: Number(item.price ?? item.perDayPrice ?? 0),
        quantity: 1
      }

      const updatedCart = [...existingCart, newCartItem]
      localStorage.setItem('cart', JSON.stringify(updatedCart))
      window.dispatchEvent(new Event('storage'))

      alert(`${title} added to cart successfully!`)
    } catch (err) {
      console.error('Database cart sync error:', err)
      alert('Failed to add item to database cart. Please verify your login session.')
    }
  }

  return (
    <>
      <style>{`
        .categories-hero-wrapper { position: relative; width: 100%; height: 90vh; overflow: hidden; }
        .categories-hero-image { width: 100%; height: 100%; object-fit: cover; filter: grayscale(20%); }
        .categories-hero-overlay { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.35); }
        .category-select-section { background-color: #f8fafc; padding: 70px 0; }
        .category-action-card {
          background-color: #ffffff; border-radius: 20px; padding: 30px 20px; display: flex;
          flex-direction: column; align-items: center; justify-content: center; cursor: pointer; transition: all 0.25s ease;
          border: 2px solid transparent; box-shadow: 0 4px 18px rgba(0, 0, 0, 0.04);
        }
        .category-action-card:hover { transform: translateY(-5px); box-shadow: 0 10px 25px rgba(13, 110, 253, 0.12); }
        .category-action-card.active { border-color: #0d6efd; background-color: #f0f7ff; }
        .category-icon-circle {
          width: 72px; height: 72px; background-color: #dbeafe; color: #2563eb; border-radius: 50%;
          display: flex; align-items: center; justify-content: center; font-size: 1.75rem; margin-bottom: 16px;
        }
        .category-action-card:hover .category-icon-circle, .category-action-card.active .category-icon-circle {
          background-color: #0d6efd; color: #ffffff;
        }
        .products-display-section { background-color: #ffffff; padding: 70px 0; border-top: 1px solid #e2e8f0; }
        .product-card {
          border: 1px solid #eef2f6; border-radius: 16px; overflow: hidden; background: #ffffff;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.04); cursor: pointer; position: relative;
        }
        .product-card:hover { transform: translateY(-4px); box-shadow: 0 10px 24px rgba(0, 0, 0, 0.08); }
        .product-img { height: 220px; width: 100%; object-fit: cover; }
        .wishlist-btn-card {
          position: absolute; top: 12px; right: 12px; width: 34px; height: 34px; background-color: rgba(255, 255, 255, 0.9);
          border: none; border-radius: 50%; display: flex; align-items: center; justify-content: center;
          box-shadow: 0 2px 8px rgba(0,0,0,0.15); z-index: 10; cursor: pointer; transition: transform 0.2s ease;
        }
        .wishlist-btn-card:hover { transform: scale(1.15); }
        .modal-overlay {
          position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(15, 23, 42, 0.65);
          backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 1050; padding: 1.25rem;
        }
        .auth-modal { background: #ffffff; border-radius: 16px; max-width: 420px; width: 100%; padding: 30px 25px; text-align: center; }
        .expanded-product-modal { background: #ffffff; border-radius: 20px; max-width: 820px; width: 100%; overflow: hidden; position: relative; }
        .modal-close-btn {
          position: absolute; top: 14px; right: 14px; background: #ffffff; border: none; width: 36px; height: 36px;
          border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; z-index: 10;
        }
      `}</style>

      <Header hideHero={true} />

      <div className="categories-hero-wrapper">
        <img src={catimg} alt="Categories Background" className="categories-hero-image" />
        <div className="categories-hero-overlay"></div>
      </div>

      {/* ── Categories Grid ── */}
      <section className="category-select-section">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="fw-bold">Select Product Category</h2>
            <p className="text-muted">Choose a category below to view and borrow available products.</p>
          </div>
          <div className="row g-4">
            {categoryList.map((cat) => (
              <div key={cat.id} className="col-12 col-sm-6 col-lg-3">
                <div
                  className={`category-action-card ${selectedCategory === cat.name ? 'active' : ''}`}
                  onClick={() => handleCategoryClick(cat.name)}
                >
                  <div className="category-icon-circle"><i className={`fa-solid ${cat.icon}`}></i></div>
                  <span className="badge bg-primary-subtle text-primary mb-2 rounded-pill px-3 py-1">{cat.itemsCount}</span>
                  <h5 className="fw-bold m-0">{cat.name}</h5>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Products Display ── */}
      {selectedCategory && (
        <section className="products-display-section" id="products-view" ref={productsSectionRef}>
          <div className="container">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h3 className="fw-bold text-dark m-0">{selectedCategory} Listings</h3>
              <button className="btn btn-outline-secondary btn-sm rounded-pill px-3" onClick={() => setSelectedCategory(null)}>
                Clear Selection
              </button>
            </div>

            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status"></div>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-5 bg-light rounded-4">
                <h5>No items found under "{selectedCategory}"</h5>
              </div>
            ) : (
              <div className="row g-4">
                {filteredProducts.map((product) => {
                  const itemId = product.id || product.productId
                  const isWishlisted = wishlist.some((w) => (w.id || w.productId) === itemId)
                  const imgSrc = getFullImageUrl(product.img || product.image)

                  return (
                    <div key={itemId} className="col-12 col-md-6 col-lg-4">
                      <div className="card h-100 product-card" onClick={() => setExpandedProduct(product)}>
                        <button
                          className="wishlist-btn-card"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleWishlistToggle(product)
                          }}
                          title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
                        >
                          <i className={`fa-heart ${isWishlisted ? 'fa-solid text-danger' : 'fa-regular text-secondary'}`}></i>
                        </button>

                        <img
                          src={imgSrc}
                          alt={product.productName}
                          className="product-img"
                          onError={(e) => {
                            e.target.onerror = null
                            e.target.src = 'https://via.placeholder.com/300x220?text=No+Image'
                          }}
                        />
                        <div className="card-body d-flex flex-column justify-content-between p-4">
                          <div>
                            <div className="d-flex justify-content-between align-items-start mb-2">
                              <h5 className="card-title fw-bold text-dark mb-0 text-truncate">{product.productName}</h5>
                              <span className="badge bg-secondary-subtle text-secondary small">{product.category}</span>
                            </div>
                            <p className="text-muted small text-truncate mb-2">{product.productDescription}</p>
                            <div className="d-flex align-items-center gap-3 mb-3">
                              <span className="text-warning small fw-bold">⭐ {product.rating || '4.5'}</span>
                              <span className={`badge ${product.quantity > 0 ? 'bg-success-subtle text-success' : 'bg-danger-subtle text-danger'}`}>
                                {product.quantity > 0 ? `${product.quantity} in stock` : 'Out of Stock'}
                              </span>
                            </div>
                          </div>

                          <div className="d-flex align-items-center justify-content-between mt-3 pt-3 border-top">
                            <span className="fs-5 fw-bold text-primary">
                              ₹{Number(product.price ?? product.perDayPrice ?? 0).toFixed(2)} <small className="text-muted fs-6 fw-normal">/ day</small>
                            </span>
                            <button
                              className="btn btn-primary rounded-pill px-4 btn-sm fw-semibold"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleBorrowClick(product)
                              }}
                              disabled={product.quantity !== undefined && product.quantity <= 0}
                            >
                              {product.quantity === undefined || product.quantity > 0 ? 'Rent Now' : 'Unavailable'}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </section>
      )}

      <Footer />

      {/* Expanded Modal */}
      {expandedProduct && (
        <div className="modal-overlay" onClick={() => setExpandedProduct(null)}>
          <div className="expanded-product-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setExpandedProduct(null)}>
              <i className="fa-solid fa-xmark text-muted"></i>
            </button>
            <div className="row g-0">
              <div className="col-12 col-md-5">
                <img
                  src={getFullImageUrl(expandedProduct.img || expandedProduct.image)}
                  alt={expandedProduct.productName}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', minHeight: '300px' }}
                />
              </div>
              <div className="col-12 col-md-7 p-4 p-md-5 d-flex flex-column justify-content-between">
                <div>
                  <h3 className="fw-bold mb-2">{expandedProduct.productName}</h3>
                  <p className="text-muted mb-4">{expandedProduct.productDescription}</p>
                </div>
                <div className="d-flex align-items-center justify-content-between pt-3 border-top">
                  <span className="fs-3 fw-bold text-primary">₹{Number(expandedProduct.price ?? expandedProduct.perDayPrice ?? 0).toFixed(2)}</span>
                  <button
                    className="btn btn-primary rounded-pill px-4 fw-semibold"
                    onClick={() => {
                      handleBorrowClick(expandedProduct)
                      setExpandedProduct(null)
                    }}
                    disabled={expandedProduct.quantity !== undefined && expandedProduct.quantity <= 0}
                  >
                    {expandedProduct.quantity === undefined || expandedProduct.quantity > 0 ? 'Rent Now' : 'Unavailable'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Login Modal */}
      {showLoginModal && (
        <div className="modal-overlay" onClick={() => setShowLoginModal(false)}>
          <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
            <div className="text-primary mb-3"><i className="fa-solid fa-lock fa-3x"></i></div>
            <h4 className="fw-bold mb-2">Login Required</h4>
            <p className="text-muted mb-4">Please log in first to rent or wishlist products.</p>
            <div className="d-flex justify-content-center gap-2">
              <button className="btn btn-outline-secondary px-4 rounded-pill" onClick={() => setShowLoginModal(false)}>Cancel</button>
              <button className="btn btn-primary px-4 rounded-pill" onClick={() => navigate('/login')}>Log In</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Categories