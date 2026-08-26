import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import Header from '../Component/Header'
import Footer from '../Component/Footer'
import heroVideo from '../Images/HeroVideo.mp4'
import cardsData from '../Images/CardData.json'
import itemData from '../Images/itemsData.json'

const Home = () => {
  const [trendingProducts, setTrendingProducts] = useState(itemData)
  const [wishlist, setWishlist] = useState([])
  const [showLoginModal, setShowLoginModal] = useState(false)
  const navigate = useNavigate()

  // Format backend or external image URLs
  const getFullImageUrl = (imageSrc) => {
    if (!imageSrc) return 'https://via.placeholder.com/300x220?text=No+Image'
    if (imageSrc.startsWith('http://') || imageSrc.startsWith('https://') || imageSrc.startsWith('data:')) {
      return imageSrc
    }
    const cleanPath = imageSrc.startsWith('/') ? imageSrc.substring(1) : imageSrc
    return `http://localhost:8080/${cleanPath}`
  }

  // Authentication check helper - handles all possible ID field variations
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

  // Fetch real-time products
  useEffect(() => {
    axios
      .get('http://localhost:8080/products/viewall')
      .then((response) => {
        if (Array.isArray(response.data) && response.data.length > 0) {
          setTrendingProducts(response.data.slice(0, 6))
        }
      })
      .catch((error) => console.warn('Backend unavailable, using fallback:', error))

    const storedWishlist = JSON.parse(localStorage.getItem('wishlist')) || []
    setWishlist(storedWishlist)
  }, [])

  const handleCategoryCardClick = (categoryName) => {
    navigate(`/categories?category=${encodeURIComponent(categoryName)}`)
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

  // ── Add to Cart Handler (Local + DB sync via /api/cart/addtocart) ──
  const handleBorrowClick = async (item) => {
    const user = getUserData()
    if (!user || !user.id) {
      setShowLoginModal(true)
      return
    }

    const rawProductId = item.id || item.productId
    const validProductId = Number(rawProductId)
    const validUserId = Number(user.id)

    if (!validProductId || isNaN(validProductId)) {
      alert('Invalid product selected.')
      return
    }

    const title = item.itemName || item.productName || item.hardwareName || 'Item'
    const existingCart = JSON.parse(localStorage.getItem('cart')) || []
    const isItemInCart = existingCart.some((cartItem) => (cartItem.productId || cartItem.id) === validProductId)

    if (isItemInCart) {
      alert(`${title} is already in your cart!`)
      return
    }

    try {
      // POST: http://localhost:8080/api/cart/addtocart?userid=...&productid=...&quantity=1
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
        image: getFullImageUrl(item.image || item.img),
        price: Number(item.perDayPrice ?? item.price ?? 0),
        quantity: 1
      }

      const updatedCart = [...existingCart, newCartItem]
      localStorage.setItem('cart', JSON.stringify(updatedCart))
      window.dispatchEvent(new Event('storage'))

      alert(`${title} added to cart successfully!`)
    } catch (err) {
      console.error('Database cart sync error:', err)
      alert('Failed to add item to database cart. Please make sure your login session is valid.')
    }
  }

  return (
    <>
      <style>{`
        .card-section, .trending-section { padding: 80px 0; background-color: #f8f9fa; }
        .section-main-title { color: #212529; font-size: 2.25rem; }
        .category-underline, .steps-underline, .trending-underline, .trust-underline, .news-underline {
          width: 60px; height: 4px; background-color: #0d6efd; margin: 12px auto 0 auto; border-radius: 2px;
        }
        .steps-subtitle { color: #6c757d; font-size: 1.1rem; margin-top: 15px; }
        .custom-card { border: none; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05); cursor: pointer; height: 250px; }
        .card-img-wrapper { width: 100%; height: 250px; overflow: hidden; position: relative; }
        .card-img-wrapper img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.4s ease; }
        .custom-card:hover .card-img-wrapper img { transform: scale(1.05); }
        .card-text-overlay {
          position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.4);
          display: flex; align-items: center; justify-content: center; transition: opacity 0.3s ease;
        }
        .custom-card:hover .card-text-overlay { opacity: 0; }
        .card-overlay-title { color: #ffffff; font-size: 1.25rem; font-weight: bold; margin: 0; }
        .trending-item-card { border: none; border-radius: 12px; background-color: #ffffff; overflow: hidden; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05); }
        .wishlist-btn {
          position: absolute; top: 15px; right: 15px; width: 36px; height: 36px; background-color: #ffffff;
          border: none; border-radius: 50%; display: flex; align-items: center; justify-content: center;
          box-shadow: 0 2px 8px rgba(0,0,0,0.15); z-index: 10; cursor: pointer; transition: transform 0.2s ease;
        }
        .wishlist-btn:hover { transform: scale(1.15); }
        .modal-overlay {
          position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0, 0, 0, 0.6);
          display: flex; align-items: center; justify-content: center; z-index: 1050; padding: 1rem;
        }
        .auth-modal { background: #ffffff; border-radius: 16px; max-width: 420px; width: 100%; padding: 30px 25px; text-align: center; }
      `}</style>

      <Header videoSrc={heroVideo} />

      {/* ── Browse By Category ── */}
      <section className="card-section">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="section-main-title fw-bold m-0">Browse By Category</h2>
            <div className="category-underline"></div>
          </div>
          <div className="row g-4">
            {cardsData.map((card) => (
              <div key={card.id} className="col-12 col-md-6 col-lg-3">
                <div className="card custom-card" onClick={() => handleCategoryCardClick(card.name)}>
                  <div className="card-img-wrapper">
                    <img src={card.image} alt={card.name} />
                    <div className="card-text-overlay">
                      <h5 className="card-overlay-title">{card.name}</h5>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Trending Rentals ── */}
      <section className="trending-section">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="section-main-title fw-bold m-0">Trending Rentals</h2>
            <div className="trending-underline"></div>
          </div>
          <div className="row g-4">
            {trendingProducts.map((item) => {
              const productName = item.itemName || item.productName || item.hardwareName || 'Rental Item'
              const price = item.perDayPrice ?? item.price ?? 0
              const rating = item.starRating ?? item.rating ?? '4.5'
              const imgSrc = getFullImageUrl(item.image || item.img)
              const itemId = item.id || item.productId
              const isWishlisted = wishlist.some((w) => (w.id || w.productId) === itemId)

              return (
                <div key={itemId} className="col-12 col-md-6 col-lg-4">
                  <div className="card h-100 trending-item-card position-relative">
                    <button
                      className="wishlist-btn"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleWishlistToggle(item)
                      }}
                      title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
                    >
                      <i className={`fa-heart ${isWishlisted ? 'fa-solid text-danger' : 'fa-regular text-secondary'}`}></i>
                    </button>

                    <img
                      src={imgSrc}
                      alt={productName}
                      style={{ height: '220px', objectFit: 'cover', width: '100%' }}
                      onError={(e) => {
                        e.target.onerror = null
                        e.target.src = 'https://via.placeholder.com/300x220?text=No+Image'
                      }}
                    />
                    <div className="card-body d-flex flex-column justify-content-between p-4">
                      <div>
                        <h5 className="card-title fw-bold text-dark mb-2 text-truncate">{productName}</h5>
                        <div className="mb-3 text-warning">
                          <i className="fa-solid fa-star me-1"></i>
                          <span className="text-muted small fw-bold">({rating})</span>
                        </div>
                      </div>
                      <div className="d-flex align-items-center justify-content-between mt-2">
                        <span className="fs-5 fw-bold text-dark">
                          ₹{price} <small className="text-muted fw-normal">/ day</small>
                        </span>
                        <button className="btn btn-primary rounded-pill px-4 btn-sm fw-semibold" onClick={() => handleBorrowClick(item)}>
                          Rent Now
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <Footer />

      {/* ── Login Modal ── */}
      {showLoginModal && (
        <div className="modal-overlay" onClick={() => setShowLoginModal(false)}>
          <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
            <div className="text-primary mb-3">
              <i className="fa-solid fa-lock fa-3x"></i>
            </div>
            <h4 className="fw-bold mb-2">Login Required</h4>
            <p className="text-muted mb-4">Please log in first to rent or wishlist products.</p>
            <div className="d-flex justify-content-center gap-2">
              <button className="btn btn-outline-secondary px-4 rounded-pill" onClick={() => setShowLoginModal(false)}>
                Cancel
              </button>
              <button className="btn btn-primary px-4 rounded-pill" onClick={() => navigate('/login')}>
                Log In
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Home