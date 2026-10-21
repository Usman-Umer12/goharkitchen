import React, { useEffect, useRef, useState } from "react";

/* =========================================================
   SERVICES DATA
========================================================= */

const services = [
  {
    number: "01",
    title: "Custom Kitchens",
    description:
      "Thoughtfully designed kitchens combining practical layouts, refined finishes and smart storage for everyday living.",
    image: "kitchen3.webp",
    link: "/kitchen",
  },
  {
    number: "02",
    title: "Luxury Wardrobes",
    description:
      "Made-to-measure wardrobes designed to maximize storage while complementing your bedroom's style.",
    image: "word1.webp",
    link: "/wordrobe",
  },
  {
    number: "03",
    title: "Media Walls",
    description:
      "Contemporary media walls that bring together entertainment, storage and sophisticated interior design.",
    image: "media1.webp",
    link: "/media-walls",
  },
  {
    number: "04",
    title: "Bedroom Furniture",
    description:
      "Beautifully considered bedroom furniture tailored to your space, preferences and everyday comfort.",
    image: "bed1.webp",
    link: "/bedroom-walls",
  },
];

/* =========================================================
   BRAND PARTNERS
========================================================= */

const brands = [
  { name: "Brand Partner 1", image: "brand1.webp" },
  { name: "Brand Partner 2", image: "brand2.webp" },
  { name: "Brand Partner 3", image: "brand3.webp" },
  { name: "Brand Partner 4", image: "brand4.webp" },
];

/* =========================================================
   WHY CHOOSE US DATA
========================================================= */

const benefits = [
  {
    number: "01",
    title: "Made to Measure",
    description:
      "Every design is planned around your available space, storage needs and lifestyle.",
  },
  {
    number: "02",
    title: "Material Selection",
    description:
      "Explore suitable materials, finishes and fittings according to your design and budget.",
  },
  {
    number: "03",
    title: "Attention to Detail",
    description:
      "Careful consideration of measurements, alignment, hardware and finishing.",
  },
  {
    number: "04",
    title: "Complete Coordination",
    description:
      "A coordinated approach to design, manufacturing and installation.",
  },
];

/* =========================================================
   IMAGE ASSETS
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

/* =========================================================
   SCROLL REVEAL
========================================================= */

const useReveal = () => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;

    if (!element) return undefined;

    const reducedMotion =
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (
      reducedMotion ||
      typeof IntersectionObserver === "undefined"
    ) {
      setVisible(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.08,
        rootMargin: "0px 0px -25px 0px",
      }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return [ref, visible];
};

const Reveal = ({
  children,
  delay = 0,
  className = "",
}) => {
  const [ref, visible] = useReveal();

  return (
    <div
      ref={ref}
      style={{ "--gk-delay": `${delay}ms` }}
      className={[
        "gk-reveal",
        visible ? "gk-reveal-visible" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </div>
  );
};

/* =========================================================
   SECTION HEADING
   Home.jsx ki "Discover Our Collections" heading jaisi:
   same size, same weight, left aligned, uppercase
========================================================= */

const SectionHeading = ({ id, children }) => (
  <h2 className="gk-heading" id={id}>
    {children}
  </h2>
);

/* =========================================================
   OUR SERVICES
========================================================= */

const OurServices = () => (
  <section
    className="gk-section gk-services"
    id="our-services"
    aria-labelledby="gk-services-title"
  >
    <div className="gk-container">
      <Reveal className="gk-heading-wrap">
        <SectionHeading id="gk-services-title">
          Our Services
        </SectionHeading>
      </Reveal>

      <div className="gk-services-grid">
        {services.map((service, index) => (
          <Reveal
            key={service.number}
            delay={index * 60}
            className="gk-service-card"
          >
            <a
              href={service.link}
              className="gk-service-link"
              aria-label={`Explore ${service.title}`}
            >
              <div className="gk-service-image">
                <img
                  src={getImage(service.image)}
                  alt={service.title}
                  loading="lazy"
                  decoding="async"
                />

                <span className="gk-service-number">
                  {service.number}
                </span>

                <span
                  className="gk-service-arrow"
                  aria-hidden="true"
                >
                  ↗
                </span>
              </div>

              <div className="gk-service-content">
                <h3>{service.title}</h3>
                <p>{service.description}</p>

                <span className="gk-service-discover">
                  Explore Service
                  <span aria-hidden="true"> ↗</span>
                </span>
              </div>
            </a>
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

/* =========================================================
   WHY CHOOSE US
========================================================= */

const WhyChooseGohar = () => (
  <section
    className="gk-section gk-why"
    id="why-choose-us"
    aria-labelledby="gk-why-title"
  >
    <div className="gk-container">
      <div className="gk-why-layout">
        <Reveal className="gk-why-intro">
          <SectionHeading id="gk-why-title">
            Why Choose Us
          </SectionHeading>

          <p className="gk-body gk-why-lead">
            Your interior should reflect the way you live.
            That is why every project deserves thoughtful
            planning, appropriate materials and attention
            to the smallest details.
          </p>

          <p className="gk-body gk-why-secondary">
            From the first conversation to the final
            installation, we focus on practical solutions,
            considered design and a finish that complements
            your space.
          </p>

          <a href="/contact" className="gk-btn-solid gk-why-button">
            Start Your Project
            <span aria-hidden="true">↗</span>
          </a>
        </Reveal>

        <div className="gk-benefits-grid">
          {benefits.map((benefit, index) => (
            <Reveal
              key={benefit.number}
              delay={index * 70}
              className="gk-benefit-card"
            >
              <div className="gk-benefit-top">
                <span className="gk-benefit-number">
                  {benefit.number}
                </span>

                <span
                  className="gk-benefit-mark"
                  aria-hidden="true"
                >
                  ↗
                </span>
              </div>

              <h3>{benefit.title}</h3>
              <p>{benefit.description}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  </section>
);

/* =========================================================
   BRAND PARTNERSHIPS
========================================================= */

const BrandPartnerships = () => (
  <section
    className="gk-section gk-partnerships"
    id="brand-partnerships"
    aria-labelledby="gk-partnerships-title"
  >
    <div className="gk-container">
      <Reveal className="gk-heading-wrap gk-partnerships-heading">
        <SectionHeading id="gk-partnerships-title">
          Our Brand Partners
        </SectionHeading>

        <p className="gk-body gk-partnerships-description">
          Thoughtful interiors begin with the right choices.
          We consider materials, finishes and fittings to
          complement each project's design and requirements.
        </p>
      </Reveal>

      <div className="gk-brands-grid">
        {brands.map((brand, index) => (
          <Reveal
            key={brand.image}
            delay={index * 70}
            className="gk-brand-item"
          >
            <img
              className="gk-brand-logo"
              src={getImage(brand.image)}
              alt={brand.name}
              loading="lazy"
              decoding="async"
            />
          </Reveal>
        ))}
      </div>
    </div>
  </section>
);

/* =========================================================
   GLOBAL SECTION STYLES
========================================================= */

const Styles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800&display=swap');

    :root {
      --gk-display: 'Montserrat', system-ui, -apple-system, 'Segoe UI', sans-serif;
      --gk-sans: 'Montserrat', system-ui, -apple-system, 'Segoe UI', sans-serif;

      --gk-bg: #0A0A0A;
      --gk-bg-warm: #100F0E;
      --gk-accent: #C0652B;
      --gk-accent-hover: #E08A4F;

      --gk-white: #FFFFFF;
      --gk-muted: rgba(255, 255, 255, 0.72);
      --gk-muted-strong: rgba(255, 255, 255, 0.88);
      --gk-border: rgba(255, 255, 255, 0.13);

      --gk-ease: cubic-bezier(0.2, 0.65, 0.3, 1);
    }

    .gk-section {
      position: relative;
      padding-block: 56px;
      overflow: clip;
      isolation: isolate;
      color: var(--gk-white);
      font-family: var(--gk-sans);
    }

    @media (min-width: 640px) {
      .gk-section { padding-block: 72px; }
    }

    @media (min-width: 1024px) {
      .gk-section { padding-block: 96px; }
    }

    .gk-section,
    .gk-section *,
    .gk-section *::before,
    .gk-section *::after {
      box-sizing: border-box;
    }

    .gk-section * {
      font-family: var(--gk-sans);
    }

    .gk-services,
    .gk-partnerships {
      background: var(--gk-bg);
    }

    .gk-why {
      background: var(--gk-bg-warm);
    }

    /* Home.jsx ki collections section jitni hi width + padding:
       px-4 sm:px-8 lg:px-10 xl:px-14 2xl:px-20 */
    .gk-container {
      width: 100%;
      padding-inline: 16px;
    }

    @media (min-width: 640px) {
      .gk-container { padding-inline: 32px; }
    }

    @media (min-width: 1024px) {
      .gk-container { padding-inline: 40px; }
    }

    @media (min-width: 1280px) {
      .gk-container { padding-inline: 56px; }
    }

    @media (min-width: 1536px) {
      .gk-container { padding-inline: 80px; }
    }

    .gk-section a {
      -webkit-tap-highlight-color: transparent;
    }

    .gk-section a:focus-visible {
      outline: 2px solid var(--gk-accent-hover);
      outline-offset: 5px;
    }

    /* SCROLL REVEAL */

    .gk-reveal {
      min-width: 0;
      opacity: 0;
      transform: translate3d(0, 18px, 0);
      transition:
        opacity 600ms ease,
        transform 600ms var(--gk-ease);
      transition-delay: var(--gk-delay, 0ms);
    }

    .gk-reveal-visible {
      opacity: 1;
      transform: translate3d(0, 0, 0);
    }

    /* SECTION HEADING = Home.jsx "Discover Our Collections"
       20px / 24px / 28px / 30px, semibold, uppercase, left aligned */

    .gk-heading {
      margin: 0;
      color: var(--gk-white);
      font-family: var(--gk-display);
      font-size: 20px;
      font-weight: 600;
      letter-spacing: 0.02em;
      text-transform: uppercase;
      overflow-wrap: break-word;
    }

    @media (min-width: 640px) {
      .gk-heading { font-size: 24px; }
    }

    @media (min-width: 768px) {
      .gk-heading { font-size: 28px; }
    }

    @media (min-width: 1024px) {
      .gk-heading { font-size: 30px; }
    }

    /* heading ke neeche gap (Home: mb-8 sm:mb-10 lg:mb-12) */
    .gk-heading-wrap {
      margin-bottom: 32px;
    }

    @media (min-width: 640px) {
      .gk-heading-wrap { margin-bottom: 40px; }
    }

    @media (min-width: 1024px) {
      .gk-heading-wrap { margin-bottom: 48px; }
    }

    .gk-body {
      margin: 0;
      color: var(--gk-muted);
      font-size: 13px;
      font-weight: 400;
      line-height: 1.9;
      overflow-wrap: break-word;
    }

    @media (min-width: 640px) {
      .gk-body { font-size: 14px; }
    }

    /* BUTTON */

    .gk-btn-solid {
      display: inline-flex;
      min-height: 49px;
      align-items: center;
      justify-content: center;
      gap: 13px;
      padding: 12px 23px;
      border: 1px solid var(--gk-white);
      border-radius: 2px;
      color: #111111;
      background: var(--gk-white);
      font-size: 10px;
      font-weight: 600;
      line-height: 1.4;
      letter-spacing: 0.12em;
      text-align: center;
      text-transform: uppercase;
      text-decoration: none;
      transition:
        color 220ms ease,
        background-color 220ms ease,
        border-color 220ms ease;
    }

    .gk-btn-solid:hover {
      color: var(--gk-white);
      background: var(--gk-accent);
      border-color: var(--gk-accent);
    }

    /* OUR SERVICES */

    .gk-services-grid {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 20px;
    }

    .gk-service-card {
      min-width: 0;
      border: 1px solid var(--gk-border);
      background: rgba(255, 255, 255, 0.015);
      transition: none;
    }

    .gk-service-link {
      display: block;
      height: 100%;
      color: inherit;
      text-decoration: none;
    }

    .gk-service-image {
      position: relative;
      aspect-ratio: 4 / 3;
      overflow: hidden;
      background: #171513;
    }

    .gk-service-image img {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center;
      transform: none !important;
      transition: none !important;
    }

    .gk-service-number {
      position: absolute;
      top: 12px;
      left: 12px;
      display: inline-flex;
      min-width: 34px;
      min-height: 30px;
      align-items: center;
      justify-content: center;
      border: 1px solid rgba(255, 255, 255, 0.35);
      color: var(--gk-white);
      background: rgba(0, 0, 0, 0.48);
      font-size: 10px;
      font-weight: 600;
      letter-spacing: 0.1em;
      backdrop-filter: blur(8px);
    }

    .gk-service-arrow {
      position: absolute;
      right: 12px;
      bottom: 12px;
      display: flex;
      width: 35px;
      height: 35px;
      align-items: center;
      justify-content: center;
      border: 1px solid rgba(255, 255, 255, 0.45);
      border-radius: 50%;
      color: var(--gk-white);
      background: rgba(0, 0, 0, 0.38);
      font-size: 18px;
      transition: none !important;
    }

    .gk-service-content {
      padding: 18px 15px 20px;
    }

    .gk-service-content h3 {
      margin: 0 0 9px;
      color: var(--gk-white);
      font-family: var(--gk-display);
      font-size: clamp(16px, 1.4vw, 20px);
      font-weight: 600;
      line-height: 1.25;
      letter-spacing: -0.01em;
      overflow-wrap: break-word;
    }

    .gk-service-content p {
      margin: 0;
      color: var(--gk-muted);
      font-size: 12px;
      line-height: 1.8;
    }

    .gk-service-discover {
      display: inline-flex;
      align-items: center;
      gap: 7px;
      margin-top: 16px;
      color: var(--gk-accent-hover);
      font-size: 10px;
      font-weight: 600;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }

    /* WHY CHOOSE US */

    .gk-why-layout {
      display: grid;
      grid-template-columns: minmax(0, 0.85fr) minmax(0, 1.15fr);
      align-items: start;
      gap: clamp(38px, 6vw, 82px);
    }

    .gk-why-intro {
      min-width: 0;
    }

    .gk-why-lead {
      margin-top: 22px;
      color: var(--gk-muted-strong);
    }

    .gk-why-secondary {
      margin-top: 14px;
    }

    .gk-why-button {
      margin-top: 27px;
    }

    .gk-benefits-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 14px;
    }

    .gk-benefit-card {
      display: flex;
      min-width: 0;
      min-height: 215px;
      flex-direction: column;
      padding: 24px 22px;
      border: 1px solid var(--gk-border);
      background: rgba(255, 255, 255, 0.025);
      transition:
        border-color 250ms ease,
        background-color 250ms ease;
    }

    .gk-benefit-card:hover {
      border-color: rgba(192, 101, 43, 0.6);
      background: rgba(192, 101, 43, 0.045);
    }

    .gk-benefit-top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      margin-bottom: 28px;
    }

    .gk-benefit-number {
      color: var(--gk-accent-hover);
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 0.14em;
    }

    .gk-benefit-mark {
      color: rgba(255, 255, 255, 0.5);
      font-size: 17px;
    }

    .gk-benefit-card h3 {
      margin: 0 0 10px;
      color: var(--gk-white);
      font-family: var(--gk-display);
      font-size: clamp(16px, 1.5vw, 20px);
      font-weight: 600;
      line-height: 1.25;
      letter-spacing: -0.01em;
      overflow-wrap: break-word;
    }

    .gk-benefit-card p {
      margin: 0;
      color: var(--gk-muted);
      font-size: 12px;
      line-height: 1.85;
    }

    /* BRAND PARTNERSHIPS */

    .gk-partnerships-heading .gk-body {
      max-width: 620px;
    }

    .gk-partnerships-description {
      margin-top: 14px;
      font-size: 13px;
      line-height: 1.9;
    }

    .gk-brands-grid {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      align-items: center;
      gap: 30px;
    }

    .gk-brand-item {
      display: flex;
      min-width: 0;
      min-height: 115px;
      align-items: center;
      justify-content: center;
      padding: 12px 18px;
      border: 1px solid transparent;
      transition:
        border-color 250ms ease,
        background-color 250ms ease;
    }

    .gk-brand-item:hover {
      border-color: var(--gk-border);
      background: rgba(255, 255, 255, 0.02);
    }

    .gk-brand-logo {
      display: block;
      width: 100%;
      max-width: 205px;
      height: 88px;
      object-fit: contain;
      object-position: center;
    }

    /* TABLET */

    @media (max-width: 1023px) {
      .gk-services-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 16px;
      }

      .gk-service-image {
        aspect-ratio: 16 / 10;
      }

      .gk-service-content {
        padding: 20px 18px 22px;
      }

      .gk-why-layout {
        grid-template-columns: minmax(0, 1fr);
        gap: 34px;
      }

      .gk-why-intro {
        max-width: 650px;
      }

      .gk-benefit-card {
        min-height: 195px;
      }

      .gk-brands-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 14px;
      }

      .gk-brand-item {
        min-height: 110px;
      }

      .gk-brand-logo {
        max-width: 190px;
        height: 82px;
      }
    }

    /* MOBILE */

    @media (max-width: 640px) {
      .gk-body {
        font-size: 13px;
        line-height: 1.85;
      }

      /* SERVICES (Home.jsx jaisa 2 columns, gap-3) */

      .gk-services-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 12px;
      }

      .gk-service-image {
        aspect-ratio: 4 / 3;
      }

      .gk-service-number {
        top: 8px;
        left: 8px;
        min-width: 29px;
        min-height: 26px;
        font-size: 9px;
      }

      .gk-service-arrow {
        right: 8px;
        bottom: 8px;
        width: 29px;
        height: 29px;
        font-size: 15px;
      }

      .gk-service-content {
        padding: 13px 11px 15px;
      }

      .gk-service-content h3 {
        margin-bottom: 7px;
        font-size: 15px;
        line-height: 1.25;
      }

      .gk-service-content p {
        font-size: 11px;
        line-height: 1.7;
      }

      .gk-service-discover {
        gap: 4px;
        margin-top: 12px;
        font-size: 9px;
        letter-spacing: 0.04em;
      }

      /* WHY CHOOSE US */

      .gk-why-layout {
        gap: 26px;
      }

      .gk-why-lead {
        margin-top: 17px;
      }

      .gk-why-secondary {
        margin-top: 12px;
      }

      .gk-why-button {
        width: 100%;
        margin-top: 22px;
      }

      .gk-benefits-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 9px;
      }

      .gk-benefit-card {
        min-height: 0;
        padding: 16px 13px 18px;
      }

      .gk-benefit-top {
        margin-bottom: 22px;
      }

      .gk-benefit-number {
        font-size: 10px;
      }

      .gk-benefit-mark {
        font-size: 14px;
      }

      .gk-benefit-card h3 {
        margin-bottom: 8px;
        font-size: 15px;
        line-height: 1.25;
      }

      .gk-benefit-card p {
        font-size: 11px;
        line-height: 1.75;
      }

      /* BRAND PARTNERS */

      .gk-partnerships-description {
        margin-top: 12px;
        font-size: 12px;
        line-height: 1.85;
      }

      .gk-brands-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 9px;
      }

      .gk-brand-item {
        min-height: 100px;
        padding: 10px;
      }

      .gk-brand-logo {
        max-width: 150px;
        height: 75px;
      }
    }

    /* SMALL MOBILE */

    @media (max-width: 360px) {
      .gk-services-grid {
        gap: 9px;
      }

      .gk-service-content {
        padding: 11px 9px 13px;
      }

      .gk-service-content h3 {
        font-size: 14px;
      }

      .gk-service-content p {
        font-size: 10px;
      }

      .gk-service-discover {
        font-size: 8px;
      }

      .gk-benefits-grid {
        gap: 7px;
      }

      .gk-benefit-card {
        padding: 14px 10px 15px;
      }

      .gk-benefit-card h3 {
        font-size: 14px;
      }

      .gk-benefit-card p {
        font-size: 10.5px;
      }

      .gk-brand-item {
        min-height: 85px;
      }

      .gk-brand-logo {
        height: 65px;
      }
    }

    /* ACCESSIBILITY */

    @media (prefers-reduced-motion: reduce) {
      .gk-reveal {
        opacity: 1;
        transform: none;
        transition: none;
      }

      .gk-service-image img,
      .gk-service-arrow,
      .gk-service-card,
      .gk-benefit-card,
      .gk-brand-item {
        transition: none !important;
      }
    }
  `}</style>
);

/* =========================================================
   HOME EXTRAS
========================================================= */

const HomeExtras = () => (
  <>
    <Styles />
    <OurServices />
    <WhyChooseGohar />
    <BrandPartnerships />
  </>
);

export default HomeExtras;