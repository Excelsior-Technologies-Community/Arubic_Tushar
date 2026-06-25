// ProductCatalog.jsx
// NOTE:
// This file is a starter based on the conversation.
// Replace your existing ProductCatalog.jsx with this file and
// merge any project-specific CSS/classes if needed.

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/css/ProductCatalog.css";

const API_URL = "http://localhost:5000/api/products";
const SERVER_URL = "http://localhost:5000";
const PLACEHOLDER_IMAGE = "https://placehold.co/400x480?text=No+Image";

const getImage = (img) => {
  if (!img) return PLACEHOLDER_IMAGE;
  if (img.startsWith("http")) return img;
  if (img.startsWith("/")) return SERVER_URL + img;
  return `${SERVER_URL}/uploads/products/${img}`;
};

const StarRating = ({ rating = 4 }) => (
  <div className="pc-stars">
    {[1,2,3,4,5].map((s)=>(
      <span key={s} className={s<=rating?"pc-star pc-star-filled":"pc-star"}>★</span>
    ))}
  </div>
);

function LargeCard({product}){
  const navigate=useNavigate();
  const title=product.name||product.title||"Product";
  const price=Number(product.price||0);
  const oldPrice=product.old_price?Number(product.old_price):null;

  return (
    <div className="pc-large-card" style={{cursor:"pointer"}}
      onClick={()=>navigate(`/product/${product.id}`)}>
      <div className="pc-large-img-wrap">
        <img className="pc-large-img pc-img-main"
          src={getImage(product.img_url||product.image1)}
          alt={title}/>
        <img className="pc-large-img pc-img-hover"
          src={getImage(product.image2||product.img_url||product.image1)}
          alt={title}/>
      </div>

      <div className="pc-large-info">
        <h4>{title}</h4>
        <StarRating rating={product.rating||5}/>
        <div className="pc-price">
          <span className="pc-price-current">${price.toFixed(2)}</span>
          {oldPrice && <span className="pc-price-old">${oldPrice.toFixed(2)}</span>}
        </div>
      </div>
    </div>
  );
}

function SmallCard({product}){
  const navigate=useNavigate();
  const title=product.name||product.title||"Product";
  const price=Number(product.price||0);
  const oldPrice=product.old_price?Number(product.old_price):null;

  return (
    <div className="pc-small-card" style={{cursor:"pointer"}}
      onClick={()=>navigate(`/product/${product.id}`)}>
      <div className="pc-small-img-wrap">
        <img className="pc-small-img pc-img-main"
          src={getImage(product.img_url||product.image1)}
          alt={title}/>
        <img className="pc-small-img pc-img-hover"
          src={getImage(product.image2||product.img_url||product.image1)}
          alt={title}/>
      </div>

      <div className="pc-small-info">
        <h4>{title}</h4>
        <StarRating rating={product.rating||4}/>
        <div className="pc-price">
          <span className="pc-price-current">${price.toFixed(2)}</span>
          {oldPrice && <span className="pc-price-old">${oldPrice.toFixed(2)}</span>}
        </div>
      </div>
    </div>
  );
}

export default function ProductCatalog(){
  const [products,setProducts]=useState([]);
  const [loading,setLoading]=useState(true);
  const [error,setError]=useState("");

  useEffect(()=>{
    (async()=>{
      try{
        const res=await fetch(API_URL);
        const data=await res.json();
        if(Array.isArray(data)) setProducts(data);
        else if(data.success && Array.isArray(data.data)) setProducts(data.data);
        else setProducts([]);
      }catch{
        setError("Server se connect nahi ho paya.");
      }finally{
        setLoading(false);
      }
    })();
  },[]);

  if(loading) return <p className="pc-status">Loading...</p>;
  if(error) return <p className="pc-status pc-error">{error}</p>;

  const newProducts=products.filter(p=>p.is_new).slice(0,4);
  const saleProducts=products.filter(p=>p.old_price && Number(p.old_price)>Number(p.price)).slice(0,6);

  return (
    <section className="pc-section">
      <div className="pc-wrapper">
        <div className="pc-col">
          <h2>New Products</h2>
          <div className="pc-large-grid">
            {newProducts.map(p=><LargeCard key={p.id} product={p}/>)}
          </div>
        </div>

        <div className="pc-divider"></div>

        <div className="pc-col">
          <h2>On Sale Products</h2>
          <div className="pc-small-grid">
            {saleProducts.map(p=><SmallCard key={p.id} product={p}/>)}
          </div>
        </div>
      </div>
    </section>
  );
}
