import { Link, useLocation } from "react-router-dom";
import "../assets/css/Breadcrumb.css";

// Route se label mapping
const routeLabels = {
  "/": "Home",
  "/home-2": "Home Page 2",
  "/home-3": "Home Page 3",
  "/home-4": "Home Page 4",
  "/shop": "Shop",
  "/shop-right-sidebar": "Shop Right Sidebar",
  "/shop-list": "Shop List",
  "/shop-full-width": "Shop Full Width",
  "/blog": "Blog",
  "/blog-sidebar": "Blog Sidebar",
  "/blog-sidebar-right": "Blog Sidebar Right",
  "/blog-details": "Blog Details",
  "/blog-right-sidebar": "Blog Right Sidebar",
  "/blog-full-width": "Blog Full Width",
  "/about": "About Us",
  "/product": "Product Details",
  "/login": "Login",
  "/register": "Register",
  "/faq": "FAQ",
  "/store": "Store",
  "/404": "404",
  "/contact": "Contact Us",
  "/cart": "Cart",
  "/checkout": "Checkout",
  "/wishlist": "Wishlist",
};

const Breadcrumb = () =>  {
  const location = useLocation();
  const pathname = location.pathname;

  // Home page pe breadcrumb mat dikhao
  if (pathname === "/") return null;

  const currentLabel = routeLabels[pathname] || formatLabel(pathname);

  return (
    <div className="arb-breadcrumb">
      <div className="arb-container">
        <nav className="arb-breadcrumb__nav" aria-label="breadcrumb">
          <Link to="/" className="arb-breadcrumb__home">Home</Link>
          <span className="arb-breadcrumb__sep">/</span>
          <span className="arb-breadcrumb__current">{currentLabel}</span>
        </nav>
      </div>
    </div>
  );
}

// Fallback: unknown routes ke liye path se label banao
function formatLabel(path) {
  return path
    .replace(/^\//, "")
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export default Breadcrumb;