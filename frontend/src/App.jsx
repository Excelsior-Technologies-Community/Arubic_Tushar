import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import AdminLayout from "./admin/layout/AdminLayout";
import Dashboard from "./admin/adminPages/Dashboard";
import Services from "./admin/adminPages/Services";
import FeaturedProducts from "./components/FeaturedProducts";
import Products from "./admin/adminPages/Products";
import ProductForm from "./admin/adminPages/ProductForm";
import CallToAction from "./components/CallToAction";
import ProductCatalog from "./components/ProductCatalog";
import TestimonialSection from "./components/TestimonialSection";
import BlogSection from "./components/BlogSection";
import Footer from "./components/Footer";
import AboutUs from "./components/Pages/AboutUs";
import Women from "./components/Pages/Women";







function HomePage() {
  return (
    <>
      <Navbar />
      <HeroSection />
      <FeaturedProducts />
      <CallToAction />
      <ProductCatalog />
      <TestimonialSection />
      <BlogSection />
      <Footer />  
    </>
  )
}


function App() {
  return (
        <BrowserRouter>

      <Routes>

        <Route path="/" element={<HomePage />} />
        <Route path="/about"   element={<><Navbar /><AboutUs /><Footer /></>} />
        <Route path="/shop"   element={<><Navbar /><Women /><Footer /></>} />


       {/* Admin panel (with sidebar + header) */}
              <Route path="/admin" element={<AdminLayout />}>
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="services" element={<Services />} />
                <Route path="products" element={<Products />} />
                <Route path="products/add" element={<ProductForm />} />
                <Route path="products/edit/:id" element={<ProductForm />} />
        </Route>

      </Routes>

    </BrowserRouter>
  );
}

export default App;