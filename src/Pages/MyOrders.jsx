import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import Header from '../Component/Header'
import Footer from '../Component/Footer'
import { Package, Calendar, CreditCard, ShoppingBag } from 'lucide-react'
import wishlistimg from '../Images/Wishlistimg.png'

const MyOrders = () => {

  const [user, setUser] = useState(null)
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  // Backend image path handler
  const getFullImageUrl = (imageSrc) => {

    if (!imageSrc) {
      return 'https://via.placeholder.com/150?text=No+Image'
    }

    if (
      imageSrc.startsWith('http://') ||
      imageSrc.startsWith('https://') ||
      imageSrc.startsWith('data:')
    ) {
      return imageSrc
    }

    const cleanPath = imageSrc.startsWith('/')
      ? imageSrc.substring(1)
      : imageSrc

    return `http://localhost:8080/${cleanPath}`
  }


  // Fetch user's orders
  const fetchOrders = async (userId) => {

    try {

      setLoading(true)

      const response = await axios.get(
        `http://localhost:8080/api/orders/user/${userId}`
      )

      if (Array.isArray(response.data)) {
        setOrders(response.data)
      }

    } catch (error) {

      console.error('Error fetching orders:', error)

    } finally {

      setLoading(false)

    }
  }


  // Get logged-in user
  useEffect(() => {

    const stored = localStorage.getItem('user')

    if (stored) {

      try {

        const parsedUser = JSON.parse(stored)

        setUser(parsedUser)

        if (parsedUser && parsedUser.id) {
          fetchOrders(parsedUser.id)
        } else {
          setLoading(false)
        }

      } catch (error) {

        console.error('Error parsing user:', error)
        setLoading(false)

      }

    } else {

      setLoading(false)

    }

  }, [])


  return (
    <>
      <Header hideHero={true} />

      {/* HERO SECTION */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '50vh',
          overflow: 'hidden'
        }}
      >

        <img
          src={wishlistimg}
          alt="My Orders"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
        />

        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(0,0,0,0.45)'
          }}
        />

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

          <h1 className="fw-bold display-5">
            My Orders
          </h1>

          <p className="mb-0">
            View your purchased products
          </p>

        </div>

      </div>


      {/* ORDERS SECTION */}
      <div className="bg-light py-5">

        <div className="container">

          <div className="d-flex justify-content-between align-items-center mb-4">

            <h2 className="fw-bold mb-0">
              My Orders
            </h2>

            <span className="badge bg-primary fs-6 rounded-pill px-3 py-2">
              {orders.length} order{orders.length !== 1 ? 's' : ''}
            </span>

          </div>


          {/* LOADING */}
          {loading && (

            <div className="text-center py-5">

              <div
                className="spinner-border text-primary mb-3"
                role="status"
              />

              <h5>
                Loading your orders...
              </h5>

            </div>

          )}


          {/* NOT LOGGED IN */}
          {!loading && !user && (

            <div className="text-center py-5">

              <ShoppingBag
                size={60}
                className="text-muted mb-3"
              />

              <h4 className="text-muted mb-3">
                Please login to view your orders.
              </h4>

              <Link
                to="/login"
                className="btn btn-primary rounded-pill px-4 py-2"
              >
                Login to Continue
              </Link>

            </div>

          )}


          {/* NO ORDERS */}
          {!loading && user && orders.length === 0 && (

            <div className="text-center py-5">

              <Package
                size={70}
                className="text-muted mb-3"
              />

              <h4 className="text-muted mb-3">
                You haven't placed any orders yet.
              </h4>

              <Link
                to="/"
                className="btn btn-outline-primary rounded-pill px-4 py-2"
              >
                Start Shopping
              </Link>

            </div>

          )}


          {/* ORDERS */}
          {!loading && user && orders.length > 0 && (

            <div className="row g-4">

              {orders.map((order) => (

                <div
                  className="col-12"
                  key={order.id}
                >

                  <div className="card border-0 shadow-sm rounded-4 p-4">

                    {/* ORDER HEADER */}
                    <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">

                      <div>

                        <h5 className="fw-bold mb-1">
                          Order #{order.id}
                        </h5>

                        <small className="text-muted">
                          <Calendar size={15} className="me-1" />

                          {order.orderDate
                            ? new Date(order.orderDate).toLocaleDateString(
                                'en-IN',
                                {
                                  day: '2-digit',
                                  month: 'short',
                                  year: 'numeric'
                                }
                              )
                            : 'Date unavailable'
                          }
                        </small>

                      </div>


                      <div className="text-end">

                        <span
                          className={`badge rounded-pill px-3 py-2 ${
                            order.orderStatus === 'DELIVERED'
                              ? 'bg-success'
                              : order.orderStatus === 'CANCELLED'
                              ? 'bg-danger'
                              : 'bg-primary'
                          }`}
                        >
                          {order.orderStatus || 'PLACED'}
                        </span>

                      </div>

                    </div>


                    <hr />


                    {/* PRODUCT */}
                    <div className="d-flex align-items-center gap-4 flex-wrap">

                      <img
                        src={getFullImageUrl(order.productImage)}
                        alt={order.productName}
                        className="rounded-3"
                        style={{
                          width: '110px',
                          height: '110px',
                          objectFit: 'cover'
                        }}
                        onError={(e) => {
                          e.target.onerror = null
                          e.target.src =
                            'https://via.placeholder.com/150?text=No+Image'
                        }}
                      />


                      <div className="flex-grow-1">

                        <h5 className="fw-bold mb-2">
                          {order.productName}
                        </h5>

                        <p className="text-muted mb-1">
                          Price: ₹
                          {Number(order.price || 0).toFixed(2)}
                        </p>

                        <p className="text-muted mb-1">
                          Quantity: {order.quantity}
                        </p>

                      </div>


                      {/* TOTAL */}
                      <div className="text-end">

                        <small className="text-muted d-block">
                          Total Amount
                        </small>

                        <h4 className="fw-bold text-primary mb-0">
                          ₹
                          {Number(
                            order.totalAmount || 0
                          ).toFixed(2)}
                        </h4>

                      </div>

                    </div>


                    <hr />


                    {/* PAYMENT */}
                    <div className="row g-3">

                      <div className="col-md-6">

                        <div className="d-flex align-items-center gap-2">

                          <CreditCard
                            size={20}
                            className="text-primary"
                          />

                          <div>

                            <small className="text-muted d-block">
                              Payment Status
                            </small>

                            <span className="fw-semibold text-success">
                              {order.paymentStatus || 'SUCCESS'}
                            </span>

                          </div>

                        </div>

                      </div>


                      <div className="col-md-6">

                        <div className="text-md-end">

                          <small className="text-muted d-block">
                            Payment ID
                          </small>

                          <span className="fw-semibold">
                            {order.paymentId || 'N/A'}
                          </span>

                        </div>

                      </div>

                    </div>

                  </div>

                </div>

              ))}

            </div>

          )}

        </div>

      </div>


      <Footer />
    </>
  )
}

export default MyOrders