
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ChevronLeft, ChevronRight, X } from "lucide-react";
import { supabase } from "../lib/supabase";

/* =========================================================
   SETTINGS
========================================================= */

const TABLE = "project_images";

/* =========================================================
   GROUP PROJECT IMAGES
========================================================= */

function groupRows(rows) {
  const groups = new Map();

  (rows || []).forEach((row) => {
    const key = row.project_id || `legacy-${row.id}`;

    if (!groups.has(key)) {
      groups.set(key, {
        id: key,
        title: row.project_title || row.title || "Interior Project",
        category: row.category || "Interior Design",
        description:
          row.project_description || row.description || "",
        images: [],
      });
    }

    if (row.image_url) {
      groups.get(key).images.push({
        id: row.id,
        src: row.image_url,
        alt: `${
          row.project_title || row.title || "Interior project"
        } by Gohar Kitchen Interior`,
      });
    }
  });

  return [...groups.values()].filter(
    (project) => project.images.length > 0
  );
}

/* =========================================================
   PROJECT GALLERY
========================================================= */

function Gallery({ project, initialIndex = 0, onClose }) {
  const [index, setIndex] = useState(initialIndex);
  const touchStart = useRef(null);

  const current = project.images[index];
  const total = project.images.length;

  const previous = useCallback(() => {
    setIndex((i) => (i - 1 + total) % total);
  }, [total]);

  const next = useCallback(() => {
    setIndex((i) => (i + 1) % total);
  }, [total]);

  useEffect(() => {
    const oldOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowLeft") previous();
      if (event.key === "ArrowRight") next();
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = oldOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose, previous, next]);

  return (
    <div
      className="ourp-lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={`${project.title} gallery`}
      onClick={onClose}
    >
      <div
        className="ourp-lightboxbar"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="ourp-lightbox-title">
          <span>{project.title}</span>
          <small>
            {String(index + 1).padStart(2, "0")} /{" "}
            {String(total).padStart(2, "0")}
          </small>
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close gallery"
          className="ourp-close"
        >
          <X size={20} />
        </button>
      </div>

      <div
        className="ourp-stage"
        onClick={(event) => event.stopPropagation()}
        onTouchStart={(event) => {
          touchStart.current = event.touches[0].clientX;
        }}
        onTouchEnd={(event) => {
          if (touchStart.current === null) return;

          const delta =
            event.changedTouches[0].clientX - touchStart.current;

          if (Math.abs(delta) > 45) {
            delta > 0 ? previous() : next();
          }

          touchStart.current = null;
        }}
      >
        {total > 1 && (
          <button
            className="ourp-nav prev"
            type="button"
            onClick={previous}
            aria-label="Previous image"
          >
            <ChevronLeft size={23} />
          </button>
        )}

        <img
          key={current.id}
          src={current.src}
          alt={current.alt}
        />

        {total > 1 && (
          <button
            className="ourp-nav next"
            type="button"
            onClick={next}
            aria-label="Next image"
          >
            <ChevronRight size={23} />
          </button>
        )}
      </div>

      {total > 1 && (
        <div
          className="ourp-thumbs"
          onClick={(event) => event.stopPropagation()}
        >
          {project.images.map((image, i) => (
            <button
              type="button"
              className={i === index ? "active" : ""}
              key={image.id}
              onClick={() => setIndex(i)}
              aria-label={`View image ${i + 1}`}
              aria-current={i === index ? "true" : undefined}
            >
              <img src={image.src} alt="" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* =========================================================
   REVEAL ANIMATION
========================================================= */

function ProjectRow({ project, index, onOpen }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    if (
      typeof IntersectionObserver === "undefined" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.08 }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  const reversed = index % 2 === 1;

  return (
    <article
      ref={ref}
      className={`ourp-row ${reversed ? "reverse" : ""} ${
        visible ? "visible" : ""
      }`}
    >
      <button
        className="ourp-media"
        type="button"
        onClick={() => onOpen(0)}
        aria-label={`View ${project.title} gallery`}
      >
        <img
          src={project.images[0].src}
          alt={project.images[0].alt}
          loading={index < 2 ? "eager" : "lazy"}
          decoding="async"
        />

        <span className="ourp-media-shade">
          <span>
            Explore Project <b>↗</b>
          </span>
          <small>
            {String(project.images.length).padStart(2, "0")} IMAGES
          </small>
        </span>
      </button>

      <div className="ourp-info">
        <span className="ourp-number">
          {String(index + 1).padStart(2, "0")}
        </span>

        <span className="ourp-category">{project.category}</span>

        <h2>{project.title}</h2>

        <span className="ourp-rule" />

        <p>
          {project.description ||
            "A thoughtfully designed interior combining refined finishes, practical planning and timeless details."}
        </p>

        <button
          className="ourp-button"
          type="button"
          onClick={() => onOpen(0)}
        >
          View Project
          <ArrowRight size={15} />
        </button>
      </div>
    </article>
  );
}

/* =========================================================
   MAIN PAGE
========================================================= */

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [active, setActive] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");

    const { data, error: queryError } = await supabase
      .from(TABLE)
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });

    if (queryError) {
      console.error("Projects load failed:", queryError);
      setError(
        "Our projects are temporarily unavailable. Please try again shortly."
      );
      setProjects([]);
    } else {
      setProjects(groupRows(data));
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const totalImages = useMemo(
    () =>
      projects.reduce(
        (sum, project) => sum + project.images.length,
        0
      ),
    [projects]
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&display=swap');

        .ourp,
        .ourp *,
        .ourp-lightbox,
        .ourp-lightbox * {
          box-sizing: border-box;
        }

        .ourp {
          --accent: #C0652B;
          --accent-soft: #E08A4F;
          --font: 'Montserrat', system-ui, -apple-system, 'Segoe UI', sans-serif;
          width: 100%;
          overflow: clip;
          background: #fff;
          color: #171717;
          font-family: var(--font);
          -webkit-font-smoothing: antialiased;
        }

        .ourp button,
        .ourp-lightbox button {
          font-family: var(--font);
        }

        .ourp button {
          -webkit-tap-highlight-color: transparent;
        }

        .ourp-container {
          width: 100%;
          max-width: 1440px;
          margin: 0 auto;
          padding: 0 18px;
        }

        @media (min-width: 640px) {
          .ourp-container {
            padding: 0 32px;
          }
        }

        @media (min-width: 1024px) {
          .ourp-container {
            padding: 0 48px;
          }
        }

        @media (min-width: 1440px) {
          .ourp-container {
            padding: 0 64px;
          }
        }

        /* =========================================
           BLACK HEADING — MATCHES CORIAN PAGE
        ========================================= */

        .ourp-hero {
          position: relative;
          isolation: isolate;
          overflow: hidden;
          background: #000;
          color: #fff;
          padding: 104px 16px 56px;
        }

        .ourp-hero::before {
          content: "";
          position: absolute;
          z-index: -1;
          inset: 0;
          pointer-events: none;
          background:
            radial-gradient(
              ellipse at 82% 12%,
              rgba(192, 101, 43, .10),
              transparent 43%
            ),
            linear-gradient(115deg, #000 0%, #0b0b0b 100%);
        }

        .ourp-hero-inner {
          width: 100%;
          max-width: 1320px;
          margin: 0 auto;
          padding: 0;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 28px;
        }

        .ourp-hero-copy {
          min-width: 0;
          width: 100%;
        }

        .ourp-eyebrow {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 0 0 18px;
          color: var(--accent-soft);
          font-size: 10px;
          font-weight: 600;
          letter-spacing: .24em;
          line-height: 1.7;
          text-transform: uppercase;
        }

        .ourp-eyebrow::before {
          content: "";
          width: 30px;
          height: 1px;
          flex: 0 0 auto;
          background: var(--accent);
        }

        .ourp-hero h1 {
          max-width: 850px;
          margin: 0;
          color: #fff;
          font-family: var(--font);
          font-size: clamp(29px, 6vw, 54px);
          font-weight: 700;
          line-height: 1.18;
          letter-spacing: .025em;
          text-transform: uppercase;
          overflow-wrap: anywhere;
        }

        .ourp-hero h1 em {
          color: var(--accent);
          font-style: normal;
        }

        .ourp-hero-rule {
          display: block;
          width: 56px;
          height: 2px;
          margin: 20px 0;
          background: var(--accent);
        }

        .ourp-hero p {
          max-width: 680px;
          margin: 0;
          color: rgba(255,255,255,.72);
          font-family: var(--font);
          font-size: 12px;
          font-weight: 400;
          line-height: 1.95;
          letter-spacing: .005em;
        }

        /* PROJECT STAT */

        .ourp-stat {
          display: flex;
          align-items: center;
          gap: 16px;
          width: 100%;
          max-width: 330px;
          padding: 17px 19px;
          border: 1px solid rgba(255,255,255,.13);
          border-left: 2px solid var(--accent);
          background: rgba(255,255,255,.025);
        }

        .ourp-stat-number {
          color: #fff;
          font-size: clamp(35px, 5vw, 47px);
          font-weight: 700;
          line-height: 1;
          letter-spacing: -.05em;
        }

        .ourp-stat-divider {
          width: 1px;
          height: 39px;
          flex: 0 0 auto;
          background: rgba(255,255,255,.2);
        }

        .ourp-stat-details {
          min-width: 0;
        }

        .ourp-stat-details strong {
          display: block;
          color: #fff;
          font-size: 10px;
          font-weight: 600;
          line-height: 1.6;
          letter-spacing: .12em;
          text-transform: uppercase;
        }

        .ourp-stat-details small {
          display: block;
          margin-top: 5px;
          color: rgba(255,255,255,.52);
          font-size: 10px;
          line-height: 1.6;
        }

        /* =========================================
           PROJECT LIST
        ========================================= */

        .ourp-list {
          background: #fff;
          padding: 46px 0 12px;
        }

        .ourp-row {
          display: grid;
          grid-template-columns: minmax(0, 1fr);
          align-items: center;
          gap: 23px;
          margin-bottom: 55px;
          opacity: 0;
          transform: translateY(18px);
          transition: opacity .6s ease, transform .6s ease;
        }

        .ourp-row.visible {
          opacity: 1;
          transform: translateY(0);
        }

        /* PROJECT IMAGE */

        .ourp-media {
          position: relative;
          display: block;
          width: 100%;
          aspect-ratio: 1.18 / 1;
          padding: 0;
          overflow: hidden;
          border: 0;
          border-radius: 2px;
          background: #eee;
          text-align: left;
          cursor: zoom-in;
        }

        .ourp-media::after {
          content: "";
          position: absolute;
          inset: 12px;
          border: 1px solid rgba(255,255,255,.65);
          opacity: 0;
          pointer-events: none;
          transition: opacity .3s ease;
        }

        .ourp-media > img {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform .7s ease;
        }

        .ourp-media:hover > img {
          transform: scale(1.035);
        }

        .ourp-media:hover::after {
          opacity: 1;
        }

        .ourp-media-shade {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 12px;
          padding: 18px;
          background: linear-gradient(
            to top,
            rgba(0,0,0,.72),
            transparent 48%
          );
          color: #fff;
          opacity: 0;
          transition: opacity .3s ease;
        }

        .ourp-media:hover .ourp-media-shade,
        .ourp-media:focus-visible .ourp-media-shade {
          opacity: 1;
        }

        .ourp-media-shade > span {
          font-size: 10px;
          font-weight: 600;
          letter-spacing: .09em;
          text-transform: uppercase;
        }

        .ourp-media-shade b {
          margin-left: 5px;
          color: var(--accent-soft);
        }

        .ourp-media-shade small {
          font-size: 9px;
          font-weight: 500;
          letter-spacing: .1em;
          white-space: nowrap;
        }

        /* PROJECT DETAILS */

        .ourp-info {
          position: relative;
          min-width: 0;
          padding: 2px 0;
        }

        .ourp-number {
          display: block;
          margin-bottom: 13px;
          color: transparent;
          font-size: clamp(52px, 8vw, 76px);
          font-weight: 700;
          line-height: .95;
          letter-spacing: -.06em;
          -webkit-text-stroke: 1px rgba(23,23,23,.23);
        }

        .ourp-category {
          display: block;
          margin-bottom: 10px;
          color: var(--accent);
          font-size: 10px;
          font-weight: 600;
          line-height: 1.7;
          letter-spacing: .16em;
          text-transform: uppercase;
        }

        .ourp-info h2 {
          margin: 0;
          color: #171717;
          font-family: var(--font);
          font-size: clamp(21px, 3vw, 31px);
          font-weight: 700;
          line-height: 1.35;
          letter-spacing: -.025em;
          overflow-wrap: anywhere;
        }

        .ourp-rule {
          display: block;
          width: 39px;
          height: 2px;
          margin: 17px 0;
          background: var(--accent);
        }

        .ourp-info p {
          max-width: 460px;
          margin: 0;
          color: #686868;
          font-size: 12px;
          font-weight: 400;
          line-height: 1.95;
          white-space: pre-line;
        }

        /* PROJECT BUTTON */

        .ourp-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 13px;
          min-height: 45px;
          margin-top: 22px;
          padding: 0 17px;
          border: 1px solid #222;
          border-radius: 0;
          background: #171717;
          color: #fff;
          font-size: 10px;
          font-weight: 600;
          letter-spacing: .1em;
          text-transform: uppercase;
          cursor: pointer;
          transition:
            background .25s ease,
            border-color .25s ease,
            color .25s ease;
        }

        .ourp-button svg {
          transition: transform .25s ease;
        }

        .ourp-button:hover {
          border-color: var(--accent);
          background: var(--accent);
          color: #fff;
        }

        .ourp-button:hover svg {
          transform: translateX(4px);
        }

        /* LOADING / EMPTY / ERROR */

        .ourp-state {
          display: flex;
          min-height: 250px;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 40px 16px;
          color: #777;
          font-size: 12px;
          line-height: 1.9;
          text-align: center;
        }

        .ourp-state button {
          min-height: 42px;
          margin-top: 14px;
          padding: 0 19px;
          border: 1px solid #222;
          background: #171717;
          color: #fff;
          font-size: 10px;
          font-weight: 600;
          letter-spacing: .1em;
          text-transform: uppercase;
          cursor: pointer;
        }

        .ourp-state button:hover {
          background: var(--accent);
          border-color: var(--accent);
        }

        /* =========================================
           PROFESSIONAL BOTTOM CTA
        ========================================= */

        .ourp-cta {
          position: relative;
          isolation: isolate;
          overflow: hidden;
          padding: 58px 0;
          background: #050505;
          color: #fff;
        }

        .ourp-cta::before {
          content: "";
          position: absolute;
          z-index: -1;
          top: 50%;
          right: -130px;
          width: 320px;
          height: 320px;
          border: 1px solid rgba(192,101,43,.18);
          border-radius: 50%;
          transform: translateY(-50%);
          pointer-events: none;
        }

        .ourp-cta::after {
          content: "";
          position: absolute;
          z-index: -1;
          top: 50%;
          right: -70px;
          width: 200px;
          height: 200px;
          border: 1px solid rgba(255,255,255,.08);
          border-radius: 50%;
          transform: translateY(-50%);
          pointer-events: none;
        }

        .ourp-cta-inner {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 25px;
        }

        .ourp-cta-copy {
          width: 100%;
          max-width: 780px;
        }

        .ourp-cta .ourp-eyebrow {
          margin-bottom: 15px;
        }

        .ourp-cta h2 {
          max-width: 720px;
          margin: 0;
          color: #fff;
          font-family: var(--font);
          font-size: clamp(25px, 5vw, 43px);
          font-weight: 700;
          line-height: 1.3;
          letter-spacing: -.025em;
          text-transform: uppercase;
          overflow-wrap: anywhere;
        }

        .ourp-cta h2 em {
          color: var(--accent-soft);
          font-style: normal;
        }

        .ourp-cta p {
          max-width: 590px;
          margin: 15px 0 0;
          color: rgba(255,255,255,.65);
          font-size: 12px;
          line-height: 1.95;
        }

        .ourp-cta-action {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          min-height: 48px;
          flex: 0 0 auto;
          padding: 0 21px;
          border: 1px solid var(--accent);
          background: var(--accent);
          color: #fff;
          text-decoration: none;
          font-size: 10px;
          font-weight: 600;
          letter-spacing: .1em;
          text-transform: uppercase;
          transition:
            background .25s ease,
            border-color .25s ease;
        }

        .ourp-cta-action svg {
          transition: transform .25s ease;
        }

        .ourp-cta-action:hover {
          border-color: #fff;
          background: #fff;
          color: #111;
        }

        .ourp-cta-action:hover svg {
          transform: translateX(4px);
        }

        .ourp-cta-bottom {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-top: 30px;
          padding-top: 16px;
          border-top: 1px solid rgba(255,255,255,.12);
          color: rgba(255,255,255,.48);
          font-size: 9px;
          font-weight: 500;
          letter-spacing: .14em;
          line-height: 1.7;
          text-transform: uppercase;
        }

        .ourp-cta-bottom span {
          display: inline-block;
          width: 6px;
          height: 6px;
          flex: 0 0 auto;
          border-radius: 50%;
          background: var(--accent);
        }

        /* =========================================
           FULLSCREEN GALLERY
        ========================================= */

        .ourp-lightbox {
          position: fixed;
          inset: 0;
          z-index: 99999;
          display: flex;
          flex-direction: column;
          background: rgba(5,5,5,.98);
          animation: ourp-fade .2s ease both;
        }

        .ourp-lightboxbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 15px;
          padding: 13px 16px;
          border-bottom: 1px solid rgba(255,255,255,.1);
          color: #fff;
        }

        .ourp-lightbox-title {
          display: flex;
          min-width: 0;
          flex-direction: column;
          gap: 5px;
        }

        .ourp-lightbox-title > span {
          overflow: hidden;
          color: #fff;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: .08em;
          text-overflow: ellipsis;
          text-transform: uppercase;
          white-space: nowrap;
        }

        .ourp-lightbox-title small {
          color: var(--accent-soft);
          font-size: 10px;
          letter-spacing: .12em;
        }

        .ourp-close {
          display: flex;
          width: 40px;
          height: 40px;
          flex: 0 0 auto;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(255,255,255,.25);
          border-radius: 50%;
          background: transparent;
          color: #fff;
          cursor: pointer;
          transition: background .2s ease, color .2s ease;
        }

        .ourp-close:hover {
          background: #fff;
          color: #111;
        }

        .ourp-stage {
          position: relative;
          display: flex;
          min-height: 0;
          flex: 1;
          align-items: center;
          justify-content: center;
          padding: 10px 48px;
        }

        .ourp-stage > img {
          display: block;
          max-width: 100%;
          max-height: calc(100dvh - 155px);
          width: auto;
          height: auto;
          object-fit: contain;
          animation: ourp-fade .2s ease both;
        }

        .ourp-nav {
          position: absolute;
          top: 50%;
          display: flex;
          width: 40px;
          height: 40px;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(255,255,255,.25);
          border-radius: 50%;
          background: rgba(0,0,0,.55);
          color: #fff;
          cursor: pointer;
          transform: translateY(-50%);
          transition: background .2s ease, color .2s ease;
        }

        .ourp-nav:hover {
          background: #fff;
          color: #111;
        }

        .ourp-nav.prev {
          left: 8px;
        }

        .ourp-nav.next {
          right: 8px;
        }

        .ourp-thumbs {
          display: flex;
          justify-content: flex-start;
          gap: 8px;
          overflow-x: auto;
          padding: 10px 14px 16px;
          scrollbar-width: thin;
          scrollbar-color: #555 transparent;
        }

        .ourp-thumbs button {
          width: 54px;
          height: 42px;
          flex: 0 0 auto;
          padding: 0;
          overflow: hidden;
          border: 1px solid transparent;
          background: transparent;
          opacity: .55;
          cursor: pointer;
          transition: opacity .2s ease, border-color .2s ease;
        }

        .ourp-thumbs button.active {
          border-color: var(--accent-soft);
          opacity: 1;
        }

        .ourp-thumbs img {
          display: block;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        @keyframes ourp-fade {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        /* =========================================
           TABLET / DESKTOP
        ========================================= */

        @media (min-width: 640px) {
          .ourp-hero {
            padding: 124px 32px 68px;
          }

          .ourp-hero p {
            font-size: 13px;
          }

          .ourp-eyebrow {
            font-size: 11px;
            letter-spacing: .27em;
          }

          .ourp-stat {
            max-width: 350px;
            padding: 19px 22px;
          }

          .ourp-list {
            padding-top: 56px;
          }

          .ourp-row {
            gap: 28px;
            margin-bottom: 72px;
          }

          .ourp-media {
            aspect-ratio: 1.3 / 1;
          }

          .ourp-info p {
            font-size: 13px;
          }

          .ourp-cta {
            padding: 68px 0;
          }

          .ourp-cta p {
            font-size: 13px;
          }

          .ourp-lightboxbar {
            padding: 16px 24px;
          }

          .ourp-thumbs {
            justify-content: center;
          }
        }

        @media (min-width: 900px) {
          .ourp-hero {
            padding: 136px 48px 76px;
          }

          .ourp-hero-inner {
            flex-direction: row;
            align-items: flex-end;
            justify-content: space-between;
            gap: 45px;
          }

          .ourp-hero-copy {
            flex: 1;
          }

          .ourp-stat {
            width: 245px;
            margin-bottom: 5px;
          }

          .ourp-cta-inner {
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
            gap: 35px;
          }

          .ourp-cta-action {
            margin-top: 0;
          }
        }

        @media (min-width: 1024px) {
          .ourp-row {
            grid-template-columns: repeat(12, minmax(0, 1fr));
            gap: 0 45px;
            margin-bottom: 95px;
          }

          .ourp-media {
            grid-column: 1 / span 7;
            grid-row: 1;
            aspect-ratio: 1.32 / 1;
          }

          .ourp-info {
            grid-column: 8 / span 5;
            grid-row: 1;
          }

          .ourp-row.reverse .ourp-media {
            grid-column: 6 / span 7;
          }

          .ourp-row.reverse .ourp-info {
            grid-column: 1 / span 5;
          }

          .ourp-info h2 {
            font-size: clamp(25px, 2.3vw, 34px);
          }

          .ourp-number {
            font-size: 74px;
          }

          .ourp-list {
            padding-top: 72px;
          }

          .ourp-cta {
            padding: 78px 0;
          }
        }

        /* =========================================
           MOBILE
        ========================================= */

        @media (max-width: 639px) {
          .ourp-hero {
            padding: 88px 16px 42px;
          }

          .ourp-hero-inner {
            gap: 25px;
          }

          .ourp-eyebrow {
            gap: 9px;
            margin-bottom: 15px;
            font-size: 9px;
            letter-spacing: .2em;
          }

          .ourp-eyebrow::before {
            width: 23px;
          }

          .ourp-hero h1 {
            font-size: clamp(26px, 7.2vw, 38px);
            line-height: 1.23;
          }

          .ourp-hero-rule {
            width: 43px;
            margin: 17px 0;
          }

          .ourp-hero p {
            font-size: 11.5px;
            line-height: 1.9;
          }

          .ourp-stat {
            max-width: 100%;
            padding: 14px 16px;
          }

          .ourp-stat-number {
            font-size: 36px;
          }

          .ourp-list {
            padding-top: 31px;
          }

          .ourp-row {
            gap: 17px;
            margin-bottom: 45px;
          }

          .ourp-media {
            aspect-ratio: 1 / .83;
          }

          .ourp-media::after {
            inset: 8px;
          }

          .ourp-media-shade {
            padding: 12px;
            opacity: 1;
          }

          .ourp-media-shade > span,
          .ourp-media-shade small {
            font-size: 8px;
          }

          .ourp-number {
            margin-bottom: 9px;
            font-size: 51px;
          }

          .ourp-category {
            margin-bottom: 7px;
            font-size: 9px;
            letter-spacing: .13em;
          }

          .ourp-info h2 {
            font-size: clamp(20px, 5.7vw, 26px);
            line-height: 1.35;
          }

          .ourp-rule {
            width: 32px;
            margin: 13px 0;
          }

          .ourp-info p {
            font-size: 11px;
            line-height: 1.85;
          }

          .ourp-button {
            min-height: 42px;
            margin-top: 17px;
            padding: 0 13px;
            font-size: 9px;
          }

          .ourp-cta {
            padding: 47px 0;
          }

          .ourp-cta-inner {
            gap: 23px;
          }

          .ourp-cta h2 {
            font-size: clamp(23px, 6.2vw, 32px);
            line-height: 1.35;
          }

          .ourp-cta p {
            margin-top: 12px;
            font-size: 11px;
            line-height: 1.9;
          }

          .ourp-cta-action {
            width: 100%;
            min-height: 47px;
            padding: 0 15px;
            font-size: 9px;
          }

          .ourp-cta-bottom {
            margin-top: 23px;
            padding-top: 14px;
            font-size: 8px;
            letter-spacing: .1em;
          }

          .ourp-cta::before {
            right: -210px;
          }

          .ourp-cta::after {
            right: -155px;
          }

          .ourp-lightboxbar {
            padding: 10px 12px;
          }

          .ourp-stage {
            padding: 8px 35px;
          }

          .ourp-stage > img {
            max-height: calc(100dvh - 155px);
          }

          .ourp-nav {
            width: 32px;
            height: 32px;
          }

          .ourp-nav.prev {
            left: 3px;
          }

          .ourp-nav.next {
            right: 3px;
          }

          .ourp-thumbs {
            justify-content: flex-start;
            padding: 8px 10px 13px;
          }

          .ourp-thumbs button {
            width: 46px;
            height: 36px;
          }
        }

        @media (max-width: 360px) {
          .ourp-hero h1 {
            font-size: 25px;
          }

          .ourp-media-shade {
            gap: 5px;
            padding: 9px;
          }

          .ourp-media-shade > span,
          .ourp-media-shade small {
            font-size: 7px;
          }

          .ourp-cta h2 {
            font-size: 22px;
          }
        }

        @media (hover: none) {
          .ourp-media-shade {
            opacity: 1;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .ourp *,
          .ourp-lightbox,
          .ourp-lightbox * {
            animation: none !important;
            transition: none !important;
          }

          .ourp-row {
            opacity: 1;
            transform: none;
          }
        }
      `}</style>

      <main className="ourp">
        {/* BLACK HEADING — CORIAN-STYLE DESIGN */}
        <section className="ourp-hero" aria-labelledby="ourp-title">
          <div className="ourp-hero-inner">
            <div className="ourp-hero-copy">
              <span className="ourp-eyebrow">
                Our Work &amp; Portfolio
              </span>

              <h1 id="ourp-title">
                Our <em>Projects</em>
              </h1>

              <span className="ourp-hero-rule" />

              <p>
                Explore our completed interior projects, thoughtfully
                designed to combine elegant finishes, practical layouts
                and lasting quality. Discover kitchens and interior spaces
                created around individual lifestyles, with attention to
                every detail.
              </p>
            </div>

            <div className="ourp-stat">
              <strong className="ourp-stat-number">
                {String(projects.length).padStart(2, "0")}
              </strong>

              <span className="ourp-stat-divider" />

              <div className="ourp-stat-details">
                <strong>Featured Projects</strong>
                <small>
                  {totalImages} portfolio{" "}
                  {totalImages === 1 ? "image" : "images"}
                </small>
              </div>
            </div>
          </div>
        </section>

        {/* PROJECTS */}
        <section
          className="ourp-list"
          aria-label="Our completed projects"
        >
          <div className="ourp-container">
            {loading ? (
              <div className="ourp-state">
                Loading our projects...
              </div>
            ) : error ? (
              <div className="ourp-state">
                <p>{error}</p>
                <button type="button" onClick={load}>
                  Try Again
                </button>
              </div>
            ) : projects.length === 0 ? (
              <div className="ourp-state">
                Our latest projects will be showcased here soon.
              </div>
            ) : (
              projects.map((project, index) => (
                <ProjectRow
                  key={project.id}
                  project={project}
                  index={index}
                  onOpen={(imageIndex) =>
                    setActive({ project, imageIndex })
                  }
                />
              ))
            )}
          </div>
        </section>

        {/* PROFESSIONAL BOTTOM CTA */}
        <section className="ourp-cta" aria-labelledby="ourp-cta-title">
          <div className="ourp-container">
            <div className="ourp-cta-inner">
              <div className="ourp-cta-copy">
                <span className="ourp-eyebrow">
                  Your Vision, Our Expertise
                </span>

                <h2 id="ourp-cta-title">
                  Let’s Design Your{" "}
                  <em>Dream Space.</em>
                </h2>

                <p>
                  Planning a new kitchen or transforming your interior?
                  Share your ideas with our team and let’s create a
                  beautiful, functional space tailored to you.
                </p>
              </div>

              <Link to="/contact" className="ourp-cta-action">
                Discuss Your Project
                <ArrowRight size={16} />
              </Link>
            </div>

            <div className="ourp-cta-bottom">
              <span />
              Thoughtful Design. Quality Craftsmanship. Timeless Spaces.
            </div>
          </div>
        </section>
      </main>

      {active && (
        <Gallery
          project={active.project}
          initialIndex={active.imageIndex}
          onClose={() => setActive(null)}
        />
      )}
    </>
  );
}
