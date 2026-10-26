// Bed.jsx
// Assets: ../assets/bed.mp4, bed1.webp ... bed10.webp
// Supabase table: bed_products
// Theme: Video Hero | White Products | Black Preview | White Inquiry Modal
// Font: Montserrat

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

import bedVideo from "../assets/bed.mp4";
import { supabase } from "../lib/supabase";

/* =========================================================
   SETTINGS
========================================================= */

const WHATSAPP_NUMBER = "923007023202";
const BRAND = "Gohar";
const TOTAL_PRODUCTS = 10;
const PAGE_SIZE = 12;
const DELIVERY_TEXT = "Delivery All Over Pakistan";

/* =========================================================
   LOCAL ASSETS
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

/* =========================================================
   LOCAL FALLBACK PRODUCTS
========================================================= */

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

const localProducts = Array.from(
  { length: TOTAL_PRODUCTS },
  (_, index) => ({
    id: `local-bed-${index + 1}`,
    displayNumber: index + 1,
    title: titles[index % titles.length],
    description: descriptions[index % descriptions.length],
    image: getImage(`bed${index + 1}.webp`),
    price: 0,
    deliveryText: DELIVERY_TEXT,
  })
);

/* =========================================================
   HELPERS
========================================================= */

const pad = (number) => String(number).padStart(2, "0");

const formatPrice = (price) => {
  const value = Number(price);

  return Number.isFinite(value) && value > 0
    ? `PKR ${value.toLocaleString("en-PK")}`
    : "";
};

const openWhatsApp = (message) => {
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    message
  )}`;

  const newWindow = window.open(
    url,
    "_blank",
    "noopener,noreferrer"
  );

  if (!newWindow) {
    window.location.href = url;
  }
};

/* =========================================================
   LOAD PRODUCTS FROM SUPABASE
========================================================= */

const loadBedProducts = async () => {
  const { data, error } = await supabase
    .from("bed_products")
    .select(
      "id, title, description, image_url, price, delivery_text, status, sort_order"
    )
    .order("sort_order", { ascending: true });

  if (error) {
    throw error;
  }

  if (!data || data.length === 0) {
    return localProducts;
  }

  const activeProducts = data.filter(
    (item) => item.status === "active"
  );

  return activeProducts.map((item, index) => {
    const displayNumber =
      Number(item.sort_order) > 0
        ? Number(item.sort_order)
        : index + 1;

    const rawPrice =
      item.price === null || item.price === ""
        ? 0
        : Number(item.price);

    return {
      id: item.id,
      displayNumber,
      title: item.title || "Bed Design",
      description: item.description || "",
      image:
        item.image_url ||
        getImage(
          `bed${((displayNumber - 1) % TOTAL_PRODUCTS) + 1}.webp`
        ),
      price:
        Number.isFinite(rawPrice) && rawPrice > 0
          ? rawPrice
          : 0,
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

const Reveal = ({
  children,
  delay = 0,
  className = "",
}) => {
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
};

/* =========================================================
   EYEBROW
========================================================= */

const Eyebrow = ({
  children,
  align = "center",
  className = "",
}) => (
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
   HERO BACKGROUND VIDEO
========================================================= */

const HeroVideo = ({ src, poster }) => {
  const ref = useRef(null);

  useEffect(() => {
    const video = ref.current;

    if (!video) return;

    video.muted = true;
    video.defaultMuted = true;

    const reduceMotion =
      window.matchMedia &&
      window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

    if (reduceMotion) {
      video.pause();
      return;
    }

    const tryPlay = () => {
      const promise = video.play();

      if (promise && typeof promise.catch === "function") {
        promise.catch(() => {});
      }
    };

    tryPlay();

    if (!("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          tryPlay();
        } else {
          video.pause();
        }
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
};

/* =========================================================
   1. HERO SECTION
========================================================= */

const FirstScreen = ({ onExplore }) => (
  <section className="kt-first">
    <header className="kt-hero">
      <HeroVideo
        src={bedVideo}
        poster={getImage("bed1.webp")}
      />

      <div className="kt-hero-shade" />
      <div className="kt-hero-glow kt-hero-glow-a" />
      <div className="kt-hero-glow kt-hero-glow-b" />
      <div className="kt-hero-lines" />

      <div className="relative z-10 mx-auto flex w-full max-w-[1000px] flex-col items-center px-5 text-center sm:px-8">
        <Eyebrow>Bespoke Bedroom Designs</Eyebrow>

        <h1 className="gk-hero-title">
          <span className="gk-line">
            Beds That Feel
          </span>

          <span className="gk-line">
            <em>Made For You</em>
          </span>
        </h1>

        <p className="kt-hero-text">
          Discover beautifully designed beds with premium
          finishes, thoughtful details and comfort made for
          your home.
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
   2. WHATSAPP INQUIRY MODAL
   White modal like Media.jsx
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

    const previousOverflow = document.body.style.overflow;

    window.addEventListener("keydown", handleKey);
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
Hello ${BRAND}, I would like to inquire about a bed design.

*Product:* ${product.title} (Design ${pad(
      product.displayNumber
    )})
*Price:* ${formatPrice(product.price) || "Price on request"}
*Name:* ${form.name}
*Phone:* ${form.phone}
*City:* ${form.city}
*Delivery:* ${product.deliveryText || DELIVERY_TEXT}

Please share more details and available options.
    `.trim();

    openWhatsApp(message);
    setForm({ name: "", phone: "", city: "" });
    onClose();
  };

  const inputCls =
    "w-full rounded-lg border border-black/15 bg-neutral-50 px-4 py-3.5 font-sans text-sm text-neutral-900 outline-none transition duration-200 placeholder:text-neutral-400 focus:border-[#C0652B] focus:bg-white focus:ring-2 focus:ring-[#C0652B]/20";

  const labelCls =
    "mb-2 block font-sans text-[11px] font-medium uppercase tracking-[0.16em] text-neutral-600";

  return (
    <div
      className="fixed inset-0 z-[130] flex items-center justify-center bg-black/70 px-4 py-6 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="bed-inquiry-heading"
        className="gk-light relative max-h-[92dvh] w-full max-w-lg overflow-y-auto rounded-md border border-black/10 bg-white shadow-[0_30px_80px_rgba(0,0,0,0.35)]"
      >
        <div className="relative overflow-hidden border-b border-black/10 px-5 py-6 sm:px-8 sm:py-7">
          <div className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-[#C0652B] opacity-[0.1] blur-3xl" />

          <button
            type="button"
            onClick={onClose}
            aria-label="Close inquiry"
            className="absolute right-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-full border border-black/15 text-neutral-700 transition hover:bg-black/5 hover:text-black"
          >
            <X size={17} />
          </button>

          <div className="relative z-10 pr-10">
            <Eyebrow align="left">
              Product Inquiry
            </Eyebrow>

            <h2
              id="bed-inquiry-heading"
              className="gk-h3 !text-[1.2rem] sm:!text-[1.5rem]"
            >
              {product.title}
            </h2>

            <p className="gk-body mt-2 !text-[13px] sm:!text-[13.5px]">
              Share your details and we will continue the
              conversation on WhatsApp.
            </p>

            {Number(product.price) > 0 && (
              <p className="mt-3 font-sans text-sm font-semibold text-[#C0652B]">
                {formatPrice(product.price)}
              </p>
            )}
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="px-5 py-6 sm:px-8 sm:py-8"
        >
          <div className="space-y-5">
            <div>
              <label
                htmlFor="bed-iq-name"
                className={labelCls}
              >
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
                className={inputCls}
              />
            </div>

            <div>
              <label
                htmlFor="bed-iq-phone"
                className={labelCls}
              >
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
                className={inputCls}
              />
            </div>

            <div>
              <label
                htmlFor="bed-iq-city"
                className={labelCls}
              >
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
                className={inputCls}
              />
            </div>
          </div>

          <button
            type="submit"
            className="gk-btn-solid group mt-7 !flex w-full"
          >
            <MessageCircle
              size={17}
              strokeWidth={2}
              className="shrink-0"
            />

            Send Inquiry

            <ArrowRight
              size={15}
              strokeWidth={2}
              className="shrink-0 transition-transform duration-300 group-hover:translate-x-1"
            />
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
   3. FULL-SCREEN PRODUCT PREVIEW
   Black preview like Media.jsx
========================================================= */

const Preview = ({ product, onClose, onInquiry }) => {
  useEffect(() => {
    const handleKey = (event) => {
      if (event.key === "Escape") onClose();
    };

    const previousOverflow = document.body.style.overflow;

    window.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose]);

  return (
    <div
      className="kt-preview fixed inset-0 z-[110] flex flex-col bg-black lg:flex-row"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`${product.title} preview`}
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
          Design {pad(product.displayNumber)}
        </Eyebrow>

        <h3 className="gk-h3 !text-[1.15rem] sm:!text-[1.4rem] lg:!text-[1.6rem]">
          {product.title}
        </h3>

        <div className="my-4 h-px w-12 bg-[#C0652B] sm:my-5" />

        <p className="gk-body !text-[14px] sm:!text-[15px]">
          {product.description}
        </p>

        {Number(product.price) > 0 && (
          <p className="kt-price mt-4 text-lg">
            {formatPrice(product.price)}
          </p>
        )}

        <p className="mt-4 flex items-center gap-2 font-sans text-xs font-medium tracking-wide text-white/60 sm:text-[13px]">
          <Truck
            size={15}
            strokeWidth={1.6}
            className="shrink-0 text-[#E08A4F]"
          />

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
   4. PRODUCT CARD
   White background like Media.jsx
========================================================= */

const ProductCard = ({
  product,
  index,
  onPreview,
  onInquiry,
}) => (
  <Reveal delay={(index % 4) * 80} className="h-full">
    <article className="kt-product group">
      <div className="relative aspect-[4/5] overflow-hidden bg-neutral-200">
        <img
          src={product.image}
          alt={product.title}
          loading="lazy"
          decoding="async"
          onClick={() => onPreview(product)}
          className="h-full w-full cursor-zoom-in object-cover transition-transform duration-700 group-hover:scale-[1.05]"
        />

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
        <h3 className="kt-card-title line-clamp-1">
          {product.title}
        </h3>

        <p className="kt-card-desc mt-2 line-clamp-2 min-h-[2.5rem]">
          {product.description}
        </p>

        {Number(product.price) > 0 && (
          <p className="kt-price mt-3 text-sm sm:text-base">
            {formatPrice(product.price)}
          </p>
        )}

        <p className="mt-3 flex items-center gap-2 font-sans text-[10.5px] font-medium tracking-wide text-neutral-600 sm:text-xs">
          <Truck
            size={14}
            strokeWidth={1.6}
            className="shrink-0 text-[#C0652B]"
          />

          <span className="truncate">
            {product.deliveryText || DELIVERY_TEXT}
          </span>
        </p>

        <button
          type="button"
          onClick={() => onInquiry(product)}
          className="kt-inquiry mt-auto"
        >
          <MessageCircle
            strokeWidth={1.8}
            className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4"
          />

          <span className="truncate">
            <span className="hidden sm:inline">
              WhatsApp{" "}
            </span>
            Inquiry
          </span>
        </button>
      </div>
    </article>
  </Reveal>
);

/* =========================================================
   5. NUMBERED PAGINATION
========================================================= */

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  if (totalPages <= 1) return null;

  const pages = Array.from(
    { length: totalPages },
    (_, index) => index + 1
  );

  return (
    <nav
      className="kt-pagination"
      aria-label="Bed product pages"
    >
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
          aria-current={
            currentPage === page ? "page" : undefined
          }
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
   6. PRODUCTS SECTION + PAGINATION
========================================================= */

const Products = ({
  products,
  loading,
  onPreview,
  onInquiry,
}) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(
    products.length / PAGE_SIZE
  );

  const safePage = Math.min(
    currentPage,
    Math.max(totalPages, 1)
  );

  const startIndex = (safePage - 1) * PAGE_SIZE;

  const endIndex = Math.min(
    startIndex + PAGE_SIZE,
    products.length
  );

  const shown = products.slice(startIndex, endIndex);

  useEffect(() => {
    setCurrentPage(1);
  }, [products.length]);

  const changePage = (page) => {
    const nextPage = Math.max(
      1,
      Math.min(page, totalPages)
    );

    if (nextPage === safePage) return;

    setCurrentPage(nextPage);

    window.setTimeout(() => {
      document
        .getElementById("bed-products")
        ?.scrollIntoView({
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
              <span className="gk-line">
                Beds Designed
              </span>

              <span className="gk-line">
                <em>Around Your Comfort</em>
              </span>
            </h2>

            <p className="kt-section-text mx-auto mt-4 max-w-lg">
              Explore thoughtfully designed beds made for
              comfort, style and your personal space.
            </p>
          </div>
        </Reveal>

        {loading ? (
          <div className="py-16 text-center font-sans text-sm text-neutral-500">
            Loading bed designs...
          </div>
        ) : products.length === 0 ? (
          <div className="py-16 text-center">
            <p className="font-sans text-sm text-neutral-500">
              No bed designs are currently available.
            </p>
          </div>
        ) : (
          <>
            <div
              key={safePage}
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

            <div className="mt-10 flex flex-col items-center justify-between gap-5 border-t border-black/10 pt-6 sm:mt-12 sm:flex-row">
              <p className="font-sans text-xs font-light tracking-wide text-neutral-500 sm:text-sm">
                Showing{" "}
                <span className="font-semibold text-neutral-900">
                  {startIndex + 1}–{endIndex}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-neutral-900">
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
   7. STYLES
   Matched to Media.jsx
========================================================= */

const Styles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&display=swap');

    .bed-page {
      --gk-display: 'Montserrat', system-ui, -apple-system, 'Segoe UI', sans-serif;
      --gk-sans: 'Montserrat', system-ui, -apple-system, 'Segoe UI', sans-serif;
      --gk-accent: #C0652B;
      --gk-accent-soft: #E08A4F;
      --gk-ink: #141414;
      font-family: var(--gk-sans);
      background: #fff;
    }

    .bed-page .font-sans {
      font-family: var(--gk-sans) !important;
    }

    /* TYPOGRAPHY */

    .bed-page .gk-eyebrow {
      font-family: var(--gk-sans);
      font-size: 11px;
      font-weight: 500;
      letter-spacing: .32em;
      text-transform: uppercase;
      color: var(--gk-accent-soft);
    }

    .bed-page .kt-content .gk-eyebrow,
    .bed-page .gk-light .gk-eyebrow {
      color: var(--gk-accent);
      font-weight: 600;
    }

    .bed-page .gk-line {
      display: block;
      white-space: nowrap;
    }

    .bed-page .gk-hero-title {
      font-family: var(--gk-display);
      font-weight: 700;
      color: #fff;
      line-height: 1.2;
      letter-spacing: .03em;
      text-transform: uppercase;
      font-size: clamp(1.35rem, 6vw, 4rem);
    }

    .bed-page .gk-hero-title em,
    .bed-page .gk-h2 em {
      font-family: var(--gk-display);
      font-style: normal;
      font-weight: 700;
      color: var(--gk-accent);
    }

    .bed-page .gk-h2 {
      font-family: var(--gk-display);
      font-weight: 700;
      color: var(--gk-ink);
      line-height: 1.25;
      letter-spacing: .03em;
      text-transform: uppercase;
      font-size: clamp(1.15rem, 5.4vw, 2.6rem);
    }

    .bed-page .gk-h3 {
      font-family: var(--gk-display);
      color: #fff;
      line-height: 1.3;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: .03em;
      font-size: clamp(1.2rem, 1rem + .8vw, 1.55rem);
    }

    .bed-page .gk-body {
      font-family: var(--gk-sans);
      font-weight: 400;
      color: rgba(255,255,255,.78);
      line-height: 1.8;
      font-size: 15px;
    }

    .bed-page .gk-light .gk-h3 {
      color: var(--gk-ink);
    }

    .bed-page .gk-light .gk-body {
      color: rgba(20,20,20,.68);
    }

    .bed-page .kt-section-text {
      font-family: var(--gk-sans);
      font-weight: 400;
      font-size: 13.5px;
      line-height: 1.7;
      color: rgba(20,20,20,.68);
    }

    .bed-page .kt-card-desc {
      font-family: var(--gk-sans);
      font-weight: 400;
      font-size: 11.5px;
      line-height: 1.6;
      color: rgba(20,20,20,.64);
    }

    /* BUTTONS */

    .bed-page .gk-btn-solid {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      height: 50px;
      padding: 0 30px;
      border: 1px solid var(--gk-accent);
      border-radius: 999px;
      background: var(--gk-accent);
      font-family: var(--gk-sans);
      font-size: 12px;
      font-weight: 600;
      letter-spacing: .12em;
      text-transform: uppercase;
      color: #fff;
      white-space: nowrap;
      transition: background-color .3s ease, color .3s ease,
        border-color .3s ease, transform .3s ease;
    }

    .bed-page .gk-btn-solid:hover {
      background: #D2743A;
      border-color: #D2743A;
    }

    /* HERO */

    .bed-page .kt-first {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
      min-height: 100dvh;
      background: #0A0A0A;
    }

    .bed-page .kt-hero {
      position: relative;
      isolation: isolate;
      flex: 1 1 auto;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      min-height: 100vh;
      min-height: 100dvh;
      padding: 7rem 0 3rem;
      background:
        radial-gradient(ellipse 80% 60% at 50% 0%, rgba(192,101,43,.28), transparent 60%),
        radial-gradient(ellipse 60% 50% at 100% 100%, rgba(192,101,43,.16), transparent 65%),
        linear-gradient(180deg, #14100D 0%, #0D0B0A 55%, #0A0A0A 100%);
    }

    .bed-page .kt-hero-video {
      position: absolute;
      inset: 0;
      z-index: -3;
      width: 100%;
      height: 100%;
      object-fit: cover;
      object-position: center;
      opacity: .9;
      pointer-events: none;
      background: #0A0A0A;
    }

    .bed-page .kt-hero-shade {
      position: absolute;
      inset: 0;
      z-index: -2;
      pointer-events: none;
      background:
        radial-gradient(ellipse 70% 55% at 50% 50%, rgba(10,10,10,.5), transparent 80%),
        radial-gradient(ellipse 80% 60% at 50% 0%, rgba(192,101,43,.18), transparent 60%),
        linear-gradient(180deg, rgba(10,10,10,.7) 0%, rgba(10,10,10,.42) 40%, rgba(10,10,10,.5) 100%);
    }

    .bed-page .kt-hero-glow {
      position: absolute;
      z-index: -1;
      border-radius: 999px;
      filter: blur(90px);
      background: var(--gk-accent);
      pointer-events: none;
    }

    .bed-page .kt-hero-glow-a {
      left: -160px;
      top: 25%;
      width: 420px;
      height: 420px;
      opacity: .12;
    }

    .bed-page .kt-hero-glow-b {
      right: -180px;
      bottom: 5%;
      width: 460px;
      height: 460px;
      opacity: .09;
    }

    .bed-page .kt-hero-lines {
      position: absolute;
      inset: 0;
      z-index: -1;
      pointer-events: none;
      opacity: .35;
      background-image: linear-gradient(to right, rgba(255,255,255,.045) 1px, transparent 1px);
      background-size: 25% 100%;
      -webkit-mask-image: radial-gradient(ellipse at center, #000 20%, transparent 75%);
      mask-image: radial-gradient(ellipse at center, #000 20%, transparent 75%);
    }

    .bed-page .kt-hero .gk-hero-title {
      text-shadow: 0 2px 24px rgba(0,0,0,.55);
    }

    .bed-page .kt-hero .gk-eyebrow {
      text-shadow: 0 1px 12px rgba(0,0,0,.6);
    }

    .bed-page .kt-hero-text {
      margin: 1.25rem auto 0;
      max-width: 520px;
      font-family: var(--gk-sans);
      font-weight: 400;
      font-size: 1rem;
      line-height: 1.75;
      color: #fff;
      text-wrap: balance;
      text-shadow: 0 1px 14px rgba(0,0,0,.65);
    }

    .bed-page .kt-hero-btn {
      margin-top: 1.75rem;
      height: 48px;
      padding: 0 28px;
      font-size: 11.5px;
      letter-spacing: .12em;
    }

    /* WHITE PRODUCT CARDS */

    .bed-page .kt-content {
      position: relative;
      z-index: 10;
      background: #fff;
      color: var(--gk-ink);
    }

    .bed-page .kt-product {
      display: flex;
      flex-direction: column;
      height: 100%;
      overflow: hidden;
      border: 1px solid rgba(20,20,20,.12);
      border-radius: 4px;
      background: #fff;
      box-shadow: 0 1px 2px rgba(20,20,20,.04);
      transition: border-color .4s ease, transform .4s ease, box-shadow .4s ease;
    }

    .bed-page .kt-product:hover {
      border-color: rgba(192,101,43,.55);
      transform: translateY(-3px);
      box-shadow: 0 14px 32px rgba(20,20,20,.1);
    }

    .bed-page .kt-card-title {
      font-family: var(--gk-display);
      color: var(--gk-ink);
      line-height: 1.3;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: .03em;
      font-size: .78rem;
    }

    .bed-page .kt-crop {
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
      background: rgba(10,10,10,.65);
      border: 1px solid rgba(255,255,255,.3);
      color: #fff;
      backdrop-filter: blur(6px);
      transition: background-color .3s ease, border-color .3s ease, transform .3s ease;
    }

    .bed-page .kt-crop:hover {
      background: var(--gk-accent);
      border-color: var(--gk-accent);
      transform: scale(1.08);
    }

    .bed-page .kt-inquiry {
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
      transition: background-color .3s ease, border-color .3s ease, transform .3s ease;
    }

    .bed-page .kt-inquiry:hover {
      background: #D2743A;
      border-color: #D2743A;
    }

    .bed-page .kt-inquiry:active {
      transform: scale(.98);
    }

    .bed-page .kt-price {
      font-family: var(--gk-sans);
      color: var(--gk-accent);
      font-weight: 700;
      line-height: 1.5;
    }

    /* PAGINATION */

    .bed-page .kt-pagination {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }

    .bed-page .kt-page-number,
    .bed-page .kt-page-arrow {
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
      transition: color .25s ease, background-color .25s ease, border-color .25s ease;
    }

    .bed-page .kt-page-number:hover,
    .bed-page .kt-page-arrow:not(:disabled):hover {
      color: var(--gk-accent);
      border-color: var(--gk-accent);
      background: rgba(192,101,43,.08);
    }

    .bed-page .kt-page-number.is-active {
      color: #fff;
      border-color: var(--gk-ink);
      background: var(--gk-ink);
      box-shadow: 0 4px 18px rgba(20,20,20,.18);
    }

    .bed-page .kt-page-arrow:disabled {
      cursor: not-allowed;
      opacity: .35;
    }

    /* BLACK PREVIEW */

    .bed-page .kt-ctrl {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      border-radius: 999px;
      background: rgba(10,10,10,.7);
      border: 1px solid rgba(255,255,255,.25);
      color: #fff;
      backdrop-filter: blur(6px);
      transition: background-color .3s ease, color .3s ease;
    }

    .bed-page .kt-ctrl:hover {
      background: #fff;
      color: #0A0A0A;
    }

    .bed-page .kt-lb-img {
      animation: kt-bed-fade .35s ease;
    }

    @keyframes kt-bed-fade {
      from {
        opacity: 0;
        transform: scale(.98);
      }

      to {
        opacity: 1;
        transform: scale(1);
      }
    }

    .bed-page .kt-preview-info {
      flex: 0 0 auto;
      max-height: 48vh;
      overflow-y: auto;
      padding: 1.5rem 1.25rem 1.75rem;
      background: #0A0A0A;
      border-top: 1px solid rgba(255,255,255,.1);
    }

    /* RESPONSIVE */

    @media (min-width: 640px) {
      .bed-page .gk-body {
        font-size: 16px;
      }

      .bed-page .kt-section-text {
        font-size: 14.5px;
      }

      .bed-page .kt-card-desc {
        font-size: 13.5px;
      }

      .bed-page .kt-card-title {
        font-size: 1rem;
      }

      .bed-page .kt-inquiry {
        font-size: 11.5px;
        padding: 13px 14px;
        letter-spacing: .1em;
      }

      .bed-page .kt-preview-info {
        padding: 2rem 2rem 2.25rem;
      }
    }

    @media (min-width: 1024px) {
      .bed-page .gk-body {
        font-size: 16px;
      }

      .bed-page .kt-preview-info {
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
      .bed-page .gk-eyebrow {
        font-size: 10px;
        letter-spacing: .24em;
      }

      .bed-page .kt-hero {
        padding: 6.5rem 0 2.5rem;
      }

      .bed-page .kt-hero-lines {
        background-size: 50% 100%;
      }

      .bed-page .kt-hero-text {
        font-size: .88rem;
        line-height: 1.65;
        margin-top: 1rem;
        padding: 0 6px;
        max-width: 340px;
      }

      .bed-page .kt-hero-btn {
        width: auto;
        max-width: 100%;
        height: 44px;
        margin-top: 1.5rem;
        padding: 0 22px;
        font-size: 11px;
      }

      .bed-page .kt-card-title {
        font-size: .78rem;
      }

      .bed-page .kt-inquiry {
        font-size: 10px;
        letter-spacing: .03em;
        gap: 5px;
        padding: 9px 5px;
      }

      .bed-page .kt-preview-info {
        max-height: 48dvh;
      }
    }

    @media (max-width: 400px) {
      .bed-page .kt-page-number,
      .bed-page .kt-page-arrow {
        min-width: 36px;
        height: 38px;
        padding: 0 9px;
        font-size: 11px;
      }
    }

    @media (max-width: 360px) {
      .bed-page .gk-hero-title {
        font-size: clamp(1.08rem, 5.5vw, 1.35rem);
      }

      .bed-page .kt-card-title {
        font-size: .7rem;
      }

      .bed-page .kt-inquiry {
        font-size: 8px;
        gap: 4px;
        padding: 8px 3px;
      }
    }

    @media (max-height: 640px) {
      .bed-page .kt-hero {
        padding-top: 6rem;
        padding-bottom: 2rem;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .bed-page .kt-product,
      .bed-page .kt-lb-img {
        animation: none;
        transition: none;
      }
    }
  `}</style>
);

/* =========================================================
   8. MAIN PAGE
========================================================= */

export default function Bed() {
  const [products, setProducts] = useState(localProducts);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [previewProduct, setPreviewProduct] = useState(null);
  const [inquiryProduct, setInquiryProduct] = useState(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setLoadError("");

    try {
      const data = await loadBedProducts();
      setProducts(data);
    } catch (error) {
      console.error(
        "Bed products could not be loaded from Supabase:",
        error
      );

      setProducts(localProducts);
      setLoadError(
        "Unable to connect to the bed collection. Showing local designs instead."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setLoadError("");

      try {
        const data = await loadBedProducts();

        if (!cancelled) {
          setProducts(data);
        }
      } catch (error) {
        console.error(
          "Bed products could not be loaded from Supabase:",
          error
        );

        if (!cancelled) {
          setProducts(localProducts);
          setLoadError(
            "Unable to connect to the bed collection. Showing local designs instead."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    load();

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
    document
      .getElementById("bed-products")
      ?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
  };

  const openInquiryFromPreview = (product) => {
    setPreviewProduct(null);
    setInquiryProduct(product);
  };

  return (
    <main className="bed-page min-h-screen overflow-x-clip bg-white text-[#141414] antialiased">
      <Styles />

      <FirstScreen onExplore={scrollToProducts} />

      <div className="kt-content">
        {loadError && (
          <div
            role="status"
            className="px-4 pt-5 text-center font-sans text-xs text-neutral-500"
          >
            {loadError}

            <button
              type="button"
              onClick={fetchProducts}
              className="ml-2 font-medium text-[#C0652B] underline underline-offset-4"
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
}
