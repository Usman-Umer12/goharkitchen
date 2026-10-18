// Media.jsx
// Install: npm i lucide-react
// Assets: ../assets/media.mp4, ../assets/media1.webp ...
// Hero background: ../assets/mob4.webp (mobile) + ../assets/des4.webp (desktop)

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
import mediaVideo from "../assets/media.mp4";
import heroMobile from "../assets/mob4.webp";
import heroDesktop from "../assets/des4.webp";
import { supabase } from "../lib/supabase";

/* =========================================================
   SETTINGS
========================================================= */
const WHATSAPP_NUMBER = "923007023202";
const BRAND = "Gohar";
const PAGE_SIZE = 12;
const DELIVERY_TEXT = "Delivery Over Pakistan";

/* =========================================================
   LOCAL IMAGE FALLBACK
========================================================= */
const localAssets = import.meta.glob("../assets/*.webp", {
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

const marqueeWords = [
  "Bespoke Media Walls",
  "Made To Measure",
  "Premium Finishes",
  "Integrated Lighting",
  "Custom Layouts",
  "Neat Installation",
];

const pad = (number) => String(number).padStart(2, "0");

const formatPrice = (price) => {
  const value = Number(price);

  return Number.isFinite(value) && value > 0
    ? `PKR ${value.toLocaleString("en-PK")}`
    : "";
};

const openWhatsApp = (text) => {
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
  const win = window.open(url, "_blank", "noopener,noreferrer");

  if (!win) window.location.href = url;
};

/* =========================================================
   LOAD PRODUCTS FROM SUPABASE
========================================================= */
const loadMediaProducts = async () => {
  const { data, error } = await supabase
    .from("media_products")
    .select(
      "id, title, description, image_url, price, delivery_text, category, status, sort_order"
    )
    .eq("status", "active")
    .order("sort_order", { ascending: true });

  if (error) throw error;

  return (data || []).map((item, index) => {
    const displayNumber = Number(item.sort_order) || index + 1;

    return {
      id: item.id,
      displayNumber,
      title: item.title || "Media Wall Design",
      description: item.description || "",
      image: item.image_url || getImage(`media${displayNumber}.webp`),
      price: item.price === null || item.price === "" ? 0 : Number(item.price),
      deliveryText: item.delivery_text || DELIVERY_TEXT,
    };
  });
};

/* =========================================================
   REVEAL ANIMATION
========================================================= */
const useReveal = () => {
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
      { threshold: 0.05 }
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
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-700 ease-out ${
        visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
      } ${className}`}
    >
      {children}
    </div>
  );
};

const Eyebrow = ({ children, align = "center", className = "" }) => (
  <div
    className={`mb-3 flex items-center gap-3 sm:mb-4 ${
      align === "center" ? "justify-center" : ""
    } ${className}`}
  >
    <span className="h-px w-7 bg-[#C0652B] sm:w-9" />
    <span className="gk-eyebrow">{children}</span>
    {align === "center" && (
      <span className="h-px w-7 bg-[#C0652B] sm:w-9" />
    )}
  </div>
);

/* =========================================================
   1. HERO + MARQUEE
   Header ke peeche background image:
   mobile  -> mob4.webp
   desktop -> des4.webp
========================================================= */
const FirstScreen = ({ onExplore }) => {
  const items = [
    ...marqueeWords,
    ...marqueeWords,
    ...marqueeWords,
    ...marqueeWords,
  ];

  return (
    <section className="kt-first">
      <header className="kt-hero">
        {/* BACKGROUND IMAGE (responsive) */}
        <picture>
          <source media="(min-width: 768px)" srcSet={heroDesktop} />
          <img
            src={heroMobile}
            alt=""
            aria-hidden="true"
            className="kt-hero-img"
            decoding="async"
          />
        </picture>
        <div className="kt-hero-shade" />

        <div className="kt-hero-glow kt-hero-glow-a" />
        <div className="kt-hero-glow kt-hero-glow-b" />
        <div className="kt-hero-lines" />

        <div className="relative z-10 mx-auto flex w-full max-w-[1000px] flex-col items-center px-4 text-center sm:px-8">
          <Eyebrow>Bespoke Media Walls</Eyebrow>

          <h1 className="gk-hero-title">
            Media Walls That Feel
            <br />
            <em>Made For You</em>
          </h1>

          <p className="kt-hero-text">
            Custom TV and media walls, built to measure with premium
            materials, integrated lighting and refined finishing for every
            living space.
          </p>

          <button
            type="button"
            onClick={onExplore}
            className="gk-btn-solid kt-hero-btn group"
          >
            Explore Collection
            <ArrowDown
              size={15}
              className="transition-transform duration-300 group-hover:translate-y-0.5"
            />
          </button>
        </div>
      </header>

      <div className="kt-marquee">
        <div className="kt-strip-track">
          {items.map((word, index) => (
            <span key={index} className="kt-strip-item">
              <span className="kt-strip-dot" />
              {word}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

/* =========================================================
   2. VIDEO
========================================================= */
const VideoSection = () => {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    const playPromise = video.play();

    if (playPromise?.catch) playPromise.catch(() => {});
  }, []);

  return (
    <section className="kt-video">
      <video
        ref={videoRef}
        className="kt-video-el"
        src={mediaVideo}
        poster={getImage("media1.webp")}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
      />

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/25" />
    </section>
  );
};

/* =========================================================
   3. WHATSAPP INQUIRY MODAL
========================================================= */
function InquiryModal({ product, onClose }) {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    city: "",
  });

  useEffect(() => {
    const handleKey = (event) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKey);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKey);
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
Hello ${BRAND}, I would like to inquire about a media wall.

*Product:* ${product.title} (Design ${pad(product.displayNumber)})
*Price:* ${formatPrice(product.price) || "Price on request"}
*Name:* ${form.name}
*Phone:* ${form.phone}
*City:* ${form.city}

Please share more details and available options.
    `.trim();

    openWhatsApp(message);
    onClose();
  };

  const inputCls =
    "w-full rounded-lg border border-white/15 bg-white/[0.04] px-3.5 py-3 font-sans text-sm text-white outline-none transition placeholder:text-white/35 focus:border-[#C0652B] focus:ring-2 focus:ring-[#C0652B]/20";

  const labelCls =
    "mb-1.5 block font-sans text-[10px] font-medium uppercase tracking-[0.14em] text-white/60";

  return (
    <div
      className="fixed inset-0 z-[130] flex items-center justify-center bg-black/80 px-4 py-5 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="media-inquiry-heading"
        className="relative max-h-[92dvh] w-full max-w-md overflow-y-auto rounded-md border border-white/10 bg-[#0F0E0D] shadow-2xl"
      >
        <div className="relative border-b border-white/10 px-5 py-5 sm:px-7">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close inquiry"
            className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full border border-white/15 text-white/80 transition hover:bg-white/10"
          >
            <X size={16} />
          </button>

          <div className="pr-8">
            <Eyebrow align="left">Product Inquiry</Eyebrow>

            <h2 id="media-inquiry-heading" className="gk-h3">
              {product.title}
            </h2>

            <p className="gk-body mt-2 !text-[12px]">
              Enter your details to continue on WhatsApp.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 px-5 py-5 sm:px-7">
          <div>
            <label htmlFor="media-iq-name" className={labelCls}>
              Full Name
            </label>
            <input
              id="media-iq-name"
              name="name"
              type="text"
              autoComplete="name"
              required
              value={form.name}
              onChange={handleChange}
              placeholder="Enter your name"
              className={inputCls}
            />
          </div>

          <div>
            <label htmlFor="media-iq-phone" className={labelCls}>
              Phone Number
            </label>
            <input
              id="media-iq-phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              required
              value={form.phone}
              onChange={handleChange}
              placeholder="03XX XXXXXXX"
              className={inputCls}
            />
          </div>

          <div>
            <label htmlFor="media-iq-city" className={labelCls}>
              City
            </label>
            <input
              id="media-iq-city"
              name="city"
              type="text"
              autoComplete="address-level2"
              required
              value={form.city}
              onChange={handleChange}
              placeholder="Enter your city"
              className={inputCls}
            />
          </div>

          <button type="submit" className="gk-btn-solid group w-full">
            <MessageCircle size={15} />
            Send Inquiry
            <ArrowRight
              size={14}
              className="transition-transform group-hover:translate-x-1"
            />
          </button>

          <p className="text-center font-sans text-[10px] text-white/40">
            Your inquiry will be sent directly to WhatsApp.
          </p>
        </form>
      </div>
    </div>
  );
}

/* =========================================================
   4. FULL-SCREEN PRODUCT PREVIEW
========================================================= */
const Preview = ({ product, onClose, onInquiry }) => {
  useEffect(() => {
    const handleKey = (event) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKey);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose]);

  return (
    <div
      className="kt-preview fixed inset-0 z-[110] flex flex-col bg-[#070707] lg:flex-row"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`${product.title} preview`}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close preview"
        className="kt-ctrl absolute right-3 top-3 z-20 sm:right-5 sm:top-5"
      >
        <X size={18} />
      </button>

      <div className="flex min-h-0 flex-1 items-center justify-center overflow-hidden p-3 pt-14 sm:p-6 sm:pt-16 lg:p-10">
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
        <Eyebrow align="left">Design {pad(product.displayNumber)}</Eyebrow>

        <h3 className="gk-h3">{product.title}</h3>

        <div className="my-3 h-px w-10 bg-[#C0652B]" />

        <p className="gk-body !text-[13px]">{product.description}</p>

        {Number(product.price) > 0 && (
          <p className="mt-2 font-sans text-sm font-semibold text-[#F28C28] sm:text-base">
            {formatPrice(product.price)}
          </p>
        )}

        <p className="mt-3 flex items-center gap-2 font-sans text-[11px] text-white/60">
          <Truck size={14} className="shrink-0 text-[#E08A4F]" />
          {product.deliveryText}
        </p>

        <button
          type="button"
          onClick={() => onInquiry(product)}
          className="gk-btn-solid mt-5 w-full"
        >
          <MessageCircle size={15} />
          WhatsApp Inquiry
        </button>
      </aside>
    </div>
  );
};

/* =========================================================
   5. PRODUCT CARD
========================================================= */
const ProductCard = ({ product, index, onPreview, onInquiry }) => (
  <Reveal delay={(index % 4) * 45} className="h-full">
    <article className="kt-product group">
      <div className="relative aspect-[4/5] overflow-hidden bg-[#171513]">
        <img
          src={product.image}
          alt={product.title}
          loading="lazy"
          decoding="async"
          onClick={() => onPreview(product)}
          className="h-full w-full cursor-zoom-in object-cover transition-transform duration-700 group-hover:scale-[1.04]"
        />

        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/55 to-transparent" />

        <button
          type="button"
          onClick={() => onPreview(product)}
          aria-label={`Preview ${product.title}`}
          className="kt-crop"
        >
          <Crop size={15} strokeWidth={1.8} />
        </button>
      </div>

      <div className="flex flex-1 flex-col p-2.5 sm:p-4">
        <h3 className="kt-card-title line-clamp-1">{product.title}</h3>

        <p className="mt-1.5 line-clamp-2 min-h-[2.2rem] font-sans text-[11px] font-light leading-[1.6] text-white/60 sm:text-xs">
          {product.description}
        </p>

        {/* ADMIN PRICE — ORANGE, BELOW DESCRIPTION */}
        {Number(product.price) > 0 && (
          <p className="mt-2 font-sans text-base font-semibold text-[#F28C28] sm:text-lg">
            {formatPrice(product.price)}
          </p>
        )}

        <p className="mt-2 flex items-center gap-1.5 font-sans text-[10px] text-white/55 sm:text-[11px]">
          <Truck size={12} className="shrink-0 text-[#E08A4F]" />
          <span>{product.deliveryText}</span>
        </p>

        <button
          type="button"
          onClick={() => onInquiry(product)}
          className="kt-inquiry mt-auto"
        >
          <MessageCircle size={13} className="shrink-0" />
          <span>WhatsApp Inquiry</span>
        </button>
      </div>
    </article>
  </Reveal>
);

/* =========================================================
   6. PAGINATION
========================================================= */
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <nav className="kt-pagination" aria-label="Media product pages">
      <button
        type="button"
        className="kt-page-arrow"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        aria-label="Previous page"
      >
        <ChevronLeft size={17} />
        <span className="hidden sm:inline">Previous</span>
      </button>

      {pages.map((page) => (
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
      ))}

      <button
        type="button"
        className="kt-page-arrow"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        aria-label="Next page"
      >
        <span className="hidden sm:inline">Next</span>
        <ChevronRight size={17} />
      </button>
    </nav>
  );
};

/* =========================================================
   7. PRODUCTS + PAGINATION
========================================================= */
const Products = ({
  products,
  loading,
  onPreview,
  onInquiry,
}) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(products.length / PAGE_SIZE);
  const safePage = Math.min(currentPage, Math.max(totalPages, 1));
  const startIndex = (safePage - 1) * PAGE_SIZE;
  const endIndex = Math.min(startIndex + PAGE_SIZE, products.length);
  const shown = products.slice(startIndex, endIndex);

  const changePage = (page) => {
    const nextPage = Math.max(1, Math.min(page, totalPages));

    if (nextPage === safePage) return;

    setCurrentPage(nextPage);

    window.setTimeout(() => {
      document.getElementById("media-products")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 50);
  };

  return (
    <section
      id="media-products"
      className="relative scroll-mt-6 py-12 sm:py-16 lg:py-20"
    >
      <div className="mx-auto max-w-[1320px] px-4 sm:px-7 lg:px-12">
        <Reveal>
          <div className="mb-7 text-center sm:mb-10">
            <Eyebrow>Our Collection</Eyebrow>

            <h2 className="gk-h2">
              Media Walls Designed
              <br />
              <em>Around Your Space</em>
            </h2>

            <p className="mx-auto mt-2 max-w-md font-sans text-xs font-light leading-6 text-white/55 sm:text-sm">
              Explore thoughtfully designed media walls for modern living.
            </p>
          </div>
        </Reveal>

        {loading ? (
          <div className="py-16 text-center font-sans text-sm text-white/60">
            Loading media wall designs...
          </div>
        ) : products.length === 0 ? (
          <div className="py-16 text-center">
            <p className="font-sans text-sm text-white/70">
              No media wall designs are currently available.
            </p>
          </div>
        ) : (
          <>
            <div
              key={safePage}
              className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 lg:gap-5"
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

            <div className="mt-10 flex flex-col items-center justify-between gap-5 border-t border-white/10 pt-6 sm:mt-12 sm:flex-row">
              <p className="font-sans text-xs font-light tracking-wide text-white/50 sm:text-sm">
                Showing{" "}
                <span className="font-medium text-white">
                  {startIndex + 1}–{endIndex}
                </span>{" "}
                of{" "}
                <span className="font-medium text-white">
                  {products.length}
                </span>{" "}
                designs
              </p>

              <Pagination
                currentPage={safePage}
                totalPages={totalPages}
                onPageChange={changePage}
              />
            </div>
          </>
        )}
      </div>
    </section>
  );
};

/* =========================================================
   8. STYLES
========================================================= */
const Styles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;1,500;1,600&family=Jost:wght@300;400;500;600&display=swap');

    .media-page {
      --gk-display: 'Cormorant Garamond', Georgia, serif;
      --gk-sans: 'Jost', system-ui, sans-serif;
      --gk-accent: #C0652B;
      --gk-accent-soft: #E08A4F;
      font-family: var(--gk-sans);

      /* Sticky video controls (desktop ke liye adjust karo) */
      --kt-video-pos-y: 35%;          /* 0% = upar, 50% = beech, 100% = neeche */
      --kt-video-zoom-desktop: 1.12;  /* zoom zyada/kam karna ho to yahan badlo */
    }

    @media (min-width: 1920px) {
      .media-page { --kt-video-zoom-desktop: 1.2; }
    }

    .media-page .gk-eyebrow {
      font-family: var(--gk-sans);
      font-size: 10px;
      font-weight: 500;
      letter-spacing: .20em;
      text-transform: uppercase;
      color: var(--gk-accent-soft);
    }

    .media-page .gk-hero-title {
      font-family: var(--gk-display);
      font-weight: 500;
      color: #fff;
      line-height: 1.04;
      letter-spacing: -.025em;
      font-size: clamp(2.25rem, 1rem + 6vw, 5.4rem);
    }

    .media-page .gk-hero-title em,
    .media-page .gk-h2 em {
      font-style: italic;
      color: var(--gk-accent-soft);
    }

    .media-page .gk-h2 {
      font-family: var(--gk-display);
      font-weight: 500;
      color: #fff;
      line-height: 1.08;
      letter-spacing: -.015em;
      font-size: clamp(1.9rem, 1.25rem + 2.6vw, 3.3rem);
    }

    .media-page .gk-h3 {
      font-family: var(--gk-display);
      font-weight: 600;
      color: #fff;
      line-height: 1.12;
      font-size: clamp(1.45rem, 1.2rem + .8vw, 1.9rem);
    }

    .media-page .gk-body {
      font-family: var(--gk-sans);
      font-weight: 300;
      color: rgba(255,255,255,.7);
      line-height: 1.7;
      font-size: 13px;
    }

    .media-page .gk-btn-solid {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 7px;
      min-height: 42px;
      padding: 0 22px;
      border: 1px solid var(--gk-accent);
      border-radius: 999px;
      background: var(--gk-accent);
      color: #fff;
      font-family: var(--gk-sans);
      font-size: 10px;
      font-weight: 500;
      letter-spacing: .11em;
      text-transform: uppercase;
      white-space: nowrap;
      transition: background-color .25s ease, border-color .25s ease;
    }

    .media-page .gk-btn-solid:hover {
      background: #D2743A;
      border-color: #D2743A;
    }

    .media-page .kt-first {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
      min-height: 100dvh;
      background: #0A0A0A;
    }

    .media-page .kt-hero {
      position: relative;
      isolation: isolate;
      flex: 1 1 auto;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      min-height: 420px;
      padding: 7rem 0 2.5rem;
      background:
        radial-gradient(ellipse 80% 60% at 50% 0%, rgba(192,101,43,.25), transparent 60%),
        radial-gradient(ellipse 60% 50% at 100% 100%, rgba(192,101,43,.14), transparent 65%),
        linear-gradient(180deg, #14100D 0%, #0D0B0A 55%, #0A0A0A 100%);
    }

    /* ---------- HERO BACKGROUND IMAGE (mobile: mob4 / desktop: des4) ---------- */
    .media-page .kt-hero picture {
      position: absolute;
      inset: 0;
      z-index: -3;
      display: block;
    }

    .media-page .kt-hero-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center;
      opacity: .45;
      transform: scale(1.04);
    }

    /* dark overlay + copper glow so text stays readable, bottom blends into marquee */
    .media-page .kt-hero-shade {
      position: absolute;
      inset: 0;
      z-index: -2;
      pointer-events: none;
      background:
        radial-gradient(ellipse 80% 60% at 50% 0%, rgba(192,101,43,.30), transparent 60%),
        linear-gradient(180deg, rgba(10,10,10,.72) 0%, rgba(10,10,10,.5) 45%, #0A0A0A 100%);
    }

    .media-page .kt-hero-glow {
      position: absolute;
      z-index: -1;
      border-radius: 999px;
      filter: blur(90px);
      background: var(--gk-accent);
      pointer-events: none;
    }

    .media-page .kt-hero-glow-a {
      left: -160px;
      top: 25%;
      width: 360px;
      height: 360px;
      opacity: .12;
    }

    .media-page .kt-hero-glow-b {
      right: -180px;
      bottom: 5%;
      width: 390px;
      height: 390px;
      opacity: .09;
    }

    .media-page .kt-hero-lines {
      position: absolute;
      inset: 0;
      z-index: -1;
      pointer-events: none;
      opacity: .4;
      background-image: linear-gradient(to right, rgba(255,255,255,.045) 1px, transparent 1px);
      background-size: 25% 100%;
      -webkit-mask-image: radial-gradient(ellipse at center, #000 20%, transparent 75%);
      mask-image: radial-gradient(ellipse at center, #000 20%, transparent 75%);
    }

    .media-page .kt-hero-text {
      margin: 1rem auto 0;
      max-width: 540px;
      font-family: var(--gk-sans);
      font-weight: 300;
      font-size: 13px;
      line-height: 1.8;
      color: rgba(255,255,255,.8);
    }

    .media-page .kt-hero-btn {
      width: auto;
      margin-top: 1.5rem;
      padding: 0 22px;
    }

    .media-page .kt-marquee {
      flex: 0 0 auto;
      overflow: hidden;
      border-top: 1px solid rgba(255,255,255,.1);
      border-bottom: 1px solid rgba(255,255,255,.1);
      background: #0F0E0D;
      padding: .9rem 0;
    }

    .media-page .kt-strip-track {
      display: flex;
      width: max-content;
      animation: media-strip 40s linear infinite;
    }

    .media-page .kt-strip-item {
      display: inline-flex;
      align-items: center;
      gap: 20px;
      padding-right: 20px;
      font-family: var(--gk-display);
      font-style: italic;
      font-size: clamp(1rem, .9rem + .6vw, 1.45rem);
      color: rgba(255,255,255,.82);
      white-space: nowrap;
    }

    .media-page .kt-strip-dot {
      width: 5px;
      height: 5px;
      border-radius: 999px;
      background: var(--gk-accent);
    }

    @keyframes media-strip {
      from { transform: translateX(0); }
      to { transform: translateX(-50%); }
    }

    .media-page .kt-video {
      position: sticky;
      top: 0;
      z-index: 0;
      width: 100%;
      height: 100vh;
      height: 100dvh;
      overflow: hidden;
      background: #0A0A0A;
    }

    .media-page .kt-video-el {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center var(--kt-video-pos-y);
    }

    /* Desktop / laptop: portrait video ko poori screen pe cover + zoom */
    @media (min-width: 1024px) and (orientation: landscape) {
      .media-page .kt-video-el {
        transform: scale(var(--kt-video-zoom-desktop));
        transform-origin: center center;
      }
    }

    .media-page .kt-content {
      position: relative;
      z-index: 10;
      background: #0A0A0A;
      border-radius: 24px 24px 0 0;
      box-shadow: 0 -25px 55px rgba(0,0,0,.55);
    }

    .media-page .kt-product {
      display: flex;
      flex-direction: column;
      height: 100%;
      overflow: hidden;
      border: 1px solid rgba(255,255,255,.1);
      border-radius: 4px;
      background: #141211;
      transition: border-color .3s ease, transform .3s ease;
    }

    .media-page .kt-product:hover {
      border-color: rgba(192,101,43,.5);
      transform: translateY(-2px);
    }

    .media-page .kt-card-title {
      font-family: var(--gk-display);
      font-weight: 600;
      color: #fff;
      line-height: 1.2;
      font-size: 1rem;
    }

    .media-page .kt-crop {
      position: absolute;
      top: 8px;
      left: 8px;
      z-index: 2;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 31px;
      height: 31px;
      border-radius: 999px;
      background: rgba(10,10,10,.72);
      border: 1px solid rgba(255,255,255,.25);
      color: #fff;
      backdrop-filter: blur(6px);
      transition: background-color .25s ease;
    }

    .media-page .kt-crop:hover {
      background: var(--gk-accent);
    }

    .media-page .kt-inquiry {
      margin-top: 12px;
      display: flex;
      width: 100%;
      min-height: 35px;
      align-items: center;
      justify-content: center;
      gap: 6px;
      padding: 8px 6px;
      border-radius: 999px;
      border: 1px solid var(--gk-accent);
      background: var(--gk-accent);
      font-family: var(--gk-sans);
      font-size: 9px;
      font-weight: 500;
      letter-spacing: .045em;
      text-transform: uppercase;
      color: #fff;
      white-space: nowrap;
      transition: background-color .25s ease;
    }

    .media-page .kt-inquiry:hover {
      background: #D2743A;
    }

    .media-page .kt-pagination {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }

    .media-page .kt-page-number,
    .media-page .kt-page-arrow {
      display: inline-flex;
      min-width: 42px;
      height: 42px;
      align-items: center;
      justify-content: center;
      gap: 6px;
      border: 1px solid rgba(255,255,255,.16);
      border-radius: 999px;
      background: rgba(255,255,255,.025);
      padding: 0 13px;
      color: rgba(255,255,255,.7);
      font-family: var(--gk-sans);
      font-size: 12px;
      font-weight: 500;
      transition: color .25s ease, background-color .25s ease, border-color .25s ease;
    }

    .media-page .kt-page-number:hover,
    .media-page .kt-page-arrow:not(:disabled):hover {
      color: #fff;
      border-color: var(--gk-accent);
      background: rgba(192,101,43,.15);
    }

    .media-page .kt-page-number.is-active {
      color: #fff;
      border-color: var(--gk-accent);
      background: var(--gk-accent);
      box-shadow: 0 4px 18px rgba(192,101,43,.2);
    }

    .media-page .kt-page-arrow:disabled {
      cursor: not-allowed;
      opacity: .3;
    }

    .media-page .kt-ctrl {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 38px;
      height: 38px;
      border-radius: 999px;
      background: rgba(10,10,10,.7);
      border: 1px solid rgba(255,255,255,.25);
      color: #fff;
      backdrop-filter: blur(6px);
      transition: background-color .25s ease, color .25s ease;
    }

    .media-page .kt-ctrl:hover {
      background: #fff;
      color: #0A0A0A;
    }

    .media-page .kt-lb-img {
      animation: media-fade .3s ease;
    }

    @keyframes media-fade {
      from { opacity: 0; transform: scale(.985); }
      to { opacity: 1; transform: scale(1); }
    }

    .media-page .kt-preview-info {
      flex: 0 0 auto;
      max-height: 48dvh;
      overflow-y: auto;
      padding: 1.1rem 1rem 1.25rem;
      background: #0F0E0D;
      border-top: 1px solid rgba(255,255,255,.1);
    }

    @media (min-width: 640px) {
      .media-page .gk-eyebrow {
        font-size: 10px;
        letter-spacing: .22em;
      }

      .media-page .kt-hero {
        min-height: 450px;
        padding: 7rem 0 2.5rem;
      }

      .media-page .kt-hero-text {
        font-size: 14px;
      }

      .media-page .kt-card-title {
        font-size: 1.2rem;
      }

      .media-page .kt-inquiry {
        font-size: 10px;
        min-height: 38px;
      }

      .media-page .kt-preview-info {
        padding: 1.75rem 2rem;
      }
    }

    @media (min-width: 1024px) {
      .media-page .kt-hero {
        min-height: 480px;
        padding: 7.5rem 0 3rem;
      }

      .media-page .kt-preview-info {
        width: 390px;
        max-height: none;
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding: 2.5rem;
        border-top: 0;
        border-left: 1px solid rgba(255,255,255,.1);
      }
    }

    @media (max-width: 640px) {
      .media-page .kt-hero {
        min-height: 390px;
        padding: 6rem 0 2rem;
      }

      .media-page .kt-hero-lines {
        background-size: 50% 100%;
      }

      .media-page .kt-hero-text {
        max-width: 340px;
        margin-top: .85rem;
        padding: 0 3px;
        font-size: 12px;
        line-height: 1.7;
      }

      .media-page .kt-hero-btn {
        min-height: 39px;
        margin-top: 1.2rem;
        padding: 0 18px;
        font-size: 9px;
      }

      .media-page .kt-marquee {
        padding: .7rem 0;
      }

      .media-page .kt-strip-item {
        gap: 15px;
        padding-right: 15px;
        font-size: 1rem;
      }

      .media-page .kt-content {
        border-radius: 17px 17px 0 0;
      }

      .media-page .kt-card-title {
        font-size: .94rem;
      }

      .media-page .kt-inquiry {
        font-size: 8px;
        letter-spacing: .02em;
        gap: 4px;
        padding: 7px 3px;
      }

      .media-page .kt-preview-info {
        max-height: 45dvh;
      }
    }

    @media (max-width: 400px) {
      .media-page .kt-page-number,
      .media-page .kt-page-arrow {
        min-width: 36px;
        height: 38px;
        padding: 0 9px;
        font-size: 11px;
      }
    }

    @media (max-height: 640px) {
      .media-page .kt-hero {
        padding-top: 5.5rem;
        padding-bottom: 1.5rem;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .media-page .kt-strip-track {
        animation: none;
      }

      .media-page .kt-product,
      .media-page .kt-lb-img {
        animation: none;
        transition: none;
      }
    }
  `}</style>
);

/* =========================================================
   9. MAIN PAGE
========================================================= */
const Media = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [previewProduct, setPreviewProduct] = useState(null);
  const [inquiryProduct, setInquiryProduct] = useState(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setLoadError("");

    try {
      const data = await loadMediaProducts();
      setProducts(data);
    } catch (error) {
      console.error("Public media products loading error:", error);
      setLoadError("Unable to load media designs. Please try again later.");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const closePreview = useCallback(() => setPreviewProduct(null), []);
  const closeInquiry = useCallback(() => setInquiryProduct(null), []);

  const scrollToProducts = () => {
    document.getElementById("media-products")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const openInquiryFromPreview = (product) => {
    setPreviewProduct(null);
    setInquiryProduct(product);
  };

  return (
    <main className="media-page min-h-screen overflow-x-clip bg-[#0A0A0A] text-white antialiased">
      <Styles />

      <FirstScreen onExplore={scrollToProducts} />

      <VideoSection />

      <div className="kt-content">
        {loadError && (
          <div className="px-4 pt-8 text-center font-sans text-sm text-red-300">
            {loadError}
            <button
              type="button"
              onClick={fetchProducts}
              className="ml-3 underline underline-offset-4"
            >
              Try again
            </button>
          </div>
        )}

        <Products
          products={products}
          loading={loading}
          onPreview={setPreviewProduct}
          onInquiry={setInquiryProduct}
        />
      </div>

      {previewProduct && (
        <Preview
          product={previewProduct}
          onClose={closePreview}
          onInquiry={openInquiryFromPreview}
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
};

export default Media;