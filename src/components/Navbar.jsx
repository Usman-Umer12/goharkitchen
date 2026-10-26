import { useEffect, useRef, useState } from "react";

const ACCENT = "#C0652B";
const PHONE_DISPLAY = "+923007023202";
const PHONE_LINK = "+923007023202";

const LINKS = [
  { label: "Home", path: "/" },
  { label: "Kitchen", path: "/kitchen" },
  { label: "Wardrobe", path: "/wordrobe" },
  { label: "Media Walls", path: "/media-walls" },
  { label: "Bedroom Walls", path: "/bedroom-walls" },
];

/* Dropdown ("Explore") ke items */
const DROPDOWN = {
  label: "Explore",
  items: [
    { label: "Accessories", path: "/accessories" },
    { label: "Sheets", path: "/sheets" },
    { label: "Corian", path: "/corian" },
    { label: "Vanities", path: "/vanities" },
    { label: "2D/3D Design", path: "/design-2d-3d" },
    { label: "Our Projects", path: "/projects" },
  ],
};

const ABOUT = { label: "About Us", path: "/about" };

/* Mobile menu ki numbering ke liye ek flat order */
const MOBILE_ORDER = [...LINKS, DROPDOWN, ABOUT];

/* =========================================================
   LOGO  (copper + white wordmark)
========================================================= */
const Logo = () => (
  <a
    href="/"
    aria-label="Gohar Kitchen Interior - Home"
    className="relative z-10 flex shrink-0 select-none flex-col leading-none"
  >
    <span className="gk-sans text-[18px] font-semibold tracking-[0.03em] sm:text-[22px] xl:text-[24px]">
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

/* Chevron icon (dropdown arrow) */
const Chevron = ({ open, className = "" }) => (
  <svg
    viewBox="0 0 12 12"
    aria-hidden="true"
    className={`h-3 w-3 shrink-0 transition-transform duration-300 ${
      open ? "rotate-180" : ""
    } ${className}`}
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M2.5 4.5 6 8l3.5-3.5" />
  </svg>
);

export default function Navbar() {
  const [open, setOpen] = useState(false); // mobile menu
  const [scrolled, setScrolled] = useState(false);
  const [dropOpen, setDropOpen] = useState(false); // desktop dropdown
  const [mobileDropOpen, setMobileDropOpen] = useState(false); // mobile accordion

  const dropRef = useRef(null);
  const closeTimer = useRef(null);

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

  /* ---------- keyboard + resize ---------- */
  useEffect(() => {
    const onKey = (event) => {
      if (event.key === "Escape") {
        setOpen(false);
        setDropOpen(false);
      }
    };

    const onResize = () => {
      if (window.innerWidth >= 1280) {
        setOpen(false);
        setMobileDropOpen(false);
      } else {
        setDropOpen(false);
      }
    };

    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  /* ---------- desktop dropdown: bahar click par band ---------- */
  useEffect(() => {
    if (!dropOpen) return;

    const onPointerDown = (event) => {
      if (dropRef.current && !dropRef.current.contains(event.target)) {
        setDropOpen(false);
      }
    };

    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [dropOpen]);

  /* timer cleanup */
  useEffect(() => () => clearTimeout(closeTimer.current), []);

  /* menu band hone par accordion reset */
  useEffect(() => {
    if (!open) setMobileDropOpen(false);
  }, [open]);

  const isActive = (path) => currentPath === path;
  const dropdownActive = DROPDOWN.items.some((item) => isActive(item.path));
  const compact = scrolled && !open;

  /* Hover (sirf mouse) - chhota delay taake cursor panel tak ja sake */
  const handleEnter = (event) => {
    if (event.pointerType && event.pointerType !== "mouse") return;
    clearTimeout(closeTimer.current);
    setDropOpen(true);
  };

  const handleLeave = (event) => {
    if (event.pointerType && event.pointerType !== "mouse") return;
    clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setDropOpen(false), 140);
  };

  /* Header background (fully opaque so nothing from the page shows through):
     - Mobile / tablet: solid dark when scrolled or menu open
     - Desktop top of page: transparent gradient over the hero
     - Desktop after scroll: solid dark */
  const headerBg =
    open || scrolled
      ? "border-white/10 bg-[#0A0A0A]"
      : "border-transparent bg-transparent xl:border-transparent xl:bg-transparent xl:bg-gradient-to-b xl:from-black/70 xl:via-black/30 xl:to-transparent";

  const desktopLinkClass = (active) =>
    `gk-sans group relative flex items-center gap-1.5 whitespace-nowrap px-2.5 py-2 text-[12px] font-medium uppercase tracking-[0.1em] transition-colors duration-300 2xl:px-3 ${
      active ? "text-white" : "text-neutral-300 hover:text-white"
    }`;

  const underline = (active) => (
    <span
      className={`absolute inset-x-2.5 -bottom-0.5 h-[2px] origin-left rounded-full transition-transform duration-300 2xl:inset-x-3 ${
        active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
      }`}
      style={{ backgroundColor: ACCENT }}
    />
  );

  return (
    <>
      {/* =====================================================
          NAVBAR  (fixed, always above the page)
          Animations sirf desktop (xl) par hain.
      ====================================================== */}
      <header
        className={`fixed inset-x-0 top-0 z-[100] w-full border-b xl:transition-colors xl:duration-500 ${headerBg}`}
      >
        <nav
          className={`mx-auto flex max-w-[90rem] items-center justify-between px-4 sm:px-8 xl:transition-[height] xl:duration-500 ${
            compact ? "h-[68px] sm:h-[76px]" : "h-[76px] sm:h-[92px]"
          }`}
        >
          {/* LOGO */}
          <Logo />

          {/* DESKTOP LINKS */}
          <ul className="hidden items-center gap-0 xl:flex 2xl:gap-0.5">
            {LINKS.map((item) => (
              <li key={item.path}>
                <a href={item.path} className={desktopLinkClass(isActive(item.path))}>
                  {item.label}
                  {underline(isActive(item.path))}
                </a>
              </li>
            ))}

            {/* ---------- DROPDOWN ---------- */}
            <li
              ref={dropRef}
              className="relative"
              onPointerEnter={handleEnter}
              onPointerLeave={handleLeave}
            >
              <button
                type="button"
                onClick={() => setDropOpen((value) => !value)}
                aria-haspopup="true"
                aria-expanded={dropOpen}
                aria-controls="gk-explore-menu"
                className={desktopLinkClass(dropdownActive || dropOpen)}
              >
                {DROPDOWN.label}
                <Chevron open={dropOpen} />
                {underline(dropdownActive || dropOpen)}
              </button>

              {/* panel (pt-3 = hover gap bridge) */}
              <div
                id="gk-explore-menu"
                className={`absolute left-1/2 top-full w-64 -translate-x-1/2 pt-3 transition-all duration-200 ${
                  dropOpen
                    ? "visible translate-y-0 opacity-100"
                    : "invisible -translate-y-1 opacity-0"
                }`}
              >
                <div className="overflow-hidden rounded-xl border border-white/10 bg-[#0A0A0A] shadow-[0_24px_60px_-12px_rgba(0,0,0,0.7)]">
                  <span
                    className="block h-[2px] w-full"
                    style={{
                      background: `linear-gradient(90deg, ${ACCENT}, transparent)`,
                    }}
                  />
                  <ul className="py-2">
                    {DROPDOWN.items.map((item) => (
                      <li key={item.path}>
                        <a
                          href={item.path}
                          tabIndex={dropOpen ? 0 : -1}
                          onClick={() => setDropOpen(false)}
                          className={`gk-sans group/item flex items-center justify-between px-5 py-3 text-[12px] font-medium uppercase tracking-[0.1em] transition-colors duration-200 hover:bg-white/5 ${
                            isActive(item.path)
                              ? "text-[#E08A4F]"
                              : "text-neutral-300 hover:text-white"
                          }`}
                        >
                          <span>{item.label}</span>
                          <span
                            className="h-[2px] w-0 rounded-full transition-all duration-300 group-hover/item:w-4"
                            style={{ backgroundColor: ACCENT }}
                          />
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </li>

            <li>
              <a href={ABOUT.path} className={desktopLinkClass(isActive(ABOUT.path))}>
                {ABOUT.label}
                {underline(isActive(ABOUT.path))}
              </a>
            </li>
          </ul>

          {/* DESKTOP CTA */}
          <a
            href="/contact"
            className="gk-sans hidden whitespace-nowrap rounded-full px-6 py-2.5 text-[11.5px] font-semibold uppercase tracking-[0.14em] text-white transition-all duration-300 hover:-translate-y-0.5 hover:brightness-110 xl:inline-block"
            style={{ backgroundColor: ACCENT }}
          >
            Get Quote
          </a>

          {/* MOBILE HAMBURGER (koi animation nahi) */}
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className={`relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border bg-white/5 sm:h-12 sm:w-12 xl:hidden ${
              open ? "border-[#C0652B]" : "border-white/20"
            }`}
          >
            <span className="relative block h-4 w-5">
              <span
                className={`absolute left-0 block h-[2px] w-full rounded bg-white ${
                  open ? "top-[7px] rotate-45" : "top-0"
                }`}
              />
              <span
                className={`absolute left-0 top-[7px] block h-[2px] rounded ${
                  open ? "w-0 opacity-0" : "w-3/5 opacity-100"
                }`}
                style={{ backgroundColor: ACCENT }}
              />
              <span
                className={`absolute left-0 block h-[2px] w-full rounded bg-white ${
                  open ? "top-[7px] -rotate-45" : "top-[14px]"
                }`}
              />
            </span>
          </button>
        </nav>
      </header>

      {/* =====================================================
          MOBILE / TABLET MENU
          - full width + full height
          - bina animation: click par seedha khulta / band hota hai
          - bar (logo + close) upar fixed, sirf links scroll hote hain,
            Get Quote neeche pinned rehta hai
          - "Explore" accordion ki tarah khulta hai
      ====================================================== */}
      {open && (
        <div
          className="gk-menu-wrap gk-menu fixed inset-0 z-[90] flex h-[100dvh] w-screen flex-col xl:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
        >
          {/* spacer = navbar bar height */}
          <div className="h-[var(--bar-h)] shrink-0" />

          {/* SCROLLABLE NAV ITEMS (only this area scrolls) */}
          <div className="gk-scroll relative min-h-0 flex-1 overflow-y-auto overflow-x-hidden overscroll-contain">
            <div className="mx-auto max-w-3xl px-6 pb-8 pt-4 sm:px-10">
              <ul className="grid grid-cols-1 items-start sm:grid-cols-2 sm:gap-x-12">
                {MOBILE_ORDER.map((item, index) => {
                  const number = (
                    <span
                      className="gk-sans w-7 shrink-0 text-[11px] font-medium tracking-[0.2em]"
                      style={{ color: ACCENT }}
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  );

                  /* ----- accordion item ----- */
                  if (item.items) {
                    return (
                      <li
                        key="dropdown"
                        className="border-b border-white/10"
                      >
                        <button
                          type="button"
                          onClick={() => setMobileDropOpen((value) => !value)}
                          aria-expanded={mobileDropOpen}
                          aria-controls="gk-mobile-explore"
                          className="flex w-full items-center gap-4 py-4 text-left"
                        >
                          {number}
                          <span
                            className={`gk-sans flex-1 text-[17px] font-semibold uppercase leading-tight tracking-[0.06em] sm:text-[19px] ${
                              dropdownActive || mobileDropOpen
                                ? "text-[#E08A4F]"
                                : "text-white/90"
                            }`}
                          >
                            {item.label}
                          </span>
                          <Chevron
                            open={mobileDropOpen}
                            className="h-4 w-4 text-white/70"
                          />
                        </button>

                        {mobileDropOpen && (
                          <ul
                            id="gk-mobile-explore"
                            className="mb-4 ml-[2.6rem] border-l border-white/15 pl-5"
                          >
                            {item.items.map((sub) => (
                              <li key={sub.path}>
                                <a
                                  href={sub.path}
                                  onClick={() => setOpen(false)}
                                  className={`gk-sans block py-3 text-[14px] font-medium uppercase tracking-[0.08em] sm:text-[15px] ${
                                    isActive(sub.path)
                                      ? "text-[#E08A4F]"
                                      : "text-neutral-300"
                                  }`}
                                >
                                  {sub.label}
                                </a>
                              </li>
                            ))}
                          </ul>
                        )}
                      </li>
                    );
                  }

                  /* ----- normal item ----- */
                  return (
                    <li key={item.path} className="border-b border-white/10">
                      <a
                        href={item.path}
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-4 py-4"
                      >
                        {number}
                        <span
                          className={`gk-sans flex-1 text-[17px] font-semibold uppercase leading-tight tracking-[0.06em] sm:text-[19px] ${
                            isActive(item.path)
                              ? "text-[#E08A4F]"
                              : "text-white/90"
                          }`}
                        >
                          {item.label}
                        </span>
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          {/* PINNED FOOTER (does not scroll) */}
          <div className="relative shrink-0 border-t border-white/10 bg-[#0A0A0A] px-6 pb-5 pt-4 sm:px-10">
            <div className="mx-auto max-w-3xl">
              <a
                href="/contact"
                onClick={() => setOpen(false)}
                className="gk-sans block w-full rounded-full py-3.5 text-center text-[12px] font-semibold uppercase tracking-[0.22em] text-white"
                style={{
                  background: `linear-gradient(100deg, ${ACCENT}, #8c3d1b)`,
                }}
              >
                Get Quote
              </a>

              <div className="mt-4 flex flex-col items-center justify-between gap-2 sm:flex-row">
                <a
                  href={`tel:${PHONE_LINK}`}
                  className="gk-sans text-[13px] tracking-[0.06em] text-neutral-300"
                >
                  Call us: {PHONE_DISPLAY}
                </a>

                <p className="gk-sans gk-brandline text-[10px] uppercase tracking-[0.3em] text-neutral-500">
                  Gohar Kitchen · Interior
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================
          FONTS + THEME  (Montserrat = logo jaisa, poori site mein)
      ====================================================== */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap');

        .gk-serif,
        .gk-sans {
          font-family: 'Montserrat', system-ui, -apple-system, 'Segoe UI', sans-serif;
        }

        /* navbar bar height (menu ke upar ka spacer) */
        .gk-menu-wrap {
          --bar-h: 76px;
        }

        @media (min-width: 640px) {
          .gk-menu-wrap {
            --bar-h: 92px;
          }
        }

        /* Dark menu */
        .gk-menu {
          background: #0A0A0A;
        }

        /* hide scrollbar for the links list */
        .gk-scroll {
          scrollbar-width: none;
        }

        .gk-scroll::-webkit-scrollbar {
          display: none;
        }

        /* keyboard focus visible */
        header a:focus-visible,
        header button:focus-visible,
        .gk-menu a:focus-visible,
        .gk-menu button:focus-visible {
          outline: 2px solid ${ACCENT};
          outline-offset: 3px;
          border-radius: 6px;
        }

        @media (max-width: 380px) {
          header nav {
            padding-left: 12px;
            padding-right: 12px;
          }
        }

        @media (max-height: 640px) {
          .gk-brandline {
            display: none;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          header *, .gk-menu * {
            transition: none !important;
          }
        }
      `}</style>
    </>
  );
}