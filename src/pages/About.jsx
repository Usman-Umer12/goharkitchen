
import { Link } from "react-router-dom";

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

const STATS = [
  { value: "04", label: "Interior Categories" },
  { value: "2D / 3D", label: "Design Visualisation" },
  { value: "Custom", label: "Made for Your Space" },
  { value: "Pakistan", label: "Service Coverage" },
];

const INTRO_POINTS = [
  {
    number: "01",
    title: "Understanding Your Space",
    text: "Every project begins with your requirements, lifestyle, preferences and available space.",
  },
  {
    number: "02",
    title: "Thoughtful Design",
    text: "We balance modern aesthetics, practical functionality and carefully considered details.",
  },
  {
    number: "03",
    title: "Attention to Craft",
    text: "We focus on material selection, finishing and the details that bring a design together.",
  },
];

const ECOSYSTEM = [
  {
    number: "01",
    title: "Coordinated Design",
    text: "A consistent design direction connects your kitchen, wardrobes and living spaces.",
  },
  {
    number: "02",
    title: "Considered Materials",
    text: "Colours, textures and finishes are selected to complement your interior.",
  },
  {
    number: "03",
    title: "Practical Functionality",
    text: "Layouts and storage are planned around the way you use your home every day.",
  },
  {
    number: "04",
    title: "Careful Execution",
    text: "Each stage receives attention, from the initial plan to the finishing details.",
  },
];

const JOURNEY = [
  {
    step: "01",
    title: "Consultation",
    text: "We discuss your ideas, requirements, preferred style and budget.",
  },
  {
    step: "02",
    title: "Site Measurement",
    text: "Measurements help us plan a layout around your available space.",
  },
  {
    step: "03",
    title: "Design & Visualisation",
    text: "Review the proposed layout, colours and finishes before production.",
  },
  {
    step: "04",
    title: "Manufacturing",
    text: "Your custom interior is prepared with attention to detail and finishing.",
  },
  {
    step: "05",
    title: "Installation",
    text: "The planned components are installed and aligned within your space.",
  },
  {
    step: "06",
    title: "Final Review",
    text: "We review the completed work and address the final project details.",
  },
];

const STANDARDS = [
  {
    value: "01",
    label: "Personalised Design",
    text: "Solutions shaped around your space, taste and requirements.",
  },
  {
    value: "04",
    label: "Interior Categories",
    text: "Kitchens, wardrobes, bedroom interiors and media walls.",
  },
  {
    value: "06",
    label: "Structured Stages",
    text: "A clear project journey from consultation to final review.",
  },
];

const SPACES = [
  {
    number: "01",
    title: "Kitchens",
    text: "Functional layouts with a refined, modern finish.",
    img: IMAGES.kitchen,
    to: "/kitchen",
  },
  {
    number: "02",
    title: "Wardrobes",
    text: "Thoughtful storage designed for everyday living.",
    img: IMAGES.wardrobe,
    to: "/wordrobe",
  },
  {
    number: "03",
    title: "Media Walls",
    text: "Contemporary focal points for modern living spaces.",
    img: IMAGES.media,
    to: "/media-walls",
  },
  {
    number: "04",
    title: "Bedroom Interiors",
    text: "Comfortable spaces with coordinated details.",
    img: IMAGES.bed,
    to: "/bedroom-walls",
  },
];

function Img({ src, alt, className = "", priority = false }) {
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
    />
  );
}

function Eyebrow({ children }) {
  return <p className="ab-eyebrow">{children}</p>;
}

function SectionTitle({ eyebrow, children, description, centered = false }) {
  return (
    <div className={`ab-section-title${centered ? " is-centered" : ""}`}>
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 className="ab-h2">{children}</h2>
      {description && <p className="ab-body">{description}</p>}
    </div>
  );
}

export default function AboutUs() {
  return (
    <main className="ab-page">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Jost:wght@400;500;600;700&display=swap');

        .ab-page {
          --ab-bg: #0a0a09;
          --ab-surface: #11100f;
          --ab-card: #171513;
          --ab-accent: #c0652b;
          --ab-accent-light: #e08a4f;
          --ab-white: #f8f6f3;
          --ab-muted: #b8b1a9;
          --ab-border: rgba(255,255,255,.11);
          --ab-display: 'Cormorant Garamond', Georgia, serif;
          --ab-sans: 'Jost', Arial, sans-serif;

          width: 100%;
          margin: 0;
          overflow: clip;
          color: var(--ab-white);
          background: var(--ab-bg);
          font-family: var(--ab-sans);
          font-size: 14px;
          font-weight: 400;
          line-height: 1.7;
        }

        .ab-page *,
        .ab-page *::before,
        .ab-page *::after {
          box-sizing: border-box;
        }

        .ab-page img {
          display: block;
          width: 100%;
          max-width: 100%;
        }

        .ab-page a {
          color: inherit;
          text-decoration: none;
        }

        .ab-page h1,
        .ab-page h2,
        .ab-page h3,
        .ab-page p {
          overflow-wrap: anywhere;
        }

        .ab-wrap {
          width: 100%;
          max-width: 1440px;
          margin-inline: auto;
          padding-inline: clamp(20px, 5vw, 76px);
        }

        .ab-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          margin: 0;
          color: var(--ab-accent-light);
          font-size: 10px;
          font-weight: 600;
          letter-spacing: .17em;
          line-height: 1.6;
          text-transform: uppercase;
        }

        .ab-eyebrow::before {
          width: 24px;
          height: 1px;
          flex: 0 0 auto;
          background: var(--ab-accent);
          content: "";
        }

        .ab-title,
        .ab-h2 {
          margin: 0;
          color: var(--ab-white);
          font-family: var(--ab-display);
          font-weight: 500;
          letter-spacing: -.025em;
          line-height: 1.04;
        }

        .ab-title {
          max-width: 760px;
          font-size: clamp(44px, 6.1vw, 82px);
        }

        .ab-h2 {
          margin-top: 14px;
          font-size: clamp(34px, 4vw, 53px);
        }

        .ab-title em,
        .ab-h2 em {
          color: var(--ab-accent-light);
          font-style: normal;
        }

        .ab-body {
          margin: 0;
          color: var(--ab-muted);
          font-size: 14px;
          font-weight: 400;
          line-height: 1.9;
        }

        .ab-body strong {
          color: var(--ab-white);
          font-weight: 500;
        }

        .ab-section-title {
          max-width: 700px;
        }

        .ab-section-title .ab-body {
          max-width: 520px;
          margin-top: 18px;
        }

        .ab-section-title.is-centered {
          margin-inline: auto;
          text-align: center;
        }

        .ab-section-title.is-centered .ab-eyebrow {
          justify-content: center;
        }

        .ab-section-title.is-centered .ab-body {
          margin-inline: auto;
        }

        .ab-btn {
          display: inline-flex;
          min-height: 48px;
          align-items: center;
          justify-content: center;
          gap: 14px;
          padding: 0 24px;
          border: 1px solid var(--ab-accent);
          border-radius: 0;
          background: var(--ab-accent);
          color: #fff !important;
          font-family: var(--ab-sans);
          font-size: 12px;
          font-weight: 600;
          letter-spacing: .04em;
          transition: background .2s ease, border-color .2s ease;
        }

        .ab-btn::after {
          content: "↗";
          font-size: 16px;
          line-height: 1;
        }

        .ab-btn:hover {
          border-color: var(--ab-accent-light);
          background: #a95320;
        }

        .ab-page a:focus-visible {
          outline: 2px solid var(--ab-accent-light);
          outline-offset: 4px;
        }

        /* HERO */

        .ab-hero {
          position: relative;
          isolation: isolate;
          display: flex;
          min-height: 590px;
          align-items: center;
          padding-block: 130px 85px;
          background: #100e0c;
        }

        .ab-hero-img {
          position: absolute;
          z-index: -3;
          inset: 0;
          height: 100%;
          object-fit: cover;
          object-position: center 53%;
          opacity: .68;
        }

        .ab-hero-shade {
          position: absolute;
          z-index: -2;
          inset: 0;
          background:
            linear-gradient(90deg, rgba(8,8,8,.94) 0%, rgba(8,8,8,.78) 42%, rgba(8,8,8,.2) 100%),
            linear-gradient(0deg, var(--ab-bg) 0%, transparent 32%);
        }

        .ab-hero-content {
          width: 100%;
        }

        .ab-hero .ab-title {
          margin-top: 22px;
        }

        .ab-hero-text {
          max-width: 520px;
          margin: 23px 0 0;
          color: #e0d9d1;
          font-size: 15px;
          line-height: 1.9;
        }

        .ab-hero-bottom {
          display: flex;
          align-items: center;
          gap: 11px;
          margin-top: 27px;
          color: #fff;
          font-size: 10px;
          font-weight: 600;
          letter-spacing: .16em;
          text-transform: uppercase;
        }

        .ab-hero-bottom::before {
          width: 28px;
          height: 1px;
          background: var(--ab-accent-light);
          content: "";
        }

        /* STATS */

        .ab-stats-section {
          border-top: 1px solid var(--ab-border);
          border-bottom: 1px solid var(--ab-border);
          background: #11100f;
        }

        .ab-stats {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
        }

        .ab-stat {
          min-width: 0;
          padding: 27px 20px;
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
          font-weight: 600;
          line-height: 1.15;
        }

        .ab-stat-label {
          margin: 8px 0 0;
          color: #d3ccc4;
          font-size: 10px;
          font-weight: 500;
          letter-spacing: .09em;
          line-height: 1.6;
          text-transform: uppercase;
        }

        /* INTRO */

        .ab-intro-section {
          padding-block: 100px;
        }

        .ab-intro {
          display: grid;
          grid-template-columns: minmax(0, .92fr) minmax(0, 1.08fr);
          align-items: center;
          gap: clamp(38px, 7vw, 100px);
        }

        .ab-intro-image,
        .ab-intro-copy {
          min-width: 0;
        }

        .ab-intro-image {
          position: relative;
          padding: 0 18px 18px 0;
        }

        .ab-intro-image::before {
          position: absolute;
          top: 18px;
          right: 0;
          bottom: 0;
          left: 18px;
          border: 1px solid rgba(192,101,43,.6);
          content: "";
        }

        .ab-image-frame {
          position: relative;
          overflow: hidden;
          aspect-ratio: 4 / 4.5;
          background: #1a1714;
        }

        .ab-image-frame img {
          height: 100%;
          object-fit: cover;
          object-position: center;
        }

        .ab-image-caption {
          position: absolute;
          right: 0;
          bottom: 35px;
          left: -1px;
          display: flex;
          width: min(92%, 360px);
          align-items: center;
          gap: 15px;
          padding: 17px 20px;
          border: 1px solid rgba(255,255,255,.08);
          background: #151310;
        }

        .ab-caption-line {
          width: 2px;
          height: 43px;
          flex: 0 0 auto;
          background: var(--ab-accent);
        }

        .ab-caption-title {
          margin: 0;
          color: #fff;
          font-family: var(--ab-display);
          font-size: 22px;
          font-weight: 600;
          line-height: 1.2;
        }

        .ab-caption-text {
          margin: 5px 0 0;
          color: var(--ab-accent-light);
          font-size: 9px;
          font-weight: 600;
          letter-spacing: .1em;
          text-transform: uppercase;
        }

        .ab-intro-copy .ab-h2 {
          margin-top: 17px;
        }

        .ab-divider {
          width: 44px;
          height: 2px;
          margin: 22px 0;
          background: var(--ab-accent);
        }

        .ab-intro-description {
          display: grid;
          gap: 12px;
        }

        .ab-intro-description .ab-body:first-child {
          color: #eee8e1;
        }

        .ab-intro-features {
          display: grid;
          margin-top: 26px;
          border-top: 1px solid var(--ab-border);
        }

        .ab-feature {
          display: grid;
          grid-template-columns: 35px minmax(0, 1fr);
          gap: 12px;
          padding: 18px 0;
          border-bottom: 1px solid var(--ab-border);
        }

        .ab-feature-number {
          padding-top: 2px;
          color: var(--ab-accent-light);
          font-size: 11px;
          font-weight: 600;
        }

        .ab-feature h3 {
          margin: 0 0 5px;
          color: #fff;
          font-size: 14px;
          font-weight: 600;
        }

        .ab-feature p {
          margin: 0;
          color: var(--ab-muted);
          font-size: 13px;
          line-height: 1.8;
        }

        .ab-intro-action {
          margin-top: 25px;
        }

        /* WHOLE-HOME APPROACH */

        .ab-eco-section {
          padding-block: 90px;
          border-top: 1px solid var(--ab-border);
          border-bottom: 1px solid var(--ab-border);
          background: var(--ab-surface);
        }

        .ab-eco {
          display: grid;
          grid-template-columns: minmax(0, .85fr) minmax(0, 1.15fr);
          align-items: start;
          gap: clamp(35px, 7vw, 100px);
        }

        .ab-eco-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          border-top: 1px solid var(--ab-border);
          border-left: 1px solid var(--ab-border);
        }

        .ab-eco-item {
          min-width: 0;
          padding: 26px 24px;
          border-right: 1px solid var(--ab-border);
          border-bottom: 1px solid var(--ab-border);
          background: var(--ab-card);
        }

        .ab-eco-number {
          display: block;
          margin-bottom: 20px;
          color: var(--ab-accent-light);
          font-size: 10px;
          font-weight: 600;
          letter-spacing: .1em;
        }

        .ab-eco-item h3 {
          margin: 0 0 8px;
          color: #fff;
          font-family: var(--ab-display);
          font-size: 24px;
          font-weight: 600;
          line-height: 1.2;
        }

        .ab-eco-item p {
          margin: 0;
          color: var(--ab-muted);
          font-size: 13px;
          line-height: 1.8;
        }

        /* PROCESS */

        .ab-journey-section {
          padding-block: 100px;
        }

        .ab-journey-layout {
          display: grid;
          grid-template-columns: minmax(0, .85fr) minmax(0, 1.15fr);
          align-items: start;
          gap: clamp(40px, 8vw, 110px);
        }

        .ab-journey-head {
          position: sticky;
          top: 100px;
        }

        .ab-journey {
          border-top: 1px solid var(--ab-border);
        }

        .ab-step {
          display: grid;
          grid-template-columns: 55px minmax(0, 1fr);
          align-items: start;
          gap: 12px;
          padding: 22px 0;
          border-bottom: 1px solid var(--ab-border);
        }

        .ab-step-number {
          color: var(--ab-accent-light);
          font-family: var(--ab-display);
          font-size: 31px;
          font-weight: 600;
          line-height: 1;
        }

        .ab-step h3 {
          margin: 0 0 7px;
          color: #fff;
          font-size: 15px;
          font-weight: 600;
        }

        .ab-step p {
          margin: 0;
          color: var(--ab-muted);
          font-size: 13px;
          line-height: 1.8;
        }

        /* STANDARDS */

        .ab-standards-section {
          padding-block: 90px;
          border-top: 1px solid var(--ab-border);
          background: #0e0d0c;
        }

        .ab-standards-head {
          margin-bottom: 38px;
        }

        .ab-standards {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          border-top: 1px solid var(--ab-border);
          border-left: 1px solid var(--ab-border);
        }

        .ab-standard {
          min-width: 0;
          padding: 30px 25px;
          border-right: 1px solid var(--ab-border);
          border-bottom: 1px solid var(--ab-border);
          background: var(--ab-card);
        }

        .ab-standard-value {
          margin: 0;
          color: var(--ab-accent-light);
          font-family: var(--ab-display);
          font-size: 43px;
          font-weight: 600;
          line-height: 1.1;
        }

        .ab-standard-label {
          margin: 13px 0 7px;
          color: #fff;
          font-size: 14px;
          font-weight: 600;
        }

        .ab-standard-text {
          margin: 0;
          color: var(--ab-muted);
          font-size: 13px;
          line-height: 1.8;
        }

        /* COLLECTIONS */

        .ab-spaces-section {
          padding-block: 100px;
        }

        .ab-section-heading {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 30px;
          margin-bottom: 36px;
        }

        .ab-section-description {
          max-width: 390px;
          padding-bottom: 5px;
        }

        .ab-spaces-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 18px;
        }

        .ab-space {
          display: block;
          min-width: 0;
        }

        .ab-space-image {
          position: relative;
          overflow: hidden;
          aspect-ratio: 3 / 3.8;
          background: #1b1714;
        }

        .ab-space-image img {
          height: 100%;
          object-fit: cover;
          transition: transform .45s ease;
        }

        .ab-space:hover .ab-space-image img {
          transform: scale(1.035);
        }

        .ab-space-number {
          position: absolute;
          top: 0;
          left: 0;
          display: grid;
          width: 37px;
          height: 37px;
          place-items: center;
          background: var(--ab-accent);
          color: #fff;
          font-size: 10px;
          font-weight: 600;
        }

        .ab-space-info {
          padding-top: 16px;
          border-top: 1px solid var(--ab-border);
        }

        .ab-space-title {
          margin: 0;
          color: #fff;
          font-family: var(--ab-display);
          font-size: 25px;
          font-weight: 600;
          line-height: 1.2;
        }

        .ab-space-text {
          min-height: 46px;
          margin: 8px 0 13px;
          color: var(--ab-muted);
          font-size: 13px;
          line-height: 1.8;
        }

        .ab-space-link {
          display: inline-flex;
          align-items: center;
          gap: 9px;
          color: var(--ab-accent-light);
          font-size: 10px;
          font-weight: 600;
          letter-spacing: .09em;
          text-transform: uppercase;
        }

        .ab-space-link::after {
          content: "↗";
          font-size: 15px;
          transition: transform .2s ease;
        }

        .ab-space:hover .ab-space-link {
          color: #fff;
        }

        .ab-space:hover .ab-space-link::after {
          transform: translate(2px, -2px);
        }

        /* TABLET */

        @media (max-width: 1000px) {
          .ab-hero {
            min-height: 520px;
          }

          .ab-intro-section,
          .ab-eco-section,
          .ab-journey-section,
          .ab-standards-section,
          .ab-spaces-section {
            padding-block: 70px;
          }

          .ab-intro {
            grid-template-columns: minmax(0, .9fr) minmax(0, 1.1fr);
            gap: 34px;
          }

          .ab-eco,
          .ab-journey-layout {
            grid-template-columns: minmax(0, 1fr);
            gap: 30px;
          }

          .ab-journey-head {
            position: static;
          }

          .ab-spaces-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 30px 18px;
          }

          .ab-space-image {
            aspect-ratio: 4 / 4.3;
          }

          .ab-space-text {
            min-height: 0;
          }
        }

        /* MOBILE */

        @media (max-width: 640px) {
          .ab-wrap {
            padding-inline: 18px;
          }

          .ab-hero {
            min-height: 440px;
            padding-block: 110px 60px;
          }

          .ab-hero-img {
            object-position: 57% center;
          }

          .ab-hero-shade {
            background:
              linear-gradient(90deg, rgba(8,8,8,.91), rgba(8,8,8,.63)),
              linear-gradient(0deg, var(--ab-bg) 0%, transparent 45%);
          }

          .ab-title {
            font-size: clamp(41px, 11vw, 60px);
            line-height: 1.02;
          }

          .ab-h2 {
            margin-top: 12px;
            font-size: clamp(32px, 8.4vw, 43px);
            line-height: 1.05;
          }

          .ab-hero .ab-title {
            margin-top: 18px;
          }

          .ab-hero-text {
            max-width: 440px;
            margin-top: 17px;
            font-size: 13px;
            line-height: 1.85;
          }

          .ab-hero-bottom {
            margin-top: 22px;
            font-size: 9px;
            letter-spacing: .12em;
          }

          .ab-stats {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .ab-stat {
            display: flex;
            min-height: 100px;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 16px 10px;
          }

          .ab-stat + .ab-stat {
            border-left: 1px solid var(--ab-border);
          }

          .ab-stat:nth-child(3) {
            border-top: 1px solid var(--ab-border);
            border-left: 0;
          }

          .ab-stat:nth-child(4) {
            border-top: 1px solid var(--ab-border);
          }

          .ab-stat-value {
            font-size: 29px;
          }

          .ab-stat-label {
            margin-top: 5px;
            font-size: 9px;
            letter-spacing: .045em;
          }

          .ab-intro-section,
          .ab-eco-section,
          .ab-journey-section,
          .ab-standards-section,
          .ab-spaces-section {
            padding-block: 52px;
          }

          .ab-intro {
            grid-template-columns: minmax(0, 1fr);
            gap: 35px;
          }

          .ab-intro-image {
            width: 100%;
            padding: 0 12px 12px 0;
          }

          .ab-intro-image::before {
            top: 12px;
            left: 12px;
          }

          .ab-image-frame {
            aspect-ratio: 4 / 3.7;
          }

          .ab-image-caption {
            bottom: 23px;
            width: min(93%, 320px);
            padding: 13px 14px;
          }

          .ab-caption-title {
            font-size: 20px;
          }

          .ab-caption-text {
            font-size: 8px;
          }

          .ab-body {
            font-size: 13px;
            line-height: 1.85;
          }

          .ab-divider {
            margin: 17px 0;
          }

          .ab-intro-description {
            gap: 10px;
          }

          .ab-intro-features {
            margin-top: 20px;
          }

          .ab-feature {
            grid-template-columns: 27px minmax(0, 1fr);
            gap: 9px;
            padding: 15px 0;
          }

          .ab-feature h3 {
            font-size: 14px;
          }

          .ab-feature p {
            font-size: 12px;
          }

          .ab-intro-action {
            margin-top: 22px;
          }

          .ab-btn {
            min-height: 46px;
            padding-inline: 18px;
            font-size: 11px;
          }

          .ab-eco {
            gap: 24px;
          }

          .ab-eco-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .ab-eco-item {
            padding: 19px 13px;
          }

          .ab-eco-number {
            margin-bottom: 13px;
            font-size: 9px;
          }

          .ab-eco-item h3 {
            font-size: 21px;
          }

          .ab-eco-item p {
            font-size: 12px;
            line-height: 1.75;
          }

          .ab-journey-layout {
            gap: 25px;
          }

          .ab-step {
            grid-template-columns: 42px minmax(0, 1fr);
            gap: 8px;
            padding: 18px 0;
          }

          .ab-step-number {
            font-size: 27px;
          }

          .ab-step h3 {
            font-size: 14px;
          }

          .ab-step p {
            font-size: 12px;
          }

          .ab-standards-head {
            margin-bottom: 25px;
          }

          .ab-standards {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .ab-standard {
            padding: 21px 13px;
          }

          .ab-standard-value {
            font-size: 35px;
          }

          .ab-standard-label {
            margin-top: 10px;
            font-size: 12px;
          }

          .ab-standard-text {
            font-size: 12px;
            line-height: 1.75;
          }

          .ab-section-heading {
            display: block;
            margin-bottom: 25px;
          }

          .ab-section-description {
            margin-top: 14px;
          }

          .ab-spaces-grid {
            gap: 25px 13px;
          }

          .ab-space-image {
            aspect-ratio: 3 / 3.9;
          }

          .ab-space-number {
            width: 30px;
            height: 30px;
            font-size: 9px;
          }

          .ab-space-info {
            padding-top: 12px;
          }

          .ab-space-title {
            font-size: 22px;
          }

          .ab-space-text {
            margin: 7px 0 10px;
            font-size: 12px;
            line-height: 1.7;
          }

          .ab-space-link {
            gap: 5px;
            font-size: 9px;
            letter-spacing: .055em;
          }
        }

        @media (max-width: 360px) {
          .ab-wrap {
            padding-inline: 14px;
          }

          .ab-eco-item {
            padding: 16px 10px;
          }

          .ab-space-title {
            font-size: 20px;
          }

          .ab-space-link {
            font-size: 8px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .ab-page *,
          .ab-page *::before,
          .ab-page *::after {
            scroll-behavior: auto !important;
            animation-duration: .01ms !important;
            transition-duration: .01ms !important;
          }
        }
      `}</style>

      {/* HERO */}
      <section className="ab-hero" aria-labelledby="ab-hero-title">
        <Img
          src={IMAGES.kitchen}
          alt="Modern kitchen interior"
          className="ab-hero-img"
          priority
        />

        <div className="ab-hero-shade" aria-hidden="true" />

        <div className="ab-wrap ab-hero-content">
          <Eyebrow>About Gohar</Eyebrow>

          <h1 className="ab-title" id="ab-hero-title">
            Thoughtful Interiors.
            <br />
            <em>Made for Living.</em>
          </h1>

          <p className="ab-hero-text">
            We create modern kitchens, wardrobes, bedroom interiors and
            media walls that bring together practical functionality,
            considered details and a refined sense of style.
          </p>

          <div className="ab-hero-bottom">
            Design · Craftsmanship · Detail
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="ab-stats-section" aria-label="Gohar at a glance">
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

      {/* ABOUT GOHAR */}
      <section className="ab-intro-section" aria-labelledby="ab-intro-title">
        <div className="ab-wrap">
          <div className="ab-intro">
            <div className="ab-intro-image">
              <div className="ab-image-frame">
                <Img
                  src={IMAGES.kitchen}
                  alt="Contemporary custom kitchen with considered finishes"
                />
              </div>

              <div className="ab-image-caption">
                <span className="ab-caption-line" aria-hidden="true" />
                <div>
                  <h3 className="ab-caption-title">
                    Made for the way you live.
                  </h3>
                  <p className="ab-caption-text">
                    Design with purpose
                  </p>
                </div>
              </div>
            </div>

            <div className="ab-intro-copy">
              <Eyebrow>Who We Are</Eyebrow>

              <h2 className="ab-h2" id="ab-intro-title">
                Designed with purpose.
                <br />
                <em>Made with care.</em>
              </h2>

              <div className="ab-divider" aria-hidden="true" />

              <div className="ab-intro-description">
                <p className="ab-body">
                  At Gohar, we believe a beautiful interior should do more
                  than look impressive. It should feel welcoming, work
                  effortlessly and reflect the people who live in it.
                </p>

                <p className="ab-body">
                  From kitchens and wardrobes to bedroom interiors and
                  media walls, we approach every space with a focus on
                  <strong> design, functionality and finishing.</strong>
                </p>

                <p className="ab-body">
                  Our aim is to help you make better use of your space
                  through considered layouts, coordinated finishes and
                  solutions tailored to your requirements.
                </p>
              </div>

              <div className="ab-intro-features">
                {INTRO_POINTS.map((item) => (
                  <article className="ab-feature" key={item.number}>
                    <span className="ab-feature-number">
                      {item.number}
                    </span>
                    <div>
                      <h3>{item.title}</h3>
                      <p>{item.text}</p>
                    </div>
                  </article>
                ))}
              </div>

              <div className="ab-intro-action">
                <Link to="/contact" className="ab-btn">
                  Discuss Your Project
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHOLE-HOME APPROACH */}
      <section className="ab-eco-section" aria-labelledby="ab-eco-title">
        <div className="ab-wrap">
          <div className="ab-eco">
            <div>
              <SectionTitle
                eyebrow="Our Approach"
                description="We look at the bigger picture, helping different areas of your home feel connected through thoughtful planning and complementary design choices."
              >
                One home.
                <br />
                <em>A cohesive design.</em>
              </SectionTitle>
            </div>

            <div className="ab-eco-grid">
              {ECOSYSTEM.map((item) => (
                <article className="ab-eco-item" key={item.number}>
                  <span className="ab-eco-number">{item.number}</span>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PROJECT JOURNEY */}
      <section
        className="ab-journey-section"
        aria-labelledby="ab-journey-title"
      >
        <div className="ab-wrap">
          <div className="ab-journey-layout">
            <div className="ab-journey-head">
              <SectionTitle
                eyebrow="How We Work"
                description="A clear, considered process helps you understand what comes next, from the first conversation through installation and final review."
              >
                From first idea
                <br />
                <em>to finished space.</em>
              </SectionTitle>

              <div className="ab-intro-action">
                <Link to="/contact" className="ab-btn">
                  Start a Conversation
                </Link>
              </div>
            </div>

            <div className="ab-journey">
              {JOURNEY.map((item) => (
                <article className="ab-step" key={item.step}>
                  <span className="ab-step-number">{item.step}</span>
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.text}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* STANDARDS */}
      <section
        className="ab-standards-section"
        aria-labelledby="ab-standards-title"
      >
        <div className="ab-wrap">
          <div className="ab-standards-head">
            <SectionTitle
              eyebrow="Our Standards"
              centered
              description="Good interiors start with careful planning. We focus on practical design decisions, clear project stages and attention to the details that matter."
            >
              Quality in the details.
              <br />
              <em>Thought in every space.</em>
            </SectionTitle>
          </div>

          <div className="ab-standards">
            {STANDARDS.map((item) => (
              <article className="ab-standard" key={item.label}>
                <p className="ab-standard-value">{item.value}</p>
                <h3 className="ab-standard-label">{item.label}</h3>
                <p className="ab-standard-text">{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* INTERIOR CATEGORIES */}
      <section className="ab-spaces-section" aria-labelledby="ab-spaces-title">
        <div className="ab-wrap">
          <div className="ab-section-heading">
            <div>
              <Eyebrow>Explore Our Work</Eyebrow>
              <h2 className="ab-h2" id="ab-spaces-title">
                Interiors for
                <br />
                <em>everyday living.</em>
              </h2>
            </div>

            <p className="ab-body ab-section-description">
              Discover our interior categories and find ideas for spaces
              that reflect your lifestyle, preferences and practical needs.
            </p>
          </div>

          <div className="ab-spaces-grid">
            {SPACES.map((space) => (
              <Link
                to={space.to}
                className="ab-space"
                key={space.number}
                aria-label={`Explore ${space.title}`}
              >
                <div className="ab-space-image">
                  <Img
                    src={space.img}
                    alt={space.title}
                  />
                  <span className="ab-space-number" aria-hidden="true">
                    {space.number}
                  </span>
                </div>

                <div className="ab-space-info">
                  <h3 className="ab-space-title">{space.title}</h3>
                  <p className="ab-space-text">{space.text}</p>
                  <span className="ab-space-link">
                    Explore Collection
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
