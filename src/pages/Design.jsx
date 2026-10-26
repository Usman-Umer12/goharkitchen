import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

/* =========================================================
   SETTINGS
   images: assets/3d1.webp ... assets/3d57.webp
========================================================= */

const PREFIX = "3d";
const TOTAL_IMAGES = 57;
const PAGE_SIZE = 12;
const MAX_VISIBLE_PAGES = 5;
const GALLERY_LABEL = "2D/3D Design";

/* =========================================================
   IMAGE ASSETS
========================================================= */

const localAssets = import.meta.glob("../assets/*.{webp,png,jpg,jpeg,avif}", {
  eager: true,
  query: "?url",
  import: "default",
});

const getImage = (filename) => {
  const match = Object.keys(localAssets).find((path) =>
    path.endsWith(`/${filename}`)
  );
  return match ? localAssets[match] : `/assets/${filename}`;
};

const allImages = Array.from({ length: TOTAL_IMAGES }, (_, i) => ({
  src: getImage(`${PREFIX}${i + 1}.webp`),
  alt: `${GALLERY_LABEL} ${i + 1}`,
}));

/* =========================================================
   PAGINATION HELPER  -> 1 2 3 4 5
========================================================= */

const getPageNumbers = (current, total) => {
  const visible = Math.min(MAX_VISIBLE_PAGES, total);
  let start = Math.max(1, current - Math.floor(visible / 2));
  let end = start + visible - 1;

  if (end > total) {
    end = total;
    start = Math.max(1, end - visible + 1);
  }

  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
};

/* =========================================================
   MASONRY ITEM (full height, no crop, no box)
========================================================= */

const MasonryItem = ({ img, index, onOpen }) => {
  const [loaded, setLoaded] = useState(false);
  const imgRef = useRef(null);

  /* cached image ka onLoad kabhi miss ho sakta hai */
  useEffect(() => {
    if (imgRef.current?.complete) setLoaded(true);
  }, []);

  return (
    <button
      type="button"
      className={`dsg-item ${loaded ? "is-loaded" : ""}`}
      style={{ "--i": index % 12 }}
      onClick={onOpen}
      aria-label={`View ${img.alt}`}
    >
      <img
        ref={imgRef}
        src={img.src}
        alt={img.alt}
        decoding="async"
        onLoad={() => setLoaded(true)}
        onError={() => setLoaded(true)}
      />
      <span className="dsg-item-overlay" aria-hidden="true">
        <span className="dsg-item-zoom">+</span>
      </span>
    </button>
  );
};

/* =========================================================
   LIGHTBOX
========================================================= */

const Lightbox = ({ images, index, onClose, onChange }) => {
  const touchStart = useRef(null);
  const total = images.length;

  const prev = useCallback(
    () => onChange((index - 1 + total) % total),
    [index, total, onChange]
  );
  const next = useCallback(
    () => onChange((index + 1) % total),
    [index, total, onChange]
  );

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };

    window.addEventListener("keydown", onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose, prev, next]);

  const handleTouchEnd = (e) => {
    if (touchStart.current === null) return;
    const diff = e.changedTouches[0].clientX - touchStart.current;
    if (Math.abs(diff) > 50) (diff > 0 ? prev : next)();
    touchStart.current = null;
  };

  const current = images[index];

  return (
    <div
      className="dsg-lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={`${GALLERY_LABEL} gallery`}
      onClick={onClose}
    >
      <div className="dsg-lightbox-top" onClick={(e) => e.stopPropagation()}>
        <div className="dsg-lightbox-info">
          <span className="dsg-lightbox-title">{GALLERY_LABEL}</span>
          <span className="dsg-lightbox-count">
            {String(index + 1).padStart(2, "0")} /{" "}
            {String(total).padStart(2, "0")}
          </span>
        </div>

        <button
          type="button"
          className="dsg-lightbox-close"
          onClick={onClose}
          aria-label="Close"
        >
          ✕
        </button>
      </div>

      <div
        className="dsg-lightbox-stage"
        onClick={(e) => e.stopPropagation()}
        onTouchStart={(e) => (touchStart.current = e.touches[0].clientX)}
        onTouchEnd={handleTouchEnd}
      >
        {total > 1 && (
          <button
            type="button"
            className="dsg-lightbox-nav dsg-lightbox-prev"
            onClick={prev}
            aria-label="Previous image"
          >
            ‹
          </button>
        )}

        <img key={current.src} src={current.src} alt={current.alt} />

        {total > 1 && (
          <button
            type="button"
            className="dsg-lightbox-nav dsg-lightbox-next"
            onClick={next}
            aria-label="Next image"
          >
            ›
          </button>
        )}
      </div>
    </div>
  );
};

/* =========================================================
   MAIN COMPONENT
========================================================= */

const Design = () => {
  const [page, setPage] = useState(1);
  const [lightboxIndex, setLightboxIndex] = useState(null);

  const galleryRef = useRef(null);

  const images = useMemo(() => allImages, []);

  const totalPages = Math.max(1, Math.ceil(images.length / PAGE_SIZE));
  const pageStart = (page - 1) * PAGE_SIZE;
  const pageImages = images.slice(pageStart, pageStart + PAGE_SIZE);
  const pageEnd = pageStart + pageImages.length;

  const goToPage = (p) => {
    if (p < 1 || p > totalPages || p === page) return;
    setPage(p);

    requestAnimationFrame(() => {
      galleryRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Montserrat:wght@300;400;500;600;700&display=swap');

        .dsg-wrap,
        .dsg-wrap *,
        .dsg-wrap *::before,
        .dsg-wrap *::after,
        .dsg-lightbox,
        .dsg-lightbox *,
        .dsg-lightbox *::before,
        .dsg-lightbox *::after {
          box-sizing: border-box;
        }

        .dsg-wrap {
          /* FONTS: pura Montserrat chahiye to --dsg-display ko --dsg-sans kar do */
          --dsg-display: 'Cormorant Garamond', Georgia, 'Times New Roman', serif;
          --dsg-sans: 'Montserrat', system-ui, -apple-system, 'Segoe UI', sans-serif;
          --dsg-accent: #C0652B;
          --dsg-ease: cubic-bezier(0.2, 0.65, 0.3, 1);

          font-family: var(--dsg-sans);
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        .dsg-wrap button,
        .dsg-lightbox,
        .dsg-lightbox button {
          font-family: 'Montserrat', system-ui, -apple-system, 'Segoe UI', sans-serif;
        }

        .dsg-container {
          width: 100%;
          padding-inline: 16px;
        }
        @media (min-width: 640px)  { .dsg-container { padding-inline: 32px; } }
        @media (min-width: 1024px) { .dsg-container { padding-inline: 40px; } }
        @media (min-width: 1280px) { .dsg-container { padding-inline: 56px; } }
        @media (min-width: 1536px) { .dsg-container { padding-inline: 80px; } }

        /* =====================================================
           HEADING SECTION (BLACK)
        ===================================================== */

        .dsg-top {
          background: #000000;
          color: #FFFFFF;
          padding-block: 104px 56px;
        }
        @media (min-width: 640px)  { .dsg-top { padding-block: 124px 68px; } }
        @media (min-width: 1024px) { .dsg-top { padding-block: 148px 84px; } }

        .dsg-heading {
          margin: 0;
          color: #FFFFFF;
          font-family: var(--dsg-display);
          font-size: 38px;
          font-weight: 600;
          line-height: 1.1;
          letter-spacing: 0.02em;
          text-transform: uppercase;
        }
        @media (min-width: 640px)  { .dsg-heading { font-size: 48px; } }
        @media (min-width: 1024px) { .dsg-heading { font-size: 60px; } }

        .dsg-heading-rule {
          display: block;
          width: 56px;
          height: 2px;
          margin-top: 20px;
          background: var(--dsg-accent);
        }

        .dsg-subtext {
          max-width: 680px;
          margin: 20px 0 0;
          color: rgba(255, 255, 255, 0.72);
          font-size: 13px;
          font-weight: 400;
          line-height: 1.9;
          letter-spacing: 0.01em;
        }
        @media (min-width: 640px) { .dsg-subtext { font-size: 14px; } }

        /* =====================================================
           GALLERY SECTION (WHITE)
        ===================================================== */

        .dsg-products {
          background: #FFFFFF;
          color: #141414;
          padding-block: 40px 64px;
          scroll-margin-top: 70px;
          --dsg-text: #141414;
          --dsg-muted: rgba(20, 20, 20, 0.62);
          --dsg-line: rgba(20, 20, 20, 0.14);
          --dsg-gap: 10px;
        }
        @media (min-width: 640px) {
          .dsg-products { padding-block: 56px 80px; --dsg-gap: 14px; }
        }
        @media (min-width: 1024px) {
          .dsg-products { padding-block: 64px 96px; --dsg-gap: 18px; }
        }

        .dsg-gallery-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 8px 16px;
          margin-bottom: 28px;
          padding-bottom: 16px;
          border-bottom: 1px solid var(--dsg-line);
        }

        .dsg-gallery-count {
          color: var(--dsg-muted);
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          white-space: nowrap;
        }

        /* PINTEREST MASONRY */

        .dsg-masonry {
          column-count: 2;
          column-gap: var(--dsg-gap);
        }
        @media (min-width: 768px)  { .dsg-masonry { column-count: 3; } }
        @media (min-width: 1280px) { .dsg-masonry { column-count: 4; } }

        /* image = poori height, koi box/border nahi */
        .dsg-item {
          position: relative;
          display: block;
          width: 100%;
          margin: 0 0 var(--dsg-gap);
          padding: 0;
          overflow: hidden;
          break-inside: avoid;
          border: 0;
          border-radius: 10px;
          background: #F3F0EC;
          cursor: zoom-in;
          opacity: 0;
          transform: translate3d(0, 14px, 0);
          transition: opacity 500ms var(--dsg-ease), transform 500ms var(--dsg-ease);
          transition-delay: calc(var(--i, 0) * 40ms);
        }
        .dsg-item.is-loaded {
          opacity: 1;
          transform: translate3d(0, 0, 0);
        }

        .dsg-item img {
          display: block;
          width: 100%;
          height: auto;
          min-height: 120px;
          transition: transform 700ms var(--dsg-ease);
        }
        .dsg-item:hover img { transform: scale(1.04); }

        .dsg-item-overlay {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: flex-end;
          justify-content: flex-end;
          padding: 14px;
          background: linear-gradient(to top, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0) 50%);
          opacity: 0;
          transition: opacity 300ms ease;
        }
        .dsg-item:hover .dsg-item-overlay,
        .dsg-item:focus-visible .dsg-item-overlay { opacity: 1; }

        .dsg-item-zoom {
          display: flex;
          width: 32px;
          height: 32px;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(255, 255, 255, 0.7);
          border-radius: 50%;
          color: #FFFFFF;
          font-size: 16px;
        }

        @media (hover: none) {
          .dsg-item-overlay { display: none; }
        }

        .dsg-item:focus-visible,
        .dsg-page-btn:focus-visible {
          outline: 2px solid var(--dsg-accent);
          outline-offset: 3px;
        }

        /* PAGINATION */

        .dsg-pagination {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-top: 40px;
        }

        .dsg-page-btn {
          display: inline-flex;
          min-width: 42px;
          min-height: 42px;
          align-items: center;
          justify-content: center;
          padding: 0 12px;
          border: 1px solid var(--dsg-line);
          border-radius: 2px;
          background: #FFFFFF;
          color: var(--dsg-text);
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.04em;
          cursor: pointer;
          transition: color 200ms ease, background-color 200ms ease, border-color 200ms ease;
        }
        .dsg-page-btn:hover:not(:disabled):not([aria-current="page"]) {
          border-color: var(--dsg-accent);
          color: var(--dsg-accent);
        }
        .dsg-page-btn[aria-current="page"] {
          background: #141414;
          border-color: #141414;
          color: #FFFFFF;
          cursor: default;
        }
        .dsg-page-btn:disabled { opacity: 0.35; cursor: not-allowed; }

        @media (max-width: 480px) {
          .dsg-page-btn { min-width: 38px; min-height: 38px; padding: 0 9px; }
          .dsg-pagination { gap: 6px; }
        }

        /* =====================================================
           LIGHTBOX
        ===================================================== */

        .dsg-lightbox {
          --dsg-accent: #C0652B;

          position: fixed;
          inset: 0;
          z-index: 1000;
          display: flex;
          flex-direction: column;
          background: rgba(0, 0, 0, 0.94);
          animation: dsg-fade 250ms ease both;
        }

        .dsg-lightbox-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          padding: 14px 16px;
          color: #FFFFFF;
        }
        @media (min-width: 640px) { .dsg-lightbox-top { padding: 18px 32px; } }

        .dsg-lightbox-info { display: flex; flex-direction: column; gap: 4px; min-width: 0; }

        .dsg-lightbox-title {
          overflow: hidden;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-overflow: ellipsis;
          text-transform: uppercase;
          white-space: nowrap;
        }

        .dsg-lightbox-count {
          color: rgba(255, 255, 255, 0.65);
          font-size: 11px;
          letter-spacing: 0.14em;
        }

        .dsg-lightbox-close {
          display: flex;
          width: 42px;
          height: 42px;
          flex: 0 0 auto;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(255, 255, 255, 0.4);
          border-radius: 50%;
          background: transparent;
          color: #FFFFFF;
          font-size: 16px;
          cursor: pointer;
          transition: background-color 200ms ease, border-color 200ms ease;
        }
        .dsg-lightbox-close:hover { background: var(--dsg-accent); border-color: var(--dsg-accent); }

        .dsg-lightbox-stage {
          position: relative;
          display: flex;
          min-height: 0;
          flex: 1;
          align-items: center;
          justify-content: center;
          padding: 0 12px 24px;
        }
        @media (min-width: 640px) { .dsg-lightbox-stage { padding: 0 80px 32px; } }

        .dsg-lightbox-stage img {
          display: block;
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
          animation: dsg-fade 300ms ease both;
        }

        .dsg-lightbox-nav {
          position: absolute;
          top: 50%;
          z-index: 2;
          display: flex;
          width: 44px;
          height: 44px;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(255, 255, 255, 0.4);
          border-radius: 50%;
          background: rgba(0, 0, 0, 0.5);
          color: #FFFFFF;
          font-size: 26px;
          line-height: 1;
          transform: translateY(-50%);
          cursor: pointer;
          transition: background-color 200ms ease, border-color 200ms ease;
        }
        .dsg-lightbox-nav:hover { background: var(--dsg-accent); border-color: var(--dsg-accent); }
        .dsg-lightbox-prev { left: 10px; }
        .dsg-lightbox-next { right: 10px; }
        @media (min-width: 640px) {
          .dsg-lightbox-prev { left: 20px; }
          .dsg-lightbox-next { right: 20px; }
        }

        @keyframes dsg-fade {
          from { opacity: 0; }
          to   { opacity: 1; }
        }

        @media (prefers-reduced-motion: reduce) {
          .dsg-wrap *,
          .dsg-lightbox,
          .dsg-lightbox * {
            animation: none !important;
            transition: none !important;
          }
          .dsg-item { opacity: 1; transform: none; }
        }
      `}</style>

      <div className="dsg-wrap">
        {/* ================= BLACK: HEADING + DESCRIPTION ================= */}
        <section className="dsg-top" aria-labelledby="dsg-title">
          <div className="dsg-container">
            <h1 className="dsg-heading" id="dsg-title">
              2D/3D Design
            </h1>
            <span className="dsg-heading-rule" aria-hidden="true" />
            <p className="dsg-subtext">
              Before a single cabinet is built, we show you how your space will
              look and feel. Our detailed 2D plans and realistic 3D renders
              help you visualise every layout, finish and detail, so each
              decision is made with confidence.
            </p>
          </div>
        </section>

        {/* ================= WHITE: MASONRY GALLERY ================= */}
        <section
          className="dsg-products"
          ref={galleryRef}
          aria-label={`${GALLERY_LABEL} gallery`}
        >
          <div className="dsg-container">
            <div className="dsg-gallery-head">
              <span className="dsg-gallery-count">
                Showing {pageStart + 1}–{pageEnd} of {images.length}
              </span>
              <span className="dsg-gallery-count">
                Page {page} / {totalPages}
              </span>
            </div>

            <div className="dsg-masonry" key={page}>
              {pageImages.map((img, i) => (
                <MasonryItem
                  key={img.src}
                  img={img}
                  index={i}
                  onOpen={() => setLightboxIndex(pageStart + i)}
                />
              ))}
            </div>

            {/* PAGINATION: 1 2 3 4 5 */}
            {totalPages > 1 && (
              <nav className="dsg-pagination" aria-label="Gallery pagination">
                <button
                  type="button"
                  className="dsg-page-btn"
                  onClick={() => goToPage(page - 1)}
                  disabled={page === 1}
                  aria-label="Previous page"
                >
                  ‹
                </button>

                {getPageNumbers(page, totalPages).map((p) => (
                  <button
                    key={p}
                    type="button"
                    className="dsg-page-btn"
                    onClick={() => goToPage(p)}
                    aria-current={p === page ? "page" : undefined}
                    aria-label={`Page ${p}`}
                  >
                    {p}
                  </button>
                ))}

                <button
                  type="button"
                  className="dsg-page-btn"
                  onClick={() => goToPage(page + 1)}
                  disabled={page === totalPages}
                  aria-label="Next page"
                >
                  ›
                </button>
              </nav>
            )}
          </div>
        </section>
      </div>

      {/* POPUP */}
      {lightboxIndex !== null && (
        <Lightbox
          images={images}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onChange={setLightboxIndex}
        />
      )}
    </>
  );
};

export default Design;