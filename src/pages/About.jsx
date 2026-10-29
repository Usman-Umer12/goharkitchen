import kitchenImg from "../assets/des2.webp";
import wardrobeImg from "../assets/word1.webp";
import mediaImg from "../assets/media1.webp";
import bedImg from "../assets/bed1.webp";

const BRAND = "Gohar Kitchen Interior";

const IMG = {
  kitchen: kitchenImg,
  wardrobe: wardrobeImg,
  media: mediaImg,
  bed: bedImg,
};

const COLLECTIONS = [
  {
    no: "01",
    title: "Bespoke Kitchens",
    text: "Custom kitchens with practical layouts, quality materials and carefully considered finishes.",
    href: "/kitchen",
    img: IMG.kitchen,
  },
  {
    no: "02",
    title: "Custom Wardrobes",
    text: "Personalised wardrobes with smart storage, elegant finishes and functional detailing.",
    href: "/wordrobe",
    img: IMG.wardrobe,
  },
  {
    no: "03",
    title: "Luxury Beds",
    text: "Wooden and upholstered beds designed to bring comfort, character and balance to your bedroom.",
    href: "/bedroom-walls",
    img: IMG.bed,
  },
  {
    no: "04",
    title: "Media Walls",
    text: "Contemporary feature walls and TV units that blend storage, texture and visual harmony.",
    href: "/media-walls",
    img: IMG.media,
  },
];

const SERVICES_MAIN = [
  { label: "Kitchen", href: "/kitchen" },
  { label: "Wardrobe", href: "/wordrobe" },
  { label: "Media Walls", href: "/media-walls" },
  { label: "Bedroom Walls", href: "/bedroom-walls" },
];

const SERVICES_MORE = [
  { label: "Accessories", href: "/accessories" },
  { label: "Sheets", href: "/sheets" },
  { label: "Corian", href: "/corian" },
  { label: "Vanities", href: "/vanities" },
  { label: "2D/3D Design", href: "/design-2d-3d" },
  { label: "Our Projects", href: "/projects" },
];

const WHY = [
  {
    no: "01",
    title: "Made to Measure",
    text: "Every design is planned around your available space, storage needs and lifestyle.",
    img: IMG.kitchen,
  },
  {
    no: "02",
    title: "Material Selection",
    text: "Explore suitable materials, finishes and fittings according to your design and budget.",
    img: IMG.wardrobe,
  },
  {
    no: "03",
    title: "Attention to Detail",
    text: "Careful consideration of measurements, alignment, hardware and finishing.",
    img: IMG.media,
  },
  {
    no: "04",
    title: "Complete Coordination",
    text: "A coordinated approach to design, manufacturing and installation.",
    img: IMG.bed,
  },
];

function Eyebrow({ children }) {
  return <p className="ab-eyebrow">{children}</p>;
}

function BgImage({ src, position = "center" }) {
  return (
    <>
      <img
        src={src}
        alt=""
        aria-hidden="true"
        className="ab-bg-img"
        style={{ objectPosition: position }}
        loading="lazy"
        decoding="async"
      />
      <div className="ab-bg-shade" aria-hidden="true" />
    </>
  );
}

export default function AboutUs() {
  return (
    <main className="ab-page">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&family=Open+Sans:wght@300;400;600&display=swap');

        .ab-page {
          --ab-accent: #c0652b;
          --ab-accent-dark: #a95320;
          --ab-ink: #1c1917;
          --ab-text: #5d5750;
          --ab-white: #ffffff;
          --ab-soft: #f7f4f0;
          --ab-line: #e4ded6;
          --ab-display: 'Montserrat', Arial, sans-serif;
          --ab-sans: 'Montserrat', Arial, sans-serif;

          width: 100%;
          margin: 0;
          overflow: clip;
          color: var(--ab-text);
          background: var(--ab-white);
          font-family: var(--ab-sans);
          font-size: 15px;
          line-height: 1.75;
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

        /* FULL WIDTH */
        .ab-wrap {
          position: relative;
          width: 100%;
          max-width: none;
          margin-inline: auto;
          padding-inline: clamp(20px, 5vw, 90px);
        }

        .ab-section {
          position: relative;
          isolation: isolate;
          overflow: hidden;
          padding-block: 110px;
        }

        .ab-bg-img {
          position: absolute;
          z-index: -2;
          inset: 0;
          height: 100%;
          object-fit: cover;
        }

        .ab-bg-shade {
          position: absolute;
          z-index: -1;
          inset: 0;
        }

        .ab-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          margin: 0;
          color: var(--ab-accent);
          font-size: 11px;
          font-weight: 600;
          letter-spacing: .17em;
          text-transform: uppercase;
        }

        .ab-eyebrow::before {
          width: 26px;
          height: 1px;
          background: currentColor;
          content: "";
        }

        .ab-h2 {
          margin: 14px 0 0;
          color: var(--ab-ink);
          font-family: var(--ab-display);
          font-size: clamp(34px, 4.4vw, 62px);
          font-weight: 600;
          letter-spacing: -.02em;
          line-height: 1.15;
        }

        .ab-h2 em {
          color: var(--ab-accent);
          font-style: normal;
        }

        .ab-head {
          max-width: 760px;
        }

        .ab-head.is-centered {
          margin-inline: auto;
          text-align: center;
        }

        .ab-head.is-centered .ab-eyebrow {
          justify-content: center;
        }

        .ab-head p.ab-sub {
          max-width: 620px;
          margin: 16px auto 0;
        }

        /* HERO — NUOMI STYLE (image + dark overlay + centered title & text) */
        .ab-hero {
          display: flex;
          min-height: 100vh;
          min-height: 100svh;
          align-items: center;
          justify-content: center;
          padding-block: 120px 80px;
          text-align: center;
          color: #fff;
          font-family: 'Open Sans', Arial, sans-serif;
        }

        .ab-hero .ab-bg-shade {
          background: rgba(0, 0, 0, .62);
        }

        .ab-hero-inner {
          width: 100%;
          max-width: 820px;
          margin-inline: auto;
        }

        .ab-hero h1 {
          margin: 0;
          color: #fff;
          font-family: 'Open Sans', Arial, sans-serif;
          font-size: clamp(32px, 4.4vw, 48px);
          font-weight: 400;
          letter-spacing: 0;
          line-height: 1.25;
        }

        .ab-hero p.ab-hero-text {
          max-width: 780px;
          margin: 18px auto 0;
          color: #f1f1f1;
          font-family: 'Open Sans', Arial, sans-serif;
          font-size: 15px;
          font-weight: 400;
          line-height: 1.85;
        }

        /* CONCEPT */
        .ab-better {
          background: var(--ab-white);
        }

        .ab-better-grid {
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(0, 1.1fr);
          align-items: center;
          gap: clamp(36px, 6vw, 110px);
        }

        .ab-better-text p {
          margin: 20px 0 0;
        }

        .ab-better-text p:first-of-type {
          margin-top: 24px;
        }

        .ab-better-text strong {
          color: var(--ab-ink);
          font-weight: 600;
        }

        .ab-chips {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 28px;
        }

        .ab-chip {
          padding: 9px 16px;
          border: 1px solid var(--ab-line);
          background: var(--ab-soft);
          color: var(--ab-ink);
          font-size: 12px;
          font-weight: 500;
          letter-spacing: .01em;
          transition:
            background .25s ease,
            color .25s ease,
            border-color .25s ease;
        }

        .ab-chip:hover {
          background: var(--ab-accent);
          border-color: var(--ab-accent);
          color: #fff;
        }

        .ab-better-image {
          position: relative;
          padding: 0 20px 20px 0;
        }

        .ab-better-image::before {
          position: absolute;
          top: 20px;
          right: 0;
          bottom: 0;
          left: 20px;
          border: 1px solid var(--ab-accent);
          content: "";
        }

        .ab-better-frame {
          position: relative;
          overflow: hidden;
          aspect-ratio: 4 / 3.6;
          background: var(--ab-soft);
        }

        .ab-better-frame img {
          height: 100%;
          object-fit: cover;
        }

        /* COLLECTIONS */
        .ab-collections {
          border-top: 1px solid var(--ab-line);
          background: var(--ab-soft);
        }

        .ab-col-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 20px;
          margin-top: 58px;
        }

        .ab-col-card {
          position: relative;
          isolation: isolate;
          display: flex;
          min-height: 520px;
          flex-direction: column;
          justify-content: flex-end;
          overflow: hidden;
          padding: 34px 28px;
          color: #fff;
        }

        .ab-col-card .ab-bg-img {
          transition: transform .6s ease;
        }

        .ab-col-card:hover .ab-bg-img {
          transform: scale(1.07);
        }

        .ab-col-card .ab-bg-shade {
          background: linear-gradient(
            0deg,
            rgba(8,8,8,.92) 0%,
            rgba(8,8,8,.5) 62%,
            rgba(8,8,8,.15) 100%
          );
        }

        .ab-col-no {
          position: absolute;
          top: 26px;
          left: 28px;
          font-family: var(--ab-display);
          font-size: 22px;
          font-weight: 600;
          color: #f0a06a;
        }

        .ab-col-card h3 {
          margin: 0 0 10px;
          color: #fff;
          font-family: var(--ab-display);
          font-size: 24px;
          font-weight: 600;
          line-height: 1.35;
        }

        .ab-col-card h3::before {
          display: block;
          width: 30px;
          height: 2px;
          margin-bottom: 14px;
          background: #f0a06a;
          content: "";
        }

        .ab-col-card p {
          margin: 0 0 20px;
          color: #e9e2da;
          font-size: 13px;
          line-height: 1.8;
        }

        .ab-col-link {
          align-self: flex-start;
          padding-bottom: 4px;
          border-bottom: 1px solid #f0a06a;
          color: #fff;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: .12em;
          text-transform: uppercase;
        }

        /* WHY CHOOSE US */
        .ab-history {
          background: var(--ab-white);
        }

        .ab-timeline {
          position: relative;
          margin-top: 64px;
        }

        .ab-timeline::before {
          position: absolute;
          top: 0;
          bottom: 0;
          left: 50%;
          width: 2px;
          transform: translateX(-50%);
          background: var(--ab-line);
          content: "";
        }

        .ab-event {
          position: relative;
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
          align-items: center;
          gap: 0 clamp(40px, 6vw, 100px);
          padding-block: 26px;
        }

        .ab-event::before {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 16px;
          height: 16px;
          transform: translate(-50%, -50%);
          border: 3px solid var(--ab-white);
          border-radius: 50%;
          background: var(--ab-accent);
          content: "";
          box-shadow: 0 0 0 2px var(--ab-accent);
        }

        .ab-event-card,
        .ab-event-media {
          min-width: 0;
        }

        .ab-event-media img {
          aspect-ratio: 16 / 9;
          object-fit: cover;
          background: var(--ab-line);
        }

        .ab-event-no {
          margin: 0 0 6px;
          color: var(--ab-accent);
          font-family: var(--ab-display);
          font-size: clamp(38px, 4vw, 54px);
          font-weight: 700;
          line-height: 1.2;
        }

        .ab-event-title {
          margin: 0 0 10px;
          color: var(--ab-ink);
          font-family: var(--ab-display);
          font-size: clamp(22px, 2.2vw, 30px);
          font-weight: 600;
          line-height: 1.35;
        }

        .ab-event-text {
          margin: 0;
          color: var(--ab-text);
          font-size: 14px;
          line-height: 1.8;
        }

        .ab-event:nth-child(odd) .ab-event-card {
          grid-column: 1;
          grid-row: 1;
          text-align: right;
        }

        .ab-event:nth-child(odd) .ab-event-media {
          grid-column: 2;
          grid-row: 1;
        }

        .ab-event:nth-child(even) .ab-event-card {
          grid-column: 2;
          grid-row: 1;
        }

        .ab-event:nth-child(even) .ab-event-media {
          grid-column: 1;
          grid-row: 1;
        }

        /* SERVICES */
        .ab-services .ab-bg-shade {
          background: rgba(255,255,255,.92);
        }

        .ab-svc-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 24px;
          margin-top: 58px;
        }

        .ab-svc-box {
          padding: 40px clamp(24px, 3vw, 50px);
          border: 1px solid var(--ab-line);
          background: #fff;
        }

        .ab-svc-box h3 {
          margin: 0 0 18px;
          color: var(--ab-ink);
          font-family: var(--ab-display);
          font-size: 25px;
          font-weight: 600;
          line-height: 1.4;
        }

        .ab-svc-list {
          margin: 0;
          padding: 0;
          list-style: none;
        }

        .ab-svc-list li {
          border-bottom: 1px solid var(--ab-line);
        }

        .ab-svc-list a {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 18px 0;
          color: var(--ab-ink);
          font-size: 14px;
          font-weight: 500;
          transition: color .25s ease, padding .25s ease;
        }

        .ab-svc-list a:hover {
          color: var(--ab-accent);
          padding-left: 10px;
        }

        .ab-svc-list a span {
          color: var(--ab-accent);
          font-size: 18px;
        }

        /* TABLET */
        @media (max-width: 1100px) {
          .ab-section {
            padding-block: 80px;
          }

          .ab-hero {
            min-height: 100vh;
            min-height: 100svh;
            padding-block: 110px 70px;
          }

          .ab-better-grid {
            grid-template-columns: minmax(0, 1fr);
          }

          .ab-col-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .ab-col-card {
            min-height: 440px;
          }
        }

        /* MOBILE */
        @media (max-width: 700px) {
          .ab-wrap {
            padding-inline: 18px;
          }

          .ab-section {
            padding-block: 56px;
          }

          .ab-hero {
            min-height: 100vh;
            min-height: 100svh;
            padding-block: 100px 56px;
          }

          .ab-hero p.ab-hero-text {
            margin-top: 14px;
            font-size: 13px;
            line-height: 1.8;
          }

          .ab-better-image {
            padding: 0 12px 12px 0;
          }

          .ab-better-image::before {
            top: 12px;
            left: 12px;
          }

          .ab-col-grid,
          .ab-svc-grid {
            grid-template-columns: minmax(0, 1fr);
            margin-top: 36px;
          }

          .ab-col-card {
            min-height: 380px;
            padding: 26px 20px;
          }

          .ab-svc-box {
            padding: 28px 20px;
          }

          .ab-timeline {
            margin-top: 40px;
          }

          .ab-timeline::before {
            left: 8px;
            transform: none;
          }

          .ab-event {
            grid-template-columns: minmax(0, 1fr);
            gap: 14px;
            padding: 20px 0 20px 34px;
          }

          .ab-event::before {
            top: 28px;
            left: 8px;
          }

          .ab-event:nth-child(n) .ab-event-card {
            grid-column: 1;
            grid-row: 1;
            text-align: left;
          }

          .ab-event:nth-child(n) .ab-event-media {
            grid-column: 1;
            grid-row: 2;
          }

          .ab-event-text {
            font-size: 13px;
          }

          .ab-event-title {
            font-size: 22px;
          }

          .ab-h2 {
            font-size: clamp(28px, 7vw, 38px);
            line-height: 1.25;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .ab-page *,
          .ab-page *::before,
          .ab-page *::after {
            animation-duration: .01ms !important;
            transition-duration: .01ms !important;
          }
        }
      `}</style>

      {/* HERO */}
      <section className="ab-section ab-hero" aria-labelledby="ab-hero-title">
        <BgImage src={IMG.kitchen} position="center 55%" />

        <div className="ab-wrap">
          <div className="ab-hero-inner">
            <h1 id="ab-hero-title">About {BRAND}</h1>

            <p className="ab-hero-text">
              {BRAND} is dedicated to providing complete and customized interior
              solutions for entire homes, bringing a luxurious and high-end
              customized living experience to our clients.
            </p>
          </div>
        </div>
      </section>

      {/* WHO WE ARE */}
      <section
        className="ab-section ab-better"
        aria-labelledby="ab-better-title"
      >
        <div className="ab-wrap">
          <div className="ab-better-grid">
            <div className="ab-better-text">
              <Eyebrow>Who We Are</Eyebrow>

              <h2 className="ab-h2" id="ab-better-title">
                Gohar Kitchen Interior –
                <em>made around your life.</em>
              </h2>

              <p>
                Your interior should reflect the way you live. That is why every
                project at <strong>{BRAND}</strong> deserves thoughtful
                planning, appropriate materials and attention to the smallest
                details.
              </p>

              <p>
                From the first conversation to the final installation, we focus
                on practical solutions, considered design and a finish that
                complements your space.
              </p>

              <div className="ab-chips">
                {[...SERVICES_MAIN, ...SERVICES_MORE].map((s) => (
                  <a className="ab-chip" key={s.label} href={s.href}>
                    {s.label}
                  </a>
                ))}
              </div>
            </div>

            <div className="ab-better-image">
              <div className="ab-better-frame">
                <img
                  src={IMG.wardrobe}
                  alt={`${BRAND} interior`}
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section
        className="ab-section ab-history"
        aria-labelledby="ab-why-title"
      >
        <div className="ab-wrap">
          <div className="ab-head is-centered">
            <Eyebrow>Why Choose Us</Eyebrow>

            <h2 className="ab-h2" id="ab-why-title">
              Thoughtful design, <em>careful finish</em>
            </h2>

            <p className="ab-sub">
              Your interior should reflect the way you live. Every project
              deserves thoughtful planning, appropriate materials and attention
              to the smallest details.
            </p>
          </div>

          <div className="ab-timeline">
            {WHY.map((w) => (
              <article className="ab-event" key={w.no}>
                <div className="ab-event-card">
                  <p className="ab-event-no">{w.no}</p>
                  <h3 className="ab-event-title">{w.title}</h3>
                  <p className="ab-event-text">{w.text}</p>
                </div>

                <div className="ab-event-media">
                  <img
                    src={w.img}
                    alt={w.title}
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section
        className="ab-section ab-services"
        aria-labelledby="ab-svc-title"
      >
        <BgImage src={IMG.media} />

        <div className="ab-wrap">
          <div className="ab-head is-centered">
            <Eyebrow>Our Services</Eyebrow>

            <h2 className="ab-h2" id="ab-svc-title">
              Interior <em>services</em>
            </h2>
          </div>

          <div className="ab-svc-grid">
            <div className="ab-svc-box">
              <h3>Interior Services</h3>

              <ul className="ab-svc-list">
                {SERVICES_MAIN.map((s) => (
                  <li key={s.label}>
                    <a href={s.href}>
                      {s.label}
                      <span>↗</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="ab-svc-box">
              <h3>Explore More</h3>

              <ul className="ab-svc-list">
                {SERVICES_MORE.map((s) => (
                  <li key={s.label}>
                    <a href={s.href}>
                      {s.label}
                      <span>↗</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}