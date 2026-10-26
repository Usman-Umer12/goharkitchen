import React, { useEffect, useRef, useState } from "react";

/* =========================================================
   BRAND LOGO STYLE
   "white"    = har logo automatically clean white silhouette ban jata
                hai (white, black, colored ya transparent - koi bhi
                background ho). Extra khali jagah crop hoti hai aur
                sab logos barabar size mein dikhte hain.
   "original" = logos apne asli rang mein, white tile par
========================================================= */

const BRAND_LOGO_MODE = "white"; // "white" | "original"

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
  { name: "NUOMI Pakistan", image: "brand1.webp" },
  { name: "DTC", image: "brand2.webp" },
  { name: "Brand Partner 3", image: "brand3.webp" },
  { name: "Corian Solid Surface", image: "brand4.webp" },
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
   Home.jsx ki "Discover Our Collections" heading jaisi:
   same size, same weight, left aligned, uppercase
========================================================= */

const SectionHeading = ({ id, children }) => (
  <h2 className="gk-heading" id={id}>
    {children}
  </h2>
);

/* =========================================================
   OUR SERVICES  (soft white)
========================================================= */

const OurServices = () => (
  <section
    className="gk-section gk-services"
    id="our-services"
    aria-labelledby="gk-services-title"
  >
    <div className="gk-container">
      <Reveal className="gk-heading-wrap">
        <SectionHeading id="gk-services-title">Our Services</SectionHeading>
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

                <span className="gk-service-number">{service.number}</span>

                <span className="gk-service-arrow" aria-hidden="true">
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
   LOGO NORMALISER
   Logo image ko canvas par padhta hai, background (white / black /
   colored / transparent) pehchan kar hata deta hai, logo ko pure white
   banata hai aur logo ke aas-paas ki extra jagah crop kar deta hai.
========================================================= */

const logoCache = new Map();

const smoothstep = (t) => t * t * (3 - 2 * t);

const normaliseLogo = (src) => {
  if (logoCache.has(src)) return logoCache.get(src);

  const job = new Promise((resolve, reject) => {
    const img = new Image();
    img.decoding = "async";
    img.crossOrigin = "anonymous";

    img.onload = () => {
      try {
        const MAX = 720;
        const scale = Math.min(1, MAX / Math.max(img.naturalWidth, img.naturalHeight));
        const w = Math.max(1, Math.round(img.naturalWidth * scale));
        const h = Math.max(1, Math.round(img.naturalHeight * scale));

        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;

        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        ctx.drawImage(img, 0, 0, w, h);

        const imageData = ctx.getImageData(0, 0, w, h);
        const px = imageData.data;

        /* background colour = average of the four corners */
        const patch = Math.max(1, Math.min(4, Math.floor(Math.min(w, h) / 6)));
        let br = 0, bg = 0, bb = 0, ba = 0, n = 0;

        [[0, 0], [w - patch, 0], [0, h - patch], [w - patch, h - patch]].forEach(
          ([sx, sy]) => {
            for (let y = sy; y < sy + patch; y += 1) {
              for (let x = sx; x < sx + patch; x += 1) {
                const i = (y * w + x) * 4;
                br += px[i];
                bg += px[i + 1];
                bb += px[i + 2];
                ba += px[i + 3];
                n += 1;
              }
            }
          }
        );

        br /= n; bg /= n; bb /= n; ba /= n;
        const transparentBg = ba < 200;

        let minX = w, minY = h, maxX = -1, maxY = -1;

        for (let y = 0; y < h; y += 1) {
          for (let x = 0; x < w; x += 1) {
            const i = (y * w + x) * 4;
            const a = px[i + 3] / 255;
            let alpha = a;

            if (!transparentBg) {
              const dr = px[i] - br;
              const dg = px[i + 1] - bg;
              const db = px[i + 2] - bb;
              const dist = Math.sqrt(dr * dr + dg * dg + db * db) / 441.67;
              const t = Math.min(1, Math.max(0, (dist - 0.07) / 0.25));
              alpha = smoothstep(t) * a;
            }

            px[i] = 255;
            px[i + 1] = 255;
            px[i + 2] = 255;
            px[i + 3] = Math.round(alpha * 255);

            if (alpha > 0.1) {
              if (x < minX) minX = x;
              if (x > maxX) maxX = x;
              if (y < minY) minY = y;
              if (y > maxY) maxY = y;
            }
          }
        }

        if (maxX < 0) {
          reject(new Error("empty logo"));
          return;
        }

        ctx.putImageData(imageData, 0, 0);

        /* crop to the logo itself (+ tiny margin) */
        const pad = 2;
        const cx = Math.max(0, minX - pad);
        const cy = Math.max(0, minY - pad);
        const cw = Math.min(w - cx, maxX - minX + 1 + pad * 2);
        const ch = Math.min(h - cy, maxY - minY + 1 + pad * 2);

        const out = document.createElement("canvas");
        out.width = cw;
        out.height = ch;
        out.getContext("2d").drawImage(canvas, cx, cy, cw, ch, 0, 0, cw, ch);

        resolve({ url: out.toDataURL("image/png"), ratio: cw / ch });
      } catch (error) {
        reject(error);
      }
    };

    img.onerror = reject;
    img.src = src;
  });

  logoCache.set(src, job);
  return job;
};

const BrandLogo = ({ src, name }) => {
  const [logo, setLogo] = useState({ status: "loading" });

  useEffect(() => {
    let active = true;

    if (BRAND_LOGO_MODE !== "white") {
      setLogo({ status: "original" });
      return undefined;
    }

    normaliseLogo(src)
      .then((result) => {
        if (active) setLogo({ status: "ready", ...result });
      })
      .catch(() => {
        if (active) setLogo({ status: "fallback" });
      });

    return () => {
      active = false;
    };
  }, [src]);

  if (logo.status === "loading") {
    return <span className="gk-brand-skeleton" aria-hidden="true" />;
  }

  if (logo.status === "ready") {
    return (
      <img
        className="gk-brand-logo"
        style={{ "--gk-ar": logo.ratio.toFixed(3) }}
        src={logo.url}
        alt={name}
        decoding="async"
      />
    );
  }

  return (
    <img
      className={`gk-brand-logo gk-brand-logo-${logo.status}`}
      src={src}
      alt={name}
      loading="lazy"
      decoding="async"
    />
  );
};

/* =========================================================
   BRAND PARTNERSHIPS  (shortest section = BLACK, white text)
   Logos uniform white, equal tiles
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
          Thoughtful interiors begin with the right choices. We consider
          materials, finishes and fittings to complement each project's design
          and requirements.
        </p>
      </Reveal>

      <div className="gk-brands-grid" data-logo-mode={BRAND_LOGO_MODE}>
        {brands.map((brand, index) => (
          <Reveal
            key={brand.image}
            delay={index * 70}
            className="gk-brand-item"
          >
            <BrandLogo src={getImage(brand.image)} name={brand.name} />
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

      /* default = LIGHT tokens */
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

    /* Shortest section = black */
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

    /* Home.jsx collections jitni hi width + padding:
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

    /* SECTION HEADING = Home.jsx "Discover Our Collections"
       20px / 24px / 28px / 30px, semibold, uppercase, left aligned */

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

    /* BUTTON (black on white sections) */

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

    /* OUR SERVICES */

    .gk-services-grid {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      gap: 20px;
    }

    .gk-service-card {
      min-width: 0;
      border: 1px solid var(--gk-border);
      background: var(--gk-card);
      box-shadow: 0 1px 2px rgba(20, 20, 20, 0.04);
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
      background: #E9E5E0;
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
      color: #FFFFFF;
      background: rgba(0, 0, 0, 0.55);
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
      border: 1px solid rgba(255, 255, 255, 0.55);
      border-radius: 50%;
      color: #FFFFFF;
      background: rgba(0, 0, 0, 0.45);
      font-size: 18px;
      transition: none !important;
    }

    .gk-service-content {
      padding: 18px 15px 20px;
    }

    .gk-service-content h3 {
      margin: 0 0 9px;
      color: var(--gk-text);
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
      color: var(--gk-link);
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

    /* BRAND PARTNERSHIPS (black section) */

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

    .gk-brands-grid {
      --gk-logo-h: 58px;
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      align-items: stretch;
      gap: 16px;
    }

    .gk-brand-item {
      display: flex;
      min-width: 0;
      min-height: 150px;
      align-items: center;
      justify-content: center;
      padding: 28px 24px;
      border: 1px solid var(--gk-border);
      background: rgba(255, 255, 255, 0.035);
      transition:
        border-color 250ms ease,
        background-color 250ms ease;
    }

    .gk-brand-item:hover {
      border-color: rgba(224, 138, 79, 0.7);
      background: rgba(255, 255, 255, 0.07);
    }

    /* normalised logo: crop ho chuka hai, isliye har logo
       barabar height / balanced width mein aata hai */
    .gk-brand-logo {
      display: block;
      width: min(82%, calc(var(--gk-logo-h) * var(--gk-ar, 2.4)));
      height: auto;
      max-height: calc(var(--gk-logo-h) * 1.15);
      object-fit: contain;
      opacity: 0.92;
      transition: opacity 250ms ease, transform 250ms ease;
    }

    .gk-brand-item:hover .gk-brand-logo {
      opacity: 1;
      transform: scale(1.04);
    }

    .gk-brand-skeleton {
      display: block;
      width: 55%;
      height: 14px;
      border-radius: 2px;
      background: rgba(255, 255, 255, 0.08);
    }

    /* fallback (agar canvas image process na kar sake) */
    .gk-brand-logo-fallback {
      width: 100%;
      max-width: 190px;
      height: var(--gk-logo-h);
      object-fit: contain;
      filter: grayscale(1) invert(1) brightness(1.8) contrast(1.6);
      mix-blend-mode: screen;
      opacity: 1;
    }

    /* "original" mode: white tile par asli rang ke logos */
    .gk-brands-grid[data-logo-mode="original"] .gk-brand-item {
      border-color: transparent;
      background: #FFFFFF;
    }

    .gk-brands-grid[data-logo-mode="original"] .gk-brand-logo-original {
      width: 100%;
      max-width: 190px;
      height: var(--gk-logo-h);
      object-fit: contain;
      opacity: 1;
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
        --gk-logo-h: 52px;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 14px;
      }

      .gk-brand-item {
        min-height: 128px;
      }
    }

    /* MOBILE */

    @media (max-width: 640px) {
      .gk-body {
        font-size: 13px;
        line-height: 1.85;
      }

      /* SERVICES (2 columns, gap-3) */

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
        --gk-logo-h: 42px;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 9px;
      }

      .gk-brand-item {
        min-height: 104px;
        padding: 20px 14px;
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

      .gk-brands-grid {
        --gk-logo-h: 36px;
      }

      .gk-brand-item {
        min-height: 92px;
        padding: 16px 10px;
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
    <OurServices />
    <WhyChooseGohar />
    <BrandPartnerships />
  </>
);

export default HomeExtras;