import React, { useEffect, useRef, useState } from "react";
import { supabase } from "../lib/supabase";

/* =========================================================
   SETTINGS
========================================================= */

const BRAND_TABLE = "brand_logos";


/* =========================================================
   BRAND PARTNERS (fallback: local brand1 - brand8)
========================================================= */

const fallbackBrands = [
  { name: "NUOMI Pakistan", image: "brand1.webp" },
  { name: "DTC", image: "brand2.webp" },
  { name: "Brand Partner 3", image: "brand3.webp" },
  { name: "Corian Solid Surface", image: "brand4.webp" },
  { name: "Brand Partner 5", image: "brand5.webp" },
  { name: "Brand Partner 6", image: "brand6.webp" },
  { name: "Brand Partner 7", image: "brand7.webp" },
  { name: "Brand Partner 8", image: "brand8.webp" },
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

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reducedMotion || typeof IntersectionObserver === "undefined") {
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

const Reveal = ({ children, delay = 0, className = "" }) => {
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
========================================================= */

const SectionHeading = ({ id, children }) => (
  <h2 className="gk-heading" id={id}>
    {children}
  </h2>
);


/* =========================================================
   WHY CHOOSE US  (pure white)
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
          <SectionHeading id="gk-why-title">Why Choose Us</SectionHeading>

          <p className="gk-body gk-why-lead">
            Your interior should reflect the way you live. That is why every
            project deserves thoughtful planning, appropriate materials and
            attention to the smallest details.
          </p>

          <p className="gk-body gk-why-secondary">
            From the first conversation to the final installation, we focus on
            practical solutions, considered design and a finish that
            complements your space.
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
                <span className="gk-benefit-number">{benefit.number}</span>

                <span className="gk-benefit-mark" aria-hidden="true">
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
   BRAND PARTNERSHIPS  (black section, original colour logos)
   Desktop: 4 + 4  |  Tablet/Mobile: 2 columns
   Logos Supabase (admin) se aate hain; khali ho to local fallback
========================================================= */

const BrandPartnerships = () => {
  const [remote, setRemote] = useState(null); // null = loading

  useEffect(() => {
    let active = true;

    (async () => {
      try {
        const { data, error } = await supabase
          .from(BRAND_TABLE)
          .select("id, name, image_url, sort_order, created_at")
          .order("sort_order", { ascending: true })
          .order("created_at", { ascending: true });

        if (!active) return;

        if (error || !data?.length) {
          setRemote([]);
          return;
        }

        setRemote(
          data.map((row) => ({
            id: row.id,
            name: row.name || "Brand Partner",
            src: row.image_url,
          }))
        );
      } catch (err) {
        if (active) setRemote([]);
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  const brands =
    remote === null
      ? []
      : remote.length
      ? remote
      : fallbackBrands.map((b) => ({
          id: b.image,
          name: b.name,
          src: getImage(b.image),
        }));

  return (
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
            Thoughtful interiors begin with the right choices. We consider
            materials, finishes and fittings to complement each project's
            design and requirements.
          </p>
        </Reveal>

        <div className="gk-brands-grid">
          {remote === null
            ? Array.from({ length: 8 }, (_, i) => (
                <div className="gk-brand-item" key={`sk-${i}`}>
                  <span className="gk-brand-skeleton" aria-hidden="true" />
                </div>
              ))
            : brands.map((brand, index) => (
                <Reveal
                  key={brand.id}
                  delay={(index % 4) * 70}
                  className="gk-brand-item"
                >
                  <img
                    className="gk-brand-logo"
                    src={brand.src}
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
};

/* =========================================================
   GLOBAL SECTION STYLES
========================================================= */

const Styles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800&display=swap');

    :root {
      --gk-display: 'Montserrat', system-ui, -apple-system, 'Segoe UI', sans-serif;
      --gk-sans: 'Montserrat', system-ui, -apple-system, 'Segoe UI', sans-serif;

      --gk-accent: #C0652B;
      --gk-accent-hover: #A8531F;
      --gk-accent-light: #E08A4F;

      --gk-ease: cubic-bezier(0.2, 0.65, 0.3, 1);
    }

    .gk-section {
      position: relative;
      padding-block: 56px;
      overflow: clip;
      isolation: isolate;
      font-family: var(--gk-sans);

      --gk-bg: #FFFFFF;
      --gk-text: #141414;
      --gk-muted: rgba(20, 20, 20, 0.68);
      --gk-muted-strong: rgba(20, 20, 20, 0.84);
      --gk-border: rgba(20, 20, 20, 0.12);
      --gk-card: #FFFFFF;
      --gk-link: var(--gk-accent);

      background: var(--gk-bg);
      color: var(--gk-text);
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

    /* Section themes */

    .gk-services {
      --gk-bg: #F6F4F1;
      --gk-card: #FFFFFF;
      border-top: 1px solid rgba(20, 20, 20, 0.06);
    }

    .gk-why {
      --gk-bg: #FFFFFF;
      --gk-card: #FAF8F5;
    }

    .gk-partnerships {
      --gk-bg: #000000;
      --gk-text: #FFFFFF;
      --gk-muted: rgba(255, 255, 255, 0.72);
      --gk-muted-strong: rgba(255, 255, 255, 0.88);
      --gk-border: rgba(255, 255, 255, 0.16);
      --gk-link: var(--gk-accent-light);
      padding-block: 48px;
    }

    @media (min-width: 640px) {
      .gk-partnerships { padding-block: 60px; }
    }

    @media (min-width: 1024px) {
      .gk-partnerships { padding-block: 72px; }
    }

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
      outline: 2px solid var(--gk-accent);
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

    /* SECTION HEADING */

    .gk-heading {
      margin: 0;
      color: var(--gk-text);
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
      border: 1px solid #141414;
      border-radius: 2px;
      color: #FFFFFF;
      background: #141414;
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
      color: #FFFFFF;
      background: var(--gk-accent);
      border-color: var(--gk-accent);
    }

    /* =====================================================
       OUR SERVICES
       Desktop: [ label | 3 column tiles ]
       Tablet/Mobile: label upar, neeche 3 column tiles
       Layout: 1 2 3 / 4 5 6
    ===================================================== */

    .gk-svc-intro {
      max-width: 520px;
      margin-top: 14px;
    }

    .gk-svc-groups {
      display: grid;
    }

    .gk-svc-group {
      display: grid;
      grid-template-columns: minmax(0, 1fr);
      gap: 22px;
      padding-block: 32px;
      border-top: 1px solid var(--gk-border);
    }

    .gk-svc-group:last-child {
      border-bottom: 1px solid var(--gk-border);
    }

    @media (min-width: 1024px) {
      .gk-svc-group {
        grid-template-columns: 280px minmax(0, 1fr);
        gap: 48px;
        padding-block: 44px;
      }
    }

    .gk-svc-meta {
      min-width: 0;
    }

    .gk-svc-label {
      margin: 0;
      color: var(--gk-text);
      font-family: var(--gk-display);
      font-size: 15px;
      font-weight: 700;
      letter-spacing: 0.1em;
      text-transform: uppercase;
    }

    .gk-svc-label::after {
      content: "";
      display: block;
      width: 36px;
      height: 2px;
      margin-top: 14px;
      background: var(--gk-accent);
    }

    .gk-svc-count {
      margin: 12px 0 0;
      color: var(--gk-muted);
      font-size: 11px;
      font-weight: 500;
      letter-spacing: 0.16em;
      text-transform: uppercase;
    }

    /* 3 columns har screen par */
    .gk-svc-list {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 14px;
      margin: 0;
      padding: 0;
      list-style: none;
    }

    .gk-svc-list li {
      min-width: 0;
      display: flex;
    }

    .gk-svc-link {
      position: relative;
      display: flex;
      width: 100%;
      min-height: 72px;
      align-items: center;
      gap: 14px;
      padding: 18px 20px;
      border: 1px solid var(--gk-border);
      border-radius: 2px;
      background: var(--gk-card);
      color: var(--gk-text);
      text-decoration: none;
      transition:
        border-color 250ms ease,
        background-color 250ms ease,
        box-shadow 300ms var(--gk-ease),
        transform 300ms var(--gk-ease);
    }

    /* neeche ki accent line (hover par bharti hai) */
    .gk-svc-link::after {
      content: "";
      position: absolute;
      left: -1px;
      right: -1px;
      bottom: -1px;
      height: 2px;
      background: var(--gk-accent);
      transform: scaleX(0);
      transform-origin: left;
      transition: transform 400ms var(--gk-ease);
    }

    .gk-svc-link:hover,
    .gk-svc-link:focus-visible {
      border-color: rgba(192, 101, 43, 0.55);
      background: #FFF9F4;
      box-shadow: 0 10px 24px -14px rgba(20, 20, 20, 0.25);
      transform: translateY(-2px);
    }

    .gk-svc-link:hover::after,
    .gk-svc-link:focus-visible::after {
      transform: scaleX(1);
    }

    /* bullet: hover par lambi dash ban jati hai */
    .gk-svc-bullet {
      flex: 0 0 auto;
      width: 8px;
      height: 8px;
      border-radius: 99px;
      background: var(--gk-accent);
      transition: width 300ms var(--gk-ease);
    }

    .gk-svc-link:hover .gk-svc-bullet,
    .gk-svc-link:focus-visible .gk-svc-bullet {
      width: 20px;
    }

    .gk-svc-name {
      min-width: 0;
      flex: 1;
      font-size: 15px;
      font-weight: 600;
      letter-spacing: 0.01em;
      line-height: 1.3;
      overflow-wrap: anywhere;
      transition: color 250ms ease;
    }

    .gk-svc-link:hover .gk-svc-name,
    .gk-svc-link:focus-visible .gk-svc-name {
      color: var(--gk-accent);
    }

    .gk-svc-arrow {
      display: inline-flex;
      flex: 0 0 auto;
      width: 30px;
      height: 30px;
      align-items: center;
      justify-content: center;
      border: 1px solid var(--gk-border);
      border-radius: 50%;
      color: rgba(20, 20, 20, 0.5);
      font-size: 13px;
      line-height: 1;
      transition:
        background-color 250ms ease,
        border-color 250ms ease,
        color 250ms ease,
        transform 300ms var(--gk-ease);
    }

    .gk-svc-link:hover .gk-svc-arrow,
    .gk-svc-link:focus-visible .gk-svc-arrow {
      border-color: var(--gk-accent);
      background: var(--gk-accent);
      color: #FFFFFF;
      transform: rotate(45deg);
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
      background: var(--gk-card);
      transition:
        border-color 250ms ease,
        background-color 250ms ease;
    }

    .gk-benefit-card:hover {
      border-color: rgba(192, 101, 43, 0.65);
      background: #FFF6EF;
    }

    .gk-benefit-top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      margin-bottom: 28px;
    }

    .gk-benefit-number {
      color: var(--gk-accent);
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 0.14em;
    }

    .gk-benefit-mark {
      color: rgba(20, 20, 20, 0.4);
      font-size: 17px;
    }

    .gk-benefit-card h3 {
      margin: 0 0 10px;
      color: var(--gk-text);
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

    /* BRAND PARTNERSHIPS (black section, original colour logos) */

    .gk-partnerships-heading .gk-body {
      max-width: 620px;
    }

    .gk-partnerships-description {
      margin-top: 14px;
      font-size: 13px;
      line-height: 1.9;
    }

    .gk-partnerships .gk-heading-wrap {
      margin-bottom: 28px;
    }

    @media (min-width: 1024px) {
      .gk-partnerships .gk-heading-wrap { margin-bottom: 36px; }
    }

    /* desktop: 4 + 4 */
    .gk-brands-grid {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      align-items: stretch;
      gap: 16px;
    }

    /* white tile = logos apne asli rang mein saaf nazar aate hain */
    .gk-brand-item {
      display: flex;
      min-width: 0;
      height: 140px;
      align-items: center;
      justify-content: center;
      padding: 24px 28px;
      border: 1px solid transparent;
      border-radius: 2px;
      background: #FFFFFF;
    }

    .gk-brand-logo {
      display: block;
      width: auto;
      height: auto;
      max-width: 100%;
      max-height: 100%;
      object-fit: contain;
      transition: transform 250ms ease;
    }

    .gk-brand-item:hover .gk-brand-logo {
      transform: scale(1.04);
    }

    .gk-brand-skeleton {
      display: block;
      width: 55%;
      height: 14px;
      border-radius: 2px;
      background: rgba(20, 20, 20, 0.08);
    }

    /* TABLET */

    @media (max-width: 1023px) {
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
        height: 120px;
      }

      /* services tablet: 3 column, thora chota */
      .gk-svc-list {
        gap: 12px;
      }

      .gk-svc-link {
        min-height: 68px;
        gap: 12px;
        padding: 16px 14px;
      }

      .gk-svc-name {
        font-size: 14px;
      }

      .gk-svc-arrow {
        display: none;
      }
    }

    /* MOBILE */

    @media (max-width: 640px) {
      .gk-body {
        font-size: 13px;
        line-height: 1.85;
      }

      /* SERVICES: 3 column (1 2 3 / 4 5 6), compact tiles */

      .gk-svc-group {
        gap: 16px;
        padding-block: 24px;
      }

      .gk-svc-label {
        font-size: 13px;
      }

      .gk-svc-label::after {
        margin-top: 12px;
      }

      .gk-svc-count {
        margin-top: 10px;
        font-size: 10px;
      }

      .gk-svc-list {
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 8px;
      }

      .gk-svc-link {
        min-height: 64px;
        flex-direction: column;
        align-items: flex-start;
        justify-content: center;
        gap: 8px;
        padding: 12px 10px;
      }

      .gk-svc-bullet {
        width: 6px;
        height: 6px;
      }

      .gk-svc-link:hover .gk-svc-bullet,
      .gk-svc-link:focus-visible .gk-svc-bullet {
        width: 16px;
      }

      .gk-svc-name {
        flex: 0 1 auto;
        width: 100%;
        font-size: 11.5px;
        font-weight: 600;
        letter-spacing: 0;
        line-height: 1.3;
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
        height: 100px;
        padding: 16px 14px;
      }
    }

    /* SMALL MOBILE */

    @media (max-width: 360px) {
      .gk-svc-list {
        gap: 6px;
      }

      .gk-svc-link {
        padding: 10px 8px;
      }

      .gk-svc-name {
        font-size: 10.5px;
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
        height: 88px;
        padding: 12px 10px;
      }
    }

    /* ACCESSIBILITY */

    @media (prefers-reduced-motion: reduce) {
      .gk-reveal {
        opacity: 1;
        transform: none;
        transition: none;
      }

      .gk-svc-link,
      .gk-svc-link::after,
      .gk-svc-bullet,
      .gk-svc-name,
      .gk-svc-arrow,
      .gk-benefit-card,
      .gk-brand-logo {
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
    <WhyChooseGohar />
    <BrandPartnerships />
  </>
);

export default HomeExtras;