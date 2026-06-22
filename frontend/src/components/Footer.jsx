import React, { useState } from "react";
import { FaFacebookF, FaTwitter, FaYoutube, FaGooglePlusG, FaInstagram } from "react-icons/fa";
import "../assets/CSS/Footer.css";

const footerLinks = [
  "Legal Notice",
  "Secure Payment",
  "Prices Drop",
  "New Products",
  "Best Sales",
  "About Us",
  "Contact Us",
  "Stores",
  "Login",
  "Register",
];

const socialLinks = [
  { icon: <FaFacebookF />,   label: "Facebook"  },
  { icon: <FaTwitter />,     label: "Twitter"   },
  { icon: <FaYoutube />,     label: "YouTube"   },
  { icon: <FaGooglePlusG />, label: "Google+"   },
  { icon: <FaInstagram />,   label: "Instagram" },
];

const Footer = () => {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e) => {
    e.preventDefault();
    setEmail("");
  };

  return (
    <footer className="footer">

      {/* Logo */}
      <div className="footer-logo">
       <img src="https://htmldemo.net/arubic/arubic/img/logo/logo.jpg" alt="" />
      </div>

      {/* Nav Links */}
      <nav className="footer-nav">
        {footerLinks.map((link, index) => (
          <span key={index} className="footer-nav-item">
            <a href="#" className="footer-nav-link">{link}</a>
            <span className="footer-nav-dash">—</span>
          </span>
        ))}
      </nav>

      {/* Social Icons */}
      <div className="footer-social">
        {socialLinks.map((s, i) => (
          <a key={i} href="#" className="footer-social-btn" aria-label={s.label}>
            {s.icon}
          </a>
        ))}
      </div>

      {/* Subscribe */}
      <form className="footer-subscribe" onSubmit={handleSubscribe}>
        <input
          type="email"
          placeholder="Enter your email here"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="footer-subscribe-input"
          required
        />
        <button type="submit" className="footer-subscribe-btn">Subscribe !</button>
      </form>

      {/* Copyright */}
      <div className="footer-copyright">
        <p>© Copyright <span className="footer-copyright-brand">Arubic</span> All Rights Reserved</p>
      </div>

    </footer>
  );
};

export default Footer;
