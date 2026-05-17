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
import ProductFrenzyFA from "./components/ProductFrenzyFA"
import ProductFrenzyB from "./components/ProductFrenzyB"
import ProductPage from "./components/ProductPage"
import Shop from "./components/Shop"
import Checkout from "./components/Checkout"
import Admin from "./components/Admin"
import Support from "./components/Support" 

export default function App() {
  return (
    <CartProvider>
      <div className="app">
        <Navbar />
        <Routes>
          <Route path="/" element={<><Hero /><FeaturedSeries /></>} />
          <Route path="/product" element={<ProductPage />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/products/frenzy-fa" element={<ProductFrenzyFA />} />
          <Route path="/products/frenzy-b" element={<ProductFrenzyB />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/support" element={<Support />} />
        </Routes>
        <Footer />
      </div>
    </CartProvider>
  )
}