import React, { useEffect, useRef, useState } from "react";
import { ArrowRight, ArrowUpRight } from "lucide-react";

import des1 from "../assets/des1.webp";
import des2 from "../assets/des2.webp";
import des3 from "../assets/des3.webp";
import des4 from "../assets/des4.webp";

/* =========================================================
   CONTACT
========================================================= */
const WHATSAPP_NUMBER = "923007023202";

const WHATSAPP_TEXT =
  "Assalam-o-Alaikum Gohar Kitchen Interior Team! I visited your website and would like to discuss a custom kitchen, wardrobe, bed or media wall project. Please share your available designs, material options and pricing. Thank you.";

const SLIDE_MS = 6500;

/* =========================================================
   SLIDER DATA
========================================================= */
const slides = [
  {
    image: des2,
    category: "Bespoke Kitchens",
    title: (
      <>
        Kitchens Designed
        <br />
        Around Your Lifestyle
      </>
    ),
    description:
      "Transform your kitchen with thoughtfully planned layouts, premium materials and refined craftsmanship. Every detail is tailored to your home, your needs and your lifestyle.",
    url: "/kitchen",
  },
  {
    image: des3,
    category: "Custom Wardrobes",
    title: (
      <>
        Beautiful Storage.
        <br />
        Thoughtfully Designed.
      </>
    ),
    description:
      "Discover made-to-measure wardrobes that combine intelligent storage, elegant finishes and practical details to bring lasting style to your everyday routine.",
    url: "/wordrobe",
  },
  {
    image: des1,
    category: "Luxury Beds",
    title: (
      <>
        Comfort Meets
        <br />
        Timeless Elegance.
      </>
    ),
    description:
      "Create a more inviting bedroom with beautifully designed beds and statement headboards, crafted to balance everyday comfort with sophisticated style.",
    url: "/bedroom-walls",
  },
  {
    image: des4,
    category: "Media Walls",
    title: (
      <>
        Make Every Wall
        <br />
        A Statement.
      </>
    ),
    description:
      "Bring your living space together with bespoke media walls featuring integrated storage, refined textures and carefully considered contemporary detailing.",
    url: "/media-walls",
  },
];

/* =========================================================
   MARQUEE DATA
========================================================= */
const marqueeItems = [
  "Bespoke Kitchens",
  "Custom Wardrobes",
  "Luxury Beds",
  "Media Walls",
  "Premium Finishes",
  "Made to Measure",
];

/* =========================================================
   COLLECTION DATA
========================================================= */
const collections = [
  {
    title: "Bespoke Kitchens",
    text: "Custom kitchen solutions featuring practical layouts, quality materials and beautifully considered finishes.",
    image: des2,
    url: "/kitchen",
    tag: "01",
  },
  {
    title: "Custom Wardrobes",
    text: "Personalised wardrobe designs with considered storage, elegant finishes and functional detailing.",
    image: des3,
    url: "/wardrobe",
    tag: "02",
  },
  {
    title: "Luxury Beds",
    text: "Distinctive wooden and upholstered beds designed to bring comfort, character and balance to your bedroom.",
    image: des1,
    url: "/bedroom-walls",
    tag: "03",
  },
  {
    title: "Media Walls",
    text: "Contemporary feature walls and TV units that bring storage, texture and visual harmony into your living space.",
    image: des4,
    url: "/media-walls",
    tag: "04",
  },
];

/* =========================================================
   REVEAL ANIMATION
========================================================= */
const useReveal = () => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;

    if (!element) return;

    if (typeof window !== "undefined" && !("IntersectionObserver" in window)) {
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
      className={`transition-[opacity,transform] duration-700 ease-out ${
        visible ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"
      } ${className}`}
    >
      {children}
    </div>
  );
};

/* =========================================================
   SECTION COMPONENTS
========================================================= */
const Eyebrow = ({ children }) => (
  <div className="mb-4 flex items-center gap-3 sm:mb-5 sm:gap-4">
    <span className="h-px w-7 shrink-0 bg-[#C0652B] sm:w-10" />

    <span className="font-[Jost] text-[10px] font-medium uppercase tracking-[0.24em] text-[#E7A477] sm:text-[11px] sm:tracking-[0.3em]">
      {children}
    </span>
  </div>
);

/* Heading always stays on ONE line (size scales with the screen) */
const SectionTitle = ({ children }) => (
  <h2 className="whitespace-nowrap font-[Cormorant_Garamond] text-[clamp(1.15rem,5.6vw,3.25rem)] font-medium leading-[1.12] tracking-[-0.015em] text-white">
    {children}
  </h2>
);

const Diamond = () => (
  <span
    aria-hidden="true"
    className="block h-[7px] w-[7px] shrink-0 rotate-45 bg-[#C0652B]"
  />
);

/* =========================================================
   MAIN COMPONENT
========================================================= */
const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setCurrentSlide((previous) => (previous + 1) % slides.length);
    }, SLIDE_MS);

    return () => window.clearTimeout(timer);
  }, [currentSlide]);

  const slide = slides[currentSlide];

  return (
    <main className="gk-home min-h-screen overflow-x-clip bg-[#090909] font-[Jost] text-white antialiased">
      {/* =====================================================
          HERO SLIDER
      ====================================================== */}
      <section
        id="home"
        aria-label="Featured interior collections"
        className="relative isolate flex h-[75svh] min-h-[680px] max-h-[820px] w-full overflow-hidden bg-[#080808] max-sm:h-[88svh] max-sm:min-h-[660px] max-sm:max-h-[800px]"
      >
        {/* Slider images */}
        {slides.map((item, index) => (
          <div
            key={item.category}
            aria-hidden={currentSlide !== index}
            className={`absolute inset-0 transition-opacity duration-[1300ms] ease-in-out ${
              currentSlide === index ? "z-10 opacity-100" : "z-0 opacity-0"
            }`}
          >
            <img
              src={item.image}
              alt={item.category}
              fetchPriority={index === 0 ? "high" : "auto"}
              loading={index === 0 ? "eager" : "lazy"}
              className="h-full w-full object-cover object-center"
              style={{
                animation:
                  currentSlide === index
                    ? "gkSlowZoom 8s ease-out forwards"
                    : "none",
              }}
            />
          </div>
        ))}

        {/* Image contrast */}
        <div className="absolute inset-0 z-20 bg-black/20" />

        {/* Top overlay keeps the navbar/logo clearly visible */}
        <div className="absolute inset-x-0 top-0 z-20 h-[52%] bg-gradient-to-b from-black/85 via-black/45 to-transparent sm:h-[48%] sm:from-black/65 sm:via-black/25" />

        {/* Content contrast */}
        <div className="absolute inset-0 z-20 bg-gradient-to-t from-[#080808]/90 via-black/25 to-transparent sm:bg-gradient-to-r sm:from-black/75 sm:via-black/40 sm:to-black/5" />

        {/* Bottom transition */}
        <div className="absolute inset-x-0 bottom-0 z-20 h-32 bg-gradient-to-t from-[#090909] via-[#090909]/45 to-transparent" />

        {/* Hero content */}
        <div className="relative z-30 mx-auto flex h-full w-full max-w-[1440px] items-center px-5 pb-14 pt-24 sm:px-8 sm:pb-16 sm:pt-28 lg:px-12 xl:px-16">
          <div
            key={currentSlide}
            className="w-full max-w-[340px] sm:max-w-[600px] md:max-w-[700px] lg:max-w-[820px]"
            style={{ animation: "gkHeroContent 0.8s ease-out both" }}
          >
            <div className="mb-5 flex items-center gap-3 sm:mb-6 sm:gap-4">
              <span className="h-px w-8 shrink-0 bg-[#C0652B] sm:w-12" />

              <span className="text-[10px] font-medium uppercase leading-none tracking-[0.23em] text-[#F1B58A] sm:text-xs sm:tracking-[0.28em]">
                {slide.category}
              </span>
            </div>

            <h1 className="max-w-[820px] font-[Cormorant_Garamond] text-[clamp(39px,8.6vw,48px)] font-semibold leading-[1.04] tracking-[-0.025em] text-white [text-shadow:0_3px_25px_rgba(0,0,0,0.65)] sm:text-[58px] md:text-[68px] lg:text-[76px] xl:text-[84px]">
              {slide.title}
            </h1>

            <p className="mt-5 max-w-[340px] text-[13px] font-normal leading-[1.85] text-white/90 [text-shadow:0_2px_12px_rgba(0,0,0,0.8)] sm:mt-6 sm:max-w-[520px] sm:text-[15px] md:max-w-[590px] lg:text-[16px] lg:leading-[1.9]">
              {slide.description}
            </p>

            {/* CTA buttons: side by side on mobile (short labels),
                full labels from tablet upwards */}
            <div className="mt-7 flex w-full max-w-[340px] flex-row items-center gap-2.5 sm:mt-9 sm:max-w-none sm:gap-4">
              <a
                href={slide.url}
                className="group inline-flex min-h-[46px] flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-full border border-[#C0652B] bg-[#C0652B] px-3 py-3 text-center text-[10px] font-semibold uppercase tracking-[0.1em] text-white transition-colors duration-200 hover:border-[#D77B43] hover:bg-[#D77B43] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E7A477] focus-visible:ring-offset-2 focus-visible:ring-offset-black sm:min-h-[53px] sm:flex-none sm:gap-3 sm:px-8 sm:text-[11px] sm:tracking-[0.13em]"
              >
                <span className="sm:hidden">Explore</span>
                <span className="hidden sm:inline">Explore Collection</span>

                <ArrowRight
                  size={14}
                  className="shrink-0 transition-transform duration-200 group-hover:translate-x-1"
                />
              </a>

              <a
                href="/contact"
                className="group inline-flex min-h-[46px] flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-full border border-white/55 bg-black/40 px-3 py-3 text-center text-[10px] font-semibold uppercase tracking-[0.1em] text-white backdrop-blur-md transition-colors duration-200 hover:border-white hover:bg-white hover:text-[#111111] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:min-h-[53px] sm:flex-none sm:gap-3 sm:px-8 sm:text-[11px] sm:tracking-[0.13em]"
              >
                <span className="sm:hidden">Get Quote</span>
                <span className="hidden sm:inline">Discuss Your Project</span>

                <ArrowUpRight
                  size={14}
                  className="shrink-0 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </a>
            </div>
          </div>
        </div>

        {/* Slide indicators */}
        <div className="absolute bottom-7 left-5 z-40 flex items-center gap-2 sm:bottom-9 sm:left-8 lg:left-12 xl:left-16">
          {slides.map((item, index) => (
            <button
              key={item.category}
              type="button"
              onClick={() => setCurrentSlide(index)}
              aria-label={`Show ${item.category} slide`}
              aria-pressed={currentSlide === index}
              className="flex h-7 min-w-7 items-center justify-center px-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <span
                className={`relative block h-[2px] overflow-hidden rounded-full bg-white/40 transition-[width] duration-500 ${
                  currentSlide === index ? "w-10 sm:w-12" : "w-5 sm:w-6"
                }`}
              >
                {currentSlide === index && (
                  <span
                    key={currentSlide}
                    className="absolute inset-0 origin-left bg-[#D9824C]"
                    style={{
                      animation: `gkSlideProgress ${SLIDE_MS}ms linear forwards`,
                    }}
                  />
                )}
              </span>
            </button>
          ))}
        </div>

        {/* Slide count */}
        <div
          className="absolute bottom-8 right-5 z-40 flex items-center text-[10px] font-medium tracking-[0.18em] text-white/65 sm:bottom-9 sm:right-8 sm:text-[11px] lg:right-12 xl:right-16"
          aria-live="polite"
          aria-label={`Slide ${currentSlide + 1} of ${slides.length}`}
        >
          <span className="text-white">0{currentSlide + 1}</span>
          <span className="mx-2 text-white/35">/</span>
          <span>0{slides.length}</span>
        </div>
      </section>

      {/* =====================================================
          MARQUEE (solid, clear text)
      ====================================================== */}
      <section
        aria-label="Our interior services"
        className="relative overflow-hidden border-y border-white/10 bg-[#0B0A09]"
      >
        <div
          className="gk-marquee overflow-hidden py-5 sm:py-6"
          style={{
            WebkitMaskImage:
              "linear-gradient(to right, transparent 0%, #000 6%, #000 94%, transparent 100%)",
            maskImage:
              "linear-gradient(to right, transparent 0%, #000 6%, #000 94%, transparent 100%)",
          }}
        >
          <div
            className="gk-marquee-track flex w-max items-center"
            style={{ animation: "gkMarquee 45s linear infinite" }}
          >
            {[0, 1].map((group) => (
              <div
                key={group}
                aria-hidden={group === 1}
                className="flex shrink-0 items-center"
              >
                {marqueeItems.map((item) => (
                  <div
                    key={`${group}-${item}`}
                    className="flex items-center gap-6 pr-6 sm:gap-9 sm:pr-9 lg:gap-12 lg:pr-12"
                  >
                    <span className="whitespace-nowrap font-[Jost] text-[13px] font-medium uppercase tracking-[0.22em] text-white/90 sm:text-[14px] lg:text-[15px]">
                      {item}
                    </span>

                    <Diamond />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================
          COLLECTIONS
          desktop: 1 2 3 4   |   mobile / tablet: 1 2 / 3 4
      ====================================================== */}
      <section
        id="collections"
        className="bg-[#0E0D0C] py-14 sm:py-18 lg:py-24"
      >
        <div className="w-full px-4 sm:px-8 lg:px-10 xl:px-14 2xl:px-20">
          <Reveal>
            <div className="mb-8 sm:mb-10 lg:mb-12">
              <Eyebrow>Discover Our Collections</Eyebrow>

              <SectionTitle>
                Thoughtful Design.{" "}
                <span className="italic text-[#E2A078]">Beautiful Living.</span>
              </SectionTitle>

              <p className="mt-4 max-w-[560px] text-[13px] font-light leading-[1.85] text-white/65 sm:mt-5 sm:text-[15px]">
                From bespoke kitchens to beautifully finished bedroom
                furniture, explore interior solutions designed around your
                space, your preferences and the way you live.
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 lg:gap-5">
            {collections.map((collection, index) => (
              <Reveal key={collection.title} delay={index * 70}>
                <a
                  href={collection.url}
                  aria-label={`Explore ${collection.title}`}
                  className="group relative block h-[240px] overflow-hidden rounded-[4px] bg-[#181614] outline-none focus-visible:ring-2 focus-visible:ring-[#C0652B] focus-visible:ring-offset-4 focus-visible:ring-offset-[#0E0D0C] sm:h-[320px] lg:h-[clamp(400px,28vw,520px)]"
                >
                  <img
                    src={collection.image}
                    alt={collection.title}
                    loading="lazy"
                    className="h-full w-full object-cover object-center transition-transform duration-1000 ease-out motion-safe:group-hover:scale-[1.04]"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-black/5 transition-colors duration-500 group-hover:from-black/95" />

                  <div className="absolute left-3 top-3 font-[Cormorant_Garamond] text-[16px] italic text-white/85 sm:left-5 sm:top-5 sm:text-[19px]">
                    {collection.tag}
                  </div>

                  <div className="absolute inset-x-0 bottom-0 p-3 sm:p-5">
                    <h3 className="font-[Cormorant_Garamond] text-[17px] font-semibold leading-tight text-white sm:text-[24px] lg:text-[26px]">
                      {collection.title}
                    </h3>

                    <p className="mt-2 hidden text-[12.5px] font-light leading-[1.7] text-white/75 sm:line-clamp-3 sm:block">
                      {collection.text}
                    </p>

                    <div className="mt-3 inline-flex items-center gap-2 text-[9.5px] font-semibold uppercase tracking-[0.16em] text-white sm:mt-4 sm:gap-3 sm:text-[11px] sm:tracking-[0.19em]">
                      <span className="sm:hidden">Explore</span>
                      <span className="hidden sm:inline">Explore Collection</span>
                      <ArrowRight
                        size={14}
                        className="transition-transform duration-300 group-hover:translate-x-1"
                      />
                    </div>
                  </div>

                  <span className="absolute bottom-0 left-3 h-[2px] w-8 bg-[#C0652B] transition-all duration-500 group-hover:w-14 sm:left-5" />
                </a>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================
          WHATSAPP FLOATING BUTTON
      ====================================================== */}
      <a
        href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
          WHATSAPP_TEXT
        )}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with Gohar Kitchen Interior on WhatsApp"
        title="Chat with us on WhatsApp"
        className="fixed bottom-5 right-4 z-50 flex h-[52px] w-[52px] items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_5px_25px_rgba(0,0,0,0.4)] transition-colors duration-200 hover:bg-[#20BA5A] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#25D366]/40 active:scale-95 sm:bottom-6 sm:right-6 sm:h-[58px] sm:w-[58px] lg:bottom-7 lg:right-7 lg:h-[62px] lg:w-[62px]"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 32 32"
          fill="currentColor"
          className="h-7 w-7 sm:h-8 sm:w-8"
          aria-hidden="true"
        >
          <path d="M16.01 3C8.84 3 3.01 8.83 3.01 16c0 2.29.6 4.44 1.65 6.31L3 29l6.88-1.61A12.94 12.94 0 0 0 16.01 29C23.18 29 29 23.17 29 16S23.18 3 16.01 3Zm0 23.73c-2.01 0-3.88-.59-5.45-1.61l-.39-.24-4.08.96.97-3.98-.25-.41A10.7 10.7 0 0 1 5.28 16c0-5.92 4.81-10.73 10.73-10.73S26.74 10.08 26.74 16s-4.81 10.73-10.73 10.73Zm5.89-8.03c-.32-.16-1.89-.93-2.18-1.03-.29-.11-.5-.16-.71.16-.21.32-.82 1.03-1 1.24-.18.21-.37.24-.68.08-.32-.16-1.34-.49-2.55-1.57-.94-.84-1.58-1.87-1.76-2.18-.18-.32-.02-.49.14-.65.14-.14.32-.37.47-.55.16-.18.21-.32.32-.53.11-.21.05-.4-.03-.55-.08-.16-.71-1.71-.97-2.34-.26-.61-.52-.53-.71-.54h-.61c-.21 0-.55.08-.84.4-.29.32-1.1 1.08-1.1 2.63s1.13 3.05 1.29 3.26c.16.21 2.21 3.37 5.35 4.73.75.32 1.33.52 1.79.66.75.24 1.43.21 1.97.13.6-.09 1.89-.77 2.16-1.52.26-.76.26-1.4.18-1.52-.08-.13-.29-.21-.6-.37Z" />
        </svg>
      </a>

      {/* =====================================================
          FONTS & ANIMATIONS
      ====================================================== */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600&family=Jost:wght@300;400;500;600;700&display=swap');

        html {
          scroll-behavior: smooth;
        }

        @keyframes gkHeroContent {
          0% {
            opacity: 0;
            transform: translateY(16px);
          }

          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes gkSlowZoom {
          0% {
            transform: scale(1);
          }

          100% {
            transform: scale(1.075);
          }
        }

        @keyframes gkSlideProgress {
          0% {
            transform: scaleX(0);
          }

          100% {
            transform: scaleX(1);
          }
        }

        @keyframes gkMarquee {
          0% {
            transform: translateX(0);
          }

          100% {
            transform: translateX(-50%);
          }
        }

        .gk-marquee-track {
          will-change: transform;
        }

        .gk-marquee:hover .gk-marquee-track {
          animation-play-state: paused;
        }

        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            scroll-behavior: auto !important;
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }

          .gk-marquee-track {
            animation: none !important;
          }
        }
      `}</style>
    </main>
  );
};

export default Home;