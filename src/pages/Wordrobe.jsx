// Wordrobe.jsx
// Assets: ../assets/word.mp4, word1.webp ... word18.webp
// Hero: ab image nahi, word.mp4 video (muted, loop, autoplay) heading ke peeche chalti hai

import { useCallback, useEffect, useRef, useState } from "react";
import {
  ArrowDown,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Crop,
  MessageCircle,
  Truck,
  X,
} from "lucide-react";

import wardrobeVideo from "../assets/word.mp4";
import { supabase } from "../lib/supabase";

/* =========================================================
   SETTINGS
========================================================= */

const WHATSAPP_NUMBER = "923007023202";
const BRAND = "Gohar";
const TOTAL_PRODUCTS = 18;
const WARDROBE_TABLE = "wardrobe_products";
const PAGE_SIZE = 12;
const DELIVERY_TEXT = "Delivery Over Pakistan";

const localAssets = import.meta.glob("../assets/*.webp", {
  eager: true,
  query: "?url",
  import: "default",
});

const getImage = (filename) => {
  const key = Object.keys(localAssets).find((item) =>
    item.endsWith(`/${filename}`)
  );

  return key ? localAssets[key] : `/assets/${filename}`;
};

const titles = [
  "Modern Sliding Wardrobe",
  "Luxury Handleless Wardrobe",
  "Imported Sheet Wardrobe",
  "Classic Tusan Wardrobe",
  "Solid Wood Wardrobe",
  "Contemporary Walk-In Wardrobe",
  "Elegant Mirror Wardrobe",
  "Minimal Hinged Wardrobe",
  "Premium Glossy Wardrobe",
  "Warm Wooden Wardrobe",
];

const descriptions = [
  "Smart compartments, soft-close hardware and a refined finish, custom-built for your room.",
  "Handleless styling with premium boards and clean, refined detailing.",
  "Practical storage with custom materials, finishes and colours.",
  "Timeless styling with durable construction and organised storage.",
  "Carefully crafted with elegant looks and functional design.",
];

const localProducts = Array.from({ length: TOTAL_PRODUCTS }, (_, i) => ({
  id: i + 1,
  designNumber: i + 1,
  title: titles[i % titles.length],
  description: descriptions[i % descriptions.length],
  image: getImage(`word${i + 1}.webp`),
  price: [
    85000, 95000, 110000, 90000, 145000, 175000,
    120000, 88000, 115000, 105000, 135000, 155000,
    98000, 125000, 165000, 108000, 140000, 185000,
  ][i],
  deliveryText: DELIVERY_TEXT,
}));

const pad = (n) => String(n).padStart(2, "0");

const formatPrice = (price) => {
  const value = Number(price);

  if (!Number.isFinite(value) || value <= 0) return "";

  return `PKR ${new Intl.NumberFormat("en-PK", {
    maximumFractionDigits: 0,
  }).format(value)}`;
};

function openWhatsApp(message) {
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    message
  )}`;

  const newWindow = window.open(url, "_blank");

  if (!newWindow) window.location.href = url;
}

/* =========================================================
   REVEAL ANIMATION
========================================================= */

function useReveal() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;

    if (!element) return;

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

  return [ref, visible];
}

function Reveal({ children, delay = 0, className = "" }) {
  const [ref, visible] = useReveal();

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-700 ease-out ${
        visible
          ? "translate-y-0 opacity-100"
          : "translate-y-6 opacity-0"
      } ${className}`}
    >
      {children}
    </div>
  );
}

function Eyebrow({ children, align = "center" }) {
  return (
    <div
      className={`mb-4 flex items-center gap-3 sm:mb-5 ${
        align === "center" ? "justify-center" : ""
      }`}
    >
      <span className="h-px w-8 bg-[#C0652B] sm:w-10" />

      <span className="gk-eyebrow">{children}</span>

      {align === "center" && (
        <span className="h-px w-8 bg-[#C0652B] sm:w-10" />
      )}
    </div>
  );
}

/* =========================================================
   HERO BACKGROUND VIDEO
   - muted + loop + playsInline (mobile par autoplay ke liye zaroori)
   - screen se bahar jaye to pause (battery / data bachta hai)
   - "reduce motion" wale users ke liye sirf poster image
========================================================= */

function HeroVideo({ src, poster }) {
  const ref = useRef(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;

    video.muted = true;
    video.defaultMuted = true;

    const reduceMotion =
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduceMotion) {
      video.pause();
      return;
    }

    const tryPlay = () => {
      const p = video.play();
      if (p && typeof p.catch === "function") p.catch(() => {});
    };

    tryPlay();

    if (!("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) tryPlay();
        else video.pause();
      },
      { threshold: 0.1 }
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  return (
    <video
      ref={ref}
      className="kt-hero-video"
      src={src}
      poster={poster}
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      aria-hidden="true"
      tabIndex={-1}
      disablePictureInPicture
    />
  );
}

/* =========================================================
   HERO SECTION
========================================================= */

function FirstScreen({ onExplore }) {
  return (
    <section className="kt-first">
      <header className="kt-hero">
        <HeroVideo src={wardrobeVideo} poster={getImage("word1.webp")} />

        <div className="kt-hero-shade" />
        <div className="kt-hero-glow kt-hero-glow-a" />
        <div className="kt-hero-glow kt-hero-glow-b" />
        <div className="kt-hero-lines" />

        <div className="relative z-10 mx-auto flex w-full max-w-[1000px] flex-col items-center px-5 text-center sm:px-8">
          <Eyebrow>Bespoke Wardrobes</Eyebrow>

          <h1 className="gk-hero-title">
            <span className="gk-line">Wardrobes That Feel</span>
            <span className="gk-line">
              <em>Made For You</em>
            </span>
          </h1>

          <p className="kt-hero-text">
            Modern and solid wood wardrobes, built to measure with premium
            finishes and practical storage for your home.
          </p>

          <button
            type="button"
            onClick={onExplore}
            className="gk-btn-solid kt-hero-btn group"
          >
            Explore Collection
            <ArrowDown
              size={17}
              className="transition-transform group-hover:translate-y-0.5"
            />
          </button>
        </div>
      </header>
    </section>
  );
}

/* =========================================================
   INQUIRY MODAL
========================================================= */

function InquiryModal({ product, onClose }) {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    city: "",
  });

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose]);

  const handleChange = (event) => {
    setForm((previous) => ({
      ...previous,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const message = `
Hello ${BRAND}, I would like to inquire about a wardrobe.

*Product:* ${product.title} (Design ${pad(
      product.designNumber ?? product.id
    )})
*Name:* ${form.name}
*Phone:* ${form.phone}
*City:* ${form.city}

Please share more details and available options.
    `.trim();

    openWhatsApp(message);
    onClose();
  };

  const inputClass =
    "w-full rounded-lg border border-black/15 bg-neutral-50 px-4 py-3.5 font-sans text-sm text-neutral-900 outline-none transition duration-200 placeholder:text-neutral-400 focus:border-[#C0652B] focus:bg-white focus:ring-2 focus:ring-[#C0652B]/20";

  const labelClass =
    "mb-2 block font-sans text-[11px] font-medium uppercase tracking-[0.16em] text-neutral-600";

  return (
    <div
      className="fixed inset-0 z-[130] flex items-center justify-center bg-black/80 px-4 py-6 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Wardrobe inquiry form"
        className="gk-light relative max-h-[92dvh] w-full max-w-lg overflow-y-auto rounded-md border border-black/10 bg-white shadow-[0_30px_80px_rgba(0,0,0,0.35)]"
      >
        <div className="relative overflow-hidden border-b border-black/10 px-5 py-6 sm:px-8 sm:py-7">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close inquiry"
            className="absolute right-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-full border border-black/15 text-neutral-700 transition hover:bg-black/5 hover:text-black"
          >
            <X size={17} />
          </button>

          <div className="pr-10">
            <Eyebrow align="left">Product Inquiry</Eyebrow>

            <h2 className="gk-h3 !text-[1.2rem] sm:!text-[1.5rem]">
              {product.title}
            </h2>

            <p className="gk-body mt-2 !text-[13px]">
              Share your details and continue the conversation on WhatsApp.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="px-5 py-6 sm:px-8 sm:py-8">
          <div className="space-y-5">
            <div>
              <label htmlFor="iq-name" className={labelClass}>
                Full Name
              </label>

              <input
                id="iq-name"
                name="name"
                type="text"
                autoComplete="name"
                required
                value={form.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="iq-phone" className={labelClass}>
                Phone Number
              </label>

              <input
                id="iq-phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                required
                value={form.phone}
                onChange={handleChange}
                placeholder="03XX XXXXXXX"
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="iq-city" className={labelClass}>
                City
              </label>

              <input
                id="iq-city"
                name="city"
                type="text"
                autoComplete="address-level2"
                required
                value={form.city}
                onChange={handleChange}
                placeholder="Enter your city"
                className={inputClass}
              />
            </div>
          </div>

          <button type="submit" className="gk-btn-solid mt-7 !flex w-full">
            <MessageCircle size={17} />
            Send Inquiry
            <ArrowRight size={15} />
          </button>

          <p className="mt-3 text-center font-sans text-[11px] leading-5 text-neutral-500">
            Your inquiry will be sent directly to our WhatsApp.
          </p>
        </form>
      </div>
    </div>
  );
}

/* =========================================================
   PRODUCT PREVIEW
========================================================= */

function Preview({ product, onClose, onInquiry }) {
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose]);

  return (
    <div
      className="kt-preview fixed inset-0 z-[110] flex flex-col bg-[#070707] lg:flex-row"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Wardrobe design preview"
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close preview"
        className="kt-ctrl absolute right-3 top-3 z-20 !h-11 !w-11 sm:right-6 sm:top-6"
      >
        <X size={20} />
      </button>

      <div className="flex min-h-0 flex-1 items-center justify-center overflow-hidden p-4 pt-16 sm:p-8 sm:pt-20 lg:p-12">
        <img
          src={product.image}
          alt={product.title}
          onClick={(event) => event.stopPropagation()}
          className="kt-lb-img max-h-full max-w-full rounded-sm object-contain"
        />
      </div>

      <aside
        onClick={(event) => event.stopPropagation()}
        className="kt-preview-info"
      >
        <Eyebrow align="left">
          Design {pad(product.designNumber ?? product.id)}
        </Eyebrow>

        <h3 className="gk-h3 !text-[1.15rem] sm:!text-[1.4rem] lg:!text-[1.6rem]">
          {product.title}
        </h3>

        <div className="my-4 h-px w-12 bg-[#C0652B] sm:my-5" />

        <p className="gk-body !text-[14px] sm:!text-[15px]">
          {product.description}
        </p>

        {Number(product.price) > 0 && (
          <p className="mt-4 font-sans text-base font-semibold text-[#C0652B]">
            {formatPrice(product.price)}
          </p>
        )}

        <p className="mt-4 flex items-center gap-2 font-sans text-xs text-white/60 sm:text-[13px]">
          <Truck size={15} className="shrink-0 text-[#C0652B]" />
          {product.deliveryText || DELIVERY_TEXT}
        </p>

        <button
          type="button"
          onClick={() => onInquiry(product)}
          className="gk-btn-solid mt-6 w-full sm:mt-7"
        >
          <MessageCircle size={17} />
          WhatsApp Inquiry
        </button>
      </aside>
    </div>
  );
}

/* =========================================================
   PRODUCT CARD
========================================================= */

function ProductCard({ product, index, onPreview, onInquiry }) {
  return (
    <Reveal delay={(index % 4) * 80} className="h-full">
      <article className="kt-product group">
        <div className="relative aspect-[4/5] overflow-hidden bg-[#171513]">
          <img
            src={product.image}
            alt={product.title}
            loading="lazy"
            decoding="async"
            onClick={() => onPreview(product)}
            className="h-full w-full cursor-zoom-in object-cover transition-transform duration-700 group-hover:scale-[1.05]"
          />

          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/60 to-transparent" />

          <button
            type="button"
            onClick={() => onPreview(product)}
            aria-label={`Preview ${product.title}`}
            className="kt-crop"
          >
            <Crop size={16} />
          </button>
        </div>

        <div className="flex flex-1 flex-col p-3 sm:p-5">
          <h3 className="kt-card-title line-clamp-1">{product.title}</h3>

          <p className="kt-card-desc mt-2 line-clamp-2 min-h-[2.5rem]">
            {product.description}
          </p>

          {Number(product.price) > 0 && (
            <p className="mt-3 font-sans text-xs font-semibold text-[#C0652B] sm:text-sm">
              {formatPrice(product.price)}
            </p>
          )}

          <p className="mt-3 flex items-center gap-2 font-sans text-[10.5px] text-neutral-600 sm:text-xs">
            <Truck size={14} className="shrink-0 text-[#C0652B]" />
            <span className="truncate">
              {product.deliveryText || DELIVERY_TEXT}
            </span>
          </p>

          <button
            type="button"
            onClick={() => onInquiry(product)}
            className="kt-inquiry mt-auto"
          >
            <MessageCircle size={15} />
            <span>
              <span className="hidden sm:inline">WhatsApp </span>
              Inquiry
            </span>
          </button>
        </div>
      </article>
    </Reveal>
  );
}

/* =========================================================
   PAGINATION
========================================================= */

function Pagination({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  return (
    <nav className="kt-pagination" aria-label="Wardrobe product pages">
      <button
        type="button"
        className="kt-page-arrow"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        <ChevronLeft size={17} />
        <span className="hidden sm:inline">Previous</span>
      </button>

      {Array.from({ length: totalPages }, (_, index) => index + 1).map(
        (page) => (
          <button
            key={page}
            type="button"
            onClick={() => onPageChange(page)}
            aria-label={`Page ${page}`}
            aria-current={currentPage === page ? "page" : undefined}
            className={`kt-page-number ${
              currentPage === page ? "is-active" : ""
            }`}
          >
            {page}
          </button>
        )
      )}

      <button
        type="button"
        className="kt-page-arrow"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        <span className="hidden sm:inline">Next</span>
        <ChevronRight size={17} />
      </button>
    </nav>
  );
}

/* =========================================================
   PRODUCTS SECTION
========================================================= */

function Products({ products, onPreview, onInquiry }) {
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    setCurrentPage(1);
  }, [products.length]);

  const totalPages = Math.ceil(products.length / PAGE_SIZE);
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const endIndex = Math.min(startIndex + PAGE_SIZE, products.length);
  const shown = products.slice(startIndex, endIndex);

  const changePage = (page) => {
    const nextPage = Math.max(1, Math.min(page, totalPages));

    if (nextPage === currentPage) return;

    setCurrentPage(nextPage);

    window.setTimeout(() => {
      document.getElementById("wardrobe-products")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 50);
  };

  return (
    <section
      id="wardrobe-products"
      className="relative scroll-mt-6 py-12 sm:py-16 lg:py-20"
    >
      <div className="mx-auto max-w-[1320px] px-4 sm:px-8 lg:px-12">
        <Reveal>
          <div className="mb-8 text-center sm:mb-10">
            <Eyebrow>Our Collection</Eyebrow>

            <h2 className="gk-h2">
              <span className="gk-line">Wardrobes Designed</span>
              <span className="gk-line">
                <em>Around Your Space</em>
              </span>
            </h2>

            <p className="kt-section-text mx-auto mt-4 max-w-lg">
              Explore made-to-measure designs for your home.
            </p>
          </div>
        </Reveal>

        {shown.length > 0 ? (
          <div
            key={currentPage}
            className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4"
          >
            {shown.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                index={index}
                onPreview={onPreview}
                onInquiry={onInquiry}
              />
            ))}
          </div>
        ) : (
          <p className="py-12 text-center font-sans text-sm text-neutral-600">
            No wardrobe designs are available right now.
          </p>
        )}

        <div className="mt-10 flex flex-col items-center justify-between gap-5 border-t border-white/10 pt-6 sm:mt-12 sm:flex-row">
          <p className="font-sans text-xs text-neutral-500 sm:text-sm">
            Showing{" "}
            <span className="font-medium text-neutral-900">
              {products.length === 0 ? 0 : startIndex + 1}–{endIndex}
            </span>{" "}
            of{" "}
            <span className="font-medium text-neutral-900">{products.length}</span>{" "}
            designs
          </p>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={changePage}
          />
        </div>
      </div>
    </section>
  );
}

/* =========================================================
   STYLES
========================================================= */

const Styles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&display=swap');

    :root {
      /* FONT FAMILY: logo jaisa Montserrat (heading, description, button sab mein) */
      --gk-display: 'Montserrat', system-ui, -apple-system, 'Segoe UI', sans-serif;
      --gk-sans: 'Montserrat', system-ui, -apple-system, 'Segoe UI', sans-serif;
      --gk-accent: #C0652B;
      --gk-accent-soft: #E08A4F;
      --gk-ink: #141414;
    }

    /* Tailwind "font-sans" bhi Montserrat use kare */
    .font-sans { font-family: var(--gk-sans) !important; }

    /* ---------- Typography ---------- */
    .gk-eyebrow {
      font-family: var(--gk-sans);
      font-size: 11px;
      font-weight: 500;
      letter-spacing: 0.32em;
      text-transform: uppercase;
      color: var(--gk-accent-soft); /* hero + black preview */
    }

    /* white areas par darker orange (readable) */
    .kt-content .gk-eyebrow,
    .gk-light .gk-eyebrow { color: var(--gk-accent); font-weight: 600; }

    @media (max-width: 640px) {
      .gk-eyebrow { font-size: 10px; letter-spacing: 0.24em; }
    }

    /* heading ki har line alag line mein (2 lines), kabhi wrap nahi hoti */
    .gk-line { display: block; white-space: nowrap; }

    .gk-hero-title {
      font-family: var(--gk-display);
      font-weight: 700;
      color: #fff;
      line-height: 1.2;
      letter-spacing: 0.03em;
      text-transform: uppercase;
      font-size: clamp(1.35rem, 6vw, 4rem);
    }

    .gk-hero-title em {
      font-family: var(--gk-display);
      font-style: normal;
      font-weight: 700;
      color: var(--gk-accent);
    }

    .gk-h2 {
      font-family: var(--gk-display);
      font-weight: 700;
      color: var(--gk-ink);
      line-height: 1.25;
      letter-spacing: 0.03em;
      text-transform: uppercase;
      font-size: clamp(1.15rem, 5.4vw, 2.6rem);
    }

    .gk-h2 em {
      font-family: var(--gk-display);
      font-style: normal;
      font-weight: 700;
      color: var(--gk-accent);
    }

    .gk-h3 {
      font-family: var(--gk-display);
      color: #fff;
      line-height: 1.3;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.03em;
      font-size: clamp(1.2rem, 1rem + 0.8vw, 1.55rem);
    }

    .gk-body {
      font-family: var(--gk-sans);
      font-weight: 400;
      color: rgba(255,255,255,0.78);
      line-height: 1.8;
      font-size: 15px;
    }

    @media (min-width: 1024px) { .gk-body { font-size: 16px; } }

    /* white modal overrides */
    .gk-light .gk-h3 { color: var(--gk-ink); }
    .gk-light .gk-body { color: rgba(20,20,20,0.68); }

    .kt-section-text {
      font-family: var(--gk-sans);
      font-weight: 400;
      font-size: 13.5px;
      line-height: 1.7;
      color: rgba(20,20,20,0.68);
    }

    @media (min-width: 640px) { .kt-section-text { font-size: 14.5px; } }

    .kt-card-desc {
      font-family: var(--gk-sans);
      font-weight: 400;
      font-size: 11.5px;
      line-height: 1.6;
      color: rgba(20,20,20,0.64);
    }

    @media (min-width: 640px) { .kt-card-desc { font-size: 13.5px; } }

    /* ---------- Buttons ---------- */
    .gk-btn-outline,
    .gk-btn-solid {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      height: 50px;
      padding: 0 30px;
      border-radius: 999px;
      font-family: var(--gk-sans);
      font-size: 12px;
      font-weight: 600;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: #fff;
      white-space: nowrap;
      transition: background-color .3s ease, color .3s ease, border-color .3s ease, transform .3s ease;
    }

    .gk-btn-outline { border: 1px solid rgba(255,255,255,0.35); }
    .gk-btn-outline:hover { background: #fff; color: #0A0A0A; border-color: #fff; }
    .gk-btn-solid { background: var(--gk-accent); }
    .gk-btn-solid:hover { background: #D2743A; }

    /* ---------- FIRST SCREEN: hero = 100% screen (video, dark overlay) ---------- */
    .kt-first {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
      min-height: 100dvh;
      background: #0A0A0A;
    }

    .kt-hero {
      position: relative;
      isolation: isolate;
      flex: 1 1 auto;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      /* top padding = navbar jagah */
      padding: 7rem 0 3rem;
      background:
        radial-gradient(ellipse 80% 60% at 50% 0%, rgba(192,101,43,0.28), transparent 60%),
        radial-gradient(ellipse 60% 50% at 100% 100%, rgba(192,101,43,0.16), transparent 65%),
        linear-gradient(180deg, #14100D 0%, #0D0B0A 55%, #0A0A0A 100%);
    }

    /* ---------- HERO BACKGROUND VIDEO ---------- */
    .kt-hero-video {
      position: absolute;
      inset: 0;
      z-index: -3;
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center;
      opacity: 0.9;
      pointer-events: none;
      background: #0A0A0A;
    }

    /* dark overlay: video ke upar, text ke neeche -> heading hamesha saaf nazar aaye */
    .kt-hero-shade {
      position: absolute;
      inset: 0;
      z-index: -2;
      pointer-events: none;
      background:
        radial-gradient(ellipse 70% 55% at 50% 50%, rgba(10,10,10,0.5), transparent 80%),
        radial-gradient(ellipse 80% 60% at 50% 0%, rgba(192,101,43,0.18), transparent 60%),
        linear-gradient(180deg, rgba(10,10,10,0.7) 0%, rgba(10,10,10,0.42) 40%, rgba(10,10,10,0.5) 100%);
    }

    .kt-hero-glow {
      position: absolute;
      z-index: -1;
      border-radius: 999px;
      filter: blur(90px);
      background: var(--gk-accent);
      pointer-events: none;
    }

    .kt-hero-glow-a { left: -160px; top: 25%; width: 420px; height: 420px; opacity: 0.12; }
    .kt-hero-glow-b { right: -180px; bottom: 5%; width: 460px; height: 460px; opacity: 0.09; }

    .kt-hero-lines {
      position: absolute;
      inset: 0;
      z-index: -1;
      pointer-events: none;
      opacity: 0.35;
      background-image: linear-gradient(to right, rgba(255,255,255,0.045) 1px, transparent 1px);
      background-size: 25% 100%;
      -webkit-mask-image: radial-gradient(ellipse at center, #000 20%, transparent 75%);
      mask-image: radial-gradient(ellipse at center, #000 20%, transparent 75%);
    }

    /* video ke upar text ko soft shadow taake sharp dikhe */
    .kt-hero .gk-hero-title { text-shadow: 0 2px 24px rgba(0,0,0,0.55); }
    .kt-hero .gk-eyebrow { text-shadow: 0 1px 12px rgba(0,0,0,0.6); }

    /* HERO DESCRIPTION - pure WHITE */
    .kt-hero-text {
      margin: 1.25rem auto 0;
      max-width: 520px;
      font-family: var(--gk-sans);
      font-weight: 400;
      font-size: 1rem;
      line-height: 1.75;
      color: #ffffff;
      opacity: 1;
      text-wrap: balance;
      text-shadow: 0 1px 14px rgba(0,0,0,0.65);
    }

    .kt-hero-btn { margin-top: 1.75rem; height: 48px; padding: 0 28px; font-size: 11.5px; letter-spacing: .12em; }

    /* chhoti height wali screens (desktop landscape) */
    @media (min-width: 1024px) and (max-height: 640px) {
      .kt-hero { padding-top: 6rem; padding-bottom: 2rem; }
    }

    /* ---------- TABLET + MOBILE HERO: HEIGHT 70 ---------- */
    @media (max-width: 1023px) {
      .kt-first {
        min-height: 0;
        height: auto;
      }

      .kt-hero {
        flex: none;
        min-height: 0;
        max-height: none;
        height: 70vh;
        height: 70svh;
        padding: 80px 0 28px;
      }

      /* sirf title / description / button -> eyebrow hide */
      .kt-hero .gk-eyebrow { display: none; }

      .kt-hero .gk-hero-title {
        font-size: clamp(1.65rem, 5vw, 3rem);
        line-height: 1.12;
        letter-spacing: 0.015em;
      }

      .kt-hero-text {
        max-width: 460px;
        margin: 12px auto 0;
        font-size: 14px;
        line-height: 1.6;
      }

      .kt-hero-btn { margin-top: 18px; }
    }

    @media (max-width: 640px) {
      .kt-hero { padding: 72px 0 24px; }
      .kt-hero-lines { background-size: 50% 100%; }

      .kt-hero .gk-hero-title {
        font-size: clamp(1.5rem, 6.2vw, 2.15rem);
        line-height: 1.14;
        letter-spacing: 0;
      }

      .kt-hero-text {
        font-size: 12px;
        line-height: 1.55;
        margin-top: 10px;
        padding: 0 8px;
        max-width: 330px;
      }

      .kt-hero-btn {
        width: auto;
        max-width: 100%;
        height: 42px;
        margin-top: 16px;
        padding: 0 20px;
        font-size: 10px;
      }
    }

    @media (max-width: 400px) {
      .kt-hero { padding: 68px 0 20px; }

      .kt-hero .gk-hero-title { font-size: clamp(1.35rem, 6vw, 1.7rem); }

      .kt-hero-text {
        max-width: 290px;
        font-size: 11px;
        line-height: 1.5;
      }

      .kt-hero-btn {
        height: 40px;
        margin-top: 13px;
        padding: 0 16px;
        font-size: 9px;
      }
    }

    @media (max-width: 640px) and (max-height: 600px) {
      .kt-hero { padding: 60px 0 18px; }
      .kt-hero-text { margin-top: 8px; }
      .kt-hero-btn { margin-top: 12px; }
    }

    /* ---------- Product card (white) ---------- */
    .kt-product {
      display: flex;
      flex-direction: column;
      height: 100%;
      overflow: hidden;
      border: 1px solid rgba(20,20,20,0.12);
      border-radius: 4px;
      background: #fff;
      box-shadow: 0 1px 2px rgba(20,20,20,0.04);
      transition: border-color .4s ease, transform .4s ease, box-shadow .4s ease;
    }

    .kt-product:hover {
      border-color: rgba(192,101,43,0.55);
      transform: translateY(-3px);
      box-shadow: 0 14px 32px rgba(20,20,20,0.1);
    }

    .kt-card-title {
      font-family: var(--gk-display);
      color: var(--gk-ink);
      line-height: 1.3;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.03em;
      font-size: 0.78rem;
    }

    @media (min-width: 640px) { .kt-card-title { font-size: 1rem; } }

    .kt-crop {
      position: absolute;
      top: 10px;
      left: 10px;
      z-index: 2;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      border-radius: 999px;
      background: rgba(10,10,10,0.65);
      border: 1px solid rgba(255,255,255,0.3);
      color: #fff;
      backdrop-filter: blur(6px);
      transition: background-color .3s ease, border-color .3s ease, transform .3s ease;
    }

    .kt-crop:hover { background: var(--gk-accent); border-color: var(--gk-accent); transform: scale(1.08); }

    /* WhatsApp button - solid orange */
    .kt-inquiry {
      margin-top: 1rem;
      display: flex;
      width: 100%;
      align-items: center;
      justify-content: center;
      gap: 7px;
      padding: 11px 8px;
      border-radius: 999px;
      border: 1px solid var(--gk-accent);
      background: var(--gk-accent);
      font-family: var(--gk-sans);
      font-size: 10px;
      font-weight: 600;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: #fff;
      white-space: nowrap;
      transition: background-color .3s ease, border-color .3s ease, transform .3s ease;
    }

    .kt-inquiry:hover { background: #D2743A; border-color: #D2743A; }
    .kt-inquiry:active { transform: scale(0.98); }

    @media (min-width: 640px) {
      .kt-inquiry { font-size: 11.5px; padding: 13px 14px; letter-spacing: 0.1em; }
    }

    @media (max-width: 640px) {
      .kt-product:hover { transform: none; }
    }

    /* ---------- PAGINATION (light) ---------- */
    .kt-pagination {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }

    .kt-page-number,
    .kt-page-arrow {
      display: inline-flex;
      min-width: 42px;
      height: 42px;
      align-items: center;
      justify-content: center;
      gap: 6px;
      border: 1px solid rgba(20,20,20,.18);
      border-radius: 999px;
      background: #fff;
      padding: 0 13px;
      color: rgba(20,20,20,.75);
      font-family: var(--gk-sans);
      font-size: 12px;
      font-weight: 500;
      transition:
        color .25s ease,
        background-color .25s ease,
        border-color .25s ease;
    }

    .kt-page-number:hover,
    .kt-page-arrow:not(:disabled):hover {
      color: var(--gk-accent);
      border-color: var(--gk-accent);
      background: rgba(192,101,43,.08);
    }

    .kt-page-number.is-active {
      color: #fff;
      border-color: var(--gk-ink);
      background: var(--gk-ink);
      box-shadow: 0 4px 18px rgba(20,20,20,.18);
    }

    .kt-page-arrow:disabled {
      cursor: not-allowed;
      opacity: .35;
    }

    @media (max-width: 400px) {
      .kt-page-number,
      .kt-page-arrow {
        min-width: 36px;
        height: 38px;
        padding: 0 9px;
        font-size: 11px;
      }
    }

    /* ---------- Close button (black preview viewer) ---------- */
    .kt-ctrl {
      display: flex; align-items: center; justify-content: center;
      width: 40px; height: 40px; border-radius: 999px;
      background: rgba(10,10,10,0.7);
      border: 1px solid rgba(255,255,255,0.25);
      color: #fff;
      backdrop-filter: blur(6px);
      transition: background-color .3s ease, color .3s ease;
    }

    .kt-ctrl:hover { background: #fff; color: #0A0A0A; }

    .kt-lb-img { animation: kt-fade .35s ease; }

    @keyframes kt-fade {
      from { opacity: 0; transform: scale(0.98); }
      to   { opacity: 1; transform: scale(1); }
    }

    /* details panel: mobile = neeche, desktop = right side */
    .kt-preview-info {
      flex: 0 0 auto;
      max-height: 48vh;
      overflow-y: auto;
      padding: 1.5rem 1.25rem 1.75rem;
      background: #0A0A0A;
      border-top: 1px solid rgba(255,255,255,0.1);
    }

    @media (min-width: 640px) {
      .kt-preview-info { padding: 2rem 2rem 2.25rem; }
    }

    @media (min-width: 1024px) {
      .kt-preview-info {
        width: 420px;
        max-height: none;
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding: 3rem 2.75rem;
        border-top: 0;
        border-left: 1px solid rgba(255,255,255,0.1);
      }
    }

    /* products hero ke foran baad, scroll karne par show hote hain (WHITE) */
    .kt-content {
      position: relative;
      z-index: 10;
      background: #fff;
      color: var(--gk-ink);
    }

    @media (prefers-reduced-motion: reduce) {
      .kt-product, .kt-lb-img { animation: none; transition: none; }
    }
  `}</style>
);

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function Wordrobe() {
  const [previewProduct, setPreviewProduct] = useState(null);
  const [inquiryProduct, setInquiryProduct] = useState(null);
  const [products, setProducts] = useState(localProducts);

  useEffect(() => {
    let cancelled = false;

    async function loadProducts() {
      const { data, error } = await supabase
        .from(WARDROBE_TABLE)
        .select(
          "id, title, description, image_url, price, delivery_text, status, sort_order"
        )
        .order("sort_order", { ascending: true });

      if (cancelled) return;

      if (error) {
        console.error("Could not load wardrobe products:", error);
        setProducts(localProducts);
        return;
      }

      if (!data || data.length === 0) {
        setProducts(localProducts);
        return;
      }

      const activeProducts = data.filter(
        (item) => item.status === "active"
      );

      setProducts(
        activeProducts.map((item, index) => ({
          id: item.id,
          designNumber: Number(item.sort_order) || index + 1,
          title: item.title,
          description: item.description || "",
          image: item.image_url || getImage(`word${index + 1}.webp`),
          price: item.price,
          deliveryText: item.delivery_text || DELIVERY_TEXT,
        }))
      );
    }

    loadProducts();

    return () => {
      cancelled = true;
    };
  }, []);

  const closePreview = useCallback(() => {
    setPreviewProduct(null);
  }, []);

  const closeInquiry = useCallback(() => {
    setInquiryProduct(null);
  }, []);

  const scrollToProducts = () => {
    document.getElementById("wardrobe-products")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <main className="bg-white text-[#141414]">
      <Styles />

      <FirstScreen onExplore={scrollToProducts} />
      <div className="kt-content">
        <Products
          products={products}
          onPreview={setPreviewProduct}
          onInquiry={setInquiryProduct}
        />
      </div>

      {previewProduct && (
        <Preview
          product={previewProduct}
          onClose={closePreview}
          onInquiry={(product) => {
            setPreviewProduct(null);
            setInquiryProduct(product);
          }}
        />
      )}

      {inquiryProduct && (
        <InquiryModal
          product={inquiryProduct}
          onClose={closeInquiry}
        />
      )}
    </main>
  );
}