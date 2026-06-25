import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import Breadcrumb from "../Breadcrumb";
import "../../assets/css/Women.css";

const API = "http://localhost:5000/api";
const SERVER_URL = "http://localhost:5000";

const PRICE_RANGES = [
  { label: "$15.00 - $17.00", min: 15, max: 17 },
  { label: "$23.00 - $27.00", min: 23, max: 27 },
  { label: "$28.00 - $32.00", min: 28, max: 32 },
  { label: "$50.00 - $53.00", min: 50, max: 53 },
];

// ── Star Rating ───────────────────────────────────────────────
function Stars({ count }) {
  return (
    <div className="arb-wm-stars">
      {[1, 2, 3, 4, 5].map((i) => (
        <svg
          key={i}
          className={`arb-wm-star ${i <= count ? "arb-wm-star--filled" : ""}`}
          viewBox="0 0 24 24"
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
}

// ── Product Card ──────────────────────────────────────────────
function ProductCard({ product, viewMode }) {
  const [hovered, setHovered] = useState(false);
  const imagePath = product.img_url || product.image1;
  const imageSrc = imagePath
    ? imagePath.startsWith("http")
      ? imagePath
      : `${SERVER_URL}${imagePath.startsWith("/") ? imagePath : `/uploads/${imagePath}`}`
    : "https://placehold.co/400x480?text=No+Image";

  return (
    <div
      className={`arb-wm-card ${viewMode === "list" ? "arb-wm-card--list" : ""}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="arb-wm-card__img-wrap">
        {product.badge && (
          <span className={`arb-wm-badge arb-wm-badge--${product.badge_type}`}>
            • {product.badge}
          </span>
        )}
        <Link to={`/single-product`}>
  <img
    src={imageSrc}
    alt={product.name}
    className="arb-wm-card__img"
    onError={(e) => {
      e.target.src = "https://placehold.co/400x480?text=No+Image";
    }}
  />
</Link>
        {hovered && (
          <div className="arb-wm-card__actions">
            <button className="arb-wm-card__action-btn" title="Add to Cart">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 01-8 0" />
              </svg>
            </button>
            <button className="arb-wm-card__action-btn" title="Wishlist">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
              </svg>
            </button>
            <button className="arb-wm-card__action-btn" title="Quick View">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </button>
          </div>
        )}
      </div>
      <div className="arb-wm-card__info">
        <h3 className="arb-wm-card__name">
          <Link to={`/product/${product.id}`}>{product.name}</Link>
        </h3>
        <Stars count={product.rating} />
        <div className="arb-wm-card__price">
          <span className="arb-wm-card__price-now">
            ${Number(product.price).toFixed(2)}
          </span>
          {product.old_price && (
            <span className="arb-wm-card__price-old">
              ${Number(product.old_price).toFixed(2)}
            </span>
          )}
        </div>
        {viewMode === "list" && (
          <p className="arb-wm-card__desc">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod
            erat vel ligula fermentum, vel tincidunt eros facilisis.
          </p>
        )}
      </div>
    </div>
  );
}

// ── Skeleton loader card ──────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="arb-wm-skeleton">
      <div className="arb-wm-skeleton__img" />
      <div className="arb-wm-skeleton__line arb-wm-skeleton__line--title" />
      <div className="arb-wm-skeleton__line arb-wm-skeleton__line--short" />
      <div className="arb-wm-skeleton__line arb-wm-skeleton__line--price" />
    </div>
  );
}

export default function Women() {
  // UI state
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [openSideCats, setOpenSideCats] = useState([]);

  // Filter state
  const [selectedCat, setSelectedCat] = useState(null);
  const [selectedPrice, setSelectedPrice] = useState(null);
  const [selectedComp, setSelectedComp] = useState(null);
  const [selectedStyle, setSelectedStyle] = useState(null);
  const [selectedProp, setSelectedProp] = useState(null);

  // Data state
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({
    categories: [],
    compositions: [],
    styles: [],
    properties: [],
  });
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch sidebar filters once
  useEffect(() => {
    fetch(`${API}/products/filters`)
      .then((r) => r.json())
      .then((res) => {
        if (res.success) setFilters(res.data);
      })
      .catch(() => {});
  }, []);

  // Build query string from active filters
  const buildQuery = useCallback(() => {
    const params = new URLSearchParams();
    params.set("page", currentPage);
    params.set("limit", 12);
    if (selectedCat) params.set("category", selectedCat);
    if (selectedComp) params.set("composition", selectedComp);
    if (selectedStyle) params.set("style", selectedStyle);
    if (selectedProp) params.set("property", selectedProp);
    if (selectedPrice !== null) {
      params.set("price_min", PRICE_RANGES[selectedPrice].min);
      params.set("price_max", PRICE_RANGES[selectedPrice].max);
    }
    if (sortBy) params.set("sort", sortBy);
    return params.toString();
  }, [
    currentPage,
    selectedCat,
    selectedPrice,
    selectedComp,
    selectedStyle,
    selectedProp,
    sortBy,
  ]);

  // Fetch products whenever filters/page/sort change
  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(`${API}/products?${buildQuery()}`)
      .then((r) => r.json())
      .then((res) => {
        if (res.success) {
          setProducts(res.data);
          setPagination(res.pagination);
        } else {
          setError("Failed to load products.");
        }
      })
      .catch(() =>
        setError("Server se connect nahi ho pa raha. Backend check karo."),
      )
      .finally(() => setLoading(false));
  }, [buildQuery]);

  // Helpers
  const resetPage = () => setCurrentPage(1);
  const toggleSideCat = (cat) =>
    setOpenSideCats((p) =>
      p.includes(cat) ? p.filter((c) => c !== cat) : [...p, cat],
    );

  const clearAll = () => {
    setSelectedCat(null);
    setSelectedPrice(null);
    setSelectedComp(null);
    setSelectedStyle(null);
    setSelectedProp(null);
    resetPage();
  };

  const hasFilters =
    selectedCat ||
    selectedPrice !== null ||
    selectedComp ||
    selectedStyle ||
    selectedProp;

  const goPage = (p) => {
    setCurrentPage(p);
    window.scrollTo(0, 0);
  };

  const sidebarCats = ["Dresses", "Shoes", "Handbags", "Clothing"];

  return (
    <div className="arb-wm-page">
      <Breadcrumb />

      <div className="arb-container arb-wm-layout">
        {/* ── LEFT SIDEBAR ────────────────────────────────── */}
        <aside className="arb-wm-sidebar">
          {/* Women category accordion */}
          <div className="arb-wm-sb-section">
            <h3 className="arb-wm-sb-title">WOMEN</h3>
            <ul className="arb-wm-sb-cats">
              {sidebarCats.map((cat) => (
                <li key={cat} className="arb-wm-sb-cat-item">
                  <div className="arb-wm-sb-cat-row">
                    <span className="arb-wm-sb-cat-label">{cat}</span>
                    <button
                      className="arb-wm-sb-cat-toggle"
                      onClick={() => toggleSideCat(cat)}
                    >
                      {openSideCats.includes(cat) ? "−" : "+"}
                    </button>
                  </div>
                  {openSideCats.includes(cat) && (
                    <ul className="arb-wm-sb-sub">
                      <li>
                        <button
                          className="arb-wm-sb-sub-btn"
                          onClick={() => {
                            setSelectedCat(cat.toLowerCase());
                            resetPage();
                          }}
                        >
                          All {cat}
                        </button>
                      </li>
                      <li>
                        <Link to="/shop">New Arrivals</Link>
                      </li>
                      <li>
                        <Link to="/shop">Sale</Link>
                      </li>
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Filter by */}
          <div className="arb-wm-sb-section">
            <h3 className="arb-wm-sb-title">FILTER BY</h3>

            {hasFilters && (
              <button className="arb-wm-sb-clear" onClick={clearAll}>
                <span>✕</span> clear all
              </button>
            )}

            {/* Categories — from API */}
            <p className="arb-wm-sb-filter-label">CATEGORIES</p>
            {filters.categories.map((c) => (
              <label key={c.category} className="arb-wm-sb-check">
                <input
                  type="checkbox"
                  checked={selectedCat === c.category}
                  onChange={() => {
                    setSelectedCat(
                      selectedCat === c.category ? null : c.category,
                    );
                    resetPage();
                  }}
                />
                <span>
                  {c.category} ({c.count})
                </span>
              </label>
            ))}

            {/* Price — static ranges */}
            <p className="arb-wm-sb-filter-label">PRICE</p>
            {PRICE_RANGES.map((r, i) => (
              <label key={i} className="arb-wm-sb-radio">
                <input
                  type="radio"
                  name="price"
                  checked={selectedPrice === i}
                  onChange={() => {
                    setSelectedPrice(selectedPrice === i ? null : i);
                    resetPage();
                  }}
                />
                <span>{r.label}</span>
              </label>
            ))}

            {/* Compositions — from API */}
            <p className="arb-wm-sb-filter-label">COMPOSITIONS</p>
            {filters.compositions.map((c) => (
              <label key={c.composition} className="arb-wm-sb-check">
                <input
                  type="checkbox"
                  checked={selectedComp === c.composition}
                  onChange={() => {
                    setSelectedComp(
                      selectedComp === c.composition ? null : c.composition,
                    );
                    resetPage();
                  }}
                />
                <span>
                  {c.composition} ({c.count})
                </span>
              </label>
            ))}

            {/* Styles — from API */}
            <p className="arb-wm-sb-filter-label">STYLES</p>
            {filters.styles.map((s) => (
              <label key={s.style} className="arb-wm-sb-check">
                <input
                  type="checkbox"
                  checked={selectedStyle === s.style}
                  onChange={() => {
                    setSelectedStyle(
                      selectedStyle === s.style ? null : s.style,
                    );
                    resetPage();
                  }}
                />
                <span>
                  {s.style} ({s.count})
                </span>
              </label>
            ))}

            {/* Properties — from API */}
            <p className="arb-wm-sb-filter-label">PROPERTIES</p>
            {filters.properties.map((p) => (
              <label key={p.property} className="arb-wm-sb-check">
                <input
                  type="checkbox"
                  checked={selectedProp === p.property}
                  onChange={() => {
                    setSelectedProp(
                      selectedProp === p.property ? null : p.property,
                    );
                    resetPage();
                  }}
                />
                <span>
                  {p.property} ({p.count})
                </span>
              </label>
            ))}
          </div>
        </aside>

        {/* ── MAIN CONTENT ──────────────────────────────────── */}
        <main className="arb-wm-main">
          {/* Banner */}
          <div className="arb-wm-banner">
            <img
              src="https://htmldemo.net/arubic/arubic/img/banner/women.jpg"
              alt="Women Collection"
              className="arb-wm-banner__img"
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
          </div>

          {/* Toolbar */}
          <div className="arb-wm-toolbar">
            <div className="arb-wm-toolbar__left">
              <button
                className={`arb-wm-view-btn ${viewMode === "grid" ? "arb-wm-view-btn--active" : ""}`}
                onClick={() => setViewMode("grid")}
                title="Grid view"
              >
                <svg viewBox="0 0 16 16" fill="currentColor">
                  <rect x="0" y="0" width="7" height="7" />
                  <rect x="9" y="0" width="7" height="7" />
                  <rect x="0" y="9" width="7" height="7" />
                  <rect x="9" y="9" width="7" height="7" />
                </svg>
              </button>
              <button
                className={`arb-wm-view-btn ${viewMode === "list" ? "arb-wm-view-btn--active" : ""}`}
                onClick={() => setViewMode("list")}
                title="List view"
              >
                <svg viewBox="0 0 16 16" fill="currentColor">
                  <rect x="0" y="0" width="16" height="4" />
                  <rect x="0" y="6" width="16" height="4" />
                  <rect x="0" y="12" width="16" height="4" />
                </svg>
              </button>
              <span className="arb-wm-toolbar__count">
                There Are <strong>{pagination.total}</strong> Products.
              </span>
            </div>
            <div className="arb-wm-toolbar__right">
              <label className="arb-wm-toolbar__sort-label">Sort By:</label>
              <select
                className="arb-wm-toolbar__sort"
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                  resetPage();
                }}
              >
                <option value="">Select</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="name-asc">Name: A to Z</option>
                <option value="name-desc">Name: Z to A</option>
              </select>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="arb-wm-error">
              <p>{error}</p>
            </div>
          )}

          {/* Products Grid / List */}
          <div
            className={`arb-wm-products ${viewMode === "list" ? "arb-wm-products--list" : "arb-wm-products--grid"}`}
          >
            {loading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <SkeletonCard key={i} />
                ))
              : products.length > 0
                ? products.map((p) => (
                    <ProductCard key={p.id} product={p} viewMode={viewMode} />
                  ))
                : !error && (
                    <p className="arb-wm-no-results">
                      No products match the selected filters.
                    </p>
                  )}
          </div>

          {/* Pagination */}
          {!loading && pagination.total > 0 && (
            <div className="arb-wm-pagination">
              <span className="arb-wm-pagination__info">
                Showing {Math.min((currentPage - 1) * 12 + 1, pagination.total)}
                -{Math.min(currentPage * 12, pagination.total)} of{" "}
                {pagination.total} item(s)
              </span>
              <div className="arb-wm-pagination__pages">
                <button
                  className="arb-wm-pagination__btn"
                  onClick={() => goPage(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  ‹ Previous
                </button>
                {Array.from(
                  { length: pagination.totalPages },
                  (_, i) => i + 1,
                ).map((p) => (
                  <button
                    key={p}
                    className={`arb-wm-pagination__num ${currentPage === p ? "arb-wm-pagination__num--active" : ""}`}
                    onClick={() => goPage(p)}
                  >
                    {p}
                  </button>
                ))}
                <button
                  className="arb-wm-pagination__btn"
                  onClick={() => goPage(currentPage + 1)}
                  disabled={currentPage === pagination.totalPages}
                >
                  Next ›
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
