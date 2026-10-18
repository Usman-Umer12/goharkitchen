import { Link } from "react-router-dom";
import { ArrowRight, Hammer, Ruler, Users } from "lucide-react";

import kitchenImg from "../assets/kitchen1.webp";
import wardrobeImg from "../assets/word1.webp";
import mediaImg from "../assets/media1.webp";
import bedImg from "../assets/bed1.webp";

const IMAGES = {
  kitchen: kitchenImg,
  wardrobe: wardrobeImg,
  media: mediaImg,
  bed: bedImg,
};

const INTRO_POINTS = [
  {
    icon: Users,
    title: "Understanding Your Space",
    text: "Every project starts with understanding your requirements, preferences, available space and everyday lifestyle.",
  },
  {
    icon: Ruler,
    title: "Considered Design",
    text: "Contemporary style, practical functionality and carefully considered details come together in every interior.",
  },
  {
    icon: Hammer,
    title: "Skilled Manufacturing",
    text: "We create kitchens, wardrobes, bedroom furniture and media walls with attention to detail and quality.",
  },
];

const STATS = [
  { value: "04", label: "Interior Categories" },
  { value: "2D / 3D", label: "Design Visualisation" },
  { value: "01", label: "Coordinated Team" },
  { value: "Faisalabad", label: "Based In" },
];

const SPACES = [
  {
    number: "01",
    title: "Kitchens",
    text: "Modern kitchens designed around your space.",
    img: IMAGES.kitchen,
    to: "/kitchen",
  },
  {
    number: "02",
    title: "Wardrobes",
    text: "Custom storage with a refined finish.",
    img: IMAGES.wardrobe,
    to: "/wordrobe",
  },
  {
    number: "03",
    title: "Media Walls",
    text: "Distinctive designs for contemporary living.",
    img: IMAGES.media,
    to: "/media-walls",
  },
  {
    number: "04",
    title: "Bedroom Interiors",
    text: "Comfortable spaces with considered details.",
    img: IMAGES.bed,
    to: "/bedroom-walls",
  },
];

function Img({ src, alt, className = "" }) {
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      className={className}
      onError={(event) => {
        event.currentTarget.style.opacity = "0";
      }}
    />
  );
}

export default function AboutUs() {
  return (
    <main className="ab-page">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,500;1,600&family=Jost:wght@300;400;500;600;700&display=swap');

        .ab-page {
          --ab-bg: #0a0a0a;
          --ab-surface: #11100f;
          --ab-card: #151311;
          --ab-accent: #c0652b;
          --ab-accent-light: #e08a4f;
          --ab-white: #f7f4f0;
          --ab-muted: rgba(255,255,255,.66);
          --ab-border: rgba(255,255,255,.11);
          --ab-display: 'Cormorant Garamond', Georgia, serif;
          --ab-sans: 'Jost', Arial, sans-serif;

          width: 100%;
          overflow-x: clip;
          color: var(--ab-white);
          background: var(--ab-bg);
          font-family: var(--ab-sans);
        }

        .ab-page *,
        .ab-page *::before,
        .ab-page *::after {
          box-sizing: border-box;
        }

        .ab-page img {
          display: block;
          max-width: 100%;
        }

        .ab-page a {
          color: inherit;
        }

        .ab-wrap {
          width: 100%;
          max-width: 1600px;
          margin: 0 auto;
          padding-inline: clamp(20px, 5.2vw, 84px);
        }

        .ab-eyebrow {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          margin: 0;
          color: var(--ab-accent-light);
          font-size: 10px;
          font-weight: 500;
          letter-spacing: .24em;
          line-height: 1.7;
          text-transform: uppercase;
        }

        .ab-eyebrow::before {
          width: 28px;
          height: 1px;
          background: var(--ab-accent);
          content: "";
        }

        .ab-title,
        .ab-h2,
        .ab-h3 {
          font-family: var(--ab-display);
          font-weight: 500;
          letter-spacing: -.025em;
        }

        .ab-title {
          max-width: 1050px;
          margin: 23px auto 0;
          color: #fff;
          font-size: clamp(46px, 7.1vw, 100px);
          line-height: .99;
        }

        .ab-title em,
        .ab-h2 em {
          color: var(--ab-accent-light);
          font-weight: 500;
        }

        .ab-h2 {
          margin: 15px 0 0;
          color: #fff;
          font-size: clamp(36px, 4.2vw, 59px);
          line-height: 1.05;
        }

        .ab-h3 {
          margin: 0;
          color: #fff;
          font-size: 27px;
          line-height: 1.12;
        }

        .ab-body {
          margin: 0;
          color: var(--ab-muted);
          font-size: 14px;
          font-weight: 300;
          line-height: 1.9;
        }

        .ab-btn {
          display: inline-flex;
          min-height: 51px;
          align-items: center;
          justify-content: center;
          gap: 12px;
          padding: 0 25px;
          border: 1px solid transparent;
          border-radius: 2px;
          font-family: var(--ab-sans);
          font-size: 10px;
          font-weight: 500;
          letter-spacing: .12em;
          text-align: center;
          text-decoration: none;
          text-transform: uppercase;
          transition:
            background .25s ease,
            border-color .25s ease,
            color .25s ease;
        }

        .ab-btn svg {
          transition: transform .25s ease;
        }

        .ab-btn:hover svg {
          transform: translateX(4px);
        }

        .ab-btn-primary {
          border-color: var(--ab-accent);
          background: var(--ab-accent);
          color: #fff;
        }

        .ab-btn-primary:hover {
          border-color: var(--ab-accent-light);
          background: var(--ab-accent-light);
          color: #fff;
        }

        /* HERO */

        .ab-hero {
          position: relative;
          isolation: isolate;
          display: flex;
          min-height: 510px;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          padding: 120px 0 90px;
          background: #100e0c;
          text-align: center;
        }

        .ab-hero-img {
          position: absolute;
          z-index: -3;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center 54%;
          opacity: .45;
        }

        .ab-hero-shade {
          position: absolute;
          z-index: -2;
          inset: 0;
          background:
            linear-gradient(
              90deg,
              rgba(10,10,10,.7),
              rgba(10,10,10,.34) 50%,
              rgba(10,10,10,.7)
            ),
            linear-gradient(
              180deg,
              rgba(10,10,10,.3),
              rgba(10,10,10,.45) 55%,
              #0a0a0a 100%
            );
        }

        .ab-hero-grid {
          position: absolute;
          z-index: -1;
          inset: 0;
          pointer-events: none;
          background-image: linear-gradient(
            90deg,
            transparent calc(100% - 1px),
            rgba(255,255,255,.055) calc(100% - 1px)
          );
          background-size: 25% 100%;
          mask-image: linear-gradient(
            180deg,
            transparent,
            #000 20%,
            #000 80%,
            transparent
          );
        }

        .ab-hero-inner {
          width: 100%;
          max-width: 1150px;
          margin: auto;
          padding-inline: 22px;
        }

        .ab-hero .ab-title {
          text-shadow: 0 2px 30px rgba(0,0,0,.25);
        }

        .ab-hero-text {
          max-width: 570px;
          margin: 23px auto 0;
          color: rgba(255,255,255,.79);
          font-size: 15px;
          line-height: 1.9;
        }

        .ab-hero-bottom {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          margin-top: 33px;
          color: rgba(255,255,255,.6);
          font-size: 9px;
          font-weight: 500;
          letter-spacing: .2em;
          text-transform: uppercase;
        }

        .ab-hero-bottom::before,
        .ab-hero-bottom::after {
          width: 35px;
          height: 1px;
          background: var(--ab-accent);
          content: "";
        }

        /* ABOUT INTRODUCTION */

        .ab-intro-section {
          padding-block: 100px;
        }

        .ab-intro {
          display: grid;
          grid-template-columns: minmax(0, .95fr) minmax(0, 1.05fr);
          align-items: center;
          gap: clamp(38px, 7vw, 100px);
        }

        .ab-intro-copy {
          min-width: 0;
        }

        .ab-intro-copy .ab-h2 {
          max-width: 520px;
        }

        .ab-divider {
          width: 55px;
          height: 2px;
          margin: 25px 0;
          background: var(--ab-accent);
        }

        .ab-intro-description {
          display: grid;
          gap: 14px;
          max-width: 530px;
        }

        .ab-intro-image {
          position: relative;
          min-width: 0;
          padding: 0 0 20px 20px;
        }

        .ab-intro-image::before {
          position: absolute;
          top: -15px;
          right: -12px;
          bottom: 38px;
          left: 38px;
          border: 1px solid rgba(192,101,43,.48);
          content: "";
        }

        .ab-image-frame {
          position: relative;
          overflow: hidden;
          aspect-ratio: 4 / 4.5;
          background: #191614;
        }

        .ab-image-frame img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform .7s ease;
        }

        .ab-intro-image:hover .ab-image-frame img {
          transform: scale(1.035);
        }

        .ab-image-caption {
          position: absolute;
          right: -1px;
          bottom: 0;
          display: flex;
          width: min(88%, 360px);
          align-items: center;
          gap: 16px;
          padding: 21px 24px;
          border: 1px solid rgba(255,255,255,.08);
          background: #171412;
        }

        .ab-caption-line {
          width: 2px;
          height: 37px;
          flex: 0 0 auto;
          background: var(--ab-accent);
        }

        .ab-caption-title {
          margin: 0;
          color: #fff;
          font-family: var(--ab-display);
          font-size: 22px;
          line-height: 1.1;
        }

        .ab-caption-text {
          margin: 5px 0 0;
          color: rgba(255,255,255,.55);
          font-size: 9px;
          letter-spacing: .11em;
          text-transform: uppercase;
        }

        .ab-intro-features {
          display: grid;
          gap: 0;
          margin-top: 29px;
          border-top: 1px solid var(--ab-border);
        }

        .ab-feature {
          display: flex;
          align-items: flex-start;
          gap: 16px;
          padding: 19px 0;
          border-bottom: 1px solid var(--ab-border);
        }

        .ab-feature-icon {
          display: flex;
          width: 43px;
          height: 43px;
          flex: 0 0 auto;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(192,101,43,.35);
          background: rgba(192,101,43,.08);
          color: var(--ab-accent-light);
        }

        .ab-feature h3 {
          margin: 1px 0 5px;
          color: #fff;
          font-size: 13px;
          font-weight: 500;
        }

        .ab-feature p {
          max-width: 440px;
          margin: 0;
          color: rgba(255,255,255,.58);
          font-size: 12px;
          font-weight: 300;
          line-height: 1.8;
        }

        .ab-intro-action {
          margin-top: 27px;
        }

        /* STATS */

        .ab-stats-section {
          border-top: 1px solid var(--ab-border);
          border-bottom: 1px solid var(--ab-border);
          background: #100f0e;
        }

        .ab-stats {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
        }

        .ab-stat {
          display: flex;
          min-height: 135px;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 24px 15px;
          text-align: center;
        }

        .ab-stat + .ab-stat {
          border-left: 1px solid var(--ab-border);
        }

        .ab-stat-value {
          margin: 0;
          color: var(--ab-accent-light);
          font-family: var(--ab-display);
          font-size: clamp(27px, 3vw, 39px);
          font-weight: 500;
          line-height: 1.15;
          overflow-wrap: anywhere;
        }

        .ab-stat-label {
          margin: 10px 0 0;
          color: rgba(255,255,255,.55);
          font-size: 9px;
          font-weight: 500;
          letter-spacing: .12em;
          line-height: 1.7;
          text-transform: uppercase;
        }

        /* INTERIOR COLLECTIONS */

        .ab-spaces-section {
          padding-block: 100px 110px;
        }

        .ab-section-heading {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 30px;
          margin-bottom: 39px;
        }

        .ab-section-heading .ab-h2 {
          max-width: 650px;
        }

        .ab-section-description {
          max-width: 300px;
          padding-bottom: 5px;
        }

        .ab-spaces-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 17px;
        }

        .ab-space {
          position: relative;
          display: block;
          min-width: 0;
          overflow: hidden;
          border: 1px solid var(--ab-border);
          background: var(--ab-card);
          text-decoration: none;
        }

        .ab-space-image {
          position: relative;
          overflow: hidden;
          aspect-ratio: 3 / 4;
          background: #1b1714;
        }

        .ab-space-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform .65s ease;
        }

        .ab-space:hover .ab-space-image img {
          transform: scale(1.055);
        }

        .ab-space-image::after {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            180deg,
            rgba(0,0,0,.03) 25%,
            rgba(0,0,0,.14) 48%,
            rgba(0,0,0,.77) 100%
          );
          content: "";
        }

        .ab-space-number {
          position: absolute;
          z-index: 1;
          top: 15px;
          left: 15px;
          display: flex;
          width: 37px;
          height: 37px;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(255,255,255,.4);
          background: rgba(10,10,10,.35);
          color: #fff;
          font-size: 10px;
          letter-spacing: .06em;
          backdrop-filter: blur(8px);
        }

        .ab-space-info {
          position: absolute;
          z-index: 2;
          right: 0;
          bottom: 0;
          left: 0;
          padding: 23px 19px;
        }

        .ab-space-title {
          margin: 0;
          color: #fff;
          font-family: var(--ab-display);
          font-size: clamp(22px, 2.1vw, 30px);
          font-weight: 500;
          line-height: 1.12;
        }

        .ab-space-text {
          min-height: 40px;
          margin: 9px 0 17px;
          color: rgba(255,255,255,.73);
          font-size: 11px;
          font-weight: 300;
          line-height: 1.8;
        }

        .ab-space-link {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          padding-top: 13px;
          border-top: 1px solid rgba(255,255,255,.3);
          color: var(--ab-accent-light);
          font-size: 9px;
          font-weight: 500;
          letter-spacing: .13em;
          text-transform: uppercase;
        }

        .ab-space-link svg {
          transition: transform .25s ease;
        }

        .ab-space:hover .ab-space-link svg {
          transform: translateX(4px);
        }

        .ab-page a:focus-visible {
          outline: 2px solid var(--ab-accent-light);
          outline-offset: 4px;
        }

        /* RESPONSIVE */

        @media (max-width: 1100px) {
          .ab-intro-section,
          .ab-spaces-section {
            padding-block: 75px;
          }

          .ab-intro {
            gap: 42px;
          }

          .ab-spaces-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 18px;
          }

          .ab-space-image {
            aspect-ratio: 4 / 4.5;
          }

          .ab-space-title {
            font-size: 29px;
          }

          .ab-space-info {
            padding: 24px;
          }
        }

        @media (max-width: 700px) {
          .ab-wrap {
            padding-inline: 21px;
          }

          .ab-hero {
            min-height: 440px;
            padding: 105px 0 72px;
          }

          .ab-title {
            font-size: clamp(43px, 11vw, 66px);
            line-height: 1.01;
          }

          .ab-hero-text {
            max-width: 440px;
            margin-top: 20px;
            font-size: 13px;
            line-height: 1.85;
          }

          .ab-hero-bottom {
            margin-top: 25px;
            font-size: 8px;
          }

          .ab-intro-section {
            padding-block: 62px 70px;
          }

          .ab-intro {
            grid-template-columns: minmax(0, 1fr);
            gap: 39px;
          }

          .ab-h2 {
            font-size: clamp(37px, 8.7vw, 49px);
          }

          .ab-body {
            font-size: 13px;
          }

          .ab-divider {
            margin-block: 21px;
          }

          .ab-intro-image {
            width: 100%;
            max-width: 530px;
            margin-inline: auto;
            padding-left: 13px;
          }

          .ab-intro-image::before {
            top: -9px;
            right: -6px;
            bottom: 27px;
            left: 24px;
          }

          .ab-image-frame {
            aspect-ratio: 4 / 4.2;
          }

          .ab-image-caption {
            width: min(88%, 315px);
            padding: 16px 17px;
          }

          .ab-caption-title {
            font-size: 20px;
          }

          .ab-feature {
            gap: 13px;
            padding-block: 17px;
          }

          .ab-feature-icon {
            width: 39px;
            height: 39px;
          }

          .ab-feature p {
            font-size: 11.5px;
          }

          .ab-btn {
            min-height: 49px;
            padding-inline: 20px;
            font-size: 9px;
          }

          .ab-stats {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .ab-stat {
            min-height: 115px;
            padding: 19px 10px;
          }

          .ab-stat:nth-child(3) {
            border-left: 0;
          }

          .ab-stat:nth-child(n+3) {
            border-top: 1px solid var(--ab-border);
          }

          .ab-stat-value {
            font-size: clamp(27px, 7vw, 35px);
          }

          .ab-stat-label {
            max-width: 145px;
            font-size: 8px;
          }

          .ab-spaces-section {
            padding-block: 65px 75px;
          }

          .ab-section-heading {
            display: block;
            margin-bottom: 27px;
          }

          .ab-section-description {
            max-width: 390px;
            margin-top: 15px;
          }

          .ab-spaces-grid {
            gap: 11px;
          }

          .ab-space-image {
            aspect-ratio: 3 / 4.2;
          }

          .ab-space-number {
            top: 9px;
            left: 9px;
            width: 29px;
            height: 29px;
            font-size: 9px;
          }

          .ab-space-info {
            padding: 13px 11px;
          }

          .ab-space-title {
            font-size: clamp(20px, 5.4vw, 26px);
          }

          .ab-space-text {
            min-height: 54px;
            margin: 7px 0 12px;
            font-size: 10px;
            line-height: 1.65;
          }

          .ab-space-link {
            padding-top: 10px;
            font-size: 8px;
            letter-spacing: .07em;
          }
        }

        @media (max-width: 360px) {
          .ab-wrap {
            padding-inline: 16px;
          }

          .ab-space-info {
            padding: 10px 8px;
          }

          .ab-space-title {
            font-size: 19px;
          }

          .ab-space-text {
            font-size: 9px;
          }

          .ab-space-link {
            font-size: 7px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .ab-page *,
          .ab-page *::before,
          .ab-page *::after {
            scroll-behavior: auto !important;
            transition-duration: .01ms !important;
            animation-duration: .01ms !important;
          }
        }
      `}</style>

      {/* HERO */}
      <section className="ab-hero">
        <Img
          src={IMAGES.kitchen}
          alt=""
          className="ab-hero-img"
        />

        <div className="ab-hero-shade" />
        <div className="ab-hero-grid" />

        <div className="ab-hero-inner">
          <p className="ab-eyebrow">About Gohar</p>

          <h1 className="ab-title">
            Thoughtful Interiors,
            <br />
            <em>Beautiful Living.</em>
          </h1>

          <p className="ab-hero-text">
            We create carefully considered interiors that bring together
            contemporary design, everyday functionality and quality
            craftsmanship.
          </p>

          <div className="ab-hero-bottom">
            Design · Craftsmanship · Detail
          </div>
        </div>
      </section>

      {/* WHO WE ARE */}
      <section className="ab-intro-section">
        <div className="ab-wrap">
          <div className="ab-intro">
            <div className="ab-intro-copy">
              <p className="ab-eyebrow">Who We Are</p>

              <h2 className="ab-h2">
                Designed with purpose.
                <br />
                <em>Made with care.</em>
              </h2>

              <div className="ab-divider" />

              <div className="ab-intro-description">
                <p className="ab-body">
                  At Gohar, we believe a beautiful interior should do more
                  than look impressive. It should feel welcoming, work
                  effortlessly and reflect the people who live in it.
                </p>

                <p className="ab-body">
                  From modern kitchens and custom wardrobes to bedroom
                  furniture and statement media walls, we create interiors
                  that balance contemporary style with practical living.
                </p>

                <p className="ab-body">
                  Every space deserves thoughtful planning, carefully
                  considered details and a finish that feels right at home.
                </p>
              </div>

              <div className="ab-intro-features">
                {INTRO_POINTS.map(({ icon: Icon, title, text }) => (
                  <article className="ab-feature" key={title}>
                    <span className="ab-feature-icon">
                      <Icon size={19} strokeWidth={1.5} />
                    </span>

                    <div>
                      <h3>{title}</h3>
                      <p>{text}</p>
                    </div>
                  </article>
                ))}
              </div>

              <div className="ab-intro-action">
                <Link to="/contact" className="ab-btn ab-btn-primary">
                  Discuss Your Project
                  <ArrowRight size={15} strokeWidth={1.7} />
                </Link>
              </div>
            </div>

            <div className="ab-intro-image">
              <div className="ab-image-frame">
                <Img
                  src={IMAGES.kitchen}
                  alt="Contemporary kitchen interior by Gohar"
                />
              </div>

              <div className="ab-image-caption">
                <span className="ab-caption-line" />

                <div>
                  <h3 className="ab-caption-title">
                    Made for the way you live.
                  </h3>

                  <p className="ab-caption-text">
                    Thoughtful design, lasting appeal
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* KEY INFORMATION */}
      <section className="ab-stats-section">
        <div className="ab-wrap">
          <div className="ab-stats">
            {STATS.map((item) => (
              <div className="ab-stat" key={item.label}>
                <p className="ab-stat-value">{item.value}</p>
                <p className="ab-stat-label">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* OUR INTERIOR COLLECTIONS */}
      <section className="ab-spaces-section">
        <div className="ab-wrap">
          <div className="ab-section-heading">
            <div>
              <p className="ab-eyebrow">What We Create</p>

              <h2 className="ab-h2">
                Spaces that feel
                <br />
                <em>uniquely yours.</em>
              </h2>
            </div>

            <p className="ab-body ab-section-description">
              Explore our interior collections, created to bring style,
              functionality and character into your home.
            </p>
          </div>

          <div className="ab-spaces-grid">
            {SPACES.map((space) => (
              <Link
                to={space.to}
                className="ab-space"
                key={space.title}
              >
                <div className="ab-space-image">
                  <Img
                    src={space.img}
                    alt={`${space.title} interior by Gohar`}
                  />
                </div>

                <span className="ab-space-number">
                  {space.number}
                </span>

                <div className="ab-space-info">
                  <h3 className="ab-space-title">
                    {space.title}
                  </h3>

                  <p className="ab-space-text">
                    {space.text}
                  </p>

                  <span className="ab-space-link">
                    Explore Collection
                    <ArrowRight size={14} strokeWidth={1.6} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}