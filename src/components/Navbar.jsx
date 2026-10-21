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
          <ul className="hidden items-center gap-0.5 xl:flex">
            {LINKS.map((item) => (
              <li key={item.path}>
                <a
                  href={item.path}
                  className={`gk-sans group relative whitespace-nowrap px-3 py-2 text-[12px] font-medium uppercase tracking-[0.1em] transition-colors duration-300 ${
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
              <ul className="grid grid-cols-1 sm:grid-cols-2 sm:gap-x-12">
                {LINKS.map((item, index) => (
                  <li
                    key={item.path}
                    className="border-b border-white/10"
                  >
                    <a
                      href={item.path}
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-4 py-4"
                    >
                      <span
                        className="gk-sans w-7 shrink-0 text-[11px] font-medium tracking-[0.2em]"
                        style={{ color: ACCENT }}
                      >
                        {String(index + 1).padStart(2, "0")}
                      </span>

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
                ))}
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
      `}</style>
    </>
  );
}