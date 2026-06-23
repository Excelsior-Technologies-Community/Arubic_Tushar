import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "../../assets/css/AboutUs.css";
import Breadcrumb from "../Breadcrumb";

const teamMembers = [
  {
    id: 1,
    name: "Marcos Alonso",
    role: "Fashion Designer",
    img: "https://htmldemo.net/arubic/arubic/img/team/team1.jpg",
    social: { facebook: "#", twitter: "#", instagram: "#", linkedin: "#" },
  },
  {
    id: 2,
    name: "Md Shohel",
    role: "Brand Manager",
    img: "https://htmldemo.net/arubic/arubic/img/team/team2.jpg",
    social: { facebook: "#", twitter: "#", instagram: "#", linkedin: "#" },
  },
  {
    id: 3,
    name: "Charlotte Taylor",
    role: "Creative Director",
    img: "https://htmldemo.net/arubic/arubic/img/team/team3.jpg",
    social: { facebook: "#", twitter: "#", instagram: "#", linkedin: "#" },
  },
];

const testimonials = [
  {
    id: 1,
    text: "Claritas est etiam processus dynamicus, qui sequitur mutationem consuetudium lectorum. Mirum est notare quam littera gothica, quam nunc putamus parum claram.",
    name: "orando BLoom",
    email: "demo@hastech.company",
    img: "https://htmldemo.net/arubic/arubic/img/testimonial/testimonial1.png",
  },
  {
    id: 2,
    text: "Claritas est etiam processus dynamicus, qui sequitur mutationem consuetudium lectorum. Mirum est notare quam littera gothica, quam nunc putamus parum claram.",
    name: "Md Shohel",
    email: "demo@hastech.company",
    img: "https://htmldemo.net/arubic/arubic/img/testimonial/testimonial2.png",
  },
  {
    id: 3,
    text: "Claritas est etiam processus dynamicus, qui sequitur mutationem consuetudium lectorum. Mirum est notare quam littera gothica, quam nunc putamus parum claram.",
    name: "orando BLoom",
    email: "demo@hastech.company",
    img: "https://htmldemo.net/arubic/arubic/img/testimonial/testimonial1.png",
  },
];

const AboutUs = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(timerRef.current);
  }, []);

  const goToSlide = (idx) => {
    setActiveSlide(idx);
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % testimonials.length);
    }, 4000);
  };

  return (
    <div className="arb-about-page">
      <Breadcrumb />

      {/* COMPANY SECTION */}
      <section className="arb-company">
        <div className="arb-container arb-company__inner">
          <div className="arb-company__img-wrap">
            <img
              src="https://htmldemo.net/arubic/arubic/img/about/about2.jpg"
              alt="Our Company"
              className="arb-company__img"
            />
          </div>
          <div className="arb-company__content">
            <h2 className="arb-company__title">Our Company</h2>
            <p className="arb-company__text">
              Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet,
              consectetur, adipisci velit, sed quia non numquam eius modi
              tempora incidunt ut labore et dolore magnam aliquam quaerat
              exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid
              ex ea commodi consequatur?
            </p>
            <p className="arb-company__text">
              Quis autem vel eum iure reprehenderit qui in ea voluptate velit
              esse quam nihil molestiae consequatur, vel illum qui dolorem eum
              fugiat quo volup.
            </p>
            <p className="arb-company__text">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent
              eu nisi ac mi malesuada vestibulum. Phasellus tempor nunc
              eleifend cursus molestie. Mauris lectus arcu, pellentesque at
              sodales sit amet, condimentum id nunc. Donec ornare mattis
              suscipit. Praesent fermentum accumsan vulputate.
            </p>
            <Link to="/shop" className="arb-company__btn">
              READ MORE
            </Link>
          </div>
        </div>
      </section>

      {/* TEAM SECTION */}
      <section className="arb-team">
        <div className="arb-container">
          <div className="arb-team__header">
            <h2 className="arb-team__title">Our Exclusive Team</h2>
            <p className="arb-team__subtitle">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit sed do
              eiusmod tempor incididunt ut labo.
            </p>
          </div>
          <div className="arb-team__grid">
            {teamMembers.map((member) => (
              <div key={member.id} className="arb-team__card">
                <div className="arb-team__img-wrap">
                  <img
                    src={member.img}
                    alt={member.name}
                    className="arb-team__img"
                  />
                  <div className="arb-team__overlay">
                    <h3 className="arb-team__name">{member.name}</h3>

                    <div className="arb-team__social">
                      <a href={member.social.facebook} aria-label="Facebook">
                        <svg viewBox="0 0 24 24" fill="currentColor">
                          <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
                        </svg>
                      </a>
                      <a href={member.social.twitter} aria-label="Twitter">
                        <svg viewBox="0 0 24 24" fill="currentColor">
                          <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
                        </svg>
                      </a>
                      <a href={member.social.instagram} aria-label="Instagram">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                          <circle cx="12" cy="12" r="4" />
                          <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
                        </svg>
                      </a>
                      <a href={member.social.linkedin} aria-label="LinkedIn">
                        <svg viewBox="0 0 24 24" fill="currentColor">
                          <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" />
                          <circle cx="4" cy="4" r="2" />
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIAL SECTION */}
      <section className="arb-testimonial">
        <div className="arb-container arb-testimonial__inner">
          <div className="arb-testimonial__quote-icon">
            <svg viewBox="0 0 60 45" fill="currentColor">
              <path d="M0 45V27.692C0 12.115 9.375 2.885 28.125 0l3.606 5.192C23.077 7.212 18.03 11.538 16.61 18H25.5V45H0zm34.5 0V27.692C34.5 12.115 43.875 2.885 62.625 0l3.606 5.192C58.077 7.212 53.03 11.538 51.61 18H60.5V45H34.5z" />
            </svg>
          </div>

          <div className="arb-testimonial__track">
            {testimonials.map((item, idx) => (
              <div
                key={item.id}
                className={`arb-testimonial__slide ${activeSlide === idx ? "arb-testimonial__slide--active" : ""}`}
              >
                <p className="arb-testimonial__text">{item.text}</p>
                <div className="arb-testimonial__author">
                  <img
                    src={item.img}
                    alt={item.name}
                    className="arb-testimonial__avatar"
                  />
                  <div className="arb-testimonial__author-info">
                    <span className="arb-testimonial__name">{item.name}</span>
                    <span className="arb-testimonial__email">{item.email}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="arb-testimonial__dots">
            {testimonials.map((_, idx) => (
              <button
                key={idx}
                className={`arb-testimonial__dot ${activeSlide === idx ? "arb-testimonial__dot--active" : ""}`}
                onClick={() => goToSlide(idx)}
                aria-label={`Slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default AboutUs;