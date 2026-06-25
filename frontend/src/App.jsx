import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import FeaturedProducts from "./components/FeaturedProducts";
import CallToAction from "./components/CallToAction";
import ProductCatalog from "./components/ProductCatalog";
import TestimonialSection from "./components/TestimonialSection";
import BlogSection from "./components/BlogSection";
import Footer from "./components/Footer";

import AboutUs from "./components/Pages/AboutUs";
import Women from "./components/Pages/Women";
import ProductDetail from "./components/Pages/ProductDetail";

import AdminLayout from "./admin/layout/AdminLayout";
import Dashboard from "./admin/adminPages/Dashboard";
import Services from "./admin/adminPages/Services";
import Products from "./admin/adminPages/Products";
import ProductForm from "./admin/adminPages/ProductForm";
import Blog from "./components/Pages/Blog";

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
  );
}

function AboutPage() {
  return (
    <>
      <Navbar />
      <AboutUs />
      <Footer />
    </>
  );
}

function ShopPage() {
  return (
    <>
      <Navbar />
      <Women />
      <Footer />
    </>
  );
}

function ProductPage() {
  return (
    <>
      <Navbar />
      <ProductDetail />
      <Footer />
    </>
  );
}
function BlogPage() {
  return (
    <>
      <Navbar />
      <Blog />
      <Footer />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Website */}

        <Route path="/" element={<HomePage />} />

        <Route path="/about" element={<AboutPage />} />

        <Route path="/shop" element={<ShopPage />} />

        <Route path="/product/:id" element={<ProductPage />} />

        <Route path="/blog" element={<BlogPage />} />



        {/* Admin */}

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