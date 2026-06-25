import { Link, useLocation } from "react-router-dom";
import "../assets/css/Breadcrumb.css";

const routeLabels = {
  "/": "Home",
  "/about": "About Us",
  "/shop": "Shop",
  "/blog": "Blog",
  "/login": "Login",
  "/register": "Register",
  "/faq": "FAQ",
  "/store": "Store",
  "/contact": "Contact Us",
  "/cart": "Cart",
  "/checkout": "Checkout",
  "/wishlist": "Wishlist",
};

export default function Breadcrumb() {
  const { pathname } = useLocation();

  // Home page par breadcrumb hide
  if (pathname === "/") return null;

  let currentLabel = "";

  // Dynamic Product Route
  if (pathname.startsWith("/product/")) {
    currentLabel = "Product Details";
  }
  // Admin Routes
  else if (pathname.startsWith("/admin")) {
    currentLabel = pathname
      .replace("/admin/", "")
      .split("/")
      .map((item) => item.charAt(0).toUpperCase() + item.slice(1))
      .join(" / ");
  }
  // Static Routes
  else {
    currentLabel = routeLabels[pathname] || formatLabel(pathname);
  }

  return (
    <section className="arb-breadcrumb">
      <div className="arb-container">
        <nav className="arb-breadcrumb__nav">

          <Link to="/" className="arb-breadcrumb__home">
            Home
          </Link>

          <span className="arb-breadcrumb__sep">/</span>

          <span className="arb-breadcrumb__current">
            {currentLabel}
          </span>

        </nav>
      </div>
    </section>
  );
}

function formatLabel(path) {
  return path
    .replace("/", "")
    .split("/")
    .map((item) =>
      item
        .replace(/-/g, " ")
        .replace(/\b\w/g, (char) => char.toUpperCase())
    )
    .join(" / ");
}