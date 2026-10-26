import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { supabase } from "../lib/supabase";

/* =========================================================
   SETTINGS
========================================================= */

const GALLERY_LABEL = "Vanities";
const TABLE = "vanities_images";

/* Fallback: agar Supabase khali ho ya error aaye to ye local images dikhengi */
const groups = [{ prefix: "v", count: 3 }];

const PAGE_SIZE = 12;
const MAX_VISIBLE_PAGES = 5;

/* =========================================================
   LOCAL FALLBACK IMAGES
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

const fallbackImages = groups.flatMap(({ prefix, count }) =>
  Array.from({ length: count }, (_, i) => ({
    id: `${prefix}${i + 1}`,
    src: getImage(`${prefix}${i + 1}.webp`),
    alt: `${GALLERY_LABEL} ${i + 1}`,
  }))
);

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
   MASONRY ITEM (full height, covers box, no gap, no crop)
========================================================= */

const MasonryItem = ({ img, index, onOpen }) => {
  const [loaded, setLoaded] = useState(false);
  const imgRef = useRef(null);

  useEffect(() => {
    if (imgRef.current?.complete) setLoaded(true);
  }, []);

  return (
    <button
      type="button"
      className={`van-item ${loaded ? "is-loaded" : ""}`}
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
      <span className="van-item-overlay" aria-hidden="true">
        <span className="van-item-zoom">+</span>
      </span>
    </button>
  );
};

/* =========================================================
   LIGHTBOX (POPUP)
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
  if (!current) return null;

  return (
    <div
      className="van-lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={`${GALLERY_LABEL} gallery`}
      onClick={onClose}
    >
      <div className="van-lightbox-top" onClick={(e) => e.stopPropagation()}>
        <div className="van-lightbox-info">
          <span className="van-lightbox-title">{GALLERY_LABEL}</span>
          <span className="van-lightbox-count">
            {String(index + 1).padStart(2, "0")} /{" "}
            {String(total).padStart(2, "0")}
          </span>
        </div>

        <button
          type="button"
          className="van-lightbox-close"
          onClick={onClose}
          aria-label="Close"
        >
          ✕
        </button>
      </div>

      <div
        className="van-lightbox-stage"
        onClick={(e) => e.stopPropagation()}
        onTouchStart={(e) => (touchStart.current = e.touches[0].clientX)}
        onTouchEnd={handleTouchEnd}
      >
        {total > 1 && (
          <button
            type="button"
            className="van-lightbox-nav van-lightbox-prev"
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
            className="van-lightbox-nav van-lightbox-next"
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

const Vanities = () => {
  const [page, setPage] = useState(1);
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [remote, setRemote] = useState(null); // null = loading

  const galleryRef = useRef(null);

  /* Supabase se images load karo */
  useEffect(() => {
    let active = true;

    (async () => {
      try {
        const { data, error } = await supabase
          .from(TABLE)
          .select("id, image_url, alt, sort_order, created_at")
          .order("sort_order", { ascending: true })
          .order("created_at", { ascending: true });

        if (!active) return;

        if (error || !data?.length) {
          setRemote([]);
          return;
        }

        setRemote(
          data.map((row, i) => ({
            id: row.id,
            src: row.image_url,
            alt: row.alt || `${GALLERY_LABEL} ${i + 1}`,
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

  const loading = remote === null;

  const images = useMemo(() => {
    if (remote === null) return [];
    return remote.length ? remote : fallbackImages;
  }, [remote]);

  const totalPages = Math.max(1, Math.ceil(images.length / PAGE_SIZE));
  const pageStart = (page - 1) * PAGE_SIZE;
  const pageImages = images.slice(pageStart, pageStart + PAGE_SIZE);
  const pageEnd = pageStart + pageImages.length;

  useEffect(() => {
    if (page > totalPages) setPage(1);
  }, [page, totalPages]);

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

        .van-wrap,
        .van-wrap *,
        .van-wrap *::before,
        .van-wrap *::after,
        .van-lightbox,
        .van-lightbox *,
        .van-lightbox *::before,
        .van-lightbox *::after {
          box-sizing: border-box;
        }

        .van-wrap {
          --van-display: 'Cormorant Garamond', Georgia, 'Times New Roman', serif;
          --van-sans: 'Montserrat', system-ui, -apple-system, 'Segoe UI', sans-serif;
          --van-accent: #C0652B;
          --van-ease: cubic-bezier(0.2, 0.65, 0.3, 1);

          font-family: var(--van-sans);
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        .van-wrap button,
        .van-lightbox,
        .van-lightbox button {
          font-family: 'Montserrat', system-ui, -apple-system, 'Segoe UI', sans-serif;
        }

        .van-container {
          width: 100%;
          padding-inline: 16px;
        }
        @media (min-width: 640px)  { .van-container { padding-inline: 32px; } }
        @media (min-width: 1024px) { .van-container { padding-inline: 40px; } }
        @media (min-width: 1280px) { .van-container { padding-inline: 56px; } }
        @media (min-width: 1536px) { .van-container { padding-inline: 80px; } }

        /* =====================================================
           HEADING SECTION (BLACK)
        ===================================================== */

        .van-top {
          background: #000000;
          color: #FFFFFF;
          padding-block: 104px 56px;
        }
        @media (min-width: 640px)  { .van-top { padding-block: 124px 68px; } }
        @media (min-width: 1024px) { .van-top { padding-block: 148px 84px; } }

        .van-heading {
          margin: 0;
          color: #FFFFFF;
          font-family: var(--van-display);
          font-size: 38px;
          font-weight: 600;
          line-height: 1.1;
          letter-spacing: 0.02em;
          text-transform: uppercase;
        }
        @media (min-width: 640px)  { .van-heading { font-size: 48px; } }
        @media (min-width: 1024px) { .van-heading { font-size: 60px; } }

        .van-heading-rule {
          display: block;
          width: 56px;
          height: 2px;
          margin-top: 20px;
          background: var(--van-accent);
        }

        .van-subtext {
          max-width: 680px;
          margin: 20px 0 0;
          color: rgba(255, 255, 255, 0.72);
          font-size: 13px;
          font-weight: 400;
          line-height: 1.9;
          letter-spacing: 0.01em;
        }
        @media (min-width: 640px) { .van-subtext { font-size: 14px; } }

        /* =====================================================
           GALLERY SECTION (WHITE)
        ===================================================== */

        .van-products {
          background: #FFFFFF;
          color: #141414;
          padding-block: 40px 64px;
          scroll-margin-top: 70px;
          --van-text: #141414;
          --van-muted: rgba(20, 20, 20, 0.62);
          --van-line: rgba(20, 20, 20, 0.14);
          --van-gap: 10px;
        }
        @media (min-width: 640px) {
          .van-products { padding-block: 56px 80px; --van-gap: 14px; }
        }
        @media (min-width: 1024px) {
          .van-products { padding-block: 64px 96px; --van-gap: 18px; }
        }

        .van-gallery-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 8px 16px;
          margin-bottom: 28px;
          padding-bottom: 16px;
          border-bottom: 1px solid var(--van-line);
        }

        .van-gallery-count {
          color: var(--van-muted);
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          white-space: nowrap;
        }

        .van-loading {
          padding: 80px 0;
          color: var(--van-muted);
          font-size: 12px;
          font-weight: 500;
          letter-spacing: 0.14em;
          text-align: center;
          text-transform: uppercase;
        }

        /* PINTEREST MASONRY */

        .van-masonry {
          column-count: 2;
          column-gap: var(--van-gap);
        }
        @media (min-width: 768px)  { .van-masonry { column-count: 3; } }
        @media (min-width: 1280px) { .van-masonry { column-count: 4; } }

        /* image = poori height, box ko pura cover, koi gap/crop nahi */
        .van-item {
          position: relative;
          display: block;
          width: 100%;
          height: auto;
          margin: 0 0 var(--van-gap);
          padding: 0;
          overflow: hidden;
          break-inside: avoid;
          border: 0;
          border-radius: 10px;
          background: transparent;
          line-height: 0;
          font-size: 0;
          cursor: zoom-in;
          opacity: 0;
          transform: translate3d(0, 14px, 0);
          transition: opacity 500ms var(--van-ease), transform 500ms var(--van-ease);
          transition-delay: calc(var(--i, 0) * 40ms);
        }
        .van-item.is-loaded {
          opacity: 1;
          transform: translate3d(0, 0, 0);
        }

        .van-item img {
          display: block;
          width: 100%;
          height: auto;
          object-fit: cover;
          vertical-align: top;
          transition: transform 700ms var(--van-ease);
        }

        /* load hone se pehle layout jump na ho */
        .van-item:not(.is-loaded) {
          background: #F3F0EC;
        }
        .van-item:not(.is-loaded) img {
          min-height: 220px;
        }

        .van-item:hover img { transform: scale(1.03); }

        .van-item-overlay {
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
        .van-item:hover .van-item-overlay,
        .van-item:focus-visible .van-item-overlay { opacity: 1; }

        .van-item-zoom {
          display: flex;
          width: 32px;
          height: 32px;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(255, 255, 255, 0.7);
          border-radius: 50%;
          color: #FFFFFF;
          font-size: 16px;
          line-height: 1;
        }

        @media (hover: none) {
          .van-item-overlay { display: none; }
        }

        .van-item:focus-visible,
        .van-page-btn:focus-visible {
          outline: 2px solid var(--van-accent);
          outline-offset: 3px;
        }

        /* PAGINATION */

        .van-pagination {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-top: 40px;
        }

        .van-page-btn {
          display: inline-flex;
          min-width: 42px;
          min-height: 42px;
          align-items: center;
          justify-content: center;
          padding: 0 12px;
          border: 1px solid var(--van-line);
          border-radius: 2px;
          background: #FFFFFF;
          color: var(--van-text);
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.04em;
          cursor: pointer;
          transition: color 200ms ease, background-color 200ms ease, border-color 200ms ease;
        }
        .van-page-btn:hover:not(:disabled):not([aria-current="page"]) {
          border-color: var(--van-accent);
          color: var(--van-accent);
        }
        .van-page-btn[aria-current="page"] {
          background: #141414;
          border-color: #141414;
          color: #FFFFFF;
          cursor: default;
        }
        .van-page-btn:disabled { opacity: 0.35; cursor: not-allowed; }

        @media (max-width: 480px) {
          .van-page-btn { min-width: 38px; min-height: 38px; padding: 0 9px; }
          .van-pagination { gap: 6px; }
        }

        /* =====================================================
           LIGHTBOX
        ===================================================== */

        .van-lightbox {
          --van-accent: #C0652B;

          position: fixed;
          inset: 0;
          z-index: 1000;
          display: flex;
          flex-direction: column;
          background: rgba(0, 0, 0, 0.94);
          animation: van-fade 250ms ease both;
        }

        .van-lightbox-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          padding: 14px 16px;
          color: #FFFFFF;
        }
        @media (min-width: 640px) { .van-lightbox-top { padding: 18px 32px; } }

        .van-lightbox-info { display: flex; flex-direction: column; gap: 4px; min-width: 0; }

        .van-lightbox-title {
          overflow: hidden;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.12em;
          text-overflow: ellipsis;
          text-transform: uppercase;
          white-space: nowrap;
        }

        .van-lightbox-count {
          color: rgba(255, 255, 255, 0.65);
          font-size: 11px;
          letter-spacing: 0.14em;
        }

        .van-lightbox-close {
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
        .van-lightbox-close:hover { background: var(--van-accent); border-color: var(--van-accent); }

        .van-lightbox-stage {
          position: relative;
          display: flex;
          min-height: 0;
          flex: 1;
          align-items: center;
          justify-content: center;
          padding: 0 12px 24px;
        }
        @media (min-width: 640px) { .van-lightbox-stage { padding: 0 80px 32px; } }

        /* popup mein image screen ki poori height tak */
        .van-lightbox-stage img {
          display: block;
          width: auto;
          height: auto;
          max-width: 100%;
          max-height: calc(100vh - 110px);
          object-fit: contain;
          animation: van-fade 300ms ease both;
        }

        .van-lightbox-nav {
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
        .van-lightbox-nav:hover { background: var(--van-accent); border-color: var(--van-accent); }
        .van-lightbox-prev { left: 10px; }
        .van-lightbox-next { right: 10px; }
        @media (min-width: 640px) {
          .van-lightbox-prev { left: 20px; }
          .van-lightbox-next { right: 20px; }
        }

        @keyframes van-fade {
          from { opacity: 0; }
          to   { opacity: 1; }
        }

        @media (prefers-reduced-motion: reduce) {
          .van-wrap *,
          .van-lightbox,
          .van-lightbox * {
            animation: none !important;
            transition: none !important;
          }
          .van-item { opacity: 1; transform: none; }
        }
      `}</style>

      <div className="van-wrap">
        {/* ================= BLACK: HEADING + DESCRIPTION ================= */}
        <section className="van-top" aria-labelledby="van-title">
          <div className="van-container">
            <h1 className="van-heading" id="van-title">
              Our Vanities
            </h1>
            <span className="van-heading-rule" aria-hidden="true" />
            <p className="van-subtext">
              Modern, practical and beautifully finished bathroom vanities
              designed to bring style and storage together. Built with
              moisture-resistant materials and clean detailing, each vanity is
              made to look refined and last for years.
            </p>
          </div>
        </section>

        {/* ================= WHITE: MASONRY GALLERY ================= */}
        <section
          className="van-products"
          ref={galleryRef}
          aria-label={`${GALLERY_LABEL} gallery`}
        >
          <div className="van-container">
            {loading ? (
              <p className="van-loading" role="status">
                Loading gallery...
              </p>
            ) : (
              <>
                <div className="van-gallery-head">
                  <span className="van-gallery-count">
                    Showing {images.length ? pageStart + 1 : 0}–{pageEnd} of{" "}
                    {images.length}
                  </span>
                  <span className="van-gallery-count">
                    Page {page} / {totalPages}
                  </span>
                </div>

                <div className="van-masonry" key={page}>
                  {pageImages.map((img, i) => (
                    <MasonryItem
                      key={img.id}
                      img={img}
                      index={i}
                      onOpen={() => setLightboxIndex(pageStart + i)}
                    />
                  ))}
                </div>

                {/* PAGINATION: 1 2 3 4 5 (sirf tab dikhega jab 12 se zyada images hon) */}
                {totalPages > 1 && (
                  <nav
                    className="van-pagination"
                    aria-label="Gallery pagination"
                  >
                    <button
                      type="button"
                      className="van-page-btn"
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
                        className="van-page-btn"
                        onClick={() => goToPage(p)}
                        aria-current={p === page ? "page" : undefined}
                        aria-label={`Page ${p}`}
                      >
                        {p}
                      </button>
                    ))}

                    <button
                      type="button"
                      className="van-page-btn"
                      onClick={() => goToPage(page + 1)}
                      disabled={page === totalPages}
                      aria-label="Next page"
                    >
                      ›
                    </button>
                  </nav>
                )}
              </>
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

export default Vanities;