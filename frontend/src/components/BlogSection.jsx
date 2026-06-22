import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "../assets/CSS/BlogSection.css";

const blogs = [
  {
    id: 1,
    day: "03",
    month: "August",
    title: "This is Second Post For XipBlog",
    date: "Aug 03, 2017",
    author: "Demo HasTech",
    excerpt:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the ...",
  },
  {
    id: 2,
    day: "03",
    month: "August",
    title: "This is Third Post For XipBlog",
    date: "Aug 03, 2017",
    author: "Demo HasTech",
    excerpt:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the ...",
  },
  {
    id: 3,
    day: "03",
    month: "August",
    title: "This is Fourth Post For XipBlog",
    date: "Aug 03, 2017",
    author: "Demo HasTech",
    excerpt:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the ...",
  },
  {
    id: 4,
    day: "03",
    month: "August",
    title: "This is First Post For XipBlog",
    date: "Aug 03, 2017",
    author: "Demo HasTech",
    excerpt:
      "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the ...",
  },
];

const BlogSection = () => {
  return (
    <section className="blog-section">

      {/* Header */}
      <div className="blog-header">
        <h2>From the Blog</h2>
        <div className="blog-header-line"></div>
        <p>
          Update the latest article, to help customers capture the most
          authentic of the operation of the store.
        </p>
      </div>

      {/* Swiper */}
      <div className="blog-swiper-wrap">
        <Swiper
          modules={[Pagination]}
          pagination={{ clickable: true }}
          slidesPerView={2}
          spaceBetween={40}
          breakpoints={{
            0:   { slidesPerView: 1, spaceBetween: 20 },
            768: { slidesPerView: 2, spaceBetween: 40 },
          }}
        >
          {blogs.map((blog) => (
            <SwiperSlide key={blog.id}>
              <div className="blog-card">

                {/* Left — date */}
                <div className="blog-date-box">
                  <span className="blog-date-month">{blog.month}</span>
                  <span className="blog-date-day">{blog.day}</span>
                </div>

                {/* Right — content */}
                <div className="blog-body">
                  <h4 className="blog-title">{blog.title}</h4>
                  <div className="blog-meta">
                    <span className="blog-meta-icon">&#128197;</span>
                    <span>{blog.date}</span>
                    <span className="blog-meta-sep"> - </span>
                    <span className="blog-meta-icon">&#128100;</span>
                    <span>{blog.author}</span>
                  </div>
                  <p className="blog-excerpt">{blog.excerpt}</p>
                  <a href="#" className="blog-read-more">
                    Read More <span className="blog-arrow">&#8594;</span>
                  </a>
                </div>

              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

    </section>
  );
};

export default BlogSection;
