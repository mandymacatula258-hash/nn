import { Routes, Route } from "react-router-dom"
import { CartProvider } from "./context/CartContext"
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import Hero from "./components/Hero"
import FeaturedSeries from "./components/FeaturedSeries"
import AboutUs from "./components/AboutUs"
import ContactUs from "./components/ContactUs"
import SignUp from "./components/SignUp"
import Login from "./components/Login"
import Shop from "./components/Shop"
import Checkout from "./components/Checkout"
import Admin from "./components/Admin"
import Support from "./components/Support" 
import ProductDetails from "./components/ProductDetails"

export default function App() {
  return (
    <CartProvider>
      <div className="app">
        <Navbar />
        <Routes>
          <Route path="/" element={<><Hero /><FeaturedSeries /></>} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/support" element={<Support />} />
          <Route path="/products/:id" element={<ProductDetails />} />
          
        </Routes>
        <Footer />
      </div>
    </CartProvider>
  )
}