import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import Home from './Pages/Home'
import About from './Pages/About'
import Categories from './Pages/Categories'
import Howitworks from './Pages/Howitworks'
import Contact from './Pages/Contact'
import Login from './Pages/Login'
import Reviews from './Pages/Reviews'
import Wishlist from './Pages/Wishlist'
import Register from './Pages/Register'
import NotFound from './Pages/NotFound'
import Admindashboard from './Pages/Admindashboard';
import Userdashboard from './Pages/Userdashboard';
import MyOrders from './Pages/MyOrders';
import Cart from './Pages/Cart';


function App() {

  return (
    <>
      <BrowserRouter basename="/">
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} /> {/* 👈 Ensure element={<Login />} */}
        <Route path='/about' element={<About />} />
        <Route path='/categories' element={<Categories />} />
        <Route path='/howitworks' element={<Howitworks />} />
        <Route path='/contactus' element={<Contact />} />
        <Route path='/reviews' element={<Reviews />} />
        <Route path='/wishlist' element={<Wishlist />} />
        <Route path='/register' element={<Register />} />
        <Route path='/cart' element={<Cart />} />
        <Route path='/admindashboard' element={<Admindashboard />} />
        <Route path='/userdashboard' element={<Userdashboard />} />
        <Route path='/myorders' element={<MyOrders />} />
        
        <Route path='*' element={<NotFound />} />
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App