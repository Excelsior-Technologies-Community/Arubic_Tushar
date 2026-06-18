import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const API_URL = "http://localhost:5000/api/products";

export default function ProductForm() {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    price: "",
    old_price: "",
    is_new: false,
    is_featured: true,
    display_order: 0,
  });
  const [image1, setImage1] = useState(null);
  const [image2, setImage2] = useState(null);
  const [preview1, setPreview1] = useState(null);
  const [preview2, setPreview2] = useState(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!isEditMode) return;

    const fetchProduct = async () => {
      try {
        const res = await fetch(`${API_URL}/${id}`);
        const data = await res.json();
        if (data.success) {
          const p = data.product;
          setFormData({
            title: p.title,
            price: p.price,
            old_price: p.old_price ?? "",
            is_new: Boolean(p.is_new),
            is_featured: Boolean(p.is_featured),
            display_order: p.display_order ?? 0,
          });
          setPreview1(`http://localhost:5000${p.image1}`);
          if (p.image2) setPreview2(`http://localhost:5000${p.image2}`);
        } else {
          setMessage("Product load nahi hua");
        }
      } catch (err) {
        setMessage("Server se connect nahi ho paya");
      }
    };

    fetchProduct();
  }, [id, isEditMode]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImage1Change = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage1(file);
      setPreview1(URL.createObjectURL(file));
    }
  };

  const handleImage2Change = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage2(file);
      setPreview2(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isEditMode && !image1) {
      setMessage("Main image (image1) zaroori hai");
      return;
    }

    setSaving(true);
    setMessage("");

    const data = new FormData();
    data.append("title", formData.title);
    data.append("price", formData.price);
    data.append("old_price", formData.old_price || "");
    data.append("is_new", formData.is_new ? "1" : "0");
    data.append("is_featured", formData.is_featured ? "1" : "0");
    data.append("display_order", formData.display_order || 0);
    if (image1) data.append("image1", image1);
    if (image2) data.append("image2", image2);

    try {
      const res = await fetch(isEditMode ? `${API_URL}/${id}` : API_URL, {
        method: isEditMode ? "PUT" : "POST",
        body: data,
      });

      const result = await res.json();

      if (result.success) {
        navigate("/admin/products");
      } else {
        setMessage(result.message || "Kuch gadbad ho gayi");
      }
    } catch (err) {
      setMessage("Server se connect nahi ho paya");
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <h1>{isEditMode ? "Edit Product" : "Add Product"}</h1>

      <form className="admin-form" onSubmit={handleSubmit}>
        <div className="admin-form-field">
          <label>Title</label>
          <input
            type="text"
            name="title"
            placeholder="Title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="admin-form-row">
          <div className="admin-form-field">
            <label>Price ($)</label>
            <input
              type="number"
              step="0.01"
              name="price"
              placeholder="Price"
              value={formData.price}
              onChange={handleChange}
              required
            />
          </div>

          <div className="admin-form-field">
            <label>Old Price ($) — optional</label>
            <input
              type="number"
              step="0.01"
              name="old_price"
              placeholder="Old Price (optional)"
              value={formData.old_price}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="admin-form-field">
          <label>Display Order</label>
          <input
            type="number"
            name="display_order"
            placeholder="Display Order"
            value={formData.display_order}
            onChange={handleChange}
          />
        </div>

        <label className="admin-checkbox">
          <input
            type="checkbox"
            name="is_new"
            checked={formData.is_new}
            onChange={handleChange}
          />
          Mark as New
        </label>

        <label className="admin-checkbox">
          <input
            type="checkbox"
            name="is_featured"
            checked={formData.is_featured}
            onChange={handleChange}
          />
          Show in Featured Products
        </label>

        <div className="admin-form-row">
          <div className="admin-form-field">
            <label>Main Image {isEditMode && "(blank chhodo agar change nahi karna)"}</label>
            <input type="file" accept="image/*" onChange={handleImage1Change} required={!isEditMode} />
            {preview1 && <img src={preview1} alt="" className="admin-form-preview" />}
          </div>

          <div className="admin-form-field">
            <label>Hover Image (optional)</label>
            <input type="file" accept="image/*" onChange={handleImage2Change} />
            {preview2 && <img src={preview2} alt="" className="admin-form-preview" />}
          </div>
        </div>

        <button type="submit" disabled={saving}>
          {saving ? "Saving..." : isEditMode ? "Update Product" : "Add Product"}
        </button>

        {message && <p className="admin-form-message">{message}</p>}
      </form>
    </>
  );
}
