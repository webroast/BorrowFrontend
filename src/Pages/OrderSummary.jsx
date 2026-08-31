import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import axios from 'axios'
import Header from '../Component/Header'
import Footer from '../Component/Footer'
import { ChevronDown, ShieldCheck, Truck, ArrowLeft } from 'lucide-react'
import ordersummary from '../Images/ordersummary.png'

const OrderSummary = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const [user, setUser] = useState(null)
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [payLoading, setPayLoading] = useState(false)

  // Delivery Form State
  const [deliveryInfo, setDeliveryInfo] = useState({
    fullName: '',
    phone: '',
    email: '',
    houseNo: '',
    street: '',
    landmark: '',
    city: '',
    state: '',
    pincode: ''
  })

  const [formErrors, setFormErrors] = useState({})

  // Handle Input Changes
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setDeliveryInfo((prev) => ({ ...prev, [name]: value }))
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  // Backend image URL formatter
  const getFullImageUrl = (imageSrc) => {
    if (!imageSrc) return 'https://via.placeholder.com/150?text=No+Image'
    if (imageSrc.startsWith('http://') || imageSrc.startsWith('https://') || imageSrc.startsWith('data:')) {
      return imageSrc
    }
    const cleanPath = imageSrc.startsWith('/') ? imageSrc.substring(1) : imageSrc
    return `http://localhost:8080/${cleanPath}`
  }

  // Item normalization helper matching Cart.jsx
  const normalizeCartItem = (item) => {
    const prod = item.product || item.hardware || item.medicines || item.item || item

    return {
      cartId: item.id,
      productId: prod?.id || prod?.productId || item.productId,
      name: prod?.productName || prod?.hardwareName || prod?.MedicineName || prod?.name || 'Item',
      price: Number(prod?.price ?? prod?.Price ?? prod?.perDayPrice ?? prod?.rentalPrice ?? 0),
      image: getFullImageUrl(prod?.img || prod?.image || prod?.imageUrl || item.image),
      quantity: Number(item.quantity) || 1
    }
  }

  // Database fetch fallback if reloaded
  const fetchCartFromDB = async (userId) => {
    try {
      setLoading(true)
      const response = await axios.get(`http://localhost:8080/api/cart/cartitem/${userId}`)
      if (Array.isArray(response.data)) {
        const parsedItems = response.data.map(normalizeCartItem)
        setItems(parsedItems)
      }
    } catch (error) {
      console.error('Error fetching order items from DB:', error)
      const fallback = JSON.parse(localStorage.getItem('cart')) || []
      setItems(fallback.map(normalizeCartItem))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    let parsedUser = null

    if (storedUser) {
      try {
        parsedUser = JSON.parse(storedUser)
        setUser(parsedUser)
        setDeliveryInfo((prev) => ({
          ...prev,
          fullName: parsedUser?.name || parsedUser?.username || '',
          phone: parsedUser?.phone || parsedUser?.mobile || '',
          email: parsedUser?.email || '',
          houseNo: parsedUser?.houseNo || '',
          street: parsedUser?.street || '',
          landmark: parsedUser?.landmark || '',
          city: parsedUser?.city || '',
          state: parsedUser?.state || '',
          pincode: parsedUser?.pincode || ''
        }))
      } catch (err) {
        console.error('Error reading user:', err)
      }
    }

    if (location.state?.cartItems && location.state.cartItems.length > 0) {
      setItems(location.state.cartItems)
      setLoading(false)
    } else if (parsedUser?.id || parsedUser?.user?.id) {
      fetchCartFromDB(parsedUser?.id || parsedUser?.user?.id)
    } else {
      const localCart = JSON.parse(localStorage.getItem('cart')) || []
      setItems(localCart.map(normalizeCartItem))
      setLoading(false)
    }
  }, [location.state])

  // Price Calculations
  const subtotal = items.reduce(
    (sum, item) => sum + (Number(item.price) || 0) * (Number(item.quantity) || 1),
    0
  )
  const deliveryFee = subtotal > 499 || subtotal === 0 ? 0 : 49
  const totalAmount = subtotal + deliveryFee

  // Validate form fields before opening Razorpay
  const validateDeliveryForm = () => {
    const errors = {}
    if (!deliveryInfo.fullName.trim()) errors.fullName = 'Full name is required'
    if (!deliveryInfo.phone.trim()) errors.phone = 'Phone number is required'
    if (!deliveryInfo.houseNo.trim()) errors.houseNo = 'House / Flat number is required'
    if (!deliveryInfo.street.trim()) errors.street = 'Street address is required'
    if (!deliveryInfo.city.trim()) errors.city = 'City is required'
    if (!deliveryInfo.state.trim()) errors.state = 'State is required'
    if (!deliveryInfo.pincode.trim()) errors.pincode = 'Pincode is required'

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  // Dynamically load Razorpay SDK
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true)
        return
      }
      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      script.onload = () => resolve(true)
      script.onerror = () => resolve(false)
      document.body.appendChild(script)
    })
  }

  // Razorpay Payment Flow Trigger
  const handlePayment = async () => {
    if (items.length === 0 || totalAmount <= 0) {
      alert('Your order is empty!')
      return
    }

    if (!validateDeliveryForm()) {
      alert('Please fill in all mandatory delivery address fields.')
      return
    }

    setPayLoading(true)

    // 1. Ensure Razorpay SDK is loaded
    const isScriptLoaded = await loadRazorpayScript()
    if (!isScriptLoaded) {
      alert('Razorpay SDK failed to load. Please check your internet connection.')
      setPayLoading(false)
      return
    }

    try {
      const payAmount = Math.round(totalAmount)

      // 2. Call Spring Boot Backend to create transaction order
      const response = await axios.get(`http://localhost:8080/api/payment/create-order/${payAmount}`)
      const orderData = response.data

      const orderId = orderData?.orderId || orderData?.orderid

      if (!orderData || !orderId) {
        alert('Server failed to initiate transaction. Please try again.')
        setPayLoading(false)
        return
      }

      // 3. Configure Razorpay modal options
      const options = {
        key: orderData.key,
        amount: orderData.amount, // in paise
        currency: orderData.currency || 'INR',
        name: 'Borrow',
        description: 'Order Payment Checkout',
        image: 'https://cdn-icons-png.flaticon.com/512/1006/1006771.png',
        order_id: orderId,
        handler: async function (paymentResponse) {
          try {
            const currentUserId = user?.id || user?.user?.id

            if (!currentUserId) {
              alert('User ID is missing. Please log in again.')
              navigate('/login')
              return
            }

            // 4. Save order to MyOrders and clear MySQL cart table
            const saveRes = await axios.post(
              `http://localhost:8080/api/orders/place-order/${currentUserId}/${paymentResponse.razorpay_payment_id}`
            )

            if (saveRes.status === 200 || saveRes.status === 201) {
              // 5. Clear LocalStorage and state
              localStorage.removeItem('cart')
              window.dispatchEvent(new Event('storage'))

              alert(`Payment Successful! Your order has been placed.\nPayment ID: ${paymentResponse.razorpay_payment_id}`)

              // 6. Navigate directly to My Orders page
              navigate('/myorders')
            }
          } catch (orderSaveErr) {
            console.error('Error saving order details to database:', orderSaveErr)
            alert('Payment succeeded, but failed to save order records. Please contact customer support.')
          }
        },
        prefill: {
          name: deliveryInfo.fullName,
          email: deliveryInfo.email || user?.email || '',
          contact: deliveryInfo.phone
        },
        notes: {
          address: `${deliveryInfo.houseNo}, ${deliveryInfo.street}, ${deliveryInfo.landmark ? deliveryInfo.landmark + ', ' : ''}${deliveryInfo.city}, ${deliveryInfo.state} - ${deliveryInfo.pincode}`
        },
        theme: {
          color: '#0d6efd'
        }
      }

      // 7. Open Razorpay modal
      const razorpayInstance = new window.Razorpay(options)

      razorpayInstance.on('payment.failed', function (failureResponse) {
        alert(`Payment Failed: ${failureResponse.error?.description || 'Transaction cancelled'}`)
      })

      razorpayInstance.open()
    } catch (error) {
      console.error('Error in Razorpay payment checkout:', error)
      alert('Could not start Razorpay payment. Please ensure your backend is running on port 8080.')
    } finally {
      setPayLoading(false)
    }
  }

  const handleScrollDown = () => {
    const summarySection = document.getElementById('summary-section')
    if (summarySection) summarySection.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      <Header hideHero={true} />

      {/* Hero Section */}
      <div
        className="summary-hero-wrapper"
        style={{
          position: 'relative',
          width: '100%',
          height: '70vh',
          overflow: 'hidden'
        }}
      >
        <img
          src={ordersummary}
          alt="Order Summary Background"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.45)' }}></div>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff'
          }}
        >
          <h1 className="fw-bold display-5 mt-5 pt-5">Order Summary</h1>
          <p className="lead opacity-75 mb-0">Confirm delivery address and complete your checkout</p>
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

      {/* Main Order Content */}
      <div className="bg-light py-5" id="summary-section">
        <div className="container">
          <div className="mb-4">
            <Link to="/cart" className="text-decoration-none text-muted d-inline-flex align-items-center gap-1">
              <ArrowLeft size={18} /> Back to Cart
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary mb-3" role="status"></div>
              <h4>Loading order summary...</h4>
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-5">
              <h4 className="text-muted mb-3">No items found in your order.</h4>
              <Link to="/" className="btn btn-primary rounded-pill px-4 py-2">
                Continue Shopping
              </Link>
            </div>
          ) : (
            <div className="row g-4">
              {/* Left Column: Items and Delivery Form */}
              <div className="col-lg-8">
                {/* Items Card */}
                <div className="card border-0 shadow-sm p-4 rounded-4 mb-4">
                  <div className="d-flex justify-content-between align-items-center mb-3 border-bottom pb-3">
                    <h5 className="fw-bold mb-0">Order Items</h5>
                    <span className="badge bg-primary rounded-pill px-3 py-2">
                      {items.length} item{items.length !== 1 ? 's' : ''}
                    </span>
                  </div>

                  {items.map((item) => (
                    <div
                      key={item.cartId || item.productId}
                      className="d-flex align-items-center justify-content-between border-bottom py-3 flex-wrap gap-3"
                    >
                      <div className="d-flex align-items-center gap-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="rounded-3"
                          style={{ width: '70px', height: '70px', objectFit: 'cover' }}
                          onError={(e) => {
                            e.target.onerror = null
                            e.target.src = 'https://via.placeholder.com/150?text=No+Image'
                          }}
                        />
                        <div>
                          <h6 className="mb-1 fw-bold text-dark">{item.name}</h6>
                          <div className="text-muted small">
                            ₹{Number(item.price).toFixed(2)} × {item.quantity}
                          </div>
                        </div>
                      </div>

                      <div className="text-end">
                        <span className="fw-bold fs-6">
                          ₹{(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Delivery Information Form */}
                <div className="card border-0 shadow-sm p-4 rounded-4">
                  <h5 className="fw-bold mb-3 d-flex align-items-center gap-2">
                    <Truck size={20} className="text-primary" /> Delivery Information
                  </h5>
                  <p className="text-muted small mb-4">
                    Please provide accurate location details for delivery.
                  </p>

                  <div className="row g-3">
                    {/* Full Name */}
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold text-secondary">
                        Recipient Name <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        className={`form-control ${formErrors.fullName ? 'is-invalid' : ''}`}
                        placeholder="e.g. John Doe"
                        value={deliveryInfo.fullName}
                        onChange={handleInputChange}
                      />
                      {formErrors.fullName && <div className="invalid-feedback">{formErrors.fullName}</div>}
                    </div>

                    {/* Phone Number */}
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold text-secondary">
                        Contact Phone <span className="text-danger">*</span>
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        className={`form-control ${formErrors.phone ? 'is-invalid' : ''}`}
                        placeholder="e.g. 9876543210"
                        value={deliveryInfo.phone}
                        onChange={handleInputChange}
                      />
                      {formErrors.phone && <div className="invalid-feedback">{formErrors.phone}</div>}
                    </div>

                    {/* Email */}
                    <div className="col-12">
                      <label className="form-label small fw-semibold text-secondary">
                        Email Address <span className="text-muted fw-normal">(For Razorpay Invoice)</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        className="form-control"
                        placeholder="e.g. customer@example.com"
                        value={deliveryInfo.email}
                        onChange={handleInputChange}
                      />
                    </div>

                    {/* House / Flat No */}
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold text-secondary">
                        Flat / House No. / Building <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        name="houseNo"
                        className={`form-control ${formErrors.houseNo ? 'is-invalid' : ''}`}
                        placeholder="e.g. Flat 402, Building A"
                        value={deliveryInfo.houseNo}
                        onChange={handleInputChange}
                      />
                      {formErrors.houseNo && <div className="invalid-feedback">{formErrors.houseNo}</div>}
                    </div>

                    {/* Landmark */}
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold text-secondary">
                        Landmark <span className="text-muted fw-normal">(Optional)</span>
                      </label>
                      <input
                        type="text"
                        name="landmark"
                        className="form-control"
                        placeholder="e.g. Near City Hospital"
                        value={deliveryInfo.landmark}
                        onChange={handleInputChange}
                      />
                    </div>

                    {/* Street */}
                    <div className="col-12">
                      <label className="form-label small fw-semibold text-secondary">
                        Street Address / Area / Road <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        name="street"
                        className={`form-control ${formErrors.street ? 'is-invalid' : ''}`}
                        placeholder="e.g. MG Road, Near Market"
                        value={deliveryInfo.street}
                        onChange={handleInputChange}
                      />
                      {formErrors.street && <div className="invalid-feedback">{formErrors.street}</div>}
                    </div>

                    {/* City */}
                    <div className="col-md-4">
                      <label className="form-label small fw-semibold text-secondary">
                        City <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        name="city"
                        className={`form-control ${formErrors.city ? 'is-invalid' : ''}`}
                        placeholder="e.g. Mumbai"
                        value={deliveryInfo.city}
                        onChange={handleInputChange}
                      />
                      {formErrors.city && <div className="invalid-feedback">{formErrors.city}</div>}
                    </div>

                    {/* State */}
                    <div className="col-md-4">
                      <label className="form-label small fw-semibold text-secondary">
                        State <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        name="state"
                        className={`form-control ${formErrors.state ? 'is-invalid' : ''}`}
                        placeholder="e.g. Maharashtra"
                        value={deliveryInfo.state}
                        onChange={handleInputChange}
                      />
                      {formErrors.state && <div className="invalid-feedback">{formErrors.state}</div>}
                    </div>

                    {/* Pincode */}
                    <div className="col-md-4">
                      <label className="form-label small fw-semibold text-secondary">
                        Pincode <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        name="pincode"
                        className={`form-control ${formErrors.pincode ? 'is-invalid' : ''}`}
                        placeholder="e.g. 400053"
                        value={deliveryInfo.pincode}
                        onChange={handleInputChange}
                      />
                      {formErrors.pincode && <div className="invalid-feedback">{formErrors.pincode}</div>}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Order Bill & Pay Button */}
              <div className="col-lg-4">
                <div className="card border-0 shadow-sm p-4 rounded-4 sticky-top" style={{ top: '24px' }}>
                  <h5 className="fw-bold mb-3">Price Details</h5>

                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-muted">Items Subtotal</span>
                    <span className="fw-semibold">₹{subtotal.toFixed(2)}</span>
                  </div>

                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-muted">Delivery Charges</span>
                    <span className={deliveryFee === 0 ? 'text-success fw-semibold' : 'fw-semibold'}>
                      {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee.toFixed(2)}`}
                    </span>
                  </div>

                  <hr />

                  <div className="d-flex justify-content-between mb-4 fs-5 fw-bold">
                    <span>Total Amount</span>
                    <span className="text-primary">₹{totalAmount.toFixed(2)}</span>
                  </div>

                  <button
                    className="btn btn-primary w-100 rounded-pill py-3 fw-bold text-uppercase shadow-sm"
                    onClick={handlePayment}
                    disabled={payLoading}
                  >
                    {payLoading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Opening Razorpay...
                      </>
                    ) : (
                      `Pay ₹${totalAmount.toFixed(2)}`
                    )}
                  </button>

                  <div className="text-center mt-3 text-muted small d-flex align-items-center justify-content-center gap-1">
                    <ShieldCheck size={16} className="text-success" />
                    <span>Safe and Secure Payments via Razorpay</span>
                  </div>
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

export default OrderSummary