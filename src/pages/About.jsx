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

const INTRO_POINTS = [
  {
    title: "Understanding Your Space",
    text: "Every project starts with your requirements, preferences and everyday lifestyle.",
  },
  {
    title: "Considered Design",
    text: "Modern style, practical functionality and carefully selected details.",
  },
  {
    title: "Skilled Manufacturing",
    text: "Custom kitchens, wardrobes, bedroom furniture and media walls.",
  },
];

const STATS = [
  { value: "04", label: "Interior Categories" },
  { value: "2D / 3D", label: "Design Visualisation" },
  { value: "01", label: "Coordinated Team" },
  { value: "Pakistan", label: "Service Coverage" },
];

const ECOSYSTEM = [
  {
    title: "Same Style",
    text: "A consistent modern look connects every room in your home.",
  },
  {
    title: "Same Colour",
    text: "Coordinated colours, finishes and materials create a balanced interior.",
  },
  {
    title: "Same Quality",
    text: "Every cabinet, panel and fitting receives careful attention.",
  },
  {
    title: "Same Team",
    text: "One coordinated team manages design, manufacturing and installation.",
  },
];

const JOURNEY = [
  {
    step: "01",
    title: "Consultation",
    text: "We discuss your requirements, ideas and budget.",
  },
  {
    step: "02",
    title: "Site Measurement",
    text: "Accurate measurements help create a precise layout.",
  },
  {
    step: "03",
    title: "2D / 3D Design",
    text: "Review your layout, colours and finishes before production.",
  },
  {
    step: "04",
    title: "Manufacturing",
    text: "Your furniture is crafted with attention to detail.",
  },
  {
    step: "05",
    title: "Installation",
    text: "Our team installs your interior for a neat finish.",
  },
  {
    step: "06",
    title: "Final Handover",
    text: "We review the completed project with you.",
  },
];

const STANDARDS = [
  {
    value: "06",
    label: "Clear Project Stages",
    text: "A structured process from consultation to handover.",
  },
  {
    value: "04",
    label: "Interior Categories",
    text: "Kitchens, wardrobes, bedrooms and media walls.",
  },
  {
    value: "100%",
    label: "Custom Design",
    text: "Solutions tailored to your space and preferences.",
  },
 
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
    text: "Contemporary designs for modern living.",
    img: IMAGES.media,
    to: "/media-walls",
  },
  {
    number: "04",
    title: "Bedroom Interiors",
    text: "Comfortable spaces with thoughtful details.",
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
    />
  );
}

export default function AboutUs() {
  return (
    <main className="ab-page">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;500;600;700;800&display=swap');

        .ab-page {
          --ab-bg: #090909;
          --ab-surface: #10100f;
          --ab-card: #151311;
          --ab-orange: #c0652b;
          --ab-orange-light: #e08a4f;
          --ab-white: #fff;
          --ab-muted: #b9b4ad;
          --ab-border: rgba(255,255,255,.11);

          width: 100%;
          max-width: none;
          margin: 0;
          overflow-x: clip;
          color: var(--ab-white);
          background: var(--ab-bg);
          font-family: 'Open Sans', Arial, sans-serif;
          font-size: 14px;
          font-weight: 400;
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

        .ab-wrap {
          width: 100%;
          max-width: none;
          margin: 0 auto;
          padding-inline: clamp(18px, 4vw, 64px);
        }

        .ab-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 9px;
          margin: 0;
          color: var(--ab-orange-light);
          font-size: 11px;
          font-weight: 500;
          letter-spacing: .13em;
          line-height: 1.5;
          text-transform: uppercase;
        }

        .ab-eyebrow::before {
          width: 22px;
          height: 2px;
          flex-shrink: 0;
          background: var(--ab-orange);
          content: "";
        }

        /* HEADINGS */

        .ab-title,
        .ab-h2 {
          margin: 0;
          color: #fff;
          font-weight: 500;
          letter-spacing: -.025em;
          line-height: 1.2;
        }

        .ab-title {
          font-size: clamp(30px, 3.2vw, 44px);
        }

        .ab-h2 {
          margin-top: 10px;
          font-size: clamp(25px, 2.4vw, 34px);
        }

        .ab-title em,
        .ab-h2 em {
          color: var(--ab-orange-light);
          font-style: normal;
          font-weight: 500;
        }

        .ab-body {
          margin: 0;
          color: var(--ab-muted);
          font-size: 14px;
          font-weight: 400;
          line-height: 1.8;
        }

        .ab-body strong {
          color: #fff;
          font-weight: 500;
        }

        .ab-btn {
          display: inline-flex;
          min-height: 45px;
          align-items: center;
          justify-content: center;
          padding: 0 23px;
          border: 1px solid #fff;
          border-radius: 2px;
          background: #fff;
          color: #090909 !important;
          font-family: inherit;
          font-size: 12px;
          font-weight: 500;
          transition: background .2s ease, border-color .2s ease, color .2s ease;
        }

        .ab-btn:hover {
          border-color: var(--ab-orange);
          background: var(--ab-orange);
          color: #fff !important;
        }

        /* HERO */

        .ab-hero {
          position: relative;
          isolation: isolate;
          display: flex;
          min-height: 440px;
          align-items: flex-end;
          overflow: hidden;
          padding: 105px 0 48px;
          background: #100e0c;
        }

        .ab-hero-img {
          position: absolute;
          z-index: -3;
          inset: 0;
          height: 100%;
          object-fit: cover;
          object-position: center 55%;
          opacity: .58;
        }

        .ab-hero-shade {
          position: absolute;
          z-index: -2;
          inset: 0;
          background:
            linear-gradient(90deg, rgba(8,8,8,.91), rgba(8,8,8,.62) 48%, rgba(8,8,8,.2)),
            linear-gradient(0deg, #090909 0%, transparent 65%);
        }

        .ab-hero-text {
          max-width: 540px;
          margin: 16px 0 0;
          color: #f0ede9;
          font-size: 14px;
          font-weight: 400;
          line-height: 1.85;
        }

        .ab-hero-text strong {
          color: #fff;
          font-weight: 500;
        }

        .ab-hero-bottom {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-top: 22px;
          color: #fff;
          font-size: 10px;
          font-weight: 500;
          letter-spacing: .13em;
          text-transform: uppercase;
        }

        .ab-hero-bottom::before {
          width: 26px;
          height: 2px;
          background: var(--ab-orange);
          content: "";
        }

        /* STATS */

        .ab-stats-section {
          border-bottom: 1px solid var(--ab-border);
          background: #10100f;
        }

        .ab-stats {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
        }

        .ab-stat {
          min-width: 0;
          padding: 24px 20px 24px 0;
          text-align: center;
        }

        .ab-stat + .ab-stat {
          padding-left: 22px;
          border-left: 1px solid var(--ab-border);
        }

        .ab-stat-value {
          margin: 0;
          color: var(--ab-orange-light);
          font-size: clamp(22px, 2.2vw, 30px);
          font-weight: 500;
          line-height: 1.2;
          overflow-wrap: anywhere;
        }

        .ab-stat-label {
          margin: 7px 0 0;
          color: #fff;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: .04em;
          text-transform: uppercase;
        }

        /* INTRO */

        .ab-intro-section {
          padding-block: 70px;
        }

        .ab-intro {
          display: grid;
          grid-template-columns: minmax(0, .95fr) minmax(0, 1.05fr);
          align-items: center;
          gap: clamp(28px, 5vw, 70px);
        }

        .ab-intro-copy,
        .ab-intro-image {
          min-width: 0;
        }

        .ab-divider {
          width: 43px;
          height: 2px;
          margin: 18px 0;
          background: var(--ab-orange);
        }

        .ab-intro-description {
          display: grid;
          gap: 12px;
          max-width: 650px;
        }

        .ab-intro-description .ab-body:first-child {
          color: #fff;
        }

        .ab-intro-image {
          position: relative;
          padding: 0 15px 15px 0;
        }

        .ab-intro-image::before {
          position: absolute;
          top: 15px;
          right: 0;
          bottom: 0;
          left: 15px;
          border: 1px solid rgba(192,101,43,.55);
          content: "";
        }

        .ab-image-frame {
          position: relative;
          overflow: hidden;
          aspect-ratio: 4 / 4.1;
          background: #191614;
        }

        .ab-image-frame img {
          height: 100%;
          object-fit: cover;
          transition: transform .5s ease;
        }

        .ab-intro-image:hover .ab-image-frame img {
          transform: scale(1.025);
        }

        .ab-image-caption {
          position: absolute;
          bottom: 15px;
          left: -1px;
          display: flex;
          width: min(88%, 350px);
          align-items: center;
          gap: 12px;
          padding: 15px 18px;
          border: 1px solid rgba(255,255,255,.08);
          background: rgba(17,16,15,.97);
        }

        .ab-caption-line {
          width: 2px;
          height: 36px;
          flex-shrink: 0;
          background: var(--ab-orange);
        }

        .ab-caption-title {
          margin: 0;
          color: #fff;
          font-size: 14px;
          font-weight: 500;
          line-height: 1.5;
        }

        .ab-caption-text {
          margin: 5px 0 0;
          color: var(--ab-orange-light);
          font-size: 10px;
          font-weight: 500;
          letter-spacing: .06em;
          text-transform: uppercase;
        }

        .ab-intro-features {
          display: grid;
          margin-top: 22px;
          border-top: 1px solid var(--ab-border);
        }

        .ab-feature {
          padding: 15px 0;
          border-bottom: 1px solid var(--ab-border);
        }

        .ab-feature h3 {
          margin: 0 0 6px;
          color: #fff;
          font-size: 15px;
          font-weight: 500;
        }

        .ab-feature p {
          max-width: 560px;
          margin: 0;
          color: var(--ab-muted);
          font-size: 13px;
          font-weight: 400;
          line-height: 1.8;
        }

        .ab-intro-action {
          margin-top: 22px;
        }

        /* WHOLE HOME */

        .ab-eco-section {
          padding-block: 70px;
          border-top: 1px solid var(--ab-border);
          border-bottom: 1px solid var(--ab-border);
          background: var(--ab-surface);
        }

        .ab-eco {
          display: grid;
          grid-template-columns: minmax(0, .8fr) minmax(0, 1.2fr);
          align-items: start;
          gap: clamp(28px, 5vw, 70px);
        }

        .ab-eco-head {
          position: sticky;
          top: 100px;
        }

        .ab-eco-head .ab-body {
          max-width: 430px;
          margin-top: 16px;
        }

        .ab-eco-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          border: 1px solid var(--ab-border);
        }

        .ab-eco-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 27px 23px;
          border-right: 1px solid var(--ab-border);
          border-bottom: 1px solid var(--ab-border);
          background: var(--ab-card);
          text-align: center;
        }

        .ab-eco-item:nth-child(2n) {
          border-right: 0;
        }

        .ab-eco-item:nth-child(n+3) {
          border-bottom: 0;
        }

        .ab-eco-item h3 {
          margin: 0 0 9px;
          color: #fff;
          font-size: 16px;
          font-weight: 500;
          line-height: 1.45;
        }

        .ab-eco-item p {
          margin: 0;
          color: var(--ab-muted);
          font-size: 13px;
          font-weight: 400;
          line-height: 1.8;
        }

        /* PROCESS */

        .ab-journey-section {
          padding-block: 70px;
        }

        .ab-journey-layout {
          display: grid;
          grid-template-columns: minmax(0, 1.15fr) minmax(0, .85fr);
          align-items: start;
          gap: clamp(28px, 5vw, 70px);
        }

        .ab-journey-head {
          position: sticky;
          top: 100px;
          order: 2;
        }

        .ab-journey-head .ab-body {
          max-width: 420px;
          margin-top: 16px;
        }

        .ab-journey {
          order: 1;
          border-top: 1px solid var(--ab-border);
        }

        .ab-step {
          display: grid;
          grid-template-columns: 58px minmax(0, 1fr);
          align-items: start;
          gap: 8px;
          padding: 20px 0;
          border-bottom: 1px solid var(--ab-border);
        }

        .ab-step-number {
          color: var(--ab-orange-light);
          font-size: 25px;
          font-weight: 500;
          line-height: 1.2;
        }

        .ab-step h3 {
          margin: 0 0 7px;
          color: #fff;
          font-size: 15px;
          font-weight: 500;
        }

        .ab-step p {
          max-width: 480px;
          margin: 0;
          color: var(--ab-muted);
          font-size: 13px;
          font-weight: 400;
          line-height: 1.8;
        }

        /* STANDARDS */

        .ab-standards-section {
          padding-block: 70px;
          border-top: 1px solid var(--ab-border);
          background: #0d0c0b;
        }

        .ab-standards-head {
          max-width: 620px;
          margin: 0 auto 35px;
          text-align: center;
        }

        .ab-standards-head .ab-body {
          max-width: 480px;
          margin: 14px auto 0;
        }

        .ab-standards {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 13px;
        }

        .ab-standard {
          display: flex;
          min-width: 0;
          flex-direction: column;
          align-items: center;
          padding: 25px 22px 27px;
          border: 1px solid var(--ab-border);
          background: var(--ab-card);
          text-align: center;
          transition: border-color .2s ease;
        }

        .ab-standard:hover {
          border-color: rgba(192,101,43,.6);
        }

        .ab-standard-value {
          margin: 0;
          color: var(--ab-orange-light);
          font-size: clamp(28px, 2.8vw, 37px);
          font-weight: 500;
          line-height: 1.15;
          overflow-wrap: anywhere;
        }

        .ab-standard-label {
          margin: 10px 0 7px;
          color: #fff;
          font-size: 13px;
          font-weight: 500;
        }

        .ab-standard-text {
          margin: 0;
          color: var(--ab-muted);
          font-size: 13px;
          font-weight: 400;
          line-height: 1.8;
        }

        /* COLLECTIONS */

        .ab-spaces-section {
          padding-block: 70px 80px;
        }

        .ab-section-heading {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 24px;
          margin-bottom: 30px;
        }

        .ab-section-heading .ab-h2 {
          max-width: 600px;
        }

        .ab-section-description {
          max-width: 360px;
          padding-bottom: 4px;
        }

        .ab-spaces-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 16px;
        }

        .ab-space {
          display: block;
          min-width: 0;
          text-align: center;
        }

        .ab-space-image {
          position: relative;
          overflow: hidden;
          aspect-ratio: 3 / 3.7;
          background: #1b1714;
        }

        .ab-space-image img {
          height: 100%;
          object-fit: cover;
          transition: transform .5s ease;
        }

        .ab-space:hover .ab-space-image img {
          transform: scale(1.035);
        }

        .ab-space-number {
          position: absolute;
          top: 0;
          left: 0;
          display: flex;
          width: 34px;
          height: 34px;
          align-items: center;
          justify-content: center;
          background: var(--ab-orange);
          color: #fff;
          font-size: 10px;
          font-weight: 500;
        }

        .ab-space-info {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 13px 8px 0;
          border-top: 1px solid var(--ab-border);
          margin-top: -1px;
          text-align: center;
        }

        .ab-space-title {
          margin: 0;
          color: #fff;
          font-size: 15px;
          font-weight: 500;
          line-height: 1.45;
        }

        .ab-space-text {
          margin: 6px 0 10px;
          color: var(--ab-muted);
          font-size: 13px;
          font-weight: 400;
          line-height: 1.75;
        }

        .ab-space-link {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          color: var(--ab-orange-light);
          font-size: 11px;
          font-weight: 500;
          letter-spacing: .035em;
          text-transform: uppercase;
          transition: color .2s ease;
        }

        .ab-space-link::after {
          content: "→";
          font-size: 15px;
          transition: transform .2s ease;
        }

        .ab-space:hover .ab-space-link {
          color: #fff;
        }

        .ab-space:hover .ab-space-link::after {
          transform: translateX(3px);
        }

        .ab-page a:focus-visible {
          outline: 2px solid var(--ab-orange-light);
          outline-offset: 4px;
        }

        /* TABLET */

        @media (max-width: 1000px) {
          .ab-intro-section,
          .ab-eco-section,
          .ab-journey-section,
          .ab-standards-section,
          .ab-spaces-section {
            padding-block: 55px;
          }

          .ab-intro,
          .ab-eco,
          .ab-journey-layout {
            grid-template-columns: minmax(0, 1fr);
          }

          .ab-intro-image {
            width: 100%;
            max-width: 620px;
          }

          .ab-eco-head,
          .ab-journey-head {
            position: static;
            order: 0;
          }

          .ab-journey {
            order: 1;
          }

          .ab-standards {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .ab-spaces-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .ab-space-image {
            aspect-ratio: 4 / 4.3;
          }
        }

        /* MOBILE */

        @media (max-width: 640px) {
          .ab-wrap {
            padding-inline: 17px;
          }

          .ab-hero {
            min-height: 370px;
            padding: 95px 0 35px;
          }

          .ab-hero-shade {
            background:
              linear-gradient(90deg, rgba(8,8,8,.9), rgba(8,8,8,.58)),
              linear-gradient(0deg, #090909, transparent 75%);
          }

          .ab-title {
            font-size: clamp(27px, 7vw, 34px);
            font-weight: 500;
            line-height: 1.18;
          }

          .ab-h2 {
            font-size: clamp(23px, 5.8vw, 29px);
            font-weight: 500;
          }

          .ab-hero-text {
            max-width: 440px;
            margin-top: 13px;
            font-size: 13px;
            font-weight: 400;
            line-height: 1.8;
          }

          .ab-hero-bottom {
            margin-top: 17px;
            font-size: 9px;
          }

          .ab-stats {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .ab-stat {
            padding: 18px 10px;
          }

          .ab-stat + .ab-stat {
            padding-left: 13px;
          }

          .ab-stat:nth-child(3) {
            padding-left: 10px;
            border-left: 0;
          }

          .ab-stat:nth-child(n+3) {
            border-top: 1px solid var(--ab-border);
          }

          .ab-stat-value {
            font-size: 22px;
            font-weight: 500;
          }

          .ab-stat-label {
            font-size: 10px;
            font-weight: 500;
            letter-spacing: .025em;
          }

          .ab-intro-section,
          .ab-eco-section,
          .ab-journey-section,
          .ab-standards-section,
          .ab-spaces-section {
            padding-block: 45px;
          }

          .ab-intro {
            gap: 30px;
          }

          .ab-intro-image {
            padding: 0 11px 11px 0;
          }

          .ab-intro-image::before {
            top: 11px;
            left: 11px;
          }

          .ab-image-caption {
            width: min(94%, 300px);
            padding: 12px 13px;
          }

          .ab-caption-title {
            font-size: 13px;
            font-weight: 500;
          }

          .ab-caption-text {
            font-size: 9px;
          }

          .ab-body {
            font-size: 13px;
            font-weight: 400;
            line-height: 1.8;
          }

          .ab-divider {
            margin: 14px 0;
          }

          .ab-intro-description {
            gap: 10px;
          }

          .ab-feature {
            padding: 13px 0;
          }

          .ab-feature h3 {
            font-size: 14px;
            font-weight: 500;
          }

          .ab-feature p {
            font-size: 12px;
            font-weight: 400;
          }

          .ab-btn {
            min-height: 43px;
            padding-inline: 18px;
            font-size: 11px;
            font-weight: 500;
          }

          .ab-eco {
            gap: 22px;
          }

          .ab-eco-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .ab-eco-item {
            padding: 19px 13px;
            border-right: 1px solid var(--ab-border);
            border-bottom: 1px solid var(--ab-border);
            text-align: center;
          }

          .ab-eco-item:nth-child(2n) {
            border-right: 0;
          }

          .ab-eco-item:nth-child(n+3) {
            border-bottom: 0;
          }

          .ab-eco-item h3 {
            font-size: 14px;
            font-weight: 500;
          }

          .ab-eco-item p {
            font-size: 12px;
            font-weight: 400;
            line-height: 1.75;
          }

          .ab-step {
            grid-template-columns: 46px minmax(0, 1fr);
            gap: 7px;
            padding: 17px 0;
          }

          .ab-step-number {
            font-size: 22px;
            font-weight: 500;
          }

          .ab-step h3 {
            font-size: 14px;
            font-weight: 500;
          }

          .ab-step p {
            font-size: 12px;
            font-weight: 400;
          }

          .ab-standards-head {
            margin-bottom: 24px;
            text-align: center;
          }

          .ab-standards-head .ab-body {
            margin: 11px auto 0;
          }

          .ab-standards {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 10px;
          }

          .ab-standard {
            padding: 18px 11px;
            text-align: center;
          }

          .ab-standard-value {
            font-size: clamp(25px, 6vw, 31px);
            font-weight: 500;
          }

          .ab-standard-label {
            margin-top: 9px;
            font-size: 12px;
            font-weight: 500;
          }

          .ab-standard-text {
            font-size: 12px;
            font-weight: 400;
            line-height: 1.7;
          }

          .ab-section-heading {
            display: block;
            margin-bottom: 22px;
            text-align: center;
          }

          .ab-section-description {
            margin: 10px auto 0;
          }

          .ab-spaces-grid {
            gap: 20px 12px;
          }

          .ab-space-image {
            aspect-ratio: 3 / 3.8;
          }

          .ab-space-number {
            width: 29px;
            height: 29px;
            font-size: 9px;
            font-weight: 500;
          }

          .ab-space-info {
            padding: 11px 5px 0;
            text-align: center;
          }

          .ab-space-title {
            font-size: 14px;
            font-weight: 500;
          }

          .ab-space-text {
            margin: 5px 0 8px;
            font-size: 12px;
            font-weight: 400;
            line-height: 1.65;
          }

          .ab-space-link {
            gap: 4px;
            font-size: 10px;
            font-weight: 500;
            letter-spacing: .01em;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .ab-page *,
          .ab-page *::before,
          .ab-page *::after {
            scroll-behavior: auto !important;
            transition-duration: .01ms !important;
          }
        }
      `}</style>

      {/* HERO */}
      <section className="ab-hero">
        <Img
          src={IMAGES.kitchen}
          alt="Contemporary interior designed by Gohar"
          className="ab-hero-img"
        />

        <div className="ab-hero-shade" />

        <div className="ab-wrap">
          <p className="ab-eyebrow">About Gohar</p>

          <h1 className="ab-title" style={{ marginTop: 14 }}>
            Make Your Home Better,
            <br />
            <em>One Space at a Time.</em>
          </h1>

          <p className="ab-hero-text">
            We create modern kitchens, wardrobes and complete home
            interiors with a focus on <strong>quality, functionality</strong>
            {" "}and timeless design.
          </p>

          <div className="ab-hero-bottom">
            Design · Craftsmanship · Detail
          </div>
        </div>
      </section>

      {/* STATS */}
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

      {/* WHO WE ARE */}
      <section className="ab-intro-section">
        <div className="ab-wrap">
          <div className="ab-intro">
            <div className="ab-intro-image">
              <div className="ab-image-frame">
                <Img
                  src={IMAGES.kitchen}
                  alt="Modern custom kitchen interior"
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
                  At Gohar, we believe a beautiful interior should do
                  more than look impressive. It should feel welcoming,
                  work effortlessly and reflect the people who live in it.
                </p>

                <p className="ab-body">
                  We bring kitchens, wardrobes, bedroom furniture and
                  media walls together through <strong>coordinated design</strong>,
                  carefully selected materials and consistent finishing.
                </p>

                <p className="ab-body">
                  Every project starts with your needs and ends with a
                  space designed around your everyday life.
                </p>
              </div>

              <div className="ab-intro-features">
                {INTRO_POINTS.map(({ title, text }) => (
                  <article className="ab-feature" key={title}>
                    <h3>{title}</h3>
                    <p>{text}</p>
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
      <section className="ab-eco-section">
        <div className="ab-wrap">
          <div className="ab-eco">
            <div className="ab-eco-head">
              <p className="ab-eyebrow">Whole-Home Approach</p>

              <h2 className="ab-h2">
                One home, one language.
                <br />
                <em>Every room matched.</em>
              </h2>

              <p className="ab-body" style={{ marginTop: 16 }}>
                We plan your interiors with a unified vision, so your
                kitchen, wardrobes, bedroom and media wall feel like
                parts of the same thoughtfully designed home.
              </p>
            </div>

            <div className="ab-eco-grid">
              {ECOSYSTEM.map(({ title, text }) => (
                <article className="ab-eco-item" key={title}>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

    

      {/* OUR STANDARDS */}
      <section className="ab-standards-section">
        <div className="ab-wrap">
          <div className="ab-standards-head">
            <p className="ab-eyebrow">Our Standards</p>

            <h2 className="ab-h2">
              Quality you can
              <br />
              <em>see and feel.</em>
            </h2>

            <p className="ab-body">
              We focus on careful planning, practical design and
              consistent workmanship throughout your project.
            </p>
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

      {/* OUR COLLECTIONS */}
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
              Explore our interior collections, designed to bring
              functionality, character and a refined finish into your home.
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
                    alt={`${space.title} by Gohar`}
                  />

                  <span className="ab-space-number">
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