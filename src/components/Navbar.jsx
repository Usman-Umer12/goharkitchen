import { useEffect, useRef, useState } from "react";

const ACCENT = "#C0652B";
const ACCENT_LIGHT = "#E08A4F";
const PHONE_DISPLAY = "+923007023202";
const PHONE_LINK = "+923007023202";

const LINKS = [
  { label: "Home", path: "/" },
  { label: "Kitchen", path: "/kitchen" },
  { label: "Wardrobe", path: "/wordrobe" },
  { label: "Media Walls", path: "/media-walls" },
  { label: "Bedroom Walls", path: "/bedroom-walls" },
];

/* "Explore" dropdown.
   Accessories has its own page; its sub pages open right below it. */
const DROPDOWN = {
  label: "Explore",
  items: [
    {
      label: "Accessories",
      path: "/accessories",
      children: [
        { label: "Wardrobe Accessories", path: "/wardrobe-accessories" },
        { label: "Kitchen Accessories", path: "/kitchen-accessories" },
      ],
    },
    { label: "Sheets", path: "/sheets" },
    { label: "Corian", path: "/corian" },
    { label: "Vanities", path: "/vanities" },
    { label: "2D/3D Design", path: "/design-2d-3d" },
    { label: "Our Projects", path: "/projects" },
  ],
};

const ABOUT = { label: "About Us", path: "/about" };

const DROPDOWN_PATHS = DROPDOWN.items.flatMap((item) =>
  item.children
    ? [item.path, ...item.children.map((child) => child.path)]
    : [item.path]
);

/* Mobile numbering order */
const MOBILE_ORDER = [...LINKS, DROPDOWN, ABOUT];

/* =========================================================
   SMALL UI PIECES
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

/* =========================================================
   NAVBAR
========================================================= */
export default function Navbar() {
  const [open, setOpen] = useState(false); // mobile menu
  const [scrolled, setScrolled] = useState(false);
  const [dropOpen, setDropOpen] = useState(false); // desktop dropdown
  const [subOpen, setSubOpen] = useState(false); // desktop Accessories items
  const [mobileDropOpen, setMobileDropOpen] = useState(false); // mobile accordion
  const [mobileSubOpen, setMobileSubOpen] = useState(false); // mobile Accessories

  const dropRef = useRef(null);
  const triggerRef = useRef(null);
  const closeTimer = useRef(null);
  const subTimer = useRef(null);

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

  /* ---------- lock page scroll while the mobile menu is open ---------- */
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

  /* ---------- resize + Escape (mobile menu) ---------- */
  useEffect(() => {
    const onKey = (event) => {
      if (event.key === "Escape") setOpen(false);
    };

    const onResize = () => {
      if (window.innerWidth >= 1280) {
        setOpen(false);
        setMobileDropOpen(false);
        setMobileSubOpen(false);
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

  /* ---------- desktop dropdown: outside click + Escape ---------- */
  useEffect(() => {
    if (!dropOpen) return;

    const onPointerDown = (event) => {
      if (dropRef.current && !dropRef.current.contains(event.target)) {
        setDropOpen(false);
      }
    };

    const onKey = (event) => {
      if (event.key === "Escape") {
        setDropOpen(false);
        triggerRef.current?.focus();
      }
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKey);

    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [dropOpen]);

  /* Accessories items close together with the dropdown */
  useEffect(() => {
    if (!dropOpen) setSubOpen(false);
  }, [dropOpen]);

  /* timer cleanup */
  useEffect(
    () => () => {
      clearTimeout(closeTimer.current);
      clearTimeout(subTimer.current);
    },
    []
  );

  /* reset mobile accordions when the menu closes */
  useEffect(() => {
    if (!open) {
      setMobileDropOpen(false);
      setMobileSubOpen(false);
    }
  }, [open]);

  const isActive = (path) => currentPath === path;
  const dropdownActive = DROPDOWN_PATHS.some((path) => isActive(path));
  const compact = scrolled && !open;

  /* Hover (mouse only) - dropdown */
  const handleEnter = (event) => {
    if (event.pointerType && event.pointerType !== "mouse") return;
    clearTimeout(closeTimer.current);
    setDropOpen(true);
  };

  const handleLeave = (event) => {
    if (event.pointerType && event.pointerType !== "mouse") return;
    clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setDropOpen(false), 160);
  };

  /* Hover (mouse only) - Accessories items */
  const handleSubEnter = (event) => {
    if (event.pointerType && event.pointerType !== "mouse") return;
    clearTimeout(subTimer.current);
    setSubOpen(true);
  };

  const handleSubLeave = (event) => {
    if (event.pointerType && event.pointerType !== "mouse") return;
    clearTimeout(subTimer.current);
    subTimer.current = setTimeout(() => setSubOpen(false), 160);
  };

  /* close when keyboard focus leaves the dropdown */
  const handleBlur = (event) => {
    if (!dropRef.current?.contains(event.relatedTarget)) {
      setDropOpen(false);
    }
  };

  const handleTriggerKey = (event) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setDropOpen(true);
    }
  };

  const closeAllDesktop = () => {
    setSubOpen(false);
    setDropOpen(false);
  };

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

  /* plain dropdown row: only a soft text + background change on hover */
  const rowClass = (active, extra = "") =>
    `gk-sans block px-5 py-2.5 text-[12px] font-medium uppercase tracking-[0.1em] transition-colors duration-200 hover:bg-white/[0.04] ${
      active ? "text-[#E08A4F]" : "text-neutral-300 hover:text-white"
    } ${extra}`;

  return (
    <>
      {/* =====================================================
          NAVBAR (fixed)
      ====================================================== */}
      <header
        className={`fixed inset-x-0 top-0 z-[100] w-full border-b xl:transition-colors xl:duration-500 ${headerBg}`}
      >
        <nav
          aria-label="Main navigation"
          className={`mx-auto flex max-w-[90rem] items-center justify-between px-4 sm:px-8 xl:transition-[height] xl:duration-500 ${
            compact ? "h-[68px] sm:h-[76px]" : "h-[76px] sm:h-[92px]"
          }`}
        >
          <Logo />

          {/* DESKTOP LINKS */}
          <ul className="hidden items-center gap-0 xl:flex 2xl:gap-0.5">
            {LINKS.map((item) => (
              <li key={item.path}>
                <a
                  href={item.path}
                  aria-current={isActive(item.path) ? "page" : undefined}
                  className={desktopLinkClass(isActive(item.path))}
                >
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
              onBlur={handleBlur}
            >
              <button
                ref={triggerRef}
                type="button"
                onClick={() => setDropOpen((value) => !value)}
                onKeyDown={handleTriggerKey}
                aria-haspopup="true"
                aria-expanded={dropOpen}
                aria-controls="gk-explore-menu"
                className={desktopLinkClass(dropdownActive || dropOpen)}
              >
                {DROPDOWN.label}
                <Chevron open={dropOpen} />
                {underline(dropdownActive || dropOpen)}
              </button>

              {/* panel (pt-3 = invisible hover bridge) */}
              <div
                id="gk-explore-menu"
                className={`absolute left-1/2 top-full w-60 -translate-x-1/2 pt-3 transition-all duration-200 ${
                  dropOpen
                    ? "visible translate-y-0 opacity-100"
                    : "pointer-events-none invisible -translate-y-1 opacity-0"
                }`}
              >
                <div className="overflow-hidden rounded-md border border-white/10 bg-[#0A0A0A] shadow-[0_18px_40px_-12px_rgba(0,0,0,0.7)]">
                  <ul className="py-1.5">
                    {DROPDOWN.items.map((item) => {
                      /* ----- Accessories: link + items open below ----- */
                      if (item.children) {
                        const parentActive =
                          isActive(item.path) ||
                          item.children.some((child) => isActive(child.path));

                        return (
                          <li
                            key={item.path}
                            onPointerEnter={handleSubEnter}
                            onPointerLeave={handleSubLeave}
                          >
                            <div className="flex items-stretch transition-colors duration-200 hover:bg-white/[0.04]">
                              <a
                                href={item.path}
                                tabIndex={dropOpen ? 0 : -1}
                                onClick={closeAllDesktop}
                                className={`gk-sans flex-1 py-2.5 pl-5 pr-2 text-[12px] font-medium uppercase tracking-[0.1em] transition-colors duration-200 ${
                                  parentActive || subOpen
                                    ? "text-[#E08A4F]"
                                    : "text-neutral-300 hover:text-white"
                                }`}
                              >
                                {item.label}
                              </a>

                              <button
                                type="button"
                                onClick={() => setSubOpen((value) => !value)}
                                tabIndex={dropOpen ? 0 : -1}
                                aria-label={`${item.label} submenu`}
                                aria-expanded={subOpen}
                                aria-controls="gk-accessories-menu"
                                className="flex w-11 shrink-0 items-center justify-center text-neutral-500 transition-colors duration-200 hover:text-white"
                              >
                                <Chevron open={subOpen} />
                              </button>
                            </div>

                            {/* smooth height animation (0fr -> 1fr) */}
                            <div
                              id="gk-accessories-menu"
                              className="grid transition-[grid-template-rows] duration-300 ease-out"
                              style={{
                                gridTemplateRows: subOpen ? "1fr" : "0fr",
                              }}
                            >
                              <div
                                className="overflow-hidden"
                                style={{
                                  visibility: subOpen ? "visible" : "hidden",
                                  transition: `visibility 0s linear ${
                                    subOpen ? "0ms" : "300ms"
                                  }`,
                                }}
                              >
                                <ul className="bg-white/[0.02]">
                                  {item.children.map((child) => (
                                    <li key={child.path}>
                                      <a
                                        href={child.path}
                                        tabIndex={subOpen ? 0 : -1}
                                        onClick={closeAllDesktop}
                                        className={`gk-sans block py-2.5 pl-8 pr-5 text-[11.5px] font-medium uppercase tracking-[0.08em] transition-colors duration-200 hover:bg-white/[0.04] ${
                                          isActive(child.path)
                                            ? "text-[#E08A4F]"
                                            : "text-neutral-400 hover:text-white"
                                        }`}
                                      >
                                        {child.label}
                                      </a>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          </li>
                        );
                      }

                      /* ----- normal item ----- */
                      return (
                        <li key={item.path}>
                          <a
                            href={item.path}
                            tabIndex={dropOpen ? 0 : -1}
                            onClick={closeAllDesktop}
                            aria-current={isActive(item.path) ? "page" : undefined}
                            className={rowClass(isActive(item.path))}
                          >
                            {item.label}
                          </a>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            </li>

            <li>
              <a
                href={ABOUT.path}
                aria-current={isActive(ABOUT.path) ? "page" : undefined}
                className={desktopLinkClass(isActive(ABOUT.path))}
              >
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

          {/* MOBILE HAMBURGER */}
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

          {/* SCROLLABLE NAV ITEMS */}
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

                  /* ----- accordion item (Explore) ----- */
                  if (item.items) {
                    return (
                      <li key="dropdown" className="border-b border-white/10">
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
                            {item.items.map((sub) => {
                              /* ----- Accessories: link + chevron toggle ----- */
                              if (sub.children) {
                                const parentActive =
                                  isActive(sub.path) ||
                                  sub.children.some((child) =>
                                    isActive(child.path)
                                  );

                                return (
                                  <li key={sub.path}>
                                    <div className="flex items-center justify-between">
                                      <a
                                        href={sub.path}
                                        onClick={() => setOpen(false)}
                                        className={`gk-sans flex-1 py-3 text-[14px] font-medium uppercase tracking-[0.08em] sm:text-[15px] ${
                                          parentActive || mobileSubOpen
                                            ? "text-[#E08A4F]"
                                            : "text-neutral-300"
                                        }`}
                                      >
                                        {sub.label}
                                      </a>

                                      <button
                                        type="button"
                                        onClick={() =>
                                          setMobileSubOpen((value) => !value)
                                        }
                                        aria-label={`${sub.label} submenu`}
                                        aria-expanded={mobileSubOpen}
                                        aria-controls="gk-mobile-accessories"
                                        className="flex h-10 w-10 shrink-0 items-center justify-center text-white/60"
                                      >
                                        <Chevron
                                          open={mobileSubOpen}
                                          className="h-3.5 w-3.5"
                                        />
                                      </button>
                                    </div>

                                    {mobileSubOpen && (
                                      <ul
                                        id="gk-mobile-accessories"
                                        className="mb-2 ml-1 border-l border-white/10 pl-4"
                                      >
                                        {sub.children.map((child) => (
                                          <li key={child.path}>
                                            <a
                                              href={child.path}
                                              onClick={() => setOpen(false)}
                                              className={`gk-sans block py-2.5 text-[13px] font-medium uppercase tracking-[0.08em] sm:text-[14px] ${
                                                isActive(child.path)
                                                  ? "text-[#E08A4F]"
                                                  : "text-neutral-400"
                                              }`}
                                            >
                                              {child.label}
                                            </a>
                                          </li>
                                        ))}
                                      </ul>
                                    )}
                                  </li>
                                );
                              }

                              /* ----- normal sub item ----- */
                              return (
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
                              );
                            })}
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

          {/* PINNED FOOTER */}
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
          FONTS + THEME
      ====================================================== */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap');

        .gk-serif,
        .gk-sans {
          font-family: 'Montserrat', system-ui, -apple-system, 'Segoe UI', sans-serif;
        }

        .gk-menu-wrap {
          --bar-h: 76px;
        }

        @media (min-width: 640px) {
          .gk-menu-wrap {
            --bar-h: 92px;
          }
        }

        .gk-menu {
          background: #0A0A0A;
        }

        .gk-scroll {
          scrollbar-width: none;
        }

        .gk-scroll::-webkit-scrollbar {
          display: none;
        }

        header a:focus-visible,
        header button:focus-visible,
        .gk-menu a:focus-visible,
        .gk-menu button:focus-visible {
          outline: 2px solid ${ACCENT_LIGHT};
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