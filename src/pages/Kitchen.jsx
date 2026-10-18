  // Kitchen.jsx
  // Install: npm i lucide-react
  // Needs: Tailwind CSS, ../assets/kitchen.mp4, ../assets/kitchen1.webp ... kitchen50.webp
  // Hero background: ../assets/mob2.webp (mobile) + ../assets/des2.webp (desktop)

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
  import kitchenVideo from "../assets/kitchen.mp4";
  import heroMobile from "../assets/mob2.webp";
  import heroDesktop from "../assets/des2.webp";
  import { supabase } from "../lib/supabase";

  /* =========================================================
    SETTINGS
  ========================================================= */
  const WHATSAPP_NUMBER = "923007023202"; // apna WhatsApp number (country code ke sath)
  const BRAND = "Gohar";
  const TOTAL_PRODUCTS = 50;
  const PAGE_SIZE = 12; // designs per page (1 2 3 ... automatically ata hai)
  const DELIVERY_TEXT = "Delivery Over Pakistan";

  /* =========================================================
    ASSETS
  ========================================================= */
  const localAssets = import.meta.glob("../assets/*.webp", {
    eager: true,
    query: "?url",
    import: "default",
  });

  const getImage = (filename) => {
    const key = Object.keys(localAssets).find((k) => k.endsWith(`/${filename}`));
    return key ? localAssets[key] : `/assets/${filename}`;
  };

  /* =========================================================
    PRODUCTS  (title / description yahan se edit kar sakte ho)
  ========================================================= */
  const titles = [
    "Modern Modular Kitchen",
    "Luxury Handleless Kitchen",
    "Imported Sheet Kitchen",
    "Classic Tusan Kitchen",
    "Solid Wood Kitchen",
    "Contemporary L-Shape Kitchen",
    "Elegant U-Shape Kitchen",
    "Minimal Straight Kitchen",
    "Premium Glossy Kitchen",
    "Warm Wooden Kitchen",
  ];

  const descriptions = [
    "Smartly planned cabinets with soft-close hardware and a flawless finish, built to measure for your space.",
    "A clean handleless design with premium boards, heated edge tape and refined detailing.",
    "Elegant finish with practical storage, made to order with materials and colours of your choice.",
    "Timeless styling with durable construction and thoughtful storage for everyday cooking.",
    "Beautiful balance of looks and function, crafted with care and installed neatly on site.",
  ];

  const localProducts = Array.from({ length: TOTAL_PRODUCTS }, (_, i) => ({
    id: i + 1,
    designNumber: i + 1,
    title: titles[i % titles.length],
    description: descriptions[i % descriptions.length],
    image: getImage(`kitchen${i + 1}.webp`),
    deliveryText: DELIVERY_TEXT,
  }));

  const marqueeWords = [
    "Bespoke Kitchens",
    "Made To Measure",
    "Premium Finishes",
    "Soft-Close Hardware",
    "Custom Layouts",
    "Neat Installation",
  ];

  /* =========================================================
    HELPERS
  ========================================================= */
  const pad = (n) => String(n).padStart(2, "0");

  function openWhatsApp(text) {
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
    const w = window.open(url, "_blank", "noopener,noreferrer");
    if (!w) window.location.href = url;
  }

  const useReveal = () => {
    const ref = useRef(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
      const el = ref.current;
      if (!el) return;

      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setVisible(true);
            obs.disconnect();
          }
        },
        { threshold: 0.08 }
      );

      obs.observe(el);
      return () => obs.disconnect();
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

  /* align="center" -> lines on both sides, align="left" -> line on left only */
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
    1. FIRST SCREEN = HEADER + MARQUEE (ek hi screen mein)
    Header ke peeche background image:
    mobile  -> mob2.webp
    desktop -> des2.webp
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
        {/* HEADER */}
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

          <div className="relative z-10 mx-auto flex w-full max-w-[1000px] flex-col items-center px-5 text-center sm:px-8">
            <Eyebrow>Bespoke Kitchens</Eyebrow>

            <h1 className="gk-hero-title">
              Kitchens That Feel
              <br />
              <em>Made For You</em>
            </h1>

            <p className="kt-hero-text">
              Custom kitchens, premium finishes, and thoughtful storage—made for your home.
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

        {/* MARQUEE */}
        <div className="kt-marquee">
          <div className="kt-strip-track">
            {items.map((t, i) => (
              <span key={i} className="kt-strip-item">
                <span className="kt-strip-dot" />
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>
    );
  };

  /* =========================================================
    2. STICKY VIDEO (100% height, 100% width)
  ========================================================= */
  const VideoSection = () => {
    const videoRef = useRef(null);

    useEffect(() => {
      const v = videoRef.current;
      if (!v) return;

      v.muted = true;
      const p = v.play();
      if (p && p.catch) p.catch(() => {});
    }, []);

    return (
      <section className="kt-video">
        <video
          ref={videoRef}
          className="kt-video-el"
          src={kitchenVideo}
          poster={getImage("kitchen1.webp")}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A]/45 via-transparent to-[#0A0A0A]/25" />
      </section>
    );
  };

  /* =========================================================
    3. INQUIRY MODAL
  ========================================================= */
  function InquiryModal({ product, onClose }) {
    const [form, setForm] = useState({ name: "", phone: "", city: "" });

    useEffect(() => {
      const onKey = (e) => {
        if (e.key === "Escape") onClose();
      };

      window.addEventListener("keydown", onKey);
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";

      return () => {
        window.removeEventListener("keydown", onKey);
        document.body.style.overflow = prev;
      };
    }, [onClose]);

    const handleChange = (e) =>
      setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

    const handleSubmit = (e) => {
      e.preventDefault();

      const message = `
  Hello ${BRAND}, I would like to inquire about a kitchen.

  *Product:* ${product.title} (Design ${pad(product.designNumber ?? product.id)})
  *Name:* ${form.name}
  *Phone:* ${form.phone}
  *City:* ${form.city}

  Please share more details and available options.
      `.trim();

      openWhatsApp(message);
      setForm({ name: "", phone: "", city: "" });
      onClose();
    };

    const inputCls =
      "w-full rounded-lg border border-white/15 bg-white/[0.04] px-4 py-3.5 font-sans text-sm text-white outline-none transition duration-200 placeholder:text-white/35 focus:border-[#C0652B] focus:ring-2 focus:ring-[#C0652B]/20";

    const labelCls =
      "mb-2 block font-sans text-[11px] font-medium uppercase tracking-[0.16em] text-white/60";

    return (
      <div
        className="fixed inset-0 z-[130] flex items-center justify-center bg-black/80 px-4 py-6 backdrop-blur-sm"
        onMouseDown={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <div
          role="dialog"
          aria-modal="true"
          className="relative max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-md border border-white/10 bg-[#0F0E0D] shadow-[0_30px_80px_rgba(0,0,0,0.6)]"
        >
          <div className="relative overflow-hidden border-b border-white/10 px-6 py-7 sm:px-8">
            <div className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-[#C0652B] opacity-[0.12] blur-3xl" />

            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="absolute right-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white/80 transition hover:bg-white/10 hover:text-white"
            >
              <X size={17} />
            </button>

            <div className="relative z-10 pr-10">
              <Eyebrow align="left">Product Inquiry</Eyebrow>
              <h2 className="gk-h3 !text-[1.9rem]">{product.title}</h2>
              <p className="gk-body mt-2 !text-[13.5px]">
                Share your details and we will continue the conversation on
                WhatsApp.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="px-6 py-6 sm:px-8 sm:py-8">
            <div className="space-y-5">
              <div>
                <label htmlFor="iq-name" className={labelCls}>Full Name</label>
                <input
                  id="iq-name"
                  name="name"
                  type="text"
                  required
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className={inputCls}
                />
              </div>

              <div>
                <label htmlFor="iq-phone" className={labelCls}>Phone Number</label>
                <input
                  id="iq-phone"
                  name="phone"
                  type="tel"
                  required
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="03XX XXXXXXX"
                  className={inputCls}
                />
              </div>

              <div>
                <label htmlFor="iq-city" className={labelCls}>City</label>
                <input
                  id="iq-city"
                  name="city"
                  type="text"
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

            <p className="mt-3 text-center font-sans text-[11px] leading-5 text-white/40">
              Your inquiry will be sent directly to our WhatsApp.
            </p>
          </form>
        </div>
      </div>
    );
  }

  /* =========================================================
    4. PREVIEW (image + title + description, koi arrows nahi)
  ========================================================= */
  const Preview = ({ product, onClose, onInquiry }) => {
    useEffect(() => {
      const onKey = (e) => {
        if (e.key === "Escape") onClose();
      };

      window.addEventListener("keydown", onKey);
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";

      return () => {
        window.removeEventListener("keydown", onKey);
        document.body.style.overflow = prev;
      };
    }, [onClose]);

    return (
      <div
        className="kt-preview fixed inset-0 z-[110] flex flex-col bg-[#070707] lg:flex-row"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="kt-ctrl absolute right-3 top-3 z-20 !h-11 !w-11 sm:right-6 sm:top-6"
        >
          <X size={20} />
        </button>

        {/* IMAGE */}
        <div className="flex min-h-0 flex-1 items-center justify-center overflow-hidden p-4 pt-16 sm:p-8 sm:pt-20 lg:p-12">
          <img
            src={product.image}
            alt={product.title}
            onClick={(e) => e.stopPropagation()}
            className="kt-lb-img max-h-full max-w-full rounded-sm object-contain"
          />
        </div>

        {/* DETAILS */}
        <aside onClick={(e) => e.stopPropagation()} className="kt-preview-info">
          <Eyebrow align="left">Design {pad(product.designNumber ?? product.id)}</Eyebrow>

          <h3 className="gk-h3 !text-[1.7rem] sm:!text-[2rem] lg:!text-[2.3rem]">
            {product.title}
          </h3>

          <div className="my-4 h-px w-12 bg-[#C0652B] sm:my-5" />

          <p className="gk-body !text-[14.5px] sm:!text-[15px]">
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
    5. PRODUCT CARD
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

          {/* crop icon (top left) -> full preview */}
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

          <p className="mt-2 line-clamp-2 min-h-[2.5rem] font-sans text-xs font-light leading-5 text-white/60 sm:text-sm">
            {product.description}
          </p>

          <p className="mt-3 flex items-center gap-2 font-sans text-[11px] font-medium tracking-wide text-white/55 sm:text-xs">
            <Truck size={14} strokeWidth={1.6} className="shrink-0 text-[#E08A4F]" />
            {product.deliveryText || DELIVERY_TEXT}
          </p>

          <button
            type="button"
            onClick={() => onInquiry(product)}
            className="kt-inquiry mt-auto"
          >
            <MessageCircle strokeWidth={1.8} className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" />
            <span className="truncate">WhatsApp Inquiry</span>
          </button>
        </div>
      </article>
    </Reveal>
  );

  /* =========================================================
    6. NUMBERED PAGINATION  (Previous  1  2  3  Next)
  ========================================================= */
  const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    if (totalPages <= 1) return null;

    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

    return (
      <nav className="kt-pagination" aria-label="Kitchen product pages">
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
    7. PRODUCTS + PAGINATION
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
        document.getElementById("kitchen-products")?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 50);
    };

    return (
      <section
        id="kitchen-products"
        className="relative scroll-mt-6 py-12 sm:py-16 lg:py-20"
      >
        <div className="mx-auto max-w-[1320px] px-4 sm:px-8 lg:px-12">
          <Reveal>
            <div className="mb-8 text-center sm:mb-10">
              <Eyebrow>Our Collection</Eyebrow>

              <h2 className="gk-h2">
                Kitchens Designed <em>Around Your Space</em>
              </h2>

              <p className="mx-auto mt-3 max-w-lg font-sans text-sm leading-6 text-white/55">
                Explore made-to-measure designs for your home.
              </p>
            </div>
          </Reveal>

          <div
            key={currentPage}
            className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4"
          >
            {shown.map((product, i) => (
              <ProductCard
                key={product.id}
                product={product}
                index={i}
                onPreview={onPreview}
                onInquiry={onInquiry}
              />
            ))}
          </div>

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
    8. STYLES
  ========================================================= */
  const Styles = () => (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;1,500;1,600&family=Jost:wght@300;400;500;600&display=swap');

      :root {
        --gk-display: 'Cormorant Garamond', Georgia, 'Times New Roman', serif;
        --gk-sans: 'Jost', system-ui, -apple-system, 'Segoe UI', sans-serif;
        --gk-accent: #C0652B;
        --gk-accent-soft: #E08A4F;

        /* Sticky video controls (desktop ke liye adjust karo) */
        --kt-video-pos-y: 35%;          /* 0% = upar, 50% = beech, 100% = neeche */
        --kt-video-zoom-desktop: 1.12;  /* zoom zyada/kam karna ho to yahan badlo */
      }

      /* ---------- Typography ---------- */
      .gk-eyebrow {
        font-family: var(--gk-sans);
        font-size: 11px;
        font-weight: 500;
        letter-spacing: 0.26em;
        text-transform: uppercase;
        color: var(--gk-accent-soft);
      }

      @media (max-width: 640px) {
        .gk-eyebrow { font-size: 11.5px; letter-spacing: 0.22em; }
      }

      .gk-hero-title {
        font-family: var(--gk-display);
        font-weight: 500;
        color: #fff;
        line-height: 1.04;
        letter-spacing: -0.02em;
        font-size: clamp(2.7rem, 1rem + 7.4vw, 5.8rem);
      }

      .gk-hero-title em { font-style: italic; color: var(--gk-accent-soft); }

      .gk-h2 {
        font-family: var(--gk-display);
        font-weight: 500;
        color: #fff;
        line-height: 1.08;
        letter-spacing: -0.015em;
        font-size: clamp(2.1rem, 1.4rem + 2.8vw, 3.6rem);
      }

      .gk-h2 em { font-style: italic; color: var(--gk-accent-soft); }

      .gk-h3 {
        font-family: var(--gk-display);
        font-weight: 600;
        color: #fff;
        line-height: 1.1;
        font-size: clamp(1.6rem, 1.3rem + 0.9vw, 2rem);
      }

      .gk-body {
        font-family: var(--gk-sans);
        font-weight: 300;
        color: rgba(255,255,255,0.7);
        line-height: 1.8;
        font-size: 15px;
      }

      @media (min-width: 1024px) { .gk-body { font-size: 16px; } }

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
        font-weight: 500;
        letter-spacing: 0.16em;
        text-transform: uppercase;
        color: #fff;
        white-space: nowrap;
        transition: background-color .3s ease, color .3s ease, border-color .3s ease, transform .3s ease;
      }

      .gk-btn-outline { border: 1px solid rgba(255,255,255,0.35); }
      .gk-btn-outline:hover { background: #fff; color: #0A0A0A; border-color: #fff; }
      .gk-btn-solid { background: var(--gk-accent); }
      .gk-btn-solid:hover { background: #D2743A; }

      /* ---------- FIRST SCREEN: header + marquee = 100% screen ---------- */
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
        padding: 7rem 0 2.5rem;
        background:
          radial-gradient(ellipse 80% 60% at 50% 0%, rgba(192,101,43,0.28), transparent 60%),
          radial-gradient(ellipse 60% 50% at 100% 100%, rgba(192,101,43,0.16), transparent 65%),
          linear-gradient(180deg, #14100D 0%, #0D0B0A 55%, #0A0A0A 100%);
      }

      /* ---------- HERO BACKGROUND IMAGE (mobile: mob2 / desktop: des2) ---------- */
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
        opacity: 0.45;
        transform: scale(1.04);
      }

      /* dark overlay + copper glow so text stays readable, bottom blends into marquee */
      .kt-hero-shade {
        position: absolute;
        inset: 0;
        z-index: -2;
        pointer-events: none;
        background:
          radial-gradient(ellipse 80% 60% at 50% 0%, rgba(192,101,43,0.30), transparent 60%),
          linear-gradient(180deg, rgba(10,10,10,0.72) 0%, rgba(10,10,10,0.5) 45%, #0A0A0A 100%);
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
        opacity: 0.45;
        background-image: linear-gradient(to right, rgba(255,255,255,0.045) 1px, transparent 1px);
        background-size: 25% 100%;
        -webkit-mask-image: radial-gradient(ellipse at center, #000 20%, transparent 75%);
        mask-image: radial-gradient(ellipse at center, #000 20%, transparent 75%);
      }

      .kt-hero-text {
        margin: 1rem auto 0;
        max-width: 500px;
        font-family: var(--gk-sans);
        font-weight: 300;
        font-size: 1.05rem;
        line-height: 1.75;
        color: rgba(255,255,255,0.8);
      }

      .kt-hero-btn { margin-top: 1.5rem; height: 44px; padding: 0 23px; font-size: 11px; letter-spacing: .1em; }

      @media (max-width: 640px) {
        .kt-hero { padding: 6.5rem 0 2rem; }
        .kt-hero-lines { background-size: 50% 100%; }
        .kt-hero-text { font-size: .9rem; line-height: 1.55; margin-top: .85rem; padding: 0 8px; max-width: 370px; }
        .kt-hero-btn { width: auto; max-width: 100%; height: 42px; margin-top: 1.25rem; padding: 0 20px; }
      }

      /* chhoti height wali screens (landscape phones) */
      @media (max-height: 640px) {
        .kt-hero { padding-top: 6.5rem; padding-bottom: 2rem; }
      }

      /* ---------- Marquee ---------- */
      .kt-marquee {
        flex: 0 0 auto;
        overflow: hidden;
        border-top: 1px solid rgba(255,255,255,0.1);
        border-bottom: 1px solid rgba(255,255,255,0.1);
        background: #0F0E0D;
        padding: 1.25rem 0;
      }

      .kt-strip-track {
        display: flex;
        width: max-content;
        animation: kt-strip 40s linear infinite;
      }

      .kt-strip-item {
        display: inline-flex;
        align-items: center;
        gap: 28px;
        padding-right: 28px;
        font-family: var(--gk-display);
        font-style: italic;
        font-size: clamp(1.2rem, 1rem + 0.8vw, 1.7rem);
        color: rgba(255,255,255,0.82);
        white-space: nowrap;
      }

      .kt-strip-dot {
        width: 6px; height: 6px; border-radius: 999px;
        background: var(--gk-accent);
      }

      @keyframes kt-strip {
        from { transform: translateX(0); }
        to   { transform: translateX(-50%); }
      }

      /* ---------- Sticky video (100% x 100%) ---------- */
      .kt-video {
        position: sticky;
        top: 0;
        z-index: 0;
        width: 100%;
        height: 100vh;
        height: 100dvh;
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

      /* Desktop / laptop: portrait video ko poori screen pe cover + zoom */
      @media (min-width: 1024px) and (orientation: landscape) {
        .kt-video-el {
          transform: scale(var(--kt-video-zoom-desktop));
          transform-origin: center center;
        }
      }

      @media (min-width: 1920px) {
        :root { --kt-video-zoom-desktop: 1.2; }
      }

      /* products slide over the sticky video */
      .kt-content {
        position: relative;
        z-index: 10;
        background: #0A0A0A;
        border-radius: 28px 28px 0 0;
        box-shadow: 0 -30px 60px rgba(0,0,0,0.6);
      }

      @media (max-width: 640px) {
        .kt-content { border-radius: 20px 20px 0 0; }
      }

      /* ---------- Product card ---------- */
      .kt-product {
        display: flex;
        flex-direction: column;
        height: 100%;
        overflow: hidden;
        border: 1px solid rgba(255,255,255,0.1);
        border-radius: 4px;
        background: #141211;
        transition: border-color .4s ease, transform .4s ease;
      }

      .kt-product:hover { border-color: rgba(192,101,43,0.5); transform: translateY(-3px); }

      .kt-card-title {
        font-family: var(--gk-display);
        font-weight: 600;
        color: #fff;
        line-height: 1.15;
        font-size: 1.15rem;
      }

      @media (min-width: 640px) { .kt-card-title { font-size: 1.4rem; } }

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
        border: 1px solid rgba(255,255,255,0.25);
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
        gap: 8px;
        padding: 12px 10px;
        border-radius: 999px;
        border: 1px solid var(--gk-accent);
        background: var(--gk-accent);
        font-family: var(--gk-sans);
        font-size: 11px;
        font-weight: 500;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        color: #fff;
        white-space: nowrap;
        transition: background-color .3s ease, border-color .3s ease, transform .3s ease;
      }

      .kt-inquiry:hover { background: #D2743A; border-color: #D2743A; }
      .kt-inquiry:active { transform: scale(0.98); }

      @media (min-width: 640px) {
        .kt-inquiry { font-size: 12px; padding: 13px 14px; }
      }

      /* ---------- PAGINATION (Wardrobe style) ---------- */
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
        border: 1px solid rgba(255,255,255,.16);
        border-radius: 999px;
        background: rgba(255,255,255,.025);
        padding: 0 13px;
        color: rgba(255,255,255,.7);
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

      .kt-page-arrow:disabled {
        cursor: not-allowed;
        opacity: .3;
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

      /* ---------- Preview ---------- */
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
        background: #0F0E0D;
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

      @media (prefers-reduced-motion: reduce) {
        .kt-strip-track { animation: none; }
      }
    `}</style>
  );

  /* =========================================================
    MAIN PAGE
  ========================================================= */
  export default function Kitchen() {
    const [previewProduct, setPreviewProduct] = useState(null);
    const [inquiryProduct, setInquiryProduct] = useState(null);
    const [products, setProducts] = useState(localProducts);

    useEffect(() => {
      let cancelled = false;

      async function loadProducts() {
        const { data, error } = await supabase
          .from("kitchen_products")
          .select("id, title, description, image_url, delivery_text, status, sort_order")
          .order("sort_order", { ascending: true });

        if (cancelled) return;

        if (error) {
          console.error("Kitchen products could not be loaded from Supabase:", error);
          setProducts(localProducts);
          return;
        }

        // Keep local designs as a fallback until the first database import.
        if (!data || data.length === 0) {
          setProducts(localProducts);
          return;
        }

        const activeProducts = data.filter((item) => item.status === "active");
        setProducts(activeProducts.map((item, index) => ({
          id: item.id,
          designNumber: Number(item.sort_order) || index + 1,
          title: item.title,
          description: item.description || "",
          image: item.image_url || getImage(`kitchen${index + 1}.webp`),
          deliveryText: item.delivery_text || DELIVERY_TEXT,
        })));
      }

      loadProducts();
      return () => { cancelled = true; };
    }, []);

    const closePreview = useCallback(() => setPreviewProduct(null), []);
    const closeInquiry = useCallback(() => setInquiryProduct(null), []);

    const scrollToProducts = () => {
      document.getElementById("kitchen-products")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    };

    return (
      <main className="bg-[#0A0A0A] text-white">
        <Styles />

        <FirstScreen onExplore={scrollToProducts} />
        <VideoSection />

        <div className="kt-content">
          <Products products={products} onPreview={setPreviewProduct} onInquiry={setInquiryProduct} />
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
      </main>
    );
  }