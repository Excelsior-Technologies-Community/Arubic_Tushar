import { useRef, useState } from "react";

export default function Header() {
    const [searchOpen, setSearchOpen] = useState(false);
    const searchRef = useRef(null);
  return (
    <header className="admin-header">
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

      <div className="admin-user">
        <img
          src="https://i.pravatar.cc/100"
          alt=""
        />
        <span>Admin</span>
      </div>
    </header>
  );
}