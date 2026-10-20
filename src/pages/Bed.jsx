
 // Bed.jsx
// Assets: ../assets/bed.mp4, bed1.webp ... bed10.webp
// Hero: ../assets/mob1.webp (mobile) + ../assets/des1.webp (desktop)
// Supabase table: bed_products
// Video: manual start, always muted, no autoplay, no mute/unmute control

import { useCallback, useEffect, useRef, useState } from "react";
import {
  ArrowDown,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Crop,
  MessageCircle,
  Pause,
  Play,
  Truck,
  X,
} from "lucide-react";

import bedVideo from "../assets/bed.mp4";
import heroMobile from "../assets/mob1.webp";
import heroDesktop from "../assets/des1.webp";
import { supabase } from "../lib/supabase";

const WHATSAPP_NUMBER = "923007023202";
const BRAND = "Gohar";
const TOTAL_PRODUCTS = 10;
const PAGE_SIZE = 12;
const DELIVERY_TEXT = "Delivery All Over Pakistan";

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
  "Modern Luxury Bed",
  "Contemporary Upholstered Bed",
  "Premium Wooden Bed",
  "Minimal Platform Bed",
  "Elegant Panel Bed",
  "Luxury King Size Bed",
  "Modern Statement Bed",
  "Classic Wooden Bed",
  "Designer Upholstered Bed",
  "Contemporary Bedroom Bed",
];

const descriptions = [
  "A refined bedroom design combining timeless style, comfort and premium finishing.",
  "A clean contemporary design with elegant detailing and a comfortable upholstered finish.",
  "Beautifully crafted wooden styling with a practical design for everyday comfort.",
  "A minimalist design that brings a balanced and sophisticated look to your bedroom.",
  "Thoughtful detailing and premium materials create a welcoming bedroom atmosphere.",
];

const localProducts = Array.from({ length: TOTAL_PRODUCTS }, (_, index) => ({
  id: index + 1,
  designNumber: index + 1,
  title: titles[index % titles.length],
  description: descriptions[index % descriptions.length],
  image: getImage(`bed${index + 1}.webp`),
  price: 0,
  deliveryText: DELIVERY_TEXT,
}));

const pad = (number) => String(number).padStart(2, "0");

const formatTime = (seconds) => {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;
};

const formatPrice = (price) =>
  Number(price).toLocaleString("en-PK", {
    maximumFractionDigits: 0,
  });

function openWhatsApp(message) {
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  const openedWindow = window.open(url, "_blank", "noopener,noreferrer");

  if (!openedWindow) window.location.href = url;
}

const useReveal = () => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    if (!("IntersectionObserver" in window)) {
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

  return [ref, visible];
};

const Reveal = ({ children, delay = 0, className = "" }) => {
  const [ref, visible] = useReveal();

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-700 ease-out ${
        visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
      } ${className}`}
    >
      {children}
    </div>
  );
};

const Eyebrow = ({ children, align = "center", className = "" }) => (
  <div
    className={`mb-4 flex items-center gap-3 sm:mb-5 ${
      align === "center" ? "justify-center" : ""
    } ${className}`}
  >
    <span className="h-px w-8 bg-[#C0652B] sm:w-10" />
    <span className="gk-eyebrow">{children}</span>
    {align === "center" && (
      <span className="h-px w-8 bg-[#C0652B] sm:w-10" />
    )}
  </div>
);

/* =========================================================
   1. HERO
========================================================= */

const FirstScreen = ({ onExplore }) => (
  <section className="kt-first">
    <header className="kt-hero">
      <picture>
        <source media="(min-width: 768px)" srcSet={heroDesktop} />
        <img
          src={heroMobile}
          alt="Gohar luxury bedroom designs"
          className="kt-hero-img"
          decoding="async"
        />
      </picture>

      <div className="kt-hero-shade" />
      <div className="kt-hero-glow kt-hero-glow-a" />
      <div className="kt-hero-glow kt-hero-glow-b" />
      <div className="kt-hero-lines" />

      <div className="relative z-10 mx-auto flex w-full max-w-[1000px] flex-col items-center px-5 text-center sm:px-8">
        <Eyebrow>Bespoke Bedroom Designs</Eyebrow>

        <h1 className="gk-hero-title">
          <span className="gk-line">Beds That Feel</span>
          <span className="gk-line">
            <em>Made For You</em>
          </span>
        </h1>

        <p className="kt-hero-text">
          Discover beautifully designed beds with premium finishes, thoughtful
          details and comfort made for your home.
        </p>

        <button
          type="button"
          onClick={onExplore}
          className="gk-btn-solid kt-hero-btn group"
        >
          Explore Collection
          <ArrowDown
            size={17}
            className="transition-transform duration-300 group-hover:translate-y-0.5"
          />
        </button>
      </div>
    </header>
  </section>
);

/* =========================================================
   2. VIDEO SECTION — DOES NOT AUTOPLAY
========================================================= */

const VideoSection = ({ onOpen }) => (
  <section className="kt-video">
    <video
      className="kt-video-el"
      src={bedVideo}
      poster={getImage("bed1.webp")}
      muted
      playsInline
      preload="metadata"
      aria-label="Gohar bedroom and bed designs"
    />

    <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A]/55 via-[#0A0A0A]/20 to-[#0A0A0A]/40" />

    <button
      type="button"
      onClick={onOpen}
      aria-label="Start bed designs video"
      className="kt-play group"
    >
      <span className="kt-play-btn">
        <Play
          size={30}
          strokeWidth={0}
          fill="currentColor"
          className="ml-1"
        />
      </span>
      <span className="kt-start-label">Start</span>
      <span className="kt-start-sub">Discover Our Bed Designs</span>
    </button>
  </section>
);

/* =========================================================
   3. VIDEO MODAL — MUTED PERMANENTLY
========================================================= */

function VideoModal({ onClose }) {
  const videoRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };

    const previousOverflow = document.body.style.overflow;
    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      videoRef.current?.pause();
    };
  }, [onClose]);

  const togglePlayback = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      // Keep sound off even when the customer starts playback.
      video.muted = true;
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  };

  const handleSeek = (event) => {
    const video = videoRef.current;
    if (!video || !duration) return;

    const nextTime = (Number(event.target.value) / 1000) * duration;
    video.currentTime = nextTime;
    setCurrent(nextTime);
  };

  const progress = duration ? (current / duration) * 100 : 0;

  return (
    <div
      className="fixed inset-0 z-[140] flex items-center justify-center bg-black/85 p-3 backdrop-blur-md sm:p-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Bed designs video"
    >
      <div className="kt-vm relative flex max-h-[88dvh] max-w-[94vw] items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-black shadow-[0_30px_90px_rgba(0,0,0,0.7)]">
        <video
          ref={videoRef}
          src={bedVideo}
          poster={getImage("bed1.webp")}
          playsInline
          muted
          preload="metadata"
          onClick={togglePlayback}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onEnded={() => setPlaying(false)}
          onTimeUpdate={(event) =>
            setCurrent(event.currentTarget.currentTime)
          }
          onLoadedMetadata={(event) =>
            setDuration(event.currentTarget.duration)
          }
          className="block max-h-[88dvh] min-w-[min(92vw,300px)] max-w-[94vw] cursor-pointer object-contain"
        />

        <button
          type="button"
          onClick={onClose}
          aria-label="Close video"
          className="kt-ctrl absolute right-3 top-3 z-20"
        >
          <X size={18} />
        </button>

        {!playing && (
          <button
            type="button"
            onClick={togglePlayback}
            aria-label="Play video"
            className="kt-vm-center"
          >
            <Play
              size={28}
              strokeWidth={0}
              fill="currentColor"
              className="ml-1"
            />
          </button>
        )}

        <div className="kt-vm-bar">
          <button
            type="button"
            onClick={togglePlayback}
            aria-label={playing ? "Pause video" : "Play video"}
            className="kt-vbtn"
          >
            {playing ? (
              <Pause size={18} strokeWidth={0} fill="currentColor" />
            ) : (
              <Play size={18} strokeWidth={0} fill="currentColor" />
            )}
          </button>

          <input
            type="range"
            min="0"
            max="1000"
            step="1"
            value={duration ? Math.round((current / duration) * 1000) : 0}
            onChange={handleSeek}
            aria-label="Seek video"
            className="kt-range"
            style={{
              background: `linear-gradient(to right, var(--gk-accent) ${progress}%, rgba(255,255,255,0.28) ${progress}%)`,
            }}
          />

          <span className="kt-vm-time">
            {formatTime(current)} / {formatTime(duration)}
          </span>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   4. WHATSAPP INQUIRY MODAL
========================================================= */

function InquiryModal({ product, onClose }) {
  const [form, setForm] = useState({ name: "", phone: "", city: "" });

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };

    const previousOverflow = document.body.style.overflow;
    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

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

    const productPrice =
      Number(product.price) > 0
        ? `\n*Price:* PKR ${formatPrice(product.price)}`
        : "";

    const message = `
Hello ${BRAND}, I would like to inquire about a bed design.

*Product:* ${product.title} (Design ${pad(
      product.designNumber ?? product.id
    )})${productPrice}
*Name:* ${form.name}
*Phone:* ${form.phone}
*City:* ${form.city}

Please share more details and available options.
    `.trim();

    openWhatsApp(message);
    onClose();
  };

  const inputClass =
    "w-full rounded-lg border border-white/15 bg-white/[0.04] px-4 py-3.5 font-sans text-sm text-white outline-none transition duration-200 placeholder:text-white/35 focus:border-[#C0652B] focus:ring-2 focus:ring-[#C0652B]/20";

  const labelClass =
    "mb-2 block font-sans text-[11px] font-medium uppercase tracking-[0.16em] text-white/60";

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
        aria-label="Bed product inquiry"
        className="relative max-h-[92dvh] w-full max-w-lg overflow-y-auto rounded-md border border-white/10 bg-[#0F0E0D] shadow-[0_30px_80px_rgba(0,0,0,0.6)]"
      >
        <div className="relative overflow-hidden border-b border-white/10 px-5 py-6 sm:px-8 sm:py-7">
          <div className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-[#C0652B] opacity-[0.12] blur-3xl" />

          <button
            type="button"
            onClick={onClose}
            aria-label="Close inquiry"
            className="absolute right-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white/80 transition hover:bg-white/10 hover:text-white"
          >
            <X size={17} />
          </button>

          <div className="relative z-10 pr-10">
            <Eyebrow align="left">Product Inquiry</Eyebrow>
            <h2 className="gk-h3 !text-[1.2rem] sm:!text-[1.5rem]">
              {product.title}
            </h2>

            {Number(product.price) > 0 && (
              <p className="mt-2 font-sans text-sm font-semibold text-[#E08A4F]">
                PKR {formatPrice(product.price)}
              </p>
            )}

            <p className="gk-body mt-2 !text-[13px] sm:!text-[13.5px]">
              Share your details and we will continue the conversation on
              WhatsApp.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="px-5 py-6 sm:px-8 sm:py-8">
          <div className="space-y-5">
            <div>
              <label htmlFor="bed-iq-name" className={labelClass}>
                Full Name
              </label>
              <input
                id="bed-iq-name"
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
              <label htmlFor="bed-iq-phone" className={labelClass}>
                Phone Number
              </label>
              <input
                id="bed-iq-phone"
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
              <label htmlFor="bed-iq-city" className={labelClass}>
                City
              </label>
              <input
                id="bed-iq-city"
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

          <button type="submit" className="gk-btn-solid group mt-7 !flex w-full">
            <MessageCircle size={17} strokeWidth={2} className="shrink-0" />
            Send Inquiry
            <ArrowRight
              size={15}
              strokeWidth={2}
              className="shrink-0 transition-transform duration-300 group-hover:translate-x-1"
            />
          </button>

          <p className="mt-3 text-center font-sans text-[11px] leading-5 text-white/40">
            Your inquiry will be sent directly to our WhatsApp.
          </p>
        </form>
      </div>
    </div>
  );
}

/* =========================================================
   5. FULL-SCREEN PRODUCT PREVIEW
========================================================= */

const Preview = ({ product, onClose, onInquiry }) => {
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };

    const previousOverflow = document.body.style.overflow;
    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

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
      aria-label={product.title}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close product preview"
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

        {Number(product.price) > 0 && (
          <p className="mt-3 font-sans text-lg font-semibold text-[#E08A4F]">
            PKR {formatPrice(product.price)}
          </p>
        )}

        <div className="my-4 h-px w-12 bg-[#C0652B] sm:my-5" />

        <p className="gk-body !text-[14px] sm:!text-[15px]">
          {product.description}
        </p>

        <p className="mt-4 flex items-center gap-2 font-sans text-xs font-medium tracking-wide text-white/60 sm:text-[13px]">
          <Truck size={15} strokeWidth={1.6} className="shrink-0 text-[#E08A4F]" />
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
};

/* =========================================================
   6. PRODUCT CARD
========================================================= */

const ProductCard = ({ product, index, onPreview, onInquiry }) => (
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
          <Crop size={16} strokeWidth={1.8} />
        </button>
      </div>

      <div className="flex flex-1 flex-col p-3 sm:p-5">
        <h3 className="kt-card-title line-clamp-1">{product.title}</h3>

        {Number(product.price) > 0 && (
          <p className="mt-2 font-sans text-xs font-semibold text-[#E08A4F] sm:text-sm">
            PKR {formatPrice(product.price)}
          </p>
        )}

        <p className="kt-card-desc mt-2 line-clamp-2 min-h-[2.5rem]">
          {product.description}
        </p>

        <p className="mt-3 flex items-center gap-2 font-sans text-[10.5px] font-medium tracking-wide text-white/55 sm:text-xs">
          <Truck size={14} strokeWidth={1.6} className="shrink-0 text-[#E08A4F]" />
          <span className="truncate">
            {product.deliveryText || DELIVERY_TEXT}
          </span>
        </p>

        <button
          type="button"
          onClick={() => onInquiry(product)}
          className="kt-inquiry mt-auto"
        >
          <MessageCircle strokeWidth={1.8} className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" />
          <span className="truncate">
            <span className="hidden sm:inline">WhatsApp </span>
            Inquiry
          </span>
        </button>
      </div>
    </article>
  </Reveal>
);

/* =========================================================
   7. PAGINATION
========================================================= */

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <nav className="kt-pagination" aria-label="Bed product pages">
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
          className={`kt-page-number ${currentPage === page ? "is-active" : ""}`}
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
   8. PRODUCTS
========================================================= */

const Products = ({ products, onPreview, onInquiry }) => {
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
      document.getElementById("bed-products")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 50);
  };

  return (
    <section
      id="bed-products"
      className="relative scroll-mt-6 py-12 sm:py-16 lg:py-20"
    >
      <div className="mx-auto max-w-[1320px] px-4 sm:px-8 lg:px-12">
        <Reveal>
          <div className="mb-8 text-center sm:mb-10">
            <Eyebrow>Our Collection</Eyebrow>

            <h2 className="gk-h2">
              <span className="gk-line">Beds Designed</span>
              <span className="gk-line">
                <em>Around Your Comfort</em>
              </span>
            </h2>

            <p className="kt-section-text mx-auto mt-4 max-w-lg">
              Explore thoughtfully designed beds made for comfort, style and
              your personal space.
            </p>
          </div>
        </Reveal>

        {products.length > 0 ? (
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
          <div className="border border-white/10 bg-[#141211] px-5 py-12 text-center">
            <p className="font-sans text-sm text-white/65">
              No bed designs are available right now. Please check back soon.
            </p>
          </div>
        )}

        <div className="mt-10 flex flex-col items-center justify-between gap-5 border-t border-white/10 pt-6 sm:mt-12 sm:flex-row">
          <p className="font-sans text-xs font-light tracking-wide text-white/50 sm:text-sm">
            Showing{" "}
            <span className="font-medium text-white">
              {products.length === 0 ? 0 : startIndex + 1}–{endIndex}
            </span>{" "}
            of{" "}
            <span className="font-medium text-white">{products.length}</span>{" "}
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
};

/* =========================================================
   9. STYLES
========================================================= */

const Styles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&display=swap');

    :root {
      --gk-display: 'Montserrat', system-ui, sans-serif;
      --gk-sans: 'Montserrat', system-ui, sans-serif;
      --gk-accent: #C0652B;
      --gk-accent-soft: #E08A4F;
      --kt-video-pos-y: 50%;
    }

    .font-sans { font-family: var(--gk-sans) !important; }

    .gk-eyebrow {
      font-family: var(--gk-sans);
      font-size: 11px;
      font-weight: 500;
      letter-spacing: .32em;
      text-transform: uppercase;
      color: var(--gk-accent-soft);
    }

    .gk-line { display: block; white-space: nowrap; }

    .gk-hero-title, .gk-h2 {
      font-family: var(--gk-display);
      font-weight: 700;
      color: #fff;
      line-height: 1.2;
      letter-spacing: .03em;
      text-transform: uppercase;
    }

    .gk-hero-title { font-size: clamp(1.35rem, 6vw, 4rem); }

    .gk-hero-title em, .gk-h2 em {
      font-style: normal;
      color: var(--gk-accent);
    }

    .gk-h2 {
      line-height: 1.25;
      font-size: clamp(1.15rem, 5.4vw, 2.6rem);
    }

    .gk-h3 {
      font-family: var(--gk-display);
      color: #fff;
      line-height: 1.3;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: .03em;
      font-size: clamp(1.2rem, 1rem + .8vw, 1.55rem);
    }

    .gk-body {
      font-family: var(--gk-sans);
      font-weight: 400;
      color: rgba(255,255,255,.78);
      line-height: 1.8;
      font-size: 15px;
    }

    .kt-section-text {
      font-family: var(--gk-sans);
      font-size: 13.5px;
      line-height: 1.7;
      color: rgba(255,255,255,.72);
    }

    .kt-card-desc {
      font-family: var(--gk-sans);
      font-size: 11.5px;
      line-height: 1.6;
      color: rgba(255,255,255,.65);
    }

    .gk-btn-outline, .gk-btn-solid {
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
      letter-spacing: .12em;
      text-transform: uppercase;
      color: #fff;
      white-space: nowrap;
      transition: background-color .3s, color .3s, border-color .3s, transform .3s;
    }

    .gk-btn-outline { border: 1px solid rgba(255,255,255,.35); }
    .gk-btn-outline:hover { background: #fff; color: #0A0A0A; border-color: #fff; }
    .gk-btn-solid { background: var(--gk-accent); }
    .gk-btn-solid:hover { background: #D2743A; }

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
      padding: 7rem 0 3rem;
      background: linear-gradient(180deg, #14100D, #0A0A0A);
    }

    .kt-hero picture {
      position: absolute;
      inset: 0;
      z-index: -3;
      display: block;
    }

    .kt-hero-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center;
      opacity: .45;
      transform: scale(1.04);
    }

    .kt-hero-shade {
      position: absolute;
      inset: 0;
      z-index: -2;
      pointer-events: none;
      background:
        radial-gradient(ellipse 80% 60% at 50% 0%, rgba(192,101,43,.30), transparent 60%),
        linear-gradient(180deg, rgba(10,10,10,.72), rgba(10,10,10,.5) 45%, #0A0A0A);
    }

    .kt-hero-glow {
      position: absolute;
      z-index: -1;
      border-radius: 999px;
      filter: blur(90px);
      background: var(--gk-accent);
      pointer-events: none;
    }

    .kt-hero-glow-a {
      left: -160px; top: 25%;
      width: 420px; height: 420px; opacity: .12;
    }

    .kt-hero-glow-b {
      right: -180px; bottom: 5%;
      width: 460px; height: 460px; opacity: .09;
    }

    .kt-hero-lines {
      position: absolute;
      inset: 0;
      z-index: -1;
      pointer-events: none;
      opacity: .45;
      background-image: linear-gradient(to right, rgba(255,255,255,.045) 1px, transparent 1px);
      background-size: 25% 100%;
      -webkit-mask-image: radial-gradient(ellipse at center, #000 20%, transparent 75%);
      mask-image: radial-gradient(ellipse at center, #000 20%, transparent 75%);
    }

    .kt-hero-text {
      margin: 1.25rem auto 0;
      max-width: 520px;
      font-family: var(--gk-sans);
      font-size: 1rem;
      line-height: 1.75;
      color: #fff;
      text-wrap: balance;
    }

    .kt-hero-btn {
      margin-top: 1.75rem;
      height: 48px;
      padding: 0 28px;
      font-size: 11.5px;
    }

    .kt-video {
      position: sticky;
      top: 0;
      z-index: 0;
      width: 100%;
      height: 70vh;
      height: 70dvh;
      min-height: 320px;
      max-height: 900px;
      overflow: hidden;
      background: #0A0A0A;
    }

    .kt-video-el {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center var(--kt-video-pos-y);
    }

    .kt-play {
      position: absolute;
      inset: 0;
      z-index: 5;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 14px;
      cursor: pointer;
      background: transparent;
      color: #fff;
    }

    .kt-play-btn {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 88px;
      height: 88px;
      border-radius: 999px;
      background: var(--gk-accent);
      color: #fff;
      box-shadow: 0 10px 44px rgba(192,101,43,.5);
      transition: transform .3s, background-color .3s;
    }

    .kt-play-btn::before, .kt-play-btn::after {
      content: "";
      position: absolute;
      inset: 0;
      border-radius: 999px;
      border: 1.5px solid var(--gk-accent-soft);
      animation: kt-ring 2.2s ease-out infinite;
    }

    .kt-play-btn::after { animation-delay: 1.1s; }
    .kt-play:hover .kt-play-btn { transform: scale(1.08); background: #D2743A; }

    .kt-start-label {
      font-family: var(--gk-sans);
      font-size: 13px;
      font-weight: 700;
      letter-spacing: .34em;
      padding-left: .34em;
      text-transform: uppercase;
      animation: kt-blink 1.3s ease-in-out infinite;
    }

    .kt-start-sub {
      margin-top: -6px;
      font-family: var(--gk-sans);
      font-size: 10.5px;
      font-weight: 500;
      letter-spacing: .22em;
      text-transform: uppercase;
      color: rgba(255,255,255,.7);
    }

    @keyframes kt-ring {
      0% { transform: scale(1); opacity: .85; }
      100% { transform: scale(2.1); opacity: 0; }
    }

    @keyframes kt-blink {
      0%, 100% { opacity: 1; }
      50% { opacity: .2; }
    }

    .kt-content {
      position: relative;
      z-index: 10;
      background: #0A0A0A;
      border-radius: 28px 28px 0 0;
      box-shadow: 0 -30px 60px rgba(0,0,0,.6);
    }

    .kt-vm { animation: kt-modal-in .35s cubic-bezier(.2,.8,.2,1); }

    @keyframes kt-modal-in {
      from { opacity: 0; transform: translateY(14px) scale(.97); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }

    .kt-vm-center {
      position: absolute;
      left: 50%; top: 50%;
      z-index: 10;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 68px; height: 68px;
      transform: translate(-50%, -50%);
      border-radius: 999px;
      background: var(--gk-accent);
      color: #fff;
      box-shadow: 0 10px 40px rgba(192,101,43,.5);
      transition: transform .3s, background-color .3s;
    }

    .kt-vm-center:hover {
      background: #D2743A;
      transform: translate(-50%, -50%) scale(1.08);
    }

    .kt-vm-bar {
      position: absolute;
      left: 0; right: 0; bottom: 0;
      z-index: 15;
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 28px 14px 12px;
      background: linear-gradient(to top, rgba(0,0,0,.85), transparent);
    }

    .kt-vbtn {
      display: flex;
      flex: 0 0 auto;
      align-items: center;
      justify-content: center;
      width: 36px; height: 36px;
      border-radius: 999px;
      color: #fff;
      transition: background-color .25s;
    }

    .kt-vbtn:hover { background: rgba(255,255,255,.15); }

    .kt-vm-time {
      flex: 0 0 auto;
      font-family: var(--gk-sans);
      font-size: 11px;
      color: rgba(255,255,255,.8);
      font-variant-numeric: tabular-nums;
    }

    .kt-range {
      -webkit-appearance: none;
      appearance: none;
      flex: 1 1 auto;
      min-width: 0;
      height: 4px;
      border-radius: 999px;
      outline: none;
      cursor: pointer;
    }

    .kt-range::-webkit-slider-thumb {
      -webkit-appearance: none;
      width: 13px; height: 13px;
      border-radius: 999px;
      background: #fff;
      border: 2px solid var(--gk-accent);
    }

    .kt-range::-moz-range-thumb {
      width: 11px; height: 11px;
      border-radius: 999px;
      background: #fff;
      border: 2px solid var(--gk-accent);
    }

    .kt-product {
      display: flex;
      flex-direction: column;
      height: 100%;
      overflow: hidden;
      border: 1px solid rgba(255,255,255,.1);
      border-radius: 4px;
      background: #141211;
      transition: border-color .4s, transform .4s;
    }

    .kt-product:hover {
      border-color: rgba(192,101,43,.5);
      transform: translateY(-3px);
    }

    .kt-card-title {
      font-family: var(--gk-display);
      color: #fff;
      line-height: 1.3;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: .03em;
      font-size: .78rem;
    }

    .kt-crop {
      position: absolute;
      top: 10px; left: 10px;
      z-index: 2;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 36px; height: 36px;
      border-radius: 999px;
      background: rgba(10,10,10,.65);
      border: 1px solid rgba(255,255,255,.25);
      color: #fff;
      backdrop-filter: blur(6px);
      transition: background-color .3s, border-color .3s, transform .3s;
    }

    .kt-crop:hover {
      background: var(--gk-accent);
      border-color: var(--gk-accent);
      transform: scale(1.08);
    }

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
      letter-spacing: .08em;
      text-transform: uppercase;
      color: #fff;
      white-space: nowrap;
      transition: background-color .3s, border-color .3s, transform .3s;
    }

    .kt-inquiry:hover { background: #D2743A; border-color: #D2743A; }
    .kt-inquiry:active { transform: scale(.98); }

    .kt-pagination {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }

    .kt-page-number, .kt-page-arrow {
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
      transition: color .25s, background-color .25s, border-color .25s;
    }

    .kt-page-number:hover, .kt-page-arrow:not(:disabled):hover {
      color: #fff;
      border-color: var(--gk-accent);
      background: rgba(192,101,43,.15);
    }

    .kt-page-number.is-active {
      color: #fff;
      border-color: var(--gk-accent);
      background: var(--gk-accent);
      box-shadow: 0 4px 18px rgba(192,101,43,.2);
    }

    .kt-page-arrow:disabled { cursor: not-allowed; opacity: .3; }

    .kt-ctrl {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px; height: 40px;
      border-radius: 999px;
      background: rgba(10,10,10,.7);
      border: 1px solid rgba(255,255,255,.25);
      color: #fff;
      backdrop-filter: blur(6px);
      transition: background-color .3s, color .3s;
    }

    .kt-ctrl:hover { background: #fff; color: #0A0A0A; }

    .kt-lb-img { animation: kt-fade .35s ease; }

    @keyframes kt-fade {
      from { opacity: 0; transform: scale(.98); }
      to { opacity: 1; transform: scale(1); }
    }

    .kt-preview-info {
      flex: 0 0 auto;
      max-height: 48vh;
      overflow-y: auto;
      padding: 1.5rem 1.25rem 1.75rem;
      background: #0F0E0D;
      border-top: 1px solid rgba(255,255,255,.1);
    }

    @media (min-width: 640px) {
      .gk-eyebrow { font-size: 10px; letter-spacing: .24em; }
      .gk-body { font-size: 15px; }
      .kt-section-text { font-size: 14.5px; }
      .kt-card-desc { font-size: 13.5px; }
      .kt-inquiry { font-size: 11.5px; padding: 13px 14px; letter-spacing: .1em; }
      .kt-preview-info { padding: 2rem 2rem 2.25rem; }
    }

    @media (min-width: 640px) {
      .gk-eyebrow { font-size: 11px; }
    }

    @media (min-width: 1024px) {
      .gk-body { font-size: 16px; }
      .kt-preview-info {
        width: 420px;
        max-height: none;
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding: 3rem 2.75rem;
        border-top: 0;
        border-left: 1px solid rgba(255,255,255,.1);
      }
    }

    @media (max-width: 640px) {
      .gk-eyebrow { font-size: 10px; letter-spacing: .24em; }
      .kt-hero { padding: 6.5rem 0 2.5rem; }
      .kt-hero-lines { background-size: 50% 100%; }
      .kt-hero-text {
        font-size: .88rem;
        line-height: 1.65;
        margin-top: 1rem;
        padding: 0 6px;
        max-width: 340px;
      }
      .kt-hero-btn {
        height: 44px;
        margin-top: 1.5rem;
        padding: 0 22px;
        font-size: 11px;
      }
      .kt-video { height: 70vh; height: 70dvh; min-height: 280px; }
      .kt-play-btn { width: 72px; height: 72px; }
      .kt-play-btn svg { width: 26px; height: 26px; }
      .kt-start-label { font-size: 12px; }
      .kt-start-sub { font-size: 9px; letter-spacing: .15em; }
      .kt-content { border-radius: 20px 20px 0 0; }
    }

    @media (max-width: 400px) {
      .kt-vm-time { display: none; }
      .kt-page-number, .kt-page-arrow {
        min-width: 36px;
        height: 38px;
        padding: 0 9px;
        font-size: 11px;
      }
    }

    @media (max-height: 640px) {
      .kt-hero { padding-top: 6rem; padding-bottom: 2rem; }
    }

    @media (prefers-reduced-motion: reduce) {
      .kt-play-btn::before, .kt-play-btn::after, .kt-start-label {
        animation: none;
      }
    }
  `}</style>
);

/* =========================================================
   MAIN PAGE
========================================================= */

export default function Bed() {
  const [previewProduct, setPreviewProduct] = useState(null);
  const [inquiryProduct, setInquiryProduct] = useState(null);
  const [videoOpen, setVideoOpen] = useState(false);
  const [products, setProducts] = useState(localProducts);

  useEffect(() => {
    let cancelled = false;

    async function loadProducts() {
      const { data, error } = await supabase
        .from("bed_products")
        .select(
          "id, title, description, image_url, price, delivery_text, status, sort_order"
        )
        .order("sort_order", { ascending: true });

      if (cancelled) return;

      if (error) {
        console.error("Bed products could not be loaded from Supabase:", error);
        setProducts(localProducts);
        return;
      }

      if (!data || data.length === 0) {
        setProducts(localProducts);
        return;
      }

      const activeProducts = data.filter((item) => item.status === "active");

      setProducts(
        activeProducts.map((item, index) => ({
          id: item.id,
          designNumber: Number(item.sort_order) || index + 1,
          title: item.title || `Bed Design ${index + 1}`,
          description: item.description || "",
          image:
            item.image_url ||
            getImage(`bed${(index % TOTAL_PRODUCTS) + 1}.webp`),
          price: Number(item.price) || 0,
          deliveryText: item.delivery_text || DELIVERY_TEXT,
        }))
      );
    }

    loadProducts();

    return () => {
      cancelled = true;
    };
  }, []);

  const closePreview = useCallback(() => setPreviewProduct(null), []);
  const closeInquiry = useCallback(() => setInquiryProduct(null), []);
  const closeVideo = useCallback(() => setVideoOpen(false), []);

  const scrollToProducts = () => {
    document.getElementById("bed-products")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <main className="min-h-screen overflow-x-clip bg-[#0A0A0A] text-white antialiased">
      <Styles />

      <FirstScreen onExplore={scrollToProducts} />

      <VideoSection onOpen={() => setVideoOpen(true)} />

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
        <InquiryModal product={inquiryProduct} onClose={closeInquiry} />
      )}

      {videoOpen && <VideoModal onClose={closeVideo} />}
    </main>
  );
}
