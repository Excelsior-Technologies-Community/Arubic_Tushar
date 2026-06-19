import React, { useEffect, useState } from "react";
import "../assets/css/ProductCatalog.css";

const API_URL = "http://localhost:5000/api/products";

const StarRating = ({ rating = 4 }) => {
  return (
    <div className="pc-stars">
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star} className={star <= rating ? "pc-star pc-star-filled" : "pc-star"}>
          ★
        </span>
      ))}
    </div>
  );
};

const ProductCatalog = () => {
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
          setError("Products load nahi hue");
        }
      } catch (err) {
        setError("Server se connect nahi ho paya");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading) return <p className="pc-status">Loading...</p>;
  if (error) return <p className="pc-status pc-error">{error}</p>;
  
  const newProducts = products.filter((p) => p.is_new).slice(0, 4);
  const saleProducts = products
  .filter((p) => p.old_price && p.old_price > p.price)
  .slice(0, 6);
  
  return (
    <>  
    <section className="pc-section">
      <div className="pc-wrapper">

        {/* LEFT — New Products (large cards) */}
        <div className="pc-col">
          <div className="pc-col-header">
            <h2>New Products</h2>
            <p>We offer the best selection fashion at prices you will love!</p>
          </div>
          <div className="pc-large-grid">
            {newProducts.map((p) => (
              <LargeCard key={p.id} product={p} />
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="pc-divider"></div>

        {/* RIGHT — On Sale (small thumbnail list) */}
        <div className="pc-col">
          <div className="pc-col-header">
            <h2>On Sale Products</h2>
            <p>Browse the collection of our on sale products</p>
          </div>
          <div className="pc-small-grid">
            {saleProducts.map((p) => (
              <SmallCard key={p.id} product={p} />
            ))}
          </div>
        </div>

      </div>
    </section>
      <div className="feature-section">
      <div className="feature-content">
        <img src="https://htmldemo.net/arubic/arubic/img/feature/feature1.png" alt="" />
        <h1>Free Shipping</h1>
        <p>Free shipping on all order over $99.00</p>
      </div>
      <div className="feature-content">
        <img src="https://htmldemo.net/arubic/arubic/img/feature/feature2.png" alt="" />
        <h1>Online Support 24/7</h1>
        <p>We are here to make your day. Let’s talk !</p>
      </div>
      <div className="feature-content">
        <img src="https://htmldemo.net/arubic/arubic/img/feature/feature1.png" alt="" />
        <h1>Money Back Guarantee!</h1>
        <p>We free 30 days 100% money back & return</p>
      </div>


      </div>
            </>
  );
};

/* Large card — big image, title below, stars, price */
const LargeCard = ({ product }) => {
  const { title, price, old_price, image1, image2, badge } = product;
  return (
    <div className="pc-large-card">
      <div className="pc-large-img-wrap">
        <img src={`http://localhost:5000${image1}`} alt={title} className="pc-large-img pc-img-main" />
        <img src={`http://localhost:5000${image2 || image1}`} alt={title} className="pc-large-img pc-img-hover" />
        {badge && (
          <span className={"pc-badge " + (badge.type === "discount" ? "pc-badge-discount" : "pc-badge-new")}>
            {badge.type === "new" ? "• New" : `• ${badge.label}`}
          </span>
        )}
      </div>
      <div className="pc-large-info">
        <h4 className="pc-large-title">{title}</h4>
        <StarRating rating={5} />
        <div className="pc-price">
          <span className="pc-price-current">${price.toFixed(2)}</span>
          {old_price && <span className="pc-price-old">${old_price.toFixed(2)}</span>}
        </div>
      </div>
    </div>
  );
};

/* Small card — thumbnail left, text right */
const SmallCard = ({ product }) => {
  const { title, price, old_price, image1, image2 } = product;
  return (
    <div className="pc-small-card">
      <div className="pc-small-img-wrap">
        <img src={`http://localhost:5000${image1}`} alt={title} className="pc-small-img pc-img-main" />
        <img src={`http://localhost:5000${image2 || image1}`} alt={title} className="pc-small-img pc-img-hover" />
      </div>
      <div className="pc-small-info">
        <h4 className="pc-small-title">{title}</h4>
        <StarRating rating={4} />
        <div className="pc-price">
          <span className="pc-price-current">${price.toFixed(2)}</span>
          {old_price && <span className="pc-price-old">${old_price.toFixed(2)}</span>}
        </div>
      </div>
    </div>
  );
};

export default ProductCatalog;
