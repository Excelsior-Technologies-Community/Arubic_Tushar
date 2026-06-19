import React, { useEffect, useState } from "react";
import "../assets/css/FeaturedProducts.css";

const API_URL = "http://localhost:5000/api/products/featured";

const FeaturedProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(API_URL);
        const data = await res.json();

        if (data.success) {
          setProducts(data.products);
        } else {
          setError("Failed to load products");
        }
      } catch (err) {
        setError("Server se connect nahi ho paya");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return <div className="fp-status">Loading products...</div>;
  }

  if (error) {
    return <div className="fp-status fp-error">{error}</div>;
  }

  return (
    <section className="featured-products">
      <div className="fp-header">
        <h2>Featured Products</h2>
        <p>Browse the collection of our best selling and top interesting products</p>
      </div>

      <div className="fp-grid">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
};

const ProductCard = ({ product }) => {
  const { title, price, old_price, image1, image2, badge } = product;

  return (
    <div className="fp-card">
      <div className="fp-image-wrap">
        <img src={`http://localhost:5000${image1}`} alt={title} className="fp-img fp-img-main" />
        <img src={`http://localhost:5000${image2}`} alt={title} className="fp-img fp-img-hover" />

        {badge && (
          <span className={`fp-badge ${badge.type === "discount" ? "fp-badge-discount" : "fp-badge-new"}`}>
            {badge.label}
          </span>
        )}

        <div className="fp-icons">
          <button className="fp-icon-btn" title="Add to wishlist">♡</button>
          <button className="fp-icon-btn" title="Quick view">⊕</button>
          <button className="fp-icon-btn" title="Details">⤢</button>
        </div>
      </div>

      <div className="fp-info">
        <h4 className="fp-title">{title}</h4>
        <div className="fp-price">
          <span className="fp-price-current">${price.toFixed(2)}</span>
          {old_price && <span className="fp-price-old">${old_price.toFixed(2)}</span>}
        </div>
      </div>
    </div>
  );
};

export default FeaturedProducts;
