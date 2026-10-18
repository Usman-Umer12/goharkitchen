import React, { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  MessageCircle,
  Ruler,
  Hammer,
  ShieldCheck,
  Gem,
  BadgeCheck,
  Clock,
  ChevronDown,
} from "lucide-react";
import { Link } from "react-router-dom";

/* =========================================================
   IMAGES  (adjust the path if your file lives somewhere else)
   Current assumption: src/components/HomeSections.jsx
   and images in src/assets/
========================================================= */

import mob1 from "../assets/mob1.webp"; // bedroom walls
import mob2 from "../assets/mob2.webp"; // kitchen
import mob3 from "../assets/mob3.webp"; // wardrobe
import mob4 from "../assets/mob4.webp"; // media walls

import des1 from "../assets/des1.webp"; // bedroom walls
import des2 from "../assets/des2.webp"; // kitchen
import des3 from "../assets/des3.webp"; // wardrobe
import des4 from "../assets/des4.webp"; // media walls

/* =========================================================
   STICKY PANEL DATA
   align: "center" | "left" | "right"  (applies on tablet/desktop)
========================================================= */

const panels = [
  {
    label: "Bedroom Walls",
    title: "Bedrooms That Feel",
    accent: "Like a Retreat.",
    text: "Feature walls and beds designed with warm textures, balanced proportions and a calm, considered finish.",
    link: "/bedroom-walls",
    cta: "Explore Bedroom Walls",
    align: "center",
    mobile: mob1,
    desktop: des1,
    alt: "Luxury bedroom wall and bed design by Gohar Kitchen Interior in Faisalabad",
  },
  {
    label: "Bespoke Kitchens",
    title: "Kitchens Designed",
    accent: "Around Your Life.",
    text: "Practical layouts, premium materials and refined craftsmanship, planned around the way you cook and live.",
    link: "/kitchen",
    cta: "Explore Kitchens",
    align: "left",
    mobile: mob2,
    desktop: des2,
    alt: "Custom bespoke kitchen design by Gohar Kitchen Interior in Faisalabad",
  },
  {
    label: "Custom Wardrobes",
    title: "Wardrobes With Every",
    accent: "Detail Considered.",
    text: "Made-to-measure storage with elegant finishes, smart internal planning and quality hardware.",
    link: "/wardrobe",
    cta: "Explore Wardrobes",
    align: "right",
    mobile: mob3,
    desktop: des3,
    alt: "Custom made-to-measure wardrobe by Gohar Kitchen Interior in Faisalabad",
  },
  {
    label: "Media Walls",
    title: "Media Walls With",
    accent: "Quiet Presence.",
    text: "Contemporary feature walls and TV units that bring storage, texture and visual harmony to your living space.",
    link: "/media-walls",
    cta: "Explore Media Walls",
    align: "center",
    mobile: mob4,
    desktop: des4,
    alt: "Modern media wall and TV unit design by Gohar Kitchen Interior in Faisalabad",
  },
];

const ALIGN = {
  center: {
    wrap: "md:justify-center",
    text: "md:items-center md:text-center",
    overlay: "bg-black/45",
  },
  left: {
    wrap: "md:justify-start",
    text: "md:items-start md:text-left",
    overlay: "bg-gradient-to-r from-black/80 via-black/40 to-transparent",
  },
  right: {
    wrap: "md:justify-end",
    text: "md:items-start md:text-left",
    overlay: "bg-gradient-to-l from-black/80 via-black/40 to-transparent",
  },
};

/* =========================================================
   WHY GOHAR / PROCESS / FAQ DATA
========================================================= */

const highlights = [
  {
    icon: Gem,
    title: "Premium Materials",
    text: "Carefully selected materials, elegant finishes and reliable fittings for lasting quality.",
  },
  {
    icon: Ruler,
    title: "Made to Measure",
    text: "Custom kitchens, wardrobes and interiors designed around your space and lifestyle.",
  },
  {
    icon: Clock,
    title: "Project Coordination",
    text: "A clear process from the initial consultation through production and installation.",
  },
  {
    icon: BadgeCheck,
    title: "Attention to Detail",
    text: "Thoughtful design, precise measurements and careful finishing at every stage.",
  },
];

const steps = [
  {
    no: "01",
    icon: MessageCircle,
    title: "Consultation",
    text: "We discuss your ideas, requirements, space and budget to understand your vision.",
  },
  {
    no: "02",
    icon: Ruler,
    title: "2D / 3D Design",
    text: "We develop layouts and visual concepts so you can understand your design before production.",
  },
  {
    no: "03",
    icon: Hammer,
    title: "Crafting",
    text: "Your approved design moves into production, with attention to materials and finishing.",
  },
  {
    no: "04",
    icon: ShieldCheck,
    title: "Installation",
    text: "Our team coordinates installation and reviews the finished work with you.",
  },
];

const faqs = [
  {
    question: "What interior services does Gohar offer?",
    answer:
      "Gohar offers interior solutions including custom kitchens, wardrobes, beds, media walls and other selected interior products. Contact us to discuss your specific requirements.",
  },
  {
    question: "Can I get a custom design for my space?",
    answer:
      "Yes. Designs can be planned around your available space, preferred style, storage needs and project requirements. 2D / 3D design options can help you visualise the concept before production.",
  },
  {
    question: "How much does a custom kitchen or wardrobe cost?",
    answer:
      "Pricing depends on dimensions, materials, finishes, hardware and design complexity. Share your measurements or project details with us to discuss a suitable estimate.",
  },
  {
    question: "Do you provide 2D and 3D designs?",
    answer:
      "Yes, 2D / 3D design can be discussed during your consultation. The design scope and any applicable charges can be confirmed before work begins.",
  },
  {
    question: "How long does a project take to complete?",
    answer:
      "The timeline depends on project size, design approval, material availability and installation requirements. We can discuss an estimated schedule once we understand your project.",
  },
  {
    question: "How can I start my interior project with Gohar?",
    answer:
      "Contact us through WhatsApp or the contact page. Tell us your project type, city, approximate dimensions and preferred design, and our team can discuss the next steps with you.",
  },
];

/* =========================================================
   REVEAL HOOK
========================================================= */

const useReveal = (threshold = 0.1) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(element);
        }
      },
      { threshold }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [threshold]);

  return [ref, visible];
};

const Reveal = ({ children, delay = 0, className = "" }) => {
  const [ref, visible] = useReveal(0.08);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-[opacity,transform] duration-700 ease-out motion-reduce:transition-none ${
        visible ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"
      } ${className}`}
    >
      {children}
    </div>
  );
};

const Eyebrow = ({ children, center = false }) => (
  <div className={`mb-4 flex items-center gap-3 ${center ? "justify-center" : ""}`}>
    <span className="h-px w-8 shrink-0 bg-[#C0652B]" />
    <span className="gk-eyebrow">{children}</span>
  </div>
);

/* =========================================================
   SECTION 1 — STICKY FULL-SCREEN IMAGE PANELS
========================================================= */

const StickyPanel = ({ item, index, total }) => {
  const [ref, active] = useReveal(0.35);
  const align = ALIGN[item.align];
  const num = String(index + 1).padStart(2, "0");
  const totalLabel = String(total).padStart(2, "0");

  const fade = (delay) => ({
    transitionDelay: `${delay}ms`,
  });

  const fadeClass = `transition-[opacity,transform] duration-[900ms] ease-out motion-reduce:transition-none ${
    active ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
  }`;

  return (
    <article
      ref={ref}
      aria-label={item.label}
      className="sticky top-0 h-screen h-[100svh] w-full overflow-hidden bg-black"
    >
      {/* Responsive image */}
      <picture>
        <source media="(min-width: 768px)" srcSet={item.desktop} />
        <img
          src={item.mobile}
          alt={item.alt}
          loading={index === 0 ? "eager" : "lazy"}
          decoding="async"
          draggable="false"
          className={`absolute inset-0 h-full w-full object-cover transition-transform duration-[2400ms] ease-out motion-reduce:transition-none ${
            active ? "scale-100" : "scale-[1.08]"
          }`}
        />
      </picture>

      {/* Overlays */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/25 md:hidden"
      />
      <div
        aria-hidden="true"
        className={`absolute inset-0 hidden md:block ${align.overlay}`}
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/50 to-transparent"
      />

      {/* Top bar: counter + label */}
      <div className="absolute inset-x-0 top-0 z-10">
        <div className="mx-auto flex w-full max-w-[1440px] items-center justify-between px-5 pt-6 sm:px-8 sm:pt-8 lg:px-14 xl:px-20">
          <span className="gk-counter">
            {num}
            <span className="mx-2 inline-block h-px w-6 bg-white/40 align-middle" />
            {totalLabel}
          </span>
          <span className="gk-counter hidden sm:inline">{item.label}</span>
        </div>
      </div>

      {/* Content */}
      <div
        className={`relative z-10 mx-auto flex h-full w-full max-w-[1440px] items-end px-5 pb-20 sm:px-8 sm:pb-24 md:items-center md:pb-0 lg:px-14 xl:px-20 ${align.wrap}`}
      >
        <div className={`flex max-w-[620px] flex-col items-start text-left ${align.text}`}>
          <div className={fadeClass} style={fade(150)}>
            <Eyebrow center={item.align === "center"}>{item.label}</Eyebrow>
          </div>

          <h2 className={`gk-h2 ${fadeClass}`} style={fade(300)}>
            {item.title}
            <br />
            <em>{item.accent}</em>
          </h2>

          <p
            className={`gk-body mt-5 max-w-[480px] ${fadeClass}`}
            style={fade(450)}
          >
            {item.text}
          </p>

          <div className={`mt-8 ${fadeClass}`} style={fade(600)}>
            <Link to={item.link} className="gk-btn-solid group">
              {item.cta}
              <ArrowRight
                size={16}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
          </div>
        </div>
      </div>

      {/* Scroll hint on first panel */}
      {index === 0 && (
        <div
          aria-hidden="true"
          className="absolute bottom-6 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 md:flex"
        >
          <span className="gk-counter">Scroll</span>
          <span className="gk-scroll-line" />
        </div>
      )}
    </article>
  );
};

const StickyShowcase = () => (
  <section id="collections" aria-label="Our collections" className="relative w-full bg-black">
    {panels.map((item, index) => (
      <StickyPanel
        key={item.label}
        item={item}
        index={index}
        total={panels.length}
      />
    ))}
  </section>
);

/* =========================================================
   SECTION 2 — WHY GOHAR
========================================================= */

const WhyGohar = () => (
  <section
    id="why-gohar"
    className="gk-section relative z-20 w-full bg-[#0A0A0A] text-white"
  >
    <div className="mx-auto w-full max-w-[1440px] px-5 py-16 sm:px-8 sm:py-20 lg:px-14 lg:py-24 xl:px-20">
      <Reveal>
        <div className="grid gap-8 border-b border-white/10 pb-10 md:grid-cols-[1.1fr_0.9fr] md:items-end lg:gap-16 lg:pb-14">
          <div>
            <Eyebrow>Why Gohar</Eyebrow>
            <h2 className="gk-h2 max-w-[680px]">
              Thoughtful Design.
              <br />
              <em>Exceptional Living.</em>
            </h2>
          </div>
          <p className="gk-body max-w-[480px] md:justify-self-end">
            We bring design, material selection and craftsmanship together to
            create interiors tailored to your space, needs and personal style.
          </p>
        </div>
      </Reveal>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {highlights.map((item, index) => {
          const Icon = item.icon;
          return (
            <Reveal
              key={item.title}
              delay={index * 100}
              className="border-b border-white/10 py-8 sm:px-6 lg:border-b-0 lg:border-r lg:px-7 lg:py-10 lg:last:border-r-0 lg:first:pl-0"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[#C0652B]/30 bg-[#C0652B]/10">
                <Icon size={20} strokeWidth={1.5} className="text-[#E08A4F]" />
              </div>
              <h3 className="gk-h3 mt-5">{item.title}</h3>
              <p className="gk-body mt-3 max-w-[290px] !text-[14px]">
                {item.text}
              </p>
            </Reveal>
          );
        })}
      </div>
    </div>
  </section>
);

/* =========================================================
   SECTION 3 — HOW WE WORK
========================================================= */

const HowWeWork = () => (
  <section
    id="our-process"
    className="gk-section relative z-20 w-full bg-[#0F0E0D] text-white"
  >
    <div className="mx-auto w-full max-w-[1440px] px-5 py-16 sm:px-8 sm:py-20 lg:px-14 lg:py-24 xl:px-20">
      <Reveal>
        <div className="mb-12 grid gap-6 md:grid-cols-[1.1fr_0.9fr] md:items-end lg:mb-16">
          <div>
            <Eyebrow>How We Work</Eyebrow>
            <h2 className="gk-h2 max-w-[650px]">
              From First Idea To
              <br />
              <em>Finished Space.</em>
            </h2>
          </div>
          <p className="gk-body max-w-[480px] md:justify-self-end">
            A considered process that keeps your project organised, from
            understanding your requirements to completing the final installation.
          </p>
        </div>
      </Reveal>

      <ol className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
        {steps.map((step, index) => {
          const Icon = step.icon;
          return (
            <li key={step.no} className="min-w-0">
              <Reveal delay={index * 120} className="border-t border-white/15 pt-6">
                <div className="flex items-center justify-between">
                  <span className="gk-step-no">{step.no}</span>
                  <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[#C0652B]/50 text-[#E08A4F]">
                    <Icon size={19} strokeWidth={1.5} />
                  </div>
                </div>
                <h3 className="gk-h3 mt-6">{step.title}</h3>
                <p className="gk-body mt-3 max-w-[320px] !text-[14px]">
                  {step.text}
                </p>
              </Reveal>
            </li>
          );
        })}
      </ol>
    </div>
  </section>
);

/* =========================================================
   SECTION 4 — FAQ
========================================================= */

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(0);

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };

  return (
    <section
      id="faqs"
      className="gk-section relative z-20 w-full bg-[#0A0A0A] text-white"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="mx-auto w-full max-w-[1440px] px-5 py-16 sm:px-8 sm:py-20 lg:px-14 lg:py-24 xl:px-20">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <Reveal>
            <div className="lg:sticky lg:top-28 lg:self-start">
              <Eyebrow>FAQs</Eyebrow>
              <h2 className="gk-h2 max-w-[540px]">
                A Few Things
                <br />
                <em>You May Wonder.</em>
              </h2>
              <p className="gk-body mt-5 max-w-[420px]">
                Find answers to common questions about our interior services,
                design options, pricing and project process.
              </p>
            </div>
          </Reveal>

          <div className="min-w-0 border-t border-white/10">
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index;
              const answerId = `gohar-faq-answer-${index}`;

              return (
                <Reveal key={faq.question} delay={index * 60}>
                  <div className="border-b border-white/10">
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={answerId}
                      onClick={() => setOpenIndex(isOpen ? -1 : index)}
                      className="group flex w-full items-center justify-between gap-5 py-5 text-left sm:py-6"
                    >
                      <span
                        className={`gk-faq-question transition-colors duration-300 ${
                          isOpen
                            ? "text-[#E08A4F]"
                            : "text-white group-hover:text-[#E08A4F]"
                        }`}
                      >
                        <span className="mr-3 text-xs font-normal tracking-widest text-[#C0652B]">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        {faq.question}
                      </span>

                      <span
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-all duration-300 ${
                          isOpen
                            ? "rotate-180 border-[#C0652B] bg-[#C0652B] text-white"
                            : "border-white/20 text-white/70 group-hover:border-[#C0652B]"
                        }`}
                      >
                        <ChevronDown size={16} />
                      </span>
                    </button>

                    <div id={answerId} hidden={!isOpen} className="pb-6 sm:pl-9">
                      <p className="gk-body max-w-[620px] !text-[14px] sm:!text-[15px]">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

/* =========================================================
   SECTION 5 — FINAL CTA
========================================================= */

const FinalCTA = () => (
  <section className="gk-section relative z-20 w-full border-t border-white/10 bg-[#0F0E0D] text-white">
    <div className="mx-auto w-full max-w-[1100px] px-5 py-16 text-center sm:px-8 sm:py-20 lg:py-24">
      <Reveal>
        <Eyebrow center>Start Your Project</Eyebrow>
        <h2 className="gk-h2 mx-auto max-w-[760px]">
          Let&apos;s Talk About <em>Your Space.</em>
        </h2>
        <p className="gk-body mx-auto mt-5 max-w-[520px]">
          Share your ideas and get a consultation and a custom quote for your
          interior.
        </p>

        <div className="mt-9 flex flex-col items-stretch justify-center gap-4 sm:flex-row sm:items-center">
          <Link to="/contact" className="gk-btn-solid group">
            Get a Quote
            <ArrowRight
              size={16}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>
          <a
            href="https://wa.me/923007023202"
            target="_blank"
            rel="noopener noreferrer"
            className="gk-btn-ghost"
          >
            <MessageCircle size={16} />
            WhatsApp Us
          </a>
        </div>
      </Reveal>
    </div>
  </section>
);

/* =========================================================
   GLOBAL STYLES
========================================================= */

const Styles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;1,500;1,600&family=Jost:wght@300;400;500;600&display=swap');

    :root {
      --gk-display: 'Cormorant Garamond', Georgia, 'Times New Roman', serif;
      --gk-sans: 'Jost', system-ui, -apple-system, 'Segoe UI', sans-serif;
      --gk-accent: #C0652B;
      --gk-accent-soft: #E08A4F;
    }

    .gk-section,
    #collections {
      font-family: var(--gk-sans);
    }

    .gk-eyebrow {
      font-family: var(--gk-sans);
      font-size: 11px;
      font-weight: 500;
      letter-spacing: 0.24em;
      line-height: 1.6;
      text-transform: uppercase;
      color: var(--gk-accent-soft);
    }

    .gk-counter {
      font-family: var(--gk-sans);
      font-size: 11px;
      font-weight: 500;
      letter-spacing: 0.26em;
      text-transform: uppercase;
      color: rgba(255,255,255,0.8);
    }

    .gk-h2 {
      font-family: var(--gk-display);
      font-weight: 500;
      color: #fff;
      line-height: 1.06;
      letter-spacing: -0.015em;
      font-size: clamp(2.3rem, 1.5rem + 3.2vw, 4.4rem);
      text-shadow: 0 2px 24px rgba(0,0,0,0.25);
    }

    .gk-section .gk-h2 {
      font-size: clamp(2.15rem, 1.5rem + 2.5vw, 3.7rem);
      text-shadow: none;
    }

    .gk-h2 em {
      font-style: italic;
      color: var(--gk-accent-soft);
    }

    .gk-h3 {
      font-family: var(--gk-display);
      font-weight: 600;
      color: #fff;
      line-height: 1.15;
      font-size: clamp(1.4rem, 1.2rem + 0.7vw, 1.8rem);
    }

    .gk-body {
      font-family: var(--gk-sans);
      font-weight: 300;
      color: rgba(255,255,255,0.78);
      line-height: 1.8;
      font-size: 15px;
    }

    .gk-section .gk-body {
      color: rgba(255,255,255,0.67);
    }

    .gk-step-no {
      font-family: var(--gk-display);
      font-size: 2.4rem;
      font-weight: 500;
      line-height: 1;
      color: rgba(255,255,255,0.18);
    }

    .gk-faq-question {
      display: block;
      font-family: var(--gk-display);
      font-size: clamp(1.18rem, 1rem + 0.6vw, 1.5rem);
      font-weight: 600;
      line-height: 1.45;
    }

    .gk-btn-solid,
    .gk-btn-ghost {
      display: inline-flex;
      min-height: 48px;
      align-items: center;
      justify-content: center;
      gap: 12px;
      padding: 0 28px;
      border-radius: 999px;
      font-family: var(--gk-sans);
      font-size: 11px;
      font-weight: 500;
      letter-spacing: 0.12em;
      text-align: center;
      text-transform: uppercase;
      transition: background-color 250ms ease, border-color 250ms ease, color 250ms ease;
    }

    .gk-btn-solid {
      border: 1px solid var(--gk-accent);
      background: var(--gk-accent);
      color: #fff;
    }

    .gk-btn-solid:hover {
      border-color: #D2743A;
      background: #D2743A;
    }

    .gk-btn-ghost {
      border: 1px solid rgba(255,255,255,0.3);
      color: #fff;
    }

    .gk-btn-ghost:hover {
      border-color: var(--gk-accent-soft);
      color: var(--gk-accent-soft);
    }

    .gk-btn-solid:focus-visible,
    .gk-btn-ghost:focus-visible,
    .gk-faq-question:focus-visible {
      outline: 2px solid var(--gk-accent-soft);
      outline-offset: 4px;
    }

    .gk-scroll-line {
      display: block;
      width: 1px;
      height: 44px;
      background: linear-gradient(to bottom, rgba(255,255,255,0.8), transparent);
      animation: gk-scroll 2s ease-in-out infinite;
      transform-origin: top;
    }

    @keyframes gk-scroll {
      0%   { transform: scaleY(0); opacity: 1; }
      60%  { transform: scaleY(1); opacity: 1; }
      100% { transform: scaleY(1); opacity: 0; }
    }

    @media (min-width: 1024px) {
      .gk-body { font-size: 16px; }
    }

    @media (max-width: 639px) {
      .gk-btn-solid,
      .gk-btn-ghost {
        min-height: 46px;
        padding: 0 22px;
        font-size: 10px;
      }
      .gk-eyebrow { font-size: 10px; letter-spacing: 0.2em; }
    }

    @media (prefers-reduced-motion: reduce) {
      .gk-scroll-line { animation: none; }
    }
  `}</style>
);

/* =========================================================
   EXPORT
========================================================= */

const HomeSections = () => (
  <>
    <Styles />
    <StickyShowcase />
    <WhyGohar />
    <HowWeWork />
    <FAQSection />
    <FinalCTA />
  </>
);

export default HomeSections;