
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
  Volume2,
  VolumeX,
  X,
} from "lucide-react";

import wardrobeVideo from "../assets/word.mp4";
import heroMobile from "../assets/mob3.webp";
import heroDesktop from "../assets/des3.webp";
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

const formatTime = (seconds) => {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";

  const minutes = Math.floor(seconds / 60);
  const remaining = Math.floor(seconds % 60);

  return `${minutes}:${String(remaining).padStart(2, "0")}`;
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
   HERO SECTION
========================================================= */

function FirstScreen({ onExplore }) {
  return (
    <section className="kt-first">
      <header className="kt-hero">
        <picture>
          <source media="(min-width: 768px)" srcSet={heroDesktop} />

          <img
            src={heroMobile}
            alt="Gohar custom wardrobe designs"
            className="kt-hero-img"
            fetchPriority="high"
          />
        </picture>

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
   VIDEO SECTION
   IMPORTANT:
   No autoplay.
   No background video playback.
   Customer clicks Start to open the video player.
========================================================= */

function VideoSection({ onOpen }) {
  return (
    <section className="kt-video">
      {/* Static poster only: the actual video does not play here. */}
      <img
        src={getImage("word1.webp")}
        alt="Explore Gohar wardrobe designs"
        className="kt-video-poster"
        loading="lazy"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/35 to-black/40" />

      <button
        type="button"
        onClick={onOpen}
        aria-label="Open wardrobe video player"
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

        <span className="kt-start-sub">Watch Our Wardrobes</span>
      </button>
    </section>
  );
}
/* =========================================================
   VIDEO MODAL
   - Video opens paused
   - Sound always stays muted
   - Clicking the video starts/pauses playback
   - No autoplay
========================================================= */

function VideoModal({ onClose }) {
  const videoRef = useRef(null);

  const [playing, setPlaying] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);

    const video = videoRef.current;

    if (video) {
      video.pause();
      video.muted = true;
      video.volume = 0;
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;

      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.muted = true;
        videoRef.current.volume = 0;
      }
    };
  }, [onClose]);

  const togglePlayback = async (event) => {
    if (event) event.stopPropagation();

    const video = videoRef.current;

    if (!video) return;

    // Always keep sound off, even when playback starts.
    video.muted = true;
    video.volume = 0;

    if (video.paused) {
      try {
        await video.play();
      } catch (error) {
        console.error("Could not play wardrobe video:", error);
        setPlaying(false);
      }
    } else {
      video.pause();
    }
  };

  const handleSeek = (event) => {
    const video = videoRef.current;

    if (!video || !Number.isFinite(video.duration)) return;

    const percentage = Number(event.target.value);

    video.currentTime = (percentage / 1000) * video.duration;
    setCurrent(video.currentTime);
  };

  const progress = duration
    ? (current / duration) * 100
    : 0;

  return (
    <div
      className="fixed inset-0 z-[140] flex items-center justify-center bg-black/90 p-3 backdrop-blur-md sm:p-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Wardrobe video player"
    >
      <div className="kt-vm relative flex max-h-[88dvh] max-w-[94vw] items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-black shadow-2xl">

        <video
          ref={videoRef}
          src={wardrobeVideo}
          poster={getImage("word1.webp")}
          playsInline
          preload="metadata"
          autoPlay={false}
          muted
          controls={false}
          onClick={togglePlayback}
          onPlay={(event) => {
            event.currentTarget.muted = true;
            event.currentTarget.volume = 0;
            setPlaying(true);
          }}
          onPause={() => setPlaying(false)}
          onEnded={() => setPlaying(false)}
          onTimeUpdate={(event) => {
            setCurrent(event.currentTarget.currentTime);
          }}
          onLoadedMetadata={(event) => {
            const videoDuration = event.currentTarget.duration;
            setDuration(
              Number.isFinite(videoDuration) ? videoDuration : 0
            );
          }}
          onDurationChange={(event) => {
            const videoDuration = event.currentTarget.duration;
            setDuration(
              Number.isFinite(videoDuration) ? videoDuration : 0
            );
          }}
          className="block max-h-[88dvh] min-w-[min(92vw,300px)] max-w-[94vw] cursor-pointer object-contain"
        />

        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close video"
          className="kt-ctrl absolute right-3 top-3 z-20"
        >
          <X size={18} />
        </button>

        {/* Center play button */}
        {!playing && (
          <button
            type="button"
            onClick={togglePlayback}
            aria-label="Play wardrobe video without sound"
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

        {/* Video controls */}
        <div className="kt-vm-bar">
          <button
            type="button"
            onClick={togglePlayback}
            aria-label={playing ? "Pause video" : "Play video"}
            className="kt-vbtn"
          >
            {playing ? (
              <Pause
                size={18}
                fill="currentColor"
                strokeWidth={0}
              />
            ) : (
              <Play
                size={18}
                fill="currentColor"
                strokeWidth={0}
              />
            )}
          </button>

          <input
            type="range"
            min="0"
            max="1000"
            step="1"
            value={
              duration
                ? Math.round((current / duration) * 1000)
                : 0
            }
            onChange={handleSeek}
            aria-label="Video progress"
            className="kt-range"
            style={{
              background: `linear-gradient(to right, var(--gk-accent) ${progress}%, rgba(255,255,255,0.28) ${progress}%)`,
            }}
          />

          <span className="kt-vm-time">
            {formatTime(current)} / {formatTime(duration)}
          </span>

          {/* Sound remains disabled */}
          <button
            type="button"
            disabled
            aria-label="Video sound is disabled"
            title="Sound is disabled"
            className="kt-vbtn cursor-not-allowed opacity-60"
          >
            <VolumeX size={18} />
          </button>
        </div>
      </div>
    </div>
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
    "w-full rounded-lg border border-white/15 bg-white/[0.04] px-4 py-3.5 font-sans text-sm text-white outline-none transition placeholder:text-white/35 focus:border-[#C0652B] focus:ring-2 focus:ring-[#C0652B]/20";

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
        aria-label="Wardrobe inquiry form"
        className="relative max-h-[92dvh] w-full max-w-lg overflow-y-auto rounded-md border border-white/10 bg-[#0F0E0D] shadow-2xl"
      >
        <div className="relative border-b border-white/10 px-5 py-6 sm:px-8 sm:py-7">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close inquiry"
            className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white/80 transition hover:bg-white/10"
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

          <p className="mt-3 text-center font-sans text-[11px] leading-5 text-white/40">
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
          <p className="mt-4 font-sans text-base font-semibold text-[#E08A4F]">
            {formatPrice(product.price)}
          </p>
        )}

        <p className="mt-4 flex items-center gap-2 font-sans text-xs text-white/60 sm:text-[13px]">
          <Truck size={15} className="shrink-0 text-[#E08A4F]" />
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
            <p className="mt-3 font-sans text-xs font-semibold text-[#E08A4F] sm:text-sm">
              {formatPrice(product.price)}
            </p>
          )}

          <p className="mt-3 flex items-center gap-2 font-sans text-[10.5px] text-white/55 sm:text-xs">
            <Truck size={14} className="shrink-0 text-[#E08A4F]" />
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
          <p className="py-12 text-center font-sans text-sm text-white/60">
            No wardrobe designs are available right now.
          </p>
        )}

        <div className="mt-10 flex flex-col items-center justify-between gap-5 border-t border-white/10 pt-6 sm:mt-12 sm:flex-row">
          <p className="font-sans text-xs text-white/50 sm:text-sm">
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
}

/* =========================================================
   STYLES
========================================================= */

function Styles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&display=swap');

      :root {
        --gk-display: 'Montserrat', system-ui, sans-serif;
        --gk-sans: 'Montserrat', system-ui, sans-serif;
        --gk-accent: #C0652B;
        --gk-accent-soft: #E08A4F;
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
        line-height: 1.25;
        letter-spacing: .025em;
        text-transform: uppercase;
      }

      .gk-hero-title { font-size: clamp(1.2rem, 5.7vw, 4rem); }
      .gk-h2 { font-size: clamp(1.05rem, 4.8vw, 2.6rem); }

      .gk-hero-title em, .gk-h2 em {
        color: var(--gk-accent);
        font-style: normal;
      }

      .gk-h3 {
        font-family: var(--gk-display);
        font-size: clamp(1.2rem, 1rem + .8vw, 1.55rem);
        font-weight: 700;
        line-height: 1.35;
        color: #fff;
        text-transform: uppercase;
        letter-spacing: .025em;
      }

      .gk-body {
        font-family: var(--gk-sans);
        font-size: 15px;
        font-weight: 400;
        line-height: 1.8;
        color: rgba(255,255,255,.78);
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

      .gk-btn-solid, .gk-btn-outline {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        min-height: 48px;
        padding: 0 25px;
        border-radius: 999px;
        font-family: var(--gk-sans);
        font-size: 11px;
        font-weight: 600;
        letter-spacing: .1em;
        text-transform: uppercase;
        color: #fff;
        transition: background .25s ease, color .25s ease, transform .25s ease;
      }

      .gk-btn-solid { background: var(--gk-accent); }
      .gk-btn-solid:hover { background: #D2743A; }
      .gk-btn-outline { border: 1px solid rgba(255,255,255,.35); }
      .gk-btn-outline:hover { background: #fff; color: #0A0A0A; }

      .kt-first {
        display: flex;
        min-height: 100vh;
        min-height: 100dvh;
        flex-direction: column;
        background: #0A0A0A;
      }

      .kt-hero {
        position: relative;
        isolation: isolate;
        display: flex;
        flex: 1;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        padding: 7rem 0 3rem;
        background: linear-gradient(180deg,#14100D,#0A0A0A);
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
        opacity: .55;
        transform: scale(1.02);
      }

      .kt-hero-shade {
        position: absolute;
        inset: 0;
        z-index: -2;
        pointer-events: none;
        background:
          radial-gradient(ellipse at 50% 0%,rgba(192,101,43,.25),transparent 60%),
          linear-gradient(180deg,rgba(10,10,10,.45),rgba(10,10,10,.55) 45%,#0A0A0A);
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
        opacity: .3;
        background-image: linear-gradient(to right,rgba(255,255,255,.045) 1px,transparent 1px);
        background-size: 25% 100%;
        -webkit-mask-image: radial-gradient(ellipse at center,#000 20%,transparent 75%);
        mask-image: radial-gradient(ellipse at center,#000 20%,transparent 75%);
      }

      .kt-hero-text {
        max-width: 520px;
        margin: 1.25rem auto 0;
        font-family: var(--gk-sans);
        font-size: 1rem;
        line-height: 1.75;
        color: #fff;
        text-wrap: balance;
      }

      .kt-hero-btn { margin-top: 1.75rem; }

      /* Static video-section poster: never plays automatically. */
      .kt-video {
        position: relative;
        z-index: 0;
        width: 100%;
        height: 100vh;
        height: 100dvh;
        overflow: hidden;
        background: #0A0A0A;
      }

      .kt-video-poster {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
        object-position: center;
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
        box-shadow: 0 10px 44px rgba(192,101,43,.45);
        transition: transform .3s ease, background .3s ease;
      }

      .kt-play-btn::before, .kt-play-btn::after {
        content: "";
        position: absolute;
        inset: 0;
        border: 1.5px solid var(--gk-accent-soft);
        border-radius: 999px;
        animation: kt-ring 2.2s ease-out infinite;
        pointer-events: none;
      }

      .kt-play-btn::after { animation-delay: 1.1s; }

      .kt-play:hover .kt-play-btn {
        transform: scale(1.08);
        background: #D2743A;
      }

      .kt-start-label {
        font-family: var(--gk-sans);
        font-size: 13px;
        font-weight: 700;
        letter-spacing: .34em;
        text-transform: uppercase;
        animation: kt-blink 1.3s ease-in-out infinite;
      }

      .kt-start-sub {
        margin-top: -6px;
        font-family: var(--gk-sans);
        font-size: 10.5px;
        letter-spacing: .2em;
        text-transform: uppercase;
        color: rgba(255,255,255,.75);
      }

      @keyframes kt-ring {
        0% { transform: scale(1); opacity: .85; }
        100% { transform: scale(2.1); opacity: 0; }
      }

      @keyframes kt-blink {
        0%,100% { opacity: 1; }
        50% { opacity: .45; }
      }

      .kt-content {
        position: relative;
        z-index: 10;
        background: #0A0A0A;
        border-radius: 28px 28px 0 0;
        box-shadow: 0 -30px 60px rgba(0,0,0,.6);
      }

      .kt-vm { animation: kt-modal-in .3s ease-out; }

      @keyframes kt-modal-in {
        from { opacity: 0; transform: translateY(12px) scale(.98); }
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
        transform: translate(-50%,-50%);
        border-radius: 999px;
        background: var(--gk-accent);
        color: #fff;
        box-shadow: 0 10px 40px rgba(192,101,43,.5);
      }

      .kt-vm-center:hover { background: #D2743A; }

      .kt-vm-bar {
        position: absolute;
        left: 0; right: 0; bottom: 0;
        z-index: 15;
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 28px 14px 12px;
        background: linear-gradient(to top,rgba(0,0,0,.9),transparent);
      }

      .kt-vbtn {
        display: flex;
        flex: 0 0 auto;
        align-items: center;
        justify-content: center;
        width: 36px; height: 36px;
        border-radius: 999px;
        color: #fff;
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
        flex: 1;
        min-width: 0;
        height: 4px;
        appearance: none;
        border-radius: 999px;
        outline: none;
        cursor: pointer;
      }

      .kt-range::-webkit-slider-thumb {
        appearance: none;
        width: 13px; height: 13px;
        border: 2px solid var(--gk-accent);
        border-radius: 999px;
        background: #fff;
      }

      .kt-range::-moz-range-thumb {
        width: 11px; height: 11px;
        border: 2px solid var(--gk-accent);
        border-radius: 999px;
        background: #fff;
      }

      .kt-product {
        display: flex;
        height: 100%;
        flex-direction: column;
        overflow: hidden;
        border: 1px solid rgba(255,255,255,.1);
        border-radius: 4px;
        background: #141211;
        transition: border-color .3s ease, transform .3s ease;
      }

      .kt-product:hover {
        border-color: rgba(192,101,43,.5);
        transform: translateY(-3px);
      }

      .kt-card-title {
        font-family: var(--gk-display);
        font-size: .78rem;
        font-weight: 700;
        line-height: 1.4;
        color: #fff;
        text-transform: uppercase;
        letter-spacing: .025em;
      }

      .kt-crop {
        position: absolute;
        top: 10px; left: 10px;
        z-index: 2;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 36px; height: 36px;
        border: 1px solid rgba(255,255,255,.25);
        border-radius: 999px;
        background: rgba(10,10,10,.7);
        color: #fff;
        backdrop-filter: blur(6px);
        transition: background .25s ease, transform .25s ease;
      }

      .kt-crop:hover {
        background: var(--gk-accent);
        transform: scale(1.05);
      }

      .kt-inquiry {
        display: flex;
        width: 100%;
        align-items: center;
        justify-content: center;
        gap: 7px;
        margin-top: 1rem;
        padding: 11px 8px;
        border: 1px solid var(--gk-accent);
        border-radius: 999px;
        background: var(--gk-accent);
        font-family: var(--gk-sans);
        font-size: 10px;
        font-weight: 600;
        letter-spacing: .07em;
        text-transform: uppercase;
        color: #fff;
        white-space: nowrap;
        transition: background .25s ease;
      }

      .kt-inquiry:hover { background: #D2743A; }

      .kt-pagination {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: center;
        gap: 8px;
      }

      .kt-page-number, .kt-page-arrow {
        display: inline-flex;
        min-width: 42px; height: 42px;
        align-items: center;
        justify-content: center;
        gap: 6px;
        padding: 0 13px;
        border: 1px solid rgba(255,255,255,.16);
        border-radius: 999px;
        background: rgba(255,255,255,.025);
        font-family: var(--gk-sans);
        font-size: 12px;
        color: rgba(255,255,255,.7);
        transition: all .25s ease;
      }

      .kt-page-number:hover,
      .kt-page-arrow:not(:disabled):hover {
        color: #fff;
        border-color: var(--gk-accent);
        background: rgba(192,101,43,.15);
      }

      .kt-page-number.is-active {
        color: #fff;
        border-color: var(--gk-accent);
        background: var(--gk-accent);
      }

      .kt-page-arrow:disabled { cursor: not-allowed; opacity: .3; }

      .kt-ctrl {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 40px; height: 40px;
        border: 1px solid rgba(255,255,255,.25);
        border-radius: 999px;
        background: rgba(10,10,10,.75);
        color: #fff;
        backdrop-filter: blur(6px);
        transition: background .25s ease, color .25s ease;
      }

      .kt-ctrl:hover { background: #fff; color: #0A0A0A; }

      .kt-preview-info {
        flex: 0 0 auto;
        max-height: 48vh;
        overflow-y: auto;
        padding: 1.5rem 1.25rem 1.75rem;
        border-top: 1px solid rgba(255,255,255,.1);
        background: #0F0E0D;
      }

      .kt-lb-img { animation: kt-fade .3s ease; }

      @keyframes kt-fade {
        from { opacity: 0; transform: scale(.98); }
        to { opacity: 1; transform: scale(1); }
      }

      @media (min-width: 640px) {
        .gk-body { font-size: 15px; }
        .kt-section-text { font-size: 14.5px; }
        .kt-card-desc { font-size: 13.5px; }
        .kt-card-title { font-size: 1rem; }
        .kt-inquiry { font-size: 11.5px; padding: 13px 14px; }
        .kt-preview-info { padding: 2rem; }
      }

      @media (min-width: 1024px) {
        .kt-preview-info {
          display: flex;
          width: 420px;
          max-height: none;
          flex-direction: column;
          justify-content: center;
          padding: 3rem 2.75rem;
          border-top: 0;
          border-left: 1px solid rgba(255,255,255,.1);
        }
      }

      @media (max-width: 640px) {
        .gk-eyebrow { font-size: 10px; letter-spacing: .22em; }
        .kt-hero { padding: 6.5rem 0 2.5rem; }
        .kt-hero-lines { background-size: 50% 100%; }
        .kt-hero-text {
          max-width: 340px;
          margin-top: 1rem;
          padding: 0 6px;
          font-size: .88rem;
          line-height: 1.65;
        }
        .kt-hero-btn { margin-top: 1.5rem; min-height: 44px; padding: 0 20px; }
        .kt-play-btn { width: 72px; height: 72px; }
        .kt-start-label { font-size: 12px; }
        .kt-start-sub { font-size: 9px; }
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

      @media (prefers-reduced-motion: reduce) {
        .kt-play-btn::before,
        .kt-play-btn::after,
        .kt-start-label { animation: none; }
      }
    `}</style>
  );
}

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function Wordrobe() {
  const [previewProduct, setPreviewProduct] = useState(null);
  const [inquiryProduct, setInquiryProduct] = useState(null);
  const [videoOpen, setVideoOpen] = useState(false);
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

  const closeVideo = useCallback(() => {
    setVideoOpen(false);
  }, []);

  const scrollToProducts = () => {
    document.getElementById("wardrobe-products")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <main className="bg-[#0A0A0A] text-white">
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
        <InquiryModal
          product={inquiryProduct}
          onClose={closeInquiry}
        />
      )}

      {videoOpen && <VideoModal onClose={closeVideo} />}
    </main>
  );
}
