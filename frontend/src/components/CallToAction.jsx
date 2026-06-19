import React from "react";
import "../assets/css/CallToAction.css";

const CallToAction = () => {
  return (
    <section className="cta-section">
      <div className="cta-overlay"></div>
      <div className="cta-content">
        <img src="https://htmldemo.net/arubic/arubic/img/logo/logo_static.png" alt="" />
        <h2 className="cta-heading">Trendy 2018 <span className="cta-blue">Fashion</span> clothes</h2>
        <p className="cta-subtext">Sale <span className="cta-blue">10%</span> everything online</p>
        <button className="cta-btn">Shop Now</button>
      </div>
    </section>
  );
};

export default CallToAction;
