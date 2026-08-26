import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import Header from '../Component/Header'
import Footer from '../Component/Footer'
import { ChevronDown, Trash2, Plus, Minus } from 'lucide-react'
import cartimg from '../Images/CartBackground.png'

const Cart = () => {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [cartItems, setCartItems] = useState([])
  const [loading, setLoading] = useState(true)

  // Direct backend image path handler
  const getFullImageUrl = (imageSrc) => {
    if (!imageSrc) return 'https://via.placeholder.com/150?text=No+Image'
    if (imageSrc.startsWith('http://') || imageSrc.startsWith('https://') || imageSrc.startsWith('data:')) {
      return imageSrc
    }
    const cleanPath = imageSrc.startsWith('/') ? imageSrc.substring(1) : imageSrc
    return `http://localhost:8080/${cleanPath}`
  }

  // Normalize data according to your Cart entity structure
  const normalizeCartItem = (item) => {
    const prod = item.product || item.hardware || item.medicines || item.item || item

    return {
      cartId: item.id, // ID of Cart record for /patch/{id} and /delete/{id}
      productId: prod.id || prod.productId || item.productId,
      name: prod.productName || prod.hardwareName || prod.MedicineName || prod.name || 'Hardware Item',
      price: Number(prod.price ?? prod.Price ?? prod.perDayPrice ?? prod.rentalPrice ?? 0),
      image: getFullImageUrl(prod.img || prod.image || prod.imageUrl || item.image),
      quantity: Number(item.quantity) || 1
    }
  }

  // 1. GET: http://localhost:8080/api/cart/cartitem/{userid}
  const fetchCartFromDB = async (userId) => {
    try {
      setLoading(true)
      const response = await axios.get(`http://localhost:8080/api/cart/cartitem/${userId}`)
      if (Array.isArray(response.data)) {
        const parsedItems = response.data.map(normalizeCartItem)
        setCartItems(parsedItems)
        localStorage.setItem('cart', JSON.stringify(parsedItems))
      }
    } catch (error) {
      console.error('Error fetching cart from DB:', error)
      const fallback = JSON.parse(localStorage.getItem('cart')) || []
      setCartItems(fallback.map(normalizeCartItem))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const stored = localStorage.getItem('user')
    if (stored) {
      try {
        const parsedUser = JSON.parse(stored)
        setUser(parsedUser)
        if (parsedUser && parsedUser.id) {
          fetchCartFromDB(parsedUser.id)
        } else {
          setLoading(false)
        }
      } catch (err) {
        console.error('Error parsing user:', err)
        setLoading(false)
      }
    } else {
      setLoading(false)
    }
  }, [])

  // 2. PATCH: http://localhost:8080/api/cart/patch/{id} (Increase)
  const increaseQuantity = async (item) => {
    const newQuantity = item.quantity + 1

    setCartItems((prev) =>
      prev.map((i) => (i.cartId === item.cartId ? { ...i, quantity: newQuantity } : i))
    )

    try {
      await axios.patch(`http://localhost:8080/api/cart/patch/${item.cartId}`, {
        quantity: newQuantity
      })
    } catch (err) {
      console.error('Error updating quantity:', err)
      setCartItems((prev) =>
        prev.map((i) => (i.cartId === item.cartId ? { ...i, quantity: item.quantity } : i))
      )
    }
  }

  // 3. PATCH: http://localhost:8080/api/cart/patch/{id} (Decrease)
  const decreaseQuantity = async (item) => {
    if (item.quantity <= 1) return

    const newQuantity = item.quantity - 1

    setCartItems((prev) =>
      prev.map((i) => (i.cartId === item.cartId ? { ...i, quantity: newQuantity } : i))
    )

    try {
      await axios.patch(`http://localhost:8080/api/cart/patch/${item.cartId}`, {
        quantity: newQuantity
      })
    } catch (err) {
      console.error('Error updating quantity:', err)
      setCartItems((prev) =>
        prev.map((i) => (i.cartId === item.cartId ? { ...i, quantity: item.quantity } : i))
      )
    }
  }

  // 4. DELETE: http://localhost:8080/api/cart/delete/{id}
  const removeItem = async (item) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this item?')
    if (!confirmDelete) return

    try {
      await axios.delete(`http://localhost:8080/api/cart/delete/${item.cartId}`)
      const updated = cartItems.filter((i) => i.cartId !== item.cartId)
      setCartItems(updated)
      localStorage.setItem('cart', JSON.stringify(updated))
      window.dispatchEvent(new Event('storage'))
    } catch (err) {
      console.error('Error removing item:', err)
      alert('Failed to delete item from cart.')
    }
  }

  // Dynamic Price Calculations
  const subtotal = cartItems.reduce(
    (sum, item) => sum + (Number(item.price) || 0) * (Number(item.quantity) || 1),
    0
  )
  const deliveryFee = subtotal > 499 || subtotal === 0 ? 0 : 49
  const totalAmount = subtotal + deliveryFee

  const handleScrollDown = () => {
    const cartSection = document.getElementById('cart-items-section')
    if (cartSection) cartSection.scrollIntoView({ behavior: 'smooth' })
  }

  const handleProceedToCheckout = () => {
    if (cartItems.length === 0) {
      alert('Your cart is empty!')
      return
    }
    navigate('/ordersummary', {
      state: {
        cartItems,
        subtotal: Number(subtotal.toFixed(2)),
        deliveryFee: Number(deliveryFee.toFixed(2)),
        totalAmount: Number(totalAmount.toFixed(2))
      }
    })
  }

  return (
    <>
      <Header hideHero={true} />

      <div className="cart-hero-wrapper" style={{ position: 'relative', width: '100%', height: '70vh', overflow: 'hidden' }}>
        <img src={cartimg} alt="Cart Background" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.45)' }}></div>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
          <h1 className="fw-bold display-5">Your Cart</h1>
          <button
            onClick={handleScrollDown}
            style={{
              marginTop: '20px',
              background: 'rgba(255,255,255,0.2)',
              border: '1px solid #fff',
              borderRadius: '50%',
              width: '48px',
              height: '48px',
              color: '#fff',
              cursor: 'pointer'
            }}
          >
            <ChevronDown size={28} />
          </button>
        </div>
      </div>

      <div className="bg-light py-5" id="cart-items-section">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="fw-bold mb-0">Items in Cart</h2>
            <span className="badge bg-primary fs-6 rounded-pill px-3 py-2">
              {cartItems.length} item{cartItems.length !== 1 ? 's' : ''}
            </span>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <h4>Loading your cart...</h4>
            </div>
          ) : !user ? (
            <div className="text-center py-5">
              <h4 className="text-muted mb-3">Please login to view your cart.</h4>
              <Link to="/login" className="btn btn-primary rounded-pill px-4 py-2">Login to Continue</Link>
            </div>
          ) : cartItems.length === 0 ? (
            <div className="text-center py-5">
              <h4 className="text-muted mb-3">Your cart is currently empty.</h4>
              <Link to="/" className="btn btn-outline-primary rounded-pill px-4 py-2">Shop Now</Link>
            </div>
          ) : (
            <div className="row g-4">
              <div className="col-lg-8">
                <div className="card border-0 shadow-sm p-3 rounded-4">
                  {cartItems.map((item) => (
                    <div
                      key={item.cartId || item.productId}
                      className="d-flex align-items-center justify-content-between border-bottom py-3 flex-wrap gap-3"
                    >
                      <div className="d-flex align-items-center gap-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="rounded-3"
                          style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                          onError={(e) => {
                            e.target.onerror = null
                            e.target.src = 'https://via.placeholder.com/150?text=No+Image'
                          }}
                        />
                        <div>
                          <h6 className="mb-1 fw-bold text-dark">{item.name}</h6>
                          <span className="text-muted small">₹{Number(item.price).toFixed(2)} / item</span>
                        </div>
                      </div>

                      <div className="d-flex align-items-center gap-2">
                        <button
                          className="btn btn-sm btn-outline-secondary rounded-circle"
                          style={{ width: '32px', height: '32px', padding: 0 }}
                          onClick={() => decreaseQuantity(item)}
                          disabled={item.quantity <= 1}
                        >
                          <Minus size={14} />
                        </button>
                        <span className="px-2 fw-bold">{item.quantity}</span>
                        <button
                          className="btn btn-sm btn-outline-secondary rounded-circle"
                          style={{ width: '32px', height: '32px', padding: 0 }}
                          onClick={() => increaseQuantity(item)}
                        >
                          <Plus size={14} />
                        </button>
                      </div>

                      <div className="d-flex align-items-center gap-3">
                        <span className="fw-bold fs-6">
                          ₹{(item.price * item.quantity).toFixed(2)}
                        </span>
                        <button
                          className="btn btn-link text-danger p-0"
                          onClick={() => removeItem(item)}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="col-lg-4">
                <div className="card border-0 shadow-sm p-4 rounded-4">
                  <h5 className="fw-bold mb-3">Order Summary</h5>
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-muted">Subtotal</span>
                    <span className="fw-semibold">₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-muted">Delivery</span>
                    <span className={deliveryFee === 0 ? 'text-success fw-semibold' : 'fw-semibold'}>
                      {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee.toFixed(2)}`}
                    </span>
                  </div>

                  {deliveryFee > 0 && (
                    <p className="text-muted small">
                      Add ₹{(499 - subtotal).toFixed(2)} more for free delivery
                    </p>
                  )}

                  <hr />
                  <div className="d-flex justify-content-between mb-4 fs-5 fw-bold">
                    <span>Total</span>
                    <span className="text-primary">₹{totalAmount.toFixed(2)}</span>
                  </div>
                  <button
                    className="btn btn-primary w-100 rounded-pill py-2 fw-semibold"
                    onClick={handleProceedToCheckout}
                  >
                    Proceed to Checkout
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </>
  )
}

export default Cart