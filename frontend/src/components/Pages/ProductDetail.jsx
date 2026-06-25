import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Breadcrumb from "../Breadcrumb";
import "../../assets/css/ProductDetail.css";

const API = "http://localhost:5000/api";

function Stars({ count }) {
  return (
    <div className="arb-pd-stars">
      {[1, 2, 3, 4, 5].map((i) => (
        <svg
          key={i}
          className={`arb-pd-star ${i <= count ? "arb-pd-star--filled" : ""}`}
          viewBox="0 0 24 24"
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
}

function ProductCard({ product }) {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(false);
  const imgSrc =
    product.img_url ||
    (product.image1
      ? `${API.replace("/api", "")}uploads/products/${product.image1}`
      : "https://placehold.co/400x480?text=No+Image");
  return (
    <div
      className="arb-pd-rel-card"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => navigate(`/product/${product.id}`)}
    >
      <div className="arb-pd-rel-card__img-wrap">
        {product.badge && (
          <span
            className={`arb-pd-rel-badge arb-pd-rel-badge--${product.badge_type}`}
          >
            • {product.badge}
          </span>
        )}
        <img
          src={imgSrc}
          alt={product.name}
          className="arb-pd-rel-card__img"
          onError={(e) => {
            e.target.src = "https://placehold.co/400x480?text=No+Image";
          }}
        />
        {hovered && (
          <div className="arb-pd-rel-card__overlay">
            <button
              className="arb-pd-rel-card__btn"
              onClick={(e) => {
                e.stopPropagation();
              }}
            >
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
          </div>
        )}
      </div>
      <div className="arb-pd-rel-card__info">
        <h4 className="arb-pd-rel-card__name">{product.name}</h4>
        <Stars count={product.rating} />
        <div className="arb-pd-rel-card__price">
          <span className="arb-pd-rel-card__price-now">
            ${Number(product.price).toFixed(2)}
          </span>
          {product.old_price && (
            <span className="arb-pd-rel-card__price-old">
              ${Number(product.old_price).toFixed(2)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ProductDetail() {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [sameCategory, setSameCategory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // UI state
  const [activeThumb, setActiveThumb] = useState(0);
  const [thumbStart, setThumbStart] = useState(0);
  const [selectedSize, setSelectedSize] = useState("S");
  const [selectedColor, setSelectedColor] = useState(0);
  const [quantity, setQuantity] = useState(0);
  const [activeTab, setActiveTab] = useState("description");

  const colors = ["#e07b4f", "#2ecc87"];
  const sizes = ["XS", "S", "M", "L", "XL"];

  useEffect(() => {
    setLoading(true);
    setError(null);
    setActiveThumb(0);
    setThumbStart(0);
    setQuantity(0);

    fetch(`${API}/products/${id}`)
      .then((r) => r.json())
      .then((res) => {
        if (!res.success) {
          setError("Product not found.");
          return;
        }
        setProduct(res.data);

        // Fetch related + same category
        fetch(`${API}/products?limit=4&sort=id`)
          .then((r) => r.json())
          .then((r2) => {
            if (r2.success)
              setRelated(
                r2.data.filter((p) => p.id !== res.data.id).slice(0, 4),
              );
          });

        fetch(`${API}/products?category=${res.data.category}&limit=8`)
          .then((r) => r.json())
          .then((r3) => {
            if (r3.success)
              setSameCategory(
                r3.data.filter((p) => p.id !== res.data.id).slice(0, 8),
              );
          });
      })
      .catch(() => setError("Server se connect nahi ho pa raha."))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading)
    return (
      <div className="arb-pd-page">
        <Breadcrumb />
        <div className="arb-container arb-pd-skeleton-wrap">
          <div className="arb-pd-skeleton__img" />
          <div className="arb-pd-skeleton__content">
            {[80, 50, 60, 40, 40].map((w, i) => (
              <div
                key={i}
                className="arb-pd-skeleton__line"
                style={{ width: `${w}%` }}
              />
            ))}
          </div>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="arb-pd-page">
        <Breadcrumb />
        <div className="arb-container arb-pd-error">
          <p>{error}</p>
          <Link to="/shop">← Back to Shop</Link>
        </div>
      </div>
    );

  // Build image list from product (img_url + image1 + image2)
  const buildSrc = (url, filename) => {
    if (url) return url;
    if (filename) return `http://localhost:5000/uploads/products/${filename}`;
    return "https://placehold.co/600x700?text=No+Image";
  };

  const images = [
    buildSrc(product.img_url, product.image1),
    product.image2 ? buildSrc(null, product.image2) : null,
  ].filter(Boolean);

  // Pad with related product images if less than 3
  const allThumbs = [
    ...images,
    ...related
      .slice(0, 4 - images.length)
      .map((p) => buildSrc(p.img_url, p.image1)),
  ];

  const visibleThumbs = allThumbs.slice(thumbStart, thumbStart + 3);

  return (
    <div className="arb-pd-page">
      <Breadcrumb />

      <div className="arb-container">
        {/* ── PRODUCT MAIN SECTION ────────────────────────── */}
        <div className="arb-pd-main">
          {/* LEFT: Image + Thumbs */}
          <div className="arb-pd-gallery">
            <div className="arb-pd-gallery__main">
              <img
                src={
                  allThumbs[activeThumb] ||
                  "https://placehold.co/600x700?text=No+Image"
                }
                alt={product.name}
                className="arb-pd-gallery__img"
                onError={(e) => {
                  e.target.src = "https://placehold.co/600x700?text=No+Image";
                }}
              />
              <button className="arb-pd-gallery__zoom" title="Zoom">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="M21 21l-4.35-4.35" strokeLinecap="round" />
                  <line x1="11" y1="8" x2="11" y2="14" />
                  <line x1="8" y1="11" x2="14" y2="11" />
                </svg>
              </button>
            </div>

            {/* Thumbnails */}
            <div className="arb-pd-thumbs">
              <button
                className="arb-pd-thumbs__arrow"
                onClick={() => setThumbStart((p) => Math.max(0, p - 1))}
                disabled={thumbStart === 0}
              >
                ‹
              </button>

              <div className="arb-pd-thumbs__track">
                {visibleThumbs.map((src, i) => (
                  <div
                    key={i}
                    className={`arb-pd-thumb ${activeThumb === thumbStart + i ? "arb-pd-thumb--active" : ""}`}
                    onClick={() => setActiveThumb(thumbStart + i)}
                  >
                    <img
                      src={src}
                      alt={`thumb-${i}`}
                      onError={(e) => {
                        e.target.src = "https://placehold.co/100x120?text=...";
                      }}
                    />
                  </div>
                ))}
              </div>

              <button
                className="arb-pd-thumbs__arrow"
                onClick={() =>
                  setThumbStart((p) => Math.min(allThumbs.length - 3, p + 1))
                }
                disabled={thumbStart + 3 >= allThumbs.length}
              >
                ›
              </button>
            </div>
          </div>

          {/* RIGHT: Product Info */}
          <div className="arb-pd-info">
            <h1 className="arb-pd-info__name">{product.name}</h1>

            <Stars count={product.rating} />

            <div className="arb-pd-info__price-row">
              {product.old_price && (
                <span className="arb-pd-info__old-price">
                  ${Number(product.old_price).toFixed(2)}
                </span>
              )}
              <span className="arb-pd-info__price">
                ${Number(product.price).toFixed(2)}
              </span>
              {product.badge && (
                <span
                  className={`arb-pd-info__badge arb-pd-info__badge--${product.badge_type}`}
                >
                  {product.badge}
                </span>
              )}
            </div>

            <p className="arb-pd-info__desc">
              Printed chiffon knee length dress with tank straps. Deep
              v-neckline.
            </p>

            <div className="arb-pd-info__divider" />

            {/* Size */}
            <div className="arb-pd-info__option">
              <label className="arb-pd-info__option-label">Size</label>
              <select
                className="arb-pd-info__size-select"
                value={selectedSize}
                onChange={(e) => setSelectedSize(e.target.value)}
              >
                {sizes.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            {/* Color */}
            <div className="arb-pd-info__option">
              <label className="arb-pd-info__option-label">Color</label>
              <div className="arb-pd-info__colors">
                {colors.map((c, i) => (
                  <button
                    key={i}
                    className={`arb-pd-info__color-swatch ${selectedColor === i ? "arb-pd-info__color-swatch--active" : ""}`}
                    style={{ background: c }}
                    onClick={() => setSelectedColor(i)}
                  />
                ))}
              </div>
            </div>

            <div className="arb-pd-info__divider" />

            {/* Quantity + Add to Cart */}
            <div className="arb-pd-info__option-label">Quantity</div>
            <div className="arb-pd-info__cart-row">
              <div className="arb-pd-info__qty">
                <input
                  type="number"
                  className="arb-pd-info__qty-input"
                  value={quantity}
                  onChange={(e) =>
                    setQuantity(Math.max(0, Number(e.target.value)))
                  }
                  min="0"
                />
                <div className="arb-pd-info__qty-arrows">
                  <button onClick={() => setQuantity((q) => q + 1)}>▲</button>
                  <button
                    onClick={() => setQuantity((q) => Math.max(0, q - 1))}
                  >
                    ▼
                  </button>
                </div>
              </div>
              <button className="arb-pd-info__add-btn">
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
                ADD-TO-CART
              </button>
              <span className="arb-pd-info__stock">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                In Stock
              </span>
            </div>

            {/* Share */}
            <div className="arb-pd-info__share">
              <span className="arb-pd-info__share-label">Share :</span>
              {[
                {
                  label: "Facebook",
                  path: "M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z",
                },
                {
                  label: "Twitter",
                  path: "M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z",
                },
                {
                  label: "G+",
                  path: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z",
                },
                {
                  label: "Pinterest",
                  path: "M12 2C6.48 2 2 6.48 2 12c0 4.24 2.65 7.86 6.39 9.29-.09-.78-.17-1.98.03-2.83.19-.77 1.26-5.33 1.26-5.33s-.32-.64-.32-1.59c0-1.49.87-2.6 1.94-2.6.92 0 1.36.69 1.36 1.51 0 .92-.59 2.3-.89 3.58-.25 1.07.53 1.94 1.58 1.94 1.9 0 3.17-2.44 3.17-5.33 0-2.2-1.48-3.74-3.6-3.74-2.45 0-3.88 1.84-3.88 3.74 0 .74.29 1.53.64 1.96a.26.26 0 01.06.25l-.23.98c-.04.15-.13.18-.29.11C8.17 15.12 7 12.85 7 11c0-3.31 2.4-6.35 6.93-6.35 3.64 0 6.47 2.59 6.47 6.05 0 3.6-2.27 6.5-5.42 6.5-1.06 0-2.06-.55-2.4-1.2l-.65 2.43c-.24.91-.87 2.05-1.3 2.74.98.3 2.01.46 3.09.46 5.52 0 10-4.48 10-10S17.52 2 12 2z",
                },
              ].map((s) => (
                <a
                  key={s.label}
                  href="#"
                  className="arb-pd-info__share-btn"
                  aria-label={s.label}
                >
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d={s.path} />
                  </svg>
                </a>
              ))}
            </div>

            <div className="arb-pd-info__divider" />

            {/* Security policies */}
            {[
              {
                icon: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
                text: "Security Policy (Edit With Customer Reassurance Module)",
              },
              {
                icon: "M5 17H3a2 2 0 01-2-2V5a2 2 0 012-2h11a2 2 0 012 2v3m-4 10h6a2 2 0 002-2v-6a2 2 0 00-2-2h-6a2 2 0 00-2 2v6a2 2 0 002 2z",
                text: "Security Policy (Edit With Customer Reassurance Module)",
              },
              {
                icon: "M17 1l4 4-4 4M3 11V9a4 4 0 014-4h14M7 23l-4-4 4-4M21 13v2a4 4 0 01-4 4H3",
                text: "Security Policy (Edit With Customer Reassurance Module)",
              },
            ].map((p, i) => (
              <div key={i} className="arb-pd-info__policy">
                <svg
                  className="arb-pd-info__policy-icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path d={p.icon} />
                </svg>
                <span>{p.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── TABS ────────────────────────────────────────── */}
        <div className="arb-pd-tabs">
          <div className="arb-pd-tabs__nav">
            {["description", "details", "reviews"].map((tab) => (
              <button
                key={tab}
                className={`arb-pd-tabs__btn ${activeTab === tab ? "arb-pd-tabs__btn--active" : ""}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab === "description"
                  ? "DESCRIPTION"
                  : tab === "details"
                    ? "PRODUCT DETAILS"
                    : "REVIEWS"}
              </button>
            ))}
          </div>

          <div className="arb-pd-tabs__content">
            {activeTab === "description" && (
              <div className="arb-pd-tabs__panel">
                <p>
                  Fashion has been creating well-designed collections since
                  2010. The brand offers feminine designs delivering stylish
                  separates and statement dresses which has since evolved into a
                  full ready-to-wear collection in which every item is a vital
                  part of a woman's wardrobe. The result? Cool, easy, chic looks
                  with youthful elegance and unmistakable signature style. All
                  the beautiful pieces are made in Italy and manufactured with
                  the greatest attention. Now Fashion extends to a range of
                  accessories including shoes, hats, belts and more!
                </p>
              </div>
            )}
            {activeTab === "details" && (
              <div className="arb-pd-tabs__panel">
                <table className="arb-pd-details-table">
                  <tbody>
                    <tr>
                      <td>Category</td>
                      <td>{product.category}</td>
                    </tr>
                    <tr>
                      <td>Composition</td>
                      <td>{product.composition || "—"}</td>
                    </tr>
                    <tr>
                      <td>Style</td>
                      <td>{product.style || "—"}</td>
                    </tr>
                    <tr>
                      <td>Property</td>
                      <td>{product.property || "—"}</td>
                    </tr>
                    <tr>
                      <td>Rating</td>
                      <td>{product.rating} / 5</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
            {activeTab === "reviews" && (
              <div className="arb-pd-tabs__panel">
                <p className="arb-pd-tabs__no-reviews">
                  No reviews yet. Be the first to review this product!
                </p>
              </div>
            )}
          </div>
        </div>

        {/* ── RELATED PRODUCTS ────────────────────────────── */}
        {related.length > 0 && (
          <div className="arb-pd-section">
            <h2 className="arb-pd-section__title">RELATED PRODUCTS</h2>
            <div className="arb-pd-section__divider" />
            <div className="arb-pd-section__grid">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}

        {/* ── SAME CATEGORY ───────────────────────────────── */}
        {sameCategory.length > 0 && (
          <div className="arb-pd-section">
            <h2 className="arb-pd-section__title">
              {sameCategory.length} OTHER PRODUCTS IN THE SAME CATEGORY:
            </h2>
            <div className="arb-pd-section__divider" />
            <div className="arb-pd-section__grid">
              {sameCategory.slice(0, 4).map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
