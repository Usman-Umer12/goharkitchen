import React, { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  BadgeCheck,
  ClipboardCheck,
  Layers3,
  Ruler,
} from "lucide-react";

/* =========================================================
   DATA
========================================================= */

const ABOUT_IMAGE = "kitchen3.webp";

const aboutPoints = [
  "Kitchens, wardrobes, beds and media walls made to measure",
  "2D / 3D design so you can preview your space before production",
  "Carefully selected laminates, veneers, Corian and hardware",
  "Design, manufacturing and installation coordinated by one team",
];

const brands = [
  { name: "Brand Partner 1", image: "brand1.webp" },
  { name: "Brand Partner 2", image: "brand2.webp" },
  { name: "Brand Partner 3", image: "brand3.webp" },
  { name: "Brand Partner 4", image: "brand4.webp" },
];

const processSteps = [
  {
    number: "01",
    title: "Consultation & Planning",
    description:
      "We understand your requirements, preferred style, available space and budget before planning your project.",
  },
  {
    number: "02",
    title: "Design & Visualization",
    description:
      "Layouts and 2D or 3D concepts help you understand the proposed design before production begins.",
  },
  {
    number: "03",
    title: "Materials & Manufacturing",
    description:
      "We finalize suitable materials, dimensions, finishes and details before moving into production.",
  },
  {
    number: "04",
    title: "Installation & Handover",
    description:
      "Our team coordinates fitting, finishing and a final review to bring the planned interior together.",
  },
];

const benefits = [
  {
    number: "01",
    icon: Ruler,
    title: "Made to Measure",
    description:
      "Interior solutions planned around your space, layout, storage needs and project requirements.",
  },
  {
    number: "02",
    icon: Layers3,
    title: "Thoughtful Material Selection",
    description:
      "Guidance on materials, colors and finishes suited to your preferred design and budget.",
  },
  {
    number: "03",
    icon: BadgeCheck,
    title: "Attention to Detail",
    description:
      "Careful consideration of measurements, alignment, fittings and finishing throughout the project.",
  },
  {
    number: "04",
    icon: ClipboardCheck,
    title: "Coordinated Execution",
    description:
      "Design, manufacturing and installation coordinated according to your project's agreed scope.",
  },
];

/* =========================================================
   ASSETS
========================================================= */

const localAssets = import.meta.glob("../assets/*.{webp,png,jpg,jpeg,avif}", {
  eager: true,
  query: "?url",
  import: "default",
});

const getImage = (filename) => {
  const key = Object.keys(localAssets).find((path) =>
    path.endsWith(`/${filename}`)
  );

  return key ? localAssets[key] : `/assets/${filename}`;
};

/* =========================================================
   REVEAL ANIMATION
========================================================= */

const useReveal = () => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return undefined;

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
          observer.unobserve(element);
        }
      },
      { threshold: 0.08, rootMargin: "0px 0px -30px 0px" }
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
      style={{ "--gk-reveal-delay": `${delay}ms` }}
      className={`gk-reveal ${visible ? "gk-reveal-visible" : ""} ${className}`}
    >
      {children}
    </div>
  );
};

const Eyebrow = ({ children, centered = false }) => (
  <div className={`gk-eyebrow-row ${centered ? "is-centered" : ""}`}>
    <span className="gk-eyebrow-line" />
    <span className="gk-eyebrow">{children}</span>
    {centered && <span className="gk-eyebrow-line" />}
  </div>
);

/* =========================================================
   ABOUT GOHAR
========================================================= */

const AboutSection = () => (
  <section className="gk-section gk-about" id="about">
    <div className="gk-container">
      <div className="gk-about-grid">
        <Reveal className="gk-about-content">
          <Eyebrow>About Gohar</Eyebrow>

          <h2 className="gk-h2">
            Thoughtful Interiors, <em>Life.</em>
          </h2>

          <p className="gk-body gk-about-lead">
            At Gohar, we believe a beautiful interior should do more than look
            impressive. It should feel welcoming, work effortlessly and reflect
            the people who live in it. We create thoughtfully designed interior
            solutions that combine contemporary style, functionality and
            carefully considered details.
          </p>

          <p className="gk-body gk-about-description">
            From modern kitchens and custom wardrobes to elegant bedroom
            furniture, statement media walls and bespoke interior features, we
            bring ideas to life through considered design and skilled
            manufacturing. Every project starts with understanding your
            requirements, preferences, available space and everyday lifestyle.
          </p>

          <p className="gk-body gk-about-description">
            Our team helps coordinate the process from the initial consultation
            and 2D or 3D design planning to material selection, production and
            final installation. Our aim is to create a cohesive result with
            attention to proportions, finishing and practical everyday use.
          </p>

          <ul className="gk-about-list">
            {aboutPoints.map((point) => (
              <li key={point}>
                <span className="gk-bullet" aria-hidden="true" />
                <span>{point}</span>
              </li>
            ))}
          </ul>

          <div className="gk-about-actions">
            <a href="/about" className="gk-btn-solid">
              More About-Us
              <ArrowRight size={15} aria-hidden="true" />
            </a>

            <a href="#brand-partnerships" className="gk-btn-outline">
              Meet Our Partners
            </a>
          </div>
        </Reveal>

        <Reveal delay={120} className="gk-about-media">
          <div className="gk-about-image">
            <img
              src={getImage(ABOUT_IMAGE)}
              alt="Interior design and furniture by Gohar"
              loading="lazy"
              decoding="async"
            />
            <div className="gk-about-image-overlay" />
            <div className="gk-about-image-caption">
              <span>DESIGNED WITH PURPOSE</span>
              <p>Beautiful spaces. Better living.</p>
            </div>
          </div>

          <div className="gk-about-image-note">
            <span className="gk-about-note-line" />
            <p>
              Every detail matters — from the first sketch to the finished
              space.
            </p>
          </div>
        </Reveal>
      </div>
    </div>
  </section>
);

/* =========================================================
   OUR DESIGN PROCESS
========================================================= */

const DesignProcess = () => (
  <section className="gk-section gk-process" id="design-process">
    <div className="gk-container">
      <Reveal className="gk-process-heading">
        <Eyebrow>Our Design Process</Eyebrow>

        <h2 className="gk-h2">
          From First Ideas to <em>Finishing Touches.</em>
        </h2>

        <p className="gk-body">
          A considered process that brings your ideas to life through thoughtful
          design, suitable materials and careful execution.
        </p>
      </Reveal>

      <div className="gk-process-grid">
        {processSteps.map((step, index) => (
          <Reveal
            key={step.number}
            delay={index * 80}
            className="gk-process-item"
          >
            <div className="gk-process-number">
              <span>{step.number}</span>
              <span className="gk-process-number-line" />
            </div>
            <h3>{step.title}</h3>
            <p>{step.description}</p>
          </Reveal>
        ))}
      </div>

      <Reveal className="gk-process-footer">
        <span>Have a project in mind?</span>
        <a href="/contact" className="gk-text-link">
          Let's discuss it <ArrowRight size={15} aria-hidden="true" />
        </a>
      </Reveal>
    </div>
  </section>
);

/* =========================================================
   WHY CHOOSE GOHAR
========================================================= */

const WhyChooseGohar = () => (
  <section className="gk-section gk-why" id="why-gohar">
    <div className="gk-container">
      <div className="gk-why-layout">
        <Reveal className="gk-why-intro">
          <Eyebrow>Why Choose Gohar</Eyebrow>

          <h2 className="gk-h2">
            Designed Around You. <em>Made with Care.</em>
          </h2>

          <p className="gk-body gk-why-lead">
            Every project deserves thoughtful planning, suitable materials and
            attention to the details that make a space feel complete.
          </p>

          <p className="gk-body gk-why-secondary">
            We focus on understanding your needs and coordinating each stage of
            the project around the intended design, practical use and agreed
            requirements.
          </p>

          <a href="/contact" className="gk-btn-solid gk-why-button">
            Start Your Project
            <ArrowRight size={15} aria-hidden="true" />
          </a>
        </Reveal>

        <div className="gk-benefits-grid">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;

            return (
              <Reveal
                key={benefit.number}
                delay={index * 70}
                className="gk-benefit-card"
              >
                <div className="gk-benefit-top">
                  <Icon
                    className="gk-benefit-icon"
                    size={26}
                    strokeWidth={1.3}
                    aria-hidden="true"
                  />
                  <span className="gk-benefit-number">{benefit.number}</span>
                </div>

                <h3>{benefit.title}</h3>
                <p>{benefit.description}</p>
              </Reveal>
            );
          })}
        </div>
      </div>
    </div>
  </section>
);

/* =========================================================
   BRAND PARTNERSHIPS
========================================================= */

const BrandPartnerships = () => (
  <section className="gk-section gk-partnerships" id="brand-partnerships">
    <div className="gk-container">
      <Reveal className="gk-partnerships-heading">
        <Eyebrow centered>Our Brand Partners</Eyebrow>

        <h2 className="gk-h2">
          Trusted Brands. <em>Timeless Interiors.</em>
        </h2>

        <p className="gk-body gk-partnerships-description">
          We work with carefully selected brands to bring quality materials,
          refined finishes and lasting value to interior projects. Together, we
          turn thoughtful design into beautifully finished spaces.
        </p>
      </Reveal>

      <div className="gk-brands-grid">
        {brands.map((brand, index) => (
          <Reveal
            key={brand.image}
            delay={index * 80}
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
   STYLES
========================================================= */

const Styles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;1,500&family=Jost:wght@300;400;500&display=swap');

    :root {
      --gk-display: 'Cormorant Garamond', 'Playfair Display', Georgia, serif;
      --gk-sans: 'Jost', 'Helvetica Neue', Arial, sans-serif;
      --gk-bg: #0A0A0A;
      --gk-bg-alt: #0F0E0D;
      --gk-bg-warm: #100F0E;
      --gk-accent: #C0652B;
      --gk-accent-hover: #D2743A;
      --gk-accent-soft: #E08A4F;
      --gk-muted: rgba(255,255,255,.66);
      --gk-border: rgba(255,255,255,.12);
      --gk-container: 1200px;
      --gk-ease: cubic-bezier(.2,.65,.3,1);
    }

    .gk-section {
      position: relative;
      padding: clamp(56px, 8vw, 96px) 0;
      color: #fff;
      font-family: var(--gk-sans);
      overflow: clip;
    }

    .gk-section *,
    .gk-section *::before,
    .gk-section *::after { box-sizing: border-box; }

    .gk-about { background: var(--gk-bg-alt); }
    .gk-process, .gk-partnerships { background: var(--gk-bg); }
    .gk-why { background: var(--gk-bg-warm); }

    .gk-container {
      width: min(100% - 48px, var(--gk-container));
      margin-inline: auto;
    }

    /* REVEAL */
    .gk-reveal {
      min-width: 0;
      opacity: 0;
      transform: translate3d(0, 16px, 0);
      transition: opacity .65s ease, transform .65s var(--gk-ease);
      transition-delay: var(--gk-reveal-delay, 0ms);
    }
    .gk-reveal-visible { opacity: 1; transform: none; }

    /* TYPOGRAPHY */
    .gk-eyebrow-row {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 16px;
    }
    .gk-eyebrow-row.is-centered { justify-content: center; }

    .gk-eyebrow-line {
      flex: 0 0 32px;
      width: 32px;
      height: 1px;
      background: var(--gk-accent);
    }

    .gk-eyebrow {
      font-size: 11px;
      font-weight: 500;
      letter-spacing: .24em;
      text-transform: uppercase;
      color: var(--gk-accent-soft);
    }

    .gk-h2 {
      margin: 0;
      font-family: var(--gk-display);
      font-weight: 500;
      font-size: clamp(32px, 3.6vw, 54px);
      line-height: 1.1;
      letter-spacing: -.02em;
      color: #fff;
      text-wrap: balance;
      overflow-wrap: break-word;
    }
    .gk-h2 em { font-style: italic; color: var(--gk-accent-soft); }

    .gk-body {
      margin: 0;
      font-size: 15px;
      font-weight: 300;
      line-height: 1.85;
      color: var(--gk-muted);
    }

    /* BUTTONS & LINKS */
    .gk-btn-outline,
    .gk-btn-solid {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 9px;
      min-height: 48px;
      padding: 0 26px;
      border-radius: 999px;
      font-family: var(--gk-sans);
      font-size: 11px;
      font-weight: 500;
      letter-spacing: .14em;
      text-align: center;
      text-transform: uppercase;
      text-decoration: none;
      transition: background-color .25s ease, color .25s ease, border-color .25s ease;
    }

    .gk-btn-outline { border: 1px solid rgba(255,255,255,.3); color: #fff; }
    .gk-btn-outline:hover { background: #fff; border-color: #fff; color: var(--gk-bg); }

    .gk-btn-solid { border: 1px solid var(--gk-accent); background: var(--gk-accent); color: #fff; }
    .gk-btn-solid:hover { background: var(--gk-accent-hover); border-color: var(--gk-accent-hover); }

    .gk-btn-solid:focus-visible,
    .gk-btn-outline:focus-visible,
    .gk-text-link:focus-visible {
      outline: 2px solid var(--gk-accent-soft);
      outline-offset: 3px;
    }

    .gk-text-link {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      color: var(--gk-accent-soft);
      font-size: 12px;
      font-weight: 500;
      letter-spacing: .06em;
      text-decoration: none;
    }

    /* ABOUT */
    .gk-about-grid {
      display: grid;
      grid-template-columns: minmax(0, 1.05fr) minmax(0, .95fr);
      align-items: center;
      gap: clamp(32px, 5vw, 76px);
    }

    .gk-about-content,
    .gk-about-media { min-width: 0; }

    .gk-about-lead { margin-top: 22px; color: rgba(255,255,255,.82); }
    .gk-about-description { margin-top: 16px; }

    .gk-about-list {
      display: grid;
      gap: 13px;
      margin: 26px 0 0;
      padding: 0;
      list-style: none;
    }

    .gk-about-list li {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      font-size: 14px;
      font-weight: 300;
      line-height: 1.7;
      color: rgba(255,255,255,.78);
    }

    .gk-bullet {
      flex: 0 0 6px;
      width: 6px;
      height: 6px;
      margin-top: 9px;
      border-radius: 50%;
      background: var(--gk-accent-soft);
    }

    .gk-about-actions { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 30px; }

    .gk-about-image {
      position: relative;
      isolation: isolate;
      width: 100%;
      aspect-ratio: 4 / 4.5;
      overflow: hidden;
      background: #171513;
    }

    .gk-about-image img {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .gk-about-image-overlay {
      position: absolute;
      z-index: 1;
      inset: 35% 0 0;
      background: linear-gradient(to bottom, transparent, rgba(0,0,0,.65));
      pointer-events: none;
    }

    .gk-about-image-caption {
      position: absolute;
      z-index: 2;
      right: 24px;
      bottom: 25px;
      left: 24px;
    }

    .gk-about-image-caption span {
      display: block;
      margin-bottom: 9px;
      font-size: 10px;
      font-weight: 500;
      letter-spacing: .18em;
    }

    .gk-about-image-caption p {
      margin: 0;
      font-family: var(--gk-display);
      font-size: clamp(25px, 3vw, 38px);
      line-height: 1.15;
    }

    .gk-about-image-note { display: flex; align-items: flex-start; gap: 13px; margin-top: 17px; }
    .gk-about-note-line { flex: 0 0 30px; height: 1px; margin-top: 11px; background: var(--gk-accent-soft); }
    .gk-about-image-note p { max-width: 360px; margin: 0; font-size: 12px; line-height: 1.8; color: var(--gk-muted); }

    /* DESIGN PROCESS */
    .gk-process-heading { max-width: 720px; margin-bottom: 54px; }
    .gk-process-heading > .gk-body { max-width: 610px; margin-top: 18px; }

    .gk-process-grid {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      border-top: 1px solid var(--gk-border);
    }

    .gk-process-item { min-width: 0; padding: 26px 23px 12px 0; }
    .gk-process-item + .gk-process-item { padding-left: 23px; border-left: 1px solid var(--gk-border); }

    .gk-process-number {
      display: flex;
      align-items: center;
      gap: 14px;
      margin-bottom: 28px;
      color: var(--gk-accent-soft);
      font-size: 13px;
      letter-spacing: .08em;
    }
    .gk-process-number-line { width: 35px; height: 1px; background: var(--gk-accent); }

    .gk-process-item h3 {
      margin: 0 0 13px;
      font-family: var(--gk-display);
      font-size: clamp(22px, 2vw, 28px);
      font-weight: 500;
      line-height: 1.2;
    }

    .gk-process-item p { margin: 0; color: var(--gk-muted); font-size: 13px; font-weight: 300; line-height: 1.9; }

    .gk-process-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 20px;
      margin-top: 40px;
      padding-top: 22px;
      border-top: 1px solid var(--gk-border);
      color: rgba(255,255,255,.75);
      font-size: 13px;
    }

    /* WHY GOHAR */
    .gk-why-layout {
      display: grid;
      grid-template-columns: minmax(0, .85fr) minmax(0, 1.15fr);
      align-items: start;
      gap: clamp(40px, 6vw, 88px);
    }

    .gk-why-intro { position: sticky; top: 40px; }
    .gk-why-lead { margin-top: 20px; color: rgba(255,255,255,.82); }
    .gk-why-secondary { margin-top: 14px; }
    .gk-why-button { margin-top: 28px; }

    /* 2 x 2 grid on every screen size */
    .gk-benefits-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 16px;
    }

    .gk-benefit-card {
      display: flex;
      flex-direction: column;
      padding: 28px 26px 30px;
      background: rgba(255,255,255,.025);
      border: 1px solid var(--gk-border);
    }

    .gk-benefit-top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 28px;
    }

    .gk-benefit-icon { flex: 0 0 auto; color: var(--gk-accent-soft); }

    .gk-benefit-number {
      font-size: 12px;
      font-weight: 500;
      letter-spacing: .14em;
      color: rgba(255,255,255,.4);
    }

    .gk-benefit-card h3 {
      margin: 0 0 10px;
      font-family: var(--gk-display);
      font-size: clamp(23px, 2vw, 27px);
      font-weight: 500;
      line-height: 1.2;
    }

    .gk-benefit-card p {
      margin: 0;
      color: var(--gk-muted);
      font-size: 13px;
      font-weight: 300;
      line-height: 1.85;
    }

    /* BRAND PARTNERSHIPS */
    .gk-partnerships-heading { max-width: 780px; margin: 0 auto 48px; text-align: center; }
    .gk-partnerships-heading .gk-h2 { font-size: clamp(32px, 3.5vw, 50px); }
    .gk-partnerships-description { max-width: 650px; margin: 18px auto 0; font-size: 14px; line-height: 1.9; }

    .gk-brands-grid {
      display: grid;
      grid-template-columns: repeat(4, minmax(0, 1fr));
      align-items: center;
      gap: 38px;
    }

    .gk-brand-item { display: flex; align-items: center; justify-content: center; min-width: 0; }

    .gk-brand-logo {
      display: block;
      width: 100%;
      max-width: 210px;
      height: 110px;
      padding: 0;
      object-fit: contain;
      object-position: center;
      background: none;
      border: 0;
      border-radius: 0;
      box-shadow: none;
    }

    /* LARGE DESKTOP */
    @media (min-width: 1280px) {
      .gk-container { width: calc(100% - 100px); max-width: 1440px; }
      .gk-about-image { aspect-ratio: 4 / 4.3; }

      .gk-about-list { gap: 0; border-bottom: 1px solid var(--gk-border); }
      .gk-about-list li { align-items: center; padding: 13px 0; border-top: 1px solid var(--gk-border); }
      .gk-bullet { margin-top: 0; }

      .gk-brand-logo { height: 130px; }
    }

    /* TABLET */
    @media (max-width: 1023px) {
      .gk-about-grid { grid-template-columns: minmax(0, 1fr); gap: 32px; }
      .gk-about-image { aspect-ratio: 16 / 9; }

      .gk-process-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); border-top: none; }
      .gk-process-item { padding: 23px 20px 25px 0; border-top: 1px solid var(--gk-border); }
      .gk-process-item + .gk-process-item { padding-left: 20px; border-left: none; }
      .gk-process-item:nth-child(even) { padding-right: 0; padding-left: 20px; border-left: 1px solid var(--gk-border); }

      .gk-why-layout { grid-template-columns: minmax(0, 1fr); gap: 36px; }
      .gk-why-intro { position: static; max-width: 650px; }

      .gk-partnerships-heading { margin-bottom: 34px; }
      .gk-brands-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 28px 30px; }
      .gk-brand-logo { height: 100px; }
    }

    /* MOBILE */
    @media (max-width: 640px) {
      .gk-container { width: calc(100% - 32px); }
      .gk-h2 { font-size: clamp(30px, 8vw, 42px); line-height: 1.13; }
      .gk-body { font-size: 14px; line-height: 1.8; }
      .gk-eyebrow { font-size: 10px; letter-spacing: .19em; }
      .gk-eyebrow-line { flex-basis: 24px; width: 24px; }

      .gk-about-lead { margin-top: 18px; }
      .gk-about-description { margin-top: 13px; }
      .gk-about-list { gap: 12px; margin-top: 22px; }
      .gk-about-list li { gap: 10px; font-size: 13px; }
      .gk-about-actions { display: grid; grid-template-columns: minmax(0, 1fr); gap: 10px; margin-top: 25px; }
      .gk-about-actions a { width: 100%; }
      .gk-about-image { aspect-ratio: 4 / 4.3; }
      .gk-about-image-caption { right: 17px; bottom: 19px; left: 17px; }
      .gk-about-image-caption p { font-size: 28px; }

      .gk-process-heading { margin-bottom: 30px; }
      .gk-process-heading > .gk-body { margin-top: 14px; }
      .gk-process-grid { grid-template-columns: minmax(0, 1fr); }
      .gk-process-item,
      .gk-process-item + .gk-process-item,
      .gk-process-item:nth-child(even) { padding: 21px 0 23px; border-top: 1px solid var(--gk-border); border-left: none; }
      .gk-process-number { margin-bottom: 15px; }
      .gk-process-item h3 { margin-bottom: 8px; font-size: 25px; }
      .gk-process-footer { align-items: flex-start; flex-direction: column; gap: 12px; margin-top: 24px; padding-top: 20px; }

      .gk-why-layout { gap: 28px; }
      .gk-why-lead { margin-top: 15px; }
      .gk-why-button { width: 100%; margin-top: 22px; }

      /* still 2 x 2 on mobile (1 2 / 3 4) */
      .gk-benefits-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; }
      .gk-benefit-card { padding: 16px 14px 18px; }
      .gk-benefit-top { margin-bottom: 16px; }
      .gk-benefit-icon { width: 22px; height: 22px; }
      .gk-benefit-number { font-size: 10px; letter-spacing: .1em; }
      .gk-benefit-card h3 { margin-bottom: 7px; font-size: 19px; line-height: 1.2; }
      .gk-benefit-card p { font-size: 12px; line-height: 1.7; }

      .gk-partnerships-heading { margin-bottom: 26px; }
      .gk-partnerships-description { margin-top: 13px; font-size: 13px; line-height: 1.8; }
      .gk-brands-grid { column-gap: 14px; row-gap: 18px; }
      .gk-brand-logo { max-width: 160px; height: 80px; }
    }

    @media (max-width: 360px) {
      .gk-container { width: calc(100% - 26px); }
      .gk-h2 { font-size: 29px; }
      .gk-benefits-grid { gap: 8px; }
      .gk-benefit-card { padding: 14px 11px 16px; }
      .gk-benefit-card h3 { font-size: 17px; }
      .gk-benefit-card p { font-size: 11px; }
      .gk-brand-logo { height: 70px; }
    }

    @media (prefers-reduced-motion: reduce) {
      .gk-reveal { opacity: 1; transform: none; transition: none; }
    }
  `}</style>
);

/* =========================================================
   HOME EXTRAS
========================================================= */

const HomeExtras = () => (
  <>
    <Styles />
    <AboutSection />
    <DesignProcess />
    <WhyChooseGohar />
    <BrandPartnerships />
  </>
);

export default HomeExtras;