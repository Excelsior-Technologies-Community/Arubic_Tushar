import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/css/FeaturedProducts.css";

const API_URL = "http://localhost:5000/api/products/featured";
const SERVER_URL = "http://localhost:5000";
const PLACEHOLDER_IMAGE = "https://placehold.co/400x480?text=No+Image";

const getImageUrl = (imagePath) => {
  if (!imagePath) return PLACEHOLDER_IMAGE;

  if (imagePath.startsWith("http")) return imagePath;

  if (imagePath.startsWith("/"))
    return `${SERVER_URL}${imagePath}`;

  return `${SERVER_URL}/uploads/${imagePath}`;
};

export default function FeaturedProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProducts() {
      try {
        const res = await fetch(API_URL);
        const data = await res.json();

        if (data.success) {
          setProducts(Array.isArray(data.data) ? data.data : []);
        } else {
          setProducts([]);
          setError("No featured products found.");
        }
      } catch (err) {
        console.error(err);
        setError("Server se connect nahi ho paya.");
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  if (loading)
    return (
      <div className="fp-status">
        Loading Products...
      </div>
    );

  if (error)
    return (
      <div className="fp-status fp-error">
        {error}
      </div>
    );

  return (
    <section className="featured-products">

      <div className="fp-header">
        <h2>Featured Products</h2>

        <p>
          Browse the collection of our best selling and top interesting
          products
        </p>
      </div>

      <div className="fp-grid">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
          />
        ))}
      </div>

    </section>
  );
}

function ProductCard({ product }) {

  const navigate = useNavigate();

  const title = product.name || product.title || "Product";

  const price = Number(product.price || 0);

  const oldPrice =
    product.old_price &&
    Number(product.old_price);

  const image =
    getImageUrl(product.img_url || product.image1);

  const hoverImage =
    getImageUrl(
      product.image2 ||
      product.img_url ||
      product.image1
    );

  return (
    <div
      className="fp-card"
      onClick={() => navigate(`/product/${product.id}`)}
      style={{ cursor: "pointer" }}
    >

      <div className="fp-image-wrap">

        <img
          src={image}
          alt={title}
          className="fp-img fp-img-main"
          onError={(e) => {
            e.currentTarget.src = PLACEHOLDER_IMAGE;
          }}
        />

        <img
          src={hoverImage}
          alt={title}
          className="fp-img fp-img-hover"
          onError={(e) => {
            e.currentTarget.src = PLACEHOLDER_IMAGE;
          }}
        />

        {product.badge && (
          <span
            className={`fp-badge ${
              product.badge_type === "discount"
                ? "fp-badge-discount"
                : "fp-badge-new"
            }`}
          >
            {product.badge}
          </span>
        )}

        <div className="fp-icons">

          <button
            className="fp-icon-btn"
            onClick={(e) => e.stopPropagation()}
          >
            ♡
          </button>

          <button
            className="fp-icon-btn"
            onClick={(e) => e.stopPropagation()}
          >
            ⊕
          </button>

          <button
            className="fp-icon-btn"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/product/${product.id}`);
            }}
          >
            ⤢
          </button>

        </div>

      </div>

      <div className="fp-info">

        <h4 className="fp-title">
          {title}
        </h4>

        <div className="fp-price">

          <span className="fp-price-current">
            ${price.toFixed(2)}
          </span>

          {oldPrice && (
            <span className="fp-price-old">
              ${oldPrice.toFixed(2)}
            </span>
          )}

        </div>

      </div>

    </div>
  );
}