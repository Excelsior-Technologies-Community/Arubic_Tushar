import { BrowserRouter, Routes, Route } from "react-router-dom";import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import AdminLayout from "./admin/layout/AdminLayout";
import Dashboard from "./admin/pages/Dashboard";
import Services from "./admin/pages/Services";
import FeaturedProducts from "./components/FeaturedProducts";







function HomePage() {
  return (
    <>
      <Navbar />
      <HeroSection />
      <FeaturedProducts />
    </>
  )
}


function App() {
  return (
        <BrowserRouter>

      <Routes>

        <Route path="/" element={<HomePage />} />

        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="services" element={<Services />} />
        </Route>

      </Routes>

    </BrowserRouter>
  );
}

export default App;