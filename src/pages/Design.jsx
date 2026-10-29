// Design.jsx  (2D/3D Design)
// Supabase table: design_images
// Columns: id, image_url, storage_path, alt, project_id, project_title,
//          project_description, project_price, project_delivery, sort_order, created_at
// Theme: Black Heading | White Product Cards | Black Preview | White Inquiry Modal
// Font: Montserrat only (same as Vanities.jsx)

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Crop,
  Images,
  MessageCircle,
  Truck,
  X,
} from "lucide-react";

import { supabase } from "../lib/supabase";

/* =========================================================
   SETTINGS
========================================================= */

const WHATSAPP_NUMBER = "923007023202";
const BRAND = "Gohar";
const GALLERY_LABEL = "2D/3D Design";
const TABLE = "design_images";
const DELIVERY_TEXT = ""; // khali = delivery line tab dikhegi jab admin se likhein

const DEFAULT_DESCRIPTION =
  "Detailed 2D plans and realistic 3D renders that help you visualise every layout, finish and detail before a single cabinet is built.";

const PAGE_SIZE = 12;
const MAX_VISIBLE_PAGES = 5;

/* =========================================================
   HELPERS
========================================================= */

const pad = (number) => String(number).padStart(2, "0");

/* Number ho to "PKR 15,000", text ho to jaisa likha hai waisa hi */
const formatPrice = (price) => {
  if (price === null || price === undefined) return "";
  const text = String(price).trim();
  if (!text) return "";
  const numeric = Number(text.replace(/,/g, ""));
  if (Number.isFinite(numeric)) {
    return numeric > 0 ? `PKR ${numeric.toLocaleString("en-PK")}` : "";
  }
  return text;
};

const openWhatsApp = (message) => {
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    message
  )}`;

  const newWindow = window.open(url, "_blank", "noopener,noreferrer");

  if (!newWindow) {
    window.location.href = url;
  }
};

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
   LOAD PROJECTS FROM SUPABASE
========================================================= */

const loadDesignProjects = async () => {
  const { data, error } = await supabase
    .from(TABLE)
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) throw error;

  const grouped = new Map();

  (data || []).forEach((row, index) => {
    /* project_id na ho to purani image alag card ban jati hai */
    const key = row.project_id || `legacy-${row.id}`;

    if (!grouped.has(key)) {
      grouped.set(key, {
        id: key,
        title: row.project_title || row.alt || `${GALLERY_LABEL} ${index + 1}`,
        description: "",
        price: "",
        deliveryText: "",
        images: [],
        sort_order: row.sort_order ?? index,
      });
    }

    const project = grouped.get(key);
    if (!project.description && row.project_description)
      project.description = row.project_description;
    if (!project.price && row.project_price) project.price = row.project_price;
    if (!project.deliveryText && row.project_delivery)
      project.deliveryText = row.project_delivery;

    project.images.push(row);
  });

  return Array.from(grouped.values())
    .map((project) => ({
      ...project,
      images: [...project.images].sort(
        (a, b) =>
          (a.image_order ?? a.sort_order ?? 0) -
          (b.image_order ?? b.sort_order ?? 0)
      ),
    }))
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((project, index) => ({
      ...project,
      displayNumber: index + 1,
      description: project.description || DEFAULT_DESCRIPTION,
      deliveryText: project.deliveryText || DELIVERY_TEXT,
      image: project.images[0]?.image_url,
    }));
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

/* =========================================================
   EYEBROW
========================================================= */

const Eyebrow = ({ children, align = "center", className = "" }) => (
  <div
    className={`mb-4 flex items-center gap-3 sm:mb-5 ${
      align === "center" ? "justify-center" : ""
    } ${className}`}
  >
    <span className="h-px w-8 bg-[#C0652B] sm:w-10" />
    <span className="gk-eyebrow">{children}</span>
    {align === "center" && <span className="h-px w-8 bg-[#C0652B] sm:w-10" />}
  </div>
);

/* =========================================================
   1. WHATSAPP INQUIRY MODAL (WHITE)
========================================================= */

function InquiryModal({ product, onClose }) {
  const [form, setForm] = useState({ name: "", phone: "", city: "" });

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

    const priceText = formatPrice(product.price);

    const message = `
Hello ${BRAND}, I would like to inquire about your ${GALLERY_LABEL} service.

*Project:* ${product.title} (Design ${pad(product.displayNumber)})
*Price:* ${priceText || "Price on request"}
*Name:* ${form.name}
*Phone:* ${form.phone}
*City:* ${form.city}${
      product.deliveryText ? `\n*Delivery:* ${product.deliveryText}` : ""
    }

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

  const priceText = formatPrice(product.price);

  return (
    <div
      className="fixed inset-0 z-[130] flex items-center justify-center bg-black/70 px-4 py-6 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="design-inquiry-heading"
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
            <Eyebrow align="left">Service Inquiry</Eyebrow>

            <h2
              id="design-inquiry-heading"
              className="gk-h3 !text-[1.2rem] sm:!text-[1.5rem]"
            >
              {product.title}
            </h2>

            <p className="gk-body mt-2 !text-[13px] sm:!text-[13.5px]">
              Share your details and we will continue the conversation on
              WhatsApp.
            </p>

            {priceText && (
              <p className="mt-3 font-sans text-sm font-semibold text-[#C0652B]">
                {priceText}
              </p>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="px-5 py-6 sm:px-8 sm:py-8">
          <div className="space-y-5">
            <div>
              <label htmlFor="design-iq-name" className={labelCls}>
                Full Name
              </label>
              <input
                id="design-iq-name"
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
              <label htmlFor="design-iq-phone" className={labelCls}>
                Phone Number
              </label>
              <input
                id="design-iq-phone"
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
              <label htmlFor="design-iq-city" className={labelCls}>
                City
              </label>
              <input
                id="design-iq-city"
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

          <button type="submit" className="gk-btn-solid group mt-7 !flex w-full">
            <MessageCircle size={17} strokeWidth={2} className="shrink-0" />
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
   2. FULL-SCREEN PREVIEW (BLACK) - project ki saari images
========================================================= */

const Preview = ({ product, onClose, onInquiry }) => {
  const [index, setIndex] = useState(0);
  const touchStart = useRef(null);

  const images = product.images || [];
  const total = images.length;

  const prev = useCallback(
    () => setIndex((value) => (value - 1 + total) % total),
    [total]
  );
  const next = useCallback(
    () => setIndex((value) => (value + 1) % total),
    [total]
  );

  useEffect(() => {
    const handleKey = (event) => {
      if (event.key === "Escape") onClose();
      if (total > 1 && event.key === "ArrowLeft") prev();
      if (total > 1 && event.key === "ArrowRight") next();
    };

    const previousOverflow = document.body.style.overflow;

    window.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose, prev, next, total]);

  const handleTouchEnd = (event) => {
    if (touchStart.current === null || total < 2) return;
    const diff = event.changedTouches[0].clientX - touchStart.current;
    if (Math.abs(diff) > 50) (diff > 0 ? prev : next)();
    touchStart.current = null;
  };

  if (!total) return null;

  const current = images[index] || images[0];
  const priceText = formatPrice(product.price);

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

      <div className="flex min-h-0 flex-1 flex-col">
        <div
          className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden p-4 pt-16 sm:p-8 sm:pt-20 lg:p-12"
          onTouchStart={(event) =>
            (touchStart.current = event.touches[0].clientX)
          }
          onTouchEnd={handleTouchEnd}
        >
          {total > 1 && (
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                prev();
              }}
              aria-label="Previous image"
              className="kt-ctrl absolute left-2 top-1/2 z-10 -translate-y-1/2 sm:left-5"
            >
              <ChevronLeft size={20} />
            </button>
          )}

          <img
            key={current.id || current.image_url}
            src={current.image_url}
            alt={current.alt || product.title}
            onClick={(event) => event.stopPropagation()}
            className="kt-lb-img max-h-full max-w-full rounded-sm object-contain"
          />

          {total > 1 && (
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                next();
              }}
              aria-label="Next image"
              className="kt-ctrl absolute right-2 top-1/2 z-10 -translate-y-1/2 sm:right-5"
            >
              <ChevronRight size={20} />
            </button>
          )}

          {total > 1 && (
            <span className="kt-counter">
              {pad(index + 1)} / {pad(total)}
            </span>
          )}
        </div>

        {total > 1 && (
          <div className="kt-thumbs" onClick={(event) => event.stopPropagation()}>
            {images.map((img, i) => (
              <button
                key={img.id || img.image_url}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Show image ${i + 1}`}
                className={i === index ? "is-active" : ""}
              >
                <img src={img.image_url} alt="" loading="lazy" />
              </button>
            ))}
          </div>
        )}
      </div>

      <aside onClick={(event) => event.stopPropagation()} className="kt-preview-info">
        <Eyebrow align="left">Design {pad(product.displayNumber)}</Eyebrow>

        <h3 className="gk-h3 !text-[1.15rem] sm:!text-[1.4rem] lg:!text-[1.6rem]">
          {product.title}
        </h3>

        <div className="my-4 h-px w-12 bg-[#C0652B] sm:my-5" />

        <p className="gk-body !text-[14px] sm:!text-[15px]">
          {product.description}
        </p>

        {priceText && <p className="kt-price mt-4 text-lg">{priceText}</p>}

        {product.deliveryText && (
          <p className="mt-4 flex items-center gap-2 font-sans text-xs font-medium tracking-wide text-white/60 sm:text-[13px]">
            <Truck size={15} strokeWidth={1.6} className="shrink-0 text-[#E08A4F]" />
            {product.deliveryText}
          </p>
        )}

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
   3. PRODUCT CARD (WHITE)
========================================================= */

const ProductCard = ({ product, index, onPreview, onInquiry }) => {
  const priceText = formatPrice(product.price);
  const count = product.images.length;

  return (
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

          {count > 1 && (
            <span className="kt-badge">
              <Images size={12} strokeWidth={1.8} />
              {count}
            </span>
          )}
        </div>

        <div className="flex flex-1 flex-col p-3 sm:p-5">
          <h3 className="kt-card-title line-clamp-1">{product.title}</h3>

          <p className="kt-card-desc mt-2 line-clamp-2 min-h-[2.5rem]">
            {product.description}
          </p>

          {priceText && (
            <p className="kt-price mt-3 text-sm sm:text-base">{priceText}</p>
          )}

          {product.deliveryText && (
            <p className="mt-3 flex items-center gap-2 font-sans text-[10.5px] font-medium tracking-wide text-neutral-600 sm:text-xs">
              <Truck size={14} strokeWidth={1.6} className="shrink-0 text-[#C0652B]" />
              <span className="truncate">{product.deliveryText}</span>
            </p>
          )}

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
              <span className="hidden sm:inline">WhatsApp </span>
              Inquiry
            </span>
          </button>
        </div>
      </article>
    </Reveal>
  );
};

/* =========================================================
   4. PAGINATION  (1 2 3 4 5)
========================================================= */

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  return (
    <nav className="kt-pagination" aria-label="2D/3D design pages">
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

      {getPageNumbers(currentPage, totalPages).map((page) => (
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
   5. PRODUCTS SECTION
========================================================= */

const Products = ({ products, loading, onPreview, onInquiry }) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(products.length / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * PAGE_SIZE;
  const endIndex = Math.min(startIndex + PAGE_SIZE, products.length);
  const shown = products.slice(startIndex, endIndex);

  useEffect(() => {
    setCurrentPage(1);
  }, [products.length]);

  const changePage = (page) => {
    const nextPage = Math.max(1, Math.min(page, totalPages));
    if (nextPage === safePage) return;

    setCurrentPage(nextPage);

    window.setTimeout(() => {
      document.getElementById("design-products")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 50);
  };

  return (
    <section
      id="design-products"
      className="relative scroll-mt-6 py-12 sm:py-16 lg:py-20"
    >
      <div className="mx-auto max-w-[1320px] px-4 sm:px-8 lg:px-12">
        {loading ? (
          <div className="py-16 text-center font-sans text-sm text-neutral-500">
            Loading 2D/3D designs...
          </div>
        ) : products.length === 0 ? (
          <div className="py-16 text-center">
            <p className="font-sans text-sm text-neutral-500">
              Design projects will appear here soon.
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
                projects
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
   6. STYLES  (Montserrat only)
========================================================= */

const Styles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&display=swap');

    .design-page {
      --gk-display: 'Montserrat', system-ui, -apple-system, 'Segoe UI', sans-serif;
      --gk-sans: 'Montserrat', system-ui, -apple-system, 'Segoe UI', sans-serif;
      --gk-accent: #C0652B;
      --gk-accent-soft: #E08A4F;
      --gk-ink: #141414;
      font-family: var(--gk-sans);
      background: #fff;
    }

    .design-page *,
    .design-page .font-sans {
      font-family: var(--gk-sans) !important;
    }

    .design-page button,
    .design-page input {
      font-family: var(--gk-sans);
    }

    /* TYPOGRAPHY */

    .design-page .gk-eyebrow {
      font-size: 11px;
      font-weight: 500;
      letter-spacing: .32em;
      text-transform: uppercase;
      color: var(--gk-accent-soft);
    }

    .design-page .gk-light .gk-eyebrow {
      color: var(--gk-accent);
      font-weight: 600;
    }

    .design-page .gk-h3 {
      color: #fff;
      line-height: 1.3;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: .03em;
      font-size: clamp(1.2rem, 1rem + .8vw, 1.55rem);
    }

    .design-page .gk-body {
      font-weight: 400;
      color: rgba(255,255,255,.78);
      line-height: 1.8;
      font-size: 15px;
    }

    .design-page .gk-light .gk-h3 { color: var(--gk-ink); }
    .design-page .gk-light .gk-body { color: rgba(20,20,20,.68); }

    /* BLACK HEADING SECTION */

    .design-page .dsn-top {
      background: #000;
      color: #fff;
      padding: 104px 16px 56px;
    }

    .design-page .dsn-top-inner {
      width: 100%;
      max-width: 1320px;
      margin: 0 auto;
    }

    .design-page .dsn-heading {
      margin: 0;
      color: #fff;
      font-size: clamp(1.7rem, 6vw, 3.4rem);
      font-weight: 700;
      line-height: 1.15;
      letter-spacing: .03em;
      text-transform: uppercase;
    }

    .design-page .dsn-heading em {
      font-style: normal;
      color: var(--gk-accent);
    }

    .design-page .dsn-heading-rule {
      display: block;
      width: 56px;
      height: 2px;
      margin-top: 20px;
      background: var(--gk-accent);
    }

    .design-page .dsn-subtext {
      max-width: 680px;
      margin: 20px 0 0;
      color: rgba(255,255,255,.72);
      font-size: 13px;
      font-weight: 400;
      line-height: 1.9;
      letter-spacing: .01em;
    }

    @media (min-width: 640px) {
      .design-page .dsn-top { padding: 124px 32px 68px; }
      .design-page .dsn-subtext { font-size: 14px; }
    }

    @media (min-width: 1024px) {
      .design-page .dsn-top { padding: 148px 48px 84px; }
    }

    /* BUTTONS */

    .design-page .gk-btn-solid {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      height: 50px;
      padding: 0 30px;
      border: 1px solid var(--gk-accent);
      border-radius: 999px;
      background: var(--gk-accent);
      font-size: 12px;
      font-weight: 600;
      letter-spacing: .12em;
      text-transform: uppercase;
      color: #fff;
      white-space: nowrap;
      transition: background-color .3s ease, color .3s ease,
        border-color .3s ease, transform .3s ease;
    }

    .design-page .gk-btn-solid:hover {
      background: #D2743A;
      border-color: #D2743A;
    }

    /* WHITE PRODUCT CARDS */

    .design-page .kt-content {
      position: relative;
      z-index: 10;
      background: #fff;
      color: var(--gk-ink);
    }

    .design-page .kt-product {
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

    .design-page .kt-product:hover {
      border-color: rgba(192,101,43,.55);
      transform: translateY(-3px);
      box-shadow: 0 14px 32px rgba(20,20,20,.1);
    }

    .design-page .kt-card-title {
      color: var(--gk-ink);
      line-height: 1.3;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: .03em;
      font-size: .78rem;
    }

    .design-page .kt-card-desc {
      font-weight: 400;
      font-size: 11.5px;
      line-height: 1.6;
      color: rgba(20,20,20,.64);
    }

    .design-page .kt-crop {
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

    .design-page .kt-crop:hover {
      background: var(--gk-accent);
      border-color: var(--gk-accent);
      transform: scale(1.08);
    }

    .design-page .kt-badge {
      position: absolute;
      right: 10px;
      top: 10px;
      z-index: 2;
      display: inline-flex;
      align-items: center;
      gap: 5px;
      padding: 6px 10px;
      border-radius: 999px;
      background: rgba(10,10,10,.65);
      border: 1px solid rgba(255,255,255,.3);
      color: #fff;
      font-size: 10.5px;
      font-weight: 600;
      letter-spacing: .06em;
      backdrop-filter: blur(6px);
    }

    .design-page .kt-inquiry {
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
      font-size: 10px;
      font-weight: 600;
      letter-spacing: .08em;
      text-transform: uppercase;
      color: #fff;
      white-space: nowrap;
      transition: background-color .3s ease, border-color .3s ease, transform .3s ease;
    }

    .design-page .kt-inquiry:hover {
      background: #D2743A;
      border-color: #D2743A;
    }

    .design-page .kt-inquiry:active { transform: scale(.98); }

    .design-page .kt-price {
      color: var(--gk-accent);
      font-weight: 700;
      line-height: 1.5;
    }

    /* PAGINATION */

    .design-page .kt-pagination {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: center;
      gap: 8px;
    }

    .design-page .kt-page-number,
    .design-page .kt-page-arrow {
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
      font-size: 12px;
      font-weight: 500;
      transition: color .25s ease, background-color .25s ease, border-color .25s ease;
    }

    .design-page .kt-page-number:hover,
    .design-page .kt-page-arrow:not(:disabled):hover {
      color: var(--gk-accent);
      border-color: var(--gk-accent);
      background: rgba(192,101,43,.08);
    }

    .design-page .kt-page-number.is-active {
      color: #fff;
      border-color: var(--gk-ink);
      background: var(--gk-ink);
      box-shadow: 0 4px 18px rgba(20,20,20,.18);
    }

    .design-page .kt-page-arrow:disabled {
      cursor: not-allowed;
      opacity: .35;
    }

    /* BLACK PREVIEW */

    .design-page .kt-ctrl {
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

    .design-page .kt-ctrl:hover {
      background: #fff;
      color: #0A0A0A;
    }

    .design-page .kt-counter {
      position: absolute;
      left: 16px;
      top: 22px;
      font-size: 11px;
      font-weight: 500;
      letter-spacing: .18em;
      color: rgba(255,255,255,.65);
    }

    @media (min-width: 640px) {
      .design-page .kt-counter { left: 32px; top: 30px; }
    }

    .design-page .kt-thumbs {
      display: flex;
      justify-content: center;
      gap: 8px;
      padding: 4px 12px 14px;
      overflow-x: auto;
    }

    .design-page .kt-thumbs button {
      flex: 0 0 54px;
      width: 54px;
      height: 54px;
      padding: 2px;
      border: 1px solid #444;
      border-radius: 4px;
      background: #111;
      opacity: .6;
      cursor: pointer;
      transition: opacity .25s ease, border-color .25s ease;
    }

    .design-page .kt-thumbs button:hover { opacity: .9; }

    .design-page .kt-thumbs button.is-active {
      border-color: var(--gk-accent);
      opacity: 1;
    }

    .design-page .kt-thumbs img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 2px;
    }

    .design-page .kt-lb-img {
      animation: kt-design-fade .35s ease;
    }

    @keyframes kt-design-fade {
      from { opacity: 0; transform: scale(.98); }
      to   { opacity: 1; transform: scale(1); }
    }

    .design-page .kt-preview-info {
      flex: 0 0 auto;
      max-height: 48vh;
      overflow-y: auto;
      padding: 1.5rem 1.25rem 1.75rem;
      background: #0A0A0A;
      border-top: 1px solid rgba(255,255,255,.1);
    }

    /* RESPONSIVE */

    @media (min-width: 640px) {
      .design-page .gk-body { font-size: 16px; }
      .design-page .kt-card-desc { font-size: 13.5px; }
      .design-page .kt-card-title { font-size: 1rem; }

      .design-page .kt-inquiry {
        font-size: 11.5px;
        padding: 13px 14px;
        letter-spacing: .1em;
      }

      .design-page .kt-preview-info { padding: 2rem 2rem 2.25rem; }
    }

    @media (min-width: 1024px) {
      .design-page .kt-preview-info {
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
      .design-page .gk-eyebrow {
        font-size: 10px;
        letter-spacing: .24em;
      }

      .design-page .kt-card-title { font-size: .78rem; }

      .design-page .kt-inquiry {
        font-size: 10px;
        letter-spacing: .03em;
        gap: 5px;
        padding: 9px 5px;
      }

      .design-page .kt-preview-info { max-height: 44dvh; }
    }

    @media (max-width: 400px) {
      .design-page .kt-page-number,
      .design-page .kt-page-arrow {
        min-width: 36px;
        height: 38px;
        padding: 0 9px;
        font-size: 11px;
      }
    }

    @media (max-width: 360px) {
      .design-page .kt-card-title { font-size: .7rem; }

      .design-page .kt-inquiry {
        font-size: 8px;
        gap: 4px;
        padding: 8px 3px;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .design-page .kt-product,
      .design-page .kt-lb-img {
        animation: none;
        transition: none;
      }
    }
  `}</style>
);

/* =========================================================
   7. MAIN PAGE
========================================================= */

export default function Design() {
  const [products, setProducts] = useState(null); // null = loading
  const [loadError, setLoadError] = useState("");

  const [previewProduct, setPreviewProduct] = useState(null);
  const [inquiryProduct, setInquiryProduct] = useState(null);

  const fetchProducts = useCallback(async () => {
    setLoadError("");
    setProducts(null);

    try {
      setProducts(await loadDesignProjects());
    } catch (error) {
      console.error("Design projects could not be loaded from Supabase:", error);
      setProducts([]);
      setLoadError("The gallery is temporarily unavailable. Please try again later.");
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const list = useMemo(() => products || [], [products]);
  const loading = products === null;

  const closePreview = useCallback(() => setPreviewProduct(null), []);
  const closeInquiry = useCallback(() => setInquiryProduct(null), []);

  const openInquiryFromPreview = (product) => {
    setPreviewProduct(null);
    setInquiryProduct(product);
  };

  return (
    <main className="design-page min-h-screen overflow-x-clip bg-white text-[#141414] antialiased">
      <Styles />

      {/* ================= BLACK: HEADING + DESCRIPTION ================= */}
      <section className="dsn-top" aria-labelledby="dsn-title">
        <div className="dsn-top-inner">
          <h1 className="dsn-heading" id="dsn-title">
            2D/3D <em>Design</em>
          </h1>

          <span className="dsn-heading-rule" aria-hidden="true" />

          <p className="dsn-subtext">
            Before a single cabinet is built, we show you how your space will look and
            feel. Our detailed 2D plans and realistic 3D renders help you visualise
            every layout, finish and detail, so each decision is made with confidence.
          </p>
        </div>
      </section>

      {/* ================= WHITE: PRODUCT CARDS ================= */}
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
          products={list}
          loading={loading}
          onPreview={setPreviewProduct}
          onInquiry={setInquiryProduct}
        />
      </div>

      {previewProduct && (
        <Preview
          key={previewProduct.id}
          product={previewProduct}
          onClose={closePreview}
          onInquiry={openInquiryFromPreview}
        />
      )}

      {inquiryProduct && (
        <InquiryModal product={inquiryProduct} onClose={closeInquiry} />
      )}
    </main>
  );
}