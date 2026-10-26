
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

/* =========================================================
   GOHAR KITCHEN INTERIOR
   Luxury Kitchen Projects Portfolio

   Images:
   src/assets/project1.webp
   src/assets/project2.webp
   src/assets/project3.webp
   src/assets/project4.webp
   src/assets/project5.webp
   src/assets/project6.webp
========================================================= */

const PAGE_LABEL = "Luxury Projects";

const projectsData = [
  {
    title: "Modern Luxury Kitchen",
    category: "Modern Kitchen",
    description:
      "A beautifully designed modern kitchen featuring clean lines, premium finishes and intelligent storage solutions. Every detail is planned to create a stylish and practical cooking space.",
  },
  {
    title: "Contemporary Kitchen Design",
    category: "Contemporary Design",
    description:
      "A refined kitchen design combining contemporary styling, elegant cabinetry and carefully selected materials to create a sophisticated space for everyday living.",
  },
  {
    title: "Premium Modular Kitchen",
    category: "Modular Kitchen",
    description:
      "A thoughtfully planned modular kitchen with streamlined cabinets, practical storage and a seamless finish that brings functionality and luxury together.",
  },
  {
    title: "Elegant Custom Kitchen",
    category: "Custom Kitchen",
    description:
      "Designed around the client's space and lifestyle, this custom kitchen balances elegant detailing, smart organisation and a timeless interior aesthetic.",
  },
  {
    title: "Minimalist Luxury Kitchen",
    category: "Minimalist Design",
    description:
      "A clean, understated kitchen concept with balanced proportions, uncluttered surfaces and sophisticated finishes for a calm and contemporary atmosphere.",
  },
  {
    title: "Signature Kitchen Interior",
    category: "Signature Design",
    description:
      "A distinctive kitchen interior created with attention to cabinetry, layout and finishing details, delivering a cohesive look with everyday practicality.",
  },
];

/* =========================================================
   LOCAL IMAGE ASSETS
========================================================= */

const localAssets = import.meta.glob(
  "../assets/*.{webp,png,jpg,jpeg,avif}",
  {
    eager: true,
    query: "?url",
    import: "default",
  }
);

const getImage = (filename) => {
  const match = Object.keys(localAssets).find((path) =>
    path.endsWith(`/${filename}`)
  );

  return match ? localAssets[match] : `/assets/${filename}`;
};

const projects = projectsData.map((project, index) => ({
  ...project,
  number: String(index + 1).padStart(2, "0"),
  src: getImage(`project${index + 1}.webp`),
  alt: `${project.title} by Gohar Kitchen Interior`,
}));

/* =========================================================
   PROJECT ROW
========================================================= */

function ProjectRow({ project, index, onOpen }) {
  const rowRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = rowRef.current;

    if (!node) return undefined;

    if (
      typeof IntersectionObserver === "undefined" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setVisible(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12 }
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, []);

  const reversed = index % 2 === 1;

  return (
    <article
      ref={rowRef}
      className={`prj-row ${reversed ? "is-reversed" : ""} ${
        visible ? "is-visible" : ""
      }`}
    >
      <button
        type="button"
        className="prj-media"
        onClick={onOpen}
        aria-label={`View ${project.title}`}
      >
        <img
          src={project.src}
          alt={project.alt}
          loading={index < 2 ? "eager" : "lazy"}
          decoding="async"
        />

        <span className="prj-media-overlay" aria-hidden="true">
          <span className="prj-media-zoom">+</span>
        </span>
      </button>

      <div className="prj-info">
        <span className="prj-number" aria-hidden="true">
          {project.number}
        </span>

        <span className="prj-category">{project.category}</span>

        <h2 className="prj-title">{project.title}</h2>

        <span className="prj-rule" aria-hidden="true" />

        <p className="prj-desc">{project.description}</p>

        <button
          type="button"
          className="prj-btn"
          onClick={onOpen}
        >
          View Project
          <span className="prj-btn-arrow" aria-hidden="true">
            →
          </span>
        </button>
      </div>
    </article>
  );
}

/* =========================================================
   PROJECT LIGHTBOX
========================================================= */

function Lightbox({ items, index, onClose, onChange }) {
  const touchStart = useRef(null);
  const total = items.length;
  const current = items[index];

  const prev = useCallback(() => {
    onChange((index - 1 + total) % total);
  }, [index, total, onChange]);

  const next = useCallback(() => {
    onChange((index + 1) % total);
  }, [index, total, onChange]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowLeft") prev();
      if (event.key === "ArrowRight") next();
    };

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose, prev, next]);

  const handleTouchEnd = (event) => {
    if (touchStart.current === null) return;

    const difference =
      event.changedTouches[0].clientX - touchStart.current;

    if (Math.abs(difference) > 50) {
      difference > 0 ? prev() : next();
    }

    touchStart.current = null;
  };

  return (
    <div
      className="prj-lightbox"
      role="dialog"
      aria-modal="true"
      aria-label="Luxury kitchen project gallery"
      onClick={onClose}
    >
      <div
        className="prj-lightbox-top"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="prj-lightbox-info">
          <span className="prj-lightbox-title">
            {current.title}
          </span>

          <span className="prj-lightbox-count">
            {String(index + 1).padStart(2, "0")} /{" "}
            {String(total).padStart(2, "0")}
          </span>
        </div>

        <button
          type="button"
          className="prj-lightbox-close"
          onClick={onClose}
          aria-label="Close gallery"
        >
          ✕
        </button>
      </div>

      <div
        className="prj-lightbox-stage"
        onClick={(event) => event.stopPropagation()}
        onTouchStart={(event) => {
          touchStart.current = event.touches[0].clientX;
        }}
        onTouchEnd={handleTouchEnd}
      >
        {total > 1 && (
          <button
            type="button"
            className="prj-lightbox-nav prj-lightbox-prev"
            onClick={prev}
            aria-label="Previous project"
          >
            ‹
          </button>
        )}

        <img
          key={current.src}
          src={current.src}
          alt={current.alt}
        />

        {total > 1 && (
          <button
            type="button"
            className="prj-lightbox-nav prj-lightbox-next"
            onClick={next}
            aria-label="Next project"
          >
            ›
          </button>
        )}
      </div>
    </div>
  );
}

/* =========================================================
   MAIN PROJECTS PAGE
========================================================= */

export default function Projects() {
  const [lightboxIndex, setLightboxIndex] = useState(null);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Montserrat:wght@300;400;500;600;700&display=swap');

        .prj-wrap,
        .prj-wrap *,
        .prj-wrap *::before,
        .prj-wrap *::after,
        .prj-lightbox,
        .prj-lightbox *,
        .prj-lightbox *::before,
        .prj-lightbox *::after {
          box-sizing: border-box;
        }

        .prj-wrap {
          --prj-display: 'Cormorant Garamond', Georgia, serif;
          --prj-sans: 'Montserrat', Arial, sans-serif;
          --prj-accent: #C0652B;
          --prj-ease: cubic-bezier(.2, .65, .3, 1);

          width: 100%;
          overflow: clip;
          color: #141414;
          font-family: var(--prj-sans);
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        .prj-wrap button,
        .prj-wrap a,
        .prj-lightbox,
        .prj-lightbox button {
          font-family: var(--prj-sans);
        }

        .prj-container {
          width: 100%;
          max-width: 1800px;
          margin-inline: auto;
          padding-inline: 18px;
        }

        @media (min-width: 640px) {
          .prj-container { padding-inline: 32px; }
        }

        @media (min-width: 1024px) {
          .prj-container { padding-inline: 48px; }
        }

        @media (min-width: 1440px) {
          .prj-container { padding-inline: 76px; }
        }

        /* HERO */

        .prj-top {
          background: #080808;
          color: #fff;
          padding-block: 112px 58px;
        }

        @media (min-width: 640px) {
          .prj-top { padding-block: 130px 72px; }
        }

        @media (min-width: 1024px) {
          .prj-top { padding-block: 150px 88px; }
        }

        .prj-top-inner {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 36px;
        }

        @media (min-width: 900px) {
          .prj-top-inner {
            flex-direction: row;
            align-items: flex-end;
            justify-content: space-between;
            gap: 48px;
          }
        }

        .prj-eyebrow {
          display: block;
          margin-bottom: 16px;
          color: var(--prj-accent);
          font-size: 10px;
          font-weight: 600;
          letter-spacing: .28em;
          text-transform: uppercase;
        }

        .prj-heading {
          max-width: 900px;
          margin: 0;
          color: #fff;
          font-family: var(--prj-display);
          font-size: clamp(38px, 7vw, 76px);
          font-weight: 600;
          line-height: 1.04;
          letter-spacing: .015em;
          text-transform: uppercase;
        }

        .prj-heading-rule {
          display: block;
          width: 58px;
          height: 2px;
          margin-top: 23px;
          background: var(--prj-accent);
        }

        .prj-subtext {
          max-width: 610px;
          margin: 23px 0 0;
          color: rgba(255,255,255,.7);
          font-size: 12px;
          font-weight: 400;
          line-height: 2;
        }

        @media (min-width: 640px) {
          .prj-subtext { font-size: 14px; }
        }

        .prj-stat {
          flex: 0 0 auto;
          padding-left: 22px;
          border-left: 1px solid rgba(255,255,255,.25);
        }

        .prj-stat-number {
          display: block;
          color: #fff;
          font-family: var(--prj-display);
          font-size: 62px;
          font-weight: 600;
          line-height: 1;
        }

        .prj-stat-label {
          display: block;
          margin-top: 10px;
          color: rgba(255,255,255,.62);
          font-size: 10px;
          font-weight: 500;
          letter-spacing: .16em;
          text-transform: uppercase;
        }

        /* PROJECT LIST */

        .prj-list {
          background: #fff;
          color: #141414;
          padding-block: 56px 10px;
        }

        @media (min-width: 1024px) {
          .prj-list { padding-block: 95px 20px; }
        }

        .prj-row {
          display: grid;
          grid-template-columns: minmax(0, 1fr);
          align-items: center;
          gap: 26px;
          margin-bottom: 66px;
          opacity: 0;
          transform: translate3d(0, 24px, 0);
          transition:
            opacity 750ms var(--prj-ease),
            transform 750ms var(--prj-ease);
        }

        .prj-row.is-visible {
          opacity: 1;
          transform: translate3d(0, 0, 0);
        }

        @media (min-width: 1024px) {
          .prj-row {
            grid-template-columns: repeat(12, minmax(0, 1fr));
            gap: 0 52px;
            margin-bottom: 112px;
          }

          .prj-media { grid-column: 1 / span 7; }
          .prj-info { grid-column: 8 / span 5; }

          .prj-row.is-reversed .prj-media {
            grid-column: 6 / span 7;
            grid-row: 1;
          }

          .prj-row.is-reversed .prj-info {
            grid-column: 1 / span 5;
            grid-row: 1;
          }
        }

        .prj-media {
          position: relative;
          display: block;
          width: 100%;
          min-width: 0;
          margin: 0;
          padding: 0;
          overflow: hidden;
          border: 0;
          border-radius: 5px;
          background: #f3f0ed;
          line-height: 0;
          cursor: zoom-in;
          -webkit-tap-highlight-color: transparent;
        }

        .prj-media img {
          display: block;
          width: 100%;
          height: auto;
          object-fit: contain;
          transition: transform 800ms var(--prj-ease);
        }

        @media (hover: hover) {
          .prj-media:hover img {
            transform: scale(1.025);
          }
        }

        .prj-media-overlay {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: flex-end;
          justify-content: flex-end;
          padding: 20px;
          background: linear-gradient(
            to top,
            rgba(0,0,0,.42),
            transparent 45%
          );
          opacity: 0;
          transition: opacity 250ms ease;
        }

        .prj-media:hover .prj-media-overlay,
        .prj-media:focus-visible .prj-media-overlay {
          opacity: 1;
        }

        .prj-media-zoom {
          display: flex;
          width: 40px;
          height: 40px;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(255,255,255,.8);
          border-radius: 50%;
          color: #fff;
          font-size: 23px;
          line-height: 1;
        }

        @media (hover: none) {
          .prj-media-overlay { display: none; }
        }

        .prj-info {
          position: relative;
          min-width: 0;
          padding-block: 8px;
        }

        .prj-number {
          display: block;
          margin-bottom: 2px;
          color: transparent;
          font-family: var(--prj-display);
          font-size: 76px;
          font-weight: 700;
          line-height: 1;
          -webkit-text-stroke: 1px rgba(20,20,20,.23);
        }

        @media (min-width: 1024px) {
          .prj-number { font-size: 112px; }
        }

        .prj-category {
          display: block;
          margin-bottom: 12px;
          color: var(--prj-accent);
          font-size: 10px;
          font-weight: 600;
          letter-spacing: .2em;
          line-height: 1.7;
          text-transform: uppercase;
        }

        .prj-title {
          margin: 0;
          color: #151515;
          font-family: var(--prj-display);
          font-size: clamp(29px, 4vw, 43px);
          font-weight: 600;
          line-height: 1.13;
          overflow-wrap: anywhere;
        }

        .prj-rule {
          display: block;
          width: 46px;
          height: 2px;
          margin: 20px 0;
          background: #191919;
        }

        .prj-desc {
          max-width: 450px;
          margin: 0;
          color: #696969;
          font-size: 12px;
          font-weight: 400;
          line-height: 2;
        }

        @media (min-width: 640px) {
          .prj-desc { font-size: 13px; }
        }

        .prj-btn {
          display: inline-flex;
          align-items: center;
          gap: 13px;
          margin-top: 26px;
          padding: 14px 20px;
          border: 1px solid #191919;
          border-radius: 0;
          background: transparent;
          color: #191919;
          font-size: 10px;
          font-weight: 600;
          letter-spacing: .12em;
          text-transform: uppercase;
          cursor: pointer;
          transition:
            background-color 220ms ease,
            color 220ms ease,
            border-color 220ms ease;
        }

        .prj-btn:hover {
          border-color: var(--prj-accent);
          background: var(--prj-accent);
          color: #fff;
        }

        .prj-btn-arrow {
          font-size: 16px;
          transition: transform 220ms ease;
        }

        .prj-btn:hover .prj-btn-arrow {
          transform: translateX(4px);
        }

        .prj-media:focus-visible,
        .prj-btn:focus-visible,
        .prj-cta-link:focus-visible,
        .prj-lightbox button:focus-visible {
          outline: 2px solid var(--prj-accent);
          outline-offset: 4px;
        }

        /* CALL TO ACTION */

        .prj-cta {
          background: #080808;
          color: #fff;
          padding-block: 72px;
          text-align: center;
        }

        @media (min-width: 1024px) {
          .prj-cta { padding-block: 100px; }
        }

        .prj-cta-title {
          max-width: 780px;
          margin: 0 auto;
          color: #fff;
          font-family: var(--prj-display);
          font-size: clamp(32px, 5vw, 52px);
          font-weight: 600;
          line-height: 1.15;
          text-transform: uppercase;
        }

        .prj-cta-text {
          max-width: 530px;
          margin: 19px auto 0;
          color: rgba(255,255,255,.7);
          font-size: 12px;
          line-height: 2;
        }

        @media (min-width: 640px) {
          .prj-cta-text { font-size: 13px; }
        }

        .prj-cta-link {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 14px;
          margin-top: 30px;
          padding: 15px 25px;
          border: 1px solid var(--prj-accent);
          background: var(--prj-accent);
          color: #fff;
          font-size: 10px;
          font-weight: 600;
          letter-spacing: .15em;
          text-decoration: none;
          text-transform: uppercase;
          transition: background-color 220ms ease;
        }

        .prj-cta-link:hover {
          background: transparent;
        }

        /* LIGHTBOX */

        .prj-lightbox {
          --prj-accent: #C0652B;

          position: fixed;
          inset: 0;
          z-index: 9999;
          display: flex;
          flex-direction: column;
          background: rgba(0,0,0,.96);
          animation: prj-fade 220ms ease both;
        }

        .prj-lightbox-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          padding: 14px 16px;
          color: #fff;
        }

        @media (min-width: 640px) {
          .prj-lightbox-top { padding: 18px 30px; }
        }

        .prj-lightbox-info {
          display: flex;
          flex-direction: column;
          gap: 5px;
          min-width: 0;
        }

        .prj-lightbox-title {
          overflow: hidden;
          font-size: 10px;
          font-weight: 600;
          letter-spacing: .1em;
          text-overflow: ellipsis;
          text-transform: uppercase;
          white-space: nowrap;
        }

        .prj-lightbox-count {
          color: rgba(255,255,255,.6);
          font-size: 10px;
          letter-spacing: .14em;
        }

        .prj-lightbox-close {
          display: flex;
          width: 42px;
          height: 42px;
          flex: 0 0 auto;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(255,255,255,.4);
          border-radius: 50%;
          background: transparent;
          color: #fff;
          font-size: 16px;
          cursor: pointer;
          transition: background-color 200ms ease;
        }

        .prj-lightbox-close:hover {
          border-color: var(--prj-accent);
          background: var(--prj-accent);
        }

        .prj-lightbox-stage {
          position: relative;
          display: flex;
          min-height: 0;
          flex: 1;
          align-items: center;
          justify-content: center;
          padding: 0 12px 24px;
        }

        @media (min-width: 640px) {
          .prj-lightbox-stage { padding: 0 75px 30px; }
        }

        .prj-lightbox-stage img {
          display: block;
          width: auto;
          height: auto;
          max-width: 100%;
          max-height: calc(100dvh - 105px);
          object-fit: contain;
          animation: prj-fade 250ms ease both;
        }

        .prj-lightbox-nav {
          position: absolute;
          top: 50%;
          z-index: 2;
          display: flex;
          width: 42px;
          height: 42px;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(255,255,255,.4);
          border-radius: 50%;
          background: rgba(0,0,0,.6);
          color: #fff;
          font-size: 26px;
          line-height: 1;
          transform: translateY(-50%);
          cursor: pointer;
          transition: background-color 200ms ease;
        }

        .prj-lightbox-nav:hover {
          border-color: var(--prj-accent);
          background: var(--prj-accent);
        }

        .prj-lightbox-prev { left: 10px; }
        .prj-lightbox-next { right: 10px; }

        @media (min-width: 640px) {
          .prj-lightbox-prev { left: 20px; }
          .prj-lightbox-next { right: 20px; }
        }

        @keyframes prj-fade {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @media (prefers-reduced-motion: reduce) {
          .prj-wrap *,
          .prj-lightbox,
          .prj-lightbox * {
            animation: none !important;
            transition: none !important;
          }

          .prj-row {
            opacity: 1;
            transform: none;
          }
        }
      `}</style>

      <div className="prj-wrap">
        {/* BLACK HERO */}

        <section className="prj-top" aria-labelledby="prj-title">
          <div className="prj-container">
            <div className="prj-top-inner">
              <div>
                <span className="prj-eyebrow">
                  Gohar Kitchen Interior
                </span>

                <h1 className="prj-heading" id="prj-title">
                  {PAGE_LABEL}
                </h1>

                <span
                  className="prj-heading-rule"
                  aria-hidden="true"
                />

                <p className="prj-subtext">
                  Explore our collection of luxury kitchen designs,
                  thoughtfully planned layouts and elegant finishes.
                  Every design is created to bring style, functionality
                  and lasting value to your home.
                </p>
              </div>

              <div className="prj-stat">
                <span className="prj-stat-number">
                  {String(projects.length).padStart(2, "0")}
                </span>

                <span className="prj-stat-label">
                  Featured Kitchens
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* WHITE PROJECT GALLERY */}

        <section
          className="prj-list"
          aria-label="Luxury kitchen projects"
        >
          <div className="prj-container">
            {projects.map((project, index) => (
              <ProjectRow
                key={project.src}
                project={project}
                index={index}
                onOpen={() => setLightboxIndex(index)}
              />
            ))}
          </div>
        </section>

        {/* BLACK CONTACT SECTION */}

        <section
          className="prj-cta"
          aria-labelledby="prj-cta-title"
        >
          <div className="prj-container">
            <h2 className="prj-cta-title" id="prj-cta-title">
              Create Your Dream Kitchen
            </h2>

            <p className="prj-cta-text">
              Let Gohar Kitchen Interior help you create a kitchen
              that reflects your style, fits your space and makes
              everyday living more beautiful.
            </p>

            <Link to="/contact" className="prj-cta-link">
              Discuss Your Project
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </section>
      </div>

      {/* FULL-SCREEN IMAGE PREVIEW */}

      {lightboxIndex !== null && (
        <Lightbox
          items={projects}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onChange={setLightboxIndex}
        />
      )}
    </>
  );
}
