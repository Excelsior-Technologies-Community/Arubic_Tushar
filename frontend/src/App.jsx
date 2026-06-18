import { BrowserRouter, Routes, Route } from "react-router-dom";import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import AdminLayout from "./admin/layout/AdminLayout";
import Dashboard from "./admin/pages/Dashboard";
import Services from "./admin/pages/Services";
import FeaturedProducts from "./components/FeaturedProducts";
import Products from "./admin/pages/Products";
import ProductForm from "./admin/pages/ProductForm";
import CallToAction from "./components/CallToAction";







function HomePage() {
  return (
    <>
      <Navbar />
      <HeroSection />
      <FeaturedProducts />
      <CallToAction />
    </>
  )
}


function App() {
  return (
        <BrowserRouter>

      <Routes>

        <Route path="/" element={<HomePage />} />

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