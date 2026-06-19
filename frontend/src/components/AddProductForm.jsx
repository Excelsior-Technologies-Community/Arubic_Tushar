import React, { useState } from "react";
import "../assets/css/AddProductForm.css";

const API_URL = "http://localhost:5000/api/products";

const AddProductForm = () => {
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    old_price: "",
    is_new: false
  });
  const [image1, setImage1] = useState(null);
  const [image2, setImage2] = useState(null);
  const [preview1, setPreview1] = useState(null);
  const [preview2, setPreview2] = useState(null);
  const [status, setStatus] = useState(null); // "loading" | "success" | "error"
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
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

    if (!image1) {
      setStatus("error");
      setMessage("Main image (image1) zaroori hai");
      return;
    }

    setStatus("loading");
    setMessage("");

    const data = new FormData();
    data.append("title", formData.title);
    data.append("price", formData.price);
    data.append("old_price", formData.old_price || "");
    data.append("is_new", formData.is_new ? "1" : "0");
    data.append("image1", image1);
    if (image2) data.append("image2", image2);

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        body: data // Content-Type header set NAHI karna, browser khud boundary set karega
      });

      const result = await res.json();

      if (result.success) {
        setStatus("success");
        setMessage(`Product add ho gaya! ID: ${result.productId}`);
        // reset form
        setFormData({ title: "", price: "", old_price: "", is_new: false });
        setImage1(null);
        setImage2(null);
        setPreview1(null);
        setPreview2(null);
      } else {
        setStatus("error");
        setMessage(result.message || "Kuch gadbad ho gayi");
      }
    } catch (err) {
      setStatus("error");
      setMessage("Server se connect nahi ho paya");
    }
  };

  return (
    <div className="apf-wrapper">
      <h3 className="apf-heading">Add New Product</h3>

      <form className="apf-form" onSubmit={handleSubmit}>
        <div className="apf-field">
          <label>Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="apf-row">
          <div className="apf-field">
            <label>Price ($)</label>
            <input
              type="number"
              step="0.01"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
            />
          </div>

          <div className="apf-field">
            <label>Old Price ($) — optional</label>
            <input
              type="number"
              step="0.01"
              name="old_price"
              value={formData.old_price}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="apf-field apf-checkbox">
          <label>
            <input
              type="checkbox"
              name="is_new"
              checked={formData.is_new}
              onChange={handleChange}
            />
            Mark as "New" (sirf tab dikhega jab old_price empty ho)
          </label>
        </div>

        <div className="apf-row">
          <div className="apf-field">
            <label>Main Image (image1)</label>
            <input type="file" accept="image/*" onChange={handleImage1Change} required />
            {preview1 && <img src={preview1} alt="preview1" className="apf-preview" />}
          </div>

          <div className="apf-field">
            <label>Hover Image (image2) — optional</label>
            <input type="file" accept="image/*" onChange={handleImage2Change} />
            {preview2 && <img src={preview2} alt="preview2" className="apf-preview" />}
          </div>
        </div>

        <button type="submit" className="apf-submit" disabled={status === "loading"}>
          {status === "loading" ? "Uploading..." : "Add Product"}
        </button>

        {message && (
          <p className={`apf-message ${status === "success" ? "apf-success" : "apf-error"}`}>
            {message}
          </p>
        )}
      </form>
    </div>
  );
};

export default AddProductForm;
