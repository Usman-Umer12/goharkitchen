// Bed.jsx
// Install: npm i lucide-react
// Assets: ../assets/bed.mp4, ../assets/bed1.webp ...
// Hero background: mobile = ../assets/mob1.webp (ya res1.webp), desktop = ../assets/des1.webp

import { useCallback, useEffect, useRef, useState } from "react";
import {
  ArrowDown, ArrowRight, Crop, MessageCircle, Truck, X,
} from "lucide-react";
import bedVideo from "../assets/bed.mp4";
import { supabase } from "../lib/supabase";

const WHATSAPP_NUMBER = "923007023202";
const BRAND = "Gohar";
const PAGE_STEP = 12;
const DELIVERY_TEXT = "Delivery All Over Pakistan";

const localAssets = import.meta.glob("../assets/*.webp", {
  eager: true,
  query: "?url",
  import: "default",
});

const getImage = (filename) => {
  const key = Object.keys(localAssets).find((item) => item.endsWith(`/${filename}`));
  return key ? localAssets[key] : `/assets/${filename}`;
};

/* pehla naam jo assets mein mil jaye wahi use hoga (naam galat hone pe build error nahi aayega) */
const findAsset = (...names) => {
  for (const name of names) {
    const key = Object.keys(localAssets).find((item) => item.endsWith(`/${name}`));
    if (key) return localAssets[key];
  }
  return "";
};

/* HERO BACKGROUND: mobile -> mob1 (ya res1), desktop -> des1 */
const heroMobile = findAsset("mob1.webp", "res1.webp");
const heroDesktop = findAsset("des1.webp");

const marqueeWords = [
  "Bespoke Beds", "Made To Measure", "Premium Finishes",
  "Quality Upholstery", "Custom Designs", "Neat Installation",
];

const pad = (number) => String(number).padStart(2, "0");

function openWhatsApp(text) {
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
  const win = window.open(url, "_blank", "noopener,noreferrer");
  if (!win) window.location.href = url;
}

const useReveal = () => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisible(true);
        observer.disconnect();
      }
    }, { threshold: 0.08 });

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
  <div className={`mb-4 flex items-center gap-3 sm:mb-5 ${
    align === "center" ? "justify-center" : ""
  } ${className}`}>
    <span className="h-px w-8 bg-[#C0652B] sm:w-10" />
    <span className="gk-eyebrow">{children}</span>
    {align === "center" && <span className="h-px w-8 bg-[#C0652B] sm:w-10" />}
  </div>
);

const FirstScreen = ({ onExplore }) => {
  const items = [...marqueeWords, ...marqueeWords, ...marqueeWords, ...marqueeWords];

  return (
    <section className="kt-first">
      <header className="kt-hero">
        {/* BACKGROUND IMAGE (responsive) */}
        <picture>
          {heroDesktop && <source media="(min-width: 768px)" srcSet={heroDesktop} />}
          <img
            src={heroMobile || heroDesktop}
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
          <Eyebrow>Bespoke Beds</Eyebrow>
          <h1 className="gk-hero-title">
            Beds That Feel<br /><em>Made For You</em>
          </h1>
          <p className="kt-hero-text">
            Upholstered and solid wood beds, built to measure with premium
            materials, quality comfort and refined finishing for every bedroom.
          </p>
          <button type="button" onClick={onExplore} className="gk-btn-solid kt-hero-btn group">
            Explore Collection
            <ArrowDown size={17} className="transition-transform duration-300 group-hover:translate-y-0.5" />
          </button>
        </div>
      </header>

      <div className="kt-marquee">
        <div className="kt-strip-track">
          {items.map((word, index) => (
            <span key={`${word}-${index}`} className="kt-strip-item">
              <span className="kt-strip-dot" />{word}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

const VideoSection = () => {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = true;
    const playback = video.play();
    if (playback?.catch) playback.catch(() => {});
  }, []);

  return (
    <section className="kt-video">
      <video
        ref={videoRef}
        className="kt-video-el"
        src={bedVideo}
        poster={getImage("bed1.webp")}
        autoPlay muted loop playsInline preload="auto"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A]/45 via-transparent to-[#0A0A0A]/25" />
    </section>
  );
};

function InquiryModal({ product, onClose }) {
  const [form, setForm] = useState({ name: "", phone: "", city: "" });

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose]);

  const handleChange = (event) => {
    setForm((previous) => ({ ...previous, [event.target.name]: event.target.value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const message = `
Hello ${BRAND}, I would like to inquire about a bed.

*Product:* ${product.title} (Design ${pad(product.displayNumber || 1)})
${Number(product.price) > 0 ? `*Price:* PKR ${Number(product.price).toLocaleString("en-PK")}` : ""}
*Name:* ${form.name}
*Phone:* ${form.phone}
*City:* ${form.city}

Please share more details and available options.
    `.trim();

    openWhatsApp(message);
    setForm({ name: "", phone: "", city: "" });
    onClose();
  };

  const inputClass = "w-full rounded-lg border border-white/15 bg-white/[0.04] px-4 py-3.5 font-sans text-sm text-white outline-none transition placeholder:text-white/35 focus:border-[#C0652B] focus:ring-2 focus:ring-[#C0652B]/20";
  const labelClass = "mb-2 block font-sans text-[11px] font-medium uppercase tracking-[0.16em] text-white/60";

  return (
    <div
      className="fixed inset-0 z-[130] flex items-center justify-center bg-black/80 px-4 py-6 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div role="dialog" aria-modal="true" className="relative max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-md border border-white/10 bg-[#0F0E0D] shadow-[0_30px_80px_rgba(0,0,0,0.6)]">
        <div className="relative overflow-hidden border-b border-white/10 px-6 py-7 sm:px-8">
          <div className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-[#C0652B] opacity-[0.12] blur-3xl" />
          <button type="button" onClick={onClose} aria-label="Close" className="absolute right-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white/80 transition hover:bg-white/10 hover:text-white">
            <X size={17} />
          </button>
          <div className="relative z-10 pr-10">
            <Eyebrow align="left">Product Inquiry</Eyebrow>
            <h2 className="gk-h3 !text-[1.9rem]">{product.title}</h2>
            {Number(product.price) > 0 && (
              <p className="mt-2 font-sans text-base font-semibold text-[#E08A4F]">
                PKR {Number(product.price).toLocaleString("en-PK")}
              </p>
            )}
            <p className="gk-body mt-2 !text-[13.5px]">
              Share your details and we will continue the conversation on WhatsApp.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-6 sm:px-8 sm:py-8">
          <div className="space-y-5">
            <div>
              <label htmlFor="iq-name" className={labelClass}>Full Name</label>
              <input id="iq-name" name="name" required value={form.name} onChange={handleChange} placeholder="Enter your full name" className={inputClass} />
            </div>
            <div>
              <label htmlFor="iq-phone" className={labelClass}>Phone Number</label>
              <input id="iq-phone" name="phone" type="tel" required value={form.phone} onChange={handleChange} placeholder="03XX XXXXXXX" className={inputClass} />
            </div>
            <div>
              <label htmlFor="iq-city" className={labelClass}>City</label>
              <input id="iq-city" name="city" required value={form.city} onChange={handleChange} placeholder="Enter your city" className={inputClass} />
            </div>
          </div>

          <button type="submit" className="gk-btn-solid group mt-7 !flex w-full">
            <MessageCircle size={17} /> Send Inquiry
            <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1" />
          </button>
          <p className="mt-3 text-center font-sans text-[11px] leading-5 text-white/40">
            Your inquiry will be sent directly to our WhatsApp.
          </p>
        </form>
      </div>
    </div>
  );
}

const Preview = ({ product, onClose, onInquiry }) => {
  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose]);

  return (
    <div className="kt-preview fixed inset-0 z-[110] flex flex-col bg-[#070707] lg:flex-row" onClick={onClose} role="dialog" aria-modal="true">
      <button type="button" onClick={onClose} aria-label="Close" className="kt-ctrl absolute right-3 top-3 z-20 !h-11 !w-11 sm:right-6 sm:top-6">
        <X size={20} />
      </button>

      <div className="flex min-h-0 flex-1 items-center justify-center overflow-hidden p-4 pt-16 sm:p-8 sm:pt-20 lg:p-12">
        <img src={product.image} alt={product.title} onClick={(event) => event.stopPropagation()} className="kt-lb-img max-h-full max-w-full rounded-sm object-contain" />
      </div>

      <aside onClick={(event) => event.stopPropagation()} className="kt-preview-info">
        <Eyebrow align="left">Design {pad(product.displayNumber || 1)}</Eyebrow>
        <h3 className="gk-h3 !text-[1.7rem] sm:!text-[2rem] lg:!text-[2.3rem]">{product.title}</h3>
        <div className="my-4 h-px w-12 bg-[#C0652B] sm:my-5" />
        <p className="gk-body !text-[14.5px] sm:!text-[15px]">{product.description}</p>

        {Number(product.price) > 0 && (
          <p className="mt-4 font-sans text-lg font-semibold text-[#E08A4F] sm:text-xl">
            PKR {Number(product.price).toLocaleString("en-PK")}
          </p>
        )}

        <p className="mt-4 flex items-center gap-2 font-sans text-xs font-medium tracking-wide text-white/60 sm:text-[13px]">
          <Truck size={15} className="shrink-0 text-[#E08A4F]" />
          {product.deliveryText || DELIVERY_TEXT}
        </p>

        <button type="button" onClick={() => onInquiry(product)} className="gk-btn-solid mt-6 w-full sm:mt-7">
          <MessageCircle size={17} /> WhatsApp Inquiry
        </button>
      </aside>
    </div>
  );
};

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
        <button type="button" onClick={() => onPreview(product)} aria-label={`Preview ${product.title}`} className="kt-crop">
          <Crop size={16} strokeWidth={1.8} />
        </button>
      </div>

      <div className="flex flex-1 flex-col p-3 sm:p-5">
        <h3 className="kt-card-title line-clamp-1">{product.title}</h3>
        <p className="mt-2 line-clamp-2 min-h-[2.5rem] font-sans text-xs font-light leading-5 text-white/60 sm:text-sm">
          {product.description}
        </p>

        {Number(product.price) > 0 && (
          <p className="mt-3 font-sans text-sm font-semibold text-[#E08A4F] sm:text-base">
            PKR {Number(product.price).toLocaleString("en-PK")}
          </p>
        )}

        <p className="mt-3 flex items-center gap-2 font-sans text-[11px] font-medium tracking-wide text-white/55 sm:text-xs">
          <Truck size={14} className="shrink-0 text-[#E08A4F]" />
          {product.deliveryText || DELIVERY_TEXT}
        </p>

        <button type="button" onClick={() => onInquiry(product)} className="kt-inquiry mt-auto">
          <MessageCircle className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" />
          <span className="truncate">WhatsApp Inquiry</span>
        </button>
      </div>
    </article>
  </Reveal>
);

const Products = ({ products, loading, onPreview, onInquiry }) => {
  const [visibleCount, setVisibleCount] = useState(PAGE_STEP);

  useEffect(() => {
    setVisibleCount(PAGE_STEP);
  }, [products.length]);

  const shown = products.slice(0, visibleCount);
  const hasMore = visibleCount < products.length;

  return (
    <section id="bed-products" className="relative py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-[1320px] px-4 sm:px-8 lg:px-12">
        <Reveal>
          <div className="mb-10 text-center sm:mb-14">
            <Eyebrow>Our Collection</Eyebrow>
            <h2 className="gk-h2">Beds Designed<br /><em>Around Your Comfort</em></h2>
          </div>
        </Reveal>

        {loading ? (
          <p className="py-16 text-center font-sans text-sm text-white/60">Loading bed collection...</p>
        ) : products.length === 0 ? (
          <p className="py-16 text-center font-sans text-sm text-white/60">No bed designs are available right now. Please check back soon.</p>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
              {shown.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} onPreview={onPreview} onInquiry={onInquiry} />
              ))}
            </div>

            {hasMore && (
              <div className="mt-12 text-center">
                <button type="button" onClick={() => setVisibleCount((count) => Math.min(count + PAGE_STEP, products.length))} className="gk-btn-outline group">
                  Load More
                  <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

const Styles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;1,500;1,600&family=Jost:wght@300;400;500;600&display=swap');

    :root {
      --gk-display: 'Cormorant Garamond', Georgia, serif;
      --gk-sans: 'Jost', system-ui, sans-serif;
      --gk-accent: #C0652B;
      --gk-accent-soft: #E08A4F;

      /* Sticky video controls (desktop ke liye adjust karo) */
      --kt-video-pos-y: 35%;          /* 0% = upar, 50% = beech, 100% = neeche */
      --kt-video-zoom-desktop: 1.12;  /* zoom zyada/kam karna ho to yahan badlo */
    }

    .gk-eyebrow { font-family:var(--gk-sans);font-size:11px;font-weight:500;letter-spacing:.26em;text-transform:uppercase;color:var(--gk-accent-soft); }
    .gk-hero-title { font-family:var(--gk-display);font-weight:500;color:#fff;line-height:1.04;letter-spacing:-.02em;font-size:clamp(2.7rem,1rem + 7.4vw,5.8rem); }
    .gk-hero-title em,.gk-h2 em { font-style:italic;color:var(--gk-accent-soft); }
    .gk-h2 { font-family:var(--gk-display);font-weight:500;color:#fff;line-height:1.08;letter-spacing:-.015em;font-size:clamp(2.1rem,1.4rem + 2.8vw,3.6rem); }
    .gk-h3 { font-family:var(--gk-display);font-weight:600;color:#fff;line-height:1.1;font-size:clamp(1.6rem,1.3rem + .9vw,2rem); }
    .gk-body { font-family:var(--gk-sans);font-weight:300;color:rgba(255,255,255,.7);line-height:1.8;font-size:15px; }
    @media(min-width:1024px){.gk-body{font-size:16px}}
    @media(max-width:640px){.gk-eyebrow{font-size:11.5px;letter-spacing:.22em}}

    .gk-btn-outline,.gk-btn-solid { display:inline-flex;align-items:center;justify-content:center;gap:8px;height:50px;padding:0 30px;border-radius:999px;font-family:var(--gk-sans);font-size:12px;font-weight:500;letter-spacing:.16em;text-transform:uppercase;color:#fff;white-space:nowrap;transition:background-color .3s,color .3s,border-color .3s,transform .3s; }
    .gk-btn-outline{border:1px solid rgba(255,255,255,.35)}
    .gk-btn-outline:hover{background:#fff;color:#0A0A0A;border-color:#fff}
    .gk-btn-solid{background:var(--gk-accent)}
    .gk-btn-solid:hover{background:#D2743A}

    .kt-first{display:flex;flex-direction:column;min-height:100vh;min-height:100dvh;background:#0A0A0A}
    .kt-hero{position:relative;isolation:isolate;flex:1 1 auto;display:flex;align-items:center;justify-content:center;overflow:hidden;padding:8.5rem 0 3.5rem;background:radial-gradient(ellipse 80% 60% at 50% 0%,rgba(192,101,43,.28),transparent 60%),radial-gradient(ellipse 60% 50% at 100% 100%,rgba(192,101,43,.16),transparent 65%),linear-gradient(180deg,#14100D 0%,#0D0B0A 55%,#0A0A0A 100%)}

    /* ---------- HERO BACKGROUND IMAGE (mobile: mob1 / desktop: des1) ---------- */
    .kt-hero picture{position:absolute;inset:0;z-index:-3;display:block}
    .kt-hero-img{width:100%;height:100%;object-fit:cover;object-position:center;opacity:.45;transform:scale(1.04)}
    /* dark overlay + copper glow so text stays readable, bottom blends into marquee */
    .kt-hero-shade{position:absolute;inset:0;z-index:-2;pointer-events:none;background:radial-gradient(ellipse 80% 60% at 50% 0%,rgba(192,101,43,.30),transparent 60%),linear-gradient(180deg,rgba(10,10,10,.72) 0%,rgba(10,10,10,.5) 45%,#0A0A0A 100%)}

    .kt-hero-glow{position:absolute;z-index:-1;border-radius:999px;filter:blur(90px);background:var(--gk-accent);pointer-events:none}
    .kt-hero-glow-a{left:-160px;top:25%;width:420px;height:420px;opacity:.12}
    .kt-hero-glow-b{right:-180px;bottom:5%;width:460px;height:460px;opacity:.09}
    .kt-hero-lines{position:absolute;inset:0;z-index:-1;pointer-events:none;opacity:.45;background-image:linear-gradient(to right,rgba(255,255,255,.045) 1px,transparent 1px);background-size:25% 100%;-webkit-mask-image:radial-gradient(ellipse at center,#000 20%,transparent 75%);mask-image:radial-gradient(ellipse at center,#000 20%,transparent 75%)}
    .kt-hero-text{margin:1.5rem auto 0;max-width:580px;font-family:var(--gk-sans);font-weight:300;font-size:1.05rem;line-height:1.75;color:rgba(255,255,255,.8)}
    .kt-hero-btn{margin-top:2.25rem;height:56px;padding:0 38px;font-size:12.5px}
    @media(max-width:640px){.kt-hero{padding:7.5rem 0 2.5rem}.kt-hero-lines{background-size:50% 100%}.kt-hero-text{font-size:1.02rem;margin-top:1.25rem;padding:0 2px}.kt-hero-btn{width:100%;max-width:340px;height:58px;margin-top:2rem}}
    @media(max-height:640px){.kt-hero{padding-top:6.5rem;padding-bottom:2rem}}

    .kt-marquee{flex:0 0 auto;overflow:hidden;border-top:1px solid rgba(255,255,255,.1);border-bottom:1px solid rgba(255,255,255,.1);background:#0F0E0D;padding:1.25rem 0}
    .kt-strip-track{display:flex;width:max-content;animation:kt-strip 40s linear infinite}
    .kt-strip-item{display:inline-flex;align-items:center;gap:28px;padding-right:28px;font-family:var(--gk-display);font-style:italic;font-size:clamp(1.2rem,1rem + .8vw,1.7rem);color:rgba(255,255,255,.82);white-space:nowrap}
    .kt-strip-dot{width:6px;height:6px;border-radius:999px;background:var(--gk-accent)}
    @keyframes kt-strip{from{transform:translateX(0)}to{transform:translateX(-50%)}}

    .kt-video{position:sticky;top:0;z-index:0;width:100%;height:100vh;height:100dvh;overflow:hidden;background:#0A0A0A}
    .kt-video-el{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:center var(--kt-video-pos-y)}

    /* Desktop / laptop: portrait video ko poori screen pe cover + zoom */
    @media(min-width:1024px) and (orientation:landscape){
      .kt-video-el{transform:scale(var(--kt-video-zoom-desktop));transform-origin:center center}
    }
    @media(min-width:1920px){:root{--kt-video-zoom-desktop:1.2}}

    .kt-content{position:relative;z-index:10;background:#0A0A0A;border-radius:28px 28px 0 0;box-shadow:0 -30px 60px rgba(0,0,0,.6)}
    @media(max-width:640px){.kt-content{border-radius:20px 20px 0 0}}

    .kt-product{display:flex;flex-direction:column;height:100%;overflow:hidden;border:1px solid rgba(255,255,255,.1);border-radius:4px;background:#141211;transition:border-color .4s,transform .4s}
    .kt-product:hover{border-color:rgba(192,101,43,.5);transform:translateY(-3px)}
    .kt-card-title{font-family:var(--gk-display);font-weight:600;color:#fff;line-height:1.15;font-size:1.15rem}
    @media(min-width:640px){.kt-card-title{font-size:1.4rem}}
    .kt-crop{position:absolute;top:10px;left:10px;z-index:2;display:flex;align-items:center;justify-content:center;width:36px;height:36px;border-radius:999px;background:rgba(10,10,10,.65);border:1px solid rgba(255,255,255,.25);color:#fff;backdrop-filter:blur(6px);transition:background-color .3s,border-color .3s,transform .3s}
    .kt-crop:hover{background:var(--gk-accent);border-color:var(--gk-accent);transform:scale(1.08)}

    .kt-inquiry{margin-top:1rem;display:flex;width:100%;align-items:center;justify-content:center;gap:8px;padding:12px 10px;border-radius:999px;border:1px solid var(--gk-accent);background:var(--gk-accent);font-family:var(--gk-sans);font-size:11px;font-weight:500;letter-spacing:.12em;text-transform:uppercase;color:#fff;white-space:nowrap;transition:background-color .3s,border-color .3s,transform .3s}
    .kt-inquiry:hover{background:#D2743A;border-color:#D2743A}
    .kt-inquiry:active{transform:scale(.98)}
    @media(min-width:640px){.kt-inquiry{font-size:12px;padding:13px 14px}}

    .kt-ctrl{display:flex;align-items:center;justify-content:center;width:40px;height:40px;border-radius:999px;background:rgba(10,10,10,.7);border:1px solid rgba(255,255,255,.25);color:#fff;backdrop-filter:blur(6px);transition:background-color .3s,color .3s}
    .kt-ctrl:hover{background:#fff;color:#0A0A0A}
    .kt-lb-img{animation:kt-fade .35s ease}
    @keyframes kt-fade{from{opacity:0;transform:scale(.98)}to{opacity:1;transform:scale(1)}}
    .kt-preview-info{flex:0 0 auto;max-height:48vh;overflow-y:auto;padding:1.5rem 1.25rem 1.75rem;background:#0F0E0D;border-top:1px solid rgba(255,255,255,.1)}
    @media(min-width:640px){.kt-preview-info{padding:2rem 2rem 2.25rem}}
    @media(min-width:1024px){.kt-preview-info{width:420px;max-height:none;display:flex;flex-direction:column;justify-content:center;padding:3rem 2.75rem;border-top:0;border-left:1px solid rgba(255,255,255,.1)}}
    @media(prefers-reduced-motion:reduce){.kt-strip-track{animation:none}}
  `}</style>
);

export default function Bed() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [previewProduct, setPreviewProduct] = useState(null);
  const [inquiryProduct, setInquiryProduct] = useState(null);

  const closePreview = useCallback(() => setPreviewProduct(null), []);
  const closeInquiry = useCallback(() => setInquiryProduct(null), []);

  useEffect(() => {
    let cancelled = false;

    const loadProducts = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from("bed_products")
        .select("id,title,description,image_url,price,delivery_text,status,sort_order")
        .eq("status", "active")
        .order("sort_order", { ascending: true });

      if (cancelled) return;

      if (error) {
        console.error("Could not load bed products:", error);
        setProducts([]);
        setLoading(false);
        return;
      }

      setProducts((data || []).map((item, index) => {
        const displayNumber = Number(item.sort_order) || index + 1;

        return {
          id: item.id,
          displayNumber,
          title: item.title || `Bed Design ${displayNumber}`,
          description: item.description || "",
          image: item.image_url || getImage(`bed${displayNumber}.webp`),
          price: item.price == null || item.price === "" ? 0 : Number(item.price),
          deliveryText: item.delivery_text || DELIVERY_TEXT,
        };
      }));

      setLoading(false);
    };

    loadProducts();

    return () => {
      cancelled = true;
    };
  }, []);

  const scrollToProducts = () => {
    document.getElementById("bed-products")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const openInquiryFromPreview = (product) => {
    setPreviewProduct(null);
    setInquiryProduct(product);
  };

  return (
    <main className="bg-[#0A0A0A] text-white">
      <Styles />
      <FirstScreen onExplore={scrollToProducts} />
      <VideoSection />

      <div className="kt-content">
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
        <InquiryModal product={inquiryProduct} onClose={closeInquiry} />
      )}
    </main>
  );
}