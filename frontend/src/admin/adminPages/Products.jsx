import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const API_URL = "http://localhost:5000/api/products";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  const fetchProducts = async () => {
    setLoading(true);
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

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id, title) => {
    const confirmed = window.confirm(`"${title}" ko delete karna hai?`);
    if (!confirmed) return;

    setDeletingId(id);
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setProducts((prev) => prev.filter((p) => p.id !== id));
      } else {
        alert(data.message || "Delete nahi ho paya");
      }
    } catch (err) {
      alert("Server se connect nahi ho paya");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) return <p className="admin-status">Loading products...</p>;
  if (error) return <p className="admin-status admin-status-error">{error}</p>;

  return (
    <>
      <div className="admin-page-header">
        <h1>Products</h1>
        <Link to="/admin/products/add" className="btn-add">
          + Add Product
        </Link>
      </div>

      <table className="admin-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Image</th>
            <th>Title</th>
            <th>Price</th>
            <th>Badge</th>
            <th>Order</th>
            <th>Featured</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {products.length === 0 ? (
            <tr>
              <td colSpan="8" className="admin-table-empty">
                Koi product nahi hai abhi.
              </td>
            </tr>
          ) : (
            products.map((p) => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>
                  <img
                    src={`http://localhost:5000${p.image1}`}
                    alt={p.title}
                    className="admin-table-thumb"
                  />
                </td>
                <td>{p.title}</td>
                <td className="admin-price-cell">
                  <span className="admin-price-current">${p.price.toFixed(2)}</span>
                  {p.old_price && (
                    <span className="admin-price-old">${p.old_price.toFixed(2)}</span>
                  )}
                </td>
                <td>
                  {p.badge ? (
                    <span
                      className={
                        "admin-badge " +
                        (p.badge.type === "discount" ? "admin-badge-discount" : "admin-badge-new")
                      }
                    >
                      {p.badge.label}
                    </span>
                  ) : (
                    "—"
                  )}
                </td>
                <td>{p.display_order}</td>
                <td>
                  <span className={"admin-pill " + (p.is_featured ? "admin-pill-yes" : "admin-pill-no")}>
                    {p.is_featured ? "Yes" : "No"}
                  </span>
                </td>
                <td className="admin-actions">
                  <Link to={`/admin/products/edit/${p.id}`} className="admin-edit-btn">
                    Edit
                  </Link>
                  <button
                    className="admin-delete-btn"
                    onClick={() => handleDelete(p.id, p.title)}
                    disabled={deletingId === p.id}
                  >
                    {deletingId === p.id ? "Deleting..." : "Delete"}
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </>
  );
}
