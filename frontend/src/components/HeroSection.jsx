import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import "../assets/css/HeroSection.css";

/* ── Slider Data ───────────────────────────────────────────────────────────── */
const SLIDES = [
  {
    id: 1,
    tag: "ending today",
    heading: "25% Off",
    subheading: "your entire purchase",
    desc: "Use code Arubic25. Online and in store",
    btnText: "Shop now",
    btnLink: "/shop",
    bg: "https://htmldemo.net/arubic/arubic/img/slider/slider1.jpg",
    align: "left",
  },
  {
    id: 2,
    tag: "it's finally",
    heading: "up to 30% Off",
    subheading: "winter and party wear",
    desc: "hurry before it's gone!",
    btnText: "Shop now",
    btnLink: "/shop",
    bg: "https://htmldemo.net/arubic/arubic/img/slider/slider2.jpg",
    align: "left",
  },
];

/* ── Banner Data ───────────────────────────────────────────────────────────── */
const BANNERS = [ 
  {
    id: 1,
    img: "https://htmldemo.net/arubic/arubic/img/banner/banner1.jpg",
    link: "/shop",
    alt: "Banner 1",
  },
  {
    id: 2,
    img: "https://htmldemo.net/arubic/arubic/img/banner/banner2.jpg",
    link: "/shop",
    alt: "Banner 2",
  },
  {
    id: 3,
    img: "https://htmldemo.net/arubic/arubic/img/banner/banner3.jpg",
    link: "/shop",
    alt: "Banner 3",
  },
];

/* ── Component ─────────────────────────────────────────────────────────────── */
export default function HeroSection() {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [direction, setDirection] = useState("next"); // "next" | "prev"

  const goTo = useCallback(
    (index, dir = "next") => {
      if (animating) return;
      setAnimating(true);
      setDirection(dir);
      setTimeout(() => {
        setCurrent(index);
        setAnimating(false);
      }, 600);
    },
    [animating]
  );

  const goNext = useCallback(() => {
    const next = (current + 1) % SLIDES.length;
    goTo(next, "next");
  }, [current, goTo]);

  const goPrev = useCallback(() => {
    const prev = (current - 1 + SLIDES.length) % SLIDES.length;
    goTo(prev, "prev");
  }, [current, goTo]);

  /* auto-play */
  useEffect(() => {
    const timer = setInterval(goNext, 5000);
    return () => clearInterval(timer);
  }, [goNext]);

  const slide = SLIDES[current];

  return (
    <section className="arb-hero">
      {/* ── SLIDER ──────────────────────────────────────────────────────── */}
      <div className="arb-slider">
        {/* Slides */}
        {SLIDES.map((s, i) => (
          <div
            key={s.id}
            className={`arb-slide
              ${i === current ? "arb-slide--active" : ""}
              ${animating && i === current ? `arb-slide--out-${direction}` : ""}
            `}
            style={{ backgroundImage: `url(${s.bg})` }}
          />
        ))}

        {/* Content overlay */}
        <div className="arb-slider__content">
          <div className={`arb-slider__text arb-slider__text--${slide.align} ${animating ? "arb-slider__text--hidden" : "arb-slider__text--visible"}`}>
            <span className="arb-slide__tag">{slide.tag}</span>
            <h1 className="arb-slide__heading">{slide.heading}</h1>
            <h2 className="arb-slide__subheading">{slide.subheading}</h2>
            <p className="arb-slide__desc">{slide.desc}</p>
            <Link to={slide.btnLink} className="arb-slide__btn">
              {slide.btnText}
            </Link>
          </div>
        </div>

        {/* Prev / Next arrows */}
        <button className="arb-slider__arrow arb-slider__arrow--prev" onClick={goPrev} aria-label="Previous">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <button className="arb-slider__arrow arb-slider__arrow--next" onClick={goNext} aria-label="Next">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>

        {/* Dots */}
        <div className="arb-slider__dots">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              className={`arb-slider__dot ${i === current ? "arb-slider__dot--active" : ""}`}
              onClick={() => goTo(i, i > current ? "next" : "prev")}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>

      {/* ── BANNERS ─────────────────────────────────────────────────────── */}
      <div className="arb-banners">
        <div className="arb-container arb-banners__grid">
          {BANNERS.map((banner) => (
            <Link key={banner.id} to={banner.link} className="arb-banner__item">
              <img src={banner.img} alt={banner.alt} />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
