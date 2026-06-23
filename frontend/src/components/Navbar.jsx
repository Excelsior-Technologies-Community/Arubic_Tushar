import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import "../assets/css/Navbar.css";

const navItems = [
  {
    label: "HOME",
    path: "/",
    sub: [
      { label: "Home Page 1", path: "/" },
      { label: "Home Page 2", path: "/home-2" },
      { label: "Home Page 3", path: "/home-3" },
      { label: "Home Page 4", path: "/home-4" },
    ],
  },
  {
    label: "WOMEN",
    path: "/shop",
    mega: [
      {
        heading: "DRESSES",
        items: ["Casual Dresses", "Maxi Dresses", "Midi Dresses", "Bodycon Dresses"],
      },
      {
        heading: "SHOES",
        items: ["Athletic", "Boots", "Comfort", "Fashion Sneakers"],
      },

      {
        heading: "HANDBAGS",
        items: ["Backpack", "Shoulder Bags", "Mini Bags", "Bucket Bags"],
      },
      {
        heading: "CLOTHING",
        items: ["Sweaters", "T-Shirts", "Outerwear", "Jackets"],
      },
    ],
  },
  {
    label: "MEN",
    path: "/shop",
    mega: [
      {
        heading: "CLOTHING",
        items: ["Jackets & Coats", "Jeans", "Pants", "Socks"],
      },
      {
        heading: "SHOES",
        items: ["Loafers & Slip-Ons", "Outdoor", "Oxfords", "Sandals"],
      },
    ],
  },
  {
    label: "BLOG",
    path: "/blog",
    sub: [
      { label: "Blog Sidebar", path: "/blog-sidebar" },
      { label: "Blog Sidebar Right", path: "/blog-sidebar-right" },
      { label: "Blog Details", path: "/blog-details" },
      { label: "Blog Right Sidebar", path: "/blog-right-sidebar" },
      { label: "Blog Full Width", path: "/blog-full-width" },
    ],
  },
  {
    label: "PAGES",
    path: "#",
    sub: [
      { label: "About Us", path: "/about" },
      { label: "Product Details", path: "/product" },
      { label: "Shop", path: "/shop" },
      { label: "Shop Right Sidebar", path: "/shop-right-sidebar" },
      { label: "Shop List", path: "/shop-list" },
      { label: "Shop Full Width", path: "/shop-full-width" },
      { label: "Login", path: "/login" },
      { label: "Register", path: "/register" },
      { label: "FAQ", path: "/faq" },
      { label: "Store", path: "/store" },
      { label: "404", path: "/404" },
    ],
  },
  { label: "CONTACT US", path: "/contact" },
];

const cartData = [
  {
    id: 1,
    img: "https://htmldemo.net/arubic/arubic/img/cart/cart1.jpg",
    name: "Printed Chiffon Dress",
    price: "$16.40",
    qty: 1,
    size: "S",
    color: "Yellow",
  },
  {
    id: 2,
    img: "https://htmldemo.net/arubic/arubic/img/cart/cart2.jpg",
    name: "Printed Dress",
    price: "$23.39",
    qty: 1,
    size: "S",
    color: "Orange",
  },
];

export default function Navbar() {
  const [activeMenu, setActiveMenu] = useState(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState(null);
  const [scrolled, setScrolled] = useState(false);

  const cartRef = useRef(null);
  const searchRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (cartRef.current && !cartRef.current.contains(e.target)) setCartOpen(false);
      if (searchRef.current && !searchRef.current.contains(e.target)) setSearchOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleMouseEnter = (idx) => {
    clearTimeout(timerRef.current);
    setActiveMenu(idx);
  };

  const handleMouseLeave = () => {
    timerRef.current = setTimeout(() => setActiveMenu(null), 120);
  };

  const toggleMobile = (idx) =>
    setMobileExpanded((prev) => (prev === idx ? null : idx));

  return (
    <>

      <div className={`arb-topbar ${scrolled ? "arb-topbar--hidden" : ""}`}>
        <div className="arb-container arb-topbar__inner">
          <div className="arb-topbar__left">
            <span>
              <strong>Call Us :</strong> (800) 123 4567
            </span>
            <span className="arb-topbar__divider" />
            <span>
              <strong>Email :</strong>{" "}
              <a href="mailto:demo@hastech.company">Demo@Hastech.Company</a>
            </span>
          </div>

          <div className="arb-topbar__right"> 
            <TopBarDropdown label="My Account">
              <a href="/login">Login</a>
              <a href="/checkout">Checkout</a>
              <a href="/register">Register</a>
              <a href="/cart">Cart</a>
              <a href="/wishlist">Wishlist</a>
            </TopBarDropdown>
            <TopBarDropdown label="USD">
              <a href="#">€ Euro</a>
              <a href="#">$ US Dollar</a>
            </TopBarDropdown>
            <TopBarDropdown label="English">
              <a href="#">English</a>
              <a href="#">اللغة العربية</a>
            </TopBarDropdown>
          </div>
        </div>
      </div>


      <nav className={`arb-navbar ${scrolled ? "arb-navbar--sticky" : ""}`}>
        <div className="arb-container arb-navbar__inner">


          <Link to="/" className="arb-logo"> 
          
                   <img src="https://htmldemo.net/arubic/arubic/img/logo/logo.jpg" alt="" />

          </Link>


          <ul className="arb-nav arb-nav--desktop">
            {navItems.map((item, idx) => (
              <li
                key={idx}
                className="arb-nav__item"
                onMouseEnter={() => handleMouseEnter(idx)}
                onMouseLeave={handleMouseLeave}
              >
                <Link
                  to={item.path}
                  className={`arb-nav__link ${activeMenu === idx ? "arb-nav__link--active" : ""}`}
                >
                  {item.label}
                  {(item.sub || item.mega) && (
                    <svg className="arb-caret" viewBox="0 0 10 6" fill="none">
                      <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  )}
                </Link>

                {idx < navItems.length - 1 && (
                  <span className="arb-nav__sep" />
                )}

                {/* Simple dropdown */}
                {item.sub && (
                  <ul className={`arb-dropdown ${activeMenu === idx ? "arb-dropdown--open" : ""}`}>
                    {item.sub.map((s, si) => (
                      <li key={si}>
                        <Link to={s.path}>{s.label}</Link>
                      </li>
                    ))}
                  </ul>
                )}

                {/* Mega menu */}
                {item.mega && (
                  <div className={`arb-mega ${activeMenu === idx ? "arb-mega--open" : ""}`}>
                    {item.mega.map((col, ci) => (
                      <div key={ci} className="arb-mega__col">
                        <h4 className="arb-mega__heading">{col.heading}</h4>
                        <ul className="arb-mega__list">
                          {col.items.map((it, ii) => (
                            <li key={ii}>
                              <Link to="/shop">{it}</Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}
              </li>
            ))}
          </ul>

          <div className="arb-navbar__icons">

            <div className="arb-search-wrap" ref={searchRef}>
              <button
                className="arb-icon-btn"
                onClick={() => setSearchOpen((p) => !p)}
                aria-label="Search"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8" />
                  <path d="M21 21l-4.35-4.35" strokeLinecap="round" />
                </svg>
              </button>
              {searchOpen && (
                <div className="arb-search-box">
                  <input type="text" placeholder="Search products…" autoFocus />
                  <button onClick={() => setSearchOpen(false)}>✕</button>
                </div>
              )}
            </div>

            {/* Cart */}
            <div className="arb-cart-wrap" ref={cartRef}>
              <button
                className="arb-icon-btn arb-cart-btn"
                onClick={() => setCartOpen((p) => !p)}
                aria-label="Cart"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <path d="M16 10a4 4 0 01-8 0" />
                </svg>
                <span className="arb-cart-badge">{cartData.length}</span>
              </button>

              {/* Cart dropdown */}
              {cartOpen && (
                <div className="arb-cart-drop">
                  <div className="arb-cart-drop__items">
                    {cartData.map((item) => (
                      <div key={item.id} className="arb-cart-drop__row">
                        <Link to="/cart">
                          <img src={item.img} alt={item.name} />
                        </Link>
                        <div className="arb-cart-drop__info">
                          <span className="arb-cart-drop__qty">{item.qty}x</span>
                          <div>
                            <p className="arb-cart-drop__name">{item.name}</p>
                            <p className="arb-cart-drop__price">{item.price}</p>
                            <p className="arb-cart-drop__meta">
                              Size: {item.size} &nbsp; Color: {item.color}
                            </p>
                          </div>
                        </div>
                        <button className="arb-cart-drop__remove" title="Remove">✕</button>
                      </div>
                    ))}
                  </div>
                  <div className="arb-cart-drop__totals">
                    <div className="arb-cart-drop__row-total">
                      <span>Subtotal</span><span>$39.79</span>
                    </div>
                    <div className="arb-cart-drop__row-total">
                      <span>Shipping</span><span>$7.00</span>
                    </div>
                    <div className="arb-cart-drop__row-total">
                      <span>Taxes</span><span>$0.00</span>
                    </div>
                    <div className="arb-cart-drop__row-total arb-cart-drop__row-total--grand">
                      <span>Total</span><span>$46.79</span>
                    </div>
                  </div>
                  <Link to="/checkout" className="arb-cart-drop__checkout">
                    checkout
                  </Link>
                </div>
              )}
            </div>


            <button
              className={`arb-hamburger arb-nav--mobile-only ${mobileOpen ? "arb-hamburger--open" : ""}`}
              onClick={() => setMobileOpen((p) => !p)}
              aria-label="Menu"
            >
              <span /><span /><span />
            </button>
          </div>
        </div>
      </nav>


      {mobileOpen && (
        <div className="arb-mobile-overlay" onClick={() => setMobileOpen(false)} />
      )}
      <div className={`arb-mobile-drawer ${mobileOpen ? "arb-mobile-drawer--open" : ""}`}>
        <ul className="arb-mobile-list">
          {navItems.map((item, idx) => (
            <li key={idx} className="arb-mobile-list__item">
              <div className="arb-mobile-list__row">
                <Link
                  to={item.path}
                  className="arb-mobile-list__link"
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </Link>
                {(item.sub || item.mega) && (
                  <button
                    className="arb-mobile-list__toggle"
                    onClick={() => toggleMobile(idx)}
                  >
                    {mobileExpanded === idx ? "−" : "+"}
                  </button>
                )}
              </div>

              {mobileExpanded === idx && item.sub && (
                <ul className="arb-mobile-sub">
                  {item.sub.map((s, si) => (
                    <li key={si}>
                      <Link to={s.path} onClick={() => setMobileOpen(false)}>
                        {s.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}

              {mobileExpanded === idx && item.mega && (
                <div className="arb-mobile-mega">
                  {item.mega.map((col, ci) => (
                    <div key={ci}>
                      <p className="arb-mobile-mega__heading">{col.heading}</p>
                      <ul className="arb-mobile-sub">
                        {col.items.map((it, ii) => (
                          <li key={ii}>
                            <Link to="/shop" onClick={() => setMobileOpen(false)}>
                              {it}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>


      
    </>
  );
}


function TopBarDropdown({ label, children }) {
  return (
    <div className="arb-tb-drop">
      <button className="arb-tb-drop__btn">
        {label}
        <svg className="arb-caret arb-caret--sm" viewBox="0 0 10 6" fill="none">
          <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>
      <div className="arb-tb-drop__menu">
        {children}
      </div>
    </div>
  );
}