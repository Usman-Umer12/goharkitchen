import kitchenImg from "../assets/kitchen1.webp";
import wardrobeImg from "../assets/word1.webp";
import mediaImg from "../assets/media1.webp";
import bedImg from "../assets/bed1.webp";

const IMG = {
  kitchen: kitchenImg,
  wardrobe: wardrobeImg,
  media: mediaImg,
  bed: bedImg,
};

const SYSTEMS = [
  "Kitchen Storage",
  "Wardrobe Storage",
  "Kitchen Sink",
  "Furniture Motion",
  "Smart Lighting",
  "Aluminium Application",
];

const HISTORY = [
  {
    year: "1993",
    text: "NUOMI’s predecessor “Xincheng Precision Mold Factory” was established.",
    img: IMG.kitchen,
  },
  {
    year: "2003",
    text: "“NUOMI” brand was born and became one of the first group of functional hardware manufacturers.",
    img: IMG.wardrobe,
  },
  {
    year: "2007",
    text: "NUOMI’s first plate type stainless steel pull basket – Terras series – became a benchmark for industry innovation.",
    img: IMG.media,
  },
  {
    year: "2008",
    text: "Wardrobe storage solutions launched.",
    img: IMG.bed,
  },
  {
    year: "2012",
    text: "25000m² of new factory put into production. Introducing German automated production equipment to achieve international quality standards.",
    img: IMG.kitchen,
  },
  {
    year: "2013",
    text: "NUOMI’s first nano-dry plating pull-out basket – the Champagne Rose series – led the category innovation again.",
    img: IMG.wardrobe,
  },
  {
    year: "2016",
    text: "Awarded “Top Ten Brands in the Hardware Industry” for three consecutive years. NUOMI has reached strategic cooperation with global brands.",
    img: IMG.media,
  },
  {
    year: "2017",
    text: "The Intelligent Sink was launched, starting the smart life. The furniture motion solutions launched meanwhile, further improving the production line.",
    img: IMG.bed,
  },
  {
    year: "2020",
    text: "80000m² smart production base put into operation.",
    img: IMG.kitchen,
  },
  {
    year: "2021",
    text: "Creating NUOMI whole house hardware ecological chain. Smart lighting system and high-end aluminium application system launched.",
    img: IMG.wardrobe,
  },
  {
    year: "2022",
    text: "60000m² high-end furniture fittings intelligent base construction started, completing the strategy of intelligent manufacturing strength – a critical step in upgrading.",
    img: IMG.media,
  },
];

const INNOVATION_TOP = [
  {
    value: "6",
    label: "6 Major Categories",
    text: "Independent R&D team with “horse racing” style innovation.",
  },
  {
    value: "200+",
    label: "200+ Design Patents",
    text: "More than 200 innovative design patents improve the user experience of the product.",
  },
  {
    value: "3,000+",
    label: "3000+ Items",
    text: "More than 3000 product SKU meet specific segmentation demands.",
  },
];

const INNOVATION_BOTTOM = [
  {
    value: "80,000m²",
    label: "Production Base",
    text: "International industry 4.0 digital intelligence production base.",
  },
  {
    value: "60,000m²",
    label: "Furniture Motion Manufacturing Base",
    text: "The high-end furniture motion intelligent manufacturing base.",
  },
];

const DATA = [
  {
    value: "0.01",
    text: "0.01cm precision control pursues excellent quality.",
  },
  {
    value: "7",
    text: "7 levels of strict quality control. From raw material to finished product, every product passes through strict detection.",
  },
  {
    value: "3",
    text: "3 international authoritative organizations for quality certification: ISO, SGS, TUV.",
  },
  {
    value: "10",
    text: "Slide – 10 years quality assurance, reassuring users.",
  },
  {
    value: "168",
    text: "168 hours salt spray test, super rust-resistant. Dry plating technology of surface for core products passes SGS.",
  },
  {
    value: "80000",
    text: "Slide passes SGS 80000 anti-fatigue operation test, more comfortable.",
  },
];

const SAME = [
  {
    word: "Same Style",
    text: "Minimalist light luxury runs through the hardware design of the whole house, coordinated aesthetic style, realizing the aesthetic improvement of the whole house collocation.",
    img: IMG.kitchen,
  },
  {
    word: "Same Color",
    text: "One coordinated colour language across kitchen, wardrobe, sink, motion and lighting hardware.",
    img: IMG.wardrobe,
  },
  {
    word: "Same Quality",
    text: "The same strict standard of materials, finishing and testing in every product system.",
    img: IMG.media,
  },
  {
    word: "Same Brand",
    text: "One brand and one design direction across the whole house hardware ecological chain.",
    img: IMG.bed,
  },
];

function Eyebrow({ children }) {
  return <p className="ab-eyebrow">{children}</p>;
}

function BgImage({ src, position = "center", shade = "" }) {
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
      <div className={`ab-bg-shade ${shade}`} aria-hidden="true" />
    </>
  );
}

export default function AboutUs() {
  return (
    <main className="ab-page">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Jost:wght@300;400;500;600;700&display=swap');

        .ab-page {
          --ab-accent: #c0652b;
          --ab-accent-dark: #a95320;
          --ab-ink: #1c1917;
          --ab-text: #5d5750;
          --ab-white: #ffffff;
          --ab-soft: #f7f4f0;
          --ab-line: #e4ded6;
          --ab-display: 'Cormorant Garamond', Georgia, serif;
          --ab-sans: 'Jost', Arial, sans-serif;

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
        .ab-page *::after { box-sizing: border-box; }

        .ab-page img { display: block; width: 100%; max-width: 100%; }
        .ab-page h1, .ab-page h2, .ab-page h3, .ab-page p { overflow-wrap: anywhere; }

        .ab-wrap {
          position: relative;
          width: 100%;
          max-width: 1280px;
          margin-inline: auto;
          padding-inline: clamp(20px, 5vw, 70px);
        }

        .ab-section {
          position: relative;
          isolation: isolate;
          overflow: hidden;
          padding-block: 100px;
        }

        .ab-bg-img {
          position: absolute;
          z-index: -2;
          inset: 0;
          height: 100%;
          object-fit: cover;
        }
        .ab-bg-shade { position: absolute; z-index: -1; inset: 0; }

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
        .ab-eyebrow::before { width: 26px; height: 1px; background: var(--ab-accent); content: ""; }

        .ab-h2 {
          margin: 14px 0 0;
          color: var(--ab-ink);
          font-family: var(--ab-display);
          font-size: clamp(34px, 4.2vw, 54px);
          font-weight: 600;
          letter-spacing: -.02em;
          line-height: 1.06;
        }
        .ab-h2 em { color: var(--ab-accent); font-style: normal; }

        .ab-head { max-width: 720px; }
        .ab-head.is-centered { margin-inline: auto; text-align: center; }
        .ab-head.is-centered .ab-eyebrow { justify-content: center; }
        .ab-head p.ab-sub { max-width: 560px; margin: 16px auto 0; }

        /* ---------- HERO (dark) ---------- */
        .ab-hero {
          display: flex;
          min-height: 640px;
          align-items: center;
          justify-content: center;
          padding-block: 150px 100px;
          text-align: center;
          color: #fff;
        }
        .ab-hero .ab-bg-shade { background: linear-gradient(180deg, rgba(8,8,8,.7), rgba(8,8,8,.62) 50%, rgba(8,8,8,.8)); }
        .ab-hero .ab-eyebrow { color: #f0a06a; justify-content: center; }
        .ab-hero .ab-eyebrow::before { background: #f0a06a; }
        .ab-hero h1 {
          margin: 20px 0 0;
          font-family: var(--ab-display);
          font-size: clamp(46px, 6.4vw, 88px);
          font-weight: 500;
          letter-spacing: -.02em;
          line-height: 1.04;
          color: #fff;
        }
        .ab-hero p.ab-hero-text {
          max-width: 760px;
          margin: 24px auto 0;
          color: #ece6df;
          font-size: 17px;
          font-weight: 300;
          line-height: 1.9;
        }
        .ab-scroll {
          display: inline-flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          margin-top: 38px;
          color: #fff;
          font-size: 10px;
          font-weight: 600;
          letter-spacing: .2em;
          text-transform: uppercase;
        }
        .ab-scroll::after { width: 1px; height: 42px; background: linear-gradient(#fff, transparent); content: ""; }

        /* ---------- MAKE YOUR HOME BETTER (white) ---------- */
        .ab-better { background: var(--ab-white); }
        .ab-better-grid {
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(0, 1.15fr);
          align-items: center;
          gap: clamp(36px, 6vw, 90px);
        }
        .ab-better-text p { margin: 20px 0 0; }
        .ab-better-text p:first-of-type { margin-top: 24px; }
        .ab-better-text strong { color: var(--ab-ink); font-weight: 600; }
        .ab-chips { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 28px; }
        .ab-chip {
          padding: 9px 16px;
          border: 1px solid var(--ab-line);
          background: var(--ab-soft);
          color: var(--ab-ink);
          font-size: 12px;
          font-weight: 500;
          letter-spacing: .04em;
        }
        .ab-better-image { position: relative; padding: 0 18px 18px 0; }
        .ab-better-image::before {
          position: absolute; top: 18px; right: 0; bottom: 0; left: 18px;
          border: 1px solid var(--ab-accent); content: "";
        }
        .ab-better-frame { position: relative; overflow: hidden; aspect-ratio: 4 / 3.6; background: var(--ab-soft); }
        .ab-better-frame img { height: 100%; object-fit: cover; }

        /* ---------- HISTORY TIMELINE (white) ---------- */
        .ab-history { border-top: 1px solid var(--ab-line); background: var(--ab-soft); }
        .ab-timeline { position: relative; margin-top: 64px; }
        .ab-timeline::before {
          position: absolute; top: 0; bottom: 0; left: 50%;
          width: 2px; transform: translateX(-50%);
          background: var(--ab-line); content: "";
        }
        .ab-event {
          position: relative;
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
          align-items: center;
          gap: 0 70px;
          padding-block: 22px;
        }
        .ab-event::before {
          position: absolute; top: 50%; left: 50%;
          width: 16px; height: 16px; transform: translate(-50%, -50%);
          border: 3px solid var(--ab-soft); border-radius: 50%;
          background: var(--ab-accent); content: "";
          box-shadow: 0 0 0 2px var(--ab-accent);
        }
        .ab-event-card { min-width: 0; }
        .ab-event-media { min-width: 0; }
        .ab-event-media img { aspect-ratio: 16 / 9; object-fit: cover; background: var(--ab-line); }
        .ab-event-year {
          margin: 0 0 6px;
          color: var(--ab-accent);
          font-family: var(--ab-display);
          font-size: clamp(36px, 4vw, 50px);
          font-weight: 600;
          line-height: 1;
        }
        .ab-event-text { margin: 0; color: var(--ab-ink); font-size: 15px; line-height: 1.8; }

        /* odd: text left / image right | even: image left / text right */
        .ab-event:nth-child(odd) .ab-event-card { grid-column: 1; grid-row: 1; text-align: right; }
        .ab-event:nth-child(odd) .ab-event-media { grid-column: 2; grid-row: 1; }
        .ab-event:nth-child(even) .ab-event-card { grid-column: 2; grid-row: 1; }
        .ab-event:nth-child(even) .ab-event-media { grid-column: 1; grid-row: 1; }

        /* ---------- INNOVATION (image bg, light overlay) ---------- */
        .ab-innovation .ab-bg-shade { background: rgba(255,255,255,.9); }
        .ab-stat-row { display: grid; gap: 40px 30px; margin-top: 56px; }
        .ab-stat-row.is-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
        .ab-stat-row.is-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); max-width: 860px; margin-inline: auto; }
        .ab-stat-row + .ab-stat-row { margin-top: 48px; }
        .ab-big { text-align: center; }
        .ab-big-value {
          margin: 0;
          color: var(--ab-accent);
          font-family: var(--ab-display);
          font-size: clamp(50px, 6vw, 80px);
          font-weight: 600;
          line-height: 1;
        }
        .ab-big-label {
          margin: 12px 0 8px;
          color: var(--ab-ink);
          font-size: 13px;
          font-weight: 600;
          letter-spacing: .1em;
          text-transform: uppercase;
        }
        .ab-big-text { max-width: 330px; margin: 0 auto; font-size: 14px; }

        /* ---------- DATA (white) ---------- */
        .ab-data { border-top: 1px solid var(--ab-line); background: var(--ab-white); }
        .ab-data-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          margin-top: 54px;
          border-top: 1px solid var(--ab-line);
          border-left: 1px solid var(--ab-line);
        }
        .ab-data-item {
          padding: 36px 30px;
          border-right: 1px solid var(--ab-line);
          border-bottom: 1px solid var(--ab-line);
          background: var(--ab-white);
          transition: background .25s ease;
        }
        .ab-data-item:hover { background: var(--ab-soft); }
        .ab-data-value {
          margin: 0 0 12px;
          color: var(--ab-accent);
          font-family: var(--ab-display);
          font-size: clamp(46px, 5vw, 66px);
          font-weight: 600;
          line-height: 1;
        }
        .ab-data-item p:last-child { margin: 0; color: var(--ab-ink); font-size: 14px; line-height: 1.8; }

        /* ---------- ECOLOGICAL CHAIN (white + image cards) ---------- */
        .ab-chain { border-top: 1px solid var(--ab-line); background: var(--ab-soft); }
        .ab-same-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 18px;
          margin-top: 54px;
        }
        .ab-same-card {
          position: relative;
          isolation: isolate;
          display: flex;
          min-height: 430px;
          flex-direction: column;
          justify-content: flex-end;
          overflow: hidden;
          padding: 30px 26px;
          color: #fff;
        }
        .ab-same-card .ab-bg-img { transition: transform .5s ease; }
        .ab-same-card:hover .ab-bg-img { transform: scale(1.06); }
        .ab-same-card .ab-bg-shade { background: linear-gradient(0deg, rgba(8,8,8,.92) 0%, rgba(8,8,8,.5) 62%, rgba(8,8,8,.2) 100%); }
        .ab-same-card h3 {
          margin: 0 0 10px;
          color: #fff;
          font-family: var(--ab-display);
          font-size: 31px;
          font-weight: 600;
          line-height: 1.1;
          text-transform: uppercase;
          letter-spacing: .02em;
        }
        .ab-same-card h3::before { display: block; width: 30px; height: 2px; margin-bottom: 14px; background: #f0a06a; content: ""; }
        .ab-same-card p { margin: 0; color: #e9e2da; font-size: 13.5px; line-height: 1.8; }

        /* ---------- TABLET ---------- */
        @media (max-width: 1000px) {
          .ab-section { padding-block: 72px; }
          .ab-hero { min-height: 560px; }
          .ab-better-grid { grid-template-columns: minmax(0, 1fr); }
          .ab-stat-row.is-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 30px 16px; }
          .ab-data-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
          .ab-same-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
          .ab-same-card { min-height: 360px; }
          .ab-event { gap: 0 40px; }
        }

        /* ---------- MOBILE ---------- */
        @media (max-width: 700px) {
          .ab-wrap { padding-inline: 18px; }
          .ab-section { padding-block: 54px; }
          .ab-hero { min-height: 480px; padding-block: 120px 64px; }
          .ab-hero p.ab-hero-text { font-size: 14.5px; }
          .ab-better-image { padding: 0 12px 12px 0; }
          .ab-better-image::before { top: 12px; left: 12px; }

          .ab-timeline { margin-top: 40px; }
          .ab-timeline::before { left: 8px; transform: none; }
          .ab-event {
            grid-template-columns: minmax(0, 1fr);
            gap: 14px;
            padding: 20px 0 20px 34px;
          }
          .ab-event::before { top: 28px; left: 8px; }
          .ab-event:nth-child(n) .ab-event-card { grid-column: 1; grid-row: 1; text-align: left; }
          .ab-event:nth-child(n) .ab-event-media { grid-column: 1; grid-row: 2; }
          .ab-event-text { font-size: 14px; }

          .ab-stat-row.is-3,
          .ab-stat-row.is-2 { grid-template-columns: minmax(0, 1fr); gap: 34px; margin-top: 38px; }
          .ab-data-grid { grid-template-columns: minmax(0, 1fr); margin-top: 36px; }
          .ab-data-item { padding: 26px 20px; }
          .ab-same-grid { grid-template-columns: minmax(0, 1fr); margin-top: 36px; }
          .ab-same-card { min-height: 300px; padding: 24px 20px; }
        }

        @media (prefers-reduced-motion: reduce) {
          .ab-page *, .ab-page *::before, .ab-page *::after {
            animation-duration: .01ms !important;
            transition-duration: .01ms !important;
          }
        }
      `}</style>

      {/* HERO — dark, image background */}
      <section className="ab-section ab-hero" aria-labelledby="ab-hero-title">
        <BgImage src={IMG.kitchen} position="center 55%" />
        <div className="ab-wrap">
          <Eyebrow>Who We Are</Eyebrow>
          <h1 id="ab-hero-title">About NUOMI</h1>
          <p className="ab-hero-text">
            NUOMI was born in 2003, dedicated to providing integrated and
            comprehensive customized hardware solutions for entire homes,
            bringing a luxurious and high-end customized living experience to
            global consumers.
          </p>
          <span className="ab-scroll">Scroll</span>
        </div>
      </section>

      {/* MAKE YOUR HOME BETTER */}
      <section className="ab-section ab-better" aria-labelledby="ab-better-title">
        <div className="ab-wrap">
          <div className="ab-better-grid">
            <div className="ab-better-text">
              <Eyebrow>Our Concept</Eyebrow>
              <h2 className="ab-h2" id="ab-better-title">
                NUOMI – Make your
                <br />
                <em>home better.</em>
              </h2>
              <p>
                As one of China’s leading high-end home hardware brands,
                NUOMI pioneered and practices the concept of
                <strong> “whole-house hardware ecological chain.” </strong>
                It uses the “four-same” concept of the same style, same
                color, same quality, and same brand to achieve design
                upgrades in hardware aesthetics.
              </p>
              <p>
                NUOMI has fully laid out six major product systems, including
                kitchen storage solutions, wardrobe storage solutions,
                kitchen sink, furniture motion solutions, smart lighting
                system and high-end custom aluminum application system.
              </p>
              <div className="ab-chips">
                {SYSTEMS.map((s) => (
                  <span className="ab-chip" key={s}>{s}</span>
                ))}
              </div>
            </div>

            <div className="ab-better-image">
              <div className="ab-better-frame">
                <img src={IMG.wardrobe} alt="NUOMI whole-house interior" loading="lazy" decoding="async" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DEVELOPMENT HISTORY */}
      <section className="ab-section ab-history" aria-labelledby="ab-history-title">
        <div className="ab-wrap">
          <div className="ab-head is-centered">
            <Eyebrow>Since 1993</Eyebrow>
            <h2 className="ab-h2" id="ab-history-title">
              NUOMI’s <em>development history</em>
            </h2>
          </div>

          <div className="ab-timeline">
            {HISTORY.map((item) => (
              <article className="ab-event" key={item.year}>
                <div className="ab-event-card">
                  <p className="ab-event-year">{item.year}</p>
                  <p className="ab-event-text">{item.text}</p>
                </div>
                <div className="ab-event-media">
                  <img src={item.img} alt={`NUOMI ${item.year}`} loading="lazy" decoding="async" />
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* INNOVATION */}
      <section className="ab-section ab-innovation" aria-labelledby="ab-innovation-title">
        <BgImage src={IMG.media} position="center" />
        <div className="ab-wrap">
          <div className="ab-head is-centered">
            <Eyebrow>Innovation</Eyebrow>
            <h2 className="ab-h2" id="ab-innovation-title">
              NUOMI <em>innovation</em>
            </h2>
            <p className="ab-sub">
              Whole house hardware, the whole house is luxuriously matched.
            </p>
          </div>

          <div className="ab-stat-row is-3">
            {INNOVATION_TOP.map((s) => (
              <div className="ab-big" key={s.label}>
                <p className="ab-big-value">{s.value}</p>
                <p className="ab-big-label">{s.label}</p>
                <p className="ab-big-text">{s.text}</p>
              </div>
            ))}
          </div>

          <div className="ab-stat-row is-2">
            {INNOVATION_BOTTOM.map((s) => (
              <div className="ab-big" key={s.label}>
                <p className="ab-big-value">{s.value}</p>
                <p className="ab-big-label">{s.label}</p>
                <p className="ab-big-text">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* NUOMI DATA */}
      <section className="ab-section ab-data" aria-labelledby="ab-data-title">
        <div className="ab-wrap">
          <div className="ab-head is-centered">
            <Eyebrow>Quality in Numbers</Eyebrow>
            <h2 className="ab-h2" id="ab-data-title">
              NUOMI <em>data</em>
            </h2>
          </div>

          <div className="ab-data-grid">
            {DATA.map((d) => (
              <article className="ab-data-item" key={d.value}>
                <p className="ab-data-value">{d.value}</p>
                <p>{d.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* WHOLE-HOUSE ECOLOGICAL CHAIN */}
      <section className="ab-section ab-chain" aria-labelledby="ab-chain-title">
        <div className="ab-wrap">
          <div className="ab-head is-centered">
            <Eyebrow>Four-Same Concept</Eyebrow>
            <h2 className="ab-h2" id="ab-chain-title">
              NUOMI whole-house
              <br />
              <em>ecological chain</em>
            </h2>
          </div>

          <div className="ab-same-grid">
            {SAME.map((item) => (
              <article className="ab-same-card" key={item.word}>
                <BgImage src={item.img} />
                <h3>{item.word}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}