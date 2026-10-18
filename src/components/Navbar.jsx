import { useEffect, useState } from "react";

const ACCENT = "#C0652B";
const PHONE_DISPLAY = "+923007023202";
const PHONE_LINK = "+923007023202";

const LINKS = [
  { label: "Home", path: "/" },
  { label: "Kitchen", path: "/kitchen" },
  { label: "Wardrobe", path: "/wordrobe" },
  { label: "Media Walls", path: "/media-walls" },
  { label: "Bedroom Walls", path: "/bedroom-walls" },
  { label: "About Us", path: "/about" },
];

const EASE = "cubic-bezier(0.76, 0, 0.24, 1)";
const EASE_OUT = "cubic-bezier(0.22, 1, 0.36, 1)";

/* =========================================================
   LOGO  (copper + white wordmark)
========================================================= */
const Logo = () => (
  <a
    href="/"
    aria-label="Gohar Kitchen Interior - Home"
    className="relative z-10 flex shrink-0 select-none flex-col leading-none"
  >
    <span className="gk-sans text-[21px] font-semibold tracking-[0.03em] sm:text-[25px] xl:text-[28px]">
      <span style={{ color: ACCENT }}>GOHAR</span>{" "}
      <span className="text-white">KITCHEN</span>
    </span>

    <span className="mt-1.5 flex items-center gap-2">
      <span
        className="h-px flex-1"
        style={{ backgroundColor: `${ACCENT}b3` }}
      />
      <span className="gk-sans text-[7.5px] font-medium uppercase tracking-[0.55em] text-white/75 sm:text-[8.5px]">
        Interior
      </span>
      <span
        className="h-px flex-1"
        style={{ backgroundColor: `${ACCENT}b3` }}
      />
    </span>
  </a>
);

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const currentPath =
    typeof window !== "undefined"
      ? window.location.pathname.replace(/\/$/, "") || "/"
      : "/";

  /* ---------- scroll state (ignored while menu is open) ---------- */
  useEffect(() => {
    const onScroll = () => {
      if (document.body.style.position === "fixed") return;
      setScrolled(window.scrollY > 30);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ---------- lock page scroll while the menu is open ---------- */
  useEffect(() => {
    if (!open) return;

    const body = document.body;
    const scrollY = window.scrollY;

    const prev = {
      position: body.style.position,
      top: body.style.top,
      left: body.style.left,
      right: body.style.right,
      width: body.style.width,
      overflow: body.style.overflow,
    };

    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.left = "0";
    body.style.right = "0";
    body.style.width = "100%";
    body.style.overflow = "hidden";

    return () => {
      body.style.position = prev.position;
      body.style.top = prev.top;
      body.style.left = prev.left;
      body.style.right = prev.right;
      body.style.width = prev.width;
      body.style.overflow = prev.overflow;
      window.scrollTo(0, scrollY);
    };
  }, [open]);

  useEffect(() => {
    const onKey = (event) => {
      if (event.key === "Escape") setOpen(false);
    };

    const onResize = () => {
      if (window.innerWidth >= 1280) setOpen(false);
    };

    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  const isActive = (path) => currentPath === path;
  const compact = scrolled && !open;

  /* Header background (fully opaque so nothing from the page shows through):
     - Mobile / tablet: solid dark when scrolled or menu open
     - Desktop top of page: transparent gradient over the hero
     - Desktop after scroll: solid dark */
  const headerBg =
    open || scrolled
      ? "border-white/10 bg-[#0A0A0A]"
      : "border-transparent bg-transparent xl:border-transparent xl:bg-transparent xl:bg-gradient-to-b xl:from-black/70 xl:via-black/30 xl:to-transparent";

  const listBase = 520;

  /* circle reveal: starts exactly from the hamburger button */
  const CLOSED_CLIP = "circle(0px at var(--btn-x) var(--btn-y))";
  const OPEN_CLIP = "circle(150vmax at var(--btn-x) var(--btn-y))";

  return (
    <>
      {/* =====================================================
          NAVBAR  (fixed, always above the page)
      ====================================================== */}
      <header
        className={`fixed inset-x-0 top-0 z-[100] w-full border-b transition-colors duration-500 ${headerBg}`}
      >
        <nav
          className={`mx-auto flex max-w-[90rem] items-center justify-between px-4 transition-[height] duration-500 sm:px-8 ${
            compact ? "h-[68px] sm:h-[76px]" : "h-[76px] sm:h-[92px]"
          }`}
        >
          {/* LOGO */}
          <Logo />

          {/* DESKTOP LINKS */}
          <ul className="hidden items-center gap-0.5 xl:flex">
            {LINKS.map((item) => (
              <li key={item.path}>
                <a
                  href={item.path}
                  className={`gk-sans group relative whitespace-nowrap px-3 py-2 text-[13px] font-medium uppercase tracking-[0.13em] transition-colors duration-300 ${
                    isActive(item.path)
                      ? "text-white"
                      : "text-neutral-300 hover:text-white"
                  }`}
                >
                  {item.label}
                  <span
                    className={`absolute inset-x-3 -bottom-0.5 h-[2px] origin-left rounded-full transition-transform duration-300 ${
                      isActive(item.path)
                        ? "scale-x-100"
                        : "scale-x-0 group-hover:scale-x-100"
                    }`}
                    style={{ backgroundColor: ACCENT }}
                  />
                </a>
              </li>
            ))}
          </ul>

          {/* DESKTOP CTA */}
          <a
            href="/contact"
            className="gk-sans hidden whitespace-nowrap rounded-full px-6 py-2.5 text-[12px] font-semibold uppercase tracking-[0.16em] text-white transition-all duration-300 hover:-translate-y-0.5 hover:brightness-110 xl:inline-block"
            style={{ backgroundColor: ACCENT }}
          >
            Get Quote
          </a>

          {/* MOBILE HAMBURGER */}
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className={`relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border bg-white/5 transition-all duration-500 hover:border-[#C0652B] sm:h-12 sm:w-12 xl:hidden ${
              open ? "rotate-90 border-[#C0652B]" : "rotate-0 border-white/20"
            }`}
          >
            <span className="relative block h-4 w-5">
              <span
                className={`absolute left-0 block h-[2px] w-full rounded bg-white transition-all duration-300 ${
                  open ? "top-[7px] rotate-45" : "top-0"
                }`}
              />
              <span
                className={`absolute left-0 top-[7px] block h-[2px] rounded transition-all duration-300 ${
                  open ? "w-0 opacity-0" : "w-3/5 opacity-100"
                }`}
                style={{ backgroundColor: ACCENT }}
              />
              <span
                className={`absolute left-0 block h-[2px] w-full rounded bg-white transition-all duration-300 ${
                  open ? "top-[7px] -rotate-45" : "top-[14px]"
                }`}
              />
            </span>
          </button>
        </nav>
      </header>

      {/* =====================================================
          FULL-SCREEN MENU  (full width + full height)
          Circle reveal that grows from the hamburger button:
          1) copper layer sweeps first
          2) dark panel follows right behind it
          Bar (logo + close) stays fixed, ONLY the links scroll,
          CTA stays pinned at the bottom.
      ====================================================== */}
      <div
        className="gk-menu-wrap fixed inset-0 z-[90] h-[100dvh] w-screen xl:hidden"
        style={{
          visibility: open ? "visible" : "hidden",
          pointerEvents: open ? "auto" : "none",
          transition: `visibility 0s linear ${open ? "0s" : "1.15s"}`,
        }}
        aria-hidden={!open}
      >
        {/* LAYER 1 - COPPER SWEEP */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(135deg, ${ACCENT}, #8c3d1b)`,
            clipPath: open ? OPEN_CLIP : CLOSED_CLIP,
            transition: `clip-path 0.95s ${EASE}`,
            transitionDelay: open ? "0ms" : "140ms",
          }}
        />

        {/* LAYER 2 - DARK PANEL */}
        <div
          className="gk-menu absolute inset-0 flex flex-col"
          style={{
            clipPath: open ? OPEN_CLIP : CLOSED_CLIP,
            transition: `clip-path 0.95s ${EASE}`,
            transitionDelay: open ? "140ms" : "0ms",
          }}
        >
          {/* decorative vertical lines */}
          <div className="gk-menu-lines pointer-events-none absolute inset-0" />

          {/* spacer = navbar bar height */}
          <div className="h-[var(--bar-h)] shrink-0" />

          {/* SCROLLABLE NAV ITEMS (only this area scrolls) */}
          <div
            className="gk-scroll relative min-h-0 flex-1 overflow-y-auto overflow-x-hidden overscroll-contain"
            style={{
              WebkitMaskImage:
                "linear-gradient(to bottom, transparent 0, #000 18px, #000 calc(100% - 26px), transparent 100%)",
              maskImage:
                "linear-gradient(to bottom, transparent 0, #000 18px, #000 calc(100% - 26px), transparent 100%)",
            }}
          >
            <div className="mx-auto max-w-3xl px-6 pb-8 pt-6 sm:px-10">
              {/* LABEL */}
              <div
                className="mb-3 flex items-center gap-3"
                style={{
                  opacity: open ? 1 : 0,
                  transform: open ? "translateY(0)" : "translateY(14px)",
                  transition: `all 0.7s ${EASE_OUT}`,
                  transitionDelay: open ? "460ms" : "0ms",
                }}
              >
                <span
                  className="h-px w-8"
                  style={{ backgroundColor: ACCENT }}
                />
                <span className="gk-sans text-[10px] font-medium uppercase tracking-[0.4em] text-neutral-400">
                  Navigation
                </span>
              </div>

              {/* LINKS */}
              <ul className="grid grid-cols-1 sm:grid-cols-2 sm:gap-x-12">
                {LINKS.map((item, index) => {
                  const delay = open ? listBase + index * 55 : 0;

                  return (
                    <li key={item.path} className="relative overflow-hidden">
                      <a
                        href={item.path}
                        onClick={() => setOpen(false)}
                        className="group flex items-center gap-4 py-3.5 sm:py-4"
                        style={{
                          transform: open
                            ? "translateY(0) skewY(0deg)"
                            : "translateY(110%) skewY(4deg)",
                          opacity: open ? 1 : 0,
                          transition: `transform 0.9s ${EASE_OUT}, opacity 0.8s ease`,
                          transitionDelay: `${delay}ms`,
                        }}
                      >
                        <span
                          className="gk-sans w-7 shrink-0 text-[11px] font-medium tracking-[0.2em]"
                          style={{ color: ACCENT }}
                        >
                          {String(index + 1).padStart(2, "0")}
                        </span>

                        <span className="flex flex-1 flex-col">
                          <span
                            className={`gk-serif text-[26px] font-semibold leading-tight tracking-[0.01em] transition-all duration-300 group-hover:translate-x-1.5 sm:text-[30px] ${
                              isActive(item.path)
                                ? "text-[#E08A4F]"
                                : "text-white/90 group-hover:text-[#E08A4F]"
                            }`}
                          >
                            {item.label}
                          </span>
                        </span>

                        <svg
                          className="h-4 w-4 shrink-0 -translate-x-2 text-[#E08A4F] opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100"
                          viewBox="0 0 20 20"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.6"
                          aria-hidden="true"
                        >
                          <path d="M5 15L15 5M7 5h8v8" />
                        </svg>
                      </a>

                      {/* animated divider */}
                      <span
                        className="pointer-events-none absolute inset-x-0 bottom-0 h-px origin-left bg-white/10"
                        style={{
                          transform: open ? "scaleX(1)" : "scaleX(0)",
                          transition: `transform 0.9s ${EASE_OUT}`,
                          transitionDelay: `${delay + 140}ms`,
                        }}
                      />
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          {/* PINNED FOOTER (does not scroll) */}
          <div
            className="relative shrink-0 border-t border-white/10 bg-[#0A0A0A] px-6 pb-5 pt-4 sm:px-10"
            style={{
              opacity: open ? 1 : 0,
              transform: open ? "translateY(0)" : "translateY(24px)",
              transition: `all 0.8s ${EASE_OUT}`,
              transitionDelay: open ? `${listBase + 280}ms` : "0ms",
            }}
          >
            <div className="mx-auto max-w-3xl">
              <a
                href="/contact"
                onClick={() => setOpen(false)}
                className="gk-sans block w-full rounded-full py-3.5 text-center text-[13px] font-semibold uppercase tracking-[0.24em] text-white transition-all duration-300 hover:brightness-110"
                style={{
                  background: `linear-gradient(100deg, ${ACCENT}, #8c3d1b)`,
                }}
              >
                Get Quote
              </a>

              <div className="mt-4 flex flex-col items-center justify-between gap-2 sm:flex-row">
                <a
                  href={`tel:${PHONE_LINK}`}
                  className="gk-sans text-[13px] tracking-[0.08em] text-neutral-300 transition-colors hover:text-[#E08A4F]"
                >
                  Call us: {PHONE_DISPLAY}
                </a>

                <p className="gk-sans gk-brandline text-[10px] uppercase tracking-[0.35em] text-neutral-500">
                  Gohar Kitchen · Interior
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================
          FONTS + THEME
      ====================================================== */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Jost:wght@300;400;500;600&display=swap');

        .gk-serif {
          font-family: 'Cormorant Garamond', 'Playfair Display', Georgia, serif;
        }

        .gk-sans {
          font-family: 'Jost', 'Helvetica Neue', Arial, sans-serif;
        }

        /* navbar bar height + hamburger centre (circle reveal origin) */
        .gk-menu-wrap {
          --bar-h: 76px;
          --btn-x: calc(100% - 38px);
          --btn-y: 38px;
        }

        @media (min-width: 640px) {
          .gk-menu-wrap {
            --bar-h: 92px;
            --btn-x: calc(100% - 56px);
            --btn-y: 46px;
          }
        }

        /* Dark menu */
        .gk-menu {
          background:
            radial-gradient(
              120% 60% at 50% 0%,
              #1b1816 0%,
              #121110 55%,
              #0A0A0A 100%
            );
        }

        .gk-menu-lines {
          opacity: 0.5;
          background-image: linear-gradient(
            to right,
            rgba(255, 255, 255, 0.04) 1px,
            transparent 1px
          );
          background-size: 50% 100%;
          -webkit-mask-image: radial-gradient(ellipse at center, #000 20%, transparent 80%);
          mask-image: radial-gradient(ellipse at center, #000 20%, transparent 80%);
        }

        @media (min-width: 640px) {
          .gk-menu-lines { background-size: 25% 100%; }
        }

        /* hide scrollbar for the links list */
        .gk-scroll {
          scrollbar-width: none;
        }

        .gk-scroll::-webkit-scrollbar {
          display: none;
        }

        @media (max-width: 380px) {
          header nav {
            padding-left: 12px;
            padding-right: 12px;
          }

          .gk-menu-wrap {
            --btn-x: calc(100% - 34px);
          }
        }

        @media (max-height: 640px) {
          .gk-menu .gk-serif {
            font-size: 22px;
          }

          .gk-brandline {
            display: none;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          header,
          header *,
          .gk-menu-wrap,
          .gk-menu-wrap * {
            transition-duration: 0.01ms !important;
            transition-delay: 0ms !important;
            animation-duration: 0.01ms !important;
          }
        }
      `}</style>
    </>
  );
}