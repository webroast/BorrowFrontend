import React, { useState, useEffect } from 'react'
import Header from '../Component/Header'
import Footer from '../Component/Footer'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import wishimg from '../Images/Wishlistimg.png'

const Wishlist = () => {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [wishlist, setWishlist] = useState([])

  // Format backend or external image URLs directly using http://localhost:8080/
  const getFullImageUrl = (imageSrc) => {
    if (!imageSrc) return 'https://via.placeholder.com/300x220?text=No+Image'
    if (imageSrc.startsWith('http://') || imageSrc.startsWith('https://') || imageSrc.startsWith('data:')) {
      return imageSrc
    }
    const cleanPath = imageSrc.startsWith('/') ? imageSrc.substring(1) : imageSrc
    return `http://localhost:8080/${cleanPath}`
  }

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser)
        setUser(parsed)
        setIsLoggedIn(true)
      } catch (err) {
        console.error('Error parsing user data:', err)
      }
    }

    const savedWishlist = JSON.parse(localStorage.getItem('wishlist')) || []

    const normalized = savedWishlist.map((item) => {
      const prod = item.medicines || item.product || item.item || item
      return {
        id: prod.id || prod.productId || item.productId || item.id,
        name: prod.MedicineName || prod.productName || prod.itemName || prod.name || 'Rental Item',
        image: getFullImageUrl(prod.img || prod.image || prod.imageUrl || item.image),
        price: Number(prod.Price ?? prod.price ?? prod.perDayPrice ?? 0)
      }
    })

    setWishlist(normalized)
  }, [])

  const toggleWishlist = (item) => {
    const updated = wishlist.filter((w) => w.id !== item.id)
    setWishlist(updated)
    localStorage.setItem('wishlist', JSON.stringify(updated))
  }

  // Add single item directly to database
  const addToCartFromWishlist = async (item) => {
    if (!user || !user.id) {
      alert('Please log in to add items to your cart!')
      navigate('/login')
      return
    }

    try {
      await axios.post('http://localhost:8080/api/cart/addtocart', null, {
        params: {
          userid: user.id,
          productid: item.id,
          quantity: 1
        }
      })

      const existingCart = JSON.parse(localStorage.getItem('cart')) || []
      const existingIndex = existingCart.findIndex((c) => c.productId === item.id || c.id === item.id)

      if (existingIndex !== -1) {
        existingCart[existingIndex].quantity = (existingCart[existingIndex].quantity || 1) + 1
      } else {
        existingCart.push({
          id: item.id,
          productId: item.id,
          name: item.name,
          image: item.image,
          price: item.price,
          quantity: 1
        })
      }

      localStorage.setItem('cart', JSON.stringify(existingCart))
      window.dispatchEvent(new Event('storage'))

      alert(`${item.name} added to cart!`)
    } catch (err) {
      console.error('Error adding item to cart:', err)
      alert('Failed to add item to cart. Please try again.')
    }
  }

  // Move all items directly to database and navigate to /cart
  const handleMoveAllToCart = async () => {
    if (wishlist.length === 0) return

    if (!user || !user.id) {
      alert('Please log in to move items to your cart!')
      navigate('/login')
      return
    }

    try {
      await Promise.all(
        wishlist.map((item) =>
          axios.post('http://localhost:8080/api/cart/addtocart', null, {
            params: {
              userid: user.id,
              productid: item.id,
              quantity: 1
            }
          })
        )
      )

      setWishlist([])
      localStorage.removeItem('wishlist')
      navigate('/cart')
    } catch (err) {
      console.error('Error transferring items to cart:', err)
      alert('Could not move all items to cart. Please check your backend connection.')
    }
  }

  const itemCount = wishlist.length
  const btnLabel = itemCount === 1 ? '1 item' : `${itemCount} items`

  return (
    <>
      <style>{`
        .wishlist-hero-wrapper {
          position: relative;
          width: 100%;
          height: 65vh;
          overflow: hidden;
          background-color: #0f172a;
        }

        .wishlist-hero-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          filter: grayscale(20%);
        }

        .wishlist-hero-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.55);
          z-index: 1;
        }

        .wishlist-hero-content {
          position: absolute;
          inset: 0;
          z-index: 2;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          color: #ffffff;
          padding: 0 20px;
        }

        .wishlist-hero-content h1 {
          font-size: 2.8rem;
          font-weight: 800;
          text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.6);
        }

        .wishlist-count-badge {
          background-color: #0d6efd;
          color: #ffffff;
          border-radius: 50px;
          padding: 4px 14px;
          font-size: 0.95rem;
          font-weight: 700;
          margin-left: 12px;
          vertical-align: middle;
        }

        .wishlist-body-section {
          background-color: #f8fafc;
          padding: 70px 0;
          min-height: 55vh;
        }

        .wishlist-item-card {
          background-color: #ffffff !important;
          border: 1px solid #e2e8f0 !important;
          border-radius: 16px !important;
          overflow: hidden;
          transition: transform 0.25s ease, box-shadow 0.25s ease;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
        }

        .wishlist-item-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 10px 24px rgba(13, 110, 253, 0.1) !important;
          border-color: #bfdbfe !important;
        }

        .wishlist-img-container {
          position: relative;
          height: 200px;
          width: 100%;
          overflow: hidden;
          background-color: #f1f5f9;
        }

        .wishlist-item-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
        }

        .wishlist-item-card:hover .wishlist-item-img {
          transform: scale(1.05);
        }

        .remove-wishlist-btn {
          position: absolute;
          top: 12px;
          right: 12px;
          background-color: rgba(255, 255, 255, 0.9);
          border: 1px solid rgba(239, 68, 68, 0.2);
          color: #e11d48;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
          z-index: 3;
        }

        .remove-wishlist-btn:hover {
          background-color: #ffe4e6;
          transform: scale(1.1);
        }

        .wishlist-card-title {
          color: #0f172a;
          font-weight: 700;
          font-size: 1.05rem;
        }

        .wishlist-price-tag {
          color: #059669;
          font-weight: 700;
          font-size: 1rem;
        }

        .wishlist-add-cart-btn {
          background-color: #0d6efd;
          color: #ffffff;
          border: none;
          border-radius: 50px;
          padding: 8px 16px;
          font-size: 0.88rem;
          font-weight: 600;
          transition: background-color 0.2s ease;
          cursor: pointer;
        }

        .wishlist-add-cart-btn:hover {
          background-color: #0b5ed7;
        }

        .move-all-cart-btn {
          border-radius: 50px;
          font-weight: 700;
          background: linear-gradient(135deg, #0d6efd 0%, #0b5ed7 100%);
          border: none;
          color: #ffffff;
          padding: 14px 38px;
          font-size: 1rem;
          cursor: pointer;
          box-shadow: 0 4px 14px rgba(13, 110, 253, 0.3);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .move-all-cart-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 18px rgba(13, 110, 253, 0.4);
        }

        .empty-state-box {
          max-width: 440px;
          margin: 0 auto;
          padding: 50px 20px;
          text-align: center;
        }
      `}</style>

      <Header hideHero={true} />

      <div className="wishlist-hero-wrapper">
        <img src={wishimg} alt="Wishlist Banner" className="wishlist-hero-image" />
        <div className="wishlist-hero-overlay"></div>
        <div className="wishlist-hero-content">
          <h1>
            Your Wishlist
            {wishlist.length > 0 && (
              <span className="wishlist-count-badge">{wishlist.length}</span>
            )}
          </h1>
        </div>
      </div>

      <div className="wishlist-body-section">
        <div className="container">
          {!isLoggedIn && (
            <div className="empty-state-box">
              <h3 className="fw-bold mb-2">Login to View Wishlist</h3>
              <p className="text-muted mb-4">Sign in to sync and transfer your saved items directly to the database cart.</p>
              <div className="d-flex gap-2 justify-content-center">
                <Link to="/login" className="btn btn-primary rounded-pill px-4">Login</Link>
                <Link to="/register" className="btn btn-outline-primary rounded-pill px-4">Register</Link>
              </div>
            </div>
          )}

          {isLoggedIn && wishlist.length > 0 && (
            <div>
              <div className="row g-4">
                {wishlist.map((item) => (
                  <div key={item.id} className="col-12 col-md-6 col-lg-4 col-xl-3">
                    <div className="card h-100 wishlist-item-card">
                      <div className="wishlist-img-container">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="wishlist-item-img"
                          onError={(e) => {
                            e.target.onerror = null
                            e.target.src = 'https://via.placeholder.com/300x220?text=No+Image'
                          }}
                        />
                        <button
                          className="remove-wishlist-btn"
                          title="Remove item"
                          onClick={() => toggleWishlist(item)}
                        >
                          ✕
                        </button>
                      </div>

                      <div className="card-body p-3 d-flex flex-column justify-content-between">
                        <div>
                          <h6 className="wishlist-card-title mb-1 text-truncate" title={item.name}>
                            {item.name}
                          </h6>
                          <span className="wishlist-price-tag">
                            ₹{Number(item.price).toFixed(2)}
                          </span>
                        </div>
                        <button
                          className="wishlist-add-cart-btn mt-3"
                          onClick={() => addToCartFromWishlist(item)}
                        >
                          + Add to Cart
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-center mt-5">
                <button className="move-all-cart-btn" onClick={handleMoveAllToCart}>
                  Move All to Cart ({btnLabel}) &amp; Proceed
                </button>
              </div>
            </div>
          )}

          {isLoggedIn && wishlist.length === 0 && (
            <div className="empty-state-box">
              <h3 className="fw-bold mb-2">Your Wishlist is Empty</h3>
              <p className="text-muted mb-4">Browse available items and add them to your wishlist to keep track of your favorites.</p>
              <Link to="/" className="btn btn-primary rounded-pill px-4">Browse Items</Link>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </>
  )
}

export default Wishlist