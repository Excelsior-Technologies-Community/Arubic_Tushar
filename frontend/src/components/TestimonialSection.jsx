import React, { useState, useEffect, useRef } from "react";
import "../assets/css/TestimonialSection.css";

const TESTIMONIALS_DATA = [
  {
    id: 1,
    quote: "Claritas est etiam processus dynamicus, qui sequitur mutationem consuetudium lectorum. Mirum est notare quam littera gothica, quam nunc putamus parum claram.",
    authorName: "Orlando Bloom",
    authorEmail: "demo@hastech.company",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
  },
  {
    id: 2,
    quote: "Duis autem vel eum iriure dolor in hendrerit in vulputate velit esse molestie consequat, vel illum dolore eu feugiat nulla facilisis at vero eros et accumsan.",
    authorName: "Md Shohel",
    authorEmail: "demo@hastech.company",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
  },
  {
    id: 3,
    quote: "Nam liber tempor cum soluta nobis eleifend option congue nihil imperdiet doming id quod mazim placerat facer possim assum. Typi non habent claritatem insitam.",
    authorName: "Grace Kelly",
    authorEmail: "demo@hastech.company",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80"
  }
];

const INSTAGRAM_DATA = [
  {
    id: 1,
    imageUrl: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500&auto=format&fit=crop&q=80",
    likes: 245,
    comments: 18
  },
  {
    id: 2,
    imageUrl: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=500&auto=format&fit=crop&q=80",
    likes: 312,
    comments: 24
  },
  {
    id: 3,
    imageUrl: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=500&auto=format&fit=crop&q=80",
    likes: 198,
    comments: 12
  },
  {
    id: 4,
    imageUrl: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=500&auto=format&fit=crop&q=80",
    likes: 420,
    comments: 35
  },
  {
    id: 5,
    imageUrl: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=500&auto=format&fit=crop&q=80",
    likes: 289,
    comments: 20
  },
  {
    id: 6,
    imageUrl: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=500&auto=format&fit=crop&q=80",
    likes: 374,
    comments: 29
  }
];

const TestimonialSection = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const autoPlayTimer = useRef(null);

  useEffect(() => {
    if (!isPaused) {
      autoPlayTimer.current = setInterval(() => {
        setActiveSlide((prev) => (prev + 1) % TESTIMONIALS_DATA.length);
      }, 5000);
    }
    return () => {
      if (autoPlayTimer.current) {
        clearInterval(autoPlayTimer.current);
      }
    };
  }, [isPaused]);

  const handleDotClick = (index) => {
    setActiveSlide(index);
  };

  return (
    <section className="testimonial-instagram-section">
      <div className="tis-row">
        {/* Testimonials Side */}
        <div className="tis-col-testimonials">
          <div className="tis-section-title">
            <h2>testimonials</h2>
          </div>
          <div 
            className="testimonial-container"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <div className="testimonial-slides-wrapper">
              {TESTIMONIALS_DATA.map((t, idx) => (
                <div 
                  key={t.id} 
                  className={`testimonial-slide ${idx === activeSlide ? "active" : ""}`}
                >
                  <div className="testimonial-content">
                    <p>{t.quote}</p>
                  </div>
                  <div className="testimonial-author">
                    <img src={t.avatar} alt={t.authorName} />
                    <div className="author-title">
                      <p className="author-name">{t.authorName}</p>
                      <p className="author-email">{t.authorEmail}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="testimonial-dots">
              {TESTIMONIALS_DATA.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => handleDotClick(idx)}
                  className={`testimonial-dot ${idx === activeSlide ? "active" : ""}`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default TestimonialSection;
